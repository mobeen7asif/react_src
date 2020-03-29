<?php

namespace App\Http\Controllers\API;

use App\Models\Campaign;
use App\Models\MerchantStore;
use App\Models\NotificationEvent;
use App\Models\Segment;
use App\Http\Controllers\Controller;
use App\Observers\SegmentProcessor;
use App\User;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Utility\Segmentation;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Redis;
use App\Http\Controllers\API\ElasticSearchController;


class SegmentController extends Controller
{
    private $segmentation;

    /**
     * SegmentController constructor.
     */
    public function __construct()
    {
        $this->segmentation = new Segmentation(config('constant.ES_INDEX_BASENAME'));

    }//..... end of __construct() .....//

    /**
     * Get Segments List.
     */
    public function getSegmentList($company_id, $venue_id)
    {
        return Segment::whereCompanyId($company_id)->pluck('name', 'id');
    }//..... end of getSegmentList() .....//

    public function getsegmentType($company_id, $id)
    {
        return Segment::whereId($id)->whereCompanyId($company_id)->first();
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function getDetailSegmentList(Request $request)
    {
        $segment = Segment::whereCompanyId(request()->company_id)->whereVenueId(request()->venue_id)
            ->orderBy($request->name, $request->orderData);

        if ($request->has('segmentFilter') && $request->segmentFilter != 'All')
            $segment->where('type', $request->segmentFilter);

        if ($request->has('nameSearch'))
            $segment->where('name', 'like', '%' . $request->nameSearch . '%');

        return ['status' => true, 'totalSegments' => $segment->count()
            , 'data' => $segment->skip($request->offset)->take($request->limit)->get()];
    }//..... end of getDetailSegmentList() .....//

    /** Get Saved Segments Users.
     *
     *
     */
    public function getSegmentsUsers()
    {
        return $this->segmentation->getSegmentDetailsFromRedis(request()->segment_ids, '', false, true, request()->company_id);
    }//..... end of getSegmentsUsers() ......//

    /**
     * @param Request $request
     * @return array
     */
    public function deleteSegments(Request $request)
    {
        Segment::destroy($request->segmentID);
        return ['status' => true, 'message' => 'Segment deleted successfully!'];
    }//..... end of deleteSegments() .....//

    /**
     * Get new segment partials and build a query.
     * return query and data.
     * @return array
     */
    public function buildSegmentQuery()
    {
        if (request()->type == "saved")
            return $this->segmentation->getSavedSegmentDetails(request()->selectedSegments);


        return $this->segmentation->getNewSegmentDetails($this->segmentation->prepareSegmentQuery(request('segment'), request()->excluded_users, request()->segment_type));
    }//..... end of buildSegmentQuery() .....//

    public function getMembershipTypeList()
    {
        return $this->segmentation->getMembershipTypeList();
    }//..... end of getMembershipTypeList() .....//

    public function getRatingGradeList()
    {
        return $this->segmentation->getRatingGradeList();
    }//..... end of getRatingGradeList() .....//

    public function getPosSaleItemsList()
    {
        return $this->segmentation->getPosSaleItemsList();
    }//..... end of getRatingGradeList() .....//

    public function getSegmentMemberList(Request $request)
    {
        $size = 10;
        $from = 10 * request()->page;
        $query = request('query');

        if (request()->has('search') and request()->search) {
            $search = strtolower(request()->search);
            $search = explode(' ', $search);
            $fname = $search[0] ?? '';
            $lname = end($search);

            unset($query['query']['bool']['must_not']);

//            $searchQuery = [
//                'bool' => ["should" => [
//                    ['wildcard' => ["persona_fname" => ["value" => "*{$fname}*"]]],
//                    ['wildcard' => ["persona_lname" => ["value" => "*{$lname}*"]]]
//                ]]
//            ];
//
//            if (is_numeric(request()->search))
//                array_push($searchQuery['bool']['should'], ["match" => ["membership_id" => (int)request()->search]]);
            $searchQuery = [];

            //new search mobeen
            if ($request->has('search') && $request->search) {
                if (is_numeric($request->search)) {
                    $query['query']['bool']['must'][]['bool']['should'] = [
                        ['match_phrase' => ['persona_id' => $request->search]],
                    ];
                } else {
                    $nameSearch = explode(' ', $request->search);
                    if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {
                        array_push($query['query']['bool']['must'], ['wildcard' => ['persona_fname.normalize' => '*' . ($nameSearch[0] . '*')]]);
                        array_push($query['query']['bool']['must'], ['wildcard' => ['persona_lname.normalize' => '*' . ($nameSearch[1] . '*')]]);
                    } else {
                        array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                            ['wildcard' => ['persona_fname.normalize' => '*' . ($request->search . '*')]],
                            ['wildcard' => ['persona_lname.normalize' => '*' . ($request->search . '*')]],
                            ['wildcard' => ['persona_email' => '*' . ($request->search . '*')]]
                        ]
                        ]]);
                    }
                    //..... end of inner if-else() .....//
                }
                //..... end of if-else() .....//
            }//..... end of outer-if() .....//

            //array_push($query['query']['bool']['must'], $searchQuery);
        } elseif (request()->has('excluded_users') and !empty(request()->excluded_users)) {
            array_push($query['query']['bool']['must'], ['bool' => ["must_not" => ["terms" => ["_id" => request()->excluded_users]]]]);
        }//..... end if() .....//1

        array_push($query['query']['bool']['must'], ['match' => ['custom_doc_type' => config('constant.demographic')]]);
        return $this->segmentation->getPaginationRecord($query, $from, $size);
    }//..... end of getSegmentMemberList() .....//

    /**
     * @return array
     * Save New Segment to DB and push required data to Redis.
     */
    public function saveSegment()
    {

        $query2 = $query = request("query");
        unset($query['query']['bool']['must_not']);

        if (isset(request('new_segment')['segment_type'])) {
            $venueid = 0;
        } else {
            $venueid = request()->venue_id;
        }
        $data = [
            'type' => request('new_segment')['segment_type'] ?? 'Normal',
            'name' => request('new_segment')['name'],
            'description' => request('new_segment')['description'],
            'excluded_user' => request('excluded_users') ? json_encode(request('excluded_users')) : '',
            'included_user' => request('included_users') ? json_encode(request('included_users')) : '',
            'query_parameters' => json_encode(request('new_segment')['criterias']),
            'persona' => $this->segmentation->getTotalCounterFromEs($query) - count(request('excluded_users')),
            'query' => request("query") ? json_encode($query) : '',
            'status' => 1,
            'venue_id' => $venueid,
            'is_hidden' => request('isHidden'),
            'company_id' => request()->company_id
        ];

        try {

            $segment = Segment::updateOrCreate(['id' => request()->editSegmentId], $data);

            if (request()->editSegmentId)
                $this->segmentation->removeExistRedisKeys(request()->editSegmentId, request()->company_id);



            (new SegmentProcessor($segment->id))->doAutoAttach();


            //$query2['query']['bool']['must_not']['terms']['persona_id'] = request('excluded_users');
            $users = $this->segmentation->getNewSegmentDetails($query2);



            unset($users['query']);
            unset($users['data']);
            unset($users['included_users']);
            unset($users['excluded_users']);

            return ['status' => true, "message" => "Segment Saved Successfully.", 'segment_details' => $segment, 'segment_users' => $users];
        } catch (\Exception $e) {
            return ['status' => false, "message" => "Error Occurred While Saving Segment." . $e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of saveSegment() .....//

    /**
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * Export Segment Customized Members List.
     */
    public function exportSegment()
    {
        set_time_limit(0);
        ini_set("memory_limit", "255M");
        $query = json_decode(request()->esquery, true);
        if (request()->has('excluded_users') and request('excluded_users'))
            array_push($query['query']['bool']['must'], ['bool' => ["must_not" => ["terms" => ["_id" => json_decode(request()->excluded_users)]]]]);

        array_push($query['query']['bool']['must'], ['match' => ['custom_doc_type' => config('constant.demographic')]]);
        return $this->segmentation->getSegmentMembersInExcel($query);
    }//..... end of exportSegment() .....//


    public function exportAllUsers()
    {
        set_time_limit(0);
//        ini_set("memory_limit", "255M");
        ini_set("memory_limit", "-1");
        $query['query']['bool']['must'] = [['match' => ['custom_doc_type' => config('constant.demographic')]]];
        /*$query = [
            'size' => 100,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ]
                ]
            ],
        ];*/

        return $this->segmentation->getAllMembersInExcel($query);
    }//..... end of exportSegment() .....//

    /**
     * @param $id
     * @return mixed
     * Get Specific segment by id.
     */
    public function getSegment($id)
    {
        return Segment::findOrFail($id);
    }//..... end of getSegment() .....//

    /**
     * @param ElasticSearchController $elasticSearchController
     * @return array
     * Set Member's channel settings.
     */
    public function setMemberChannel(ElasticSearchController $elasticSearchController)
    {
        return $elasticSearchController->updateMemberChannelStatus(request()->id, request()->channel, request()->value);
    }//..... end of setMemberChannel() ......//

    /**
     * Upgrade/downgrade user account as merchant.
     * @param ElasticSearchController $elasticSearchController
     * @return array
     */
    public function upgradeMemberAccount(ElasticSearchController $elasticSearchController): array
    {
        MerchantStore::where(['user_id' => request()->user_id, 'company_id' => request()->company_id])->delete();
        $user = tap(User::whereUserId(request()->user_id)->first())->update(['is_merchant' => !!request()->isMerchant]);
        $venues = (new ElasticSearchController())->getUserSubscribedVenues(request()->user_id);

        if (request()->isMerchant)
            foreach (request()->businessList as $business)
                MerchantStore::create(array_merge(['business_id' => $business['business_id'], 'business_name' => $business['business_name']], request()->only(['user_id', 'company_id'])));

        foreach ($venues as $venue_id)
            $elasticSearchController->setUserAccountLevel(ElasticsearchUtility::generateIndexName(request()->company_id, $venue_id), request()->persona_id, request()->isMerchant);

        return ['status' => true, 'message' => 'Record saved successfully.'];
    }//..... end of upgradeMemberAccount() .....//

    /**
     * Get User's assigned businesses list.
     * @return array
     */
    public function getMemberAssignedBusinesses(): array
    {
        return [
            'status' => true,
            'data' => MerchantStore::where(['user_id' => request()->user_id, 'company_id' => request()->company_id])->get(['business_id', 'business_name'])
        ];
    }//..... end of getMemberAssignedBusinesses() .....//

    public function getAllDetailSegments(){
        $segments = Segment::whereIn('id',json_decode(\request()->segment))->get(['id','name','query_parameters as criteria']);
       return ['status'=>true, 'data' =>$segments->toArray()];
    }

    public function getMembershipType(Request $request)
    {
        $res = ElasticsearchUtility::searchMembershipType($request->value);
        return ["status" => true,"data"=>$res];
    }

    public function adjustMemberSubscription(ElasticSearchController $elasticSearchController)
    {
        try {
            $evnt= 'unsubscribe';
            $channel = (request()->channel =='sms_subscribed_flag')?'sms':((request()->channel =='email_subscribed_flag')?'email':'push');
            if(!request()->value) {
                NotificationEvent::create([
                    'user_id' => request()->id,
                    'event' => $evnt,
                    'event_type' => $channel,
                    'timestamp' => time(),
                    'email' => User::where('user_id',request()->id)->value('email')
                ]);
            }
            return $elasticSearchController->updateMemberSubscriptions(request()->id, request()->channel, request()->value);
        }
        catch(\Exception $e) {
            Log::channel('custom')->error('adjustMemberSubscription', [
                'adjustMemberSubscription_message' => $e->getMessage(),
                'adjustMemberSubscription_line' => $e->getLine()
            ]);
        }

    }//..... end of setMemberChannel() ......//
}//..... end of SegmentController.
