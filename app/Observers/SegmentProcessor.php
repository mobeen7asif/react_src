<?php

namespace App\Observers;

use App\Models\Segment;
use App\Utility\ElasticsearchUtility;
use Illuminate\Support\Facades\Config;
use SplObserver;
use SplSubject;
use Elasticsearch\ClientBuilder;

class SegmentProcessor implements SplSubject
{

    private $observers = array();
    public $id;
    public $segment;
    public $index;
    public $client;

    /**
     * SegmentProcessor constructor.
     * @param $id
     */
    public function __construct($id)
    {
        set_time_limit(0);
        $this->id = $id;

        $this->client = ClientBuilder::create()->setHosts([Config::get('constant.ES_URL')])->build();

        if($this->id !=0 )
            $this->getSegment();
    }

    /**
     * Attach an SplObserver
     * @link http://php.net/manual/en/splsubject.attach.php
     * @param SplObserver $observer <p>
     * The <b>SplObserver</b> to attach.
     * </p>
     * @return void
     * @since 5.1.0
     */
    public function attach(SplObserver $observer)
    {
        $this->observers[] = $observer;
    }

    /**
     * Detach an observer
     * @link http://php.net/manual/en/splsubject.detach.php
     * @param SplObserver $observer <p>
     * The <b>SplObserver</b> to detach.
     * </p>
     * @return void
     * @since 5.1.0
     */
    public function detach(SplObserver $observer)
    {
        $key = array_search($observer,$this->observers, true);
        if($key){
            unset($this->observers[$key]);
        }
    }

    /**
     * Notify an observer
     * @link http://php.net/manual/en/splsubject.notify.php
     * @return void
     * @since 5.1.0
     */
    public function notify()
    {
        foreach ($this->observers as $value)
        {
            $value->update($this);
        }
    }

    /**
     * Get Segment Details.
     */
    private function getSegment()
    {
        $this->segment = Segment::find($this->id);
        $this->index = ElasticsearchUtility::generateIndexName($this->segment->company_id, $this->segment->venue_id);
    }//...... end of getSegment() .....//

    /**
     * Attach All the observer.
     */
    public function doAutoAttach()
    {
        $this->attach( new SegmentSMSCompute() );
        $this->attach( new SegmentEMAILCompute() );
        $this->attach( new SegmentPOINTMECompute() );
        $this->attach( new SegmentIncExcCompute() );

        $this->notify();
    }//..... end of doAutoAttach() .....//

    public function setSegments($segment_id='')
    {
        $this->id = $segment_id;
        $this->getSegment();
    }
}