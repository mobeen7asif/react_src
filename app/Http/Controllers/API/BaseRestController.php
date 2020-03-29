<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 9:54 AM
 */

namespace App\Http\Controllers\Api;

use App\Facade\StarrtecLog;
use App\Http\Controllers\Controller;
use App\Models\LevelConfiguration;
use App\Models\ShopCategory;
use App\Models\Beacon;
use App\Models\VenueShops;
use App\UnifiedDbModels\Store;
use App\Models\Venue;
use App\Models\VenueImage;
use App\Models\VenueSubscription;
use App\UnifiedPosApi\SoldiPosApi;
use App\UnifiedPosApi\StarrtecPosApi;
use App\ApiCalls\SoldiPosApiCall;
use App\UnifiedPosApi\SwiftPosApi;
use App\UnifiedSchemaCall\SoldiPosUnifiedSchema;
use App\UnifiedSchemaCall\SwiftPosUnifiedSchemaCall;
use App\User;
use App\Utility\Utility;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use App\Facade\SoldiLog;


class BaseRestController extends Controller
{
    /*sonar constants*/
    const DATA_FOUND            = 'Data Found.';
    const DATA_NOT_FOUND        = 'Data Not Found.';
    const COMPANY_ID            = 'company_id';
    const MEMBERSHIP_ID         = 'membership_id';
    const PERSONA_ID            = 'persona_id';
    const STATUS                = 'status';
    const MESSAGE               = 'message';
    const PATRON_ID             = 'patron_id';
    const PARAMS_MISSING        = 'Some parameters are missing.';
    const VENUE_CAT_URL         = '/venue_category/';
    const GLOBAL                = 'global';
    const IMAGE                 = 'image';
    const PAY_WITH_POINTS       = 'pay_with_points';
    const DATE_FORMAT           = 'g:i a';
    const AUTO_CHECKOUT         = 'auto_checkout';
    const VENUE_ID              = 'venue_id';
    const AMOUNT                = 'amount';


    private $soldiUnifiedPosHandler,
        $apiCall;
    private $swiftPosUnifiedSchemeCallHandler;

    /**
     * BaseRestController constructor.
     */
    public function __construct()
    {
        $this->apiCall = new SoldiPosApiCall();
        $this->soldiUnifiedPosHandler = new SoldiPosUnifiedSchema();
        $this->swiftPosUnifiedSchemeCallHandler = new SwiftPosUnifiedSchemaCall();
    }//..... end of __construct() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Get All venues
     */
    public function getAllVenue(Request $request)
    {
        $venues = $this->soldiUnifiedPosHandler->getVenuesList($request->company_id, $request->user_id);
        return !empty($venues)
            ? $this->getResponse($venues, self::DATA_FOUND, true)
            : $this->getResponse([], self::DATA_NOT_FOUND, false);
    }//..... end of getAllVenues() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Get Venues Stores.
     */
    public function getVenueStore(Request $request)
    {
        $stores = $this->getVenueAllStores($request->venue_id, $request->company_id);
        if (!empty($stores)) {
            return $this->getResponse($stores, self::DATA_FOUND, true);
        } else {
            return $this->getResponse([], self::DATA_NOT_FOUND, false);
        }
    }//..... end of getVenueStore() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Check Store which POS does it belong to.
     */

    public function getAllVenuesStores(Request $request)
    {
        $venues = $this->soldiUnifiedPosHandler->getVenuesList($request->company_id, 0);

        if (!empty($venues)) {
            return $this->getResponse($venues, self::DATA_FOUND, true);
        } else {
            return $this->getResponse([], self::DATA_NOT_FOUND, false);
        }
    }//..... end of getAllVenuesStores() ......//

    /**
     * @param $venue_id
     * @param $company_id
     * @return mixed
     */
    public function getVenueAllStores($venue_id, $company_id)
    {
        if (!config("constant.getDataFromApis")) {
            return $this->soldiUnifiedPosHandler->getVenueStores([self::COMPANY_ID => $company_id, self::VENUE_ID => $venue_id]);
        } else {
            return $this->apiCall->getAllStoreFromSoldi([self::COMPANY_ID => $company_id, self::VENUE_ID => $venue_id]);
        }
    }//..... end of getVenueAllStores() .....//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Get All Stores.z
     */
    public function getAllStore(Request $request)
    {
        if (!config("constant.getDataFromApis")) {
            return $this->soldiUnifiedPosHandler->getAllStoresFromUnifiedSchema([self::COMPANY_ID => $request->company_id]);
        } else {
            $this->apiCall->getAllStoreFromSoldi([self::COMPANY_ID => $request->company_id]);
        }
    }//..... end of getAllStore() .....//

    /**
     * @param $store_id
     * @return SoldiPosApi|StarrtecPosApi
     * Check Pos code and create respective pos object.
     */
    public function checkStorePos($store_id)
    {
        $store = Store::where("pos_store_id", $store_id)->first();
        if (!empty($store)) {
            return $this->getRespectiveObject($store->pos_code);
        } else {
            return new SoldiPosApi();
        }
    }//..... end of checkPos() ......//

    /**
     * @param $pos_code
     * @return SoldiPosApi|StarrtecPosApi|SwiftPosApi
     * Return Respective Object.
     */
    private function getRespectiveObject($pos_code)
    {
        if ($pos_code == 1) {
            return new SoldiPosApi();
        } elseif ($pos_code == 2) {
            return new StarrtecPosApi();
        } elseif ($pos_code == 3) {
            return new SwiftPosApi();
        }

        return new SoldiPosApi();
    }//..... end of getRespectiveObject() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Get User Subscribed Venues.
     */
    public function userVenues(Request $request)
    {
        $validator = Validator::make($request->all(), ['user_id' => 'required', self::COMPANY_ID => 'required']);
        if ($validator->fails())
            return $this->getResponse([], $this->getValidationErrors($validator), false);

        $venue_array = [];
        VenueSubscription::whereUserId($request->user_id)->whereCompanyId($request->company_id)->get()
            ->each(function ($re) use (&$venue_array, $request) {
                $venue = $this->soldiUnifiedPosHandler->getVenueById($re->venue_id, $request->company_id, $request->user_id);
                if ($venue)
                    $venue_array[] = $venue;
            });//..... end of each() .....//

        if (!empty($venue_array)) {
            return $this->getResponse($venue_array, self::DATA_FOUND, true);
        } else {
            return $this->getResponse([], self::DATA_NOT_FOUND, false);
        }
    }//..... end of userVenues() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Get Customer Orders.
     */
    public function customer_orders(Request $request)
    {
        if (!config("constant.getDataFromApis")) {
            return $this->soldiUnifiedPosHandler->getCustomerOrdersList($request->customer_id, $request->company_id, $request->amplify_id);
        } else {

            $this->apiCall->customerOrdersFromSoldi(array('customer_id' => $request->customer_id, self::COMPANY_ID => $request->company_id, 'amplify_id' => $request->amplify_id));
        }
    }//..... end of customer_orders() ......//

    /**
     * @param Request $request
     * @return string
     * User Subscribe to a specific venue.
     */
    public function venueSubscription(Request $request)
    {
        $validator = Validator::make($request->all(), ['user_id' => "required", self::COMPANY_ID => "required", self::VENUE_ID => "required"]);
        if ($validator->fails()) {
            return $this->getResponse([], $this->getValidationErrors($validator), false);
        }

        $vs = VenueSubscription::whereUserId($request->user_id)->whereVenueId($request->venue_id)->first();
        if ($vs) {
            $link = 'N';
            $user_ids = 0;
            $lin_res = $this->unlinkAmplifyVenue($request->venue_id, $vs->membership_id, $link, $vs->persona_id);
            $res_arr = json_decode($lin_res);
            if ($res_arr->status == 'true') {

                VenueSubscription::destroy($vs->id);
                return $this->getResponse([], "Venue UnSubscribed Successfully.");

            } else {

                return $this->getResponse([], $res_arr->message, 'false');

            }
        } else {
            $link = 'Y';
            $user_ids = 0;
            $lin_res = $this->linkAmplifyVenue($user_ids, $request->venue_id, $request->membership_id, $link, $request->dob, $request->first_name, $request->last_name);
            $res_arr = json_decode($lin_res);
            if ($res_arr->status == 'true') {
                VenueSubscription::insert(
                    array(
                        self::MEMBERSHIP_ID => $request->membership_id,
                        'user_id' => $request->user_id,
                        self::COMPANY_ID => $request->company_id,
                        self::VENUE_ID => $request->venue_id,
                        self::PERSONA_ID => $res_arr->data->persona_id,
                    )
                );

                return $this->getResponse(array(self::PERSONA_ID => $res_arr->data->persona_id), 'Venue Subscribed Successfully.');
            } else {
                return $this->getResponse([], $res_arr->message, 'false');
            }
        }//..... end if-else .....//
    }//..... end of venueSubscription() ......//

    /**
     * @param $data
     * @param string $msg
     * @param bool $status
     * @return \Illuminate\Http\JsonResponse
     * Get Response json.
     */
    protected function getResponse($data, $msg = "", $status = true)
    {
        return [self::STATUS => $status, self::MESSAGE => $msg, "data" => $data];
    }//..... end of getResponse() .....//

    /**
     * @param $validator
     * @return string
     * Populate Validation Errors as a string.
     */
    protected function getValidationErrors($validator)
    {
        return implode("", $validator->errors()->all());
    }//..... end of getValidationErrors() .....//

    /**
     * @param $user_id
     * @param $venue_id
     * @param $membership_id
     * Send linking venue at amplify request.
     * @return string
     */
    private function linkAmplifyVenue($user_id, $venue_id, $membership_id, $link, $dob, $first_name, $last_name)
    {
        $header = [
            'X-API-KEY' => 'PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk'
        ];

        return $this->apiCall->postJsonThroughGuzzle(config('constant.amplify_URL') . "/user/link/venue", $header, ['user_id' => $user_id, self::VENUE_ID => $venue_id, self::MEMBERSHIP_ID => $membership_id, "link" => $link, "dob" => $dob, "first_name" => $first_name, "last_name" => $last_name]);
    }//..... end of linkAmplifyVenue() .....//

    private function unlinkAmplifyVenue($venue_id, $membership_id, $link, $persona_id)
    {
        $header = [
            'X-API-KEY' => 'PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk'
        ];

        return $this->apiCall->postJsonThroughGuzzle(config('constant.amplify_URL') . "/user/link/venue", $header, [self::VENUE_ID => $venue_id, self::MEMBERSHIP_ID => $membership_id, "link" => $link, self::PERSONA_ID => $persona_id]);
    }

    /**
     * @return array|\Illuminate\Http\JsonResponse
     * Get All Beacons
     */
    public function getAllBeacons()
    {
        $beacons = [];
        Beacon::with(['floor:id,floor_number,floor_name', 'venue'])->get()->each(function ($beacon) use (&$beacons) {
            $beacons[] = [
                'id' => $beacon->id,
                'name' => $beacon->beacon_name,
                'uuid' => $beacon->uuid,
                'major' => $beacon->major,
                'minor' => $beacon->minor,
                'brand_name' => "",
                'added_by' => "",
                'number' => "",
                self::VENUE_ID => $beacon->venue_id,
                self::COMPANY_ID => $beacon->venue->company_id,
                'floor_id' => $beacon->floor->id ?? "",
                'floor_number' => $beacon->floor->floor_number ?? "",
                'floor_name' => $beacon->floor->floor_name ?? ""
            ];
        });

        return (empty($beacons)) ? $this->getResponse([], 'No Beacon Found.', FALSE)
            : [
                self::STATUS => true,
                self::MESSAGE => count($beacons) . " Beacons Found.",
                "data" => $beacons,
                'time_interval' => 60000
            ];
    }//...... end of getAllBeacons() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveBeaconData(Request $request)
    {
        return $this->getResponse([], 'Data Sent to kafka successfully.', true);
    }//..... end of saveBeaconData() ......//

    /**
     * Subscribe for Notification.
     */
    public function subscribeNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            self::VENUE_ID => "required",
            self::PATRON_ID => "required",
            'contact_type' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->getResponse('', 'Some of the keys are missing.', false);
        }

        $header = array(
            "apikey: " . config('constant.COUGAR_API_KEY'),
            "content-type: application/json"
        );

        $url = config('constant.COUGAR_URL') . 'subscribe';
        $data = ['venueId' => $request->venue_id, "patronId" => $request->patron_id, "contactTypes" => $request->contact_type];
        $response = $this->apiCall->curlThroughPost($url, $header, $data);

        if ($response == 202) {
            return $this->getResponse('', 'Subscribed successfully.', true);
        } else {
            return $this->getResponse('', 'could not subscribed, error occurred.', false);
        }
    }//...... end of subscribeNotification() ......//

    /**
     * Un Subscribe for notifications.
     */
    public function unSubscribeNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            self::VENUE_ID => "required",
            self::PATRON_ID => "required",
            'contact_type' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->getResponse('', 'Some of the keys are missing.', false);
        }

        $header = array(
            "apikey: " . config('constant.COUGAR_API_KEY'),
            "content-type: application/json"
        );
        $url = config('constant.COUGAR_URL') . 'unsubscribe';
        $data = ['venueId' => $request->venue_id, "patronId" => $request->patron_id, "contactTypes" => $request->contact_type];

        $response = $this->apiCall->curlThroughPost($url, $header, $data);

        if ($response == 202) {
            return $this->getResponse('', 'UnSubscribed successfully.', true);
        } else {
            return $this->getResponse('', 'could not un subscribed, error occurred.', false);
        }
    }//..... end of unSubscribeNotification() .....//

    /**
     * Get Specific Subscription details.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubscriptionDetails(Request $request)
    {
        if ($request->has(self::VENUE_ID) && $request->has(self::PATRON_ID)) {
            $header = ['X-API-KEY' => config("constant.AMPLIFY_KEY")];
            $url = config('constant.AMPLIFY_URL') . "/member/search?vid=" . $request->venue_id . "&keyword=" . $request->patron_id;
            $data = $this->apiCall->get($url, $header);
            if ($data) {
                $data = json_decode($data);
                if (isset($data->status) && $data->status && isset($data->data[0])) {
                    $user_data = $data->data[0];
                    return $this->getResponse([
                        self::PATRON_ID => $user_data->patron_id ?? "",
                        "email_subscribed_flag" => $user_data->email_subscribed_flag ?? "",
                        "mail_subscribed_flag" => $user_data->mail_subscribed_flag ?? "",
                        "sms_subscribed_flag" => $user_data->sms_subscribed_flag ?? "",
                        "push_subscribed_flag" => $user_data->push_subscribed_flag ?? ""
                    ], $data->message, true);
                } else {
                    return $this->getResponse([], 'Patron search data not found.', false);
                }//..... end of inner-if-else .....//
            } else {
                return $this->getResponse([], 'Data not returned from amplify.', false);
            }//.... end if-else() .....//
        } else {
            return $this->getResponse([], self::PARAMS_MISSING, false);
        }//..... end if-else() .....//
    }//..... end of getSubscribedDetails() .....//

    /**
     * Get a member Voucher from Swift POS.
     * @param Request $request
     * @return bool|\Illuminate\Http\JsonResponse|mixed|\Psr\Http\Message\ResponseInterface|string
     */
    public function getSwiftPOSVoucher(Request $request)
    {
        $validator = Validator::make($request->all(), ['business_id' => 'required', 'customer_id' => 'required']);
        if ($validator->fails()) {
            return $this->getResponse($this->getValidationErrors($validator), self::PARAMS_MISSING, false);
        }

        return $this->swiftPosUnifiedSchemeCallHandler->getVoucher($request);
    }//..... end of getSwiftPOSVoucher() .....//

    /**
     * @param Request $request
     * @return mixed
     * Issue a Voucher to a Swift Member.
     */
    public function issueSwiftVoucherToMember(Request $request)
    {
        $validator = Validator::make($request->all(), ['business_id' => 'required', 'customer_id' => 'required', "voucher_id" => "required", "barcode" => 'required', "member_type" => 'required']);
        if ($validator->fails()) {
            return $this->getResponse($this->getValidationErrors($validator), self::PARAMS_MISSING, false);
        }

        return $this->swiftPosUnifiedSchemeCallHandler->issueMemberVoucher($request);
    }//..... end of issueSwiftVoucherToMember() ......//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse Get List of notifications from amplify and forward to mobile app.
     * Get List of notifications from amplify and forward to mobile app.
     */
    public function getNotificationsList(Request $request)
    {
        if ($request->has(self::VENUE_ID) && $request->has('email') && $request->has(self::PATRON_ID)) {
            $header = ['X-API-KEY' => config("constant.AMPLIFY_KEY")];
            $url = config('constant.AMPLIFY_URL') . "/notification/listing";
            $data = $this->apiCall->postJsonThroughGuzzle($url, $header, [self::VENUE_ID => $request->venue_id, 'email' => $request->email, self::PATRON_ID => $request->patron_id]);

            if ($data) {
                return $data;
            } else {
                return $this->getResponse([], 'Data not returned from amplify.', false);
            }//.... end if-else() .....//
        } else {
            return $this->getResponse([], 'venue_id, patron_id or email is missing.', false);
        }//..... end if-else() .....//
    }//..... end of getNotificationsList() .....//

    public function getCategoryVenues(Request $request)
    {
        $shopCategory = ShopCategory::where(self::COMPANY_ID, $request->company_id)->get();
        foreach ($shopCategory as $value) {
            $value->venues = $this->getVenuesData($value->id, $request->company_id);
            $value->image = url(self::VENUE_CAT_URL . $value->image);
        }


        if (!$shopCategory->isEmpty()) {
            return $this->getResponse($shopCategory, self::DATA_FOUND, true);
        } else {
            return $this->getResponse([], self::DATA_NOT_FOUND, false);
        }

    }


    public function getCategoryVenues2(Request $request)
    {
        try {
            $venues = $this->getVenuesData2($request->company_id, $request->zone);

            if (!$venues->isEmpty()) {
                return $this->getResponse($venues, self::DATA_FOUND, true);
            } else {
                return $this->getResponse([], self::DATA_NOT_FOUND, false);
            }
        } catch (\Exception $e) {
            Log::channel('user')->error('Error Occured in', ['ErrorMessage' => $e->getMessage()]);
        }
    }


    public function getSoldiBussiness()
    {
        $key = "soldi_data_" . date('Y-m-d');

        //...... stop multiple requests  .....//
        $key_exists = Redis::get($key);
        if ($key_exists) {
            $key_exists = json_decode($key_exists, true);
            return $key_exists['data'];
        }

        $SOLDI_API_KEY = config('constant.SOLDI_API_KEY');
        $SOLDI_SECRET = config('constant.SOLDI_SECRET');
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);

        try {


            $response = $client1->get($SOLDI_DEFAULT_PATH . '/venue?s=swimart');

            $result = $response->getBody();
            $store_array = json_decode($result, true);
            Redis::set($key, $result, 'EX', 3600);
            return $store_array['data'];
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'invalid Api key and secret.';

            return $arr;

        }
    }


    public function getVenueCategory($venue_id, $soldi_bussiness)
    {
        $res = DB::table("venue_category")
            ->where("venue_category.venue_id", "=", $venue_id)
            ->join("venue_categories", "venue_categories.id", "=", "venue_category.category_id")
            ->get([
                "venue_category.category_id",
                "venue_categories.name",
                "venue_categories.description",
                "venue_categories.image",
            ]);
        foreach ($res as $value) {
            $value->image = url(self::VENUE_CAT_URL . $value->image);
            $value->store = [];
            $assignBussiness = DB::table("venue_category_shops")->select("shop_id")
                ->where("category_id", "=", $value->category_id)
                ->where(["venue_category_shops.status" => 1])
                ->get();


            if ($assignBussiness) {
                $stores = [];
                foreach ($assignBussiness as $value2) {
                    $d = $soldi_bussiness[$value2->shop_id];
                    array_push($stores, $d);
                }
                $value->store = $stores;

            }
        }

        return $res;
    }

    public function getVenueShops($venueID, $soldi_bussiness)
    {
        $res = DB::table("venue_shops")
            ->where("venue_shops.venue_id", "=", $venueID)
            ->where("venue_shops.status", "=", 1)
            ->get();
        $stores = [];
        if ($res) {
            foreach ($res as $value) {
                $d = $soldi_bussiness[$value->shop_id];
                array_push($stores, $d);
            }
        }
        return $stores;

    }


    public function getVenuesData2($company_id)
    {
        $is_merchant = request()->user()->is_merchant ?? 0;
        $soldi_bussiness = $this->getSoldiBussiness();
        $this->deActivateBusiness($soldi_bussiness);

        $dataVenue = DB::table("venues")
            ->where([
            ])
            ->get([
                "venues.*",
            ]);
        $global_sliders = DB::table("recipe_offers")->where(["type" => self::GLOBAL, "display_type" => self::GLOBAL])->get();
        foreach ($dataVenue as $key => $venue) {
            $sub = VenueSubscription::where(["user_id" => 0, self::VENUE_ID => $venue->venue_id, self::COMPANY_ID => $company_id])->first();
            $venue->settings = json_decode($venue->settings) ?? [];
            foreach ($venue->settings->modules as $setting) {
                if ($setting->type == "LOYALTY" && $is_merchant == 1) {
                    $setting->enable = true;
                }
            }
            $venue->sliders = $this->getSliders($venue->venue_id, $global_sliders);
            $vi = VenueImage::select([self::IMAGE, self::PAY_WITH_POINTS])->where([self::VENUE_ID => $venue->venue_id, self::COMPANY_ID => $company_id])->first();
            $data[self::VENUE_ID] = $venue->venue_id;
            $data['venue_category'] = $this->getVenueCategory($venue->venue_id, $soldi_bussiness);
            $data['venue_name'] = $venue->venue_name;
            $data['venue_description'] = ($venue->venue_description) ? $venue->venue_description : "";
            $data['venue_location'] = $venue->venue_location ?? "";
            $data['venue_latitude'] = ($venue->venue_latitude) ? $venue->venue_latitude : "";
            $data['venue_longitude'] = ($venue->venue_longitude) ? $venue->venue_longitude : "";
            $data['venue_url'] = ($venue->venue_url) ? $venue->venue_url : "";
            $data['locality'] = ($venue->locality) ? $venue->locality : "";
            $data[self::COMPANY_ID] = $company_id;
            $data['created_at'] = $venue->created_at;

            $data['user_id'] = '';

            $data[self::IMAGE] = ($vi) ? url('/') . $vi->image : "";
            $data[self::PAY_WITH_POINTS] = ($vi) ? $vi->pay_with_points : 0;
            $data['subscrition'] = ($sub) ? 1 : 0;

            $data['venue_image'] = url('/') . self::VENUE_CAT_URL . $venue->image;
            // operating hours
            $operating_hours = DB::table('venue_operating_hours')->where(self::VENUE_ID, $venue->venue_id)->get();
            $final_array = array();
            if ($operating_hours) {
                $hours = array();
                foreach ($operating_hours as $ope_hours) {
                    $hours['day'] = $ope_hours->days;
                    $hours['is_open'] = $ope_hours->is_open;
                    $hours['start_hours'] = date(self::DATE_FORMAT, strtotime($ope_hours->start_time));
                    $hours['end_hours'] = date(self::DATE_FORMAT, strtotime($ope_hours->end_time));
                    array_push($final_array, $hours);
                }
            }
            $data['operating_hours'] = $final_array;
            $venue_details_flag = DB::table('venue_details_flag')->where(self::VENUE_ID, $venue->venue_id)->get();
            $data['venue_details_flag'] = $venue_details_flag;


            $skin = (object)[];
            $skin->app_color = ($venue->app_color != '') ? $venue->app_color : 'fdc110';
            $skin->app_navigation_color = ($venue->app_color != '') ? $venue->app_color : '000000';
            $skin->app_navigation_tint_color = ($venue->app_color != '') ? $venue->app_color : 'FFFFFF';
            $skin->app_tint_on_app_color = ($venue->app_color != '') ? $venue->app_color : '000000';
            $skin->app_cart_color = ($venue->app_color != '') ? $venue->app_color : '44CAA1';
            $skin->app_color_rgb = ($venue->app_color != '') ? $this->hex2rgba($venue->app_color, $opacity = false) : $this->hex2rgba('#fdc110', $opacity = false);
            $skin->app_navigation_color_rgb = ($venue->app_color != '') ? $this->hex2rgba($venue->app_color, $opacity = false) : $this->hex2rgba('#000000', $opacity = false);

            $data['venue_skin'] = $skin;
            $data[self::AUTO_CHECKOUT] = (object)[self::AUTO_CHECKOUT => $venue->auto_checkout, 'beacon_proximity_logical_operator' => $venue->beacon_condition, 'beacon_scheduler_logical_operator' => $venue->minutes_condition, 'proximity' => $venue->beacon_area, 'is_beacon_listening' => $venue->beacon_listining, 'schedule_minutes' => $venue->beacon_minutes];
            $dataVenue[$key] = array_merge((array)$venue, $data);
        }
        return $dataVenue;
    }

    public function getVenuesData($id, $company_id)
    {
        $soldi_bussiness = $this->getSoldiBussiness();

        $this->deActivateBusiness($soldi_bussiness);
        $dataVenue = DB::table("venue_cat_details")
            ->where(["venue_cat_details.category_id" => $id, 'venue_shops.status' => 1])
            ->leftJoin("venues", "venues.venue_id", "=", "venue_cat_details.venue_id")
            ->leftJoin("venue_shops", "venue_shops.venue_id", "=", "venues.venue_id")
            ->get([
                "venue_cat_details.*",
                "venues.*",
                "venue_shops.shop_id",
            ]);

        foreach ($dataVenue as $key => $venue) {
            $sub = VenueSubscription::where(["user_id" => 0, self::VENUE_ID => $venue->venue_id, self::COMPANY_ID => $company_id])->first();

            $vi = VenueImage::select([self::IMAGE, self::PAY_WITH_POINTS])->where([self::VENUE_ID => $venue->venue_id, self::COMPANY_ID => $company_id])->first();
            $data[self::VENUE_ID] = $venue->venue_id;
            $data['venue_name'] = $venue->venue_name;
            $data['venue_description'] = ($venue->venue_description) ? $venue->venue_description : "";
            $data['venue_location'] = $venue->venue_location ?? "";
            $data['venue_latitude'] = ($venue->venue_latitude) ? $venue->venue_latitude : "";
            $data['venue_longitude'] = ($venue->venue_longitude) ? $venue->venue_longitude : "";
            $data['venue_url'] = ($venue->venue_url) ? $venue->venue_url : "";
            $data['locality'] = ($venue->locality) ? $venue->locality : "";
            $data[self::COMPANY_ID] = $company_id;
            $data['created_at'] = $venue->created_at;
            $data['user_id'] = '';
            $data[self::IMAGE] = ($vi) ? url('/') . $vi->image : "";
            $data[self::PAY_WITH_POINTS] = ($vi) ? $vi->pay_with_points : 0;
            $data['subscrition'] = ($sub) ? 1 : 0;

            $data['venue_image'] = url('/') . self::VENUE_CAT_URL . $venue->image;
            $data['store'][] = $soldi_bussiness[$venue->shop_id];

            // operating hours
            $operating_hours = DB::table('venue_operating_hours')->where(self::VENUE_ID, $venue->venue_id)->get();
            $final_array = array();
            if ($operating_hours) {
                $hours = array();
                foreach ($operating_hours as $ope_hours) {
                    $hours['day'] = $ope_hours->days;
                    $hours['is_open'] = $ope_hours->is_open;
                    $hours['start_hours'] = date(self::DATE_FORMAT, strtotime($ope_hours->start_time));
                    $hours['end_hours'] = date(self::DATE_FORMAT, strtotime($ope_hours->end_time));
                    array_push($final_array, $hours);
                }
            }
            $data['operating_hours'] = $final_array;
            $venue_details_flag = DB::table('venue_details_flag')->where(self::VENUE_ID, $venue->venue_id)->get();
            $data['venue_details_flag'] = $venue_details_flag;


            $skin = (object)[];
            $skin->app_color = ($venue->app_color != '') ? $venue->app_color : 'fdc110';
            $skin->app_navigation_color = ($venue->app_color != '') ? $venue->app_color : '000000';
            $skin->app_navigation_tint_color = ($venue->app_color != '') ? $venue->app_color : 'FFFFFF';
            $skin->app_tint_on_app_color = ($venue->app_color != '') ? $venue->app_color : '000000';
            $skin->app_cart_color = ($venue->app_color != '') ? $venue->app_color : '44CAA1';
            $skin->app_color_rgb = ($venue->app_color != '') ? $this->hex2rgba($venue->app_color, $opacity = false) : $this->hex2rgba('#fdc110', $opacity = false);
            $skin->app_navigation_color_rgb = ($venue->app_color != '') ? $this->hex2rgba($venue->app_color, $opacity = false) : $this->hex2rgba('#000000', $opacity = false);

            $data['venue_skin'] = $skin;
            $data[self::AUTO_CHECKOUT] = (object)[self::AUTO_CHECKOUT => $venue->auto_checkout, 'beacon_proximity_logical_operator' => $venue->beacon_condition, 'beacon_scheduler_logical_operator' => $venue->minutes_condition, 'proximity' => $venue->beacon_area, 'is_beacon_listening' => $venue->beacon_listining, 'schedule_minutes' => $venue->beacon_minutes];
            $dataVenue[$key] = array_merge((array)$venue, $data);
        }
        return $dataVenue;
    }


    public function getVenuesStores(Request $request)
    {
        $venue['store'] = $this->getVenueAllStores($request->venue_id, $request->company_id);
        if (!empty($venues)) {
            return $this->getResponse($venues, self::DATA_FOUND, true);
        } else {
            return $this->getResponse([], self::DATA_NOT_FOUND, false);
        }

    }

    function hex2rgba($color, $opacity = false)
    {


        $default = 'rgb(0,0,0)';

        //Return default if no color provided
        if (empty($color)) {
            return $default;
        }

        //Sanitize $color if "#" is provided
        if ($color[0] == '#') {
            $color = substr($color, 1);
        }

        //Check if color has 6 or 3 characters and get values
        if (strlen($color) == 6) {
            $hex = array($color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5]);
        } elseif (strlen($color) == 3) {
            $hex = array($color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2]);
        } else {
            return $default;
        }

        //Convert hexadec to rgb
        $rgb = array_map('hexdec', $hex);

        //Check if opacity is set(rgba or rgb)
        if ($opacity) {
            if (abs($opacity)) {
                $opacity = 1.0;
            }
            $output = 'rgba(' . implode(",", $rgb) . ',' . $opacity . ')';
        } else {
            $output = 'rgb(' . implode(",", $rgb) . ')';
        }

        //Return rgb(a) color string
        return $output;
    }


    public function getVenueBeaconsData($id = '')
    {
        try {
            $beacons = [];
            Beacon::where([self::VENUE_ID => $id])->each(function ($beacon) use (&$beacons) {
                $floor = LevelConfiguration::where([self::VENUE_ID => $beacon->venue_id])->first();
                $beacons[] = [
                    'id' => $beacon->id,
                    'name' => $beacon->beacon_name,
                    'uuid' => $beacon->uuid,
                    'major' => $beacon->major,
                    'minor' => $beacon->minor,
                    'brand_name' => "",
                    'added_by' => "",
                    'number' => "",
                    self::VENUE_ID => $beacon->venue_id,
                    self::COMPANY_ID => Venue::where(self::VENUE_ID, $beacon->venue_id)->value(self::COMPANY_ID),
                    'floor_id' => $floor->id ?? "",
                    'floor_number' => $floor->floor_number ?? "",
                    'floor_name' => $floor->floor_name ?? ""
                ];
            });
            if (empty($beacons)) {
                return $this->getResponse([], 'No Beacon Found.', FALSE);
            } else {
                return response()->json([
                    self::STATUS => true,
                    self::MESSAGE => count($beacons) . " Beacons Found.",
                    "data" => $beacons,
                    'time_interval' => 60000
                ]);
            }
        } catch (Exception $e) {
            return $this->getResponse([], "Error " . $e->getMessage(), FALSE);
        }
    }

    private function deActivateBusiness($businesses = [])
    {
        DB::table("venue_category_shops")->whereStatus(1)->update([self::STATUS => 0]);
        DB::table("venue_category_shops")->whereIn('shop_id', array_keys($businesses ?? []))->update([self::STATUS => 1]);
        return true;
    }

    private function getSliders($venue_id, $global_sliders)
    {
        $venue_sliders = DB::table("venue_resources")->leftJoin("recipe_offers", "venue_resources.resource_id", "=", "recipe_offers.id")
            ->where(["venue_resources.venue_id" => $venue_id, "recipe_offers.type" => self::GLOBAL])
            ->whereNull('deleted_at')
            ->where("recipe_offers.display_type", "!=", self::GLOBAL)
            ->get(["recipe_offers.*"]);

        $merged = $venue_sliders->merge($global_sliders);

        foreach ($merged as $value) {
            $value->image_path = $value->image ? url("/") . "/" . $value->image : "";
            $value->video_path = $value->video_link ? url("/") . "/" . $value->video_link : "";
        }
        return $merged ?? [];
    }
}//..... end of __construct().....//w