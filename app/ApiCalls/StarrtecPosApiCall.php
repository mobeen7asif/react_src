<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 2:36 PM
 */

namespace App\ApiCalls;


use Illuminate\Http\Request;

class StarrtecPosApiCall extends BasePosApiCall
{

    private $location_url;
    private $header = [];

    /**
     * StarrtecPosApiCall constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->header       = ["Content-Type" => "application/json",'Authorization' => config('constant.STARRTEC_TOKEN')];
        $this->location_url = config("constant.STARRTEC_URL");
    }//..... end of __construct() .....//

    /**
     * @param $params
     * @return string
     * Get Single Store Details.
     */
    public function getSingleStoreDetail( $params )
    {
        return "API Calls for Starrtec POS is under Construction.....";
    }//..... end of getSingleStoreDetail() ......//

    /**
     * @param array $params
     * @return string
     * Get List of Categories of a specific Store..
     */
    public function getCategoriesList( $params = [] )
    {
        return "API calls for Starrtec POS for store's Categories is under construction.";
    }//..... end of getCategoriesList() ......//

    /**
     * Get Single Category's Products List.
     */
    public function getCategoryProducts( $params = [] )
    {
        return "API Calls for Starrtec's Category Products List is UnderConstruction.";
    }//..... end of getCategoryProducts() ......//

    /**
     * @param array $params
     * @return string
     * Search Product in a specific store.
     */
    public function searchProducts( $params = [] )
    {
        return "API Calls for Searching Starrtec's Category Products List is UnderConstruction.";
    }//..... end of searchProducts() ......//

    /**
     * @return string
     * Process Order.
     */
    public function payment_process( Request $request )
    {
        return "API Calls for Placing Order at Starrtec is UnderConstruction.";
    }//..... end of payment_process() .....//

    /**
     * @param $order
     * @param $locationID
     * @return string
     * Place order.
     */
    public function placeOrder($order, $locationID)
    {
        $url = str_replace('?',"/".$locationID."/orders?",$this->location_url);
        $header1 = $this->header;
        return $this->postJsonThroughGuzzle($url, $header1, $order);
    }//...... end of placeOrder() .......//
}//..... end of class.