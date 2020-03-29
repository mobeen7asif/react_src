<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 12:13 PM
 */

namespace App\UnifiedSchemaCall;


use App\ApiCalls\StarrtecPosApiCall;
use App\Facade\StarrtecLog;
use App\Hooks\OrderHook;
use App\Models\Venue;
use App\UnifiedDbModels\Customer;
use App\UnifiedDbModels\OptionSet;
use App\UnifiedDbModels\Order;
use App\UnifiedDbModels\OrderDetails;
use App\UnifiedDbModels\Product;
use App\UnifiedDbModels\Store;
use App\UnifiedDbModels\Variant;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StarrtecPosUnifiedSchema extends BasePosUnifiedSchemaCall
{

    private $apiCall;
    private $finalOrderData;
    private $transaction_id;

    /**
     * StarrtecPosUnifiedSchema constructor.
     */
    public function __construct()
    {
        $this->apiCall = new StarrtecPosApiCall();
    }//..... end of __construct() .....//

    /**
     * @param $params
     * @return string
     * Get Single Store Details.
     */
    public function getSingleStoreDetail( $params )
    {
        $store = $this->getSingleStoreFromUD( $params );

        if(!empty($store)){
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Received Single Store Detail");
            return $this->getResponse($store, 'Data Found', true);
		}else{
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Single Store Detail Not Found");
            return $this->getResponse($store, 'Data Not Found', false);
		}
    }//..... end of getSingleStoreDetail() ......//

    /**
     * @param array $params
     * @return string
     * Get List of Categories of a Specific Store.
     */
    public function getCategoriesList( $params = [] )
    {
        $categoriesList = $this->getCategoriesFromUD( $params );

        if(!empty($categoriesList)){
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Category Data Found, Category_count: ".count($categoriesList)."");
            return $this->getResponse($categoriesList, 'Data Found', true);
		}else{
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Category Data Not Found, Category_count: 0");
            return $this->getResponse($categoriesList, 'Data Not Found', false);
		}
    }//..... end of getCategoriesList() .....//

    /**
     * @return string
     * Get Specific Category's Products List.
     */
    public function getCategoryProducts( $params = [] )
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["product.store_id" => $business_id,"product.category_id"=> $category_id], "category_id"=> $category_id, "store_id"=> $business_id] );

        if(!empty($productsArray)){
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Product Against Category Are Found, Products_count: ".count($productsArray)."");
            return $this->getResponse($productsArray, 'Data Found', true);
		}else{
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Product Against Category Are Not Found, Products_count: 0");
            return $this->getResponse($productsArray, 'Data Not Found', false);
		}
    }//..... end of getCategoryProducts() ......//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse
     * Search Product in a specific store.
     */
    public function searchProducts( $params = [] )
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["store.store_id" => $store_id], "store_id"=> $store_id,"search"=> true,"searchKey"=> $searchKey] );

        if(!empty($productsArray)){
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: Products data found against search query, Products_count: ".count($productsArray)."");
            return $this->getResponse($productsArray, 'Data Found', true);
		}else{
			StarrtecLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: No Products data found against search query, Products_count: 0");
            return $this->getResponse($productsArray, 'Data Not Found', false);
		}
    }//..... end of searchProducts() ......//

    /**
     * Process Order.
     */
    public function payment_process( Request $request)
    {
        StarrtecLog::info("  ".basename(__FILE__)." Order Received from App and now placing.....");
        return $this->prepareOrderData($request);
    }//..... end of payment_process() .....//

    /**
     * @param $request
     * @return string
     * Prepare Order data for starrtec order api.
     */
    private function prepareOrderData($request)
    {
        StarrtecLog::info("  ".basename(__FILE__)." Preparing Order Data.");
        $order_items = stripcslashes($request->order_items);
        $order_items = json_decode($order_items);

        $productsArray = [];
        foreach ($order_items as $item){
            $optionsSet = [];

            $product = Product::where("product_id", $item->prd_id)->first();

            //.... check option sets.
            if($item->modifier_ids){
                $optionsets = explode(',',$item->modifier_ids);
                foreach ($optionsets as $optionset){
                    $opst = OptionSet::where("option_set_id", $optionset)->first();
                    if($opst){

                        $variants = [];
                        if($item->variant_ids){
                            $variantsIds = explode(",",$item->variant_ids);
                            foreach ($variantsIds as $vid){
                                Variant::where(['variant_id'=> $vid])->get()
                                    ->each(function($vrt)use(&$variants){
                                        $variants[] = (object)[
                                            "Id"        => $vrt->pos_variant_id,
                                            "Name"      => $vrt->variant_name,
                                            "UnitPrice" => $vrt->variant_price
                                        ];
                                    });
                            }//..... end of foreach() .....//
                        }//..... end if() ......//

                        $optionsSet[] = (object)[
                            "Id"        => $opst->pos_option_id,
                            "Name"      => $opst->option_set_name,
                            "Variants"  => $variants
                        ];
                    }//..... end of inner if-else() ......//
                }///..... end foreach() ......//
            }//..... end if() .....//

            $productsArray[] = (object)[
                "Id"            => $product->pos_product_id,
                "Name"          => $item->prd_name,
                "Description"   => $item->prd_desc,
                "UnitPrice"     => (float)$request->amount_due,
                "Quantity"      => $item->prd_qty,
                "Options"       => $optionsSet,
                "Promotions"    => []
            ];
        }//..... end of foreach() .....//
       
        return $this->saveOrderData($request,$order_items,$productsArray);
    }//..... end of populateOrderData() ......//

    /**
     * @param Request $request
     * @param $order_items
     * @param $productsArray
     * @return string
     * Save Order to Unified DB.
     */
    private function saveOrderData( Request $request, $order_items, $productsArray )
    {
        $store = Store::where("store_id",$request->business_id)->first();
        $venue_id = ($store) ? $store->venue_id : 0;
        $data2 = [
                    'customer_id'        => $request->customer_id,
                    'payment_method_id'  => $request->payment_by,
                    'order_status'       => 0,
                    'order_note'         => '',
                    'order_type'         => $request->ord_type,
                    'order_amount'       => $request->amount_due,
                    'venue_id'           => $venue_id,
                   // 'order_amount' => $request->order_real_amount,
                    'order_pin_location' => $request->order_pin_location,
                    'device_name'        => $request->device_name,
                    'device_model'       => $request->device_model,
                    'is_acknowledge'     =>	$request->is_acknowledge,
                    'pos_code'           => 2,
                    'tax_label'          => $request->vat_label,
                    'total_points'       => $request->redeem_points,
                    'points_amount'      => $request->pay_with_points,
                    'vat_amount'         => $request->vat_amount,
                    'transaction_id'     => "",
                    'country_id'         => $request->country_id,
                    'business_id'        => $request->business_id
        ];

        $order = Order::create($data2);
        StarrtecLog::info("  ".basename(__FILE__)." Data saved to Unified DB Order Table.");

        //now place order
        $status = $this->sendDataToApi($productsArray,$order->order_id, $request, $store);
        if($status['status']){
            foreach($order_items as $item){
                OrderDetails::insert([  'product_id' => $item->prd_id,        'order_id' =>  $order->order_id,
                                        'unit_price' => $item->prd_unitprice, 'quantity' =>  $item->prd_qty,
                                        'transaction_id' => $this->transaction_id,'created_at' => Carbon::now()
                                    ]);
            }//..... end foreach() ......//

            $order->transaction_id  = $this->transaction_id;
            $order->order_status    = 1;
            $order->save();

            StarrtecLog::info("  ".basename(__FILE__)." Order details saved successfully and In Order table transaction id (s) updated successfully.");
            //.... Call Order Placed Hook for starrtec pos.
            StarrtecLog::info("  ".basename(__FILE__)." Sending Data to Kafka.");
            (new OrderHook())->OrderPlacedAtStarrtec( [
                "date"              => Carbon::now()->format("Y-m-d H:i:s"),
                "location"          => $store->store_address,
                "amount"            => $request->amount_due,
                "user_id"           => $request->customer_id,
                'transaction_id'    => $this->transaction_id,
                "items"             => $order_items,
                "email"             => User::where("soldi_id", $request->customer_id)->value("user_email"),
                "venue_id"          => $venue_id
            ] );

            return $this->getResponse(["error_state"=> 0,"message"=> "", "order_id"=> $order->order_id,"order_str" =>[
                "order_id" => $order->order_id, "transaction_id" => $this->transaction_id, "ord_amount" => $request->amount_due,"ord_date" => strtotime(date("Y-m-d"))
            ]], 'Transaction Successful.', true);
        }else{
            $order->delete();
            return $this->getResponse("Starrtec POS Order API Error.".json_encode($status), 'Transaction Failed', false);
        }//..... end if-else() ......//
    }//..... end of saveOrderData() ......//

    /**
     * @param $productsArray
     * @param $order_id
     * @param $request
     * @return bool
     * Prepare data for api request and forward it to order api.
     */
    private function sendDataToApi($productsArray, $order_id, $request, $store)
    {
        StarrtecLog::info("  ".basename(__FILE__)." Preparing Order Data for Starrtec Order API.");
        $customer = Customer::where("soldi_id",$request->customer_id)->first();
        $body = [
            "OrderId" => $order_id,
            "Order" => [
                "OrderType" => 'pickup',//$request->ord_type,
                "User"      => [
                    "Id"    => $request->customer_id,
                    "Name"  => ($customer) ? $customer->user_first_name : "Test Name",
                    "Phone" => ($customer) ? $customer->user_mobile : "123456789",
                    "Email" => ($customer) ? $customer->user_email : "abc@example.com",
                    "Address"=>[]
                ],
                "Promotions"=>[],
                "Products"  => $productsArray,
                "Payments"  => [(object)[
                    "Name"  => $request->payment_by,
                    "Amount"=> (float)$request->amount_due,
                    "Ref"   => $request->ord_date
                ]]
            ]
        ];

        StarrtecLog::info("  ".basename(__FILE__)." Passing Data to Api Starrtec API Call for placing order online. StoreID:". $store->pos_store_id);

        $response = $this->apiCall->placeOrder($body, $store->pos_store_id);

        $response = (array)json_decode($response);

        //..... faking order response, because the starrtec's order api not working at this time.
        //  remove the  below code when starrtec api starts working.

        $this->finalOrderData = $body;
        $this->transaction_id = rand(11111,99999);
        StarrtecLog::info("  ".basename(__FILE__)." Order Placed Successfully at Starrtec Order API.");
        return ['status' => true,'msg' => 'success'];

        //...... end of faking,

        /*if(isset($response['OrderId'])){
            $this->finalOrderData = $body;
            $this->transaction_id = $response['OrderId'];
            StarrtecLog::info("  ".basename(__FILE__)." Order Placed Successfully at Starrtec Order API.");
            return ['status' => true,'msg' => 'success'];
        }else{
            StarrtecLog::info("  ".basename(__FILE__)." Order Failed.".json_encode($response));
            return ['status' => false,'msg'=> json_encode($response)];
        }//..... end of if-else.*/
    }//..... end of sendDataToApi() ......//

}//..... end of class.