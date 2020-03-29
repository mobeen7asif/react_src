<?php

namespace App\Hooks;

use App\Facade\StarrtecLog;
use App\Facade\SoldiLog;
use App\Facade\SwiftLog;
use App\Kafka\Producer;
use App\Utilities\Utility;

/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/19/2017
 * Time: 2:54 PM
 */
class OrderHook
{
    /*sonar constants*/
    const ITEMS                 = 'items';
    const POS_SPEND_DATE                 = 'pos_spend_date';
    const POS_LOCATION                 = 'pos_location';
    const LOCATION                 = 'location';
    const POS_SPEND_AMOUNT                 = 'pos_spend_amount';
    const AMOUNT                 = 'amount';
    const SALE_ITEM                 = 'sale_item';
    const TRANS_ID                 = 'transaction_id';
    const USER_ID                 = 'user_id';
    const TRANSACTIONS                 = 'transactions';
    const EMAIL                 = 'email';
    const VENUE_ID                 = 'venue_id';
    const SUPER_PORTAL                 = 'SuperPortal';
    const POS_TRANSACTIONAL                 = 'pos_transactional';


    /**
     * OrderHook constructor.
     */
    public function __construct()
    {
        //
    }//..... end of __construct() .....//

    /**
     * When Order placed at starrtec POS successfully, then this function will be called.
     */
    public function OrderPlacedAtStarrtec($params)
    {
        if(!config('constant.SEND_DATA_TO_KAFKA')) {
            return true;
        }

        $utility = new Utility();
        $producer = new Producer();

        foreach ($params[self::ITEMS] as $item){
            $details = [
                self::POS_SPEND_DATE    => $params['date'],
                self::POS_LOCATION      => $params[self::LOCATION],
                self::POS_SPEND_AMOUNT  => $params[self::AMOUNT],
                self::SALE_ITEM         => $item->prd_name,
                self::TRANS_ID    => $params[self::TRANS_ID],
                self::USER_ID           => $params[self::USER_ID],
                self::EMAIL             => $params[self::EMAIL],
                self::VENUE_ID          => $params[self::VENUE_ID]
            ];

            $wrapper = $utility->getTransactionWrapper(self::SUPER_PORTAL,self::POS_TRANSACTIONAL,"Starrtec Order Api", $details);
            $producer->sendDataToKafka(self::TRANSACTIONS, $wrapper);
			StarrtecLog::info("  ".basename(__FILE__)." Email: ibm2@gmail.com, Device: ios, message: Transaction_id ".$params[self::TRANS_ID]."");
        }//..... end foreach() .....//
        return true;
    }//..... end of OrderPlacedAtStarrtec() .....//

    /**
     * Swift POS Order placed hook.
     * this hook called when order placed at Swift POS.
     */
    public function OrderPlacedAtSwift( $params )
    {
        if(!config('constant.SEND_DATA_TO_KAFKA')) {
            return true;
        }

        $utility = new Utility();
        $producer = new Producer();

        foreach ($params[self::ITEMS] as $item){
            $details = [
                self::POS_SPEND_DATE    => $params['date'],
                self::POS_LOCATION      => $params[self::LOCATION],
                self::POS_SPEND_AMOUNT  => $params[self::AMOUNT],
                self::SALE_ITEM         => $item->prd_name,
                self::TRANS_ID    => $params[self::TRANS_ID],
                self::USER_ID           => $params[self::USER_ID],
                self::EMAIL             => $params[self::EMAIL],
                self::VENUE_ID          => $params[self::VENUE_ID]
            ];

            $wrapper = $utility->getTransactionWrapper(self::SUPER_PORTAL,self::POS_TRANSACTIONAL,"Swift Order Api", $details);
            $producer->sendDataToKafka(self::TRANSACTIONS, $wrapper);
            SwiftLog::info("  ".basename(__FILE__)." Order Details forwarded to Kafka, message: Transaction_id ".$params[self::TRANS_ID]."");
        }//..... end foreach() .....//
        return true;
    }//..... end of OrderPlacedAtSwift() ......//
	
	
	public function OrderPlacedAtSoldi($params)
    {

        if(!config('constant.SEND_DATA_TO_KAFKA')) {
            return true;
        }
        $utility  = new Utility();
        $producer = new Producer();
        foreach ($params[self::ITEMS] as $item){
            $details = [
                self::POS_SPEND_DATE    => $params['date'],
                self::POS_LOCATION      => $params[self::LOCATION],
                self::POS_SPEND_AMOUNT  => $params[self::AMOUNT],
                self::SALE_ITEM         => $item->prd_name,
                self::TRANS_ID    => $params[self::TRANS_ID],
                self::USER_ID           => $params[self::USER_ID],
                self::EMAIL             => $params[self::EMAIL],
                self::VENUE_ID          => $params[self::VENUE_ID]
            ];

            $wrapper = $utility->getTransactionWrapper(self::SUPER_PORTAL,self::POS_TRANSACTIONAL,"Soldi Order Api", $details);
            $producer->sendDataToKafka(self::TRANSACTIONS, $wrapper);
        }//..... end foreach() .....//
        return true;
    }//..... end of OrderPlacedAtStarrtec() .....//


		
}//..... end of OrderHook() .....//