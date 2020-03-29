<?php

namespace App\Http\Controllers\API;

use App\Exports\GameMissionExport;
use App\Exports\InvoicesExport;
use App\Exports\UsersSheet;
use App\Exports\VoucherExport;
use App\Exports\VoucherExportReport;
use App\Models\Campaign;
use App\Models\Groups;
use App\Models\MemberTransaction;
use App\Models\PunchCard;
use App\Models\StampCompleted;
use App\Models\UserCustomFieldData;
use App\Models\UserStamp;
use App\Models\UserVenueRelation;
use App\Models\Venue;
use App\Models\Voucher;
use App\Models\VoucherLog;
use App\Models\VoucherUser;
use App\User;
use App\Utility\ElasticsearchUtility;
use App\Utility\Gamification;
use App\Utility\Segmentation;
use Carbon\Carbon;
use http\Client;
use function foo\func;
use function GuzzleHttp\Psr7\build_query;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Mockery\Exception;
use PhpParser\Node\Expr\Cast\Array_;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Hash;
use function GuzzleHttp\Psr7\str;
use App\Http\Controllers\API\GamificationController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\UserApiController;

class ElasticSearchController extends Controller
{
    /*sonar constants*/
    const STATUS = 'status';
    const LIST_DATA = 'listData';
    const SOURCE = '_source';
    const DOB = 'date_of_birth';
    const GROUPS = 'groups';
    const MEMBER_TYPE = 'member_type';
    const COMPANY_INFO = 'company_info';
    const USER_ID = 'user_id';
    const USER_FIRST_NAME = 'user_first_name';
    const USER_FAMILY_NAME = 'user_family_name';
    const GENDER = 'gender';
    const FORMAT = 'Y-m-d';
    const START_DATE = 'start_date';
    const END_DATE = 'end_date';
    const COUNTS = 'counts';
    const DATES = 'dates';
    const CREATED_AT = 'created_at';
    const LAST_RECEIVED = 'last_received';
    const RESULTS = 'results';
    const USES_REMAINING = 'uses_remaining';
    const FORMAT_ALL = 'Y-m-d H:i';
    const VOUCHER_END_DATE = 'voucher_end_date';
    const BUSINESSES = 'businesses';
    const BUSINESS = 'business';
    const VOUCHER_TYPE = 'voucher_type';
    const VOUCHER_AMOUNT = 'voucher_amount';
    const PUNCH_CARD_RULE = 'punch_card_rule';
    const IMAGE = 'image';
    const DELETED_AT = 'deleted_at';
    const PUNCH_CARD_COUNT = 'punch_card_count';
    const NO_OF_USE = 'no_of_use';
    const QUANTITY = 'quantity';
    const COLOR = 'color';
    const NO_OF_USES = 'no_of_uses';
    const DATEADDED = 'dateadded';
    const CAMP_TYPE = 'campaign_type';
    const SENT_CAMPS = 'sent_camps';
    const RANGE = 'range';
    const VOUCHER_VAL = 'voucher_val';
    const PERSONA_DEVICE_TOKEN = 'persona_device_token';
    const TERMS = 'terms';
    const VOUCHER_CODE = 'voucher_code';
    const PROMOTION_TEXT = 'promotion_text';
    const EMAIL = 'email';
    const VENUE_ID = 'venue_id';
    const PUNCH_CARD = 'punch_card';
    const MERCHANT_IDS = 'merchants_ids';
    const USER_IMAGE = 'user_image';
    const JOIN_DATE_IN_DAYS = 'join_date_in_days';
    const FORMAT_INDEX = 'format';
    const CREATION_DATETIME = 'creation_datetime';
    const DATE_ADDED = 'date_added';
    const VALUE = 'value';
    const MONTH = 'month';
    const TOTAL_SPEND = 'total_spend';
    const YMD = 'yyyy-M-dd';
    const TYPES_COUNT = 'types_count';
    const POSTAL_CODE = 'postal_code';
    const CUSTOM_DOC_TYPE = 'custom_doc_type';
    const MESSAGE = 'message';
    const REFERRAL_CODE = 'referral_code';
    const PERSONA_ID = 'persona_id';
    const QUERY = 'query';
    const COMPANY_ID = 'company_id';
    const HEADERS = 'headers';
    const CUSTOMER_ID = 'customer_id';
    const CUSTOM = 'custom';
    const AGGREGATIONS = 'aggregations';
    const TOTAL = 'total';
    const AVG_BASKET_SIZE = 'avg_basket_size';
    const COUNT = 'count';
    const RESIDENTIAL_ADDRESS = 'residential_address';
    const IS_MERCHANT = 'is_merchant';
    const FULL_DATE = 'Y-m-d H:i:s';
    const CLIENT_CUSTOMER_ID = 'client_customer_id';
    const MATCH = 'match';
    const ADDRESS = 'address';


    public $index = '';
    public $customFields = [];

    public function __construct()
    {
        $this->index = config('constant.ES_INDEX_BASENAME');
        set_time_limit(0);
        ini_set('max_execution_time', '600');
        ini_set('max_input_time', '600');
    }

    /**
     * @param Request $request
     * @param ElasticsearchUtility $elasticsearchUtility
     * @return string
     */
    public function createIndex(Request $request, ElasticsearchUtility $elasticsearchUtility)
    {
        try {
            if ($elasticsearchUtility->createIndex()) {
                return 'Mapping Created SuccessFully';
            }

        } catch (Exception $e) {
            return $e->getMessage();
        }//..... end of try-catch() .....//
    }//--- End of createIndex() --- //

    /**
     * @param Request $request
     * @param ElasticsearchUtility $elasticsearchUtility
     * @return string
     */
    public function insertDataElasticSearch(Request $request, ElasticsearchUtility $elasticsearchUtility)
    {
        try {
            if ($request->venue_id && $request->company_id) {
                $elasticsearchUtility->bulkInsertData($request->totalRecord,
                    $elasticsearchUtility->generateIndexName($request->company_id, $request->venue_id));
                return 'Data inserted successfully.';
            } else {
                return 'Required parameters are missing...';
            }//..... end if-else() ....//
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of insertDataElasticSearch() .....//

    /**
     * @param Request $request
     * @return mixed
     */
    public function getPatronData(Request $request)
    {

        $dataRecieve = ElasticsearchUtility::patronData($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
        $this->mapPatronData($dataRecieve['hits']['hits']);
        return (array_key_exists('hits', $dataRecieve)) ? [self::STATUS => true, self::LIST_DATA => $dataRecieve] : [self::STATUS => false];
    }//--- End of getPatronData() ---//

    public function mapPatronData(&$users)
    {
        foreach ($users as &$user) {
            if (!isset($user[self::SOURCE][self::DOB])) {
                $user[self::SOURCE][self::DOB] = '';
            }
            if (!isset($user[self::SOURCE][self::STATUS])) {
                $user[self::SOURCE][self::STATUS] = '';
            }
            if (isset($user['_source']['groups']) and is_array($user['_source']['groups'])) {
                $member = array_search('Member', $user['_source']['groups'], true);
                if (count($user['_source']['groups']) == 1 and $user['_source']['groups'][$member] == 'Member') {
                    $user['_source']['member_type'] = 'Customer';
                } else {
                    if (count($user['_source']['groups']) == 1) {
                        $user['_source']['member_type'] = $user['_source']['groups'][0];
                    } else {
                        $user['_source']['member_type'] = $user['_source']['groups'][1];
                    }
                }
            } else {
                $user['_source']['member_type'] = '';
            }

        }
    }

    public function updateMember(Request $request)
    {

        try {
            //check if user exists in mysql
            $user = User::where('user_mobile', $request->mobile_number)->where('user_id', '!=', $request->input('user_id'))->first();
            if ($user) {
                return [self::STATUS => false, self::MESSAGE => 'User with this email or phone already exists'];
            }

            $company_info = $request->input('company_info');
            $user = User::find($request->input('user_id'));
            $fidMember = (!empty($user->groups)) ? $user->groups : json_encode(["Member"]);


            $params_to_update = [
                self::USER_FIRST_NAME => $request->input('first_name'),
                self::USER_FAMILY_NAME => $request->input('last_name'),
                self::GENDER => $request->input(self::GENDER),
                "company_info" => json_encode($company_info),
                'dob' => ($request->show_dob) ? Carbon::parse($request->date_of_birth)->format(self::FORMAT) : null,
                'user_lat' => $request->home_address_lat,
                'user_long' => $request->home_address_long,
                self::ADDRESS => $request->home_address,
                "address2" => $request->address2,
                self::POSTAL_CODE => $request->user_postal_code,
                'user_mobile' => $request->mobile_number,
                'referral_code' => $request->referral_code,
                'city' => $request->city,
                'country' => $request->country,
                'state' => $request->state,
                'is_active' => $request->member_status == true ? 1 : 0,
                'store_name' => $request->store_name,
                'groups' => (!empty($request->member_type)) ? json_encode(['Member', $request->member_type]) : json_encode(['Member']),
                //'custom_fields' => collect(json_decode($request->custom_fields)),
            ];
            $checkuser = DB::table("users")->where("user_id", $request->user_id)->first();
            if (empty($checkuser)) {
                $params_to_update["user_id"] = $request->user_id;
                User::insert($params_to_update);
                $user = User::find($request->input('user_id'));
                $fidMember = (!empty($user->groups)) ? $user->groups : [];
            }


            $user->update($params_to_update);
            $params_to_update[self::PERSONA_ID] = $request->input(self::USER_ID);

            $user->member_type = $request->member_type;
            $user->price_id = $request->price_id;
            $this->updateUserES($user, $request->member_type, $fidMember);
            (new ElasticsearchUtility())->bulkUserDataInsertNew(User::where('user_id', $user->user_id)->get(), '');
            return [self::STATUS => true, self::MESSAGE => 'Member updated successfully.'];
        }
        catch (\Exception $e) {
            Log::channel('custom')->info('updateMember_error', ['updateMember_error' => $e->getMessage()]);
        }

    }//--- End of updateMember() ---//

    private function updateUserES($user, $memberType, $fidMember)
    {

        $member_type = $memberType;

        $fidMember = json_decode($fidMember, true);


        $custom_fields = json_decode($user->custom_fields, true);
        if (empty($custom_fields))
            $custom_fields = [];
        else
            $custom_fields = [$custom_fields];


        $userData = [
            self::PERSONA_ID => $user->user_id,
            'membership_id' => $user->user_id,
            'persona_fname' => $user->user_first_name,
            'persona_lname' => $user->user_family_name,

            'gender' => $user->gender ?? "",
            'date_of_birth' => Carbon::parse($user->dob)->format('Y-m-d'),
            'postal_code' => $user->postal_code,
            'address2' => $user->address2,
            'custom_doc_type' => config('constant.demographic'),
            'status' => $user->is_active == 1 ? 'active' : 'inactive',
        ];


        $source = "";
        foreach ($userData as $key => $value) {
            $source .= "ctx._source['$key'] = '$value';";
        }

        if (isset($member_type) && !empty($memberType)) {
            $member_type = ucfirst($member_type);

            $source .= "ctx._source['groups'] = ['Member','$member_type'];";
        } else {
            $source .= "ctx._source['groups'] = ['Member'];";
        }


        $query = [
            'script' => [
                'source' => $source
            ],
            self::QUERY => [
                'bool' => [
                    'must' => [
                        [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.demographic')]],
                        [self::MATCH => [self::PERSONA_ID => $user->user_id]]
                    ]
                ]
            ]
        ];
        ElasticsearchUtility::updateByQuery('', $query);

        //soldi call only when we have soldi setup project
        if(config('constant.SOLDI_DEFAULT_PATH') != "") {
            $api_key = config('constant.SOLDI_API_KEY');
            $api_secret = config('constant.SOLDI_SECRET');
            if (request()->has(self::COMPANY_ID) && request()->company_id == config('constant.COMPANY_IRE_ID')) {
                $api_key = config('constant.SOLDI_IRE_APIKEY');
                $api_secret = config('constant.SOLDI_IRE_SECRET');
            }

            $res = (new \GuzzleHttp\Client())->request('PUT', config('constant.SOLDI_DEFAULT_PATH') . 'customer/updatemembership', [
                'headers' => [
                    'X-API-KEY' => $api_key,
                    'SECRET' => $api_secret
                ],
                'form_params' => [
                    'type' => $member_type ?? '',
                    self::CUSTOMER_ID => $user->soldi_id,
                ]
            ]);
            $res = json_decode($res->getBody());

            if ($res->success == "TRUE") {
                Log::channel(self::CUSTOM)->info('responseFromSoldi', ['response' => $res, "INPUT" => [
                    'type' => $member_type ?? '',
                    self::CUSTOMER_ID => $user->soldi_id,
                ]]);
                sleep(1);
                $found = false;
                if (!empty($member_type)) {
                    foreach ($fidMember as $value) {
                        if ($member_type == $value) {
                            $found = true;
                        }
                    }
                }

                VoucherUser::where('group_id', '>', '1')->where('user_id', $user->user_id)->delete();

                if (!$found && !empty($member_type)) {
                    (new GamificationController())->changeMemberShip($user->user_id);
                }

                if (!empty($custom_fields)) {
                    (new ElasticsearchUtility())->bulkUserDataInsertNew(User::where('user_id', $user->user_id)->get(), '');

                }

                return ['status' => true];
            } else {
                Log::channel(self::CUSTOM)->info('responseFromSoldi', ['response' => $res, "INPUT" => [
                    'price_id' => $member_type ?? '',
                    self::CUSTOMER_ID => $user->soldi_id,
                ]]);
                return [self::STATUS => false];
            }
        }


    }//..... end of updateUserES() .....//

    /**
     * @param Request $request
     * @return mixed
     */
    public function getAutSuggestData(Request $request)
    {
        $dataRecieve = ElasticsearchUtility::autoSuggestData($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
        return (array_key_exists('hits', $dataRecieve)) ? [self::STATUS => true, self::LIST_DATA => $dataRecieve] : [self::STATUS => false];
    }//--- End of getPatronData() ---//

    /**
     * @return array
     */
    public function getMemberSaleDetails()
    {
        $saleDetails = ElasticsearchUtility::memberSaleDetails(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), request()->persona_id);
        $lastSaleDate = isset($saleDetails[self::AGGREGATIONS]['last_sale_date']['value_as_string']) ? Carbon::parse($saleDetails[self::AGGREGATIONS]['last_sale_date']['value_as_string']) : null;
        return [
            'number_of_sale' => $saleDetails['hits'][self::TOTAL] ?? '',
            self::AVG_BASKET_SIZE => $saleDetails[self::AGGREGATIONS][self::AVG_BASKET_SIZE][self::VALUE] ?? 0,
            self::TOTAL_SPEND => $saleDetails[self::AGGREGATIONS][self::TOTAL_SPEND][self::VALUE] ?? '',
            'last_purchase_date' => $lastSaleDate ? $lastSaleDate->format('m/d/Y') : '',
            'last_purchase_time' => $lastSaleDate ? $lastSaleDate->format('H:i') : ''
        ];
    }//..... end of getMemberSaleDetails() .....//

    /**
     * @return array
     * return member stats
     */
    public function allMemberStats(Request $request)
    {
        $filter = $request->filter;
        if ($filter == 'day') {
            $filter_date = Carbon::now()->subDays(1)->toDateTimeString(); // 1 day
        } else if ($filter == 'week') {
            $filter_date = Carbon::now()->subDays(7)->toDateTimeString(); // 1 week
        } else if ($filter == self::MONTH) {
            $filter_date = Carbon::now()->subDays(30)->toDateTimeString(); // 1 month
        } else {
            $filter_date = Carbon::now()->subDays(365)->toDateTimeString(); // 1 year
        }

        $filter_check = ($filter) ? $filter_date : $filter;

        $saleDetails = ElasticsearchUtility::allMemberStats(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_date);
        $total_members = ElasticsearchUtility::countMembers(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id));
        $datewise_total_members = ElasticsearchUtility::countDateWiseTotalMembers(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_check, $request);
        $new_members = ElasticsearchUtility::getNewMembers(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_date);
        $total_males = ElasticsearchUtility::countGenders(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_check, $request, 'M');
        $total_females = ElasticsearchUtility::countGenders(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_check, $request, 'F');
        $total_others = ElasticsearchUtility::countGenders(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_check, $request, 'O');
        $total_unknown = ElasticsearchUtility::countUnknownGenders(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $filter_check, $request);

        return [
            self::AVG_BASKET_SIZE => $saleDetails[self::AGGREGATIONS][self::AVG_BASKET_SIZE][self::VALUE] ?? 0,
            self::TOTAL_SPEND => $saleDetails[self::AGGREGATIONS][self::TOTAL_SPEND][self::VALUE] ?? '',
            'total_members_count' => $total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE],
            'datewise_total_members' => $datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE],
            'new_members_count' => $new_members[self::COUNT],
            'male_percentage' => ($datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] > 0) ? round(($total_males[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] / $datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE]) * 100, 2) : 0,
            'female_percentage' => ($datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] > 0) ? round(($total_females[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] / $datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE]) * 100, 2) : 0,
            'other_percentage' => ($datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] > 0) ? round(($total_others[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] / $datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE]) * 100, 2) : 0,
            'unknown_percentage' => ($datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] > 0) ? round(($total_unknown[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE] / $datewise_total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE]) * 100, 2) : 0
        ];
    }//..... end of allMemberStats() .....//

    public function datewiseGenderCountQuery($gender)
    {
        return [self::QUERY => [
            'bool' => [
                'must' => [
                    [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.demographic')]],
                    [self::MATCH => [self::GENDER => $gender]]
                ]
            ]
        ]];
    }

    /**
     * @return array
     */
    public function getMemberDetail()
    {
        try {
            $memberDetails = ElasticsearchUtility::memberDetails(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), request()->persona_id);


            $user = User::where(self::USER_ID, request()->persona_id)->first();
            $memberDetails['hits']['hits'][0][self::SOURCE]["company_info"] = (isset($user) && !empty($user->company_info)) ? json_decode($user->company_info) : [];

            if ($memberDetails['hits']['hits'] > 0) {
                $memberDetails['hits']['hits'][0][self::SOURCE][self::REFERRAL_CODE] = isset($user) ? $user->referral_code : '';
                if (isset($user)) {
                    $lat_long = ['lat' => $user->user_lat, 'lng' => $user->user_long];
                    $memberDetails['hits']['hits'][0][self::SOURCE]['lat_long'] = $lat_long;
                } else {
                    $memberDetails['hits']['hits'][0][self::SOURCE]['lat_long'] = ['lat' => 0.0, 'lng' => 0.0];
                }

                $memberDetails['hits']['hits'][0]['_source']['postal_code'] = isset($memberDetails['hits']['hits'][0]['_source']['residential_address']['postal_code']) ? $memberDetails['hits']['hits'][0]['_source']['residential_address']['postal_code'] : $user->postal_code ?? "";

                if ($user) {
                    $memberDetails['hits']['hits'][0]['_source']['gender'] = isset($memberDetails['hits']['hits'][0]['_source']['gender']) ? $memberDetails['hits']['hits'][0]['_source']['gender'] : $user->gender;
                    $memberDetails['hits']['hits'][0]['_source']['address'] = ($user->address == null || $user->address == '') ? '' : $user->address;
                    $memberDetails['hits']['hits'][0]['_source']['old_user'] = $user->old_user;
                    $memberDetails['hits']['hits'][0]['_source']['member_status'] = $user->is_active;
                    $memberDetails['hits']['hits'][0]['_source']['custom_fields'] = $memberDetails['hits']['hits'][0]['_source']['custom_fields'] ?? [];
                } else {
                    $memberDetails['hits']['hits'][0]['_source']['address'] = '';
                    $memberDetails['hits']['hits'][0]['_source']['gender'] = '';
                    $memberDetails['hits']['hits'][0]['_source']['old_user'] = 0;
                    $memberDetails['hits']['hits'][0]['_source']['member_status'] = 'inactive';
                    $memberDetails['hits']['hits'][0]['_source']['custom_fields'] = [];
                }

                $memberDetails['hits']['hits'][0][self::SOURCE][self::JOIN_DATE_IN_DAYS] = isset($memberDetails['hits']['hits'][0][self::SOURCE][self::CREATION_DATETIME]) ? Carbon::now()->diffInDays(Carbon::parse($memberDetails['hits']['hits'][0][self::SOURCE][self::CREATION_DATETIME])) : '';
                $memberDetails['hits']['hits'][0][self::SOURCE][self::JOIN_DATE_IN_DAYS] = $memberDetails['hits']['hits'][0][self::SOURCE][self::JOIN_DATE_IN_DAYS] == 0 ? 1 : $memberDetails['hits']['hits'][0][self::SOURCE][self::JOIN_DATE_IN_DAYS];
                if ($user) {
                    $memberDetails['hits']['hits'][0][self::SOURCE]['member_image'] = ($user->user_avatar != null && $user->user_avatar != '') ? url('/users/thumbs/thumb_' . $user->user_avatar) : url('/users/thumbs/user_avatar.png');
                } else {
                    $memberDetails['hits']['hits'][0][self::SOURCE]['member_image'] = url('/users/thumbs/user_avatar.png');
                }

                if (isset($memberDetails['hits']['hits'][0]['_source']['groups']) and is_array($memberDetails['hits']['hits'][0]['_source']['groups'])) {
                    $groups = $memberDetails['hits']['hits'][0]['_source']['groups'];
                    $member = array_search('Member', $groups, true);
                    if (count($groups) == 1 and $groups[$member] == 'Member') {
                        $memberDetails['hits']['hits'][0]['_source']['member_type'] = 'Member';
                    } else {
                        if (count($groups) == 1) {
                            $memberDetails['hits']['hits'][0]['_source']['member_type'] = $groups[0];
                        } else {
                            $memberDetails['hits']['hits'][0]['_source']['member_type'] = $groups[1];
                        }
                    }
                } else {
                    $memberDetails['hits']['hits'][0]['_source']['member_type'] = '';
                }


                /*                $url = config('constant.SOLDI_DEFAULT_PATH');
                                $api_key = config('constant.SOLDI_API_KEY');
                                $api_secret = config('constant.SOLDI_SECRET');
                                $companyName = 'GBK';
                                if (request()->has('company_id')) {
                                    if (request()->company_id == config('constant.COMPANY_IRE_ID')) {
                                        $api_key = config('constant.SOLDI_IRE_APIKEY');
                                        $api_secret = config('constant.SOLDI_IRE_SECRET');
                                        $companyName = 'gbkire';
                                    }
                                }
                                $res = (new \GuzzleHttp\Client())->request('GET', $url . 'pricing?business_id=' . request()->company_id, [
                                    'headers' => [
                                        'X-API-KEY' => $api_key,
                                        'SECRET' => $api_secret
                                    ]
                                ]);
                                $member_types = [];

                                $res = json_decode($res->getBody()->getContents());
                                if ($res->status) {
                                    foreach ($res->data as $data) {
                                        $temp = [
                                            'field' => $data->price_id,
                                            'label' => $data->price_title
                                        ];
                                        $member_types[] = $temp;
                                    }
                                }*/
                $memberDetails = $memberDetails['hits']['hits'][0]['_source'];


                //-------- member custom fields logic goes here convert milisecond to date time  ......//
                $userCustomFields = isset($memberDetails['custom_fields']) ? $memberDetails['custom_fields'] : collect([]);
                $userCustomFields = $this->filterUserCustomFields($userCustomFields);


                $memberDetails['custom_fields'] = $userCustomFields;
                //........ end of custom field logic   ......//
                $memberGroup = Groups::get(['group_id as field', 'group_name as label']);
                return ['status' => true, 'member' => $memberDetails, 'member_types' => $memberGroup];
            } else {
                return [self::STATUS => false, 'member' => []];
            }

        } catch (\Exception $e) {
            dd($e->getMessage());
            return ['status' => false, 'member' => []];
        }
    }//..... end of getMemberDetail() .....//

    public function filterUserCustomFields($userCustomFields)
    {
        /*$allCustomFields = Venue::select("custom_fields")->where("venue_id", request()->venue_id)->first();
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields->custom_fields));*/

        $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $allCustomFields = json_encode($custom_fields);
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields));

        if (count($userCustomFields) > 0) {

            foreach ($userCustomFields as $key => $value) {
                $field_type = $this->getFieldType($key);
                if ($field_type == "datetime") {
                    $seconds = $userCustomFields[$key] / 1000;
                    $userCustomFields[$key] = date("d-m-Y H:i:s", $seconds);
                }

            }
            return $userCustomFields;
        } else {
            return collect([]);
        }
    }


    public function campaignGraphsData(Request $request)
    {
        try {
            $filter = $request->filter;
            switch ($filter) :
                case 'week':
                    $dates = $this->generateDateRange(Carbon::now()->subDays(6), Carbon::now());
                    break;
                case self::MONTH:
                    $dates = $this->generateDateRange(Carbon::now()->subDays(30), Carbon::now());
                    break;
                case 'year':
                    $dates = [];
                    $years = [];
                    for ($i = 0; $i <= 12; $i++) {
                        $date = date(self::FORMAT, strtotime(date('Y-m-01') . " -$i months"));
                        $dates[] = [
                            self::START_DATE => $date,
                            self::END_DATE => $this->lastday(explode('-', $date)[1], explode('-', $date)[0])
                        ];
                        $years[] = Carbon::parse($date)->format('M') . ' ' . Carbon::parse($date)->year;
                    }
                    $is_send_counts = ElasticsearchUtility::yearCampaignGraphsData(ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id), $dates);
                    return [self::STATUS => true, self::COUNTS => $is_send_counts, self::DATES => $years];
                    break;
                default:
                    break;
            endswitch;
            $is_send_counts = ElasticsearchUtility::campaignGraphsData(ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id), $dates);
            return [self::STATUS => true, self::COUNTS => $is_send_counts, self::DATES => $dates];
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getMemberStampCards() ---//

    public function pointsGraphData(Request $request)
    {
        try {
            $point = Lt_Transaction::where(self::CUSTOMER_ID, $request->persona_id)->orderBy(self::CREATED_AT, 'desc')->first();
            $filter = $request->filter;
            switch ($filter) :
                case 'week':
                    $dates = $this->generateDateRange(Carbon::now()->subDays(6), Carbon::now());
                    break;
                case self::MONTH:
                    $dates = $this->generateDateRange(Carbon::now()->subDays(30), Carbon::now());
                    break;
                case 'year':
                    $dates = [];
                    $years = [];
                    for ($i = 1; $i <= 12; $i++) {
                        $date = date(self::FORMAT, strtotime(date('Y-m-01') . " -$i months"));
                        $dates[] = [
                            self::START_DATE => strtotime($date),
                            self::END_DATE => strtotime($this->lastday(explode('-', $date)[1], explode('-', $date)[0]))
                        ];
                        $years[] = Carbon::parse($date)->format('M') . ' ' . Carbon::parse($date)->year;
                    }
                    $point_counts = $this->yearPointsData($dates);
                    $last_received = $point->created_at;
                    return [self::LAST_RECEIVED => isset($point) ? $last_received->toDateString() : '', self::STATUS => true, self::COUNTS => $point_counts, self::DATES => $years];
                    break;
                default:
                    break;
            endswitch;
            $point_counts = $this->getPointsGraphData($dates);
            $last_received = $point->created_at;
            return [self::LAST_RECEIVED => isset($point) ? $last_received->toDateString() : '', self::STATUS => true, self::COUNTS => $point_counts, self::DATES => $dates];
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getMemberStampCards() ---//

    private function generateDateRange(Carbon $start_date, Carbon $end_date)
    {
        $dates = [];

        for ($date = $start_date->copy(); $date->lte($end_date); $date->addDay()) {
            $dates[] = $date->format(self::FORMAT);
        }

        return $dates;
    }

    function firstDay($month = '', $year = '')
    {
        if (empty($month)) {
            $month = date('m');
        }
        if (empty($year)) {
            $year = date('Y');
        }
        $result = strtotime("{$year}-{$month}-01");
        return date(self::FORMAT, $result);
    }

    private function lastday($month = '', $year = '')
    {
        if (empty($month)) {
            $month = date('m');
        }
        if (empty($year)) {
            $year = date('Y');
        }
        $result = strtotime("{$year}-{$month}-01");
        $result = strtotime('-1 second', strtotime('+1 month', $result));
        return date(self::FORMAT, $result);
    }

    public function getPointsGraphData($dates)
    {
        $finalResult = [];
        foreach ($dates as $date) {
            $start_date = $date . ' 00:00:00';
            $end_date = $date . ' 23:59:59';
            $count = Lt_Transaction::where(self::CREATED_AT, '>=', strtotime($start_date))
                ->where(self::CREATED_AT, '<=', strtotime($end_date))->count();
            $finalResult[] = $count;
        }
        return $finalResult;
    }//..... end of pointsDataGraph() .....//

    // function to get  the address
    function getLatLong($address)
    {
        $array = array('lat' => 0.0, 'lng' => 0.0);
        if (!isset($address)) {
            return $array;
        }

        $geo = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($address) . "&key=AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI");
        // We convert the JSON to an array
        $geo = json_decode($geo, true);
        // If everything is cool
        if ($geo[self::STATUS] = 'OK') {
            if (count($geo[self::RESULTS]) > 0) {
                $latitude = $geo[self::RESULTS][0]['geometry']['location']['lat'];
                $longitude = $geo[self::RESULTS][0]['geometry']['location']['lng'];
                $array = array('lat' => $latitude, 'lng' => $longitude);
            } else {
                $array = array('lat' => 0.0, 'lng' => 0.0);
            }
        } else {
            $array = array('lat' => 0.0, 'lng' => 0.0);
        }

        return $array;
    }


    public function getMemberVouchers(Request $request)
    {
        $dataRecieve = VoucherUser::where('user_id', request()->persona_id)->orderBy(request()->sorting, request()->sortingOrder);
        if (!empty(request()->start_date) && !empty(request()->end_date)) {

            $dataRecieve->whereDate('voucher_start_date', '<=', request()->start_date . ' 00:00:00')->whereDate('voucher_end_date', '>=', request()->end_date . ' 00:00:00');
        }
        $data = ['status' => true, 'data' => $dataRecieve->skip(request()->offSet)->take(request()->pageSize)->get(), 'count' => $dataRecieve->count()];
        $vouchers = [];
        foreach ($data['data'] as $key => $value) {
            $voucherData = Voucher::where('id', $value['voucher_id'])->first()->toArray();
            $data['data'][$key]['user_voucher'] = [[
                'name' => $voucherData['name'],
                'discount_type' => $voucherData['discount_type'],
                'basket_level' => $voucherData['basket_level'],
                'isNumberOfDays' => $voucherData['isNumberOfDays'],
                'promotion_text' => $voucherData['promotion_text'],
                'no_of_uses' => $voucherData['no_of_uses'],
                'business' => $voucherData['business'],
                'voucher_avial_data' => $this->getVoucherAvailDetail($value[self::VOUCHER_CODE], json_decode($voucherData['voucher_avial_data'], true)),
                'image' => $voucherData['image'],
                'pos_ibs' => $voucherData['pos_ibs'],
                'start_date' => $voucherData['start_date'],
                'amount' => $voucherData['amount']
            ]];

            $start_date = strtotime(Carbon::parse($value['voucher_start_date'])->format('Y-m-d h:i:s'));
            $end_date = strtotime(Carbon::parse($value[self::VOUCHER_END_DATE])->format('Y-m-d h:i:s'));
            $current_date = strtotime(date('Y-m-d h:i:s'));

            if ($current_date > $end_date) {
                $voucher_status = 'Expired';

            } else if ($value[self::USES_REMAINING] == 0) {
                $voucher_status = 'Redeemed';
            } else if ($start_date <= $current_date && $end_date >= $current_date) {
                $voucher_status = 'Active';
            } else {
                $voucher_status = 'Inactive';
            }
            //$data['data'][$key]['user_voucher'][0]['voucher_avial_data'] =;
            $data['data'][$key]['voucher_status'] = $voucher_status;
            if (!isset($voucherData[self::BUSINESS])) {
                $data['data'][$key][self::BUSINESS]['business_name'] = '';
            }
            $data['data'][$key]['active'] = false;


        }

        return $data;
    }//--- End of getMemberVouchers() ---//

//    wasim starts
    public function getMemberStampCards(Request $request)
    {
        $usersStamps = (new PunchCard());


        $data = ['status' => true, 'data' => $usersStamps->skip(request()->offSet)->take(request()->pageSize)->get(), 'count' => $usersStamps->count()];

        if (!empty($data)) {
            $totalPoints = 0;
            foreach ($data['data'] as $key => $value) {
                $userData = UserStamp::selectRaw('sum(credit) as credit_points,sum(debit) as debit_points,user_id,punch_id,id,created_at')->where(['user_id' => $request->persona_id])->groupBy('user_id')->first();
                $avalable = UserStamp::selectRaw('sum(credit) as credit_points,sum(debit) as debit_points,user_id,punch_id,id,created_at')->where(['user_id' => $request->persona_id, 'punch_id' => $value['id']])->groupBy('user_id')->first();

                $initialTotal = 0;
                $avalablePoints = 0;
                if ($userData) {
                    $initialTotal = $userData->credit_points - $userData->debit_points;
                    if ($initialTotal < 0)
                        $initialTotal = 0;
                    $initial_points = $initialTotal % 5;

                }
                if ($avalable) {
                    $avalablePoints = $userData->credit_points - $userData->debit_points;
                    if ($avalablePoints < 0)
                        $avalablePoints = 0;
                    $avalablePoints = $avalablePoints % 5;
                }
                $data['data'][$key]['report'] = UserStamp::where(['user_id' => $request->persona_id, 'punch_id' => $value['id']])->get() ?? [];
                $data['data'][$key]['user'] = User::where('user_id', $request->persona_id)->first();
                $data['data'][$key]['totalpoints'] = $initialTotal;
                $data['data'][$key]['completed_stamps'] = StampCompleted::where(['user_id' => $request->persona_id])->get()->count();
                $business = Voucher::where('id', $value['voucher_id'])->first(['business', 'image']);
                $data['data'][$key]['business'] = $business['business'] ?? [];
                $data['data'][$key]['image'] = (!empty($business['image'])) ? url('/' . $business['image']) : '';

                $data['data'][$key]['available_stamp'] = $avalablePoints ?? 0;
                $data['data'][$key]['active'] = false;

            }
        }

        return $data;
    }//--- End of getMemberStampCards() ---//

    public function getMysqlPunches($stamp_ids, $persona_id = 0)
    {

        $mysql_punches = PunchCard::whereNotIn('id', $stamp_ids)->get()->toArray();
        $mysql_punches_arr = [];
        foreach ($mysql_punches as $mysql_punch) {
            $temp =
                [
                    "_source" => [
                        "quantity" => 0,
                        "punch_card_rule" =>
                            $mysql_punch
                        ,
                        "mrcht_id" => "0",
                        "punch_card_count" => 0,
                        "persona_id" => $persona_id,
                        'report' => []
                    ]

                ];
            $temp['_source']['punch_card_rule']['image_full_path'] = file_exists(public_path() . '/' . $mysql_punch['image']) ? url('/') . '/' . $mysql_punch['image'] : url('/') . '/images/no_image.png';
            $temp['_source']['punch_card_rule']['dateadded'] = strtotime($mysql_punch['created_at']);
            $mysql_punches_arr['hits']['hits'][] = $temp;
        }
        return $mysql_punches_arr;
    }


    public function makeChartArray($filter, $punch_cards)
    {
        $axis = [];
        $punch_cards_size = count($punch_cards);
        if ($filter == 'day') {
            for ($i = 0; $i < 24; $i++) {
                $filter_date = Carbon::now()->subHours(23 - $i)->hour;
                $filter_date_d = Carbon::now()->subHours(23 - $i)->format(('h A'));
                $axis[$filter_date_d][] = $i + 1;
                for ($y = 0; $y < $punch_cards_size; $y++) {
                    $punch_card_date = Carbon::createFromTimestamp((integer)($punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT] / 1000));
                    $punch_card_date = $punch_card_date->hour;
                    if ($filter_date == $punch_card_date) {
                        $axis[$filter_date_d][] = $punch_cards[$y][self::COLOR];
                    }
                }
            }
        }
        if ($filter == 'week') {
            for ($i = 0; $i < 7; $i++) {
                $filter_day = substr(Carbon::now()->subDays(6 - $i)->format('l'), 0, 3);
                $axis[$filter_day][] = $i + 1;
                for ($y = 0; $y < $punch_cards_size; $y++) {
                    $punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT] = strtotime($punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT]);
                    $axis[$filter_day][] = '4c6d06';
                }
            }
        }

        if ($filter == self::MONTH) {
            for ($i = 0; $i < 31; $i++) {
                $filter_date = Carbon::now()->subDays(30 - $i)->day;
                $filter_date_d = Carbon::now()->subDays(30 - $i)->format(('d M'));
                $axis[$filter_date_d][] = $i + 1;
                for ($y = 0; $y < $punch_cards_size; $y++) {
                    $punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT] = strtotime($punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT]);
                    $punch_card_date = Carbon::createFromTimestamp((integer)($punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT]))->day;
                    if ($filter_date == $punch_card_date) {
                        $axis[$filter_date_d][] = $punch_cards[$y][self::COLOR];
                    }
                }
            }
        }

        if ($filter == 'year') {
            for ($i = 0; $i < 12; $i++) {
                $filter_date = Carbon::now()->subMonths(11 - $i)->month;
                $filter_date_d = substr(Carbon::now()->subMonths(11 - $i)->format(('M')), 0, 4);
                $axis[$filter_date_d][] = $i + 1;
                for ($y = 0; $y < $punch_cards_size; $y++) {
                    $punch_card_date = Carbon::createFromTimestamp((integer)($punch_cards[$y][self::PUNCH_CARD_RULE][self::CREATED_AT] / 1000))->month;
                    if ($filter_date == $punch_card_date) {
                        $axis[$filter_date_d][] = $punch_cards[$y][self::COLOR];
                    }
                }
            }
        }

        return $axis;
    }

    public function random_color_part()
    {
        return str_pad(dechex(mt_rand(0, 255)), 2, '0', STR_PAD_LEFT);
    }

    public function random_color()
    {
        return $this->random_color_part() . $this->random_color_part() . $this->random_color_part();
    }


    public function getDashboardVoucherStats(Request $request)
    {
        $filterPeriod = $request->filterPeriod;

        if (isset($filterPeriod)) {
            if ($filterPeriod == 'day') {
                $filter_date = Carbon::now()->subDays(1)->toDateTimeString(); // 1 day
            } else if ($filterPeriod == 'week') {
                $filter_date = Carbon::now()->subDays(7)->toDateTimeString(); // 1 week
            } else if ($filterPeriod == self::MONTH) {
                $filter_date = Carbon::now()->subDays(30)->toDateTimeString(); // 1 month
            } else {
                $filter_date = Carbon::now()->subDays(365)->toDateTimeString(); // 1 year
            }
        }

        $filter = ($filterPeriod) ? $filter_date : $filterPeriod;

        $all_vouchers = VoucherUser::whereNotNull('user_id')->whereRaw('no_of_uses = uses_remaining')->get();
        $all_stamps = VoucherUser::whereNotNull('user_id')->whereRaw('no_of_uses = uses_remaining')->whereNotNull('punch_id')->get();

        $total_voucher_amount = 0;
        $total_voucher_percentage = 0;
        $unusedVouchersCount = count($all_vouchers->toArray());
        $total_unredeemed_stamps = count($all_stamps->toArray());
        if (count($all_vouchers) > 0) {
            foreach ($all_vouchers as $data) {
                $voucher = Voucher::where('id', $data['voucher_id'])->first();


                if ($voucher->discount_type == '$' || $voucher->discount_type == '£') {
                    $total_voucher_amount += $voucher->amount;
                }
                if ($voucher->discount_type == '%') {
                    $total_voucher_percentage += $voucher->amount;
                }
            }
        }


        $final_data = [];
        $final_data['voucher_percentage'] = $total_voucher_percentage;
        $final_data['unusedVouchersCount'] = $unusedVouchersCount;


        $final_data[self::PUNCH_CARD_COUNT] = PunchCard::count();
        $final_data['stamp_voucher_count'] = 0;
        $final_data[self::COUNT] = 0;
        $final_data['total_unredeemed_stamps'] = $total_unredeemed_stamps;


        return (count($final_data) > 0 ? [self::STATUS => true, 'stats' => $final_data] : [self::STATUS => false]);
    }//--- End of getDashboardVoucherStats() ---//

    public function getGenderStats(Request $request)
    {
        $filterPeriod = $request->filterPeriod;

        if (isset($filterPeriod)) {
            if ($filterPeriod == 'day') {
                $filter_date = Carbon::today()->subDays(1)->toDateTimeString(); // 1 day
            } else if ($filterPeriod == 'week') {
                $filter_date = Carbon::today()->subDays(7)->toDateTimeString(); // 1 week
            } else if ($filterPeriod == self::MONTH) {
                $filter_date = Carbon::today()->subDays(30)->toDateTimeString(); // 1 month
            } else {
                $filter_date = Carbon::today()->subDays(365)->toDateTimeString(); // 1 year
            }
        }

        $filter = ($filterPeriod) ? $filter_date : $filterPeriod;

        $allMaleData = ElasticsearchUtility::maleFemaleStats($filter, 'M', $request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
        $allFemaleData = ElasticsearchUtility::maleFemaleStats($filter, 'F', $request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
        $allOtherData = ElasticsearchUtility::maleFemaleStats($filter, 'O', $request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
        $allUnknownData = ElasticsearchUtility::unknownGenderStats($filter, $request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));

        return (count($allMaleData) > 0 ? [self::STATUS => true, 'maleData' => $allMaleData, 'femaleData' => $allFemaleData, 'otherData' => $allOtherData, 'unknownData' => $allUnknownData] : [self::STATUS => false]);

    }//--- End of getGenderStats() ---//

//    wasim ends


    public function getVoucherStats(Request $request)
    {
        $voucher_stats = VoucherUser::where('user_id', request()->persona_id);
        $voucherData = $voucher_stats->get();

        $total_voucher_amount = 0;
        $total_voucher_percentage = 0;

        foreach ($voucherData as $data) {
            $voucher = Voucher::where('id', $data['voucher_id'])->first();
            if ($voucher->discount_type != 'Free' && $voucher->discount_type != '%') {
                $total_voucher_amount += $voucher->amount;
            }
            if ($voucher->discount_type == '%') {
                $total_voucher_percentage += $voucher->amount;
            }


        }
        $final_data = [];
        $final_data[self::COUNT] = $voucher_stats->count();
        if ($final_data[self::COUNT] > 0) {
            $final_data[self::LAST_RECEIVED] = Carbon::parse($voucher_stats->latest()->first()->created_at)->format('d/m/Y');
        } else {
            $final_data[self::LAST_RECEIVED] = '';
        }
        $final_data[self::VOUCHER_AMOUNT] = $total_voucher_amount;
        $final_data['voucher_percentage'] = $total_voucher_percentage;

        return $final_data;
    }//--- End of getMemberVouchers() ---//

    public function getVoucherDetail(Request $request)
    {
        return ElasticsearchUtility::voucherDetail(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), request()->voucher_id);
    }//--- End of getMemberVouchers() ---//


    public function getBadgesStats(Request $request)
    {
        try {
            $voucher_stats = ElasticsearchUtility::badgesStats(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), request()->persona_id);
            $final_data = [];
            $final_data[self::COUNT] = $voucher_stats[self::AGGREGATIONS]['total_badges'][self::VALUE];
            $final_data[self::STATUS] = true;
            if ($final_data[self::COUNT] > 0) {
                $final_data[self::LAST_RECEIVED] = $voucher_stats['hits']['hits'][0][self::SOURCE][self::DATEADDED];
                $final_data['badges'] = $voucher_stats['hits']['hits'];
                $filter_date = Carbon::now()->subDays(7)->toDateTimeString(); // 1 week
                $latest = ElasticsearchUtility::getLatestBadges(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), strtotime($filter_date), request()->persona_id);
                $final_data['latest_badges'] = $latest['hits']['hits'];
            } else {
                $final_data[self::LAST_RECEIVED] = '';
            }
            return $final_data;
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getBadgesStats() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function getMemberBadges(Request $request)
    {
        try {
            $dataRecieve = ElasticsearchUtility::memberBadges($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
            return (count($dataRecieve['hits']['hits'])) > 0 ? [self::STATUS => true, self::LIST_DATA => $dataRecieve] : [self::STATUS => false];
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getMemberBadges() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function getMemberCampaigns(Request $request)
    {
        try {
            $dataRecieve = ElasticsearchUtility::memberCampaigns($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
            $active_campaigns = [];
            if ((count($dataRecieve['hits']['hits'])) > 0) {
                foreach ($dataRecieve['hits']['hits'] as &$campaign_data) {
                    $campaign = Campaign::where('id', ($campaign_data[self::SOURCE]['camp_id']))->first();
                    //find start and end date
                    if ($campaign) {
                        if ($campaign->schedule_type == 'schedule') {
                            $value = json_decode($campaign->schedule_value);
                            $start_date = isset($value->from_date) ? $value->from_date : $campaign->created_at;
                            $end_date = isset($value->end_date) ? $value->end_date : '';
                            $campaign_data[self::SOURCE][self::START_DATE] = $start_date;
                            $campaign_data[self::SOURCE][self::END_DATE] = $end_date;
                        } else {
                            $campaign_data[self::SOURCE][self::START_DATE] = '';
                            $campaign_data[self::SOURCE][self::END_DATE] = '';
                        }
                        $member = User::where(self::USER_ID, $campaign_data[self::SOURCE]['member_id'])->first();
                        $campaign_data[self::SOURCE]['campaign_name'] = ($campaign) ? $campaign->name : '';
                        $campaign_data[self::SOURCE]['member_name'] = ($member) ? $member->user_first_name . ' ' . $member->family_name : '';
                        $campaign_data[self::SOURCE]['camp_status'] = ($campaign) ? $campaign->status : '';
                        $campaign_data[self::SOURCE][self::CAMP_TYPE] = ($campaign) ? $campaign->type : '';

                        //calculate percentage
                        $sent_campaigns = ElasticsearchUtility::sentCampaignsCount($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
                        $dataRecieve[self::SENT_CAMPS] = (integer)round(($sent_campaigns[self::COUNT] / $dataRecieve[self::AGGREGATIONS]['total_campaigns'][self::VALUE]) * 100);

                        $active_campaigns['hits']['hits'][] = $campaign_data;
                        $active_campaigns[self::SENT_CAMPS] = $dataRecieve[self::SENT_CAMPS];
                        $active_campaigns['hits'][self::TOTAL] = $dataRecieve['hits'][self::TOTAL][self::VALUE];
                    }
                }

                //get graph data

                return [self::STATUS => true, self::LIST_DATA => $active_campaigns];
            } else {
                return [self::STATUS => false];
            }
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getMemberCampaigns() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function getDashboardCampaigns(Request $request)
    {
        try {
            $dataRecieve = ElasticsearchUtility::dashboardMemberCampaigns($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
            if ((count($dataRecieve['hits']['hits'])) > 0) {
                foreach ($dataRecieve['hits']['hits'] as &$campaign_data) {
                    $campaign = Campaign::find($campaign_data[self::SOURCE]['camp_id']);
                    $campaign_data[self::SOURCE]['campaign_name'] = ($campaign) ? $campaign->name : '';
                    $type = $campaign_data[self::SOURCE]['camp_type'];
                    if ($type == 1) {
                        $campaign_data[self::SOURCE][self::CAMP_TYPE] = 'Set & Forget';
                    } else if ($type == 2) {
                        $campaign_data[self::SOURCE][self::CAMP_TYPE] = 'Proximity';
                    } else if ($type == 3) {
                        $campaign_data[self::SOURCE][self::CAMP_TYPE] = 'Dynamic';
                    } else {
                        $campaign_data[self::SOURCE][self::CAMP_TYPE] = 'Gamification';
                    }
                    $campaign_data[self::SOURCE]['campaign_status'] = ($campaign) ? $campaign->status : '';
                    //calculate percentage
                    $sent_campaigns = ElasticsearchUtility::dashboardSentCampaignsCount($request, ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id));
                    $dataRecieve[self::SENT_CAMPS] = (integer)round(($sent_campaigns[self::COUNT] / $dataRecieve[self::AGGREGATIONS]['total_campaigns'][self::VALUE]) * 100);
                }
                return [self::STATUS => true, self::LIST_DATA => $dataRecieve];
            } else {
                return [self::STATUS => false];
            }
        } catch (\Exception $e) {
            return [self::STATUS => false];
        }
    }//--- End of getDashboardCampaigns() ---//

    /**
     * @return array
     */
    public function getDemographicData(Request $request)
    {
        $member_es = ElasticsearchUtility::getMember(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), request()->persona_id);
        if (isset($member_es['hits']['hits'][0][self::SOURCE][self::GENDER])) {
            $total_member_by_gender = ElasticsearchUtility::count(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $this->genderCountQuery($member_es['hits']['hits'][0][self::SOURCE][self::GENDER]));
        } else {
            $total_member_by_gender = '';
        }
        $total_members = ElasticsearchUtility::countMembers(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id));
        $total_members = $total_members[self::AGGREGATIONS][self::TYPES_COUNT][self::VALUE];
        $total_male_members = ElasticsearchUtility::count(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $this->genderCountQuery('M'));
        $total_female_members = ElasticsearchUtility::count(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $this->genderCountQuery('F'));
        $total_other_members = ElasticsearchUtility::count(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $this->genderCountQuery('O'));

        $male_member_percentage = $total_male_members / $total_members * 100;
        $female_member_percentage = $total_female_members / $total_members * 100;
        $other_member_percentage = $total_other_members / $total_members * 100;

        //gender split data
        $rangeData = $request->rangeData;
        $all_data = [];
        foreach ($rangeData as $rangeDatum) {
            $totalCount = ElasticsearchUtility::ageCalc($rangeDatum, '', 'M', false);
            $maleCount = ElasticsearchUtility::ageCalc($rangeDatum, '', 'M', true);
            $femaleCount = ElasticsearchUtility::ageCalc($rangeDatum, '', 'F', true);
            $otherCount = ElasticsearchUtility::ageCalc($rangeDatum, '', 'O', true);

            //calculate percentage in the given range
            $temp[0] = $x1 = $totalCount > 0 ? $maleCount / $totalCount * 100 : 0;
            $temp[1] = $x2 = $totalCount > 0 ? $femaleCount / $totalCount * 100 : 0;
            $temp[2] = $x3 = $totalCount > 0 ? $otherCount / $totalCount * 100 : 0;
            $temp[3] = ($totalCount > 0) ? 100 - ($x1 + $x2 + $x3) : 0;
            $all_data[] = $temp;

        }
        //age data
        if (isset($member_es['hits']['hits'][0][self::SOURCE][self::DOB])) {
            $member_age = Carbon::now()->diffInYears($member_es['hits']['hits'][0][self::SOURCE][self::DOB]);
            $member_age_count = ElasticsearchUtility::count(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $this->getAgeQuery($member_age));
        } else {
            $member_age = 0;
            $member_age_count = 0;
        }
        return ['male' => $male_member_percentage,
            'female' => $female_member_percentage,
            'other' => $other_member_percentage,
            'unknown' => 100 - ($male_member_percentage + $female_member_percentage + $other_member_percentage),
            'gender_count' => $total_member_by_gender,
            self::TOTAL => $total_members,
            'age_graph_data' => $all_data,
            'member_age' => $member_age,
            'total_age_members' => $member_age_count,
            self::GENDER => isset($member_es['hits']['hits'][0][self::SOURCE][self::GENDER]) ? $member_es['hits']['hits'][0][self::SOURCE][self::GENDER] : ''
        ];

    }//..... end of getMemberDetail() .....//

    public function getAgeQuery($member_age)
    {
        $from_year = Carbon::now()->subYears($member_age)->year;
        $from_date = $from_year . '-01-01';
        $to_date = $from_year . '-12-31';
        $search_query = [
            'bool' => [
                'must' => [
                    [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.demographic')]],
                ]
            ]
        ];
        $search_query['bool']['must'][] = [
            self::RANGE => [
                self::DOB => [
                    'gte' => $from_date,
                    'lte' => $to_date,
                    self::FORMAT_INDEX => self::YMD
                ]
            ]
        ];
        return [
            self::QUERY => $search_query,
        ];
    }

    public function genderCountQuery($gender)
    {
        return [self::QUERY => [
            'bool' => [
                'must' => [
                    [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.demographic')]],
                    [self::MATCH => [self::GENDER => $gender]]
                ]
            ]
        ]];
    }

    public function countStampCardQuery($persona_id)
    {
        return [self::QUERY => [
            'bool' => [
                'must' => [
                    [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.punch_card')]],
                    [self::MATCH => [self::PERSONA_ID => $persona_id]]
                ]
            ]
        ]];
    }


    /**
     * @param $id
     * @return array
     * Delete all users' punch cards from Elasticsearch.
     */
    public function deletePunchCard($id)
    {
        $date = date('Y-m-d h:i:s');
        $query = [
            "script" => [
                "inline" => "ctx._source.punch_card_rule.deleted_at = '" . $date . "'",
                "lang" => "painless",
                'params' => [
                    self::DELETED_AT => null
                ]
            ],
            self::QUERY => [
                'bool' => [
                    "must" => [
                        ["term" => [self::CUSTOM_DOC_TYPE => config('constant.punch_card')]],
                        ["term" => ["punch_card_rule.id" => $id]]
                    ]
                ]
            ]
        ];


        ElasticsearchUtility::updateByQuery(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $query);
        return [self::STATUS => true, self::MESSAGE => 'Punch card deleted successfully.'];
    }//..... end of deletePunchCard() .....//

    /**
     * @param $id
     * @param $channel
     * @param $value
     * @return array
     * Update member's channel status.
     */
    public function updateMemberChannelStatus($id, $channel, $value)
    {
        $data = [];
        $data = $this->updateUserNotificationInDb($id, $channel, $value);


        $query = [

            'doc' => $data
        ];
        /* $query = [
             'doc' => [
                 "{$channel}" => $value ? true : false
             ]
         ];*/

        try {
            ElasticsearchUtility::update(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $query, $id);
            return [self::STATUS => true, self::MESSAGE => 'Member channel status updated successfully.'];
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => "Error occurred while updating member's channel status."];
        }//..... end of try-catch() .....//
    }//..... end of updateMemberChannelStatus() .....//

    /**
     * @param $index
     * @param $deviceData
     * @return bool
     * Enter user device token to ElasticSearch and removed that token from another user, if assigned.
     */


    /**
     * Upgrade/downgrade as merchant.
     * @param $index
     * @param $persona_id
     * @param $isMerchant
     * @return bool
     */
    public function setUserAccountLevel($index, $persona_id, $isMerchant)
    {
        try {
            ElasticsearchUtility::update($index, ['doc' => [self::IS_MERCHANT => $isMerchant ? 1 : 0]], $persona_id);
            return true;
        } catch (\Exception $e) {
            return false;
        }//..... end of try-catch() .....//
    }//..... end of setUserAccountLevel() .....//


    /**
     * @param $user_id
     * @return array|void
     */

    public function insertUserToES($id, $device_id = '')
    {
        try {
            $user = User::where(self::USER_ID, $id)->first();
            $venues = Venue::where('company_id', $user->company_id)->get(['id', 'venue_id']);

            $userData = [
                'persona_email' => $user->email,
                self::PERSONA_ID => $user->user_id,
                'soldi_id' => $user->soldi_id,
                'membership_id' => $user->user_id,
                'persona_fname' => $user->user_first_name,
                'persona_lname' => $user->user_family_name,
                self::CREATION_DATETIME => ($user->created_at) ? $user->created_at->format(self::FULL_DATE) : now()->format(self::FULL_DATE),
                self::DATE_ADDED => now()->format(self::FULL_DATE),
                'devices' => ['mobile' => $user->user_mobile],
                'emails' => ['personal_emails' => $user->email],
                self::CUSTOM_DOC_TYPE => config('constant.demographic'),
                self::STATUS => ($user->is_active) ? 'active' : 'inactive',
                'is_pointme_user' => true,
                'email_subscribed_flag' => ($user->is_email) ? true : false,
                'sms_subscribed_flag' => true,
                'is_pointme_notifications' => true,
                'mail_subscribed_flag' => true,
                self::IS_MERCHANT => 0,
                self::GROUPS => json_decode($user->groups) ?? ['Member'],
                'last_login' => now()->format(self::FULL_DATE),
                'data_source' => $user->data_source,
                self::REFERRAL_CODE => $user->referral_code,
                'region_type' => $user->region_type,
                'old_user' => ($user->old_user) ? true : false,
                self::COMPANY_ID => $user->company_id,
                self::CLIENT_CUSTOMER_ID => $user->client_customer_id

            ];
            if ($user->gender) {
                $userData[self::GENDER] = (strtolower($user->gender) == "male") ? "M" : ((strtolower($user->gender) == "female") ? "F" : "O");
            }

            if ($user->dob) {
                $userData[self::DOB] = date(self::FORMAT, strtotime($user->dob));
            }


            if ($user->postal_code) {
                $userData[self::RESIDENTIAL_ADDRESS][self::POSTAL_CODE] = $user->postal_code;
            }

            if ($user->referal_by) {
                $userData['referral_by'] = $user->referal_by;
            }


            $userData['venues'] = $this->getUserSubscribedVenues($user->user_id);

            $id = $user->user_id;

            ElasticsearchUtility::upsert(config('constant.ES_INDEX_BASENAME'), $userData, $id);
            $user->device_id = $device_id;
            $resposnse = $this->updateUserTokenInEs($user);
            Log::channel('user')->info('updateUserTokenInEs: ', ['updateUserTokenInEs' => $resposnse]);

            return true;
        } catch (\Exception $e) {
            Log::channel('user')->info('User not added in ES: ', ['data' => $e->getMessage()]);
            return false;
        }

    }

    public function updateUserTokenInEs($user)
    {
        if (!isset($user->device_token) || $user->device_token == null || $user->device_token == '' || !isset($user->company_id) || $user->company_id == '') {
            return [self::STATUS => false, self::MESSAGE => 'persona devices data is not inserted to es'];
        }
        //remove repeated tokens from ES
        $this->deleteRepeatTokens($user);

        (new ElasticSearchController())->registerUserDevice($this->index, [
            'debug_mod' => $user->debug_mod ?? "",
            self::PERSONA_DEVICE_TOKEN => $user->device_token ?? "",
            'persona_device_type' => $user->device_type ?? "",
            self::CUSTOM_DOC_TYPE => config('constant.persona_devices'),
            self::PERSONA_ID => $user->user_id,
            self::DATE_ADDED => date(self::FULL_DATE),
            self::COMPANY_ID => request()->header('Country') == 'uk' ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID'),
            'device_name' => $user->device_id
        ]);

        return [self::STATUS => true, self::MESSAGE => 'persona devices data insert successfully'];
    }

    public function registerUserDevice($index, $deviceData)
    {
        try {
            ElasticsearchUtility::insert($index, $deviceData, '');

            return true;
        } catch (\Exception $e) {
            Log::channel(self::CUSTOM)->info('change', ['INSERTDATA' => $e->getMessage()]);
            return false;
        }//..... end of try-catch() .....//
    }//...... end of registerUserDevice() .....//


    public function deleteRepeatTokens($user)
    {
        try {


            $query = [self::QUERY => [
                'bool' => [
                    'must' => [
                        // ['term' => [self::PERSONA_DEVICE_TOKEN => [self::VALUE => $user->device_token]]],
                        [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.persona_devices')]],
                        [self::MATCH => [self::PERSONA_ID => $user->user_id]],


                    ]
                ]
            ], 'sort' => [
                self::DATE_ADDED => ['order' => 'desc']
            ]];
            $company_id = request()->header('Country') == 'uk' ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID');
            $deletedIDS = [];
            $data = ElasticsearchUtility::search(config('constant.ES_INDEX_BASENAME'), $query);
            $size = count($data['hits']['hits']);
            for ($i = 0; $i < $size; $i++) {
                if ($data['hits']['hits'][$i][self::SOURCE][self::PERSONA_DEVICE_TOKEN] == $user->device_token && $company_id == $data['hits']['hits'][$i][self::SOURCE][self::COMPANY_ID]) {
                    $deletedIDS[] = $data['hits']['hits'][$i]['_id'];
                }
                if ($i >= 4) {
                    $deletedIDS[] = $data['hits']['hits'][$i]['_id'];
                }
            }
            if (count($deletedIDS) > 0) {
                ElasticsearchUtility::deleteByQuery(config('constant.ES_INDEX_BASENAME'), '', '', [self::TERMS => ['_id' => $deletedIDS]]);
            }
            return true;
        } catch (\Exception $e) {
            Log::channel('user')->error('ERROR While DELETE', ['DELETEERROR' => $e->getMessage()]);
            return false;
        }
    }//..... end of deleteByQuery() .....//

    private function getVoucherStateDateWise($startDate, int $dateTime)
    {
        $data = ElasticsearchUtility::getVoucherStateDateWise('_all', $dateTime, $startDate);
        $cout = 0;
        if (!empty($data)) {
            foreach ($data as $value) {
                foreach ($value as $value2) {
                    if ($value2[self::SOURCE][self::USES_REMAINING] == $value2[self::SOURCE][self::NO_OF_USES]) {
                        $cout++;
                    }
                }


            }
        }
        return $cout;
    }

    public function getVoucherReportDummt($date = '')
    {
        $data = ElasticsearchUtility::getVoucherStateWise('_all');
        $newArray = [];
        foreach ($data as $value) {
            if (($value[self::NO_OF_USES] - $value[self::USES_REMAINING]) > 0) {
                $user = User::whereUserId($value[self::PERSONA_ID])->first();
                $newArray[] = [self::VOUCHER_CODE => $value[self::VOUCHER_CODE], 'voucher_date' => $value['voucher_date'], self::NO_OF_USES => $value[self::NO_OF_USES], self::USES_REMAINING => $value[self::USES_REMAINING], 'redeemed_vouchers' => $value['redeemed_vouchers'], self::PROMOTION_TEXT => $value[self::PROMOTION_TEXT], self::EMAIL => $user->email ?? $user[self::EMAIL]];
            }
        }
        return Excel::download(new VoucherExportReport($newArray), 'voucherReport.xlsx');
    }


    public function getSheetsData()
    {
        //transactions data(first sheet)
        $response_data = ElasticsearchUtility::getVoucherPunchCardData('_all');
        $merchants = User::where(self::IS_MERCHANT, 1)->select(self::USER_ID, self::USER_FIRST_NAME, self::USER_FAMILY_NAME)->get();
        $merchants = $merchants->keyBy(self::USER_ID)->toArray();

        $transaction_data = [];
        foreach ($response_data as $data) {
            try {
                if (!isset($data['_index'][2])) {
                    continue;
                }
                $venue_id = explode('_', $data['_index'])[2];
                $venue_name = Venue::where(self::VENUE_ID, $venue_id)->first();
                if ($venue_name) {
                    $venue_name = $venue_name->venue_name;
                } else {
                    $venue_name = '';
                }

                if ($data[self::SOURCE][self::CUSTOM_DOC_TYPE] == 'redeemed_voucher') {
                    $doc_title = 'Redeemed Voucher';
                    $custom_doc_type = 'user_voucher';
                    $matched_title = self::PROMOTION_TEXT;
                } else if ($data[self::SOURCE][self::CUSTOM_DOC_TYPE] == 'assigned_stamp') {
                    $doc_title = 'Stamp';
                    $custom_doc_type = self::PUNCH_CARD;
                    $matched_title = 'punch_card_rule.name';
                } else {
                    $doc_title = 'Completed Punch';
                    $custom_doc_type = self::PUNCH_CARD;
                    $matched_title = 'punch_card_rule.name';
                }

                $merchant_first_name = isset($merchants[$data[self::SOURCE][self::MERCHANT_IDS]]) ? $merchants[$data[self::SOURCE][self::MERCHANT_IDS]][self::USER_FIRST_NAME] : '';
                $merchant_last_name = isset($merchants[$data[self::SOURCE][self::MERCHANT_IDS]]) ? $merchants[$data[self::SOURCE][self::MERCHANT_IDS]][self::USER_FAMILY_NAME] : '';

                $query = [
                    self::SOURCE => "$matched_title",
                    self::QUERY => [
                        'bool' => [
                            'must' => [
                                [self::MATCH => [self::CUSTOM_DOC_TYPE => $custom_doc_type]],
                                [self::MATCH => ['_id' => $data[self::SOURCE]['id']]]
                            ]
                        ]
                    ],
                ];
                $name_response = ElasticsearchUtility::getName('_all', $query);
                $name = '';
                if (count($name_response['hits']['hits']) > 0) {
                    if ($custom_doc_type == self::PUNCH_CARD) {
                        $name = $name_response['hits']['hits'][0][self::SOURCE][self::PUNCH_CARD_RULE]['name'];
                    } else {
                        $name = $name_response['hits']['hits'][0][self::SOURCE][self::PROMOTION_TEXT];
                    }
                }
                $transaction_data[] = [
                    'transaction_date' => Carbon::parse($data[self::SOURCE][self::DATE_ADDED])->format('jS M Y g:i A'),
                    'name' => $name,
                    'retailers' => $merchant_first_name . ' ' . $merchant_last_name,
                    'venue_name' => $venue_name,
                    'type' => $doc_title,
                    'qty' => $data[self::SOURCE]['number'],
                    'amount' => $data[self::SOURCE][self::CUSTOM_DOC_TYPE] != 'assigned_stamp' ? (string)$data[self::SOURCE]['amount'] . $data[self::SOURCE]['category'] : ' ',
                ];
            } catch (\Exception $e) {
                Log::channel(self::CUSTOM)->info(['transaction sheet error' => ['transaction sheet error' => $e->getMessage(), 'trace' => $e->getLine()]]);
            }
        }

        //users data(second sheet)
        $users_data = [];
        for ($i = 1; $i <= date('t'); $i++) {
            try {
                $date = date('Y') . "-" . date('m') . "-" . str_pad($i, 2, '0', STR_PAD_LEFT);
                $formatted_date = Carbon::parse($date)->format('d M');

                $converted_count = User::whereDate(self::CREATED_AT, '=', $date)->whereNotNull('referal_by')->count();


                $users_data[] = [
                    'Date' => $formatted_date,
                    'referred' => (string)0,
                    'converted' => (string)$converted_count
                ];
            } catch (\Exception $e) {
                Log::channel(self::CUSTOM)->info(['user sheet error' => ['user sheet error' => $e->getMessage(), 'trace' => $e->getLine()]]);
            }
        }
        return Excel::download(new InvoicesExport($users_data, $transaction_data), 'voucherReport.xlsx');

    }

    public function createUser(Request $request)
    {
        try {
            if (!$request->email)
                return ['status' => false, 'message' => 'Please enter email address'];

            if (!$request->phone) {
                return [self::STATUS => false, self::MESSAGE => 'Please enter your phone number'];
            }

            //check if user exists in mysql
            $user = User::where(self::EMAIL, $request->email)->orWhere('user_mobile',$request->phone)->first();
            if ($user) {
                //add user in ES if not already added
                $query = [
                    'query' => ['bool' => ['must' =>
                        [['term' => ['person_id' => $user->user_id]]]
                    ]]];
                $check_user = ElasticsearchUtility::getSource(config('constant.ES_INDEX_BASENAME'), $query);
                if (count($check_user) == 0) {
                    (new ElasticsearchUtility())->bulkUserDataInsertNew(User::where(self::USER_ID, $user->user_id)->get(), '');
                }
                return [self::STATUS => false, self::MESSAGE => 'User with this email or phone already exists'];
            }

            if ($request->hasFile(self::USER_IMAGE)) {
                $user_image = time() . '_' . $request->file(self::USER_IMAGE)->getClientOriginalName();
                $path = base_path() . '/public/users/';
                $request->file(self::USER_IMAGE)->move($path, $user_image);
                Image::make($path . $user_image, array(
                    'width' => 200,
                    'height' => 200,
                    'grayscale' => false
                ))->save(base_path() . '/public/users/thumbs/thumb_' . $user_image);
            } else {
                $user_image = '';
            }//..... end if-else() .....//

            $user = User::create([
                self::USER_FIRST_NAME => $request->first_name,
                self::USER_FAMILY_NAME => $request->last_name,
                self::COMPANY_ID => $request->company_id,
                self::EMAIL => $request->email,
                'password' => $request->password ? Hash::make($request->password) : null,
                'user_mobile' => $request->phone,
                'user_avatar' => $user_image,
                'soldi_id' => $request->soldi_id ?? 0,
                'is_active' => ($request->member_status) ? 1 : 0,
                'activation_token' => rand(111111, 999999),
                'expiry_time' => Carbon::now()->addMinute(5),
                'debug_mod' => 1,
                'device_token' => uniqid(true),
                'device_type' => 'ios',
                self::POSTAL_CODE => $request->postal_code ?? "",
                self::ADDRESS => $request->home_address ?? "",
                'street_number' => $request->street_number ?? "",
                'street_name' => $request->street_name ?? "",
                'city' => $request->city ?? "",
                'state' => $request->state ?? "",
                'country' => $request->country ?? "",
                self::GENDER => $request->gender ?? "",
                'default_venue' => 0,
                self::COMPANY_INFO => $request->company_info,
                'dob' => ($request->show_dob) ? Carbon::parse($request->dob)->format(self::FORMAT) : null,
                'user_lat' => $request->home_address_lat,
                'user_long' => $request->home_address_long,
                "groups" => json_encode(["Member"]),
                "address2" => $request->address2 ?? "",
                'store_name' => $request->store_name,

            ]);


            if ($user) {
                $referral_code = (new UserApiController())->getReferralCode($user->user_id);
                $user->referral_code = $referral_code;
                $user->save();

                (new ElasticsearchUtility())->bulkUserDataInsertNew(User::where(self::USER_ID, $user->user_id)->get(), '');

                if ($request->gender && $request->postal_code && $request->dob) {
                    $request->request->add([self::VENUE_ID => $user->default_venue]);
                    (new GamificationController())->userOptionalFields($request, $user);
                }
                return [self::STATUS => true, self::MESSAGE => 'User saved successfully'];
            } else {
                return [self::STATUS => false, self::MESSAGE => 'Due to some error user not registered.'];
            }//..... end of if-else() .....//
        }
        catch (\Exception $e) {

            Log::channel('custom')->info('createUser_error', ['createUser_error' => $e->getMessage()]);
            return ["status"=>false,"message"=>$e->getMessage()];
        }

    }//..... end of createUser() .....//

    public function createUserSoldi($request)
    {
        try {
            $parm = ['business_id' => 983, 'first_name' => $request->user_first_name, 'last_name' => $request->user_family_name,
                'email_address' => $request->email, self::GENDER => ($request->gender == 'Male' || $request->gender == '') ? '1' : '0',
                'mobile_number' => $request->user_mobile, 'company_name' => '', 'land_line' => '', 'street_1' => '',
                'street_2' => '', 'suburb' => '', 'country' => '', 'provice' => '', 'city' => '', 'code' => $request->postal_code ?? '',
                'memo' => ''
            ];
            $client1 = new Client([
                self::HEADERS => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]);

            $response = $client1->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/customer/create', [
                'json' => $parm
            ]);
            $soldi_res = $response->getBody()->getContents();
            $soldi_arr = json_decode($soldi_res);

            if ($soldi_arr->status === 404) {
                return 0;
            } else {

                return $soldi_arr->data->customer_id;
            }//..... end if-else() .....//

        } catch (\Exception $e) {
            return $e->getMessage();
        }//..... end of try-catch() .....//
    }//..... end of createUserSoldi() .....//

    public function updateElasticsearchData($type, $user)
    {
        switch ($type) {
            case 'app_notification';
                return $this->updateKeyInElasticsearch($type, json_decode($user->wimpy_app_notification), $user->user_id);
                break;
            case 'marketing_notification';
                return $this->updateKeyInElasticsearch($type, json_decode($user->wimpy_marketing_notification), $user->user_id);
                break;
            case 'rewards_notification';
                return $this->updateKeyInElasticsearch($type, json_decode($user->wimpy_rewards_notification), $user->user_id);
                break;
            case 'last_login';
                return $this->updateKeyInElasticsearch($type, Carbon::parse($user->last_login)->format('Y-m-d H:i:s'), $user->user_id);
                break;
            case 'transaction_data';
                return $this->updateELasticsearchForTransaction($type, $user);
                break;
            case 'surveys';
                return $this->updateKeyInElasticsearch($type, $user['survey']->toArray(), $user['user']->user_id);
                break;
            case 'referred_user';
                return $this->updateKeyInElasticsearch($type, intval($user->refer_count), $user->user_id);
                break;
            case 'referral_by';
                return $this->updateKeyInElasticsearch($type, $user->referral_by, $user->user_id);
                break;

        }
    }


    private function updateELasticsearchForTransaction($type, $user)
    {
        try {
            $data = [
                'basket_value' => $user->basket_value,
                'basket_size' => $user->avg_basket_size,
                'avg_basket_size' => $user->avg_basket_size,
                'avg_basket_value' => $user->avg_basket_value,
                'last_transactions' => date('Y-m-d H:i:s'),
                'custom_doc_type' => config('constant.demographic')

            ];

            ElasticsearchUtility::upsert($this->index, $data, $user->user_id);
            Log::channel('user')->info('Update ' . $type . ' Elasticsearch: ', ['data' => $data]);
        } catch (\Exception $e) {
            Log::channel('user')->info('Update Keys Elasticsearch: ', ['data' => $e->getMessage()]);
        }
    }

    public function updateKeyInElasticsearch($key, $value, $user_id)
    {
        try {
            $userData[$key] = $value;
            $userData['custom_doc_type'] = config('constant.demographic');
            $id = $user_id;
            ElasticsearchUtility::upsert($this->index, $userData, $id);
            Log::channel('user')->info('Update ' . $key . ' Elasticsearch: ', ['data' => $userData]);
        } catch (\Exception $e) {
            Log::channel('user')->info('Update Keys Elasticsearch: ', ['data' => $e->getMessage()]);
        }
    }

    public function úploadUserImage(Request $request)
    {
        if ($request->hasFile(self::USER_IMAGE)) {
            $user_image = time() . '_' . $request->file(self::USER_IMAGE)->getClientOriginalName();
            $path = base_path() . '/public/users/';
            $request->file(self::USER_IMAGE)->move($path, $user_image);
            Image::make($path . $user_image, array(
                'width' => 200,
                'height' => 200,
                'grayscale' => false
            ))->save(base_path() . '/public/users/thumbs/thumb_' . $user_image);
        } else {
            $user_image = '';
        }
        User::where(self::USER_ID, $request->user_id)->update(['user_avatar' => $user_image]);
        return [self::STATUS => true];//..... end if-else() .....//
    }

    public function checkUserExists($user)
    {
        try {
            $query = [self::QUERY => [
                'bool' => [
                    'must' => [
                        [self::MATCH => [self::CUSTOM_DOC_TYPE => config('constant.demographic')]],
                        [self::MATCH => [self::PERSONA_ID => $user->user_id]]]]]];


            $data = ElasticsearchUtility::search(config('constant.ES_INDEX_BASENAME'), $query);
            if (count($data['hits']['hits']) == 0) {
                return $this->insertUserToES($user->user_id, $user->device_id);
            } else {
                return $this->updateUserTokenInEs($user);
            }

        } catch (\Exception $e) {
            Log::channel('user')->error('Error In Checking User', [
                "EROORUSER" => $e->getMessage()
            ]);
            return [self::STATUS => false];
        }
    }


    public function insertDummyPunchCards()
    {
        for ($i = 1589; $i < 30000; $i++) {
            $data = [
                "quantity" => 1,
                "punch_card_rule" => [
                    "no_of_voucher" => null,
                    "category_name" => null,
                    "product_image" => null,
                    "description" => "ireland punch card",
                    "created_at" => "2019-12-11 05:53:15",
                    "punch_card_data" => "",
                    "rule_on" => 'null',
                    "frequency" => "00:10",
                    "category_id" => null,
                    "updated_at" => "2019-12-11 05:53:15",

                    "product_id" => null,
                    "redemption_type" => "transaction_value",
                    "id" => 68,
                    "businesses" => [],
                    self::VENUE_ID => 576634,
                    "image" => "uploads/1587507936711150830.png",
                    "business_name" => "Liffey Valley",
                    "basket_level" => false,
                    self::COMPANY_ID => 1,
                    "group_name" => null,
                    "pos_ibs" => 222,
                    "discount_type" => "Free",
                    "product_name" => null,
                    "deleted_at" => null,
                    "condition" => null,
                    "transaction_threshold" => "10",
                    "no_of_use" => "1",
                    "parent_id" => 0,
                    "name" => "ireland punch card",
                    "card_color" => "#417505",
                    "voucher_amount" => null,
                    "business_id" => 5
                ],
                self::COMPANY_ID => "1",
                "mrcht_id" => "0",
                "punch_card_count" => 0,
                self::PERSONA_ID => "111",
                "dummy_punch" => "dummy",
                self::VENUE_ID => "295255",
                self::CUSTOM_DOC_TYPE => "punch_card",
                "assigned_last_date" => 1576043595163,
                "dateadded" => time() . $i

            ];
            ElasticsearchUtility::upsert(config('constant.ES_INDEX_BASENAME'), $data, $i);
        }

    }

    public function getAllVouchers()
    {
        $vouchers = VoucherUser::whereNotNull('user_id')->orderBy('created_at', 'DESC');
        $voucherName = '';
        $voucherCount = VoucherUser::whereNotNull('user_id');
        if (request()->voucher_id > 0) {

            $voucherList = Voucher::where('id', request()->voucher_id)->first();
            if ($voucherList->voucher_type == 'group-voucher') {
                $voucherIds = collect(json_decode($voucherList->voucher_avial_data, true))->pluck('id');
                $vouchers->whereIn('voucher_id', $voucherIds);
                $voucherCount->whereIn('voucher_id', $voucherIds);
            } else {
                $vouchers->where('voucher_id', request()->voucher_id);
                $voucherCount->where('voucher_id', request()->voucher_id);
            }
            $voucherName = $voucherList->name;

        }

        if (!empty(request()->search)) {
            if (is_numeric(request()->search)) {
                $user = User::where(self::CLIENT_CUSTOMER_ID, 'like', '%' . request()->search . '%')->pluck(self::USER_ID);
                if (count($user) > 0) {
                    $vouchers->whereIn('user_id', $user);
                    $voucherCount->whereIn('user_id', $user);
                } else {

                    $vouchers->where(self::VOUCHER_CODE, 'like', '%' . request()->search . '%');
                    $voucherCount->where(self::VOUCHER_CODE, 'like', '%' . request()->search . '%');
                }
            } else {
                $nameSearch = explode(' ', request()->search);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {

                    $user = User::where(self::USER_FIRST_NAME, 'like', '%' . str_replace('%', '', $nameSearch[0]) . '%')
                        ->orWhere(self::USER_FAMILY_NAME, 'like', '%' . $nameSearch[1] . '%')
                        ->pluck(self::USER_ID);
                    $vouchers->whereIn('user_id', $user);
                    $voucherCount->whereIn('user_id', $user);
                } else {
                    $user = User::where(self::USER_FIRST_NAME, 'like', '%' . request()->search . '%')->orWhere(self::USER_FAMILY_NAME, 'like', '%' . request()->search . '%')->orWhere(self::EMAIL, 'like', '%' . request()->search . '%')->pluck(self::USER_ID);
                    $vouchers->whereIn('user_id', $user);
                    $voucherCount->whereIn('user_id', $user);
                }

            }
        }

        if (!empty(request()->start_date) && !empty(request()->end_date)) {

            $vouchers->whereDate('voucher_start_date', '>=', request()->start_date . ' 00:00:00')->whereDate('voucher_end_date', '<=', request()->end_date . ' 00:00:00');
        }


        $data = ['status' => true, 'data' => $vouchers->with('UserVoucher')->with('users:user_id,user_first_name,user_family_name,email,client_customer_id')->skip(request()->offSet)->take(request()->pageSize)->get()->toArray(), 'count' => $voucherCount->count(), "voucher_name" => $voucherName];

        if (count($data['data']) > 0) {
            foreach ($data['data'] as $key => $value) {
                if (count($data['data'][$key]['user_voucher']) > 0) {
                    $data['data'][$key]['user_voucher'][0]['voucher_avial_data'] = $this->getVoucherAvailDetail($value[self::VOUCHER_CODE], json_decode($value['user_voucher'][0]['voucher_avial_data'], true));
                } else {
                    $data['data'][$key]['user_voucher'] = [];
                }
                $start_date = strtotime(Carbon::parse($value['voucher_start_date'])->format('Y-m-d h:i:s'));
                $end_date = strtotime(Carbon::parse($value[self::VOUCHER_END_DATE])->format('Y-m-d h:i:s'));
                $current_date = strtotime(date('Y-m-d h:i:s'));

                if ($current_date > $end_date) {
                    $voucher_status = 'Expired';

                } else if ($value[self::USES_REMAINING] == 0) {
                    $voucher_status = 'Redeemed';
                } else if ($start_date <= $current_date && $end_date >= $current_date) {
                    $voucher_status = 'Active';
                } else {
                    $voucher_status = 'Inactive';
                }
                $data['data'][$key]['voucher_status'] = $voucher_status;
                if (!isset($value['user_voucher'][self::BUSINESS])) {
                    $data['data'][$key][self::BUSINESS]['business_name'] = '';
                }
                $data['data'][$key]['active'] = false;

            }
        }

        return $data;
    }


    /**
     * @return array
     */
    public function getAllStamps()
    {
        $usersStamps = UserStamp::whereNotNull('user_id');
        $usersStampsCount = UserStamp::whereNotNull('user_id');
        if (!empty(request()->search)) {
            if (is_numeric(request()->search)) {
                $user = User::where(self::CLIENT_CUSTOMER_ID, 'like', '%' . request()->search . '%')->pluck(self::USER_ID);
                if (count($user) > 0) {
                    $usersStamps->whereIn('user_id', $user);
                    $usersStampsCount->whereIn('user_id', $user);

                }
            } else {
                $nameSearch = explode(' ', request()->search);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {

                    $user = User::where(self::USER_FIRST_NAME, 'like', '%' . str_replace('%', '', $nameSearch[0]) . '%')
                        ->orWhere(self::USER_FAMILY_NAME, 'like', '%' . $nameSearch[1] . '%')
                        ->pluck(self::USER_ID);
                    $usersStamps->whereIn('user_id', $user);
                    $usersStampsCount->whereIn('user_id', $user);


                } else {
                    $user = User::where(self::USER_FIRST_NAME, 'like', '%' . request()->search . '%')->orWhere(self::USER_FAMILY_NAME, 'like', '%' . request()->search . '%')->orWhere(self::EMAIL, 'like', '%' . request()->search . '%')->pluck(self::USER_ID);
                    $usersStamps->whereIn('user_id', $user);
                    $usersStampsCount->whereIn('user_id', $user);


                }
            }
        }

        if (!empty(request()->start_date) && !empty(request()->end_date)) {

            $usersStamps->whereDate('created_at', '>=', request()->start_date . ' 00:00:00')->whereDate('created_at', '<=', request()->end_date . ' 00:00:00');
            $usersStampsCount->whereDate('created_at', '>=', request()->start_date . ' 00:00:00')->whereDate('created_at', '<=', request()->end_date . ' 00:00:00');


        }

        $data = ['status' => true, 'data' => $usersStamps->orderBy('created_at', 'DESC')->groupBy('user_id', 'punch_id')->skip(request()->offSet)->take(request()->pageSize)->get(), 'count' => $usersStampsCount->get()->count()];

        if (!empty($data)) {
            foreach ($data['data'] as $key => $value) {
                $credit = UserStamp::where(['user_id' => $value->user_id])->sum('credit');
                $debit = UserStamp::where(['user_id' => $value->user_id])->sum('debit');

                $initialTotal = $credit - $debit;
                if ($initialTotal < 0)
                    $initialTotal = 0;
                $initial_points = $initialTotal % 5;

                $intial_stamps = (int)(($initialTotal) / 5);
                $user = User::where('user_id', $value->user_id)->first();
                if ($user) {

                    $data['data'][$key]['report'] = UserStamp::where('user_id', $value->user_id)->orderBy('created_at', 'DESC')->get();
                    $data['data'][$key]['user'] = $user->only(['user_id', 'email', 'client_customer_id', 'user_family_name', 'user_first_name']);
                    $data['data'][$key]['stamp'] = PunchCard::where('id', $value->punch_id)->get();
                    foreach ($data['data'][$key]['stamp'] as &$punchValue) {
                        $business = Voucher::where('id', $punchValue['voucher_id'])->first(['business', 'image']);
                        $punchValue['business'] = $business['business'] ?? (object)[];
                        $data['data'][$key]['image'] = (!empty($business['image'])) ? url('/' . $business['image']) : '';
                    }
                    $data['data'][$key]['available_stamp'] = $initial_points ?? 0;
                    $data['data'][$key]['active'] = false;
                } else {
                    unset($data['data'][$key]);

                }
            }
        }

        $data['data'] = array_values($data['data']->toArray());
        return $data;
    }//------ End of getAllStamps() ------//

    /**
     * @param $query
     * @param $search
     * @return mixed
     */
    private function findDataAgainstStampSearch($query, $search)
    {

        if (is_numeric($search)) {
            $user = User::where(self::CLIENT_CUSTOMER_ID, 'like', '%' . $search . '%')->pluck(self::USER_ID);
            if ($user->isNotEmpty()) {
                $query['bool']['must'][] = [self::TERMS => [self::PERSONA_ID => $user]];
            }
        } else {

            $nameSearch = explode(' ', $search);
            if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {


                $user = User::where(self::USER_FIRST_NAME, 'like', '%' . str_replace('%', '', $nameSearch[0]) . '%')
                    ->orWhere(self::USER_FAMILY_NAME, 'like', '%' . $nameSearch[1] . '%')
                    ->pluck(self::USER_ID);

                if ($user->isNotEmpty()) {
                    $query['bool']['must'][] = [self::TERMS => [self::PERSONA_ID => $user]];
                }
            } else {
                $user = User::where(self::USER_FIRST_NAME, 'like', '%' . $search . '%')->orWhere(self::USER_FAMILY_NAME, 'like', '%' . $search . '%')->orWhere(self::EMAIL, 'like', '%' . $search . '%')->pluck(self::USER_ID);
                if ($user->isNotEmpty()) {
                    $query['bool']['must'][] = [self::TERMS => [self::PERSONA_ID => $user]];
                }
            }
        }
        return $query;
    }//------ End of findDataAgainstStampSearch() ------//


    public function redeemVoucher()
    {
        $voucher = VoucherUser::where(['voucher_code' => request()->voucherID, 'user_id' => request()->userid])->delete();
        return [self::STATUS => true, self::MESSAGE => 'Voucher Successfully delete'];
    }

    private function getVoucherAvailDetail($voucher_code, $voucher_avial_data)
    {

        $transactionDetails = MemberTransaction::where('order_detail', 'like', '%voucher_code":"' . $voucher_code . '"%')->orderBy(self::CREATED_AT, "desc")->first();
        if ($transactionDetails) {
            $voucherDetail = collect(json_decode($transactionDetails->order_detail));

            foreach ($voucher_avial_data as $key => $value) {
                if ($voucherDetail->where('discount_amt', '>', '0')->where('prd_name', $value['cat_product_name'])->first()) {
                    $voucher_avial_data[$key][self::STATUS] = 1;
                } else {
                    $voucher_avial_data[$key][self::STATUS] = 0;
                }
            }
            $price = array_column($voucher_avial_data, self::STATUS);

            array_multisort($price, SORT_DESC, $voucher_avial_data);

            return $voucher_avial_data;

        } else {
            foreach ($voucher_avial_data as $key => $value) {
                $voucher_avial_data[$key][self::STATUS] = false;
            }
            return $voucher_avial_data;
        }
    }

    public function getUserByMultipleSearch()
    {
        $data = ElasticsearchUtility::getPetronDetail(\request()->all(), \config('constant.ES_INDEX_BASENAME'));
        return ['status' => true, 'data' => $data];
    }

    /**
     * @return array
     */
    public function stampCardAssign()
    {
        try {
            $user = \request()->user();
            $credit = UserStamp::where(['user_id' => request()->userID, 'punch_id' => request()->stampid, 'company_id' => request()->company_id])->sum('credit');
            $debit = UserStamp::where(['user_id' => request()->userID, 'punch_id' => request()->stampid, 'company_id' => request()->company_id])->sum('debit');
            $punchCard = PunchCard::where(['id' => request()->stampid])->first()->toArray();
            Log::channel('custom')->info('stampCardAssign()', ['punchCard', request()->all()]);
            if (count($punchCard) == 0) {
                return ['status' => false, 'message' => 'punch card not exists'];
            }

            $through = request()->assign_through;
            if($user['user_type'] == 'web'){
                $email = $user->email;
                $through = "From Engage: User $email";
            }

            $initialTotal = $credit - $debit;
            if ($initialTotal < 0)
                $initialTotal = 0;
            $initial_points = ($initialTotal % (int)$punchCard['no_of_use']);
            $intial_stamps = (int)(($initialTotal) / (int)$punchCard['no_of_use']);

            if (!request()->addStamps) {
                UserStamp::insert([
                    'user_id' => request()->userID,
                    'punch_id' => request()->stampid,
                    'company_id' => request()->company_id,
                    'venue_id' => 0,
                    'debit' => 0,
                    'credit' => request()->stampassign,
                    'created_at' => date('Y-m-d H:i'),
                    'updated_at' => date('Y-m-d H:i'),
                    'assign_through' => $through
                ]);
                $final_total = ($initialTotal) + (request()->stampassign);
                $final_points = $final_total % (int)$punchCard['no_of_use'];
                $final_stamps = (int)(($final_total) / (int)$punchCard['no_of_use']);
                $numberOfVouchers = ($final_stamps) - ($intial_stamps);

                if (request()->notify) {
                    $recievedPunch = (request()->stampassign == 1) ? request()->stampassign . ' Stamp' : 'stamp ' . request()->stampassign . ' Stamps';
                    $message = "Burger Joy! You’ve just received $recievedPunch T&C’s apply.";
                    (new Gamification())->sendNotificationsToDevices(request()->userID, $message, 'punch_stamp');
                }

                if ($final_stamps > $intial_stamps) {

                    $this->assignVoucher($numberOfVouchers, $punchCard['voucher_id']);

                }

                return ['status' => true, "stamps" => $final_stamps, "points" => $final_points];

            } else {

                $initialTotal = $credit - $debit;
                $initial_points = $initialTotal % (int)$punchCard['no_of_use'];
                if ($initial_points >= request()->stampassign)
                    $finaldebit = request()->stampassign;
                else
                    $finaldebit = $initial_points;


                if ($finaldebit != 0) {
                    UserStamp::insert([
                        'user_id' => request()->userID,
                        'punch_id' => request()->stampid,
                        'company_id' => request()->company_id,
                        'venue_id' => 0,
                        'debit' => $finaldebit,
                        'credit' => 0,
                        'created_at' => date('Y-m-d H:i'),
                        'updated_at' => date('Y-m-d H:i'),
                        'assign_through' => $through
                    ]);


                }
                return ['status' => true, "stamps" => $intial_stamps, "points" => $initial_points];
            }

        } catch (\Exception $e) {
            Log::channel('custom')->error('stampCardAssign()', ['stampCardAssign()' => $e->getMessage()]);
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }//---- End of stampCardAssign() -----//

    /**
     * @param $stamps
     * @param $punchCard
     * @return array
     */
    public function assignVoucher($stamps, $voucherid)
    {
        $voucher = Voucher::where(['id' => $voucherid, 'company_id' => request()->company_id])->first();
        if ($voucher->voucher_type == 'group-voucher') {
            $vouchers = collect(json_decode($voucher->voucher_avial_data, true))->pluck('id');
        } else {
            $vouchers = [$voucher->id];
        }
        Log::channel('custom')->info('randomVoucher()', ['randomVoucher', $vouchers]);
        $voucherList = Voucher::whereIn('id', $vouchers)->get();

        $data = [];
        for ($i = 0; $i < $stamps; $i++) {
            $random = rand(0, (count($vouchers) - 1));
            $randomVoucher = $voucherList[$random];
            $voucherCode = $this->checkValidCode($randomVoucher->pos_ibs);

            $data[] = [
                "user_id" => request()->userID,
                "company_id" => request()->company_id,
                "voucher_start_date" => ($randomVoucher->isNumberOfDays) ? date('Y-m-d H:i', strtotime('-1 days')) : $randomVoucher->start_date,
                "voucher_end_date" => ($randomVoucher->isNumberOfDays) ? date('Y-m-d H:i', strtotime('+' . $randomVoucher->isNumberOfDays . ' days')) : $randomVoucher->end_date,
                "no_of_uses" => $randomVoucher->no_of_uses,
                "uses_remaining" => $randomVoucher->no_of_uses,
                "created_at" => date('Y-m-d H:i'),
                "updated_at" => date('Y-m-d H:i'),
                "voucher_id" => $randomVoucher->id,
                "voucher_code" => $voucherCode,
                'punch_id' => request()->stampid,
                "group_id" => $randomVoucher->group_id ?? 0,
            ];
            StampCompleted::insert([
                'user_id' => request()->userID,
                'punch_id' => request()->stampid,
                'completed' => 1,
                'created_at' => date('Y-m-d H:i'),
                'updated_at' => date('Y-m-d H:i')
            ]);
            VoucherUser::insert($data);

        }
        if (request()->notify) {
            $message = "Freebie! You've completed your stamp card. You have a $stamps voucher Tap on voucher in the app and redeem on your next purchase. T&C’s apply";
            (new Gamification())->sendNotificationsToDevices(request()->userID, $message, 'punch_card_voucher');
        }
        return ['status' => true];
    }//----- End of assignVoucher() ------//

    /**
     * @param $punchCard
     * @param $punchCompleted
     * @return bool
     */
    private function completePunchAssignPunch($punchCard, $punchCompleted)
    {
        $dataLogs = [
            "persona_id" => request()->userID,
            "merchants_ids" => "0",
            "custom_doc_type" => "assigned_stamp",
            "date_added" => date('Y-m-d H:i:s'),
            "number" => 1,
            "id" => $punchCard['id'] . "_" . request()->userID . "_punch_card",
            "amount" => (!request()->addStamps) ? request()->stampassign : -request()->stampassign,
            "category" => $punchCard['discount_type'],
            "venue_id" => "295255"
        ];
        $completedPunch = [
            "persona_id" => request()->userID,
            "merchants_ids" => "0",
            "custom_doc_type" => "completed_punch",
            "date_added" => date('Y-m-d H:i:s'),
            "number" => 1,
            "id" => $punchCard['id'] . "_" . request()->userID . "_punch_card",
            "amount" => (!request()->addStamps) ? request()->stampassign : -request()->stampassign,
            "category" => $punchCard['discount_type'],
            "venue_id" => "295255"
        ];
        ElasticsearchUtility::insert(config('constant.ES_INDEX_BASENAME'), $dataLogs, '');
        ElasticsearchUtility::insert(config('constant.ES_INDEX_BASENAME'), $completedPunch, '');
        return true;
    }//----- End of completePunchAssignPunch() ----//

    public function redeemVoucherStatus()
    {
        if (empty(request()->start_date) and empty(\request()->end_date)) {
            $start_date = date('Y-m-d', strtotime('-6 days'));
            $endDate = date('Y-m-d');

        } else {
            $start_date = request()->start_date;
            $endDate = request()->end_date;
        }

        $newArray = (new ElasticSearchController())->getDatesBetweenTwoDates($start_date, $endDate);
        $allDates = array_reverse($newArray, true);

        foreach ($allDates as $dates) {
            $startDate = $dates . ' 00:00:00';
            $endDate = $dates . ' 23:59:59';

            $redeemVoucher = VoucherLog::whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)->count();
            $assignedStamps = UserStamp::whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)->count();
            $stampCompleted = StampCompleted::whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)->count();
            $voucherAssigned = VoucherUser::whereDate('created_at', '>=', $startDate)->whereDate('created_at', '<=', $endDate)->count();

            $finalData[] = ['date' => date('d/m/Y', strtotime($dates)), 'redeemVoucher' => $redeemVoucher, 'assignedStamps' => $assignedStamps, 'stampCompleted' => $stampCompleted, 'voucherAssigned' => $voucherAssigned, 'active' => false];
        }
        return ['status' => true, 'data' => $finalData];
    }

    private function checkRedeedmVouchers($reedemed, $ids)
    {
        $vouchers = ElasticsearchUtility::voucherDetail(config('constant.ES_INDEX_BASENAME'), $ids);
        if (count($vouchers) > 0) {
            foreach ($reedemed['records']['buckets'] as $voucherRecordValue) {
                foreach ($vouchers as $redeemKey => $voucherRedeemption) {
                    if (isset($voucherRedeemption['_source']['voucher_code']))
                        if ($voucherRecordValue['key'] == $voucherRedeemption['_source']['voucher_code']) {
                            $vouchers[$redeemKey]['_source']['usedVoucher'] = $voucherRecordValue['doc_count'];
                        }
                }

            }
        }
        return $vouchers;
    }


    public function updateMemberCustomFields(Request $request)
    {
        try {
            if(isset(request()->delete_form) && count(request()->delete_form) > 0){
                foreach (request()->delete_form as $key => $value){
                    UserCustomFieldData::where(["form_id"=>$value["form_id"],"form_index"=>$value['form_index']])->delete();
                }
            }

            $user = User::find($request->input('user_id'));

            $form_data = collect($request->form_data);

            $form_data = $form_data->groupBy('parent_id');
            $form_data->toArray();





            //......... custom field logic will set here datetime will be converted to milisecond  ....//
            /*$allCustomFields = Venue::select("custom_fields")->where("venue_id", request()->venue_id)->first();
            if ($allCustomFields)
                $this->customFields = collect(json_decode($allCustomFields->custom_fields));*/

            $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
            $allCustomFields = json_encode($custom_fields);
            if ($allCustomFields)
                $this->customFields = collect(json_decode($allCustomFields));

            $userCustomFields = collect(json_decode($request->custom_fields));



            $tableUserCustomFields = [];

            foreach ($userCustomFields as $key => $value) {
                $signle_data = [];
                $field_type = $this->getFieldType($key);
                $field_id = $this->getFieldId($key);
                if($field_id !="not_found"){
                    $signle_data['custom_field_id'] = $field_id;
                    $signle_data['user_id'] = request()->user_id;
                    $signle_data['created_at'] = date("Y-m-d H:i:s");
                    $signle_data['updated_at'] = date("Y-m-d H:i:s");


                    if ($field_type == "datetime") {
                        //$userCustomFields[$key] = strtotime($userCustomFields[$key]) * 1000;
                        $signle_data["value"] = strtotime($userCustomFields[$key]) * 1000;

                    }else if($field_type == "dropdown"){
                        $signle_data["value"] = json_encode($value);

                    }else{
                        $signle_data['value'] = $value;
                    }


                    array_push($tableUserCustomFields,$signle_data);
                }

            }

            foreach ($tableUserCustomFields as $key => $value){
                UserCustomFieldData::updateOrCreate(
                    ["user_id" => $request->input('user_id'),"custom_field_id"=>$value["custom_field_id"]],
                    ["user_id"=>$value["user_id"],"custom_field_id"=>$value["custom_field_id"],"value"=>$value["value"]]
                );
            }


            //................. foreach for form data of user, dynamic forms of user   ................//
            $userFormData = [];
            foreach ($form_data as $form_id => $value){
                foreach ($value as $form_index => $value2){
                    foreach ($value2 as $key3 => $value3){


                        $signle_data = [];
                        $field_type = $this->getFieldType($key3,$form_id);

                        $field_id = $this->getFieldId($key3,$form_id);
                        if($field_id !="not_found"){
                            $signle_data['custom_field_id'] = $field_id;
                            $signle_data['user_id'] = request()->user_id;
                            $signle_data['created_at'] = date("Y-m-d H:i:s");
                            $signle_data['updated_at'] = date("Y-m-d H:i:s");
                            $signle_data['form_id'] = $form_id;
                            $signle_data['form_index'] = $form_index;


                            if ($field_type == "datetime") {
                                //$userCustomFields[$key] = strtotime($userCustomFields[$key]) * 1000;
                                $signle_data["value"] = strtotime($value3) * 1000;

                            }else if($field_type == "dropdown"){
                                $signle_data["value"] = json_encode($value3);

                            }else{
                                $signle_data['value'] = $value3;
                            }


                            array_push($userFormData,$signle_data);
                        }



                    }
                }
            }
            foreach ($userFormData as $key => $value){
                UserCustomFieldData::updateOrCreate(
                    ["user_id" => $request->input('user_id'),"custom_field_id"=>$value["custom_field_id"],"form_id"=>$value["form_id"],"form_index"=>$value["form_index"]],
                    ["user_id"=>$value["user_id"],"custom_field_id"=>$value["custom_field_id"],"value"=>$value["value"],"form_id"=>$value["form_id"],"form_index"=>$value["form_index"]]
                );
            }

            //----------------- end of dynamic form data    ........................//


            /*$params_to_update = [
                'custom_fields' => $userCustomFields,
            ];
            $user->update($params_to_update);*/

            $res = (new ElasticsearchUtility())->bulkUserDataInsertNew(User::where('user_id', $user->user_id)->get(), '');


            return ['status' => true, 'message' => 'Member updated successfully.'];
        }
        catch(\Exception $e) {
            Log::channel('custom')->error('updateMemberCustomFields_error', ['updateMemberCustomFields_error' => $e->getMessage(), 'updateMemberCustomFields_error_line' => $e->getLine()]);
            return ['status' => false, 'message' => 'Member not updated'];
        }


    }//--- End of updateMember() ---//

    public function getFieldType($key,$parent_id=0)
    {

        $field = $this->customFields->where("field_name", $key)->where("parent_id",$parent_id)->first();


        if (isset($field->field_type))
            return $field->field_type;
        else
            return "not_found";
    }

    public function getFieldId($key,$parent_id=0)
    {

        $field = $this->customFields->where("field_name", $key)->where("parent_id",$parent_id)->first();


        if (!empty($field))
            return $field->id;
        else
            return "not_found";
    }


    public function totalRedeemVoucher()
    {
        if (request()->filterby == "week") {
            $start_date = date('Y-m-d', strtotime('-1 week'));
            $dates = $this->getDatesBetweenTwoDates($start_date, date("Y-m-d"));
        } else if (request()->filterby == "day") {
            $dates = $this->getDatesBetweenTwoDates(date("Y-m-d"), date("Y-m-d"));
        } else if (request()->filterby == "month") {
            $start_date = date('Y-m-d', strtotime('-1 months'));
            $dates = $this->getDatesBetweenTwoDates($start_date, date("Y-m-d"));
        } else if (request()->filterby == "year") {
            $dates = $this->getMonths(12);
        } else {
            $dates = $this->getDatesBetweenTwoDates(request()->start_date, request()->end_date);
        }
        $count = 0;
        foreach ($dates as $date) {

            $voucherCount = VoucherLog::whereDate('created_at', '<=', $date)->whereDate('created_at', '>=', $date)->count();

            $count = $count + $voucherCount;
        }


        return ["status" => true, "count" => $count];
    }

    public function updateMemberSubscriptions($id, $channel, $value)
    {

        $data = $this->updateUserNotificationInDb($id, $channel, $value);
        $query = [
            /*'doc' => [
                "{$channel}" => $value ? true : false
            ]*/
            'doc' => $data
        ];

        try {
            ElasticsearchUtility::update(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), $query, $id);
            return [self::STATUS => true, self::MESSAGE => 'Member channel status updated successfully.'];
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => "Error occurred while updating member's channel status."];
        }//..... end of try-catch() .....//
    }//..... end of updateMemberChannelStatus() .....//

    public function updateUserNotificationInDb($id, $channel, $value)
    {
        $data = [
            "is_pointme_user" => true,
            "email_subscribed_flag" => true,
            "sms_subscribed_flag" => true,
            "is_pointme_notifications" => true,
            "mail_subscribed_flag" => true,
        ];

        $user = User::select("user_notifications")->whereUserId($id)->first();
        if (!empty($user))
            $data = json_decode($user->user_notifications, true);


        if (request()->channel == "sms_subscribed_flag") {
            $data[$channel] = $value ? true : false;

        } else if (request()->channel == "email_subscribed_flag") {
            $data[$channel] = $value ? true : false;
            $data["mail_subscribed_flag"] = $value ? true : false;

        } else {
            $data[$channel] = $value ? true : false;
            $data["is_pointme_user"] = $value ? true : false;

        }
        User::whereUserId($id)->update(["user_notifications" => json_encode($data)]);
        return $data;
    }

    public function getDates($days)
    {

        $dates = [];
        for ($i = $days; $i >= 0; $i--) {
            $date = strtotime("-$i day");
            array_push($dates, date('Y-m-d', $date));
        }

        return $dates;
    }

    public function getMonths($numbers)
    {
        $months = [];
        for ($i = 1; $i <= $numbers; $i++) {
            $months[] = date("Y-m-d", strtotime(date('Y-m-01') . " -$i months"));
        }

        return $months;
    }

    public function getHours()
    {

        return ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"];
    }

    public function getHours12()
    {

        return ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"];
    }


    public function getDatesBetweenTwoDates($Date1, $Date2)
    {

        $array = array();

        $Variable1 = strtotime($Date1);
        $Variable2 = strtotime($Date2);

        for ($currentDate = $Variable1; $currentDate <= $Variable2;
             $currentDate += (86400)) {

            $Store = date('Y-m-d', $currentDate);
            $array[] = $Store;
        }

        return $array;
    }

    /**
     * @return array
     */
    public function unsubscriptionUser()
    {
        $str = json_decode(base64_decode(\request()->id));

        $user = User::where('user_id', $str->user_id)->first()->toArray();
        $user['campaign_id'] = $str->campaign_id;
        $user['campaign_company_id'] = $str->company_id;

        return view('unsubscribe', ['user' => $user]);
    }//----- End of unsubscriptionUser() ------//


    public function getUserSubscribedVenues($userID)
    {
        $subscribedVenues = UserVenueRelation::where(["user_id" => $userID])->get(["user_id", "venue_id", "date"]);

        return $subscribedVenues ? $subscribedVenues->toArray() : [];
    }

    public function updateUserVenueSubscription($userId, $venueID, $date)
    {
        UserVenueRelation::updateOrCreate(
            ["user_id" => $userId, "venue_id" => $venueID],
            ["user_id" => $userId, "venue_id" => $venueID, "date" => $date]
        );
        $subscribedVenues = UserVenueRelation::where(["user_id" => $userId, "venue_id" => $venueID])->get(["user_id", "venue_id"]);
        return $subscribedVenues ? $subscribedVenues->toArray() : [];
    }

    public function smsStatus()
    {
        try {
            Log::channel('custom')->info('smsStatus', ['smsStatus' => \request()->all()]);
            $str = json_decode(base64_decode(\request()->custom_info));
            DB::table('notification_events')->insert([
                'user_id' => $str->user_id,
                'campaign_id' => $str->campaign_id,
                'company_id' => $str->company_id,
                'event' => request()->SmsStatus,
                'email' => request()->To,
                'event_type' => 'sms',
                'timestamp' => strtotime(date('Y-m-d h:i:s'))
            ]);
        }
        catch(\Exception $e) {
            Log::channel('custom')->info('smsStatus_error', ['smsStatus_error' => $e->getMessage()]);
        }
    }


    public function getallRedeemVoucher()
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $query = [
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => [
                                    "value" => "redeemed_voucher"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = (new ElasticsearchUtility())->getAllData($query, $index);
        foreach ($response as $value) {
            if ($value['campaign_id'] > 0) {
                $voucher = VoucherUser::where('campaign_id', $value['campaign_id'])->first();
            } else if ($value['from_punch_card'] > 0) {
                $voucher = VoucherUser::where('punch_id', $value['from_punch_card'])->first();
            }
            if ($voucher) {
                VoucherLog::create([
                    'voucher_code' => $value['voucher_code'],
                    'user_id' => $value['persona_id'],
                    'voucher_id' => $voucher->voucher_id,
                    'created_at' => date('Y-m-d h:i:s', strtotime($value['redeemed_datetime'])),
                    'updated_at' => date('Y-m-d h:i:s', strtotime($value['redeemed_datetime'])),
                ]);
            }
        }
        return ['status' => true, 'message' => 'Successfully updated'];

    }

    public function getallAssignedStamps()
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $query = [

            "bool" => [
                "must" => [
                    [
                        "term" => [
                            "custom_doc_type" => [
                                "value" => "assigned_stamp"
                            ]
                        ]
                    ]
                ]
            ]

        ];

        $response = ElasticsearchUtility::getPaginatedata($index, \request()->perPage, \request()->offset, $query, '', '', '');

        if (count($response) > 0) {
            try {
                foreach ($response as $value) {
                    $value = $value['_source'];

                    $punchCardId = explode('_', $value['id']);
                    $user = User::where('user_id', $value['persona_id'])->first();

                    if ($user) {
                        $requestParam = new \Illuminate\Http\Request();
                        $requestParam->setMethod('POST');
                       $requestParam->request->add(['persona_id' => $value['persona_id'],'filter'=>'week','company_id' => 2,'venue_id'=>'262751']);
                           $totalAmount = $this->getMemberStampCardsStas($requestParam);
                        $data = [
                            'user_id' => $value['persona_id'],
                            'punch_id' => $punchCardId[0],
                            'company_id' => $user->company_id ?? $user['company_id'],
                            'created_at' => date('Y-m-d h:i:s', strtotime($value['date_added'])),
                            'updated_at' => date('Y-m-d h:i:s', strtotime($value['date_added'])),
                            'credit' => $totalAmount['total'],

                        ];

                        UserStamp::updateOrCreate(['user_id'=> $value['persona_id']],$data);
                    }
                }
                return ['status' => true, 'message' => 'Successfully updated'];
            } catch (\Exception $e) {
                return ['status' => false, 'message' => $e->getMessage()];
            }
        } else {
            return ['status' => false, 'message' => 'Nothing to update'];
        }

    }

    function getDatesFromRange($start, $end)
    {
        $dates = array($start);

        while (end($dates) < $end) {
            $dates[] = date('Y-m-d', strtotime(end($dates) . ' +1 day'));

        }

        return $dates;
    }

    public function getVenueDetails()
    {
        $members = MemberTransaction::all();
        foreach ($members as $key => $value) {
            UserVenueRelation::updateOrCreate(
                ["user_id" => $value['user_id'], "venue_id" => $value['business_id']],
                ["user_id" => $value['user_id'], "venue_id" => $value['business_id'], "date" => $value['created_at']]
            );
        }
        return ['status' => true, 'message' => 'Succesfully inserted'];
    }

    public function stampConverted()
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $query = [
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => [
                                    "value" => "user_integrated_voucher"
                                ]
                            ]
                        ]
                        , [
                            "range" => [
                                "from_punch_card" => [
                                    "gt" => 0
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = (new ElasticsearchUtility())->getAllData($query, $index);
        foreach ($response as $value) {
            StampCompleted::create([
                'punch_id' => $value['from_punch_card'],
                'user_id' => $value['user_id'],
                'created_at' => date('Y-m-d h:i:s', $value['dateadded']),
                'updated_at' => date('Y-m-d h:i:s', $value['dateadded']),
                'completed' => 1,
            ]);
        }
        return ['status' => true, 'message' => 'Successfully updated'];
    }

    public function userUnsubscribeEmail()
    {
        $source = "ctx._source['mail_subscribed_flag'] = false;ctx._source['email_subscribed_flag'] = false";
        $query = [
            "script" => [
                "inline" => $source
            ],
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => "demographic"
                            ]
                        ],
                        [
                            "term" => [
                                "_id" => [
                                    "value" => request()->id
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
        ElasticsearchUtility::updateByQuery(ElasticsearchUtility::generateIndexName(), $query);
        DB::table('notification_events')->insert([
            'company_id' => request()->company_id,
            'campaign_id' => request()->campaign_id,
            'user_id' => request()->id,
            'email' => request()->email,
            'event' => 'unsubscribe',
            'event_type' => 'email',
            'timestamp' => strtotime(date('Y-m-d h:i:s a'))
        ]);
        return ['status' => true, 'message' => 'Successfully Unsubscribed'];
    }

    /**
     * @param $posibs
     * @return string
     */
    private function checkValidCode($posibs)
    {
        $voucherCode = (new Gamification())->getIBSCode($posibs ?? 0);
        $voucher = VoucherUser::where('voucher_code', $voucherCode)->first();
        if ($voucher) {
            return $this->checkValidCode($posibs);
        } else {
            return $voucherCode;
        }
    }//----End of checkValidCode() -----//

    public function getMemberStampCardsStas(Request $request)
    {
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.punch_card')]],
                    ['match' => ['persona_id' => $request->persona_id]],
                    /*  [
                          "range" => [
                              "assigned_last_date" => [
                                  "gte" => $filter_date,
                              ]
                          ]
                      ],*/

                ]
            ]
        ];
        $query = [
            'size' => 1000,
            'query' => $search_query,
        ];


        $stamp_cards = ElasticsearchUtility::getSource(ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id), $query);

        $coll_stamp = collect($stamp_cards);
        $coll_stamp->pluck('punch_card_rule.id')->toArray();
        $mysql_punches = $this->getMysqlPunches(array_unique($coll_stamp->pluck('punch_card_rule.id')->toArray()), $request->persona_id);

        if (isset($mysql_punches['hits']['hits']) and count($mysql_punches['hits']['hits']) > 0) {
            foreach ($mysql_punches['hits']['hits'] as $mysql_punch) {
                array_push($stamp_cards, $mysql_punch['_source']);
            }
        }

        $completed_stamp_cards = 0;
        $total_punch_cards = 0;
        $iterator = 0;
        $stamps = [];

        foreach ($stamp_cards as &$stamp_card) {
            if ($stamp_card['punch_card_rule']['deleted_at'] == null || $stamp_card['punch_card_rule']['deleted_at'] == '') {
                $completed_stamp_cards += $stamp_card['punch_card_count'];
                $total_punch_cards += ($stamp_card['punch_card_count'] * $stamp_card['punch_card_rule']['no_of_use']) + $stamp_card['quantity'];

                $stamp_card['color'] = $stamp_card['punch_card_rule']['card_color'];
                $stamps[] = $stamp_card;
            }
            $iterator++;
        }

        $incomplete_stamp_cards = 0;
        return [
            'completed' => $completed_stamp_cards,
            'incomplete_stamp_cards' => $incomplete_stamp_cards,
            'total' => $total_punch_cards,
        ];
    }//--- End of getMemberStampCards() ---//




    public function userCustomFormData()
    {
        $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $allCustomFields = json_encode($custom_fields);
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields));

        $findUserForms = DB::table("user_custom_field_data")
            ->leftJoin("user_custom_field","user_custom_field.id","=","user_custom_field_data.custom_field_id")
            ->where('user_custom_field_data.user_id',request()->persona_id)
            ->where('user_custom_field_data.form_id',"=",request()->form_id)
            ->where('user_custom_field_data.form_index',"=",request()->form_index)
            ->get(["user_custom_field_data.*","user_custom_field.field_name"]);

        $data = [];

        foreach ($findUserForms as $key => $value){


            $field_type = $this->getFieldType($value->field_name,request()->form_id);

            if ($field_type == "datetime") {
                $seconds = $value->value / 1000;
                $data[$value->field_name] = date("d-m-Y H:i:s", $seconds);
                array_push($data2,["field_type"=>$field_type]);
            }
            else if ($field_type == "dropdown") {

                $data[$value->field_name] = json_decode($value->value);

            }else{
                $data[$value->field_name] = $value->value;

            }

        }

        return["status"=>true,"data"=>$data];
    }


    public function getUserFormData($user_id)
    {
        $custom_fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $allCustomFields = json_encode($custom_fields);
        if ($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields));

        $data =   DB::table("user_custom_field_data")
            ->leftJoin("user_custom_field","user_custom_field.id","=","user_custom_field_data.custom_field_id")
            ->where('user_custom_field_data.user_id',$user_id)
            ->where('user_custom_field_data.form_id',"!=",0)

            ->get([
                "user_custom_field_data.custom_field_id",
                "user_custom_field_data.user_id",
                "user_custom_field_data.value",
                "user_custom_field_data.form_id",
                "user_custom_field_data.form_index",
                "user_custom_field.field_name"
            ]);
        $final_data = [];

        foreach ($data as $key => $value){
            $field_type = $this->getFieldType($value->field_name,$value->form_id);

            $r = [
              "custom_field_id" => $value->custom_field_id,
              "user_id" => $value->user_id,
               "form_id" => $value->form_id,
              "form_index" => $value->form_index,
              $value->field_name => (!empty($value->value)) ? json_decode($value->value,true) : "",
           ];
            if($field_type == "dropdown"){
                $r[$value->field_name] = (!empty($value->value)) ? json_decode($value->value,true) : [];
            }else if ($field_type == "datetime") {
                //$userCustomFields[$key] = strtotime($userCustomFields[$key]) * 1000;
                $r[$value->field_name] = strtotime($value->value) * 1000;

            }else{
                $r[$value->field_name] = (!empty($value->value)) ? $value->value : "";
            }
            array_push($final_data,$r);
        }
        return $final_data;

    }


}//..... end of class.

