<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 10:52 AM
 */

namespace App\UnifiedPosApi;


use App\ApiCalls\SwiftPosApiCall;
use App\interfaces\PosApiInterface;
use App\UnifiedSchemaCall\SwiftPosUnifiedSchemaCall;
use Illuminate\Http\Request;

class SwiftPosApi implements PosApiInterface
{

    private $swiftUnifiedPosHandler;
    private $swiftPosApiCall;

    /**
     * SwiftPosApi constructor.
     */
    public function __construct()
    {
        $this->swiftUnifiedPosHandler = new SwiftPosUnifiedSchemaCall();
        $this->swiftPosApiCall        = new SwiftPosApiCall();
    }//..... end of __construct() .....//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Get Specific Store Categories.
     */
    public function getStoreCategories($params = [])
    {
        return (!config("constant.getDataFromApis")) ? $this->swiftUnifiedPosHandler->getCategoriesList( $params ) : $this->swiftPosApiCall->getCategoriesList( $params );
    }//.... end of getStoreCategories() ......//

    /**
     * @param array $params
     * @return mixed
     * Get Single Store Details.
     */
    public function getStoreInfo($params = [])
    {
        return (!config("constant.getDataFromApis")) ? $this->swiftUnifiedPosHandler->getSingleStoreDetail( $params ) : $this->swiftPosApiCall->getSingleStoreDetail( $params );
    }//..... end of getStoreInfo() .....//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Get All products data.
     */
    public function getAllProducts($params = [])
    {
        return (!config("constant.getDataFromApis")) ? $this->swiftUnifiedPosHandler->getCategoryProducts( $params ) : $this->swiftPosApiCall->getCategoryProducts( $params );
    }//..... end of getAllProducts() .....//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Search Products..
     */
    public function searchProducts($params = [])
    {
        return (!config("constant.getDataFromApis")) ? $this->swiftUnifiedPosHandler->searchProducts( $params ) : $this->swiftPosApiCall->searchProducts( $params );
    }//..... end of searchProducts() .....//

    /**
     * @param Request $request
     * @return mixed
     * Place Order.
     */
    public function placeOrder(Request $request)
    {
        return (!config("constant.getDataFromApis")) ? $this->swiftUnifiedPosHandler->payment_process( $request ) : $this->swiftPosApiCall->payment_process( $request );
    }//..... end of placeOrder() .....//
}