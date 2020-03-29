<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 7/10/2018
 * Time: 4:39 PM
 */

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RestController extends BaseRestController
{

    /**
     * RestController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }//..... end of __construct() ......//

    /**
     * @param Request $request
     * @return mixed
     * Get Specific Store's Categories
     */
    public function getStoreCat(Request $request)
    {
        return $this->checkStorePos($request->business_id)
            ->getStoreCategories(["business_id" => $request->business_id, "venue_id" => $request->venue_id, "company_id" => $request->company_id]);
    }//..... end of getStoreCat() ......//

    /***
     * Get Single Store details.
     */
    public function getStoreInfo(Request $request)
    {
        return $this->checkStorePos($request->store_id)->getStoreInfo(["business_id" => $request->store_id, "company_id" => $request->company_id]);
    }//..... end of getStoreInfo() .....//


    /**
     * Get Single Category's Products.
     */
    public function getAllProductData(Request $request)
    {
        return $this->checkStorePos($request->business_id)
            ->getAllProducts(["business_id" => $request->business_id, "category_id" => $request->cate_id, "user_id" => $request->user_id, "company_id" => $request->company_id]);
    }//..... end of getAllProductData() ......//

    /**
     * Search Product by title.
     */
    public function searchProduct(Request $request)
    {
        $object = $this->checkStorePos($request->id);
        return $object->searchProducts(["store_id" => $request->id, "searchKey" => $request->searchkey, "company_id" => $request->company_id, "type" => $request->type]);
    }//..... end of searchProduct() ......//

    /**
     * @param Request $request
     * @return string|void
     * Place Order
     */
    public function PlaceOrder(Request $request)
    {
        Log::channel('payment')->info('**************************************** ************************ ************************************************** ');
        Log::channel('payment')->info('**************************************** Order Processing Started ' . now() . '************************************* ');
        Log::channel('payment')->info('**************************************** ************************ ************************************************** ');
        $response = $this->checkStorePos($request->business_id)->placeOrder($request);
        Log::channel('payment')->info('**************************************** ****************** ******************************************************** ');
        Log::channel('payment')->info('**************************************** Order Completed ;) ******************************************************** ');
        Log::channel('payment')->info('**************************************** ****************** ******************************************************** ');
        return $response;
    }//..... end of PlaceOrder() .....//
}//..... end of class.