<?php

namespace App\Http\Controllers\Api;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use phpDocumentor\Reflection\Types\Self_;
use DB;
use Image;
use App\Models\User_Card;
use App\classes\CommonLibrary;
use App\Models\VenueAppSkin;
use App\Models\AppSkinning;
use App\Models\Setting;
use App\Models\FavouriteNews;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\VenueSubscrition;
use App\UnifiedDbModels\Venue;
use App\Facade\SoldiLog;
use App\UnifiedDbModels\VenueImage;

class AmplifyApiController extends Controller
{

    const eway_apiencrypt = "epk-2CB0DB1E-6375-4059-9C21-21BEAC99FD1D";
    const eway_encrypt_url = 'https://api.sandbox.ewaypayments.com/encrypt';

    /*sonar constants*/
    const USER_IMAGE                 = 'user_image';
    const USER_URL                 = '/user';
    const FIRST_NAME                 = 'first_name';
    const LAST_NAME                 = 'last_name';
    const PHONE                 = 'phone';
    const SOURCE                 = 'source';
    const MOBILE                 = 'mobile';
    const BUSINESS_ID                 = 'business_id';
    const GENDER                 = 'gender';
    const LAND_LINE                 = 'land_line';
    const STREET_2                 = 'street_2';
    const STREET_1                 = 'street_1';
    const SUBURB                 = 'suburb';
    const COUNTRY                 = 'country';
    const PROVINCE                 = 'provice';
    const AMP_USER_ID                 = 'amp_user_id';
    const COMPANY_ID                 = 'company_id';
    const SOLDI_ID                 = 'soldi_id';
    const VENUE                 = 'venue';
    const VENUE_NAME                 = 'venue_name';
    const VENUE_DESCRIPTION                 = 'venue_description';
    const VENUE_LAT                 = 'venue_latitude';
    const VENUE_LNG                 = 'venue_longitude';
    const VENUE_URL                 = 'venue_url';
    const CREATED_AT                 = 'created_at';
    const VENUES_URL                 = '/public/venues/';
    const IMAGE                 = 'image';
    const USER_EMAIL                 = 'user_email';
    const USER_FIRST_NAME                 = 'user_first_name';
    const USER_FAMILY_NAME                 = 'user_family_name';
    const USER_PASS                 = 'user_password';
    const USER_MOBILE                 = 'user_mobile';
    const USER_POSTAL_CODE                 = 'user_postal_code';
    const USER_DOB                 = 'user_date_of_birth';
    const USER_AVATAR                 = 'user_avatar';
    const CUSTOMER_ID                 = 'customer_id';
    const IS_DEFAULT                 = 'is_default';
    const USER_IS_ACTIVE                 = 'user_is_active';
    const USER_ID              = 'user_id';
    const STATUS              = 'status';
    const MESSAGE              = 'message';
    const NO_DATA_FOUND              = 'No data found';
    const NEW_PASS              = 'new_password';
    const SERVER_ERROR              = 'Server Error!.';
    const IS_ACTIVE              = 'is_active';
    const VENUE_ID              = 'venue_id';
    const IS_OPEN              = 'is_open';
    const START_HOURS              = 'start_hours';
    const FORMAT_DATE              = 'g:i a';
    const END_HOURS              = 'end_hours';
    const VENUE_LOGO              = 'venue_logo';
    const BG_COLOR              = 'bg_color';
    const BLACK              = '000000';
    const TEXT_COLOR              = 'txt_color';
    const WHITE              = 'FFFFFF';
    const BTN_COLOR              = 'btn_color';
    const GREY              = '5c5c5c';
    const HL_COLOR              = 'hl_color';
    const LOW_COLOR              = 'low_color';
    const LINE_COLOR              = 'line_color';
    const ERROR              = 'error';
    const PARAMS_MISSING              = 'Requested Parameaters are missing.';
    const CONTENT              = 'content';
    const PUBLIC_USERS_URL              = '/public/users/';

    public $_common_library;

    public function __construct()
    {
        $this->common_library = new CommonLibrary();
    }

    // get x-api-key
    public function register(Request $request)
    {
        $client = new Client();
        $email = $request->email;
        $first_name = $request->first_name;
        $last_name = $request->last_name;
        $password = $request->password;
        $phone = $request->phone;
        $user_date_of_birth = $request->user_date_of_birth;
        $user_postal_code = $request->user_postal_code;
        $amplify_AP1_key = $request->amplify_AP1_key;
        // Amplify Api Url And Key
        $amplify_AP1_URL = config('constant.amplify_AP1_URL');
        // Soldi Api's and Url
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');


        if ($request->hasFile(self::USER_IMAGE)) {
            $request->file(self::USER_IMAGE)->getPathname();
            $imageName = time() . '_' . $request->file(self::USER_IMAGE)->getClientOriginalName();
            $path = base_path() . self::PUBLIC_USERS_URL;
            $request->file(self::USER_IMAGE)->move($path, $imageName);
            $user_image = $imageName;

            $path_thumbs = base_path() . '/public/users/thumbs';

            Image::make($path . $imageName, array(
                'width' => 200,
                'height' => 200,
                'grayscale' => false
            ))->save($path_thumbs . '/thumb_' . $imageName);

        } else {

            $user_image = '';

        }
        if ($email != '' && $first_name != '' && $last_name != '' && $password != '') {
            $res = $client->request('POST', $amplify_AP1_URL . self::USER_URL, [
                'headers' => [
                    'X-API-KEY' => $amplify_AP1_key
                ],
                'form_params' => [
                    self::EMAIL => $email,
                    self::FIRST_NAME => $first_name,
                    self::LAST_NAME => $last_name,
                    'password' => $password,
                    'confirm_password' => $password,
                    self::PHONE => $phone,
                    self::SOURCE => self::MOBILE,
                ]
            ]);
            if ($res->getBody()) {
                $result = $res->getBody();
                $res_arr = json_decode($result);
                $data_arr = $res_arr->data;

                if (!empty($data_arr)) {
                    $company_id = $data_arr->company_id;
                    $responce_set = $this->common_library->getCompanySittings($company_id);
                    $business_id = $responce_set->business_id ?? "";
                    $SOLDI_API_KEY = $responce_set->soldi_api_key ?? "";
                    $SOLDI_SECRET = $responce_set->soldi_api_secret ?? "";

                    $parm = array(
                        self::BUSINESS_ID => $business_id,
                        self::FIRST_NAME => $first_name,
                        self::LAST_NAME => $last_name,
                        'email_address' => $email,
                        self::GENDER => '1',
                        'mobile_number' => $phone,
                        'company_name' => '',
                        self::LAND_LINE => '',
                        self::STREET_1 => '',
                        self::STREET_2 => '',
                        self::SUBURB => '',
                        self::COUNTRY => '',
                        self::PROVINCE => '',
                        'city' => '',
                        'code' => '',
                        'memo' => ''
                    );
                    $client1 = new Client([
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'X-API-KEY' => $SOLDI_API_KEY,
                            'SECRET' => $SOLDI_SECRET
                        ]
                    ]);
                    try {


                        $response = $client1->request('POST', $SOLDI_DEFAULT_PATH . '/api/v1/customer/create', [
                            'json' => $parm
                        ]);


                        $soldi_res = $response->getBody()->getContents();
                        $soldi_arr = json_decode($soldi_res);

                        $soldi_data = $soldi_arr->data;
                        $customer_id = $soldi_data->customer_id;

                        $data_arr = $res_arr->data;
                        $user_id = $data_arr->user_id;
                        $id = 0;
                        $id = DB::table('users')->insertGetId(
                            [self::AMP_USER_ID => $user_id, self::COMPANY_ID => $company_id, self::SOLDI_ID => $customer_id, self::USER_EMAIL => $email, self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_PASS => md5($password), self::USER_MOBILE => $phone, self::USER_POSTAL_CODE => $user_postal_code, self::USER_DOB => $user_date_of_birth, self::USER_AVATAR => $user_image, self::USER_IS_ACTIVE => 1]
                        );

                        $users = DB::table('users')->where(self::USER_ID, '=', $id)->get();

                    } catch (RequestException $e) {
                        if ($e->getResponse()->getStatusCode() == '403') {
                            $data_arr = $res_arr->data;
                            $user_id = $data_arr->user_id;
                            $customer_id = 0;
                            $id = 0;
                            $id = DB::table('users')->insertGetId(
                                [self::AMP_USER_ID => $user_id, self::SOLDI_ID => $customer_id, self::USER_EMAIL => $email, self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_PASS => md5($password), self::USER_MOBILE => $phone, self::USER_POSTAL_CODE => $user_postal_code, self::USER_DOB => $user_date_of_birth, self::USER_AVATAR => $user_image, self::USER_IS_ACTIVE => 1]
                            );
                            $users = DB::table('users')->where(self::USER_ID, '=', $id)->get();
                        } else {

                            $user_id = $data_arr->user_id;
                            $customer_id = 0;
                            $id = 0;
                            $id = DB::table('users')->insertGetId(
                                [self::AMP_USER_ID => $user_id, self::COMPANY_ID => $company_id, self::SOLDI_ID => $customer_id, self::USER_EMAIL => $email, self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_PASS => md5($password), self::USER_MOBILE => $phone, self::USER_POSTAL_CODE => $user_postal_code, self::USER_DOB => $user_date_of_birth, self::USER_AVATAR => $user_image, self::USER_IS_ACTIVE => 1]
                            );
                            $users = DB::table('users')->where(self::USER_ID, '=', $id)->get();
                        }
                    }
                    //////////////////////
                    //Parameaters
                    if ($id > 0) {
                        $this->saveCardInfo($id);
                    }
                    $arr[self::STATUS] = true;
                    $arr['data'] = $users;
                    $arr[self::MESSAGE] = 'Account Successfully Created.';
                    return json_encode($arr);
                } else {
                    return $result = $res->getBody();
                }
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Missing Parameaters are found.';
            return json_encode($arr);
        }
    }

    public function saveCardInfo($id)
    {
        $user_id = $id;
        $card_no = '4444333322221111';
        $card_name = 'John';
        $expiry_month = 12;
        $expiry_year = 18;
        $cvv = 123;
        $is_default = 1;

        $url = self::eway_encrypt_url;
        $credentials = self::eway_apiencrypt;
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
        curl_setopt($ch, CURLOPT_USERPWD, $credentials);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $response = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($response);
        if ($data->Errors != '') {
            echo "ERROR";
            exit;
        } else {
            $detail = $data->Items;
            $card_num = $detail[0]->Value;
            $card_cvv = $detail[1]->Value;
        }
        $card_type = $this->creditCardType($card_no);
        $last_digit = substr($card_no, -4);
        $cards = new User_Card();
        $cards->user_id = $user_id;
        $cards->card_no = $card_num;
        $cards->card_name = $card_name;
        $cards->expiry_month = $expiry_month;
        $cards->expiry_year = $expiry_year;
        $cards->cvv = $card_cvv;
        $cards->card_type = $card_type;
        $cards->last_digit = $last_digit;
        $cards->is_default = $is_default;
        $cards->timestamps = false;
        $cards->save();

    }

    public function login(Request $request)
    {
        $client = new Client();
        $email = $request->email;
        $password = $request->password;
        $amplify_AP1_key = $request->amplify_AP1_key;
        // Amplify Api Url And Key
        $amplify_AP1_URL = config('constant.amplify_AP1_URL');
        config('constant.SOLDI_DEFAULT_PATH');

        $parm = array(
            'grant_type' => 'client_credentials'
        );
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $amplify_AP1_key,
                'php_auth_user' => $email,
                'php_auth_pw' => $password
            ]
        ]);
        try {
            $response = $client1->post($amplify_AP1_URL . '/token', [
                'json' => $parm
            ]);
            $result = $response->getBody()->getContents();
            $res_arr = json_decode($result);
            if (isset($res_arr->access_token)) {


                $access_token = $res_arr->access_token;
                $res_user = $client->request('POST', $amplify_AP1_URL . '/resource', [
                    'headers' => [
                        'X-API-KEY' => $amplify_AP1_key,
                        'Authorization' => 'Bearer ' . $access_token,
                    ],
                ]);

                $result = $res_user->getBody();
                $res_arr = json_decode($result);
                $res_data = $res_arr->data;
                $res_detail = $res_data->user_detail;
                $user_id = $res_data->user_id;
                $company_id = $res_data->company_id;
                $first_name = $res_detail->first_name;
                $last_name = $res_detail->last_name;
                $phone = $res_detail->phone;
                $email = $res_detail->email;
                $users = DB::table('users')->where(self::USER_EMAIL, '=', $email)->where(self::COMPANY_ID, '=', $company_id)->first();

                $app_mode = Setting::where(self::COMPANY_ID, '=', $company_id)->first();
                $app_mode_status = 0;
                if ($app_mode) {
                    $app_mode_status = $app_mode->app_mode;
                }
                $slider_data_arr = $this->dashboardSlider($company_id, $user_id);

                if ($slider_data_arr[self::STATUS]) {
                    $slider_data = $slider_data_arr['data'];
                } else {
                    $slider_data = [];
                }
                if (isset($users->user_id)) {
                    $user_u_id = $users->user_id;
                } else {
                    $user_u_id = 0;
                }
                $scribed_venue_arr = $this->usersVenue($user_u_id, $company_id);
                $venue_data = $scribed_venue_arr['data'];

                if ($users) {
                    $soldi_res = $this->register_soldi_user($res_detail, $company_id);
                    if ($soldi_res[self::STATUS]) {
                        $soldi_customer_id = $soldi_res[self::CUSTOMER_ID];
                        DB::table('users')
                            ->where(self::USER_ID, $users->user_id)
                            ->update([self::SOLDI_ID => $soldi_customer_id]);
                    }
                    if ($users->qr_code == '') {
                        if ($company_id == 3) {
                            $this->genratBarCode($users->user_id);
                        } else {
                            $this->gerQrCode($users->user_id);
                        }
                    }
                    $users = DB::table('users')->where(self::USER_ID, '=', $users->user_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                    $user_cards = User_Card::where(self::USER_ID, '=', $users->user_id)->where(self::IS_DEFAULT, '=', 1)->first();

                    if ($user_cards) {
                        $users->is_default = true;
                        $users->card_data = $user_cards;
                    } else {
                        $users->is_default = false;
                        $users->card_data = '';
                    }
                    $users->app_mod = $app_mode_status;
                    $arr[self::STATUS] = true;
                    $arr['data'] = $users;
                    $arr['slider_data'] = $slider_data;
                    $arr['user_vanues'] = $venue_data;
                    $arr[self::MESSAGE] = 'Login Successfully';
                    return json_encode($arr);

                } else {
                    $soldi_res = $this->register_soldi_user($res_detail, $company_id);
                    $soldi_customer_id = 0;
                    if ($soldi_res[self::STATUS]) {
                        $soldi_customer_id = $soldi_res[self::CUSTOMER_ID];
                    }
                    $id = DB::table('users')->insertGetId(
                        [self::AMP_USER_ID => $user_id, self::COMPANY_ID => $company_id, self::SOLDI_ID => $soldi_customer_id, self::USER_EMAIL => $email, self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_PASS => md5($password), self::USER_MOBILE => $phone, self::USER_POSTAL_CODE => '', self::USER_DOB => date('y-m-d'), self::USER_AVATAR => '', self::USER_IS_ACTIVE => 1]
                    );

                    $users = DB::table('users')->where(self::USER_ID, '=', $id)->first();
                    if ($users->qr_code == '') {
                        if ($company_id == 3) {
                            $this->genratBarCode($users->user_id);
                        } else {
                            $this->gerQrCode($users->user_id);
                        }
                    }

                    $users = DB::table('users')->where(self::USER_ID, '=', $users->user_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                    $user_cards = User_Card::where(self::USER_ID, '=', $users->user_id)->where(self::IS_DEFAULT, '=', 1)->first();

                    if ($user_cards) {
                        $users->is_default = true;
                        $users->card_data = $user_cards;
                    } else {
                        $users->is_default = false;
                        $users->card_data = '';
                    }
                    $users->app_mod = $app_mode_status;
                    $arr[self::STATUS] = true;
                    $arr['data'] = $users;
                    $arr['slider_data'] = $slider_data;
                    $arr['user_vanues'] = $venue_data;
                    $arr[self::MESSAGE] = 'Login Successfully';

                    return json_encode($arr);

                }
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = @$res_arr->data;

                return json_encode($arr);

            }
        } catch (RequestException $e) {

            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Email or password is invalid.';
            return json_encode($arr);
        }
    }

    public function register_soldi_user($res_detail, $company_id)
    {
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $business_id = $responce_set->business_id ?? "";
        $SOLDI_API_KEY = $responce_set->soldi_api_key ?? "";
        $SOLDI_SECRET = $responce_set->soldi_api_secret ?? "";

        $parm = array(
            self::BUSINESS_ID => $business_id,
            self::FIRST_NAME => $res_detail->first_name,
            self::LAST_NAME => $res_detail->last_name,
            'email_address' => $res_detail->email,
            self::GENDER => '1',
            'mobile_number' => $res_detail->phone,
            'company_name' => '',
            self::LAND_LINE => '',
            self::STREET_1 => '',
            self::STREET_2 => '',
            self::SUBURB => '',
            self::COUNTRY => '',
            self::PROVINCE => '',
            'city' => '',
            'code' => '',
            'memo' => ''
        );
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {
            $response = $client1->request('POST', $SOLDI_DEFAULT_PATH . '/api/v1/customer/create', [
                'json' => $parm
            ]);

            $soldi_res = $response->getBody()->getContents();
            $soldi_arr = json_decode($soldi_res);
            if (isset($soldi_arr->customer_id)) {
                $arr[self::STATUS] = true;
                $arr[self::CUSTOMER_ID] = $soldi_arr->customer_id;
            } else {
                $soldi_data = $soldi_arr->data;
                $customer_id = $soldi_data->customer_id;
                $arr[self::STATUS] = true;
                $arr[self::CUSTOMER_ID] = $customer_id;
            }
            return $arr;
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            return $arr;
        }
    }

    public function forget_password(Request $request)
    {
        $client = new Client();
        $email = $request->email;
        $amplify_AP1_key = $request->amplify_AP1_key;
        if ($email != '') {
            $amplify_AP1_URL = config('constant.amplify_AP1_URL');
            try {
                $res = $client->request('POST', $amplify_AP1_URL . '/forgot_password', [
                    'headers' => [
                        'X-API-KEY' => $amplify_AP1_key,
                    ],
                    'form_params' => [
                        self::EMAIL => $email,
                    ]
                ]);
                return $res->getBody();
            } catch (RequestException $e) {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'Request faild.';
                return json_encode($arr);

            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'email required.';
            return json_encode($arr);

        }
    }

    public function reset_password(Request $request)
    {
        $email = $request->email;
        $pin = $request->pin;
        $new_password = $request->new_password;
        $amplify_AP1_key = $request->amplify_AP1_key;

        $parm = array(
            self::EMAIL => $email,
            'pin' => $pin,
            self::NEW_PASS => $new_password
        );
        $amplify_AP1_URL = config('constant.amplify_AP1_URL');
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $amplify_AP1_key,
            ]
        ]);


        $response = $client1->request('POST', $amplify_AP1_URL . '/reset_password', [
            'json' => $parm
        ]);
        $result = $response->getBody()->getContents();
        $res_arr = json_decode($result, true);
        if ($res_arr[self::STATUS]) {
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = 'password updated';
            return json_encode($arr);

        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'user pin not valid.';
            return json_encode($arr);

        }
    }

    public function updateProfile(Request $request)
    {
        $user_id = $request->user_id;
        $email = $request->email;
        $old_password = $request->old_password;
        $password = $request->password;
        $first_name = $request->first_name;
        $last_name = $request->last_name;
        $phone = $request->phone;
        $user_date_of_birth = $request->user_date_of_birth;
        $user_postal_code = $request->user_postal_code;
        $amplify_AP1_key = $request->amplify_AP1_key;
        $company_id = $request->company_id;
        // Amplify Api Url And Key
        $amplify_AP1_URL = config('constant.amplify_AP1_URL');
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        if ($request->hasFile(self::USER_IMAGE)) {
            $users = DB::table('users')->where(self::AMP_USER_ID, '=', $user_id)->first();
            $user_image = $users->user_avatar;
            if ($user_image != '') {
                @unlink(base_path() . self::PUBLIC_USERS_URL . $user_image);
                @unlink(base_path() . '/public/users/thumbs/thumb_' . $user_image);
            }
            $request->file(self::USER_IMAGE)->getPathname();
            $imageName = time() . '_' . $request->file(self::USER_IMAGE)->getClientOriginalName();
            $path = base_path() . self::PUBLIC_USERS_URL;
            $request->file(self::USER_IMAGE)->move($path, $imageName);
            $user_image = $imageName;

            $path_thumbs = base_path() . '/public/users/thumbs';

            Image::make($path . $imageName, array(
                'width' => 200,
                'height' => 200,
                'grayscale' => false
            ))->save($path_thumbs . '/thumb_' . $imageName);
        } else {
            $users = DB::table('users')->where(self::AMP_USER_ID, '=', $user_id)->first();
            $user_avatar = $users->user_avatar;
            $user_image = $user_avatar;
        }
        if ($user_id != '' && $first_name != '' && $last_name != '' && $amplify_AP1_key != '') {
            if ($password != '' && $old_password != '') {
                $parm = array(
                    self::USER_ID => $user_id,
                    self::FIRST_NAME => $first_name,
                    self::LAST_NAME => $last_name,
                    self::EMAIL => $email,
                    self::PHONE => $phone,
                    self::SOURCE => self::MOBILE,
                );
                $parm1 = array(
                    self::EMAIL => $email,
                    'old_password' => $old_password,
                    self::NEW_PASS => $password,
                );
                $client = new Client([
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $amplify_AP1_key
                    ]
                ]);

                try {
                    $response = $client->request('PUT', $amplify_AP1_URL . self::USER_URL, [
                        'json' => $parm
                    ]);
                    $amplify_res = $response->getBody();
                    $amplify_arr = json_decode($amplify_res);
                    $res_status = $amplify_arr->status;
                    if ($res_status) {
                        $response1 = $client->request('POST', $amplify_AP1_URL . '/change_password', [
                            'json' => $parm1
                        ]);
                        $responce2 = $response1->getBody();
                        $res_arr1 = json_decode($responce2);
                        $res_status1 = $res_arr1->status;
                        if ($res_status1) {
                            DB::table('users')
                                ->where(self::AMP_USER_ID, $user_id)
                                ->update([self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_MOBILE => $phone, self::USER_DOB => $user_date_of_birth, self::USER_POSTAL_CODE => $user_postal_code, self::USER_AVATAR => $user_image]);
                            $users = DB::table('users')->where(self::AMP_USER_ID, '=', $user_id)->first();
                            if (count($users) > 0) {
                                $user_cards = User_Card::where(self::USER_ID, '=', $users->user_id)->where(self::IS_DEFAULT, '=', 1)->first();
                                if ($user_cards) {
                                    $users->is_default = true;
                                    $users->card_data = $user_cards;
                                } else {
                                    $users->is_default = false;
                                    $users->card_data = '';
                                }

                                /* updatting client on soldi */
                                $responce_set = $this->common_library->getCompanySittings($company_id);
                                $business_id = $responce_set->business_id ?? "";
                                $SOLDI_API_KEY = $responce_set->soldi_api_key ?? "";
                                $SOLDI_SECRET = $responce_set->soldi_api_secret ?? "";

                                $client1 = new Client([
                                    'headers' => [
                                        'Content-Type' => 'application/json',
                                        'X-API-KEY' => $SOLDI_API_KEY,
                                        'SECRET' => $SOLDI_SECRET,
                                    ]
                                ]);

                                $parm1 = array(
                                    self::BUSINESS_ID => $business_id,
                                    self::CUSTOMER_ID => $users->soldi_id,
                                    'f_name' => $first_name,
                                    'l_name' => $last_name,
                                    'email_addr' => $email,
                                    self::GENDER => '1',
                                    'mobile_nbr' => $phone,
                                    'comp_name' => '',
                                    self::LAND_LINE => '',
                                    self::STREET_1 => '',
                                    self::STREET_2 => '',
                                    self::SUBURB => '',
                                    self::COUNTRY => '',
                                    self::PROVINCE => '',
                                    'city' => '',
                                    'code' => '',
                                    'memo' => ''
                                );

                                try {
                                    $response1 = $client1->request('PUT', $SOLDI_DEFAULT_PATH . '/api/v1/customer/edit', [
                                        'json' => $parm1
                                    ]);


                                    $soldi_res = $response->getBody()->getContents();
                                    json_decode($soldi_res);
                                } catch (RequestException $e) {
                                    $arr[self::STATUS] = false;
                                    $arr[self::MESSAGE] = $e;
                                    return json_encode($arr);

                                } catch (\Exception $e) {
                                    $arr[self::STATUS] = false;
                                    $arr[self::MESSAGE] = $e;
                                    return json_encode($arr);

                                }
                                /* end updating client on soldi */

                                $arr[self::STATUS] = true;
                                $arr['data'] = $users;
                                $arr[self::MESSAGE] = 'Profile has been updated Successfully';
                                return json_encode($arr);

                            } else {
                                $arr[self::STATUS] = false;
                                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                                return json_encode($arr);

                            }
                        } else {
                            $arr[self::STATUS] = false;
                            $arr[self::MESSAGE] = 'Invalid old password.';
                            return json_encode($arr);

                        }
                    } else {
                        $arr[self::STATUS] = false;
                        $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                        return json_encode($arr);
                    }
                } catch (RequestException $e) {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = self::SERVER_ERROR;
                    return json_encode($arr);
                }
            } else {
                $parm = array(
                    self::USER_ID => $user_id,
                    self::FIRST_NAME => $first_name,
                    self::LAST_NAME => $last_name,
                    self::EMAIL => $email,
                    self::PHONE => $phone,
                    self::SOURCE => self::MOBILE,
                );
                $client = new Client([
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $amplify_AP1_key
                    ]
                ]);

                try {
                    $response = $client->request('PUT', $amplify_AP1_URL . self::USER_URL, [
                        'json' => $parm
                    ]);
                    $amplify_res = $response->getBody();
                    $amplify_arr = json_decode($amplify_res);
                    $res_status = $amplify_arr->status;
                    if ($res_status) {
                        DB::table('users')
                            ->where(self::AMP_USER_ID, $user_id)
                            ->update([self::USER_FIRST_NAME => $first_name, self::USER_FAMILY_NAME => $last_name, self::USER_MOBILE => $phone, self::USER_DOB => $user_date_of_birth, self::USER_POSTAL_CODE => $user_postal_code, self::USER_AVATAR => $user_image]);
                        $users = DB::table('users')->where(self::AMP_USER_ID, '=', $user_id)->first();
                        if (count($users) > 0) {
                            $user_cards = User_Card::where(self::USER_ID, '=', $users->user_id)->where(self::IS_DEFAULT, '=', 1)->first();

                            if ($user_cards) {
                                $users->is_default = true;
                                $users->card_data = $user_cards;
                            } else {
                                $users->is_default = false;
                                $users->card_data = '';
                            }

                            /* updatting client on soldi */
                            $responce_set = $this->common_library->getCompanySittings($company_id);
                            $business_id = $responce_set->business_id ?? "";
                            $SOLDI_API_KEY = $responce_set->soldi_api_key ?? "";
                            $SOLDI_SECRET = $responce_set->soldi_api_secret ?? "";

                            $client1 = new Client([
                                'headers' => [
                                    'Content-Type' => 'application/json',
                                    'X-API-KEY' => $SOLDI_API_KEY,
                                    'SECRET' => $SOLDI_SECRET,
                                ]
                            ]);

                            $parm1 = array(
                                self::BUSINESS_ID => $business_id,
                                self::CUSTOMER_ID => $users->soldi_id,
                                'f_name' => $first_name,
                                'l_name' => $last_name,
                                'email_addr' => $email,
                                self::GENDER => '1',
                                'mobile_nbr' => $phone,
                                'comp_name' => '',
                                self::LAND_LINE => '',
                                self::STREET_1 => '',
                                self::STREET_2 => '',
                                self::SUBURB => '',
                                self::COUNTRY => '',
                                self::PROVINCE => '',
                                'city' => '',
                                'code' => '',
                                'memo' => ''
                            );

                            try {
                                $response1 = $client1->request('PUT', $SOLDI_DEFAULT_PATH . '/api/v1/customer/edit_customer', [
                                    'json' => $parm1
                                ]);


                                $soldi_res = $response->getBody()->getContents();
                                json_decode($soldi_res);
                            } catch (RequestException $e) {
                                $arr[self::STATUS] = false;
                                $arr[self::MESSAGE] = $e;
                                return json_encode($arr);

                            } catch (\Exception $e) {
                                $arr[self::STATUS] = false;
                                $arr[self::MESSAGE] = $e;
                                return json_encode($arr);

                            }
                            /* end updating client on soldi */

                            $arr[self::STATUS] = true;
                            $arr['data'] = $users;
                            $arr[self::MESSAGE] = 'Profile has been updated Successfully';
                            return json_encode($arr);

                        } else {
                            $arr[self::STATUS] = false;
                            $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                            return json_encode($arr);

                        }
                    } else {
                        $arr[self::STATUS] = false;
                        $arr[self::MESSAGE] = self::SERVER_ERROR;
                        return json_encode($arr);

                    }
                } catch (RequestException $e) {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = self::SERVER_ERROR;
                    return json_encode($arr);
                }
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Requested parameters are missing.';
            return json_encode($arr);
        }
    }

    public function change_password(Request $request)
    {

        $email = $request->email;
        $old_password = $request->old_password;
        $new_password = $request->new_password;
        // Amplify Api Url And Key
        $amplify_AP1_key = $request->amplify_AP1_key;
        $amplify_AP1_URL = config('constant.amplify_AP1_URL');
        if ($email != '' && $old_password != '' && $new_password != '' && $amplify_AP1_key != '') {
            $parm = array(
                self::EMAIL => $email,
                'old_password' => $old_password,
                self::NEW_PASS => $new_password
            );
            $client = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $amplify_AP1_key
                ]
            ]);
            try {
                $response = $client->request('POST', $amplify_AP1_URL . '/change_password', [
                    'json' => $parm
                ]);
                $responce = $response->getBody();
                $res_arr = json_decode($responce);
                $res_status = $res_arr->status;
                if ($res_status) {
                    $arr[self::STATUS] = true;
                    $arr[self::MESSAGE] = 'Your password has been successfully updated.';
                    return json_encode($arr);

                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = 'Invalid old password.';
                    return json_encode($arr);

                }
            } catch (RequestException $e) {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::SERVER_ERROR;
                return json_encode($arr);

            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Some parameaters are missing.';
            json_encode($arr);
            return json_encode($arr);
        }
    }

    public function gerQrCode($user_id)
    {
        $users = DB::table('users')->where(self::USER_ID, '=', $user_id)->first();
        $user_arr[self::USER_ID] = $users->user_id;
        $user_arr['amplify_id'] = $users->amp_user_id;
        $user_arr[self::SOLDI_ID] = $users->soldi_id;
        $user_arr[self::USER_EMAIL] = $users->user_email;
        $user_arr['loyality_no'] = $users->user_loyalty_number;
        $user_arr['user_name'] = $users->user_first_name . ' ' . $users->user_family_name;
        $user_arr[self::COMPANY_ID] = $users->company_id;
        $user_obj = json_encode($user_arr);
        $qrCode = new QrCode();
        $qrCode
            ->setText($user_obj)
            ->setSize(150)
            ->setPadding(5)
            ->setImageType(QrCode::IMAGE_TYPE_PNG);

        // now we can directly output the qrcode
        header('Content-Type: ' . $qrCode->getContentType());
        // save it to a file
        $file_name = time() . '_' . $user_id . '_qrcode.png';
        $file = base_path() . '/public/users/qr_code/' . $file_name;
        $qrCode->save($file);
        DB::table('users')
            ->where(self::USER_ID, $user_id)
            ->update(['qr_code' => $file_name]);
        return true;
    }

    public function genratBarCode($user_id)
    {
        DB::table('users')->where(self::USER_ID, '=', $user_id)->first();
        $barcode_image_path = DNS2D::getBarcodePNGPath('barcode' . $user_id, "PDF417", 5, 3);
        $explode = explode('/', $barcode_image_path);
        $file_name = $explode[count($explode) - 1];
        DB::table('users')
            ->where(self::USER_ID, $user_id)
            ->update(['qr_code' => $file_name]);
        return true;
    }

    public function updateAllUserBarCode()
    {
        $users = DB::table('users')->where(self::COMPANY_ID, 3)->get();
        foreach ($users as $row) {
            $user_id = $row->user_id;
            $this->genratBarCode($user_id);
        }
        return 'updated';
    }

    public function getAllUserUpdate()
    {
        $users = DB::table('users')->where(self::COMPANY_ID, 3)->limit(50)->get();
        foreach ($users as $row) {
            $user_id = $row->user_id;
            if ($row->qr_code == '') {
                $this->gerQrCode($user_id);
            }
        }

    }

    public function appSkin(Request $request)
    {
        $venue_id = 132;
        $status = 1;
        $app_Skin = VenueAppSkin::where(self::IS_ACTIVE, $status)->where(self::VENUE_ID, $venue_id)->first();
        if ($app_Skin) {
            $jason_array = $app_Skin->json;
            $jason_skin = json_decode($jason_array);
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = self::DATA_FOUND;
            $arr['data'] = $jason_skin;
            return json_encode($arr);
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'No data found.';
            return json_encode($arr);
        }
    }

    public function appSkinv2(Request $request)
    {
        $venue_id = $request->venue_id;
        $status = 1;
        if (isset($request->venue_id) && $venue_id != '') {
            $app_Skin = VenueAppSkin::where(self::IS_ACTIVE, $status)->where(self::VENUE_ID, $venue_id)->first();
            if ($app_Skin) {
                $jason_array = $app_Skin->json;
                $jason_skin = json_decode($jason_array);
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $jason_skin;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'No data found.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function app_skinning_old(Request $request)
    {
        $venue_id = $request->venue_id;
        $company_id = $request->company_id;
        $user_id = $request->user_id;
        $soldi_id = $request->soldi_id;
        $status = 1;
        if (isset($request->venue_id) && $venue_id != '' && isset($request->company_id) && $company_id != '' && isset($request->user_id) && $user_id != '' && isset($request->soldi_id) && $soldi_id != '') {
            $this->applyMenualRule($venue_id, $company_id, $user_id, $soldi_id);
            $venues_img = DB::table('venue_image')->where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->where(self::STATUS, '=', 1)->first();
            if ($venues_img) {
                $app_Skin = AppSkinning::where(self::IS_ACTIVE, $status)->where(self::VENUE_ID, $venue_id)->first();
                if ($app_Skin) {
                    $venue = $this->getSingleVenue($venue_id, $company_id);

                    if ($venue[self::STATUS]) {
                        $venueArray = [];

                        foreach ($venue[self::VENUE] as $van) {
                            $venueArray[self::VENUE_ID] = $van[self::VENUE_ID];
                            $venueArray[self::VENUE_NAME] = $van[self::VENUE_NAME];
                            $venueArray[self::VENUE_DESCRIPTION] = $van[self::VENUE_DESCRIPTION];
                            $venueArray['venue_location'] = $van['venue_location'];
                            $venueArray[self::VENUE_LAT] = $van[self::VENUE_LAT];
                            $venueArray[self::VENUE_LNG] = $van[self::VENUE_LNG];
                            $venueArray[self::COMPANY_ID] = $van[self::COMPANY_ID];
                            $venueArray[self::VENUE_URL] = $van[self::VENUE_URL];
                            $venueArray[self::USER_ID] = $van[self::USER_ID];
                            $venueArray[self::CREATED_AT] = $van[self::CREATED_AT];
                        }
                        $base_path_img = config('constant.base_path_img') . self::VENUES_URL;
                        $venues_img = DB::table('venue_image')->where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                        if ($venues_img) {
                            $ven_img = $base_path_img . $venues_img->image;
                            $pay_with_points = $venues_img->pay_with_points;
                        } else {
                            $ven_img = '';
                            $pay_with_points = 0;
                        }
                        $venueArray[self::IMAGE] = $ven_img;
                        $venueArray['pay_with_points'] = $pay_with_points;
                        $venue_outputs = $this->watchtowerOutputs($venue_id, $company_id, $user_id);
                        if (@$venue_outputs->status) {
                            $venue_dataOutput = $venue_outputs->data;
                        } else {
                            $venue_dataOutput = array();
                        }

                        $jason_array = $app_Skin->json;
                        $jason_skin = json_decode($jason_array);
                        $arr[self::STATUS] = true;
                        $arr[self::MESSAGE] = self::DATA_FOUND;
                        $arr['data'] = $jason_skin;
                        $arr['venue_data'] = $venueArray;
                        $arr['out_puts'] = $venue_dataOutput;
                        return json_encode($arr);
                    } else {
                        $arr[self::STATUS] = false;
                        $arr[self::MESSAGE] = 'Serever error while feching data from watchtower.';
                        return json_encode($arr);
                    }
                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = 'No data found.';
                    return json_encode($arr);
                }
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'No data found.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function app_skinning(Request $request)
    {
        $venue_id = $request->venue_id;
        $company_id = $request->company_id;
        $user_id = $request->user_id;
        if (isset($request->venue_id) && $venue_id != '' && isset($request->company_id) && $company_id != '') {
            $base_path_img = config('constant.base_path_img') . self::VENUES_URL;
            $venue = Venue::where([self::COMPANY_ID => $company_id, "id" => $venue_id])->select(["id as venue_id", self::VENUE_NAME, self::VENUE_DESCRIPTION, "address as venue_location", self::VENUE_LAT, self::VENUE_LNG, self::VENUE_URL, self::COMPANY_ID, self::CREATED_AT, self::USER_ID, self::MOBILE, "address", "website", "additional_information", "locality"])->first();


            if ($venue) {

                if (empty($venue->venue_description)) {
                    $venue->venue_description = "";
                }
                if (empty($venue->mobile)) {
                    $venue->mobile = "";
                }
                if (empty($venue->address)) {
                    $venue->address = "";
                }
                if (empty($venue->website)) {
                    $venue->website = "";
                }
                if (empty($venue->additional_information)) {
                    $venue->additional_information = "";
                }
                if (empty($venue->locality)) {
                    $venue->locality = "";
                }
                if (empty($venue->venue_url)) {
                    $venue->venue_url = "";
                }

                $vi = VenueImage::select(["image", "pay_with_points"])->where([self::VENUE_ID => $venue->venue_id, self::COMPANY_ID => $company_id])->first();
                $venue->image = ($vi) ? $base_path_img . $vi->image : "";
                $venue->pay_with_points = ($vi) ? $vi->pay_with_points : 0;
                $sub = VenueSubscrition::where([self::USER_ID => $user_id, "venue_id" => $venue->venue_id, self::COMPANY_ID => $company_id])->first();
                $venue->subscrition = ($sub) ? 1 : 0;
                $venue->venue_description = ($venue->venue_description) ? $venue->venue_description : "";
                $venue->venue_location = ($venue->venue_location) ? $venue->venue_location : "";
                $venue->venue_url = ($venue->venue_url) ? $venue->venue_url : "";
                $venue->user_id = $user_id;
                $operating_hours = DB::table('venue_operating_hours')->where(self::VENUE_ID, $venue_id)->get();
                $final_array = array();
                if ($operating_hours) {
                    $hours = array();
                    foreach ($operating_hours as $ope_hours) {
                        $hours['day'] = $ope_hours->days;
                        $hours[self::IS_OPEN] = $ope_hours->is_open;
                        $hours[self::START_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->start_time));
                        $hours[self::END_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->end_time));
                        array_push($final_array, $hours);
                    }
                }
                $venue->operating_hours = $final_array;
                $venue_details_flag = DB::table('venue_details_flag')->where(self::VENUE_ID, $venue_id)->get();
                $venue->venue_details_flag = $venue_details_flag;
                $app_skinning = DB::table('app_skinning')->where(self::VENUE_ID, $venue_id)->first();
                if (count($app_skinning) > 0) {
                    $skin = (object)[];
                    $venue_skinArr = json_decode($app_skinning->json);

                    $bg_color_exp = explode('#', $venue_skinArr->bg_color);
                    $txt_color_exp = explode('#', $venue_skinArr->txt_color);
                    $btn_color_exp = explode('#', $venue_skinArr->btn_color);
                    $hl_color_exp = explode('#', $venue_skinArr->hl_color);
                    $low_color_exp = explode('#', $venue_skinArr->low_color);
                    $line_color_exp = explode('#', $venue_skinArr->line_color);

                    $skin->venue_logo = $venue_skinArr->venue_logo;
                    $skin->bg_color = $bg_color_exp[1];
                    $skin->txt_color = $txt_color_exp[1];
                    $skin->btn_color = $btn_color_exp[1];
                    $skin->hl_color = $hl_color_exp[1];
                    $skin->low_color = $low_color_exp[1];
                    $skin->line_color = $line_color_exp[1];
                    $venue->venue_skin = $skin;

                } else {
                    $venue->venue_skin = array(self::VENUE_LOGO => $venue->image, self::BG_COLOR => self::BLACK, self::TEXT_COLOR => self::WHITE, self::BTN_COLOR => self::GREY, self::HL_COLOR => self::GREY, self::LOW_COLOR => self::WHITE, self::LINE_COLOR => self::WHITE);
                }
                if ($venue) {
                    $arr[self::STATUS] = true;
                    $arr[self::MESSAGE] = 'Data found';
                    $arr['data'] = $venue;
                    return json_encode($arr);
                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                    return json_encode($arr);
                }
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function watchtowerOutputs($venue_id, $company_id, $user_id)
    {
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        if (isset($responce_set->company_id)) {
            $beacon_Api_key = $responce_set->beacons_api_key ?? "";
        }
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        $parm = array(
            self::VENUE_ID => $venue_id,
            self::COMPANY_ID => $company_id,
            self::USER_ID => $user_id
        );
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $beacon_Api_key
            ]
        ]);
        try {
            $response = $client1->request('POST', $Beacons_AP1_URL . '/single_venue_outputs', [
                'json' => $parm
            ]);
            $result = $response->getBody();
            return json_decode($result);
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Server error';
            return json_encode($arr);
        }
    }

    public function applyMenualRule($venue_id, $company_id, $user_id, $soldi_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'assign_manual_points', [
                'form_params' => [
                    self::VENUE_ID => $venue_id,
                    self::COMPANY_ID => $company_id,
                    self::USER_ID => $user_id,
                    self::SOLDI_ID => $soldi_id
                ]
            ]);
            $res->getBody();
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Server error';
            return json_encode($arr);
        }
    }

    public function getSingleVenue($id, $company_id)
    {
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        if (isset($responce_set->company_id)) {
            $beacon_Api_key = $responce_set->beacons_api_key ?? "";

            $client = new Client([
                'headers' => [
                    'X-API-KEY' => $beacon_Api_key
                ]
            ]);
            try {
                $response = $client->request('GET', $Beacons_AP1_URL . '/venues/id/' . $id);
                $venue_res = $response->getBody()->getContents();
                $venue = json_decode($venue_res, true);
                $venues_data = $venue['data'];
                if ($venue[self::STATUS] == 1) {
                    $arr[self::STATUS] = true;
                    $arr[self::VENUE] = $venues_data;
                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::ERROR] = 'Venue not found';
                }
            } catch (RequestException $e) {
                $arr[self::STATUS] = false;
                $arr[self::ERROR] = self::SERVER_ERROR;
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::ERROR] = self::SERVER_ERROR;
        }
        return $arr;
    }

    public function company_users(Request $request)
    {
        $company_id = $request->company_id;
        $res_users = DB::table('users')->select('amp_user_id as id', self::SOLDI_ID, 'user_first_name as first_name', 'user_family_name as last_name', 'user_email as email')->where(self::COMPANY_ID, $company_id)->get();
        if ($res_users) {
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = count($res_users) . ' users found.';
            $arr['data'] = $res_users;
            return json_encode($arr);
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'No user found.';
            return json_encode($arr);
        }
    }

    /**
     * @param Request $request
     * @return array
     * Check status of the app.
     */
    public function checkAppStatus(Request $request)
    {
        $setting = Setting::where('amplify_api_key', $request->amplify_AP1_key)->first();
        return ($setting && $setting->app_status == 1)
            ? [self::STATUS => true, self::MESSAGE => 'App is running.']
            : [self::STATUS => false, self::MESSAGE => 'App is disabled.'];
    }//..... end of checkAppStatus() ......//

    public function get_SoldiID(Request $request)
    {
        $amp_user_id = $request->amp_user_id;
        $company_id = $request->company_id;
        if ($request->has(self::AMP_USER_ID) && $amp_user_id != '' && $request->has(self::COMPANY_ID) && $company_id != '') {
            $res_users = DB::table('users')->select(self::SOLDI_ID)->where(self::AMP_USER_ID, $amp_user_id)->where(self::COMPANY_ID, $company_id)->first();

            if ($res_users) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr[self::SOLDI_ID] = $res_users->soldi_id;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'No data found.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function get_user_detail(Request $request)
    {
        $amp_user_id = $request->amp_user_id;
        $company_id = $request->company_id;
        if ($request->has(self::AMP_USER_ID) && $amp_user_id != '' && $request->has(self::COMPANY_ID) && $company_id != '') {
            $res_users = DB::table('users')->select('*')->where(self::AMP_USER_ID, $amp_user_id)->where(self::COMPANY_ID, $company_id)->first();

            if ($res_users) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $res_users;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'No data found.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

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


    public function ampDevices(Request $request)
    {

        $companyid = $request->companyid;
        $debug_mod = $request->debug_mod;
        $deviceToken = $request->deviceToken;
        $device_name = $request->device_name;
        $device_type = $request->device_type;
        $email = $request->email;
        $ip_address = $request->ip_address;
        $model = $request->model;
        $os = $request->os;
        $wdeviceType = $request->wdeviceType;
        // Amplify Api Url
        $amplify_URL = config('constant.amplify_URL');
        // Watchtower Api Url
        config('constant.Beacons_AP1_URL');

        $parm = array(
            'companyid' => $companyid,
            'debug_mod' => $debug_mod,
            'deviceToken' => $deviceToken,
            'device_name' => $device_name,
            'device_type' => $device_type,
            self::EMAIL => $email,
            'ip_address' => $ip_address,
            'model' => $model,
            'os' => $os
//            self::VENUE_ID => $venue_id,
//            'patron_id' => $patron_id
        );


        if ($companyid != '' && $deviceToken != '' && $device_name != '' && $device_type != '' && $email != '' && $wdeviceType != '') {

            $responce_set = $this->common_library->getCompanySittings($companyid);
            if ($companyid == $responce_set->company_id) {
                $amplify_api_key = $responce_set->amplify_api_key;
                $responce_set->beacons_api_key;
            } else {
                $amplify_api_key = '';
            }

            $client1 = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $amplify_api_key
                ]
            ]);
            try {
                $response = $client1->request('POST', $amplify_URL . 'api/devices', [
                    'json' => $parm
                ]);
                $divices_res = $response->getBody()->getContents();
                json_decode($divices_res);
                return $divices_res;
            } catch (RequestException $e) {

                $arr[self::STATUS] = false;
                $arr[self::ERROR] = 'Request failed on server.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function ampDevicesMultiple(Request $request)
    {
        $data = $request->data;
        $companyid = $request->companyid;
        $debug_mod = $request->debug_mod;
        $deviceToken = $request->deviceToken;
        $device_name = $request->device_name;
        $device_type = $request->device_type;
        $email = $request->email;
        $ip_address = $request->ip_address;
        $model = $request->model;
        $os = $request->os;
        $wdeviceType = $request->wdeviceType;
        // Amplify Api Url
        $amplify_URL = config('constant.amplify_URL');
        // Watchtower Api Url
        config('constant.Beacons_AP1_URL');

        $parm = array(
            'data' => json_decode($data),
            'companyid' => $companyid,
            'debug_mod' => $debug_mod,
            'deviceToken' => $deviceToken,
            'device_name' => $device_name,
            'device_type' => $device_type,
            self::EMAIL => $email,
            'ip_address' => $ip_address,
            'model' => $model,
            'os' => $os
        );

        if ($companyid != '' && $deviceToken != '' && $device_name != '' && $device_type != '' && $email != '' && $wdeviceType != '') {

            $responce_set = $this->common_library->getCompanySittings($companyid);
            if ($companyid == $responce_set->company_id) {
                $amplify_api_key = $responce_set->amplify_api_key;
                $responce_set->beacons_api_key;
            } else {
                $amplify_api_key = '';
            }

            $client1 = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $amplify_api_key
                ]
            ]);
            try {
                $response = $client1->request('POST', $amplify_URL . 'api/devices/multiple', [
                    'json' => $parm
                ]);
                $divices_res = $response->getBody()->getContents();
                json_decode($divices_res);
                return $divices_res;
            } catch (RequestException $e) {

                $arr[self::STATUS] = false;
                $arr[self::ERROR] = 'Request failed on server.';
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::PARAMS_MISSING;
            return json_encode($arr);
        }
    }

    public function dashboardSlider($company_id, $user_id)
    {
        if (!empty($company_id) && !empty($user_id)) {
            $news = News::where(self::COMPANY_ID, $company_id)->select('news_id', 'news_subject', 'news_desc', 'news_image', 'news_image_gif', 'news_tag', 'news_web_detail', 'news_url', self::CREATED_AT, 'is_public', self::VENUE_ID)->limit(4)->get();
            $res = [];
            foreach ($news as $n) {
                $news_arr = [];
                $news_arr['title'] = $n->news_subject;
                $clear = strip_tags($n->news_desc);
                $clear = html_entity_decode($clear);
                // Strip out any url-encoded stuff
                $clear = urldecode($clear);
                // Replace non-AlNum characters with space
                $clear = preg_replace('/[^A-Za-z0-9]/', ' ', $clear);
                // Replace Multiple spaces with single space
                $clear = preg_replace('/ +/', ' ', $clear);
                // Trim the string of leading/trailing space
                $clear = trim($clear);
                $trimstring = substr($clear, 0, 100);
                $news_arr['description'] = $trimstring;
                if ($company_id == 2) {
                    $news_arr[self::IMAGE] = url("public/skin_images/slider/$n->news_image_gif");
                } else {
                    $news_arr[self::IMAGE] = url("public/news/gif_images/$n->news_image_gif");
                }
                $news_arr['type'] = 'news';
                $news_arr[self::CONTENT]['news_id'] = $n->news_id;
                $news_arr[self::CONTENT]['news_subject'] = $n->news_subject;
                $news_arr[self::CONTENT]['news_desc'] = $trimstring;
                $news_arr[self::CONTENT]['news_image'] = $n->news_image;
                $news_arr[self::CONTENT]['news_tag'] = $n->news_tag;
                $news_arr[self::CONTENT]['news_web_detail'] = $n->news_web_detail;
                $news_arr[self::CONTENT]['news_url'] = $n->news_url;
                $news_arr[self::CONTENT][self::CREATED_AT] = date($n->created_at);
                $news_arr[self::CONTENT]['is_public'] = $n->is_public;
                $news_arr[self::CONTENT][self::VENUE_ID] = $n->venue_id;
                $news_arr[self::CONTENT]['news_date'] = date("d F Y", strtotime($n->created_at));
                $news_is_favourite = 0;
                $favourite_news = FavouriteNews::where('news_id', '=', $n->news_id)->where(self::USER_ID, '=', $user_id)->where(self::COMPANY_ID, $company_id)->first();
                if (!empty($favourite_news)) {
                    $news_is_favourite = $favourite_news->status;
                }
                $news_arr[self::CONTENT]['news_is_favourite'] = $news_is_favourite;
                $res[] = $news_arr;
            }
            if (!empty($res)) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = 'Data Found';
                $arr['data'] = $res;
            } else {
                $arr['data'] = $res;
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::NO_DATA_FOUND;
        }
        return $arr;
    }

    public function usersVenue($user_id, $company_id)
    {
        $sub_res = VenueSubscrition::where(self::USER_ID, $user_id)->where(self::COMPANY_ID, $company_id)->get();

        $venue_array = [];
        if ($sub_res) {
            foreach ($sub_res as $sub) {
                $venue_id = $sub->venue_id;
                $venue_res = $this->getVenueInformation($venue_id, $company_id);
                $base_path_img = config('constant.base_path_img') . self::VENUES_URL;
                if ($venue_res[self::STATUS]) {
                    $venue_data = $venue_res[self::VENUE];
                    $venues_img = DB::table('venue_image')->where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->first();

                    if ($venues_img) {
                        $ven_img = $base_path_img . $venues_img->image;
                        $venue_data->venue_id = $venue_id;
                        $pay_with_points = $venues_img->pay_with_points;
                        $venue_data->image = $ven_img;
                        $venue_data->venue_id = $venue_id;
                        $venue_data->pay_with_points = $pay_with_points;
                        $sub = VenueSubscrition::select('persona_id')->where(self::VENUE_ID, '=', $venue_id)->where(self::USER_ID, $user_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                        $venue_data->subscrition = ($sub) ? 1 : 0;
                        $venue_data->persona_id = ($sub) ? $sub->persona_id : 0;
                        $app_skinning = DB::table('app_skinning')->where(self::VENUE_ID, $venue_id)->first();
                        if (count($app_skinning) > 0) {
                            $skin = (object)[];
                            $venue_skinArr = json_decode($app_skinning->json);

                            $bg_color_exp = explode('#', $venue_skinArr->bg_color);
                            $txt_color_exp = explode('#', $venue_skinArr->txt_color);
                            $btn_color_exp = explode('#', $venue_skinArr->btn_color);
                            $hl_color_exp = explode('#', $venue_skinArr->hl_color);
                            $low_color_exp = explode('#', $venue_skinArr->low_color);
                            $line_color_exp = explode('#', $venue_skinArr->line_color);

                            $skin->venue_logo = $venue_skinArr->venue_logo;
                            $skin->bg_color = $bg_color_exp[1];
                            $skin->txt_color = $txt_color_exp[1];
                            $skin->btn_color = $btn_color_exp[1];
                            $skin->hl_color = $hl_color_exp[1];
                            $skin->low_color = $low_color_exp[1];
                            $skin->line_color = $line_color_exp[1];
                            $venue_data->venue_skin = $skin;

                        } else {
                            $venue_data->venue_skin = array(self::VENUE_LOGO => $ven_img, self::BG_COLOR => self::BLACK, self::TEXT_COLOR => self::WHITE, self::BTN_COLOR => self::GREY, self::HL_COLOR => self::GREY, self::LOW_COLOR => self::WHITE, self::LINE_COLOR => self::WHITE);
                        }

                        $operating_hours = DB::table('venue_operating_hours')->where(self::VENUE_ID, $venue_id)->get();
                        $final_array = array();
                        if ($operating_hours) {
                            $hours = array();
                            foreach ($operating_hours as $ope_hours) {
                                $hours['day'] = $ope_hours->days;
                                $hours[self::IS_OPEN] = $ope_hours->is_open;
                                $hours[self::START_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->start_time));
                                $hours[self::END_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->end_time));
                                array_push($final_array, $hours);

                            }
                        }
                        $venue_data->operating_hours = $final_array;
                        $venue_details_flag = DB::table('venue_details_flag')->where(self::VENUE_ID, $venue_id)->get();
                        $venue_data->venue_details_flag = $venue_details_flag;

                        $venue_array[] = $venue_data;

                    } else {
                        $venue_data->image = '';
                        $venue_data->pay_with_points = 0;
                        $venue_data->venue_id = $venue_id;
                        $sub = VenueSubscrition::select('persona_id')->where(self::VENUE_ID, '=', $venue_id)->where(self::USER_ID, $user_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                        $venue_data->subscrition = ($sub) ? 1 : 0;
                        $venue_data->persona_id = ($sub) ? $sub->persona_id : 0;
                        $app_skinning = DB::table('app_skinning')->where(self::VENUE_ID, $venue_id)->first();
                        if (count($app_skinning) > 0) {
                            $skin = (object)[];
                            $venue_skinArr = json_decode($app_skinning->json);

                            $bg_color_exp = explode('#', $venue_skinArr->bg_color);
                            $txt_color_exp = explode('#', $venue_skinArr->txt_color);
                            $btn_color_exp = explode('#', $venue_skinArr->btn_color);
                            $hl_color_exp = explode('#', $venue_skinArr->hl_color);
                            $low_color_exp = explode('#', $venue_skinArr->low_color);
                            $line_color_exp = explode('#', $venue_skinArr->line_color);

                            $skin->venue_logo = $venue_skinArr->venue_logo;
                            $skin->bg_color = $bg_color_exp[1];
                            $skin->txt_color = $txt_color_exp[1];
                            $skin->btn_color = $btn_color_exp[1];
                            $skin->hl_color = $hl_color_exp[1];
                            $skin->low_color = $low_color_exp[1];
                            $skin->line_color = $line_color_exp[1];
                            $venue_data->venue_skin = $skin;

                        } else {
                            $venue_data->venue_skin = array(self::VENUE_LOGO => '', self::BG_COLOR => self::BLACK, self::TEXT_COLOR => self::WHITE, self::BTN_COLOR => self::GREY, self::HL_COLOR => self::GREY, self::LOW_COLOR => self::WHITE, self::LINE_COLOR => self::WHITE);
                        }
                        $operating_hours = DB::table('venue_operating_hours')->where(self::VENUE_ID, $venue_id)->get();
                        $final_array = array();
                        if ($operating_hours) {
                            $hours = array();
                            foreach ($operating_hours as $ope_hours) {
                                $hours['day'] = $ope_hours->days;
                                $hours[self::IS_OPEN] = $ope_hours->is_open;
                                $hours[self::START_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->start_time));
                                $hours[self::END_HOURS] = date(self::FORMAT_DATE, strtotime($ope_hours->end_time));
                                array_push($final_array, $hours);
                            }
                        }
                        $venue_data->operating_hours = $final_array;
                        $venue_details_flag = DB::table('venue_details_flag')->where(self::VENUE_ID, $venue_id)->get();
                        $venue_data->venue_details_flag = $venue_details_flag;

                        $venue_array[] = $venue_data;
                    }
                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = self::SERVER_ERROR;
                    $arr['data'] = $venue_array;
                    return $arr;
                }
            }
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = 'Venues are found';
            $arr['data'] = $venue_array;
            return $arr;
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'You do not subscribed any venue.';
            return $arr;
        }
    }

    public function getVenueInformation($id, $company_id)
    {
        $venue = Venue::find($id);
        if ($venue) {
            $arr[self::STATUS] = true;
            $arr[self::VENUE] = $venue;
        } else {
            $arr[self::STATUS] = false;
            $arr[self::ERROR] = self::SERVER_ERROR;
        }
        return $arr;
    }

}
