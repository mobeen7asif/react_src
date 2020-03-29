<?php
namespace App\UnifiedSchemaCall;

use App\UnifiedDbModels\Order;
use App\UnifiedDbModels\OrderDetails;
use App\UnifiedDbModels\Product;
use App\UnifiedDbModels\Store;
use App\Models\Venue;
use DB;
use App\Facade\SoldiLog;

class SoldiPosUnifiedSchema extends BasePosUnifiedSchemaCall
{

    /**
     * SoldiPosUnifiedSchema constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }//.... end of __constructor() ......//
   
    		protected $fileName = 'SoldiPosUnifiedSchema.php';
	
    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse
     * Get All Stores from UDB.
     */
	public function getAllStoresFromUnifiedSchema( $params = [] )
    {
        $stores = $this->getAllStoresFromUD( $params );

        if(!empty($stores)){
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'All Stores Received From Unified Schema Database', Store_count: ".count($stores)."");
            return $this->getResponse($stores, 'Data Found', true);
		}else{
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Stores Data Not Found From Unified Schema Database', Store_count: 0");
            return $this->getResponse($stores, 'Data Not Found', false);
		}
	}//..... end of getAllStoresFromUnifiedSchema() .......//

    /***
     * @param array $params
     * @return \Illuminate\Http\JsonResponse
     * Get Single Store's Categories List.
     */
	public function getStoreCategoryFromUnifiedSchema( $params = [] )
    {
        $categoriesList = $this->getCategoriesFromUD( $params );

        if(!empty($categoriesList)){
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Store Category Data Found From Unified Schema Database'");
            return $this->getResponse($categoriesList, 'Data Found', true);
		}else{
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Category Data Not Found From Unified Schema Database'");
            return $this->getResponse($categoriesList, 'Data Not Found', false);
		}
	}//..... end of getStoreCategoryFromUnifiedSchema() ......//

    /**
     * @param array $params
     * @return array
     * Get Venues' Stores.
     */
	public function getVenueStores( $params = [] )
    {
        extract($params);
        $stores = [];
		Venue::where('venue_id', '=', $venue_id)->where('company_id', '=', $company_id)->get()->each(function($venue) use(&$stores,$company_id){
		    $stores = $this->getVenueStoresDetails($venue->venue_id, $company_id);
        });
		return $stores;
	}//..... end of getVenueStores() ......//

	
    /**
     * Get Specific Store Details from Unified DB.
     */
    public function getStoreDetails( $params = [] )
    {
        $store = $this->getSingleStoreFromUD( $params );

        if(!empty($store)){
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Store Detail found From Unified Schema Database'");
            return $this->getResponse($store, 'Data Found', true);
		}else{
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'No Store Info Found From Unified Schema Database'");
            return $this->getResponse($store, 'Data Not Found', false);
		}
	}//..... end of getStoreDetails() ......//

    /**
     * Get All Products of a specific business and of specific category_id
     */
    public function getCategoryProducts( $params = [] )
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["store.id" => $business_id,"category.category_id"=> $category_id], "category_id"=> $category_id, "store_id"=> $business_id] );

        if(!empty($productsArray)){
            return $this->getResponse($productsArray, 'Data Found', true);
		}else{
            return $this->getResponse($productsArray, 'Data Not Found', false);
		}
    }//..... end of getCategoryProducts() ......//

    /**
     * @param $params
     * @return \Illuminate\Http\JsonResponse
     * Search product by name.
     */
    public function searchProducts($params)
    {
        extract($params);
        $productsArray = $this->getProductsFromUD( ["where"=> ["store.store_id" => $store_id], "store_id"=> $store_id,"search"=> true,"searchKey"=> $searchKey] );

        if(!empty($productsArray)){
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Products Found Against Search Query', Products_count: ".count($productsArray)."");
            return $this->getResponse($productsArray, 'Data Found', true);
		}else{
			//SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'No Products Found Against Search Query', Products_count: 0");
            return $this->getResponse($productsArray, 'Data Not Found', false);
		}
    }//..... end of searchProducts() .......//

    /**
     * Get Orders List of a specific customer from unified DB.
     */
    public function getCustomerOrdersList($customer_id, $company_id, $amplify_id)
    {
        $ordersArray = [];
        Order::where(["customer_id"=> $customer_id])->orderBy("order_id","DESC")->get()
        ->each(function($order) use(&$ordersArray, $customer_id){
            
            $store = Store::where(['store_id'=> $order->business_id ])->first();

            $ord = [
                "ord_id"                => $order->order_id,
                "ord_date"              => strtotime($order->created_at),
                "course_comp_date"      => strtotime($order->created_at),
                "ord_status"            => ($order->order_status) ? $order->order_status : 0,
                "order_pin_location"    => ($order->order_pin_location) ? $order->order_pin_location : "",
                "store_address"         => ($store) ? $store->store_address : "",
                "currency"              => "$",
                "ord_amount"            => ($order->order_amount) ? "{$order->order_amount}" : "",
                "surcharges"            => ($order->surcharges) ? $order->surcharges : "",
                "tax_label"             =>  ($order->tax_label) ? $order->tax_label : "",
                "vat_amount"            => ($order->vat_amount) ? $order->vat_amount : "",
                "items_discount"        => ($order->items_discount) ? $order->items_discount : "",
                "customer_id"           => ($order->customer_id) ? $order->customer_id : "",
                "customer_name"         => ($order->customer_name) ? $order->customer_name : "",
                "payment_by"            => ($order->payment_method_id) ? $order->payment_method_id : "",
                "user_id"               => ($order->user_id) ? $order->user_id : $customer_id,
                "country_id"            => ($order->country_id) ? $order->country_id : "",
                "ord_type"              => ($order->order_type) ? $order->order_type : "",
                "is_soldi"              => ($order->is_soldi) ? $order->is_soldi : 0,
                "change_due"            => ($order->change_due) ? $order->change_due : "",
                "tip_amount"            => ($order->tip_amount) ? $order->tip_amount : "",
                "invoice_no"            => ($order->transaction_id) ? $order->transaction_id : "",
                "transaction_id"        => ($order->transaction_id) ? $order->transaction_id : "",
				"is_acknowledge"        => ($order->is_acknowledge) ? $order->is_acknowledge : "",
                "ord_table"             => ($order->ord_table) ? $order->ord_table : "",
                "waiter_id"             => ($order->waiter_id) ? $order->waiter_id : "",
                "device_name"           => ($order->device_name) ? $order->device_name : "",
                "device_model"          => ($order->device_model) ? $order->device_model : "",
				"business_id"           => ($order->business_id) ? $order->business_id : "",
                "business_name"         => ($store) ? $store->store_name : "",
                "business_initials"     => ($order->business_initials) ? $order->business_initials : "",
                "points_amount"         => ($order->points_amount) ? $order->points_amount : "0",
                "total_points"          => ($order->total_points) ? $order->total_points : "0",
                "store_map"             => "",
                "earn_points"           => "0"
            ];

            $orderDetail = [];
            OrderDetails::where(['order_id'=> $order->order_id])->get()
                ->each(function($ordd) use(&$orderDetail) {

                    $product = Product::where(['product_id'=> $ordd->product_id])->first();

                    $orderDetail[] = [
                        "od_id"             => $ordd->order_detail_id,
                        "order_id"          => $ordd->order_id,
                        "prd_type"          => "",
                        "prd_id"            => $product->product_id ? $product->product_id : "",
                        "prd_parent_id"     => $product->parent_id ? $product->parent_id : "",
                        "prd_name"          => $product->product_name ? $product->product_name : "",
                        "prd_desc"          => $product->product_description ? $product->product_description : "",
                        "prd_qty"           => $ordd->quantity ? "{$ordd->quantity}" : "",
                        "discountable"      => $product->discountable ? $product->discountable : "",
                        "taxable"           => $product->taxable ? $product->taxable : "",
                        "discount_type"     => "",
                        "discount_amt"      => $product->max_dicsount_amount ? $product->max_dicsount_amount : "",
                        "prd_unitprice"     => $product->product_price ? $product->product_price : "",
                        "prd_cost"          => $ordd->unit_price ? $ordd->unit_price : "",
                        "is_done"           => $ordd->is_done ? $ordd->is_done : "",
                        "cate_id"           => $product->category_id ? $product->category_id : "",
                        "refunded_qty"      => "",
                        "refunded_amount"   => "0.00",
                        "refunded_json"     => "",
                        "modifier_ids"      => "",
                        "modifier_names"    => "",
                        "price_id"          => "0",
                        "price_name"        => "",
                        "modi_price"        => 0,
                        "point_type"        => $product->point_type ? $product->point_type : "",
                        "point_value"       => $product->point_value ? $product->point_value : 0,
                    ];

                });//..... end of orderDetails each() .....//

            $ord['order_detail'] = $orderDetail;
            $ordersArray[] = $ord;
        });//..... end of each() ......//

        if(!empty($ordersArray)){
            //SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Customer Order List From Unified Schema', Orders_count: ".count($ordersArray)."");
            return $this->getResponse($ordersArray, 'Data Found', true);
		}else{
            //SoldiLog::info("  ".basename(__FILE__)." Email: 'ibm2@gmail.com', Device: ios, message: 'Customer Order List Not Found From Unified Schema', Orders_count: ".count($ordersArray)."");
            return $this->getResponse($ordersArray, 'Data Not Found', false);
		}
    }//..... end of getCustomerOrdersList() ......//
}//..... end of class.
	
	

