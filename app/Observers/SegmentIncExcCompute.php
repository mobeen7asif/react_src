<?php

namespace App\Observers;

use Illuminate\Support\Facades\Redis;
use SplObserver;
use SplSubject;

class SegmentIncExcCompute implements SplObserver
{

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

        $included_patrons = $this->getIncludedPatronsData( $subject->segment );
        $excluded_patrons = $this->getExcludedPatronsData( $subject->segment );

        $this->saveInRedis( $subject->id, $included_patrons, 'INCLUDED_PATRON',$subject->segment->company_id);
        $this->saveInRedis( $subject->id, $excluded_patrons, 'EXCLUDED_PATRON',$subject->segment->company_id);
    }//..... end of update() .....//

    /**
     * @param $segment
     * @return array
     * Extract Included patrons from segment.
     */
    private function getIncludedPatronsData( $segment )
    {
        $patrons = [];
        $included_user = json_decode( $segment->included_user );

        if (!empty($included_user) && !is_null($included_user))
            foreach ( $included_user as $user )
                $patrons[] = $user;

        return $patrons;
    }//..... end of getIncludedPatronsData() ......//

    /**
     * @param $segment
     * @return array
     * Extract Excluded Patrons from segment.
     */
    private function getExcludedPatronsData( $segment )
    {
        $patrons = [];
        $excluded_user = json_decode( $segment->excluded_user );

        if (!empty($excluded_user) && !is_null($excluded_user))
            foreach ( $excluded_user as $user )
                $patrons[] = $user;

        return $patrons;
    }//..... end of getExcludedPatronsData() .....//

    /**
     * @param $segment_id
     * @param $patron_ids
     * @param $partial_key
     * Save data to REDIS.
     */
    private function saveInRedis($segment_id, $patron_ids, $partial_key,$comp_id)
    {
        if( empty($patron_ids) )
            return;

        $key ="SEGMENT_".$comp_id."_".$segment_id."_".$partial_key;
        Redis::SADD( $key, $patron_ids );
    }//..... end of saveInRedis() .....//
}