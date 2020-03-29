<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 8/29/2017
 * Time: 3:59 PM
 */

namespace App\ApiCalls;


use App\Facade\SwiftLog;
use App\User;

class SwiftPosApiCall extends BasePosApiCall
{
    /*sonar constants*/
    const UNDER_CONSTRUCTION                = 'Under Construction.';

    private $url;
    private $header;

    /**
     * SwiftPosApiCall constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->url      = config('constant.SWIFT_URL');
        $this->header   = ["Content-Type" => "application/json"];
    }//..... end of __construct() .....//

    /**
     * Get Single Store Details.
     */
    public function getSingleStoreDetail( $params )
    {
        return 'Under Construction.....';
    }//...... end of getSingleStoreDetail() .....//

    /**
     * @param $params
     * Get Categories List.
     * @return string
     */
    public function getCategoriesList( $params )
    {
        return self::UNDER_CONSTRUCTION;
    }//..... end of getCategoriesList() ......//

    /**
     * Get All Products List of a specific category.
     */
    public function getCategoryProducts()
    {
        return self::UNDER_CONSTRUCTION;
    }//..... end of getAllProducts() .....//

    /**
     * Search Product...
     */
    public function searchProducts()
    {
        return self::UNDER_CONSTRUCTION;
    }//..... end of searchProducts() .....//

    /**
     * Place Order.
     */
    public function payment_process()
    {
        return "Under Contruction.";
    }//..... end of payment_process() .....//

    /**
     * @param User $user
     * Register User at Swift POS.
     * @return array|bool|mixed
     */
    public function registerUserAtSwiftPos( User $user )
    {
        $userArray = [
            'Id'                => "0",
            'Type'              => 0,
            'FirstName'         => $user->user_first_name,
            'Surname'           => $user->user_family_name,
            'DateOfBrith'       => $user->user_date_of_birth,
            'MobilePhone'       => $user->user_mobile,
            'EmailAddress'      => $user->user_email,
            'Classifications'   =>  [
                [
                    "Id"            => 1,
                    "Name"          => "Standard Member",
                    "Type"          => 0,
                    "RenewalDate"   => "2050-08-28T04:22:59.053Z"
                ]
            ]];

        try{
            $response = $this->postJsonThroughGuzzle( $this->url.'Member', $this->header, $userArray, true );
            if($response->getStatusCode() == 201){
                $location = $response->getHeader('Location');
                $user_id = explode('/', $location[0]);
                $user_id = end($user_id);

                SwiftLog::info("  ".basename(__FILE__)."  User created at swift pos id: ". $user_id);
                User::where('user_id', $user->user_id)->update(['swift_pos_id' => $user_id]);

                return $user_id;
            }else{
                return false;
            }//..... end if-else() .....//
        }catch (\Exception $e){
            return false;
        }//..... end of try-catch() .....//
    }//..... end of registerUserAtSwiftPos() .....//

    /**
     * Get Authorization key from
     * @param $locationId
     * @param $userId
     * @param $password
     */
    public function getAuthorizationKey( $locationId, $userId, $password )
    {
        SwiftLog::info("  ".basename(__FILE__)."  Getting Authorization Key From Endpoint: ". $this->url."Authorisation?locationId=$locationId&userId=$userId&password=$password");
        $response = $this->get( $this->url."Authorisation?locationId=$locationId&userId=$userId&password=$password", $this->header );

        if($response){
            $response = json_decode($response);
            if(isset($response->ApiKey)){
                SwiftLog::info("  ".basename(__FILE__)." API KEY received :". $response->ApiKey);
                $this->apiKey = $response->ApiKey;
                $this->header['ApiKey'] = $this->apiKey;
            }else{
                SwiftLog::error("  ".basename(__FILE__)." Could not get API KEY.");
            }//..... end of if-else .....//
        }else{
            SwiftLog::error("  ".basename(__FILE__)." Could not get response from api.");
        }//..... end if() .....//

        return;
    }//..... end of getAuthorizationKey() .....//

    /**
     * @param $orderData
     * Place Order at swift pos.
     * @return bool
     */
    public function placeOrderAtSwift( $orderData )
    {
        try{
            $response = $this->postJsonThroughGuzzle( $this->url.'Order', $this->header, $orderData, true );
            if($response->getStatusCode() == 201){
                return true;
            }else{
                return false;
            }//..... end if-else() .....//
        }catch (\Exception $e){
            return false;
        }//..... end of try-catch() .....//
    }//..... end of placeOrderAtSwift() .....//

    /**
     * @param $memberID
     * @return bool|mixed|\Psr\Http\Message\ResponseInterface|string
     * Get Specific Member Voucher.
     */
    public function getVoucher( $memberID )
    {
        try {
            return $this->get( $this->url."Member/{$memberID}/Voucher", $this->header, true);
        } catch (\Exception $e) {
            return false;
        }//..... end of try-catch() .....//
    }//..... end of getVoucher() ......//

    /**
     * @param $memberID
     * @param $body
     * @return array|bool|mixed
     * Issue a voucher to a member.
     */
    public function issueVoucher( $memberID, $body )
    {
        try {
            $header1 = ["apiKey: {$this->header['ApiKey']}","Content-Type: application/json"];
            return $this->curlThroughPost( $this->url."Member/{$memberID}/Voucher?voucherId=".$body['voucherId'], $header1, $body, true);
        } catch (\Exception $e) {
            return false;
        }//..... end of try-catch() .....//
    }//..... end of issueVoucher() .....//
}//..... end of class.