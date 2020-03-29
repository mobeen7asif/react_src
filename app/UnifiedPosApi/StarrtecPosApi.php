<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 10:51 AM
 */

namespace App\UnifiedPosApi;


use App\ApiCalls\StarrtecPosApiCall;
use Illuminate\Http\Request;
use App\interfaces\PosApiInterface;
use App\UnifiedSchemaCall\StarrtecPosUnifiedSchema;

class StarrtecPosApi implements PosApiInterface
{
    private $starrtecUnifiedPosHandler;
    private $starrtecPosApiHandler;

    /**
     * StarrtecPosApi constructor.
     */
    public function __construct()
    {
        $this->starrtecUnifiedPosHandler = new StarrtecPosUnifiedSchema();
        $this->starrtecPosApiHandler     = new StarrtecPosApiCall();
    }//..... end of __construct() ......//

    /**
     * @param array $params
     * @return string
     * Get Specific Store's Categories List.
     */
    public function getStoreCategories($params = [])
    {
        if(!config("constant.getDataFromApis")){
            return $this->starrtecUnifiedPosHandler->getCategoriesList( $params );
        }else{
            return $this->starrtecPosApiHandler->getCategoriesList( $params );
        }//..... end if-else() .....//
    }//..... end of getStoreCategories() ......//

    /**
     * @param array $params
     * @return string
     * Get Single Store Information.
     */
    public function getStoreInfo( $params = [] )
    {
        if(!config("constant.getDataFromApis")){
            return $this->starrtecUnifiedPosHandler->getSingleStoreDetail( $params );
        }else{
            return $this->starrtecPosApiHandler->getSingleStoreDetail( $params );
        }//..... end if-else() .....//
    }//..... end of getStoreInfo() ......//

    /**
     * @param array $params
     * @return string
     * Get single Category's Products List.
     */
    public function getAllProducts( $params = [] )
    {
        if(!config("constant.getDataFromApis")){
            return $this->starrtecUnifiedPosHandler->getCategoryProducts( $params );
        }else{
            return $this->starrtecPosApiHandler->getCategoryProducts( $params );
        }//..... end if-else() .....//
    }//..... end of getAllProducts() ......//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Search Product by title.
     */
    public function searchProducts( $params = [] )
    {
        if(!config("constant.getDataFromApis")){
            return $this->starrtecUnifiedPosHandler->searchProducts( $params );
        }else{
            return $this->starrtecPosApiHandler->searchProducts( $params );
        }//..... end if-else() .....//
    }//..... end of searchProducts() ......//

    /**
     * @param Request $request
     * @return string|void
     * Process and Place Order.
     */
    public function placeOrder( Request $request )
    {
        if(!config("constant.getDataFromApis")){
            return $this->starrtecUnifiedPosHandler->payment_process( $request );
        }else{
            return $this->starrtecPosApiHandler->payment_process( $request );
        }//..... end if-else() .....//
    }//..... end of placeOrder() .....//
}//..... end of class.