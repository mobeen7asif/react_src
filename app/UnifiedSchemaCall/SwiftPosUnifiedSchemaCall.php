<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 8/29/2017
 * Time: 3:52 PM
 */

namespace App\UnifiedSchemaCall;


use App\ApiCalls\SwiftPosApiCall;
use App\Facade\SwiftLog;
use App\Hooks\OrderHook;
use App\UnifiedDbModels\Order;
use App\UnifiedDbModels\OrderDetails;
use App\UnifiedDbModels\Product;
use App\UnifiedDbModels\Store;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SwiftPosUnifiedSchemaCall extends BasePosUnifiedSchemaCall
{

    private $apiCall;
    private $store;
    private $user_swift_id;
    private $user;

    /**
     * SwiftPosUnifiedSchemaCall constructor.
     */
    public function __construct()
    {
        $this->apiCall = new SwiftPosApiCall();
    }//..... end of __construct() ......//

    /**
     * Get Single Store Details.
     */
    public function getSingleStoreDetail( $params )
    {
        $store = $this->getSingleStoreFromUD( $params );
        return (!empty($store)) ? $this->getResponse($store, 'Data Found', true) : $this->getResponse($store, 'Data Not Found', false);
    }//..... end of getSingleStoreDetail() .....//

    /**
     * @param $params
     * Get Categories List.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoriesList( $params )
    {
        $categoriesList = $this->getCategoriesFromUD( $params );
        return (!empty($categoriesList)) ? $this->getResponse($categoriesList, 'Data Found', true) : $this->getResponse($categoriesList, 'Data Not Found', false);
    }//..... end of getCategoriesList() .....//

    /**
     * @param $params
     * Get All products of a Category.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryProducts( $params )
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["product.store_id" => $business_id, "product.category_id"=> $category_id], "category_id"=> $category_id, "store_id"=> $business_id] );
        return (!empty($productsArray)) ? $this->getResponse($productsArray, 'Data Found', true) : $this->getResponse($productsArray, 'Data Not Found', false);
    }//..... end of getCategoryProducts() .....//

    /**
     * Search Product.
     */
    public function searchProducts( $params )
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["store.store_id" => $store_id], "store_id"=> $store_id, "search"=> true, "searchKey"=> $searchKey] );
        return (!empty($productsArray)) ? $this->getResponse($productsArray, 'Data Found', true) : $this->getResponse($productsArray, 'Data Not Found', false);
    }//..... end of searchProducts() .....//

    /**
     * @param Request $request
     * @return string
     * Place Order.
     */
    public function payment_process( Request $request )
    {
        //..... Get api key on the basis of store.
        $this->store = $this->getStore( $request->business_id );
        $this->apiCall->getAuthorizationKey($this->store->pos_store_id, $this->store->store_api_key, $this->store->store_api_secret);

        $swift_pos_id = $this->checkIfUserRegisteredAtSwiftPos( $request->customer_id );

        if($swift_pos_id){// user exist in udb or registered successfully.
            $this->user_swift_id = $swift_pos_id;
            return $this->ForwardOrderToApi( $this->populateOrderData( $request ), $request );
        }else{
            return $this->getResponse("Swift POS Member Registration API Error.", 'Member Registration Failed.', false);
        }//..... end if-else() .....//
    }//..... end of payment_process() .....//

    /**
     * @param $user_id
     * Check whether user registered at Swift POS or Not.
     * @return array|bool|mixed
     */
    private function checkIfUserRegisteredAtSwiftPos( $user_id )
    {
        $this->user = User::where("soldi_id", $user_id)->first();

        if($this->user->swift_pos_id)
            return $this->user->swift_pos_id;
        else
            return $this->apiCall->registerUserAtSwiftPos( $this->user );
    }//..... end of checkIfUserRegisteredAtSwiftPos() .....//

    /**
     * @param $store_id
     * @return \Illuminate\Database\Eloquent\Model|null|static
     * @internal param array $params Store is set manually in udb.* Store is set manually in udb.
     * store_api_key used as user_id,
     * store_api_secret used as password.
     */
    public function getStore( $store_id )
    {
        return Store::select(['store_id', 'pos_store_id', 'store_api_key', 'store_api_secret'])->where('store_id', $store_id )->first();
    }//..... end of getStore() .....//

    /**
     * Prepare and Populate data for Order.
     */
    private function populateOrderData( Request $request )
    {
        SwiftLog::info("  ".basename(__FILE__)." Preparing Order Data.");
        $items = json_decode($request->order_items);
        $utcDate = gmdate("Y-m-d\TH:i:s\Z");
        $itemArray = [];

        $orderData = [
            "Id"                    => 0,
            "Type"                  => 0,
            "OrderDate"             => $utcDate,
            "ScheduledOrderDate"    => $utcDate,
            "BookingName"           => $this->user->user_first_name,
            "Comments"              => "",
            "Member"                => [
                "Id"                => "{$this->user_swift_id}",
                "Type"              => 0
                                        ],
            "Items"                 => [],
            "Medias"                => [
                [
                    "Id"            => 1,
                    "Amount"        => (float)$request->amount_due,
                    "Name"          => $request->payment_by,
                ]
            ]
        ];

        foreach ( $items as $key => $item ):
            $product = Product::where("product_id", $item->prd_id)->first();
            $itemArray[] = [
                        "Id"            => $product->pos_product_id,
                        "Description"   => $item->prd_desc,
                        "Quantity"      => (int)$item->prd_qty,
                        "Price"         => (float)$item->prd_unitprice,
                        "Instructions"  => [new \stdClass()]
                ];
        endforeach;

        $orderData['Items'] = $itemArray;
        return $orderData;
    }//..... end of populateOrderData() .....//

    /**
     * @param $orderData
     * Forward Order Data to Api.
     * @return \Illuminate\Http\JsonResponse
     */
    private function ForwardOrderToApi( $orderData, Request $request )
    {
        $store = Store::where("store_id",$request->business_id)->first();
        $venue_id = ($store) ? $store->venue_id : 0;

        $savedOrder = $this->saveOrderAtUDB( $request, $venue_id );

        $orderData['Id'] = $savedOrder->id;

        $status = $this->apiCall->placeOrderAtSwift( $orderData );
        if($status):
            $items = json_decode($request->order_items);
            $this->saveOrderDetailsAtUDB( $items, $savedOrder );

            //.... Call Order Placed Hook for Swift POS.
            SwiftLog::info("  ".basename(__FILE__)." Sending Data to Kafka.");
            (new OrderHook())->OrderPlacedAtSwift( [
                "date"              => Carbon::now()->format("Y-m-d H:i:s"),
                "location"          => $store->store_address,
                "amount"            => $request->amount_due,
                "user_id"           => $request->customer_id,
                'transaction_id'    => $savedOrder->order_id,
                "items"             => $items,
                "email"             => User::where("soldi_id", $request->customer_id)->value("user_email"),
                "venue_id"          => $venue_id
            ] );

            return $this->getResponse(["error_state"=> 0,"message"=> "", "order_id"=> $savedOrder->order_id,"order_str" =>[
                "order_id" => $savedOrder->order_id, "transaction_id" => $savedOrder->order_id, "ord_amount" => $request->amount_due,"ord_date" => strtotime(date("Y-m-d"))
            ]], 'Transaction Successful.', true);

         else:
             $savedOrder->delete();
             return $this->getResponse("Swift POS Order API Error.".json_encode($status), 'Transaction Failed', false);
        endif;
    }//..... end of ForwardOrderToApi() .....//

    /**
     * Save Order Data to Unified Database.
     */
    private function saveOrderAtUDB( Request $request, $venue_id )
    {
        $orderToSave = [
            'customer_id'        => $request->customer_id,
            'payment_method_id'  => $request->payment_by,
            'order_status'       => 0,
            'order_note'         => '',
            'order_type'         => $request->ord_type,
            'order_amount'       => $request->amount_due,
            'venue_id'           => $venue_id,
            'order_pin_location' => $request->order_pin_location,
            'device_name'        => $request->device_name,
            'device_model'       => $request->device_model,
            'is_acknowledge'     =>	$request->is_acknowledge,
            'pos_code'           => 3,
            'tax_label'          => $request->vat_label,
            'total_points'       => $request->redeem_points,
            'points_amount'      => $request->pay_with_points,
            'vat_amount'         => $request->vat_amount,
            'transaction_id'     => "",
            'country_id'         => $request->country_id,
            'business_id'        => $request->business_id
        ];

        return Order::create($orderToSave);//..... Order Saved to order table.
    }//..... end of saveOrderAtUDB() .....//

    /**
     * @param $items
     * @param $savedOrder
     * Save Order Details in Unified Database.
     */
    private function saveOrderDetailsAtUDB($items, $savedOrder)
    {
        foreach($items as $item){
            OrderDetails::insert([  'product_id' => $item->prd_id,        'order_id' =>  $savedOrder->order_id,
                'unit_price' => $item->prd_unitprice, 'quantity' =>  $item->prd_qty,
                'transaction_id' => $savedOrder->order_id,'created_at' => Carbon::now()
            ]);
        }//..... end foreach() ......//

        $savedOrder->transaction_id  = $savedOrder->order_id;// as transaction id should by provided by us to swift pos.
        $savedOrder->order_status    = 1;
        $savedOrder->save();
        SwiftLog::info("  ".basename(__FILE__)." Order details saved successfully and In Order table transaction id (s) updated successfully.");
        return;
    }//..... end of saveOrderDetailsAtUDB() .....//

    /**
     * Get Voucher by member ID.
     */
    public function getVoucher( Request $request )
    {
        //..... Get api key on the basis of store.
        $this->store = $this->getStore( $request->business_id );
        $this->apiCall->getAuthorizationKey($this->store->pos_store_id, $this->store->store_api_key, $this->store->store_api_secret);

        $swift_pos_id = $this->checkIfUserRegisteredAtSwiftPos( $request->customer_id );

        if($swift_pos_id){// user exist in udb or registered successfully.
            $response = $this->apiCall->getVoucher ( $swift_pos_id );
            if ( $response ){
                if ($response->getStatusCode() == 200){
                    return $this->getResponse($response->getBody()->getContents(), "Response Returned from Swift POS", true);
                } else {
                    return $this->getResponse("Swift POS API Error.", 'API Error Occurred. Response Code:'.$response->getStatusCode(), false);
                }//..... end of inner-if-else() ......//
            } else {
                return $this->getResponse("Swift POS API Error.", 'API Error Occurred.', false);
            }//..... end if-else() .....//
        }else{
            return $this->getResponse("Swift POS Member Registration API Error.", 'Member Registration Failed.', false);
        }//..... end if-else() .....//
    }//.... end of getVoucher() .....//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Issue a Voucher to a specific Member.
     */
    public function issueMemberVoucher( Request $request )
    {
        //..... Get api key on the basis of store.
        $this->store = $this->getStore( $request->business_id );
        $this->apiCall->getAuthorizationKey($this->store->pos_store_id, $this->store->store_api_key, $this->store->store_api_secret);

        $swift_pos_id = $this->checkIfUserRegisteredAtSwiftPos( $request->customer_id );

        if($swift_pos_id){// user exist in udb or registered successfully.
            $body = [];

            if($request->has('voucher_id'))
                $body['voucherId'] = $request->voucher_id;

            if($request->has('barcode'))
                $body['barcode'] = $request->barcode;

            if($request->has('member_type'))
                $body['memberType'] = $request->member_type;

            $response = $this->apiCall->issueVoucher ( $swift_pos_id , $body);

            if ( $response and is_array($response)){
                $msg = "";
                if(isset($response['message'])){
                    $msgA = json_decode( $response['message'] );
                    foreach ($msgA->Messages as $m)
                        $msg .= $m;
                }//.... end if() .....//

                if ($response["statusCode"] == 200){
                    return $this->getResponse($msg, "Voucher is issued successfully.", true);
                } else {
                    return $this->getResponse($msg, 'API Error Occurred. Response Code:'.$response["statusCode"], false);
                }//..... end of inner-if-else() ......//
            } else {
                return $this->getResponse("Swift POS API Error.", 'API Error Occurred.', false);
            }//..... end if-else() .....//
        }else{
            return $this->getResponse("Swift POS Member Registration API Error.", 'Member Registration Failed.', false);
        }//..... end if-else() .....//
    }
}//.... end of class.