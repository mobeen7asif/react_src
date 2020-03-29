<?php

namespace App\Observers;

use Illuminate\Support\Facades\Redis;
use SplObserver;
use SplSubject;


class SegmentSMSCompute implements SplObserver
{
    private $redis;

    /**
     * Receive update from subject
     * @link http://php.net/manual/en/splobserver.update.php
     * @param SplSubject $subject <p>
     * The <b>SplSubject</b> notifying the observer of an update.
     * </p>
     * @return void
     * @since 5.1.0
     */
    public function update(SplSubject $subject)
    {

        $patron_ids = $this->getSegmentData( $subject->segment, config('constant.ES_INDEX_BASENAME'), $subject->client );

        $this->saveInRedis( $subject->id, $patron_ids,$subject->segment->company_id);
    }//..... end of update() .....//

    /**
     * @param $segment
     * @return array
     * Get Patrons Lie in Segment.
     */
    private function getSegmentData( $segment, $index, $client )
    {
        $personaData = [];
        $query = json_decode($segment->query, true);
        if (!is_array($query))
            $query = json_decode($query, true);



        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], array(
                "term" => array(
                    "sms_subscribed_flag" => true
                )
            ));
        }//..... end if() .....//

        $response = $client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
        ]);

        if(isset($response['hits']['hits']) && count($response['hits']['hits']) > 0){
            $personaData = array_merge($personaData, array_map(function($record) {
                return $record['_id'];
            }, $response['hits']['hits']));
        }


        return $personaData;
    }//..... end of getSegmentData() .....//




    /**
     * @param $id
     * @param $patron_ids
     * Save data to REDIS.
     */
    private function saveInRedis($id, $patron_ids,$company_id)
    {
        if( empty($patron_ids) )
            return;

        $key ="SEGMENT_".$company_id."_".$id."_SMS_SUBSCRIBER";
        foreach (array_chunk($patron_ids, ceil(count($patron_ids)/1000)) as $item)
            Redis::SADD( $key, $item );
    }//..... end of saveInRedis() .....//
}