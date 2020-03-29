<?php /** @noinspection PhpLanguageLevelInspection */

namespace App\Http\Controllers\Api;

use App\ApiCalls\BasePosApiCall;
use App\Http\Controllers\API\ElasticSearchController;

use App\Models\Gym;
use App\Models\GymExcludedBusiness;
use App\Models\MemberTransaction;
use App\Models\UserLoyaltyPoints;
use App\Models\Venue;
use App\UnifiedDbModels\Store;
use App\User;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use App\ApiCalls\SoldiPosApiCall;
use App\UnifiedSchemaCall\SoldiPosUnifiedSchema;
use Illuminate\Http\Request;
use App\Models\User_Card;
use DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Image;
use App\classes\CommonLibrary;
use App\Models\FavoriteProduct;
use App\Models\Setting;
use Illuminate\Support\Facades\URL;
use App\Models\StoreInformation;
use App\Models\Rating;
use App\Models\VenueSubscription;
use Illuminate\Support\Facades\Config;
use App\ApiCalls;
use App\Http\Controllers\Api\UserApiController;

class StoresApiController extends BaseRestController
{
    protected $maxAttempts = 1000; // Default is 5
    const eway_apiencrypt = "epk-2CB0DB1E-6375-4059-9C21-21BEAC99FD1D";
    const eway_encrypt_url = 'https://api.sandbox.ewaypayments.com/encrypt';
    public $_common_library;
    private $soldiUnifiedPosHandler;
    private $apiCall;

    public $killbill_headers = [
        "authorization: Basic Z2JrZGV2QHBsdXR1c2NvbW1lcmNlLm5ldDoxMjM0NTY3OA==",
        "cache-control: no-cache",
        "content-type: application/json",
        "x-killbill-apikey: gbkdev@plutuscommerce.net",
        "x-killbill-apisecret: gbkdev@plutuscommerce.net",
        "x-killbill-createdby: killbill"
    ];

    public $current_user = 'mobile';

    /**
     * StoresApiController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->common_library = new CommonLibrary();
        $this->apiCall = new SoldiPosApiCall();
        $this->soldiUnifiedPosHandler = new SoldiPosUnifiedSchema();


    }//..... end of __constructor() .......//

    /**
     * @param Request $request
     * @return array
     * return User's Cards list.
     */
    public function cardList(Request $request)
    {
        return ['status' => true, 'message' => 'data found.', 'data' => User_Card::where('user_id', '=', $request->user_id)->orderBy('card_id', 'desc')->get()];
    }//..... end of cardList() .....//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function addCard(Request $request)
    {
        $is_default = $request->has('is_default') ? $request->is_default : 0;
        $userCards = DB::table('user_cards')->select(DB::raw('SUBSTRING(card_no, -4, 4) AS cardno, cvv'))->where('user_id', '=', $request->user_id)->get();
        if ($userCards->contains('cvv', $request->cvv) && $userCards->contains('cardno', substr($request->card_no, -4))) {
            return ['status' => false, 'message' => 'Card with same number and cvv is already been added'];
        }
        if (!$this->check_cc($request->card_no, false)) {
            return ['status' => false, 'message' => 'Please enter a valid card'];
        }

        if ($request->user_id != '' && $request->card_no != '' && $request->card_name != '' && $request->expiry && $request->cvv != '') {
            $encryptedCard = $this->getCardPanTokensSoldi($request->expiry, $request->card_no);

            if (!$encryptedCard['status'])
                return ['status' => false, 'message' => $encryptedCard['message'] ?? 'Error Occured', 'user_cards' => []];


            if ($is_default == 1) {
                $user_cards = User_Card::where('user_id', '=', $request->user_id)->where('is_default', '=', $is_default)->get()->toArray();

                if (!empty($user_cards))
                    User_Card::where('card_id', $user_cards[0]['card_id'])->update(['is_default' => 0]);
            }//..... end if() .....//

            User_Card::create([
                'user_id' => $request->user_id, 'card_no' => $encryptedCard['data']->Enquiry->PAN,
                'card_name' => $request->card_name, 'expiry' => $request->expiry,
                'cvv' => $request->cvv, 'expiry_year' => $request->expiry_year, 'expiry_month' => $request->expiry_month,
                'card_type' => 'Master', 'last_digit' => '123',
                'is_default' => $is_default, 'is_test_card' => 0, 'transactionid' => $encryptedCard['data']->Enquiry->TransactionIndex

            ]);
            return ['user_cards' => User_Card::whereUserId($request->user_id)->orderBy('card_id', 'desc')->get(), 'status' => true, 'message' => 'Card added successfully.'];
        } else {
            return ['status' => false, 'message' => 'Parameters are missing.', 'user_cards' => []];
        }//..... end if-else() .....//
    }//..... end of addCard() .....//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function updateCard(Request $request)
    {
        $is_default = $request->has('is_default') ? $request->is_default : 0;
        $expiry_month = str_pad($request->expiry_month, 2, 0, STR_PAD_LEFT);

        if ($request->card_id != '' && $request->user_id != '' && $request->card_no != '' && $request->card_name != '' && $expiry_month != '' && $request->expiry_year != '' && $request->cvv != '') {
            $encryptedCard = $this->getCardPanTokensSoldi($request->expiry, $request->card_no);

            if (!$encryptedCard['status'])
                return ['status' => false, 'message' => $encryptedCard['message'] ?? 'Error Occured', 'user_cards' => []];

            if ($is_default == 1) {
                $user_cards = User_Card::whereUserId($request->user_id)->where('is_default', '=', $is_default)->get()->toArray();

                if ($user_cards)
                    User_Card::whereCardId($user_cards[0]['card_id'])->update(['is_default' => 0]);
            }//..... end if() .....//

            User_Card::whereCardId($request->card_id)->update([
                'user_id' => $request->user_id, 'card_no' => $encryptedCard['data']->Enquiry->PAN,
                'card_name' => $request->card_name, 'expiry' => $request->expiry,
                'cvv' => $request->cvv, 'expiry_year' => $request->expiry_year, 'expiry_month' => $request->expiry_month,
                'card_type' => 'Master', 'last_digit' => '123',
                'is_default' => $is_default, 'is_test_card' => 0, 'transactionid' => $encryptedCard['data']->Enquiry->TransactionIndex
            ]);

            return ['status' => true, 'message' => 'Card updated successfully.', 'user_cards' => User_Card::whereUserId($request->user_id)->orderBy('card_id', 'desc')->get()];
        } else {
            return ['status' => false, 'message' => 'Parameters are missing.'];
        }//..... end if-else() .....//
    }//..... updateCard() .....//

    /**
     * @param Request $request
     * @return array
     * Delete User's Card.
     */
    /*public function deleteCard(Request $request)
    {
        if ($request->has('card_id') and $request->card_id) {

            User_Card::whereCardId($request->card_id)->whereUserId($request->user_id)->delete();
            return ['status' => true, 'message' => 'Card deleted successfully.'];
        } else
            return ['status' => false, 'message' => 'Parameters are missing.'];
    }*/ //..... end of deleteCard() .....//


    function creditCardType($ccnum)
    {
        if (preg_match("/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/", $ccnum)) {
            // Visa: length 16, prefix 4, dashes optional.
            return "VISA";
        } else if (preg_match("/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/", $ccnum)) {
            // Mastercard: length 16, prefix 51-55, dashes optional.
            return "MASTERCARD";
        } else if (preg_match("/^6011-?\d{4}-?\d{4}-?\d{4}$/", $ccnum)) {
            // Discover: length 16, prefix 6011, dashes optional.
            return "DISCOVER";
        } else if (preg_match("/^3[4,7]\d{13}$/", $ccnum)) {
            // American Express: length 15, prefix 34 or 37.
            return "American-Express";
        } else if (preg_match("/^3[0,6,8]\d{12}$/", $ccnum)) {
            // Diners: length 14, prefix 30, 36, or 38.
            return "Diners";
        } else {
            return "Other-Card";
        }
    }

    public function payment_process(Request $request)
    {
        $company_id = $request->company_id;
        $amplify_id = $request->amplify_id;
        $is_redeem = $request->is_redeem;
        $redeem_points = $request->redeem_points;
        $business_id = $request->business_id;
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $user_id = $responce_set->customar_id;
        $SOLDI_API_KEY = $responce_set->soldi_api_key;
        $SOLDI_SECRET = $responce_set->soldi_api_secret;
        $app_name = $responce_set->app_name;

        $this->apiCall->payment_processSoldi(array('company_id' => $company_id, 'SOLDI_API_KEY' => $SOLDI_API_KEY, 'SOLDI_SECRET' => $SOLDI_SECRET, 'SOLDI_DEFAULT_PATH' => $SOLDI_DEFAULT_PATH, 'app_name' => $app_name, 'amplify_id' => $amplify_id, 'is_redeem' => $is_redeem, 'redeem_points' => $redeem_points, 'user_id' => $user_id, 'business_id' => $business_id, 'request' => $request->all()));
    }

    /**
     * @param Request $request
     * @return array|\Psr\Http\Message\StreamInterface
     * Get User points from Loyalty.
     */
    public function getUserPoints(Request $request)
    {
        try {
            $res = (new Client())->request('POST', config('constant.LOYALTY_DEFAULT_PATH') . 'venue_points', [
                'form_params' => [
                    'user_id' => $request->user_id,
                    'company_id' => $request->company_id,
                    'venue_id' => $request->venue_id
                ]
            ]);
            return $res->getBody();
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => 'Server error'];
        }//..... end of try-catch( )......//
    }//..... end of getUserPoints() .....//

    public function getAllUserPoints(Request $request)
    {
        try {
            $dataReturn = ['point_balance' => 0, 'redeemed_points' => ['redeem_price_value' => 0, 'redeem_point_value' => 0]];
            $allPoints = DB::table('lt_transations')->selectRaw('sum(lt_transations.value_points) as points_total,type')
                ->where('soldi_id', $request->soldi_id)
                ->groupBy('lt_transations.type')
                ->get();
            $point_type_qry = DB::table('lt_points')->where("venue_id", $request->default_venue)->where("lt_point_type", "value")->first();
            if ($point_type_qry) {
                $redeem_points_qry = DB::table('lt_redeem_values')->where("lt_point_id", $point_type_qry->lt_point_id)->first();
                if ($redeem_points_qry) {
                    $dataReturn['redeemed_points']['redeem_price_value'] = $redeem_points_qry->red_price_velue;
                    $dataReturn['redeemed_points']['redeem_point_value'] = $redeem_points_qry->red_point_velue;
                }
            }
            if ($allPoints) {
                $creditAmount = $allPoints[0]->points_total ?? 0;
                $debitAmount = $allPoints[1]->points_total ?? 0;
                $totalPoints = $creditAmount - $debitAmount;

                $userPointLocked = UserLoyaltyPoints::where('user_id', $request->user_id)->get()->sum('point_amount');
                $totalPoints = $totalPoints - $userPointLocked;
                $dataReturn['point_balance'] = ($totalPoints > 0) ? $totalPoints : 0;
                return ['status' => true, 'data' => $dataReturn];
            }
            return ['status' => true, 'data' => $dataReturn];

        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = 'Server error';
            return json_encode($arr);

        }

    }

    public function favorite_product(Request $request)
    {
        $product_id = $request->product_id;
        $user_id = $request->user_id;
        if ($request->has('product_id') && $product_id != '' && $request->has('user_id') && $user_id != '') {
            $favoriteProduct = FavoriteProduct::where('product_id', $product_id)->where('user_id', $user_id)->first();
            if ($favoriteProduct) {
                FavoriteProduct::where('product_id', $product_id)->where('user_id', $user_id)->delete();
                $arr['status'] = true;
                $arr['message'] = 'you successfully unfavourite this product';
                return json_encode($arr);
            } else {
                $favourite = new  FavoriteProduct();
                $favourite->product_id = $product_id;
                $favourite->user_id = $user_id;
                $favourite->created_at = time();
                $favourite->save();
                $arr['status'] = true;
                $arr['message'] = 'your product has been favourite successfully';
                return json_encode($arr);
            }
        } else {
            $arr['status'] = false;
            $arr['message'] = 'Requested parameaters are missing.';
            return json_encode($arr);
        }
    }

    public function user_badges(Request $request)
    {
        $user_id = $request->user_id;
        $company_id = $request->company_id;
        if ($request->has('user_id') && $user_id != '' && $request->has('user_id') && $company_id != '') {
            $client = new Client();
            $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
            try {
                $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'user/badges', [

                    'form_params' => [
                        'user_id' => $user_id,
                        'company_id' => $company_id
                    ]
                ]);
                return $result = $res->getBody();
            } catch (RequestException $e) {
                $arr['status'] = false;
                $arr['message'] = 'Server error';
                return json_encode($arr);
            }
        } else {
            $arr['status'] = false;
            $arr['message'] = 'Requested Parameaters are missing.';
            return json_encode($arr);
        }


    }

    /**
     * @param Request $request
     * @return array|\Psr\Http\Message\StreamInterface
     * Get User Tier.
     */
    public function userTier(Request $request)
    {
        if ($request->has('user_id') && $request->user_id != '' && $request->has('user_id') && $request->company_id != '') {
            try {
                $res = (new Client())->request('POST', config('constant.LOYALTY_DEFAULT_PATH') . 'user/tier', [
                    'form_params' => [
                        'user_id' => $request->user_id,
                        'company_id' => $request->company_id,
                        'venue_id' => $request->venue_id
                    ]
                ]);
                return $result = $res->getBody();
            } catch (GuzzleException $e) {
                return ['status' => false, 'message' => 'Server error'];
            }//..... end of try-catch() .....//
        } else
            return ['status' => false, 'message' => 'Requested Parameters are missing.'];
    }//..... end of userTier() .....//

    public function getTraders(Request $request)
    {
        $company_id = $request->company_id;
        $venue_id = $request->venue_id;
        $client = new Client();
        // Beacon Api and Url
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $beacon_Api_key = $responce_set->beacons_api_key;
        try {
            $res = $client->request('GET', $Beacons_AP1_URL . '/venues', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $beacon_Api_key,
                ]
            ]);
            $result = $res->getBody();
            $venue_arr = json_decode($result);

            $data_arr = $venue_arr->data;
            $venues_array = [];
            $base_path_img = config('constant.base_path_img') . '/public/venues/';
            $map_image = URL::to('/admin/store/app/' . $venue_id);
            $venues_name = DB::table('venues')->where('venue_id', '=', $venue_id)->where('company_id', '=', $company_id)->first();
            $defuly_venue_name = '';
            if ($venues_name) {
                $defuly_venue_name = $venues_name->venue_name;
            }

            foreach ($data_arr as $row_data) {
                $venue_id = $row_data->venue_id;
                $venues_img = DB::table('venue_image')->where('venue_id', '=', $venue_id)->where('company_id', '=', $company_id)->where('status', '=', 1)->first();
                if ($venues_img) {
                    $ven_img = $base_path_img . $venues_img->image;
                    $row_data->image = $ven_img;
                    $row_data->sp_url = URL::to('/admin/store/app/' . $venue_id);
                    $venues_array[] = $row_data;
                }
            }
            if (!empty($venues_array)) {
                $arr['status'] = true;
                $arr['message'] = 'Venues are found.';
                $arr['map_img_url'] = $map_image;
                $arr['venue_name'] = $defuly_venue_name;
                $arr['data'] = $venues_array;
                return json_encode($arr);
            } else {
                $arr['status'] = false;
                $arr['message'] = 'No data found.';
                return json_encode($arr);
            }
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = 'Server Error!';
            return json_encode($arr);
        }
    }

    /**
     * @param Request $request
     * @return array
     */
    public function orderReceipt(Request $request)
    {
        $setting = Setting::whereCompanyId($request->company_id)->first();

        try {
            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/orders/userreceipt', [
                'headers' => [
                    'X-API-KEY' => $setting->soldi_api_key ?? null,
                    'SECRET' => $setting->soldi_api_secret ?? null
                ],
                'form_params' => [
                    'order_id' => $request->order_id
                ]
            ]);

            $response = json_decode($res->getBody());
            return ($response->status == 200)
                ? ['status' => true, 'message' => 'Email sent successfully. Please check your email.', 'data' => $response->data]
                : ['status' => false, 'message' => 'An error found during sending email.'];
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => 'Server Error!'];
        }//..... end of try-catch() .....//
    }//..... end of orderReceipt() .....//

    public function ratings(Request $request)
    {
        $user_id = $request->user_id;
        $company_id = $request->company_id;
        $store_id = $request->store_id;
        $rate_value = $request->rate_value;
        $soldi_id = $request->soldi_id;
        $amplify_id = $request->amplify_id;


        if ($user_id != '' && $company_id != '' && $store_id != '' && $rate_value != '' && $soldi_id != '' && $amplify_id != '') {
            //$venue_data = DB::table('venues')->where('store_news_id', '=', $store_id)->first();
            $venue_data = DB::table('store')->where('pos_store_id', '=', $store_id)->first();
            $venue_id = '';
            if ($venue_data) {
                $venue_id = $venue_data->venue_id;
            }
            $rating = new  Rating();
            $rating->user_id = $user_id;
            $rating->company_id = $company_id;
            $rating->venue_id = $venue_id;
            $rating->store_id = $store_id;
            $rating->rate_value = $rate_value;
            $rating->save();
            $lastInsertedId = $rating->id;
            if ($lastInsertedId) {
                $apply_rating_rule = $this->applyRatingRule($company_id, $amplify_id, $soldi_id, $venue_id);
            }

            $arr['status'] = true;
            $arr['message'] = 'You have been rated successfully for this traders.';
            return json_encode($arr);
        } else {
            $arr['status'] = false;
            $arr['message'] = 'Requested parameaters are missing.';
            return json_encode($arr);
        }
    }

    public function applyRatingRule($company_id, $amplify_id, $soldi_id, $venue_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'assign_rating_points', [
                'form_params' => [
                    'company_id' => $company_id,
                    'amplify_id' => $amplify_id,
                    'soldi_id' => $soldi_id,
                    'venue_id' => $venue_id
                ]
            ]);
            return $result = $res->getBody();
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = 'Server Error!';
            return json_encode($arr);
        }
    }


    public function appay_rule($pointsArray)
    {

        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);
        try {
            $response = $client1->request('POST', config('constant.LOYALTY_DEFAULT_PATH'), [
                'json' => $pointsArray
            ]);
            $result = $response->getBody()->getContents();
            $aply_rule = json_decode($result);

            $status = $aply_rule->status;
            if ($status == true) {
                $arr['status'] = true;
                $arr['message'] = 'Apply rule successfully.';
            } else {
                $arr['status'] = false;
                $arr['message'] = 'No data found.';
            }
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = 'Server error';
        }
        return $arr;
    }

    /**
     * @return string
     */
    public function average_venues()
    {
        $average_sum_result = DB::table('venue_subscritions')
            ->select(DB::raw('count(*) as total_venue_count'))
            ->groupBy('user_id')
            ->get();

        if (count($average_sum_result) > 0) {
            $sum_records = 0;
            foreach ($average_sum_result as $data) {

                $sum_records += $data->total_venue_count;
            }

            $total_users = count($average_sum_result);

            $average_count = $sum_records / $total_users;

            $arr['data']['average_venues'] = round($average_count, 2);
            $arr['data']['status'] = true;
            $arr['data']['message'] = 'Data Found Successfully';
            return json_encode($arr);

        } else {

            $arr['status'] = false;
            $arr['message'] = 'No Data Found';
            return json_encode($arr);

        }

    }//---- End of average_venues() ---//

    /**
     * @param Request $request
     * @return string
     */
    public function help_pages(Request $request)
    {
        $data = $request->all();
        $type = $data['page_type'];
        $page_content = DB::table('pages')->select('description')->where('type', '=', $type)->first();
        if ($page_content) {
            $arr['data']['page_data'] = $page_content->description;
            $arr['status'] = true;
            $arr['message'] = 'Data Found';
        } else {
            $arr['status'] = false;
            $arr['message'] = 'Data Not Found';
        }

        return json_encode($arr);
    }//---- End of help_pages() ---//

    /**
     * @param Request $request
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    public function getSkuProduct(Request $request)
    {
        if ($request->has('barcode') && $request->has('business_id')) {
            $store = Store::where("pos_store_id", $request->business_id)->first();
            try {
                $response = (new Client([
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $store->soldi_api_key,
                        'SECRET' => $store->soldi_secret
                    ]
                ]))->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/sku/skuvalidate', [
                    'form_params' => [
                        'business_id' => $request->business_id,
                        'barcode' => $request->barcode
                    ]
                ]);

                return $response->getBody();
            } catch (RequestException $e) {
                return ['status' => false, 'message' => $e->getMessage(), 'data' => []];
            }//..... end of try-catch() .....//
        } else
            return ['status' => false, 'message' => 'Business ID and product SKU is required!', 'data' => []];
    }//--- End of getSkuProduct() ---//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function customerOrders(Request $request)
    {

        $header = 'customer_id=' . $request->customer_id . '&page=' . $request->page . '&start_date=' . $request->start_date . '&end_date=' . $request->end_date . '&business_id=' . $request->business_id;

        if ($request->has('transaction_id') && $request->transaction_id)
            $header .= '&ord_id=' . $request->transaction_id;

        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                'SECRET' => config('constant.SOLDI_SECRET')
            ]
        ]);
        try {
            $response = $client1->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/orders/customer_orders?' . $header);
            $order_res = $response->getBody();
            $order_arr = json_decode($order_res);
            $order_message = $order_arr->message;
            $order_data = $order_arr->data;
            if ($order_data) {
                $order_array = [];
                foreach ($order_data as $ord_row) {
                    $ord_id = $ord_row->ord_id;
                    $business_id = $ord_row->business_id;
                    $store_info = StoreInformation::where('store_id', $business_id)->first();
                    $store_map = '';
                    if ($store_info) {
                        $store_map = config('constant.base_path_img') . '/public/maps/' . $store_info->store_map;
                    }
                    $ord_row->store_map = $store_map;
                    $order_array[] = $ord_row;
                }
                $arr['status'] = true;
                $arr['message'] = $order_message;
                $arr['data'] = $order_array;
                return $arr;

            } else {
                $arr['status'] = false;
                $arr['message'] = 'No transactions found.';
                return $arr;

            }
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = $e->getMessage();
            return json_encode($arr);
        }
    }//--- End of  customerOrders() ---//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     * Redeem User Voucher.
     */
    public function redeemVoucher(Request $request)
    {
        /*if(!$request->company_id || !$request->business_id || !$request->order_price || !$request->voucher_code || !$request->voucher_id)
            return ['status' => false, 'message' => 'Please send all required parameters!', 'data' => []];*/

        try {
            $response = (new Client(['headers' => []]))->request('POST', config('contant.JAVA_URL') . '/redeemVoucher', [
                'json' => $request->all()
            ]);

            return ['status' => (json_decode($response->getBody()))->status, 'message' => (json_decode($response->getBody()))->message, 'data' => (json_decode($response->getBody()))->body];
        } catch (RequestException $e) {
            return ['status' => false, 'message' => $e->getMessage(), 'data' => []];
        }//..... end of try-catch() .....//
    }//..... end of redeemVoucher() .....//

    /**
     * @param Request $request
     * @return string
     * @throws GuzzleException
     */
    public function customer_transactions(Request $request)
    {
        $customer_id = $request->customer_id;
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                'SECRET' => config('constant.SOLDI_SECRET')
            ]
        ]);
        try {
            $response = $client1->request('GET', $SOLDI_DEFAULT_PATH . '/transaction/usertranx?customer_id=' . $customer_id);
            $order_res = $response->getBody();
            $order_arr = json_decode($order_res);
            return json_encode($order_arr);

        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = $e->getMessage();
            return json_encode($arr);
        }

    }//--- End of customer_transactions() ---//

    private function encryptCard($card_no, $cvv)
    {
        $data = '{
                "Method": "eCrypt",
                "Items": [
                    {
                        "Name": "card",
                        "Value": "' . $card_no . '"
                    },
                    {
                        "Name": "CVN",
                        "Value": "' . $cvv . '"
                    }
                ]
            }';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_USERPWD, self::eway_apiencrypt);

        curl_setopt($ch, CURLOPT_URL, self::eway_encrypt_url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        $response = curl_exec($ch);

        curl_close($ch);
        return $response;
    }//..... end of encryptCard() .....//

    /**
     * @param Request $request
     */
    public function testPOS(Request $request)
    {
        $body = ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, 'sale_amount' => $request->sale_amount, 'datetime' => date('Y-m-d h:i:s')];
        $http = new \GuzzleHttp\Client();
        $response = $http->post(config('constant.amplify_URL') . 'add-pos-data', [
            'headers' => array('X-API-Key' => config('constant.amplify_AP1_key')),
            'json' => $body,
        ]);

        $dd = json_decode($response->getBody());
    }

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function searchProduct(Request $request)
    {
        try {
            $store = Store::where("pos_store_id", $request->business_id)->first();
            $response = (new Client([
                'headers' => [
                    'X-API-KEY' => $store->soldi_api_key,
                    'SECRET' => $store->soldi_secret
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/inventory/search?store_id=' . $request->business_id . '&searchkey=' . $request->search_product);

            $order_arr = json_decode($response->getBody());
            return $order_arr->status
                ? ['status' => true, 'data' => $order_arr->data, 'message' => $order_arr->message]
                : ['status' => false, 'data' => [], 'message' => $order_arr->message];

        } catch (RequestException $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }//..... end of try-catch() .....//
    }//--- End of searchProduct() ---//

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|string
     * @throws GuzzleException
     */
    public function customer_orders(Request $request)
    {

        $client1 = new Client(['headers' => [
            'X-API-KEY' => (request()->header('Country') == 'uk') ? Config::get('constant.SOLDI_API_KEY') : Config::get('constant.SOLDI_IRE_APIKEY'),
            'SECRET' => (request()->header('Country') == 'uk') ? Config::get('constant.SOLDI_SECRET') : Config::get('constant.SOLDI_IRE_SECRET')
        ]
        ]);

        try {
            $response = $client1->request('GET', Config::get('constant.SOLDI_DEFAULT_PATH') . '/orders/customer_orders?customer_id=' . $request->customer_id . '&page=' . $request->page . '&start_date=' . $request->start_date . '&end_date=' . $request->end_date . '&business_id=' . $request->business_id);
            $order_arr = json_decode($response->getBody());


            if ($order_arr->data) {
                $order_array = [];
                foreach ($order_arr->data as $ord_row) {
                    $business_id = $ord_row->business_id;
                    $store_info = StoreInformation::where('store_id', $business_id)->first();
                    $store_map = '';
                    if ($store_info) {
                        $store_map = config('constant.base_path_img') . '/public/maps/' . $store_info->store_map;
                    }
                    $ord_row->store_map = $store_map;
                    $order_array[] = $ord_row;
                }
                return ["status" => true, "message" => $order_arr->message, "data" => $order_array];
            } else
                return ["status" => false, "message" => 'No transactions found.'];

        } catch (RequestException $e) {

            return ["status" => false, "message" => $e->getMessage()];
        }
    }//--- End of customer_orders() ---//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function getBusinessMultiby(Request $request)
    {
        try {
            $store = Store::where("pos_store_id", $request->business_id)->first();
            $response = (new Client([
                'headers' => [
                    'X-API-KEY' => $store->soldi_api_key,
                    'SECRET' => $store->soldi_secret
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/inventory/multibuys?business_id=' . $request->business_id);

            $order_arr = json_decode($response->getBody());
            return $order_arr->status
                ? ['status' => true, 'data' => $order_arr->data, 'message' => $order_arr->message]
                : ['status' => false, 'data' => [], 'message' => $order_arr->message];
        } catch (Exception $e) {
            $arr['status'] = false;
            $arr['message'] = $e->getMessage();
            return $arr;
        }
    }//--- End of getBusinessMultiby() ---//

    public function getSiteFiteredInventory(Request $request)
    {
        $company_id = $request->company_id;
        $excluded_bussiness = GymExcludedBusiness::pluck('business_id');
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'company_id' => $request->company_id,
        ]);
        $res = (new BaseRestController())->getAllVenuesStores($req);
        if ($excluded_bussiness->isEmpty()) {
            return $res;
        }//--------------- end of if part   ------//
        else {
            if ($res) {
                $excluded_bussiness = $excluded_bussiness->toArray();
                foreach ($res['data'] as $key => $value) {
                    foreach ($value['store'] as $key2 => $value2) {
                        if (isset($value2['business_id'])) {
                            if (in_array($value2['business_id'], $excluded_bussiness)) {
                                unset($res['data'][$key]['store'][$key2]);
                            }
                        }
                    }
                }
            }
            return $res;
        }//-------------- end of else part

    }

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function customerOrderDetails(Request $request)
    {
        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                'SECRET' => config('constant.SOLDI_SECRET')
            ]
        ]);
        try {
            $response = $client1->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/orders/ticket?order_id=' . $request->order_id);
            $order_res = $response->getBody();
            $order_arr = json_decode($order_res);
            if ($order_arr->success === "TRUE") {
                $arr['status'] = true;
                $arr['message'] = "Data found";
                $arr['data'] = $order_arr->data[0];
                return $arr;
            } else {
                $arr['status'] = true;
                $arr['message'] = 'Order Details not found.';
                $arr['data'] = [];
                return $arr;

            }
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = $e->getMessage();
            return json_encode($arr);
        }
    }//--- End of  customerOrderDetails() ---//

    public function getSoldiResturant(Request $request)
    {
        $header = '';
        if ($request->has('coordinates') and $request->coordinates)
            $header .= '&coordinates=' . $request->coordinates;

        if ($request->has('range') and $request->range)
            $header .= '&range=' . $request->range;

        if ($request->has('page') and $request->page || $request->page == 0)
            $header .= '&page=' . $request->page;

        if ($request->has('name') and $request->name)
            $header .= '&restaurant=' . $request->name;

        if ($request->has('filter') and $request->filter)
            $header .= '&menu_format=' . $request->filter;

        //  $header .= $this->getFiltersList($request->filter);

        Log::channel('custom')->info('request to sodldi header', ['Header' => $header]);

        try {
            $response = (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/venue/restaurants?type=GBK' . $header);


            $resturants = json_decode($response->getBody());

            if ($resturants->success == 'TRUE')
                $resturants->data->total_pages = $resturants->total_pages;


            return ['status' => true, 'data' => $resturants->data, 'message' => $resturants->message];

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }

    public function userLoyaltyReward($user, $venue_id)
    {
        $body = ['soldi_id' => $user->soldi_id ?? $user['soldi_id'], 'venue_id' => $venue_id, "company_id" => $user->company_id ?? $user['company_id'], 'user_id' => $user->soldi_id ?? $user['soldi_id']];
        Log::channel('custom')->info('User Loyalty coins: ', ['data' => $body]);
        $http = new \GuzzleHttp\Client();
        $response = $http->post(config('constant.LOYALTY_DEFAULT_PATH') . 'assign_manual_points', [
            'headers' => array(),
            'json' => $body,
        ]);

        /*$dd = json_decode($response->getBody());*/
        Log::channel('custom')->info('Assigned points: ', ['data' => json_decode($response->getBody())]);
        return;
    }

    /**
     * @param $filter
     * @return string
     */
    private function getFiltersList($filter)
    {

        if ($filter) {
            $querParam = '';
            $newArray = explode(',', $filter);

            foreach ($newArray as $value)
                $querParam .= '&' . $value . '=1';

            return $querParam;
        }

    }//---- End of getFiltersList() -----//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function getCategoryProducts(Request $request)
    {
        Log::channel('custom')->info('Post Data For Category Product', ['PostData' => $request->all()]);

        $header = '';
        $rewardsData = ($request->rewards === 'true') ? true : false;

        if ($request->has('page') && $request->page)
            $header .= '&page=' . $request->page;

        if ($request->has('cate_id') && $request->cate_id)
            $header .= '&cate_id=' . $request->cate_id;

        if ($request->has('filters') && $request->filters)
            $header .= $this->getFiltersForProducts($request->filters);

        if ($request->has('rewards'))
            $header .= '&rewards=' . $rewardsData;

        Log::channel('custom')->info('Header Infomation', ['Header' => $header]);
        try {
            $response = (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/venue/products?type=GBK' . $header);


            $products = json_decode($response->getBody());
            /*     dd($products);*/

            if ($products->success == 'TRUE')
                $products->data->total_pages = $products->pages;

            Log::channel('custom')->info('Recieve Data', ['RecieveData' => $products->data]);
            return ($products->success == 'TRUE')
                ? ['status' => true, 'data' => $products->data, 'message' => $products->message]
                : ['status' => false, 'data' => (object)[], 'message' => $products->message];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }//---- End of getCategoryProducts() -----//

    /**
     * @param $exipry
     * @param $cardNumber
     * @return array
     * @throws GuzzleException
     */
    private function getCardPanTokensSoldi($exipry, $cardNumber)
    {
        $data = [
            'ExpiryDate' => $exipry,
            'PAN' => $cardNumber,
            'CertificateID' => Config::get('constant.CertificateID'),
            'ApplicationID' => Config::get('constant.ApplicationID'),
            'Command' => 'PANToken'
        ];

        try {
            $response = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/pantoken', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $data
            ]);
            $response = json_decode($response->getBody()->getContents());

            if ($response->data) {
                $actualResponse = json_decode($response->data);
                if ($actualResponse->Enquiry->Result->Status == '-1')
                    return ['status' => false, 'message' => $actualResponse->Enquiry->Result->Description];


            }

            return ($response->data)
                ? ['status' => true, 'data' => $actualResponse]
                : ['status' => false];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }//---- End of getCardPanTokensSoldi() ----//

    /**
     * @param Request $request
     * @return array|mixed|\Psr\Http\Message\ResponseInterface
     * @throws GuzzleException
     */
    public function scanBillFromSoldi(Request $request)
    {
        try {
            $user = $request->user();
            if ($request->has('qr_code') && $request->qr_code) {
                $response = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/getBill', [
                    'headers' => [
                        'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                        'SECRET' => config('constant.SOLDI_SECRET')
                    ],
                    'form_params' => ['qr_code' => $request->qr_code, 'bill_type' => $request->bill_type]
                ]);

                $response = json_decode($response->getBody()->getContents());
                $company_id = Config::get('constant.COMPANY_ID');
                $venue = Venue::where('company_id', $company_id)->first();
                $request->request->add(['venue_id' => $venue->venue_id ?? $venue['venue_id'], 'company_id' => Config::get('constant.COMPANY_ID'), 'soldi_id' => $user->soldi_id]);

                $loyalty = $this->getAllUserPoints($request);

                if (isset($response->body) && !empty($response->body))
                    $response->body->points_data = $loyalty['data'] ?? (object)[];

                return ['status' => (bool)$response->status ?? false, 'message' => $response->message, 'data' => $response->body ?? (object)[], 'points_data' => $loyalty['data'] ?? []];
            }
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }

    private function getFiltersForProducts($filters)
    {

        if ($filters) {
            $header = '';
            $filters = json_decode($filters);
            foreach ($filters as $key => $value) {
                if ($value->value) {
                    $newKey = explode(' ', $value->key);
                    $newValue = ($value->value) ? 'yes' : 'no';
                    $header .= '&' . strtolower($newKey[0]) . '=' . $newValue;
                }
            }
            Log::channel('custom')->info('Filters Infomation', ['Filters' => $header]);

            return $header;
        }

    }//----- End of scanBillFromSoldi() ----//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function getPointsProducts(Request $request)
    {
        $header = '';
        if ($request->has('page') && $request->page)
            $header .= '&page=' . $request->page;

        if ($request->has('points') && $request->points)
            $header .= '&points=' . $request->points;

        try {
            $response = (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/venue/points_products?type=GBK' . $header);


            $products = json_decode($response->getBody());

            if ($products->success == 'TRUE')
                $products->data->total_pages = $products->page;


            return ($products->success == 'TRUE')
                ? ['status' => true, 'data' => $products->data, 'message' => $products->message]
                : ['status' => false, 'data' => (object)[], 'message' => $products->message];
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }//----- End of getPointsProducts() -----//

    /**
     * @param Request $request
     * @return array|mixed|\Psr\Http\Message\ResponseInterface
     * @throws GuzzleException
     */
    public function getbillQrcode(Request $request)
    {
        try {
            $user = request()->user();
            return (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/payments/bill_qrcode?user_id=' . $user->soldi_id . '&plu=' . $request->plu)->getBody();

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }//----- End of getbillQrcode() -----//

    /**
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    public function getUserGiftCards()
    {
        try {
            $user = request()->user();
            return (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]))->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/giftcard/listing?customer_id=' . $user->soldi_id)->getBody();

        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }//---- End of getUserGiftCards() ----//

    /**
     * @param Request $request
     * @return array|mixed|\Psr\Http\Message\ResponseInterface
     * @throws GuzzleException
     */
    public function getDiscountPlus(Request $request)
    {
        try {
            $res = (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $request->all(),
            ]))->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/discount_plus');
            return $res->getBody()->getContents();
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }///----- End of getDiscountPlus() -----//

    /**
     * @param Request $request
     * @return array|mixed|\Psr\Http\Message\ResponseInterface
     * @throws GuzzleException
     */
    public function getSoldiDiscount(Request $request)
    {
        try {
            $res = (new Client([
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $request->all(),
            ]))->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/getBill');
            return $res->getBody()->getContents();
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }//----- End of getSoldiDiscount() ----//

    public function paymentToSoldi(Request $request)
    {
        try {
            if ($request->discounted_plu)
                $loyaltyCheck = $this->checkDiscountedValue($request);

            if (!$loyaltyCheck['status'])
                return ['status' => 400, 'success' => 'FALSE', 'message' => $loyaltyCheck['message']];


            $data = $this->loadPayload($request);


            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/push_order', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $data
            ]);

            //dd(json_decode($res->getBody()->getContents()));
            $order_arr = json_decode($res->getBody());
            $this->insertDataInformation($data, $order_arr);

            //Process Vouchers for generate code
            if (!empty($loyaltyCheck['voucher']) && isset($loyaltyCheck['voucher']['voucherid'])) {
                foreach ($loyaltyCheck['voucher']['voucherid'] as $value) {
                    Log::channel('custom')->info('Update Voucher For Users', ['inserid', $value]);
                    UserLoyaltyPoints::where(['user_id' => $request->user_id, 'voucher_id' => $value, 'voucher_id' => $value, 'device_token' => $request->customer_token_id])->update([
                        'wi_code' => $order_arr->wi_code,
                    ]);
                }
            }
            if (isset($loyaltyCheck['data'])) {
                if (!empty($loyaltyCheck['data']) && $loyaltyCheck['data']['type'] == 'point') {
                    UserLoyaltyPoints::where(['id' => $loyaltyCheck['data']['point_id'], 'user_id' => $request->user_id, 'point_amount' => $loyaltyCheck['data']['total_points'], 'device_token' => $request->customer_token_id])->update([
                        'wi_code' => $order_arr->wi_code,
                    ]);
                }

            }


            return json_encode($order_arr);
        } catch (Exception $e) {
            Log::channel('payment')->error('Error Form Function', ['errorMessage' => $e->getMessage()]);
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }

    }

    private function insertDataInformation($data, $order_arr)
    {
        Log::channel('payment')->info('Data From SOldi ANd user', ['DataToSoldi' => $data, 'ResponseSoldi' => $order_arr]);
        return;
    }

    /**
     * @param Request $request
     * @return array|false|string
     * @throws GuzzleException
     */
    public function customerOrderStatus(Request $request)
    {
        try {
            if ($this->current_user == 'mobile')
                $user = request()->user();
            else
                $user = User::where('soldi_id', $request->soldi_id)->first();

            $res = (new Client())->request('GET', config('constant.SOLDI_DEFAULT_PATH') . '/orders/customer_orders?customer_id=' . $user->soldi_id . '&wi_code=' . $request->wi_code, [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ]
            ]);
            $order_arr = json_decode($res->getBody());
            $points = $this->voucherRedemptionAndLoyaltyPoint($order_arr, $request->wi_code);
            Log::channel('payment')->info('Checkin new', ['BeforeEarnedPoints' => $points]);

            if ($order_arr->data) {
                $order_arr->data[0]->earned_points = $points['points'] ?? '';

            }
//work here
            Log::channel('payment')->info('wicode data', ['soldiwicodestatus' => $order_arr, 'EarnedPoints' => $points, 'wi_code' => $request->wi_code]);
//            Log::channel('payment')->info('wicode data', ['soldi_order' => $order_arr]);
//            Log::channel('payment')->info('wicode data', ['soldi_order' => $order_arr->data[0]]);
            return json_encode($order_arr);
        } catch (Exception $e) {
            Log::channel('payment')->error('Error Form Function', ['errorMessage' => $e->getMessage()]);
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }

    /**
     * @param $request
     * @return array
     * @throws GuzzleException
     */
    private function loyaltyCalculationEarnedPoints($company_id, $venue_id, $customer_id, $amountLoayalty, $points, $amplifyid)
    {

        Log::channel('payment')->info('Redeemed Points', ['company_id' => $company_id, 'venue_id' => $venue_id, 'amountLoayalty' => $amountLoayalty, 'points' => $points]);
        $points_all_debit = DB::table('lt_transations')->selectRaw('sum(lt_transations.value_points) as points_total,type')
            ->where('customer_id', $customer_id)
            ->groupBy('lt_transations.type')
            ->get();
        $alreadyRedeemed = DB::table('lt_transations')->where('customer_id', $customer_id)->where('type', 'debit')->where('wi_code', $amplifyid)->first();
        if (empty($alreadyRedeemed)) {

            $debitAmount = $points_all_debit[1]->points_total ?? 0;
            $creditAmount = $points_all_debit[0]->points_total ?? 0;
            $totalAvailable = $creditAmount - $debitAmount;
            if ($totalAvailable >= $points) {
                DB::table('lt_transations')->insert(
                    ['soldi_id' => $customer_id, 'company_id' => '342', 'venue_id' => '316801', 'order_amount' => $amountLoayalty, 'lt_rule_id' => 1, 'status' => 1, 'customer_id' => $customer_id, 'rule_for' => 'store', 'source' => 'manual', 'type' => 'debit', 'point_id' => 1, 'value_points' => $points, 'created_at' => time(), 'updated_at' => time(), 'wi_code' => $amplifyid]
                );

                return ['status' => true, 'transaction_id' => rand(1111, 9999)];
            } else {
                return ['status' => false, 'message' => "You don't have points for this transaction"];
            }
        }


    }//---- End of loyaltyCalculationEarnedPoints() ----//

    /**
     * @param Request $request
     * @return array
     */
    private function loadPayload(Request $request)
    {
        return [
            'user_id' => $request->user_id, 'order_type' => $request->order_type, 'amount' => $request->order_real_amount,
            'tip_amount' => (double)$request->tip ?? 0, 'pos_id' => $request->pos_id ?? 0, 'basket_id' => $request->basket_id ?? '', 'discounted_plu' => $request->discounted_plu,
            'is_redeem' => $request->is_redeem, 'redeem_points' => $request->redeem_points,
            "payment_data" => ['business_id' => $request->business_id, 'amount_due' => $request->amount_due, 'user_id' => $request->user_id,
                'country_id' => $request->country_id, 'customer_id' => $request->customer_id,
                'is_acknowledge' => $request->is_acknowledge, 'ord_date' => $request->ord_date,
                'ord_type' => $request->ord_type, 'order_pin_location' => $request->order_pin_location,
                'order_real_amount' => $request->order_real_amount, 'payment_by' => $request->payment_by,
                'register_id' => $request->register_id, 'vat_amount' => $request->vat_amount,
                'vat_label' => $request->vat_label, 'employee_id' => $request->customer_id,
                'ord_status' => $request->ord_status, 'transaction_id' => $request->transaction_id,
                'tip' => $request->tip ?? 0, 'order_items' => stripslashes($request->order_items),
                'card_detail' => stripslashes($request->card_detail) ?? [], 'total_points' => 0,
                'points_amount' => 0, 'is_split' => [], 'split_data' => [],
                'pay_with_points' => $request->pay_with_points, 'device_name' => $request->device_name,
                'device_model' => $request->device_model, 'voucher_code' => $request->voucher_code ?? 0,
                'voucher_amt' => $request->voucher_amt ?? 0, 'items_discount' => 0,
                'app_name' => $request->app_name, 'is_eway_payment_enable' => false,
                'earned_points' => 0, 'customer_token_id' => $request->customer_token_id,
                'shipping_address' => json_encode([]) ?? '', 'delivery_cost' => $request->delivery_cost ?? '',
                'giftcard_data' => $request->giftcard_data ?? [],

            ],
            'store_id' => $request->store_id ?? 0,
            'retailer_id' => $request->retailer_id ?? 0,
            'posid' => $request->pos_id ?? 0,
            'wi_code' => $request->wi_code ?? ''

        ];
    }//---- End of loadPayload() ----//

    private function voucherRedemptionAndLoyaltyPoint($order_arr, $transactionID)
    {
        try {


            if ($order_arr->status == 400) {
                if ($this->current_user == 'soldi')
                    $this->unlockPoints($order_arr->user_id, $order_arr->customer_token_id, $transactionID);

                return ['points' => 0];
            }
            if ($order_arr->status == 404) {
                if ($this->current_user == 'soldi')
                    $this->unlockPoints($order_arr->user_id, $order_arr->customer_token_id, $transactionID);

                return ['points' => 0];
            }
            if ($order_arr->status == 200) {
                if ($this->current_user == 'soldi')
                    $this->unlockPoints($order_arr->user_id, $order_arr->customer_token_id, $transactionID);

                if ($order_arr->message == 'REVERSE') {

                    return ['points' => 0];
                }

                if ($order_arr->message == '1 found.') {
                    $pointsData = $this->loyaltyProcessingData($order_arr, $transactionID);

                    //Work For Mobeen
                    //save transaction
                    try {
                        $this->saveTransaction($order_arr->data[0]);

                        //Log::channel('payment')->info('qqqqqqqqqq', ['ResponseFromPoints' => $order_arr->data[0]]);
                    } catch (\Exception $e) {
                        Log::channel('payment')->error('Error Form save transaction function', ['errorMessage' => $e->getMessage()]);
                    }
                    Log::channel('payment')->info('Check Response From Loyalty', ['ResponseFromPoints' => $pointsData]);
                    return $pointsData;
                }
            }
        } catch (\Exception $e) {
            Log::channel('payment')->error('Error Occured' . $e->getMessage());
        }
    }

    /**
     * @param $order
     */
    public function saveTransaction($order)
    {
        $soldi_user = User::where('soldi_id', $order->customer_id)->first();
        $transaction = new MemberTransaction();

        $transaction->soldi_id = $order->customer_id;
        $transaction->user_id = ($soldi_user != null) ? $soldi_user->user_id : 0;
        $transaction->transaction_id = $order->transaction_id;
        $transaction->date = Carbon::createFromTimestamp($order->ord_date)->toDateTimeString();
        $transaction->amount = $order->ord_amount;
        $transaction->type = $order->payment_by;
        $transaction->tax = $order->vat_amount;
        $transaction->discount = $order->items_discount;
        $transaction->number_of_items = count($order->order_detail);
        $transaction->status = 'paid';
        $transaction->business_name = $order->business_name;
        $transaction->staff_member = $order->staff_name;
        $transaction->business_id = $order->business_id;
        $transaction->tip = $order->tip_amount;
        $transaction->save();

        if ($soldi_user) {

            //....... insert user venue subscription details   ......//
            $resp = (new ElasticSearchController())->updateUserVenueSubscription($soldi_user->user_id, $order->business_id,date('Y-m-d H:i:s'));
            Log::channel('custom')->info("user venue subscription $soldi_user->user_id, $order->business_id", ['RedemetionResponse' => $resp]);

            $soldi_user->number_of_transactions = MemberTransaction::where('soldi_id', $order->customer_id)->count();
            $soldi_user->basket_value = MemberTransaction::where('soldi_id', $order->customer_id)->sum('amount');
            $soldi_user->basket_size = MemberTransaction::where('soldi_id', $order->customer_id)->sum('number_of_items');
            $soldi_user->avg_basket_size = $soldi_user->number_of_transactions > 0 ? round($soldi_user->basket_size / $soldi_user->number_of_transactions, 2) : 0;
            $soldi_user->avg_basket_value = $soldi_user->number_of_transactions > 0 ? round($soldi_user->basket_value / $soldi_user->number_of_transactions, 2) : 0;

            $soldi_user->save();
        }

        (new ElasticSearchController())->updateElasticsearchData('transaction_data', $soldi_user);
        return $transaction ? true : false;
    }

    /**
     * @param $order_arr
     * @throws GuzzleException
     */
    public function loyaltyProcessingData($order_arr, $transactionID)
    {
        $discontAmount = 0;
        $venue = Venue::where('company_id', Config::get('constant.COMPANY_ID'))->first();
        $voucherArray = [];
        try {
            if ($order_arr->data) {
                $order_arr = $order_arr->data[0];

                if (!empty($order_arr->loyalty)) {
                    $discountedLoyaty = json_decode($order_arr->loyalty);
                    //For points and voucher
                    foreach ($discountedLoyaty as $keyValue) {
                        if ($keyValue->type == 'coupon') {

                            $discontAmount += $keyValue->points;


                        } else if ($keyValue->type == 'voucher') {


                            $voucherArray[] = $keyValue->id;

                        }
                    }

                    //Redeemed point for User
                    $transaction_id = $this->loyaltyCalculationEarnedPoints(Config::get('constant.COMPANY_ID'), $venue->venue_id, $order_arr->customer_id, $order_arr->loyalty_amount, $discontAmount, $transactionID);
                    Log::channel('custom')->info('Redeemption Response', ['RedemetionResponse' => $transaction_id]);
                    if (!$transaction_id['status']) {
                        return $transaction_id;
                    }
                    //Vouvher Reserves for duplication
                    $userVouchers = DB::table('user_voucher_reserves')->where('user_id', $order_arr->customer_id)->where('wi_code', $transactionID)->first();

                    if (empty($userVouchers)) {
                        DB::table('user_voucher_reserves')->insert(
                            ['user_id' => $order_arr->customer_id, 'vouchers' => json_encode($voucherArray), 'wi_code' => $transactionID, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
                        );

                        //Redeemed Voucher Call
                        if (!empty($voucherArray))
                            $this->voucherUpdate($voucherArray, $venue->venue_id, Config::get('constant.COMPANY_ID'));

                    }
                }


                //Points Earn by User
                if ($order_arr->loyalty_amount > 0) {
                    $earnPointsDATA = intval(intval($order_arr->loyalty_amount / 100) / 50) * 10;
                    Log::channel('payment')->info('Earned Points test', ['earnPoints' => $earnPointsDATA]);


                    if ($earnPointsDATA > 0) {
                        $alreadyBurned = DB::table('lt_transations')->where('customer_id', $order_arr->customer_id)->where('type', 'credit')->where('wi_code', $transactionID)->first();
                        if (empty($alreadyBurned)) {

                            $transaction = new MemberTransaction();
                            $transactionData = $transaction->where(['business_id' => $order_arr->business_id, 'user_id' => $order_arr->user_id])->latest()->first();
                            if (Carbon::parse($transactionData->created_at)->diffInHours(now()) > 3) {
                                DB::table('lt_transations')->insert(
                                    ['soldi_id' => $order_arr->customer_id, 'company_id' => Config::get('constant.COMPANY_ID'), 'venue_id' => $order_arr->business_id, 'order_amount' => $order_arr->loyalty_amount, 'lt_rule_id' => 1, 'status' => 1, 'customer_id' => $order_arr->customer_id, 'wi_code' => $transactionID, 'rule_for' => 'store', 'source' => 'manual', 'type' => 'credit', 'point_id' => 1, 'value_points' => $earnPointsDATA, 'created_at' => time(), 'updated_at' => time()]
                                );
                                $this->soldiUpdateForPoints($order_arr->ord_id, $earnPointsDATA);
                            }

                        }

                        return ['points' => $earnPointsDATA];
                    } else {

                        Log::channel('payment')->info('AMOUNRTTTTT', ['ResponseFromPoints' => $earnPointsDATA]);
                        return ['points' => 0];
                    }
                }
                return ['points' => 0];

            }
            return ['points' => 0];
        } catch (\Exception $e) {
            Log::channel('payment')->error('wicode data', ['Errorrrrr' => $e->getMessage()]);
        }

    }//----- End of loyaltyProcessingData() ----//

    /**
     * @param $vouchers
     * @param $venue_id
     * @param $company_id
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    public function voucherUpdate($vouchers, $venue_id, $company_id)
    {
        try {
            Log::channel('payment')->info('Redeem Voucher', ['Voucher' => $vouchers, 'venue_id' => $venue_id, 'company_id' => $company_id]);
            return (new Client(['headers' => []]))
                ->request('POST', config('contant.JAVA_URL') . 'updateUserVoucher', [
                    'json' => ['voucher_ids' => $vouchers, 'company_id' => $company_id, 'venue_id' => $venue_id]
                ])->getBody();
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', "message" => "Error " . $e->getMessage()];
        }
    }//----- End of voucherUpdate() -----//

    /**
     * @param $ord_id
     * @param $earnPoints
     * @return array
     * @throws GuzzleException
     */
    private function soldiUpdateForPoints($ord_id, $earnPoints)
    {
        try {
            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/orders/updateloyalty', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => ['order_id' => $ord_id, 'earn_points' => $earnPoints]
            ]);
            $order_arr = json_decode($res->getBody());
            Log::channel('payment')->info('Data To Soldi Points', ['PointsRecieved' => $order_arr, 'points' => $earnPoints, 'order_id' => $ord_id]);
            return;
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', "message" => "Error " . $e->getMessage()];
        }
    }

    private function checkDiscountedValue(Request $request)
    {
        $points = 0;
        $voucherID = [];
        $discountPlus = json_decode($request->discounted_plu, true);

        if (!empty($discountPlus)) {
            foreach ($discountPlus as $value) {
                if ($value['type'] == 'coupon') {
                    $points += ($value['points'] * $value['quantity']);
                } else if ($value['type'] == 'voucher') {
                    $voucherID[] = $value['id'];
                }
            }
            try {
                if ($points > 0) {
                    $pointsData = $this->calculatePoints($points, $request);
                    if (!$pointsData['status'])
                        return $pointsData;
                }

                if (!empty($voucherID)) {
                    $vovucherData = $this->voucherApplyCheck($voucherID, $request);
                    if (!$vovucherData['status']) {
                        return $vovucherData;
                    }

                }

                return ['status' => true, 'data' => (isset($pointsData['status'])) ? $pointsData : '', 'voucher' => (isset($vovucherData['status'])) ? $vovucherData : ''];
            } catch (\Exception $e) {
                Log::channel('custom')->error('Error In Point', ['PointResponseVoucher' => $e->getMessage()]);
            }
        } else
            return ['status' => true];

    }

    /**
     * @param int $points
     * @param Request $request
     * @return array
     */
    private function calculatePoints(int $points, Request $request)
    {

        // All user Points Available
        $points_all_debit = DB::table('lt_transations')->selectRaw('sum(lt_transations.value_points) as points_total,type')
            ->where('customer_id', $request->customer_id)
            ->groupBy('lt_transations.type')
            ->get();


        //same user with processed points
        $userVouchers = UserLoyaltyPoints::where([
            'user_id' => $request->user_id,
            'type' => 'points',
            'device_token' => $request->customer_token_id,
            'status' => 1,
            'action' => 'processed'
        ])->get();

        if ($userVouchers->isNotEmpty()) {
            Log::channel('custom')->info('Processed Points', ['pointsdata' => $points]);
            $userPointLocked = UserLoyaltyPoints::where('user_id', $request->user_id)->get()->sum('point_amount');
            $debitAmount = $points_all_debit[1]->points_total ?? 0;
            $creditAmount = $points_all_debit[0]->points_total ?? 0;
            $totalAvailable = $creditAmount - $debitAmount;

            if (($totalAvailable - $userPointLocked) <= $points) {
                return ['status' => false, 'message' => "You don't have enough points to redeem!"];
            }
        }


        Log::channel('custom')->info('Total Points', ['Points' => $points]);
        //Delete User Points
        UserLoyaltyPoints::where([
            'user_id' => $request->user_id,
            'device_token' => $request->customer_token_id,
            'type' => 'points'
        ])->where('action', '!=', 'processed')->delete();

        //Sum of user points that are locked
        $userPointLocked = UserLoyaltyPoints::where('user_id', $request->user_id)->get()->sum('point_amount');


        Log::channel('custom')->info('Redeemed', ['UserPointsRedeemed' => $userPointLocked]);

        //Calculate total points available
        if (!empty($points_all_debit)) {
            $debitAmount = $points_all_debit[1]->points_total ?? 0;
            $creditAmount = $points_all_debit[0]->points_total ?? 0;
            $totalAvailable = $creditAmount - $debitAmount;

            if (($totalAvailable - $userPointLocked) >= $points) {
                $pointid = UserLoyaltyPoints::create([
                    'user_id' => $request->user_id,
                    'point_amount' => $points,
                    'device_token' => $request->customer_token_id,
                    'type' => 'points',
                    'status' => 1,
                ]);
                return ['status' => true, 'type' => 'point', 'point_id' => $pointid->id, 'total_points' => $points];
            } else {
                return ['status' => false, 'message' => "You don't have enough points"];
            }
        }

    }//--- End of  calculatePoints() ----//

    /**
     * @param array $voucherID
     * @param Request $request
     * @return array
     */
    private function voucherApplyCheck(array $voucherID, Request $request)
    {
        sleep(2);
        Log::channel('custom')->info('Voucher Information', ['VoucherIDs' => $voucherID]);

        //same user with processed vouchers
        $userVouchers = UserLoyaltyPoints::where([
            'user_id' => $request->user_id,
            'type' => 'vouchers',
            'status' => 1,
            'device_token' => $request->customer_token_id,
            'action' => 'processed'
        ])->
        whereIn('voucher_id', $voucherID)->get();

        if ($userVouchers->isNotEmpty()) {
            Log::channel('custom')->info('Voucher Processed', ['VoucherIDs' => $voucherID]);
            return ['status' => false, 'message' => "Your voucher is not available now to redeem!"];
        }

        // Removing all vouchers from locking against this user's device id
        UserLoyaltyPoints::where([
            'user_id' => $request->user_id,
            'device_token' => $request->customer_token_id,
            'type' => 'vouchers'
        ])->whereIn('voucher_id', $voucherID)->delete();


        // Same user used same voucher in other device?
        $userData = UserLoyaltyPoints::where([
            'user_id' => $request->user_id,
            'type' => 'vouchers',
            'status' => 1,
        ])->where('device_token', '!=', $request->customer_token_id)->
        whereIn('voucher_id', $voucherID)->get();

        // Check Elasticsearch for redeemed vouchers
        $redeemedVouchers = ElasticsearchUtility::getVoucherDetails('amplify_342_316801', $voucherID, $request);


        if ($userData->isNotEmpty() || !$redeemedVouchers['status']) {
            Log::channel('custom')->info('Voucher ids', ['VoucherIDs' => $voucherID]);
            return ['status' => false, 'message' => 'Voucher is already in use'];
        } else {

            // Locking vouchers against this user's device id
            foreach ($voucherID as $value) {
                Log::channel('custom')->info('Inserted ids', ['inserid', $value]);
                UserLoyaltyPoints::create([
                    'user_id' => $request->user_id,
                    'voucher_id' => $value,
                    'device_token' => $request->customer_token_id,
                    'type' => 'vouchers',
                    'status' => 1
                ]);
            }

            return ['status' => true, 'voucherid' => $voucherID];
        }


        //return ElasticsearchUtility::getVoucherDetails('amplify_342_316801', $voucherID,$request);
    }//---- End of voucherApplyCheck() ----//

    /**
     * @param Request $request
     * @return array|false|string
     * @throws GuzzleException
     */
    public function customerGiftCardOrder(Request $request)
    {
        try {

            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/push_order', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $request->all()
            ]);
            $order_arr = json_decode($res->getBody());
            Log::channel('payment')->info('Data To Gift Card', ['GiftCardData' => $order_arr]);
            return json_encode($order_arr);
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }//---- End of customerGiftCardOrder() ----//

    /**
     * @return array
     */
    public function autoDeleteUsersPointsLog()
    {

        $newTime = strtotime('-15 minutes');
        $startTime = date('Y-m-d H:i:s', $newTime);
        $endTime = date('Y-m-d H:i:s');
        //dd($endTime);
        $except_users = UserLoyaltyPoints::select("id")->where("created_at", "<=", $startTime)->pluck("id");
        $allVouchers = UserLoyaltyPoints::where('type', 'vouchers')->where("created_at", "<=", $startTime)->get();
        $vouchersData = [];
        foreach ($allVouchers as $userData) {
            $vouchersData[] = $userData->voucher_id;
        }

        if (collect($vouchersData)->isNotEmpty()) {
            ElasticsearchUtility::lockUnlockVoucher('amplify_342_316801', $vouchersData, 0);
        }
        UserLoyaltyPoints::whereIn('id', $except_users)->delete();

        Log::channel('user')->info('delete all logs', ['StartTime' => $startTime, 'EndTime' => $endTime]);
        return ["status" => true, "message" => "Record Deleted Successfully", "time" => $endTime, 'voucherID' => $vouchersData];
    }


    function check_cc($cc, $extra_check = false)
    {
        $cards = array(
            "visa" => "(4\d{12}(?:\d{3})?)",
            "amex" => "(3[47]\d{13})",
            "jcb" => "(35[2-8][89]\d\d\d{10})",
            "maestro" => "((?:5020|5038|6304|6579|6761)\d{12}(?:\d\d)?)",
            "solo" => "((?:6334|6767)\d{12}(?:\d\d)?\d?)",
            "mastercard" => "(5[1-5]\d{14})",
            "switch" => "(?:(?:(?:4903|4905|4911|4936|6333|6759)\d{12})|(?:(?:564182|633110)\d{10})(\d\d)?\d?)",
        );
        $names = array("Visa", "American Express", "JCB", "Maestro", "Solo", "Mastercard", "Switch");
        $matches = array();
        $pattern = "#^(?:" . implode("|", $cards) . ")$#";
        $result = preg_match($pattern, str_replace(" ", "", $cc), $matches);
        if ($extra_check && $result > 0) {
            $result = (validatecard($cc)) ? 1 : 0;
        }
        return ($result > 0) ? $names[sizeof($matches) - 2] : false;
    }

    /**
     * @param Request $request
     * @return array|false|string
     * @throws GuzzleException
     *
     */
    public function customerSendGiftCard(Request $request)
    {
        try {

            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/giftcard/send', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $request->all()
            ]);
            $order_arr = json_decode($res->getBody());
            Log::channel('payment')->info('Data To Gift Card SEND', ['GIFTCARDSEND' => $order_arr, 'GIFTCARDDATA' => $request->all()]);
            return json_encode($order_arr);
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }//----- End of customerSendGiftCard() ------///

    public function validateCustomerGiftCard(Request $request)
    {
        try {
            $user = $request->user();
            if ($request->type == 'claim') {
                if ($request->phone_code != $user->activation_token)
                    return ['status' => 400, 'success' => 'FALSE', 'message' => 'Enter Valid code to claim gift card', 'body' => []];
            }
            $res = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/giftcard/claim', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $request->all()
            ]);
            $order_arr = json_decode($res->getBody());
            Log::channel('payment')->info('Claim GifCard Response', ['GiftCardCliam' => $order_arr, 'GIFTCARDCLAIM' => $request->all()]);
            if ($request->type == 'validate') {
                if ($order_arr->success == 'TRUE') {
                    $user->activation_token = rand(1111, 9999);
                    $user->save();
                    (new UserApiController())->sendVerificationGiftCard($user->user_mobile, $user->activation_token, $user->user_first_name);
                }
            }
            return json_encode($order_arr);
        } catch (Exception $e) {
            return ['status' => 400, 'success' => 'FALSE', 'message' => 'Following Error Occurred ' . $e->getMessage()];
        }
    }


    /**
     * @param Request $request
     * @throws GuzzleException
     */
    public function updateUserPayments(Request $request)
    {
        try {
            $this->current_user = 'soldi';
            $this->customerOrderStatus($request);
        } catch (\Exception $e) {
            Log::channel('custom')->info('Soldi Input for auto payment' . $e->getMessage());
        }
    }


    /**
     * @param Request $request
     * @return array
     */
    public function updateUserWicodeStatus(Request $request)
    {

        Log::channel('custom')->info('LOCKED ', ['recieve' => $request->all()]);
        if ($request->discounted_plu) {

            $discountPlus = $request->discounted_plu;
            Log::channel('custom')->info('LOCKED ', ['discounted' => $discountPlus]);
            $points = 0;
            $voucherID = [];
            if ($discountPlus) {
                foreach ($discountPlus as $value) {
                    if ($value['type'] == 'coupon') {
                        $points += $value['points'];
                    } else if ($value['type'] == 'voucher') {
                        $voucherID[] = $value['id'];
                    }
                }


                Log::channel('custom')->info('LOCKED ', ['point' => $points, 'vouchers' => $voucherID]);
                //Check Points data
                if ($points != 0) {

                    //when wicode is available
                    UserLoyaltyPoints::where(['wi_code' => $request->wi_code, 'type' => 'points'])->update([
                        'action' => 'processed',
                        'point_amount' => $points,

                    ]);

                    //whenn wicode is null
                    UserLoyaltyPoints::where(['user_id' => $request->user_id, 'device_token' => $request->customer_token_id])->whereNull('wi_code')->update([
                        'action' => 'processed',
                        'point_amount' => $points,
                        'wi_code' => $request->wi_code
                    ]);
                }

                //Check Voucher Code
                if ($voucherID) {
                    //when wicode is available in records for vouchers
                    UserLoyaltyPoints::where(['wi_code' => $request->wi_code, 'type' => 'vouchers'])->whereNotIn('voucher_id', $voucherID)->delete();
                    UserLoyaltyPoints::where(['wi_code' => $request->wi_code, 'type' => 'vouchers'])->whereIn('voucher_id', $voucherID)->update(['action' => 'processed']);

                    //When Wicode is not available in records for vouchers
                    UserLoyaltyPoints::where(['user_id' => $request->user_id, 'device_token' => $request->customer_token_id])->whereNotIn('voucher_id', $voucherID)->whereNull('wi_code')->delete();
                    UserLoyaltyPoints::where(['user_id' => $request->user_id, 'device_token' => $request->customer_token_id])->whereIn('voucher_id', $voucherID)->whereNull('wi_code')->update([
                        'action' => 'processed',
                        'point_amount' => $points,
                        'wi_code' => $request->wi_code
                    ]);

                    //---Reserved Vouchers Data
                    ElasticsearchUtility::userReservedData('amplify_342_316801', $request->user_id, 0);
                } else {
                    UserLoyaltyPoints::where(['wi_code' => $request->wi_code, 'type' => 'vouchers'])->delete();
                    ElasticsearchUtility::userReservedData('amplify_342_316801', $request->user_id, 0);
                }
                return ['status' => true, 'message' => 'Record Successfully updated'];
            } else {

                return ['status' => false, 'message' => 'Plu is empty'];
            }
        } else {
            Log::channel('custom')->info('LOCKED ', ['deleteWiCode' => $request->wi_code]);
            UserLoyaltyPoints::where(['wi_code' => trim($request->wi_code)])->delete();

            UserLoyaltyPoints::where(['user_id' => $request->user_id, 'device_token' => $request->customer_token_id])->whereNull('wi_code')->delete();
            ElasticsearchUtility::userReservedData('amplify_342_316801', $request->user_id, 0);

        }
    }//---- End of updateUserWicodeStatus() ----//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function deleteUserWicode(Request $request)
    {
        try {
            $req = (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/payments/delete_wicode_token', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => ['wi_code' => $request->wi_code]
            ])->getBody()->getContents();

            $req = json_decode(stripslashes($req));
            Log::channel('custom')->info('response for delete wicode', ['wicode' => $req]);

            if ($req->status == 200) {
                UserLoyaltyPoints::where(['wi_code' => $request->wi_code])->delete();
                ElasticsearchUtility::userReservedData('amplify_342_316801', $request->user_id, 0);
            }


            return ['status' => true, 'message' => 'Record Successfully delete'];
        } catch (\Exception $e) {
            Log::channel('custom')->error('Errorr From Delete', ['errorMessage' => $e->getMessage()]);
        }
    }//----- End of deleteUserWicode() -----//

}//..... end of class.



