<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 4/26/2018
 * Time: 12:20 PM
 */

namespace App\Utility;

use App\Exports\InvoicesExport;
use App\Exports\MemberExport;

use App\Exports\MemberExportWithDetails;
use App\Exports\MemberExportWithDetailsNew;
use App\Http\Controllers\API\SegmentController;
use App\Models\Campaign;

use App\Models\MemberTransaction;
use App\Models\Mission;
use App\Models\MissionUserEntry;
use App\Models\OfferStats;
use App\Models\Segment;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\UserCharityCoins;
use App\Models\UserSurveyAnswer;
use App\Models\Venue;
use App\Models\VenueEnteredLog;
use App\Models\VoucherUser;
use App\User;
use Illuminate\Support\Str;
use function Aws\filter;
use Carbon\Carbon;
use function foo\func;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class Segmentation
{
    private $index;
    public $excludedUsers;
    public function __construct($index)
    {
        $this->index = config('constant.ES_INDEX_BASENAME');

        Log::channel('custom')->info(['index name' => $this->index]);
    }//..... end of __construct() .....//

    /**
     * Get Detail Counter/data of Segment(s) from Redis.
     */
    function getSegmentDetailsFromRedis( $segment_ids, $channel = "", $include_patrons_ids = false, $get_total_segments_count_from_es = false )
    {
        $data = ['push_users' => 0, 'email_users' => 0, 'sms_users' => 0, 'kiosk_users' => 0, 'total_users' => 0,
            'excluded_users' => 0];

        $PK = $EK = $SK = [];
        $IM = $EM = [];

        if( !is_array($segment_ids) )
            $segment_ids = explode(',', $segment_ids);

        if( !is_array($channel) )
            $channel = [$channel];


        foreach ( $segment_ids as $id ) {
            $PK[] ="SEGMENT_".$id."_PUSH_SUBSCRIBER";
            $EK[] = "SEGMENT_".$id."_EMAIL_SUBSCRIBER";
            $SK[] = "SEGMENT_".$id."_SMS_SUBSCRIBER";
            $IM[] ="SEGMENT_".$id."_INCLUDED_PATRON";
            $EM[] = "SEGMENT_".$id."_EXCLUDED_PATRON";
        }//..... end foreach() .....//

        $excludedMembers    = Redis::SUNION( $EM );
        $allMembers         = Redis::SUNION( array_merge($PK, $EK, $SK, $IM) );
        $totalMembers       = array_diff( $allMembers, $excludedMembers );
        $pointMeMembers     = Redis::SUNION( array_merge( $PK, $IM ) );
        $emailMembers       = Redis::SUNION( array_merge( $EK, $IM ) );
        $smsMembers         = Redis::SUNION( array_merge( $SK, $IM ) );
        $includedMembers    = Redis::SUNION( $IM );

        $smsMembers         = array_diff( $smsMembers, $excludedMembers );
        $emailMembers       = array_diff( $emailMembers, $excludedMembers );
        $pointMeMembers     = array_diff( $pointMeMembers, $excludedMembers );

        $data['excluded_users'] = count( $excludedMembers );
        $data['included_users'] = count( $includedMembers );
        $data['total_users']    = count( $totalMembers );
        $data['push_users']     = count( $pointMeMembers );
        $data['email_users']    = count( $emailMembers );
        $data['sms_users']      = count( $smsMembers );
        $data['kiosk_users']    = count( $totalMembers );

        if ($get_total_segments_count_from_es) {
            $total = 0;
            foreach ( $segment_ids as $id ) {
                $query = Segment::select('query')->whereId($id)->first();

                if ($query) {
                    $query = json_decode($query->query, true);
                    if (is_array($query)) {
                        unset($query['query']['bool']['must_not']);
                        $total += $this->getTotalCounterFromEs($query);
                    }//..... end inner-if() .....//
                }//..... end if() ....//
            }//..... end foreach() .....//

            $data['total_users']    = $total;
        }//..... end if() .....//

        if( $channel ) {
            $chKeys = [];
            foreach ( $segment_ids as $id )
                foreach ( $channel as $item )
                    $chKeys[] ="SEGMENT_".$id."_".$item."_SUBSCRIBER";

            $selectedChannelsTotalPatrons = Redis::SUNION( $chKeys );
            $SCTotalMembers = array_diff( $selectedChannelsTotalPatrons, $excludedMembers );
            $data['total_percentage'] = $data['total_users'] == 0 ? 0 : number_format((count($SCTotalMembers) *100)/$data['total_users'], 2);
        }//..... populate Percentage .......//

        if( $include_patrons_ids ) {
            $data['excluded_patrons']   = $excludedMembers;
            $data['included_patrons']   = $includedMembers;
            $data['member_patrons']     = $totalMembers;
            $data['pointme_patrons']    = $pointMeMembers;
            $data['sms_patrons']        = $smsMembers;
            $data['email_patrons']      = $emailMembers;
        }//..... end if() .....//

        // $data['sms_cost'] = SMS_COST;

        return $data;
    }//..... end of getSegmentDetailsFromRedis() ......//

    /**
     * @return array
     * Get membership list to populate dropdown.
     */
    public function getMembershipTypeList()
    {
        $query = [
            'size' => 0,
            'aggs' => [
                "unique_membership_type" => [
                    "terms" => ['field' => "membership_type_name"]
                ]
            ],
            'query' => [
                'match' => [
                    'custom_doc_type' => config('constant.demographic')
                ]
            ]
        ];

        try {
            $result = ElasticsearchUtility::search($this->index, $query);
            return array_map(function($value) {
                return $value['key'];
            }, $result['aggregations']['unique_membership_type']['buckets']);
        } catch (\Exception $exception) {
            return [];
        }//..... end of try-catch() .....//
    }//..... end of search() ....//

    public function getRatingGradeList()
    {
        $query = [
            'size' => 0,
            'aggs' => [
                "unique_rating_grade" => [
                    "terms" => ['field' => "rating_grade_name"]
                ]
            ],
            'query' => [
                'match' => [
                    'custom_doc_type' => config('constant.demographic')
                ]
            ]
        ];

        try {
            $result = ElasticsearchUtility::search($this->index, $query);
            return array_map(function($value) {
                return $value['key'];
            }, $result['aggregations']['unique_rating_grade']['buckets']);
        } catch (\Exception $exception) {
            return [];
        }//..... end of try-catch() .....//
    }//..... end of getRatingGradeList() .....//

    public function getPosSaleItemsList()
    {
        //return [['id' => 1, 'name' => 'test 1'], ['id' => 2, 'name'=> 'Test 2']];
        $query = [
            'size' => 10000,
            'query' => [
                "bool" => [
                    "must" => [
                        [
                            "match" => [
                                'custom_doc_type' => config('constant.sale')
                            ]
                        ]
                    ]
                ]
            ]
        ];

        try {
            $result = ElasticsearchUtility::search($this->index, $query);
            return array_map(function($value) {
                return ['id' => $value['_source']['sale_id'], "name" => $value['_source']['sale_item']];
            }, $result['hits']['hits']);
        } catch (\Exception $exception) {
            return [];
        }//..... end of try-catch() .....//
    }//..... end of getPosSaleItemsList() .....//

    public function getNewSegmentDetails($query)
    {

        $data = ['email_users' => 0, 'sms_users' => 0, 'push_users' => 0, 'total_users' => 0, 'query' => $query,
            'data' => [], 'total_male' => 0, 'total_female' => 0, 'included_users' => [],
            'excluded_users' => $query['query']['bool']['must_not']['terms']['_id'] ?? []];

        $data['push_users']             = ElasticsearchUtility::count($this->index, $this->getPushQuery($query));
        $data['email_users']            = ElasticsearchUtility::count($this->index, $this->getEmailQuery($query));
        $data['sms_users']              = ElasticsearchUtility::count($this->index, $this->getSmsQuery($query));
        $data['user_have_no_email']     = ElasticsearchUtility::count($this->index, $this->getUsersHavingNoEmail($query));
        $data['total_male']             = ElasticsearchUtility::count($this->index, $this->getMaleQuery($query));
        $data['total_female']           = ElasticsearchUtility::count($this->index, $this->getFemaleQuery($query));
        $data['user_have_no_phone']     = ElasticsearchUtility::count($this->index, $this->getUsersHavingPhoneNumber($query));
        $data['sms_users']              = $data['sms_users'] - $data['user_have_no_phone'];
        $data['email_users']            = $data['email_users'] - $data['user_have_no_email'];
        $collection                     = collect(ElasticsearchUtility::getSource($this->index, array_merge($query, ["from" => 0, "size" => 10])))->unique('persona_id')->values()->all();
        $data['data']                   = $collection;


        $data['total_users']            = ElasticsearchUtility::count($this->index, $query);
        unset($query['query']['bool']['must_not']);

        return $data;

    }//..... end of getNewSegmentDetails() .....//

    public function getPaginationRecord($query, $from, $size)
    {
        return [
            'data'          => ElasticsearchUtility::getSource($this->index, array_merge($query, ["from" => $from, "size" => $size,"sort"=>['_id' => ['order' => 'desc']]])),
            'total_records' => ElasticsearchUtility::count($this->index, $query),
            'total_male'    => ElasticsearchUtility::count($this->index, $this->getMaleQuery($query)),
            'total_female' => ElasticsearchUtility::count($this->index, $this->getFemaleQuery($query))
        ];
    }//..... end of getPaginationRecord() .....//

    private function getPushQuery($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], ["term" => ["is_pointme_user" => true]]);
            array_push($query['query']['bool']['must'], ["term" => ["is_pointme_notifications" => true]]);
            return $query;
        }//..... end if() .....//

        return [];
    }//..... end of getPushQuery() .....//

    private function getEmailQuery($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "term" => ["email_subscribed_flag" => true]
            ]);
            return $query;
        }//..... end if() .....//
        return [];
    }//..... end of getEmailQuery() .....//

    private function getSmsQuery($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "term" => ["sms_subscribed_flag" => true]
            ]);
            return $query;
        }//..... end if() .....//
        return [];
    }//..... end of getSmsQuery() .....//

    private function getMaleQuery($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "match_phrase" => ["gender" => "M"]
            ]);
            return $query;
        }//..... end if() .....//
        return [];
    }//..... end of getMaleQuery() .....//

    private function getFemaleQuery($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "match_phrase" => ["gender" => "F"]
            ]);
            return $query;
        }//..... end if() .....//
        return [];
    }//..... end of getFemaleQuery() .....//

    /**
     * @param $criteria
     * Prepare Segment Query.
     * @return array
     */
    public function prepareSegmentQuery($criteria, $excluded_users,$segmentType): array
    {
       /* $venue = Venue::where(["venue_id"=>request()->venue_id])->first();
        $custom_fields = (!empty($venue)) ? json_decode($venue->custom_fields) : [];
        $custom_fields = collect($custom_fields);*/

        $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $allCustomFields = json_encode($custom_fields);
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields));

        $must = $query = [];
        $nested = [];
        $userForms =[];
        $iterator = 0;
        $is_user_form = 0;
        foreach ($criteria as ['name' => $name, 'value'=> $value]) :
            $match_all = (isset($value['match_all']) && $value['match_all'] == true ) ? true : false;
            //...... custom field logic   ....//
            $field_type = "";
            if(Str::is('custom_field_member_*', $name)){
                $field_type = $custom_fields->where("field_unique_id",$name)->first()->field_type ?? "";
                $is_user_form = $custom_fields->where("field_unique_id",$name)->first()->parent_id ?? 0;

            }

            if($is_user_form){
                if(isset($value['field_type']))
                    $field_type = $value['field_type'];

                if(!empty($field_type) && $field_type == "text")
                    $userForms[] = $this->getFormCustomText($value);

                if(!empty($field_type) && $field_type == "number")
                    $userForms[] = $this->getFormCustomNumber($value);

                if(!empty($field_type) && $field_type == "date")
                    $userForms[] = $this->getFormCustomDate($value);

                if(!empty($field_type) && $field_type == "datetime")
                    $userForms[] = $this->getFormDateTime($value);
                if(!empty($field_type) && $field_type == "bollean")
                    $userForms[] = $this->getFormCustomFieldBollean($value);
                if(!empty($field_type) && $field_type == "dropdown")
                    $userForms[] = $this->getFormCustomDropDownValues($value);
            }else{
                if(isset($value['field_type']))
                    $field_type = $value['field_type'];

                if(!empty($field_type) && $field_type == "text")
                    $nested[] = $this->getCustomText($value);

                if(!empty($field_type) && $field_type == "number")
                    $nested[] = $this->getCustomNumber($value);

                if(!empty($field_type) && $field_type == "date")
                    $nested[] = $this->getCustomDate($value);

                if(!empty($field_type) && $field_type == "datetime")
                    $nested[] = $this->getDateTime($value);
                if(!empty($field_type) && $field_type == "bollean")
                    $nested[] = $this->getCustomFieldBollean($value);
                if(!empty($field_type) && $field_type == "dropdown")
                    $nested[] = $this->getCustomDropDownValues($value);
                //..... end of custom field logic  ......//
            }




            switch ($name) :
                case 'gender':
                    $must[] = $this->getGenderQuery($value);
                    break;
                case 'residential_address.postal_code':
                    $must[] = $this->getResidentialAddressPostalCodeQuery($value);
                    break;
                case 'residential_address.state':
                    $must[] = $this->getResidentialAddressStateQuery($value);
                    break;
                case 'date_of_birth':
                    $must[] = $this->getDateOfBirthQuery($value);
                    break;

                case 'membership_type_id':
                    $must[] = $this->getMembershipTypeQuery($value);
                    break;
                case 'membership_status':
                    $must[] = $this->getMembershipStatusQuery($value);
                    break;
                case 'point_balance':
                    $must[] = $this->getPointBalanceQuery($value);
                    break;
                case 'rating_grade_id':
                    $must[] = $this->getRatingGradeNameQuery($value);
                    break;
                case 'creation_datetime':
                    $must[] = $this->getMembershipJoinDateTimeQuery($value);
                    break;
                case 'expiry_datetime':
                    $must[] = $this->getMembershipExpiryDateTimeQuery($value);
                    break;
                case 'membership_number':
                    $must[] = $this->getMembershipNumberQuery($value);
                    break;
                case 'bulk_member_import':
                    $must[] = $this->getBulkMembershipNumberQuery($value);
                    break;

                case 'gaming_player':
                    $must[] = $this->getGamingPlayerQuery($value);
                    break;
                case 'gaming_turnover':
                    $must = array_merge($must, $this->getGamingTurnOverQuery($value));
                    break;
                case 'gaming_spend':
                    $must = array_merge($must, $this->getGamingSpendQuery($value));
                    break;
                case 'cancel_credit_amount':
                    $must = array_merge($must, $this->getCancelCreditAmountQuery($value));
                    break;
                case 'recent_tickets':
                    $must[] = $this->getRecentTicketsQuery($value);
                    break;
                case 'last_updated_datetime':
                    $must[] = $this->getDrawWinnerQuery($value);
                    break;
                case 'Gaming_Spend_Time':
                    $must[] = $this->getGamingSpendTimeQuery($value);
                    break;
                case 'Gaming_Spend_day':
                    $must[] = $this->getGamingSpendDayQuery($value);
                    break;

                case 'pos_spend_date':
                    $must[] = $this->getPosSpendDateQuery($value);
                    break;
                case 'pos_sale_item':
                    $must[] = $this->getPosSaleItemQuery($value);
                    break;
                case 'POS_Spend_Time':
                    $must[] = $this->getPosSpendTimeQuery($value);
                    break;

//                case 'venue':
//                    $must[] = $this->getVenueUtilizationQuery($value);
//                    break;
//                case 'scan_qr_code':
//                    $must[] = $this->getQrCodeMemberIds($value);
//                    break;
               case 'user_sign_up':
                    $must[] = $this->getSignUpMemberIds($value);
                   break;
//                case 'user_gps_detect':
//                    $must[] = $this->getGpsMemberIds($criteria[$iterator]);
//                    break;
//                case 'user_optional_field':
//                    $must[] = $this->getFieldsMemberIds($value);
//                    break;

                case 'voucher_expiry':
                    $must[] = $this->voucherExpiry($value);
                    break;
                case 'voucher_status':
                    $must[] = $this->voucherStatus($value);
                    break;
                case 'punch_card_status':
                    $must[] = $this->punchCardStatus($value);
                    break;
                case 'token_not_used':
                    $must[] = $this->tokenNotUsed($value);
                    break;
                case 'token_used_in_charity':
                    $must[] = $this->tokenUsedInCharity($value);
                    break;
                case 'token_used':
                    $must[] = $this->tokenUsed($value);
                    break;
                case 'birth_day':
                    $must[] = $this->birthDay($value);
                    break;
                case 'last_login':
                    $must[] = $this->lastLogin($value);
                    break;
                case 'reffering_users':
                    $must[] = $this->referringUser($value);
                    break;
                case 'reffered_user':
                    $must[] = $this->refferedUser($value);
                    break;
                case 'enter_venue':
                    $must[] = $this->enterVenue($value);
                    break;
                case 'completed_survey':
                    $must[] = $this->completedSurvey($value);
                    break;
                case 'seen_videos':
                    $must[] = $this->seenVideos($value);
                    break;
                case 'campaign_triggers':
                    $must[] = $this->campaignTriggers($value);
                    break;
                case 'member_group':
                    $must[] = $this->memberGroups($value);
                    break;
                case 'user_source':
                    $must[] = $this->userSource($value);
                    break;
                case 'last_transaction':
                    $must[] = $this->lastTransaction($value);
                    break;
                case 'total_spending':
                    $must[] = $this->totalSpending($value);
                    break;
                case 'spender_percentage':
                    $must[] = $this->spenderPercentage($value);
                    break;
                case 'average_basket_value':
                    $must[] = $this->averageBasketValue($value);
                    break;
                case 'default_venue':
                    $must[] = $this->defaultVenue($value);
                    break;
                case 'postal_code':
                    $must[] = $this->postalCode($value);
                    break;
                case 'user_activity':
                    $must[] = $this->userActivity($value);
                    break;
                case 'gap_map_users':
                    $must[] = $this->gapMapUser($value);
                    break;
                case 'target_users':
                    $must[] = $this->targetUsers($value);
                    break;
                case 'user_region':
                    $must[] = $this->userReagion($value);
                    break;
                case 'venue_store_name':
                    $must[] = $this->getStoreBaseData($value);
                    break;

                default:
                    break;
            endswitch;
            $iterator++;
        endforeach;
        Log::channel('custom')->info(['$criteria' => $criteria]);

        $postCode = $criteria[0]['postcode'] ?? 0;
        $store_name = $criteria[0]['store_name'] ?? "";
        $query['query'] = ['bool' => ['must' => array_merge($must, [
            [
                'match' => [
                    'custom_doc_type' => config('constant.demographic')
                ]]]),
            'must_not' => [
                "terms" => [
                    "_id" => $excluded_users ?? []
                ]
            ]]];

        if($postCode != 0) {
            $query['query']['bool']['must'][] = ['match' => ['residential_address.postal_code' => $postCode]];
        }
        if($store_name != "") {
            //$query['query']['bool']['must'][] = ['match' => ['residential_address.postal_code' => $postCode]];
            $query['query']['bool']['must'][] = ['match' => ['business_name' => $store_name]];
/*            $query['query']['bool']['must'][] =
                [
                    "nested"=> [
                        "path"=> "custom_fields",
                        "query"=> [
                            "bool"=> [
                                 "must"=> [
                                     ['match' => ['custom_fields.store_name' => $store_name]]
                                ]
                            ]
                        ]
                    ]
                ];*/
        }


        if(!empty($nested)){
            $query['query']['bool']['must'][] =
             [
                 "nested"=> [
                 "path"=> "custom_fields",
            "query"=> [
                     "bool"=> [
                         (count($nested[0]) > 1) ? ($match_all == true) ? "must" : "should" :"must"=> [
                             count($nested[0]) > 1 ? $nested[0] : $nested[0]
                        ]
              ]
            ]
          ]
        ];
        }


        if(!empty($userForms)){
            $query['query']['bool']['must'][] =
                [
                    "nested"=> [
                        "path"=> "user_forms",
                        "query"=> [
                            "bool"=> [
                                (count($userForms[0]) > 1) ? ($match_all == true) ? "must" : "should" :"must"=> [
                                    count($userForms[0]) > 1 ? $userForms[0] : $userForms[0]
                                ]
                            ]
                        ]
                    ]
                ];
        }

        Log::channel('custom')->info(['build_segment_query' => json_encode($query)]);
        return $query;

    }//..... end of prepareSegmentQuery() .....//

    /**
     * @param $criteria
     * @param $excluded_users
     * @return array
     */
    public function prepareMemberSearchQuery($criteria, $excluded_users): array
    {
        $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $allCustomFields = json_encode($custom_fields);
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields));

        $must = $query = [];
        $nested = [];
        $userForms =[];
        $iterator = 0;
        $is_user_form = 0;
        foreach ($criteria as ['name' => $name, 'value'=> $value]) :
            $match_all = (isset($value['match_all']) && $value['match_all'] == true ) ? true : false;
            //...... custom field logic   ....//
            $field_type = "";
            if(Str::is('custom_field_member_*', $name)){
                $field_type = $custom_fields->where("field_unique_id",$name)->first()->field_type ?? "";
                $is_user_form = $custom_fields->where("field_unique_id",$name)->first()->parent_id ?? 0;

            }

            if($is_user_form){
                if(isset($value['field_type']))
                    $field_type = $value['field_type'];

                if(!empty($field_type) && $field_type == "text")
                    $userForms[] = $this->getFormCustomText($value);

                if(!empty($field_type) && $field_type == "number")
                    $userForms[] = $this->getFormCustomNumber($value);

                if(!empty($field_type) && $field_type == "date")
                    $userForms[] = $this->getFormCustomDate($value);

                if(!empty($field_type) && $field_type == "datetime")
                    $userForms[] = $this->getFormDateTime($value);
                if(!empty($field_type) && $field_type == "bollean")
                    $userForms[] = $this->getFormCustomFieldBollean($value);
                if(!empty($field_type) && $field_type == "dropdown")
                    $userForms[] = $this->getFormCustomDropDownValues($value);
            }else{
                if(isset($value['field_type']))
                    $field_type = $value['field_type'];

                if(!empty($field_type) && $field_type == "text")
                    $nested[] = $this->getCustomText($value);

                if(!empty($field_type) && $field_type == "number")
                    $nested[] = $this->getCustomNumber($value);

                if(!empty($field_type) && $field_type == "date")
                    $nested[] = $this->getCustomDate($value);

                if(!empty($field_type) && $field_type == "datetime")
                    $nested[] = $this->getDateTime($value);
                if(!empty($field_type) && $field_type == "bollean")
                    $nested[] = $this->getCustomFieldBollean($value);
                if(!empty($field_type) && $field_type == "dropdown")
                    $nested[] = $this->getCustomDropDownValues($value);
                //..... end of custom field logic  ......//
            }


            switch ($name) :
                case 'gender':
                    $must[] = $this->getGenderQuery($value);
                    break;
                case 'residential_address.postal_code':
                    $must[] = $this->getResidentialAddressPostalCodeQuery($value);
                    break;
                case 'residential_address.state':
                    $must[] = $this->getResidentialAddressStateQuery($value);
                    break;
                case 'date_of_birth':
                    $must[] = $this->getDateOfBirthQuery($value);
                    break;

                case 'membership_type_id':
                    $must[] = $this->getMembershipTypeQuery($value);
                    break;
                case 'membership_status':
                    $must[] = $this->getMembershipStatusQuery($value);
                    break;
                case 'point_balance':
                    $must[] = $this->getPointBalanceQuery($value);
                    break;
                case 'rating_grade_id':
                    $must[] = $this->getRatingGradeNameQuery($value);
                    break;
                case 'creation_datetime':
                    $must[] = $this->getMembershipJoinDateTimeQuery($value);
                    break;
                case 'expiry_datetime':
                    $must[] = $this->getMembershipExpiryDateTimeQuery($value);
                    break;
                case 'membership_number':
                    $must[] = $this->getMembershipNumberQuery($value);
                    break;
                case 'bulk_member_import':
                    $must[] = $this->getBulkMembershipNumberQuery($value);
                    break;

                case 'gaming_player':
                    $must[] = $this->getGamingPlayerQuery($value);
                    break;
                case 'gaming_turnover':
                    $must = array_merge($must, $this->getGamingTurnOverQuery($value));
                    break;
                case 'gaming_spend':
                    $must = array_merge($must, $this->getGamingSpendQuery($value));
                    break;
                case 'cancel_credit_amount':
                    $must = array_merge($must, $this->getCancelCreditAmountQuery($value));
                    break;
                case 'recent_tickets':
                    $must[] = $this->getRecentTicketsQuery($value);
                    break;
                case 'last_updated_datetime':
                    $must[] = $this->getDrawWinnerQuery($value);
                    break;
                case 'Gaming_Spend_Time':
                    $must[] = $this->getGamingSpendTimeQuery($value);
                    break;
                case 'Gaming_Spend_day':
                    $must[] = $this->getGamingSpendDayQuery($value);
                    break;

                case 'pos_spend_date':
                    $must[] = $this->getPosSpendDateQuery($value);
                    break;
                case 'pos_sale_item':
                    $must[] = $this->getPosSaleItemQuery($value);
                    break;
                case 'POS_Spend_Time':
                    $must[] = $this->getPosSpendTimeQuery($value);
                    break;

                case 'venue':
                    $must[] = $this->getVenueUtilizationQuery($value);
                    break;
                case 'scan_qr_code':
                    $must[] = $this->getQrCodeMemberIds($value);
                    break;
                case 'user_sign_up':
                    $must[] = $this->getSignUpMemberIds($value);
                    break;
                case 'user_gps_detect':
                    $must[] = $this->getGpsMemberIds($criteria[$iterator]);
                    break;
                case 'user_optional_field':
                    $must[] = $this->getFieldsMemberIds($value);
                    break;

                case 'voucher_expiry':
                    $must[] = $this->voucherExpiry($value);
                    break;
                case 'voucher_status':
                    $must[] = $this->voucherStatus($value);
                    break;
                case 'punch_card_status':
                    $must[] = $this->punchCardStatus($value);
                    break;
                case 'token_not_used':
                    $must[] = $this->tokenNotUsed($value);
                    break;
                case 'token_used_in_charity':
                    $must[] = $this->tokenUsedInCharity($value);
                    break;
                case 'token_used':
                    $must[] = $this->tokenUsed($value);
                    break;
                case 'birth_day':
                    $must[] = $this->birthDay($value);
                    break;
                case 'last_login':
                    $must[] = $this->lastLogin($value);
                    break;
                case 'reffering_users':
                    $must[] = $this->referringUser($value);
                    break;
                case 'reffered_user':
                    $must[] = $this->refferedUser($value);
                    break;
                case 'enter_venue':
                    $must[] = $this->enterVenue($value);
                    break;
                case 'completed_survey':
                    $must[] = $this->completedSurvey($value);
                    break;
                case 'seen_videos':
                    $must[] = $this->seenVideos($value);
                    break;
                case 'campaign_triggers':
                    $must[] = $this->campaignTriggers($value);
                    break;
                case 'member_group':
                    $must[] = $this->memberGroups($value);
                    break;
                case 'user_source':
                    $must[] = $this->userSource($value);
                    break;
                case 'last_transaction':
                    $must[] = $this->lastTransaction($value);
                    break;
                case 'total_spending':
                    $must[] = $this->totalSpending($value);
                    break;
                case 'spender_percentage':
                    $must[] = $this->spenderPercentage($value);
                    break;
                case 'average_basket_value':
                    $must[] = $this->averageBasketValue($value);
                    break;
                case 'default_venue':
                    $must[] = $this->defaultVenue($value);
                    break;
                case 'postal_code':
                    $must[] = $this->postalCode($value);
                    break;
                case 'user_activity':
                    $must[] = $this->userActivity($value);
                    break;
                case 'gap_map_users':
                    $must[] = $this->gapMapUser($value);
                    break;
                case 'target_users':
                    $must[] = $this->targetUsers($value);
                    break;
                case 'user_region':
                    $must[] = $this->userReagion($value);
                    break;
                case 'venue_store_name':
                    $must[] = $this->getStoreBaseData($value);
                    break;
                default:
                    break;
            endswitch;
            $iterator++;
        endforeach;
        $postCode = $criteria[0]['postcode'] ?? 0;
        $query['query'] = ['bool' => ['must' => array_merge($must, [[
            'match' => [
                'custom_doc_type' => config('constant.demographic')
            ]]]),
            'must_not' => [
                "terms" => [
                    "_id" => $excluded_users ?? []
                ]
            ]]];

        if($postCode != 0) {
            $query['query']['bool']['must'][] = ['match' => ['residential_address.postal_code' => $postCode]];
        }
        if(!empty($nested)){

            $query['query']['bool']['must'][] =
                [
                    "nested"=> [
                        "path"=> "custom_fields",
                        "query"=> [
                            "bool"=> [
                                (count($nested[0]) > 1) ? ($match_all == true) ? "must" : "should" :"must"=> [
                                    count($nested[0]) > 1 ? $nested[0] : $nested[0]
                                ]
                            ]
                        ]
                    ]
                ];
        }


        if(!empty($userForms)){

            $query['query']['bool']['must'][] =
                [
                    "nested"=> [
                        "path"=> "user_forms",
                        "query"=> [
                            "bool"=> [
                                (count($userForms[0]) > 1) ? ($match_all == true) ? "must" : "should" :"must"=> [
                                    count($userForms[0]) > 1 ? $userForms[0] : $userForms[0]
                                ]
                            ]
                        ]
                    ]
                ];
        }


        return $query;
    }//..... end of prepareSegmentQuery() .....//

    private function getQrCodeMemberIds($value){
        $qr_code = $value['qr_code'];
        $interval = $value['interval'];
        $match = '"qr_code":"'.$qr_code.'","interval":"'.$interval.'"';
        $segment_ids = Segment::where('query_parameters', 'like', '%'.$match.'%')->pluck('id')->toArray();
        $mission_ids = Mission::whereIn('target_segments',$segment_ids)->pluck('id')->toArray();
        $user_ids = MissionUserEntry::whereIn('mission_id',$mission_ids)->pluck('user_id')->toArray();
        $filter = array (
            'constant_score' =>
                array (
                    'filter' =>
                        array (
                            'terms' =>
                                array (
                                    'membership_id' =>
                                        $user_ids,
                                ),
                        ),
                ),
        );
        return $filter;
    }

    private function getSignUpMemberIds($value){
        if($value =='old_user' || $value ==='new_user')
            $data =  [
                "match" => [
                    "old_user" => ($value =='old_user')?true:false
                ]
        ];
        else
            $data = [
            "match" => ['custom_doc_type'=>'demographic']
        ];


        return $data;
    }

    private function getGpsMemberIds($value){

        $name = $value['name'];
        $venue_id = $value['value'];
        $interval = $value['interval'];
        $match = '"name":"'.$name.'","value":'.$venue_id.',"interval":'.$interval.'';
        $segment_ids = Segment::where('query_parameters', 'like', '%'.$match.'%')->pluck('id')->toArray();
        $mission_ids = Mission::whereIn('target_segments',$segment_ids)->pluck('id')->toArray();
        $user_ids = MissionUserEntry::whereIn('mission_id',$mission_ids)->pluck('user_id')->toArray();
        $filter =  [
            'constant_score' =>
                [
                    'filter' =>
                        [
                            'terms' =>
                                [
                                    'client_customer_id' =>
                                        $user_ids,
                                ],
                        ],
                ],
        ];
        return $filter;
    }

    private function getFieldsMemberIds($value){
        $match = '"name":"user_optional_field","value":"user_optional_field"';
        $segment_ids = Segment::where('query_parameters', 'like', '%'.$match.'%')->pluck('id')->toArray();
        $mission_ids = Mission::whereIn('target_segments',$segment_ids)->pluck('id')->toArray();
        $user_ids = MissionUserEntry::whereIn('mission_id',$mission_ids)->pluck('user_id')->toArray();
        $filter = array (
            'constant_score' =>
                array (
                    'filter' =>
                        array (
                            'terms' =>
                                array (
                                    'membership_id' =>
                                        $user_ids,
                                ),
                        ),
                ),
        );
        return $filter;
    }

    private function getGenderQuery($value): array
    {
        $gender = [];
        foreach ($value as $key => $gen){
            if($gen == "male")
                array_push($gender,"M");
            else if ($gen == "female")
                array_push($gender,"F");
            else if ($gen == "other")
                array_push($gender,"O");
            else
                array_push($gender,"");
        }

        return [
            'terms' => [
                'gender' => $gender
            ]
        ];

    }//..... end of getGenderQuery() .....//

    private function getResidentialAddressPostalCodeQuery($value): array
    {
        return [
            'terms' => [
                'residential_address.postal_code' => $value
            ]
        ];
    }//..... end of getResidentialAddressPostalCodeQuery() .....//

    private function getResidentialAddressStateQuery($value): array
    {
        return [
            'terms' => [
                'residential_address.state' => $value
            ]
        ];
    }//..... end of getResidentialAddressStateQuery() .....//

    private function getDateOfBirthQuery($value): array
    {
        $value = explode('-', $value);
        $lte = Carbon::now()->subYears((int) $value[0])->format('Y-m-d');
        $gte = Carbon::now()->subYears((int) end($value))->format('Y-m-d');
        return [
            'range' => [
                'date_of_birth' => [
                    'lte' => $lte,
                    'gte' => $gte,
                    'format' => 'yyyy-MM-dd'
                ]
            ]
        ];
    }//..... end of getDateOfBirthQuery() ......//

    private function getMembershipTypeQuery($value): array
    {
        return [
            'terms' => [
                'membership_type_name' => $value
            ]
        ];
    }//..... end of getMembershipTypeQuery() .....//

    private function getMembershipStatusQuery($value)
    {
        return [
            'match_phrase' => [
                'status' => $value
            ]
        ];
    }//..... end of getMembershipStatusQuery() ......//

    private function getRatingGradeNameQuery($value)
    {
        return [
            'terms' => [
                'rating_grade_name' => $value
            ]
        ];
    }//..... end of getRatingGradeNameQuery() .....//

    private function getMembershipJoinDateTimeQuery($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['memberJoin']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gt' => $value['fromDate'], 'lt' => $value['toDate']], $condition);
        endswitch;

        return [
            'range' => [
                'creation_datetime' => $condition
            ]
        ];
    }//..... end of getMembershipJoinDateTimeQuery() .....//

    private function getMembershipExpiryDateTimeQuery($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['memberExpire']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
                break;
        endswitch;

        return [
            'range' => [
                'expiry_datetime' => $condition
            ]
        ];
    }//..... end of getMembershipExpiryDateTimeQuery() ......//

    private function getMembershipNumberQuery($value)
    {
        $query = [];//'More Than', 'Less Than', 'Equal To', 'Not Equal To', 'Between'
        switch ($value['memberNumber']) :
            case 'More Than':
                $query['range'] = ['client_customer_id' => ['gt' => $value['from']]];
                break;
            case 'Less Than':
                $query['range'] = ['client_customer_id' => ['lt' => $value['from']]];
                break;
            case 'Equal To':
                $query['match'] = ['client_customer_id' => $value['from']];
                break;
            case 'Not Equal To':
                $query['bool'] = ['must_not'=> ["term" => ["client_customer_id" => ["value" => $value['from']]]]];
                break;
            case 'Between':
                $query['range'] = ['client_customer_id' => ['gte' => $value['from'], 'lte' => $value['to']]];
                break;
        endswitch;

        return $query;
    }//..... end of getMembershipNumberQuery() .....//

    private function getGamingPlayerQuery($value)
    {
        return [
            'match' => [
                'is_gamer' => $value === 'yes' ? true : false
            ]
        ];
    }//..... end of getGamingPlayerQuery() .....//

    private function getBulkMembershipNumberQuery($value): array
    {
        try {
            $inputFileType = PHPExcel_IOFactory::identify(public_path($value));
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load(public_path($value));
        } catch (\Exception $e) {
            die('Error loading file "' . pathinfo(public_path($value), PATHINFO_BASENAME) . '": ' . $e->getMessage());
        }//..... end of try-catch() .....//

        //  Get worksheet dimensions
        $sheet = $objPHPExcel->getSheet(0);
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        //  Loop through each row of the worksheet in turn
        $values = [];
        for ($row = 1; $row <= $highestRow; $row++) {
            //  Read a row of data into an array
            $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                NULL,
                TRUE,
                FALSE);
            $values[$row - 1] = (int)$rowData[0][0];
        }//..... end if() ......//

        return [
            'terms' => [
                'client_customer_id' => $values
            ]
        ];
    }//..... end of getBulkMembershipNumberQuery() ......//

    private function getGamingTurnOverQuery($value): array
    {
        $query = [];
        switch ($value['gaming_turnover']['condition']) :
            case 'More Than':
                $query['range'] = ['turnover' => ['gt' => $value['gaming_turnover']['v1']]];
                break;
            case 'Less Than':
                $query['range'] = ['turnover' => ['lt' => $value['gaming_turnover']['v1']]];
                break;
            case 'Equal To':
                $query['match'] = ['turnover' => $value['gaming_turnover']['v1']];
                break;
            case 'Not Equal To':
                $query['bool'] = ['must_not'=> ["term" => ["turnover" => ["value" => $value['gaming_turnover']['v1']]]]];
                break;
            case 'Between':
                $query['range'] = ['turnover' => ['gt' => $value['gaming_turnover']['v1'], 'lt' => $value['gaming_turnover']['v2']]];
                break;
        endswitch;

        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['transaction_date']['condition']) :
            case 'On':
                $condition = array_merge(['lte' => $value['transaction_date']['fromDate'], 'gte' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['transaction_date']['fromDate'], 'lte' => $value['transaction_date']['toDate']], $condition);
                break;
        endswitch;

        return [[
            'range' => [
                'transaction_datetime' => $condition
            ]
        ], $query];
    }//..... end of getGamingTurnOverQuery() .....///

    private function getGamingSpendQuery($value)
    {
        $query = [];
        switch ($value['gaming_spend']['condition']) :
            case 'More Than':
                $query['range'] = ['egm_spend_amount' => ['gt' => $value['gaming_spend']['v1']]];
                break;
            case 'Less Than':
                $query['range'] = ['egm_spend_amount' => ['lt' => $value['gaming_spend']['v1']]];
                break;
            case 'Equal To':
                $query['match'] = ['egm_spend_amount' => $value['gaming_spend']['v1']];
                break;
            case 'Not Equal To':
                $query['bool'] = ['must_not'=> ["term" => ["egm_spend_amount" => ["value" => $value['gaming_spend']['v1']]]]];
                break;
            case 'Between':
                $query['range'] = ['egm_spend_amount' => ['gt' => $value['gaming_spend']['v1'], 'lt' => $value['gaming_spend']['v2']]];
                break;
        endswitch;

        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['transaction_date']['condition']) :
            case 'On':
                $condition = array_merge(['lte' => $value['transaction_date']['fromDate'], 'gte' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['transaction_date']['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['transaction_date']['fromDate'], 'lte' => $value['transaction_date']['toDate']], $condition);
                break;
        endswitch;

        return [[
            'range' => [
                'egm_spend_date' => $condition
            ]
        ], $query];
    }//..... end of getGamingSpendQuery() .....//

    private function getCancelCreditAmountQuery($value)
    {
        $query = [];
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['condition']) :
            case 'More Than':
                $query['range'] = ['cancel_credit_amount' => ['gt' => $value['v1']]];
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['fromDate']], $condition);
                break;
            case 'Less Than':
                $query['range'] = ['cancel_credit_amount' => ['lt' => $value['v1']]];
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['fromDate']], $condition);
                break;
            case 'Equal To':
                $query['match'] = ['cancel_credit_amount' => $value['v1']];
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['fromDate']], $condition);
                break;
            case 'Not Equal To':
                $query['bool'] = ['must_not'=> ["term" => ["cancel_credit_amount" => ["value" => $value['v1']]]]];
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $query['range'] = ['cancel_credit_amount' => ['gt' => $value['v1'], 'lt' => $value['v2']]];
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
                break;
        endswitch;

        return [[
            'range' => [
                'last_updated_datetime' => $condition
            ]
        ], $query];
    }//..... end of getCancelCreditAmountQuery() .....//

    private function getRecentTicketsQuery($value)
    {
        $now = Carbon::now();
        $to = $now->format('Y-m-d');
        $condition = ['format' => 'yyyy-MM-dd', 'lte' => $to];

        switch ($value['v2']) :
            case 'Weeks':
                $to = $now->subWeeks($value['v1'])->format('Y-m-d');
                break;
            case 'Days':
                $to = $now->subDays($value['v1'])->format('Y-m-d');
                break;
            case 'Years':
                $to = $now->subYears($value['v1'])->format('Y-m-d');
                break;
            case 'Months':
                $to = $now->subMonths($value['v1'])->format('Y-m-d');
                break;
        endswitch;

        $condition = array_merge(['gte' => $to], $condition);

        return [
            'range' => [
                'last_updated_datetime' => $condition
            ]
        ];
    }//..... end of getRecentTicketsQuery() .....//

    private function getGamingSpendTimeQuery($value)
    {
        $time = explode('-', $value);
        $from = Carbon::parse($time[0])->format('Y-m-d H:i:s');
        $to = Carbon::parse(end($time))->format('Y-m-d H:i:s');

        return [
            'range' => [
                'start_date' => ['format' => 'yyyy-MM-dd HH:mm:ss', 'gte' => $from, 'lte' => $to]
            ]
        ];
    }//..... end of getGamingSpendTimeQuery() .....//

    private function getGamingSpendDayQuery($value)
    {
        $day = 0;
        switch ($value):
            case 'Monday':
                $day = 1;
                break;
            case 'Tuesday':
                $day = 2;
                break;
            case 'Wednesday':
                $day = 3;
                break;
            case 'Thursday':
                $day = 4;
                break;
            case 'Friday':
                $day = 5;
                break;
            case 'Saturday':
                $day = 6;
                break;
            case 'Sunday':
                $day = 7;
                break;
        endswitch;

        return [
            'script' => [
                'script' => [
                    'inline' => "doc['start_date'].date.dayOfWeek == {$day}"
                ]
            ]
        ];
    }//..... end of getGamingSpendDayQuery() .....//

    private function getPosSpendDateQuery($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['condition']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
                break;
        endswitch;

        return [
            'range' => [
                'sale_datetime' => $condition
            ]
        ];
    }//..... end of getPosSpendDateQuery() ......//

    private function getPosSaleItemQuery($value)
    {
        return [
            'terms' => [
                'sale_id' => array_map(function($val) {return $val['id'];}, $value)
            ]
        ];
    }//..... end of getPosSaleItemQuery() ......//

    private function getPosSpendTimeQuery($value)
    {
        $time = explode('-', $value);
        $from = Carbon::parse($time[0])->format('Y-m-d H:i:s');
        $to = Carbon::parse(end($time))->format('Y-m-d H:i:s');

        return [
            'range' => [
                'sale_datetime' => ['format' => 'yyyy-MM-dd HH:mm:ss', 'gte' => $from, 'lte' => $to]
            ]
        ];
    }//..... end of getPosSpendTimeQuery() .....//

    private function getVenueUtilizationQuery($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['condition']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
                break;
        endswitch;

        $beacon = [
            'terms' => [
                'beacon_id' => array_map(function($val) {return $val['id'];} , $value['beacons'])
            ]
        ];

        return [[
            'range' => [
                'visit_datetime' => $condition
            ]
        ], $beacon];
    }//..... end of getVenueUtilizationQuery() .....//

    public function getSegmentMembersInExcel($query)
    {
        $members = ElasticsearchUtility::getAllCustomMembersListNew($query, $this->index);

        ob_end_clean();
        ob_start();
        return Excel::download(new MemberExport($members), 'amplify_members.xlsx');
    }//..... end of getSegmentMembersInExcel() .....//

    public function getAllMembersInExcelBkup($query)
    {
        /*......................*/

        $members = ElasticsearchUtility::getAllCustomMembersListNew($query, $this->index);
        $membersAllDetail = ElasticsearchUtility::getAllCustomMembersListAll($query, $this->index);


        $allCampaignLogs = collect(ElasticsearchUtility::getMemberCampaignLogs($this->index))->groupBy('camp_id');


        $totalCampaigns = Campaign::groupBy('name')->pluck('name', 'id');


        $campArray = [];
        foreach($totalCampaigns as $campId => $campName){
            foreach($allCampaignLogs as $key => $value){
                if($key == $campId){
                    $campArray[$campName] = $value;
                }
            }
        }


        $campAdditionalData = ElasticsearchUtility::getVoucherPunchCardData($this->index);

        $finalData = [];
        foreach($campArray as $key => $log){
            $data = [];
            //loop on campaigns
            foreach($log as $value){
                $campMember = collect($members)->where('MemberId', $value['member_id'])->first();

                /*campaign sent or not start*/

                if($value['is_sent'] > 0){
                    $campMember['CampaignSent'] = "1";
                }else {
                    $campMember['CampaignSent'] = "0";
                }

                /*campaign sent or not ends*/

                /*is voucher redeemed starts*/

                $additionalData = $this->getCampaignAdditionalData($campAdditionalData, $value['member_id']);
                $campMember = array_merge($campMember, $additionalData);

                /*is voucher redeemed ends*/

                /*avoid to send null data starts*/
                if($campMember){
                    $data[] = $campMember;
                }
                /*avoid to send null data ends*/
            }
            $finalData[$key] = $data;
        }

        /*append members on first sheet start*/
        $appendMembers['AllMembers'] = $membersAllDetail;


        $finalData = ($appendMembers + $finalData);
        /*append members on first sheet ends*/


        /*..........*/

//        return Excel::download(new MemberExportWithDetailsNew($users_data, $member_data), 'amplify_members.csv');
        return Excel::download(new MemberExportWithDetailsNew($finalData), 'UsersWithCampaigns.xlsx');

    }//..... end of getSegmentMembersInExcel() .....//



    private function getCampaignAdditionalData($campAdditionalData, $member_id){

        $data = [];
        foreach($campAdditionalData as $additionalrow){
            if ($additionalrow['_source']['custom_doc_type'] == 'redeemed_voucher') {
                if($additionalrow['_source']['persona_id'] == $member_id){
                    $data['VoucherRedeemed'] = "1";
                }else{
                    $data['VoucherRedeemed'] = "0";
                }
            }  else if ($additionalrow['_source']['custom_doc_type'] == 'completed_punch') {
                if($additionalrow['_source']['persona_id'] == $member_id){
                    $data['PuchCompleted'] = "1";
                }else{
                    $data['PuchCompleted'] = "0";
                }
            }
        }
        return $data;
    }

    private function getPointBalanceQuery($value)
    {
        $query = [];
        $v1 = (int)str_replace(' ','', $value['v1']);

        switch ($value['pv1']) :
            case 'More Than':
                $query['range'] = ['mycash_balance' => ['gt' => $v1]];
                break;
            case 'Less Than':
                $query['range'] = ['mycash_balance' => ['lt' => $v1]];
                break;
            case 'Equal To':
                $query['match'] = ['mycash_balance' => $v1];
                break;
            case 'Not Equal To':
                $query['bool'] = ['must_not'=> ["term" => ["mycash_balance" => ["value" => $v1]]]];
                break;
            case 'Between':
                $query['range'] = ['mycash_balance' => ['gt' => $v1, 'lt' => (int)str_replace(' ','', $value['v2'])]];
                break;
        endswitch;

        return [$query];
    }//..... end of getPointBalanceQuery() .....//

    private function getDrawWinnerQuery($value)
    {
        $now = Carbon::now();
        $to = $now->format('Y-m-d');
        $condition = ['format' => 'yyyy-MM-dd', 'lte' => $to];

        switch ($value['v2']) :
            case 'Weeks':
                $to = $now->subWeeks($value['v1'])->format('Y-m-d');
                break;
            case 'Days':
                $to = $now->subDays($value['v1'])->format('Y-m-d');
                break;
            case 'Years':
                $to = $now->subYears($value['v1'])->format('Y-m-d');
                break;
            case 'Months':
                $to = $now->subMonths($value['v1'])->format('Y-m-d');
                break;
        endswitch;

        $condition = array_merge(['gte' => $to], $condition);

        return [
            'range' => [
                'start_date' => $condition
            ]
        ];
    }//..... end of getDrawWinnerQuery() .....//

    /**
     * @param $id
     * Remove Redis Keys.
     */
    public function removeExistRedisKeys($id)
    {
        Redis::DEL(["SEGMENT_".$id."_PUSH_SUBSCRIBER",
            "SEGMENT_".$id."_EMAIL_SUBSCRIBER",
          "SEGMENT_".$id."_SMS_SUBSCRIBER",
        "SEGMENT_".$id."_INCLUDED_PATRON",
    "SEGMENT_".$id."_EXCLUDED_PATRON"
        ]);
    }//..... end of removeExistRedisKeys() .....//

    /**
     * @param $query
     * @return int
     * Get total count by query from Elasticsearch.
     */
    public function getTotalCounterFromEs($query)
    {
        return ElasticsearchUtility::count($this->index, $query);
    }//..... end of getTotalCounterFromEs() .....//

    public function getAllMembersInExcel($query)
    {
        /*......................*/
        $members = ElasticsearchUtility::getAllCustomMembersListNew($query, $this->index);


        $campaign = Campaign::where(["campaigns.company_id"=>100,"campaigns.venue_id"=>295255])
            ->leftJoin("venues","venues.venue_id","=","campaigns.venue_id","campaigns.schedule_type");
        $allCampaignLogs = $campaign->with(['games.missions'])->get(["campaigns.*","venues.venue_name"])->toArray();

        $campaignsHeader = $campaign->pluck('campaigns.name', 'campaigns.id');

        $campAdditionalData = ElasticsearchUtility::getVoucherPunchCardData($this->index);

        $allCampUsers = [];
        foreach($allCampaignLogs as $key => $campaign){

            $userData = [];
            if($campaign['target_segments']){
//                [108]
                $segmentIds= explode(',', $campaign['target_segments']);
                $campSegments = Segment::select('id', 'name')->whereIn('id', $segmentIds)->get();

                $users = $this->getSavedSegmentDetails($campSegments->toArray(),$campaign['id']);


                /*................*/

                foreach($users['data'] as $row){

                    $singleUser['id']       = $row['persona_id'];
                    $singleUser['email']    = $row['emails']['personal_emails'];
                    $singleUser['phone']    = $row['phone_numbers']['mobile'];


                    /*campaign sent or not / campaign status*/
//                    $singleUser['status']  = $row['status'];

                    /*game missions*/
                    /*if($campaign['type'] == 'Gamification'){
                        if(count($campaign['games']) > 0){
                            if(count($campaign['games']['missions']) > 0){
                                foreach($campaign['games']['missions'] as $mission){
                                    $singleUser[$mission['title']]
                                }
                            }
                        }
                    }*/

                    /*append voucher and punch stats*/
                    $additionalData = $this->getCampaignAdditionalData($campAdditionalData, $row['persona_id']);
//

                    $mergedData = array_merge($singleUser, $additionalData);
                    $userData[] = $mergedData;

//                    $userData[] = $singleUser;
                }
                /*dd($userData);
                $finalData[$campaign['name']] = $userData;*/


                /*................*/
            }else{
                $singleUser['id']       = '';
                $singleUser['email']    = '';
                $singleUser['phone']    = '';
                $userData[] = $singleUser;
            }
            $allCampUsers[$campaign['id']] = $userData;
        }
        $appendMembers['AllMembers'] = $members;
//        dd($appendMembers);

        $allCampUsers = ($appendMembers+ $allCampUsers);

        /*dd($allCampUsers);
        exit('exit');*/

//        dd($finalData);
        /*..........*/

//        return Excel::download(new MemberExportWithDetailsNew($users_data, $member_data), 'amplify_members.csv');
        return Excel::download(new MemberExportWithDetailsNew($allCampUsers), 'UsersWithCampaigns.xlsx');

    }//..... end of getSegmentMembersInExcel() .....//

    public function getSavedSegmentDetails(Array $segments)
    {
        $seg = [];
        $tmp = [];
        $query = [];
        $excludedKeys = [];

        array_walk($segments, function($arr) use(&$seg) {
            $seg[] = $arr['id'];
        });

        Segment::whereIn('id', $seg)->get(['id', 'query_parameters','company_id'])
            ->each(function($segmentDetails) use(&$tmp, &$query, &$excludedKeys) {
                $parameters = json_decode($segmentDetails->query_parameters, true);
                $excludedKeys[] =  "SEGMENT_".$segmentDetails->company_id."_".$segmentDetails->id."_EXCLUDED_PATRON";
                foreach ($parameters as $key => $parameter) {
                    if (! in_array($parameter['name'], $tmp)) {
                        $tmp[] = $parameter['name'];
                        $query[] = $parameter;
                    }//..... end if() .....//
                }//..... end foreach() .....//
            });

        return $this->getNewSegmentDetails($this->prepareSegmentQuery($query, Redis::SUNION($excludedKeys),'Normal'));
    }

    private function voucherExpiry($value)
    {

        if($value['status'] == "Less than or equal"){
            $start_date = date('Y-m-d', strtotime('-'.$value['days']." days"))." 00:00";
            $end_date = date("Y-m-d")." 00:00";
        }else{
            $start_date = date("Y-m-d")." 00:00";
            $end_date = date('Y-m-d', strtotime('+'.$value['days']." days"))." 00:00";
        }

        $ids =VoucherUser::whereDate('voucher_start_date','<=',$start_date)->whereDate('voucher_end_date','>=',$end_date)->whereIn('voucher_id',$value['vouchers'])->pluck('user_id');
        //$ids = ElasticsearchUtility::getVoucherStatusPerDay($this->index,$start_date,$end_date,$value['vouchers']??'');
        return [
            "terms"=> [
                "_id"=> $ids??[]
            ]
        ];


    }//..... end of getSavedSegmentDetails() ......//

    /**
     * @param $value
     * @return array
     */
    private function voucherStatus($value)
    {
        switch ($value['status']) :
            case 'Redeemed':
                $ids = ElasticsearchUtility::getUserPromotions($this->index,$value['vouchers']??'');
                break;
            case 'Available':
                $ids = ElasticsearchUtility::avaliableVouchers($this->index,[ 'gte' => date("d-m-Y")." 00:00"],$value['vouchers']??'');
                break;
            case 'Expired':
                $ids = ElasticsearchUtility::avaliableVouchers($this->index,[ 'lt' => date("d-m-Y")." 00:00"],$value['vouchers']??'');
                break;
        endswitch;
        return [
            "terms"=> [
                "_id"=> $ids??[]
            ]
        ];

    }//..... end of voucherStatus() ......//

    private function punchCardStatus($value)
    {
        $punch_cards_id = "";
        foreach ($value['vouchers'] as $key => $value2)
            $punch_cards_id .= "*".$value2."* ";



        switch ($value['status']) :
            case 'Completed':

                //$ids = ElasticsearchUtility::completedPunchCard($this->index,$value['id']);
                $ids = ElasticsearchUtility::completedPunchCardMultipal($this->index,$punch_cards_id);
                break;
            case 'Not Completed':
                //$users = ElasticsearchUtility::completedPunchCard($this->index,$value['id']);
                $users = ElasticsearchUtility::completedPunchCardMultipal($this->index,$punch_cards_id);
                $ids = User::select("user_id")->whereNotIn('user_id', $users)->pluck('user_id');
                break;
        endswitch;
        return [
            "terms"=> [
                "_id"=> $ids??[]
            ]
        ];

    }//..... end of punchCardStatus() ......//

    private function tokenNotUsed($value)
    {
        $start_time = Carbon::now()->subHours($value['hours']);
        $end_time = Carbon::now();
        //...... get all user from UserCharityCoins table who donate the coin 2,3 or give hours ....//
        $ex_users = UserCharityCoins::select("user_id")->where(["status"=>"organization"])
            ->where('updated_at', '>=', $start_time)->where('updated_at', '<=', $end_time)
            ->get()->pluck("user_id");
        //...... now exclude that users and get all users who does't donate the coins in given hours  ....//
        $users = User::select("user_id")->whereNotIn('user_id', $ex_users)->pluck('user_id');
        return [
            "terms" => [
                "_id" => $users ?? []
            ]
        ];

    }//..... end of tokenNotUsed() ......//

    private function tokenUsedInCharity($value)
    {
        //.... get those users who donate the coins in given charity  .....//
        $users = UserCharityCoins::distinct()->where(["charity_id" => $value["charity_id"]])->get(["user_id"])->pluck("user_id");
        return [
            "terms" => [
                "_id" => $users ?? []
            ]
        ];
    }//..... end of tokenUsedInCharity() ......//

    private function tokenUsed($value)
    {
        //..... get those users who donate the given or greater then given amount of tokens  .....//
        $r =  UserCharityCoins::select(DB::raw('count(*) as total, user_id'))->groupBy('user_id')->get();
        if($value['status'] == "Equal")
            $users = $r->where("total", "=" , $value["tokens"])->pluck("user_id");
        else if($value['status'] == "More than")
            $users = $r->where("total", ">" , $value["tokens"])->pluck("user_id");
        else
            $users = $r->where("total", "<" ,$value["tokens"])->pluck("user_id");

        return [
            "terms" => [
                "_id" => $users ?? []
            ]
        ];
    }//..... End of function tokenUsed() .....//

    public function birthDay($value)
    {
        switch ($value['birthDayStatus']) :
            case 'Between':
                $ids = ElasticsearchUtility::dateOfBirthQuery($this->index,[ 'gte' => $value['fromDate'],'lte'=> $value['toDate'], 'format'=>'yyyy-MM-dd']);
                break;
            case 'Greater Then':
                $ids = ElasticsearchUtility::dateOfBirthQuery($this->index,[ 'gte' => $value['fromDate'],'format'=>'yyyy-MM-dd']);
                break;
            case 'Smaller Than':
                $ids = ElasticsearchUtility::dateOfBirthQuery($this->index,['lte'=> $value['fromDate'],'format'=>'yyyy-MM-dd']);
                break;
            case 'Equals':
                $ids = ElasticsearchUtility::birthDayByDateAndMonthScript($this->index,date("m",strtotime($value["fromDate"])),date("d",strtotime($value["fromDate"])));
                // $ids = ElasticsearchUtility::birthDayByDateAndMonth($this->index,[ 'gte' => $value['fromDate'],'lte'=> $value['fromDate'], 'format'=>'yyyy-MM-dd']);
                break;
        endswitch;

        return [
            "terms" => [
                "_id" => $ids ?? []
            ]
        ];
    }//..... End of function birthDay() .....//

    public function lastLogin($value)
    {
        if($value['status'] == "Less than or equal"){
            $start_date = date('Y-m-d', strtotime('-'.$value['days'].' days', strtotime(date("Y-m-d"))));
            $end_date = date('Y-m-d', strtotime('-1 days', strtotime(date("Y-m-d"))));
            $query = [
                "gte"   => $start_date,
                "lte"   => $end_date,
                'format' => 'yyyy-M-dd'
            ];

            //$users = User::select("user_id")->whereDate("login_time", ">=" , $start_date)->whereDate("login_time","<=",$end_date)->get()->pluck("user_id");
        }else{
            $start_date = date('Y-m-d', strtotime('-'.$value['days'].' days', strtotime(date("Y-m-d"))));
            $query = [
                "lte"   => $start_date,
                'format' => 'yyyy-M-dd'
            ];
            //$users = User::select("user_id")->whereDate("login_time", "<=" , $start_date)->get()->pluck("user_id");
        }
        return [
            "range" => [
                "last_login" => $query ?? []
            ]
        ];
    }//..... End of function lastLogin() .....//

    public function referringUser($value)
    {
        if($value['status'] == "Equal"){
            $query = [
                "gte"   => $value['count_users'],
                "lte"   => $value['count_users']
            ];
        }else if($value['status'] == "Less than or equal"){
            $query = [
                "lte"   => $value['count_users']
            ];
        }else{
            $query = [
                "gte"   => $value['count_users']

            ];
        }
        return [
            "range" => [
                "referred_user" => $query ?? []
            ]
        ];
    }//..... End of function referringUser() .....//

    public function enterVenue($value)
    {
        $days_ago = date('Y-m-d', strtotime('-'.$value['days'].' days', strtotime(date("Y-m-d"))));
        $query =  [
            "nested" => [
                "path" => "venues",
                "score_mode" => "avg",
                "query" => [
                    "bool" => [
                        "must" => [
                            ["match" => ["venues.venue_id" => $value['venue_id']]], [
                                "range" => [
                                    "venues.date" => [
                                        "gte" => $days_ago,
                                        "lte" => $days_ago,
                                        "format" => "yyyy-MM-dd"
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        if($value['status'] == "Not Visited"){
            $query = [
                "bool" => [
                    "must_not" => [
                        [
                            "nested" => [
                                "path" => "venues",
                                "query" => [
                                    "range" => [
                                        "venues.date" => [
                                            "gte" => $days_ago,
                                            "lte" => $days_ago,
                                            "format" => "yyyy-MM-dd"
                                        ]
                                    ]
                                ]
                            ]
                        ], [
                            "nested" => [
                                "path" => "venues",
                                "query" => [
                                    "term" => [
                                        "venues.venue_id" => [
                                            "value" => $value['venue_id']
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];

        }//---- end of if condeition  -----//
        return [$query];
    }//..... End of function enterVenue()  .....//

    public function defaultVenue($value)
    {
        $query =  [
            "nested" => [
                "path" => "venues",
                //"score_mode" => "avg",
                "query" => [
                    "bool" => [
                        "must" => [
                            ["match" => ["venues.venue_id" => $value['venue_id']]]
                        ]
                    ]
                ]
            ]
        ];

        return [$query];
    }//..... End of function defaultVenue() .....//

    public function completedSurvey($value)
    {
        //$users = DB::table("survey_question_answers")->where("user_id","!=",0)->where("edit_id",$value['survey_id'])->groupBy("user_id")->pluck("user_id");
        return [
            "terms" => [
                "surveys" => [$value['survey_id']] ?? []
            ]
        ];
    }//...... end of function completedSurvey()  .....//

    public function seenVideos($value)
    {
        //----- get all users who seen the target video  ......//

        return [
            "terms" => [
                "surveys" => [$value['video_id']] ?? []
            ]
        ];

    }//...... end of function seenVideos()  ......//

    public function campaignTriggers($value)
    {
        //..... get first x (10,20 or 30.....) users of the target campaign  .....//
        $users = collect(ElasticsearchUtility::campaignTriggers($this->index,$value['campaign_id'],$value['number_of_users']));
        $selected_users = $users->take($value['number_of_users']);

        return [
            "terms" => [
                "_id" => $selected_users ?? []
            ]
        ];

    }//...... end of function campaignTriggers()  ......//

    public function memberGroups($value)
    {
        return [
            "terms" => [
                "groups" => [$value['group_name']] ?? []
            ]
        ];

    }//...... end of function memberGroups  ......//

    public function userSource($value)
    {

        return [
            "match" => [
                "data_source" => $value['group_name'] ?? []
            ]
        ];

    }

    public function refferedUser($value)
    {
        if($value['is_refferd']){

            $query =  [
                "exists"=> [
                    "field"=> "referral_by"
                ]
            ];
        }else{

            $query = [
                "bool" => [
                    "must_not" => [
                        [
                            "exists" => [
                                "field" => "referral_by"
                            ]
                        ]
                    ]
                ]
            ];


        }

        return [$query];
    } //..... end of function refferedUser  ......//

    public function lastTransaction($value)
    {

        if($value["transactionType"] == "On"){
            $query = [
                "gte"   => $value['fromDate'],
                "lte"   => $value['fromDate'],
                'format' => 'yyyy-MM-dd'
            ];

        }elseif ($value["transactionType"] == "Before"){
            $query = [
                "lt"   => $value['fromDate'],
                'format' => 'yyyy-MM-dd'
            ];

        } elseif ($value["transactionType"] =="After"){
            $query = [
                "gt"   => $value['fromDate'],
                'format' => 'yyyy-MM-dd'
            ];
        }else{
            $query = [
                "gte"   => $value['fromDate'],
                "lte"   => $value['toDate'],
                'format' => 'yyyy-MM-dd'
            ];
        }
        return [
            "range" => [
                "last_transactions" => $query ?? []
            ]
        ];

    }//..... end of function lastTransaction

    public function totalSpending($value)
    {
        if($value['status'] = "More than"){
            $query = [
                "gt"   => $value['amount']
            ];
        }elseif ($value['status'] == "Less than"){
            $query = [
                "lt"   => $value['amount']
            ];
        }else{
            $query = [
                "gte"   => $value['amount'],
                "lte"   => $value['amount']
            ];
        }
        return [
            "range" => [
                "basket_value" => $query ?? []
            ]
        ];
    }//..... end of function totalSpending

    public function spenderPercentage($value)
    {
        $totalUsers = User::count();
        $percentage = $value["percentage"];
        $numberOfUsersToGet = (($totalUsers)*($percentage))/100;
        $numberOfUsersToGet = (int) round($numberOfUsersToGet);
        $users = User::orderBy("basket_value","desc")->where("basket_value",">",0)->limit($numberOfUsersToGet)->pluck('user_id');
        return [
            "terms" => [
                "_id" => $users ?? []
            ]
        ];
    }

    private function filterCampaign($totalCampaigns, $memberCampaignLogs)
    {
        $assignComapignsData=[];

        foreach($totalCampaigns as $key => $rowCampaign){
            $CheckCampaign =  $memberCampaignLogs->contains($key);

            if($CheckCampaign){
                array_push($assignComapignsData,[$rowCampaign =>'Yes']);
            } else{
                array_push($assignComapignsData,[$rowCampaign  => 'No']);
            }
        }
        return $assignComapignsData;

    }

    private function averageBasketValue($value)
    {
        if($value['status'] = "More than"){
            $query = [
                "gt"   => $value['amount']
            ];
        }elseif ($value['status'] == "Less than"){
            $query = [
                "lt"   => $value['amount']
            ];
        }else{
            $query = [
                "gt"   => $value['amount'],
                "lt"   => $value['amount']
            ];
        }
        return [
            "range" => [
                "avg_basket_value" => $query ?? []
            ]
        ];
    }//..... end of function spenderPercentage

    public function postalCode($value)
    {
        //$user = User::where("postal_code","=",$value['postcode'])->pluck("user_id");

        return [
            "match" => [
                "residential_address.postal_code" => $value['postcode'] ?? []
            ]
        ];
    }

    public function userActivity($value)
    {
        return [
            "terms" => [
                "activity" => $value['activity'] ?? []
            ]
        ];
    }

    private function getUsersHavingPhoneNumber($query)
    {
        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "exists" => ["field" => "devices.mobile"]
            ]);
            unset($query['query']['bool']['must_not']);
            $query['query']['bool']['must_not'][] = [
                "wildcard" => ["devices.mobile" => "*"]
            ];
            return $query;
        }


    }//..... end of getUsersHavingPhoneNumber() .....//


    private function getUsersHavingNoEmail($query)
    {

        if (is_array($query) && isset($query['query']['bool']['must'])) {
            array_push($query['query']['bool']['must'], [
                "exists" => ["field" => "emails.personal_emails"]
            ]);
            unset($query['query']['bool']['must_not']);
            $query['query']['bool']['must_not'][]=[
                "wildcard" => ["emails.personal_emails" => "*"]
            ];

            return $query;
        }//..... end if() .....//


    }//..... end of getUsersHavingPhoneNumber() .....//

    private function getLoginUsers($query)
    {
        return  [
            "query"=> [
                "bool"=> [
                    "must"=> [
                        [
                            "exists"=> [
                                "field"=> "is_pointme_notifications"
                            ]
                        ]
                    ],
                    "must_not"=> [
                        [
                            "wildcard"=> [
                                "is_pointme_notifications"=> "*"
                            ]
                        ]
                    ]
                ]
            ]
        ];

    }//..... end of getUsersHavingPhoneNumber() .....//


    public function gapMapUser($value)
    {
        return [
            "script" => [
            "script" => [
                "inline"=> "doc['persona_lname'].empty && doc['persona_fname'].empty  && doc['emails.personal_emails'].empty && doc['devices.mobile'].empty && doc['residential_address.residential_address_1'].length > 0",
                        "lang"=> "painless"
                     ]
                ]
        ];
    }
    public function getStoreBaseData($value)
    {
        $stores = collect($value['listStores'])->pluck("value");
        return [
            "terms" => [
                "business_name" => $stores ?? []
            ]
        ];
    }

    public function targetUsers($value)
    {
            return [
                "match" => [
                    "old_user" => ($value['group_name'] == "Old Users") ? true : false
                ]
            ];


    }

    public function userReagion($value)
    {
        return [
            "match" => [
                "region_type" => ($value['group_name'] == "UK") ? "uk" : "ireland"
            ]
        ];
    }

    public function getCustomText($value)
    {
        $is_match = (isset($value['match_all']) && $value['match_all'] == true) ? true : false;
        $v = strtolower($value['number']);
        if($is_match)
            return ["match" => ["custom_fields.{$value['field_name']}" => $v]];
        else
            return ["wildcard" => ["custom_fields.{$value['field_name']}" => ["value" => "*$v*"]]];

    }

    public function getCustomDate($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['customDate']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
        endswitch;

        return [
            'range' => [
                "custom_fields.{$value['field_name']}" => $condition
            ]
        ];
    }

    public function getCustomNumber($value)
    {
        $v = strtolower($value['number']);
        return ["wildcard" => ["custom_fields.{$value['field_name']}.normalize" => ["value" => "*$v*"]]];

    }

    public function getDateTime($value)
    {
        //$condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['customDate']) :
            case 'On':
                $condition = ['lte' => strtotime($value['fromDate'])*1000, 'gte' => strtotime($value['fromDate'])*1000];
                break;
            case 'Before':
                $condition = ['lt' => strtotime($value['fromDate'])*1000];
                break;
            case 'After':
                $condition = ['gt' => strtotime($value['fromDate'])*1000];
                break;
            case 'Between':
                $condition =['gte' => strtotime($value['fromDate'])*1000, 'lte' => strtotime($value['toDate'])*1000];
        endswitch;

        return [
            'range' => [
                "custom_fields.{$value['field_name']}" => $condition
            ]
        ];
    }

    public function getCustomFieldBollean($value){
        $v = $value['is_true'];
         return [
            "match" => [
                "custom_fields.{$value['field_name']}" => $v
            ]
        ];
    }

    public function getCustomDropDownValues($value)
    {

        if(count($value['custom_drop_down']) == 1){
            return [
                "match" => [
                    "custom_fields.{$value['field_name']}" => $value['custom_drop_down'][0]
                ]
            ];
        }else{
            $data = [];
            foreach ($value['custom_drop_down'] as $key => $value2){
                $data[] =[
                    "match" => [
                        "custom_fields.{$value['field_name']}" => $value2
                    ]
                ];
            }
            return $data;
        }

        /*return [
            "terms" => [
                "custom_fields.{$value['field_name']}" => $value['custom_drop_down'] ?? []
            ]
        ];*/
    }


    public function getFormCustomText($value)
    {
        $is_match = (isset($value['match_all']) && $value['match_all'] == true) ? true : false;
        $v = strtolower($value['number']);
        if($is_match)
            return ["match" => ["user_forms.{$value['field_name']}" => $v]];
        else
            return ["wildcard" => ["user_forms.{$value['field_name']}" => ["value" => "*$v*"]]];

    }

    public function getFormCustomDate($value)
    {
        $condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['customDate']) :
            case 'On':
                $condition = array_merge(['lte' => $value['fromDate'], 'gte' => $value['fromDate']], $condition);
                break;
            case 'Before':
                $condition = array_merge(['lt' => $value['fromDate']], $condition);
                break;
            case 'After':
                $condition = array_merge(['gt' => $value['fromDate']], $condition);
                break;
            case 'Between':
                $condition = array_merge(['gte' => $value['fromDate'], 'lte' => $value['toDate']], $condition);
        endswitch;

        return [
            'range' => [
                "user_forms.{$value['field_name']}" => $condition
            ]
        ];
    }

    public function getFormCustomNumber($value)
    {
        $v = strtolower($value['number']);
        return ["wildcard" => ["user_forms.{$value['field_name']}.normalize" => ["value" => "*$v*"]]];

    }

    public function getFormDateTime($value)
    {
        //$condition = ['format' => 'yyyy-MM-dd'];
        switch ($value['customDate']) :
            case 'On':
                $condition = ['lte' => strtotime($value['fromDate'])*1000, 'gte' => strtotime($value['fromDate'])*1000];
                break;
            case 'Before':
                $condition = ['lt' => strtotime($value['fromDate'])*1000];
                break;
            case 'After':
                $condition = ['gt' => strtotime($value['fromDate'])*1000];
                break;
            case 'Between':
                $condition =['gte' => strtotime($value['fromDate'])*1000, 'lte' => strtotime($value['toDate'])*1000];
        endswitch;

        return [
            'range' => [
                "user_forms.{$value['field_name']}" => $condition
            ]
        ];
    }

    public function getFormCustomFieldBollean($value){
        $v = $value['is_true'];
        return [
            "match" => [
                "user_forms.{$value['field_name']}" => $v
            ]
        ];
    }

    public function getFormCustomDropDownValues($value)
    {

        if(count($value['custom_drop_down']) == 1){
            return [
                "match" => [
                    "user_forms.{$value['field_name']}" => $value['custom_drop_down'][0]
                ]
            ];
        }else{
            $data = [];
            foreach ($value['custom_drop_down'] as $key => $value2){
                $data[] =[
                    "match" => [
                        "user_forms.{$value['field_name']}" => $value2
                    ]
                ];
            }
            return $data;
        }

        /*return [
            "terms" => [
                "custom_fields.{$value['field_name']}" => $value['custom_drop_down'] ?? []
            ]
        ];*/
    }



}//..... end of Segmentation class