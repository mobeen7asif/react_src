<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 10:50 AM
 */

namespace App\UnifiedPosApi;

use App\interfaces\PosApiInterface;
use App\Models\AutoOrderPlacement;
use App\Models\Setting;
use App\Models\Venue;
use App\UnifiedSchemaCall\SoldiPosUnifiedSchema;
use App\classes\CommonLibrary;
use App\ApiCalls\SoldiPosApiCall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SoldiPosApi implements PosApiInterface
{
    private  $common_library;
    private  $soldiUnifiedPosHandler;
    private  $apiCall;

    /**
     * SoldiPosApi constructor.
     */
    public function __construct()
    {
        $this->common_library = new CommonLibrary();
        $this->apiCall = new SoldiPosApiCall();
        $this->soldiUnifiedPosHandler = new SoldiPosUnifiedSchema();
    }//..... end of __construct() .....//

    /**
     * Get Specific Store's Categories list.
     */
    public function getStoreCategories($params = [])
    {
        if(!config("constant.getDataFromApis"))
            return $this->soldiUnifiedPosHandler->getStoreCategoryFromUnifiedSchema( $params );
        else
            $this->apiCall->getStoreCategoryFromSoldi( $params );
    }//..... end of getStoreCategories() ......//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse
     * Get Single Store Details.
     */
    public function getStoreInfo( $params = [] )
    {
        if(!config("constant.getDataFromApis"))
            return $this->soldiUnifiedPosHandler->getStoreDetails( $params );
        else
            $this->apiCall->StoreInfoFromSoldi( $params );
    }//..... end of getStoreInfo() ......//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Get List of store's Products.
     */
    public function getAllProducts($params = [])
    {
		if(!config("constant.getDataFromApis"))
            return $this->soldiUnifiedPosHandler->getCategoryProducts( $params );
        else
            return $this->apiCall->getAllProductsFromSoldi( $params );
    }//..... end of getAllProducts() ......//

    /**
     * @param array $params
     * @return \Illuminate\Http\JsonResponse|string
     * Search Product by title.
     */
    public function searchProducts( $params = [] )
    {
        if(!config("constant.getDataFromApis"))
            return $this->soldiUnifiedPosHandler->searchProducts( $params );
        else
            $this->apiCall->searchProductsFromSoldi( $params );
    }//..... end of searchProducts() ......//

    public function placeOrder(Request $request)
    {
        Log::channel('custom')->info('Order payload received from mobile: ', ['data' => $request->all()]);
        $app_user_id = $request->user_id;
        $venue_id = $request->vanue_id;
        $company_id = $request->company_id;
        $amplify_id = $request->amplify_id;
        $is_redeem = $request->is_redeem;
        $redeem_points = $request->redeem_points;
        $business_id = $request->business_id;

/*        $valiadtor=Validator::make($request->all(), [

            'postal_code'      =>'required',
            'address'          =>'required',
            'street_number'    =>'required',
            'street_name'      =>'required',
            'city'             =>'required',
            'state'            =>'required'
        ]);
        if ($valiadtor->fails()) {
            $errors = $valiadtor->errors();
            $mess['status'] = false;
            foreach ($errors->get('postal_code') as $message)
                $mess['message'] = $message;

            foreach ($errors->get('address') as $message)
                $mess['message']=$message;

            foreach ($errors->get('address') as $message)
                $mess['message']=$message;

            foreach ($errors->get('address') as $message)
                $mess['message']=$message;

            foreach ($errors->get('state') as $message)
                $mess['message']=$message;

            return $mess;
        }//..... end if() .....//*/

            $responce_set = $this->common_library->getCompanySittings($company_id);
            $user_id = $responce_set->customar_id;
            $SOLDI_API_KEY = $responce_set->soldi_api_key;
            $SOLDI_SECRET = $responce_set->soldi_api_secret;
            $app_name = $responce_set->app_name;
            $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');

            $autoOrder = AutoOrderPlacement::where(['user_id' => $request->user_id, 'operation_performed' => 'default'])->get();
            $autoOrderInprocess = AutoOrderPlacement::where(['user_id' => $request->user_id, 'operation_performed' => 'order_inprocess'])->get();
            $venueCheck = Venue::select('auto_checkout')->where('venue_id', $venue_id)->first();

            if (!$venueCheck->auto_checkout) {
                $status = $this->apiCall->payment_processSoldi(array('venue_id' => $venue_id, 'app_user_id' => $app_user_id, 'company_id' => $company_id, 'SOLDI_API_KEY' => $SOLDI_API_KEY, 'SOLDI_SECRET' => $SOLDI_SECRET, 'SOLDI_DEFAULT_PATH' => $SOLDI_DEFAULT_PATH, 'app_name' => $app_name, 'amplify_id' => $amplify_id, 'is_redeem' => $is_redeem, 'redeem_points' => $redeem_points, 'user_id' => $user_id, 'business_id' => $business_id, 'request' => $request->all(), 'autoCheck' => 0));
                return $status;
            }
            if ($request->has('order_inprogress')) {
                $status = $this->apiCall->payment_processSoldi(array('venue_id' => $venue_id, 'app_user_id' => $app_user_id, 'company_id' => $company_id, 'SOLDI_API_KEY' => $SOLDI_API_KEY, 'SOLDI_SECRET' => $SOLDI_SECRET, 'SOLDI_DEFAULT_PATH' => $SOLDI_DEFAULT_PATH, 'app_name' => $app_name, 'amplify_id' => $amplify_id, 'is_redeem' => $is_redeem, 'redeem_points' => $redeem_points, 'user_id' => $user_id, 'business_id' => $business_id, 'request' => $request->all()));
                return $status;
            }
            if ($autoOrderInprocess->isNotEmpty()) {
                return response()->json(['status' => false, 'message' => "Please wait, Your payment is already in process"]);
            }

            if ($autoOrder->isNotEmpty()) {
                // AutoOrderPlacement::where('id', $autoOrder[0]->id)->update(['operation_performed' => 'order_inprocess']);
                $status = $this->apiCall->payment_processSoldi(array('venue_id' => $venue_id, 'app_user_id' => $app_user_id, 'company_id' => $company_id, 'SOLDI_API_KEY' => $SOLDI_API_KEY, 'SOLDI_SECRET' => $SOLDI_SECRET, 'SOLDI_DEFAULT_PATH' => $SOLDI_DEFAULT_PATH, 'app_name' => $app_name, 'amplify_id' => $amplify_id, 'is_redeem' => $is_redeem, 'redeem_points' => $redeem_points, 'user_id' => $user_id, 'business_id' => $business_id, 'request' => $request->all()));
                return $status;
            }


        $user_id = $request->user_id;

        $status = $this->apiCall->payment_processSoldi(array('venue_id' => $venue_id, 'app_user_id' => $app_user_id, 'company_id' => $company_id, 'SOLDI_API_KEY' => '', 'SOLDI_SECRET' => '', 'SOLDI_DEFAULT_PATH' => '', 'app_name' => '', 'amplify_id' => $amplify_id, 'is_redeem' => $is_redeem, 'redeem_points' => $redeem_points, 'user_id' => $user_id, 'business_id' => $business_id, 'request' => $request->all(), 'autoCheck' => 0));

        return $status;

    }//..... end of placeOrder() .....//
}//..... end of class.