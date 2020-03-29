<?php /** @noinspection PhpLanguageLevelInspection */

namespace App\Http\Controllers\Api;

use App\Exports\SurveyReport;
use App\Exports\UsersExport;
use App\Http\Controllers\API\ElasticSearchController;
use App\Http\Controllers\API\GamificationController;
use App\Http\Controllers\API\PaymentController;
use App\Jobs\ElasticSearchEntry;
use App\Models\AppSetting;
use App\Models\AutoCheckout;
use App\Models\AutoOrderPlacement;
use App\Models\Campaign;
use App\Models\Charity;
use App\Models\EmailTemplate;
use App\Models\FeedBack;
use App\Models\MemberTransaction;
use App\Models\MerchantStore;
use App\Models\PunchCard;
use App\Models\Segment;
use App\Models\Store;
use App\Models\Survey;
use App\Models\SurveyFront;
use App\Models\SurveyQuestion;
use App\Models\UserCharityCoins;
use App\Models\UserSurveyAnswer;
use App\Models\VenueSubscription;

use App\Models\VenueSubscription as VenueSubscrition;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use Edujugon\PushNotification\Facades\PushNotification;
use GuzzleHttp\Client;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use http\Env;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;


use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException;
use mysql_xdevapi\Exception;
use Psr\Http\Message\ResponseInterface;

use Schema;
use Image;
use App\Models\User_Card;
use App\classes\CommonLibrary;
use App\Models\Setting;
use App\Models\FavouriteNews;
use App\Models\News;
use App\UnifiedDbModels\Venue;
use App\Facade\SoldiLog;
use App\Models\VenueImage;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Matthewbdaly\SMS\Client as awsClient;
use Matthewbdaly\SMS\Drivers\Aws;

use Matthewbdaly\SMS\Drivers\Twilio;

use GuzzleHttp\Psr7\Response;
use App\Models\Sms;

class UserApiController extends Controller
{

    public $_common_library;

    public $killbill_headers = [
        "authorization: Basic Z2JrZGV2QHBsdXR1c2NvbW1lcmNlLm5ldDoxMjM0NTY3OA==",
        "cache-control: no-cache",
        "content-type: application/json",
        "x-killbill-apikey: gbkdev@plutuscommerce.net",
        "x-killbill-apisecret: gbkdev@plutuscommerce.net",
        "x-killbill-createdby: killbill"
    ];
    public $KB_HEADERS = [];
    public $KB_CLIENT;

    public function __construct()
    {
        $this->common_library = new CommonLibrary();
        $this->KB_CLIENT = (new Client([
            'auth' => [Config::get('constant.KILL_BILL_USER_NAME'), Config::get('constant.KILL_BILL_PASSWORD')],
            'headers' => [
                'Content-Type' => 'application/json',
                'x-killbill-apikey' => Config::get('constant.KILL_BILL_APIKEY'),
                'x-killbill-apisecret' => Config::get('constant.KILL_BILL_SECRET'),
                "x-killbill-createdby" => 'GBK'
            ]
        ]));
    }

    /**
     * @param Request $request
     * @return array
     * @throws \Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException
     * Register new user.
     */
    public function register(Request $request)
    {
        try {
            Log::channel('custom')->info('register_input', ['register_input' => $request->all()]);
            $check_deleted_user = User::where(["email" => $request->email])->onlyTrashed()->get();
            if($check_deleted_user->isNotEmpty()) {
                foreach ($check_deleted_user as $user) {
                    $user->forceDelete();
                }
            }
            $userExsist=User::where(["email" => $request->email,'is_active'=>0])->first();
            if($userExsist){
                $userExsist->forceDelete();
            };


            if (!$request->email)
                return ['status' => false, 'message' => 'Please enter email address'];

            if (preg_match("/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z]).*$/", $request->password) === 0)
                return ['status' => false, 'message' => "How'd you like to add some character to your password? At least one upper case, lower case and numeric, please."];

            if (!$request->phone)
                return ['status' => false, 'message' => 'Please enter your phone number'];

            if (!$request->stand_number)
                return ['status' => false, 'message' => 'Please enter stand number'];

            //check old user senario
            $old_user = User::where(["email" => $request->email, 'old_user' => 1])->first();

            if($old_user) {
                $old_user->forceDelete();
            }

            $valiadtor = Validator::make($request->all(), [
                'email' => 'unique:users',
                //'company_id' => 'required'
            ]);

            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess = '';
                foreach ($errors->get('email') as $message)
                    $mess = $message;

                foreach ($errors->get('company_id') as $message)
                    $mess = $message;


                return ['status' => false, 'message' => $mess];
            }//..... end if() .....//




            if ($request->hasFile('user_image')) {
                $user_image = time() . '_' . $request->file('user_image')->getClientOriginalName();
                $path = base_path() . '/public/users/';
                $request->file('user_image')->move($path, $user_image);
                Image::make($path . $user_image, array(
                    'width' => 200,
                    'height' => 200,
                    'grayscale' => false
                ))->save(base_path() . '/public/users/thumbs/thumb_' . $user_image);
            } else {
                $user_image = '';
            }//..... end if-else() .....//
//        $region_type = [];
//        $region_type[] = $request->company_id;
            $user = User::create([
                'user_first_name' => $request->first_name,
                'user_family_name' => $request->last_name,
                'company_id' => config('constant.COMPANY_ID'),
                'email' => $request->email,
                'user_mobile' => $request->phone,
                'dob' => ($request->dob) ? date("Y-m-d", strtotime($request->dob)) : NULL,
                'user_avatar' => $user_image,
                'soldi_id' => $request->soldi_id ?? 0,
                'is_active' => 0,
                'activation_token' => rand(1111, 9999),
                'expiry_time' => Carbon::now()->addMinute(5),
                'debug_mod' => $request->debug_mod,
                'device_type' => $request->device_type,
                'postal_code' => $request->postal_code ?? "",
                'address' => $request->address ?? "",
                'street_number' => $request->street_number ?? "",
                'street_name' => $request->street_name ?? "",
                'city' => $request->city ?? "",
                'state' => $request->state ?? "",
                'country' => $request->country ?? "",
                'gender' => $request->gender ?? '',
                'is_email' => $request->is_email ?? 0,
                'store_data' => $request->store_data ?? 0,
                'client_customer_id' => mt_rand(1000000,9999999),
                'default_venue' => 97376,
                'old_user' => false,
                'password' => Hash::make($request->password),
                'stand_number' => $request->stand_number ?? "",
                'dependents' => json_encode($request->dependents)
            ]);
            if ($user) {

                if ($request->has('pos_registration') && $request->pos_registration) {
                    $user->update([
                        'is_active' => 1,
                        'activation_token' => '',
                    ]);
                    return [
                        'status' => true,
                        'message' => "Woohoo! Your account is up and running. Let's get started.", 'user_id' => $user->user_id,

                        'data' => $user->only(['user_first_name', 'user_family_name', 'email', 'user_mobile']),
                    ];

                } else {
                    $this->sendVerificationSms($request->phone, $user->activation_token, $user->user_first_name);

                    $response = $this->checkValidReferralCode('', $request->referal_code);


                    if ($request->gender and $request->postal_code and $request->dob) {
                        $request->request->add(['venue_id' => $user->default_venue]);
                        (new GamificationController())->userOptionalFields($request, $user);
                        //(new GamificationController())->userOptionalFields($user,$request->default_venue);
                    }

                    $user = User::where('user_id',$user->user_id)->first();
                    $user->pool_ip_url = 'http://10.22.43.90:90/';
                    return [
                        'card_status' => $this->addDefaultCard($user->user_id, config('constant.IS_EWAY_PAYMENT_ENABLED')),
                        'status' => true,
                        'message' => "Woohoo! Your account is up and running. Let's get started.", 'user_id' => $user->user_id,
                        'data' => $user,
                        'referal_message' => (!$response['status']) ? '' : $response['message']
                    ];
                }
            } else {
                return ['status' => false, 'message' => 'Due to some error user not registered.'];
            }//..... end of if-else() .....//
        }
        catch (\Exception $e) {
            Log::channel('custom')->info('register_error', ['register_error' => $e->getMessage(),'register_error_line' => $e->getLine()]);
        }

    }//..... end of register() .....//


    /**
     * @param $user_id
     * @param $eway
     * @return bool|string
     *  Add Default Card for User
     */
    function addDefaultCard($user_id, $eway)
    {
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'card_name' => "Test Card " . rand(105, 999),
            'card_no' => "5105105105105100",
            'company_id' => request()->company_id,

            'cvv' => rand(101, 999),
            'expiry_month' => rand(10, 12),
            'expiry_year' => rand(19, 25),
            'is_default' => 1,
            'user_id' => $user_id
        ]);

        if ($eway) {
            $userCards = new User_Card();
            $userCards->user_id = $user_id;
            $userCards->card_no = "eCrypted:UJ7LA338ghDzsnIWl28ZijNI1bakRhxDvh7incSpj+M2J1oPPRwEfInDL0bz57VFVoePw4e46AB0ev2MvTD0ioq+uFebjrqkAn+x0I92LwuCSTaYygZ+MtczEH5ajM3PigdPo7tOQ8/4efdkwQotrK8r2FJY5gMIF1rlD+PszClPJnhz+LhX70Eo/9sTK8fzk1T1xB492+4cgg8edigTKhiQCfM6rClnHJMFJpUVEs0a4JzRx4yTisu269/l66HJQDGmwzdruXylXfYbYTpzT2a+L6Fe2TzQRZHFBXXf6rUsn4EfxnMnZB+3DXhtbvfAVWBY1ykvTKf44KwehMhhYg==";
            $userCards->last_digit = 1111;
            $userCards->card_name = 'John';
            $userCards->expiry_month = rand(10, 12);
            $userCards->expiry_year = rand(19, 25);
            $userCards->cvv = 'eCrypted:V6jztFkWLdfNfP4KS5J46X8jUGJk/vls2DHSpBwsgTCvhzJGIKK9z/NHkdWrGDd9KGVxpZ4BQhunVrwF8oTVtSELhDYi5MN/Sxuxtlz29bkz1v2dV0Ih2ZF/60l0tsCg0iRfVsN/XAqj4zUaddMMxvV8L1//3Qfi7pU+YN1srlCH2Da4Iz7yrA3rR4dDs8Gl3Wt41ROnVYDzUJf8cTYOlJJCcNjrP0VUlkWYeC15HbatjRoRKaj5qDdiKSNsHFEZVUImCRtECaoCJtEvZpadRzns56mpghqUzeLPVbHr+jz4sacR6YJWlrf38txk50L5KrT9bg7rianU0XLvNQ8QAA==';
            $userCards->card_type = 'VISA';
            $userCards->timestamps = false;
            $userCards->is_default = 1;
            $userCards->save();
            return true;
        } else {
            $res = (new StoresApiController())->addCard($req);
            return $res['status'] ? "Default Card Added successfully." : "Error occurred while adding card";
        }//..... end if-else() .....//
    }//..... end of addDefaultCard() .....//

    /**
     * @return \Psr\Http\Message\StreamInterface|string
     * @throws \GuzzleHttp\Exception\GuzzleException
     *  Get Access Token to Authorize the user
     */
    public function getAccessToken()
    {
        $client = new Client;
        $base_url = URL::to('/');
        $client_ids = DB::table("oauth_clients")->select("id", "secret")->where("password_client", "1")->first();
        if ($client_ids) {
            try {
                $res = $client->request('POST', $base_url . '/oauth/token', [
                    'form_params' => [
                        '
                        ' => 'client_credentials',
                        'client_id' => $client_ids->id,
                        'client_secret' => $client_ids->secret
                    ]
                ]);
                return $result = $res->getBody();
            } catch (RequestException $e) {
                $arr['status'] = false;
                $arr['message'] = 'Request faild.';
                return json_encode($arr);
            }
        } else {
            $arr['status'] = false;
            $arr['message'] = 'Create client for this application.';
            return json_encode($arr);
        }

    }//--- End of getAccessToken() ---//

    /**
     * @param Request $request
     * @return array|string
     *  Forgot Password for User
     */
    public function forget_password(Request $request)
    {
        if ($request->has('email') && $request->email !== "") {
            $user = User::whereEmail($request->email)->whereUserType('app')->first();
            if ($user) {

                $pin = rand(1111, 9999);
                $user->update(['activation_token' => $pin, 'expiry_time' => Carbon::now()->addMinute(5)]);
                $email_subject = 'Forgot password';
                $user_name = $user->user_first_name . ' ' . $user->user_family_name;
                $vars = ['$pincode' => $pin, '|FirstName|' => $user_name];
                $this->send_email($request->email, $user_name, $email_subject, '', $pin, 'forget_email',$vars);
                return ['status' => true, 'message' => 'Please check email to reset password.'];


            } else {
                return ['status' => false, 'message' => "Hmmm... that email address doesn't seem right. Give it another shot"];
            }//..... end of inner-if-else() .....//
        } else {
            return ['status' => false, 'message' => 'Please enter email address'];
        }//..... end if-else() .....//
    }//..... end of forget_password() .....//

    /**
     * @param Request $request
     * @return array|\Illuminate\Contracts\Routing\ResponseFactory|string|\Symfony\Component\HttpFoundation\Response
     * @throws \Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException
     *  Reset Password for Users
     */
    public function reset_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required|regex:/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/',
            // 'confirm_password' => 'required|regex:/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/',
            'pin' => 'required'
        ]);

        if ($validator->fails())
            return response($validator->errors(), 400);

        if (preg_match("/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z]).*$/", $request->password) === 0)
            return ['status' => false, 'message' => 'Password must be at least 6 characters and must contain at least one lower case letter, one upper case letter and one digit'];

        $user = User::whereEmail($request->email)->whereActivationToken($request->pin)->whereUserType('app')->first();

        if ($user) {
            if ($user->is_active == 1) {
                $user->update(['password' => Hash::make($request->password), 'activation_token' => '']);
                return ['status' => true, 'message' => 'Your password has been updated.'];
            } else {
                $user->update(['activation_token' => rand(1111, 9999), 'password' => Hash::make($request->password),
                    'updated_at' => date('Y-m-d h:i:s'), 'expiry_time' => Carbon::now()->addMinute(5)]);

                $this->sendVerificationSms($user->user_mobile, $user->activation_token, $user->user_first_name);
                return [
                    'status' => true,
                    "user_status" => "inactive",
                    "phone" => $user->user_mobile,
                    "user_id" => $user->user_id,
                    "referral_by" => $user->referral_by,
                    "first_name" => $user->user_first_name,
                    "last_name" => $user->user_family_name,
                    "is_existing_user" => 0,
                    "image" => url("/") . 'public/users/thumbs/' . $user->user_avatar,
                    "image_thumb" => url("/") . 'public/users/thumbs/thumb_' . $user->user_avatar,
                    'message' => "Your password has been updated. All that's left to do now is sign into your account."];
            }//..... end inner-if-else() .....//
        } else {
            return ['status' => false, 'message' => "Oops… Your pin code doesn't look right. Please check the code we sent you and give it another shot."];
        }//..... end if-else() ......//
    }//..... end of reset_password() .....//

    /**
     * @param Request $request
     * @return array
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        if ($request->email != '' && $request->old_password != '' && $request->new_password != '') {
            if (preg_match("/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z]).*$/", $request->new_password) === 0)
                return ['status' => false, 'message' => 'Password must be at least 6 characters and must contain at least one lower case letter, one upper case letter and one digit'];

            $user = $request->user();

            if ($user->email == $request->email) {
                if (Hash::check($request->old_password, $user->password)) {
                    $user->update(['password' => bcrypt($request->new_password)]);
                    return ['status' => true, 'message' => 'Your password has been updated successfully.'];
                } else
                    return ['status' => false, 'message' => 'Old password is incorrect.'];
            } else
                return ['status' => false, 'message' => 'Email does not match.'];
        } else
            return ['status' => false, 'message' => 'Some parameters are missing.'];
    }//..... end of changePassword() ......//

    /**
     * @param Request $request
     * @return array|string
     * @throws \Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException
     *  Update Profile of user
     */
    public function updateProfile(Request $request)
    {

        $user = User::where('user_id', $request->user_id)->first();

        Log::channel('custom')->info('User Update Profile: ', ['data' => $request->all()]);

        if (!$user)
            return ['status' => false, 'message' => 'Email does not exist.'];


        if ($user and $request->has('old_password') and $request->has('password') and $request->old_password and $request->password) {
            if (!Hash::check($request->old_password, $user->password))
                return ["status" => false, "message" => "Incorrect user password."];
            else {
                if (preg_match("/^.*(?=.{6,})(?=.*[0-9])(?=.*[a-z]).*$/", $request->password) === 0) {
                    return ['status' => false, 'message' => 'Password must be at least 6 characters and must contain at least one lower case letter, one upper case letter and one digit'];
                } else {
                    $user->password = Hash::make($request->password);
                }//..... end if-else() .....//
            }//.... end if() .....//
        }/*else{
            if (!Hash::check($request->old_password, $user->password))
                return ["status" => false, "message" => "Incorrect user password."];
        }*/

        if ($request->hasFile('user_image')) {
            if ($user->user_avatar != '') {
                @unlink(base_path() . '/public/users/' . $user->user_avatar);
                @unlink(base_path() . '/public/users/thumbs/thumb_' . $user->user_avatar);
            }//..... end if() .....//

            $user->user_avatar = rand(111, 999) * time() . '.' . $request->file('user_image')->getClientOriginalExtension();
            $path = base_path() . '/public/users/';
            $request->file('user_image')->move($path, $user->user_avatar);
            Image::make($path . $user->user_avatar, array(
                'width' => 200,
                'height' => 200,
                'grayscale' => false
            ))->save(base_path() . '/public/users/thumbs/thumb_' . $user->user_avatar);
        }//..... end if() .....//

        if ((!$user->dob and $request->dob) and (!$user->gender and $request->gender) and (!$user->postal_code and $request->postal_code)) {
            $request->request->add(['venue_id' => $user->default_venue]);
            (new GamificationController())->userOptionalFields($request, $user);
            //(new GamificationController())->userOptionalFields($user,$request->default_venue ?? $user->default_venue);
        }

        if ($request->has('first_name') and $request->first_name)
            $user->user_first_name = $request->first_name;

        if ($request->has('last_name') and $request->last_name)
            $user->user_family_name = $request->last_name;

        if ($request->has('address') and $request->address)
            $user->address = $request->address;

        if ($request->has('street_name') and $request->street_name)
            $user->street_name = $request->street_name;

        if ($request->has('city') and $request->city)
            $user->city = $request->city;

        if ($request->has('country') and $request->country)
            $user->country = $request->country;

        if ($request->has('postal_code') and $request->postal_code)
            $user->postal_code = $request->postal_code;

        if ($request->has('is_address_default') and $request->is_address_default)
            $user->is_address_default = $request->is_address_default;

        Log::channel('user')->info('User Update Request: *****************************************###********************************', [
            'user' => $user,
            'type' => $request->is_email
        ]);

        $user->subscribed_venues = NULL;

        if ($request->has('phone') and $request->phone and $user->user_mobile != $request->phone) {
            $user->fill(['activation_token' => rand(1111, 9999), 'expiry_time' => Carbon::now()->addMinute(5)]);
            $user->save();
            (new ElasticSearchController())->insertUserToES($user->user_id);

            $this->sendVerificationSms(
                $request->phone,
                $user->activation_token,
                $user->user_first_name
            );

            return [
                "status" => true,
                "user_id" => $user->user_id,
                "phone" => $request->phone,
                'data' => $user->only([
                    "user_id", "user_first_name", "user_family_name", "email",
                    "address", "street_name", "user_avatar", "city", "country",
                    "postal_code", "is_address_default", "image", "image_thumb",
                    "store_data"
                ]),
                "message" => "Please activate your account."
            ];

        }//..... end if() ......//

        $user->save();
        $user->image = url("/") . '/users/' . $user->user_avatar;
        $user->image_thumb = url("/") . '/users/thumbs/thumb_' . $user->user_avatar;

        //$this->updateSegmentJavaCall();
        Log::channel('user')->info('User Updated Information: -------------------------------', ['user' => $user]);

        (new ElasticSearchController())->insertUserToES($user->user_id);

        return [
            'status' => true,
            'message' => 'Profile has been updated Successfully',
            'user_id' => $user->user_id,
            'data' => $user->only([
                "user_id", "user_first_name", "user_family_name", "email",
                "address", "street_name", "user_avatar", "city", "country",
                "postal_code", "is_address_default", "image", "image_thumb",
                "store_data"
            ])
        ];

    }//..... end of updateProfile() .....//

    /**
     * @param $user_email
     * @param $user_name
     * @param $email_subject
     * @param $email_from
     * @param $link
     * @param $view_name
     *  Send Email to user for password recovery
     */
    /*public function send_email($user_email, $user_name, $email_subject, $email_from, $link, $view_name, $vars=[])
    {
        $html = EmailTemplate::select('html')->where('title', 'ForgotPassword')->first();
        if($html) {
            $email_from = config('constant.mail_from_address');
            if ($view_name == 'forget_email') {
                $email_subject = 'GBK Password Reset';
                $res['userName'] = $user_name;
                $res['activationLink'] = $link;

                $vars = ['$pincode' => $link, '$user_name' => $user_name];
                $html = strtr($html->html, $vars);

                $res['text'] = $html;
            } else if ($view_name == 'activate_user') {
                $email_subject = 'Activation code';
                $res['userName'] = $user_name;
                $res['activationLink'] = $link;
            } else if ($view_name == 'welcome_user') {
                $email_subject = 'GBK Team Welcome';
                $res['userName'] = $user_name;
                $html = EmailTemplate::select('html')->where('title', 'WelcomeEmail')->first();
                $vars = ['$user_name' => $user_name];
                $html = strtr($html->html, $vars);
                $res['text'] = $html;
            } else if ($view_name == 'update_password') {
                $email_subject = 'GBK Team Password Updated';
                $res['userName'] = $user_name;
                $html = EmailTemplate::select('html')->where('title', 'UpdatedPassword')->first();
                $vars = ['$user_name' => $user_name];
                $html = strtr($html->html, $vars);
                $res['text'] = $html;
            }

        Mail::send('email.' . $view_name, $res, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
            $message->to($user_email, $user_name)->subject($email_subject);
        });
        }
        else {
            Log::channel('custom')->info('Email template', ['Email template not exists' =>'Email template not exists']);
        }

    }*///..... end of send_email() .....//

    public function send_email($user_email, $user_name, $email_subject, $email_from, $link, $view_name,$vars=[])
    {
        $html='';
        if ($view_name == 'forget_email') {
            $email_subject = 'WaterCo Password Reset';
            $res['userName'] = $user_name;
            $res['activationLink'] = $link;

            $html = EmailTemplate::select('html')->where('title', 'ForgotPassword')->first();
            $html = strtr($html->html, $vars);


            $res['text'] = $html;
        } else if ($view_name == 'activate_user') {
            $email_subject = 'Activation code';
            $res['userName'] = $user_name;
            $res['activationLink'] = $link;
        } else if ($view_name == 'welcome_user') {
            $email_subject = 'WaterCo Team Welcome';
            $res['|FirstName|'] = $user_name;
            $html = EmailTemplate::select('html')->where('title', 'WelcomeEmail')->first();
            $vars = ['|FirstName|' => $user_name];
            $html = strtr($html->html, $vars);
            $res['text'] = $html;
        } else if ($view_name == 'update_password') {
            $email_subject = 'WaterCo Team Password Updated';
            $res['userName'] = $user_name;
            $html = EmailTemplate::select('html')->where('title', 'UpdatedPassword')->first();
            $vars = ['$user_name' => $user_name];
            $html = strtr($html->html, $vars);
            $res['text'] = $html;
        }
        else if ($view_name == 'referral_code') {
            $html = EmailTemplate::select('html')->where('title','ReferralFriend')->first();
            if(!$html) {
                Log::channel('custom')->info('html not exists ref', ['html not exists ref' => 'html not exists ref']);
                return false;
            }
            $html = strtr($html->html, $vars);
            $request['text'] = $html;

        }

        try {
            Log::channel('custom')->info('EMAIL TO USER', ['EMAILSUBJECT' => $email_subject,'TOEMAIL'=>$user_email]);

            $http = new \GuzzleHttp\Client();

            $response = $http->post(config('constant.JAVA_URL') . 'sendEmail', [
                'headers' => array(),
                'json' => ['from' => '', "to" => $user_email,'subject' => $email_subject, 'payload' => $html, "route" => "default"]
            ]);
            Log::channel('custom')->info('SMS Response', ['responseSmS' => json_decode($response->getBody())]);
            return true;
        } catch (\Exception $e) {
            Log::channel('custom')->info('SMS Response', ['responseSmS' => $e->getMessage()]);
            return $e->getMessage();
        }
        /*  Mail::send('email.' . $view_name, $res, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
              $message->to($user_email, $user_name)->subject($email_subject);
          });*/
    }//..... end of send_email() .....//

    /**
     * @param $id
     * @return string
     */
    public function saveCardInfo($id)
    {
        $url = self::config('constant.eway_encrypt_url');
        $credentials = self::config('constant.eway_apiencrypt');
        $data = '{
                        "Method": "eCrypt",
                        "Items": [
                            {
                                "Name": "card",
                                "Value": "' . "4444333322221111" . '"
                            },
                            {
                                "Name": "CVN",
                                "Value": "' . 123 . '"
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
        $data2 = $response;
        $data = json_decode($response);
        if (isset($data->Errors) && $data->Errors != '') {
            return "ERROR";
        } else {
            $detail = $data->Items;
            $card_num = $detail[0]->Value;
            $card_cvv = $detail[1]->Value;
        }
        $card_type = $this->creditCardType("4444333322221111");
        $last_digit = substr("4444333322221111", -4);
        $cards = new User_Card();
        $cards->user_id = $id;
        $cards->card_no = $card_num;
        $cards->card_name = "John";
        $cards->expiry_month = 12;
        $cards->expiry_year = 18;
        $cards->cvv = $card_cvv;
        $cards->card_type = $card_type;
        $cards->last_digit = $last_digit;
        $cards->is_default = 1;
        $cards->timestamps = false;
        $cards->save();
    }//--- End of saveCardInfo() ---//

    /**
     * @param Request $request
     * @return string
     */
    public function app_skinning(Request $request)
    {
        $venue_id = $request->venue_id;
        $company_id = $request->company_id;
        $user_id = $request->user_id;
        if (isset($request->venue_id) && $venue_id != '' && isset($request->company_id) && $company_id != '') {
            $base_path_img = config('constant.base_path_img') . '/public/venues/';
            $venue = Venue::where(['company_id' => $company_id, "id" => $venue_id])->select(["id as venue_id", "venue_name", "venue_description", "address as venue_location", "venue_latitude", "venue_longitude", "venue_url", "company_id", "created_at", "user_id", "mobile", "address", "website", "additional_information", "locality"])->first();

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

                $vi = VenueImage::select(["image", "pay_with_points"])->where(['venue_id' => $venue->venue_id, "company_id" => $company_id])->first();
                $venue->image = ($vi) ? $base_path_img . $vi->image : "";
                $venue->pay_with_points = ($vi) ? $vi->pay_with_points : 0;
                $sub = VenueSubscrition::where(["user_id" => $user_id, "venue_id" => $venue->venue_id, "company_id" => $company_id])->first();
                $venue->subscrition = ($sub) ? 1 : 0;
                $venue->venue_description = ($venue->venue_description) ? $venue->venue_description : "";
                $venue->venue_location = ($venue->venue_location) ? $venue->venue_location : "";
                $venue->venue_url = ($venue->venue_url) ? $venue->venue_url : "";
                $venue->user_id = $user_id;
                $operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue_id)->get();
                $final_array = array();
                if ($operating_hours) {
                    $hours = array();
                    foreach ($operating_hours as $ope_hours) {
                        $hours['day'] = $ope_hours->days;
                        $hours['is_open'] = $ope_hours->is_open;
                        $hours['start_hours'] = date("g:i a", strtotime($ope_hours->start_time));
                        $hours['end_hours'] = date("g:i a", strtotime($ope_hours->end_time));
                        array_push($final_array, $hours);
                    }
                }
                $venue->operating_hours = $final_array;
                $venue_details_flag = DB::table('venue_details_flag')->where('venue_id', $venue_id)->get();
                $venue->venue_details_flag = $venue_details_flag;
                $app_skinning = DB::table('app_skinning')->where('venue_id', $venue_id)->first();
                $skin_arr = [];
                if (!empty($app_skinning)) {
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
                    $venue->venue_skin = array('venue_logo' => $venue->image, 'bg_color' => '000000', 'txt_color' => 'FFFFFF', 'btn_color' => '5c5c5c', 'hl_color' => '5c5c5c', 'low_color' => 'FFFFFF', 'line_color' => 'FFFFFF');
                }
                if ($venue) {
                    return ["status" => true, "message" => "Data Found", "data" => $venue];
                } else {
                    return ["status" => false, "message" => "No data found"];
                }
            } else {
                return ["status" => false, "message" => "No data found"];
            }
        } else {
            return ["status" => false, "message" => "Requested parameaters are missing."];
        }
    }//---- End of app_skinning() ----//

    /**
     * @param $ccnum
     * @return string
     *  Check Credit card Type
     */
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

    /**
     * @param $company_id
     * @param $user_id
     * @return mixed
     */
    public function dashboardSlider($company_id, $user_id)
    {
        if (!empty($company_id) && !empty($user_id)) {
            $news = News::where('company_id', $company_id)->select('id as news_id', 'news_subject', 'news_desc', 'news_image', 'news_image_gif', 'news_tag', 'news_web_detail', 'news_url', 'created_at', 'is_public', 'venue_id')->limit(4)->get();
            $res = [];
            foreach ($news as $n) {
                $news_arr = [];
                $news_arr['title'] = $n->news_subject;
                $clear = strip_tags($n->news_desc);
                // Clean up things like &amp;
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
                    $news_arr['image'] = url("public/skin_images/slider/$n->news_image_gif");
                } else {
                    $news_arr['image'] = url("public/news/gif_images/$n->news_image_gif");
                }
                $news_arr['type'] = 'news';
                $news_arr['content']['news_id'] = $n->news_id;
                $news_arr['content']['news_subject'] = $n->news_subject;
                $news_arr['content']['news_desc'] = $trimstring;
                $news_arr['content']['news_image'] = $n->news_image;
                $news_arr['content']['news_tag'] = $n->news_tag;
                $news_arr['content']['news_web_detail'] = $n->news_web_detail;
                $news_arr['content']['news_url'] = $n->news_url;
                $news_arr['content']['created_at'] = date($n->created_at);
                $news_arr['content']['is_public'] = $n->is_public;
                $news_arr['content']['venue_id'] = $n->venue_id;
                $news_arr['content']['news_date'] = date("d F Y", strtotime($n->created_at));
                $news_is_favourite = 0;
                $favourite_news = FavouriteNews::where('news_id', '=', $n->news_id)->where('user_id', '=', $user_id)->where('company_id', $company_id)->first();
                if (!empty($favourite_news)) {
                    $news_is_favourite = $favourite_news->status;
                }
                $news_arr['content']['news_is_favourite'] = $news_is_favourite;
                $res[] = $news_arr;
            }//..... end foreach() .....//

            if (!empty($res))
                return ['status' => true, 'message' => 'Data Found', 'data' => $res];
            else
                return ['data' => $res, 'status' => true, 'message' => 'No data found'];
        } else {
            return ['status' => false, 'message' => 'No data found'];
        }//..... end if-else() .....//
    }//...... end of dashboardSlider() .....//

    /**
     * @param $user_id
     * @param $company_id
     * @return mixed
     */
    public function usersVenue($user_id, $company_id)
    {
        $sub_res = VenueSubscription::whereUserId($user_id)->whereCompanyId($company_id)->get();
        $venue_array = [];
        if ($sub_res->isNotEmpty()) {
            foreach ($sub_res as $sub) {
                $venue_data = Venue::find($sub->venue_id);
                $base_path_img = url('/') . '/venues/';
                $venues_img = DB::table('venue_image')->where('venue_id', '=', $sub->venue_id)->where('company_id', '=', $company_id)->first();

                if ($venues_img) {
                    $venue_data->image = $base_path_img . $venues_img->image;
                    $venue_data->pay_with_points = $venues_img->pay_with_points;
                } else {
                    $venue_data->image = '';
                    $venue_data->pay_with_points = 0;
                }//..... end if-else() .....//

                $venue_data->subscrition = 1;
                $venue_data->persona_id = $sub->persona_id ?? 0;

                $app_skinning = DB::table('app_skinning')->where('venue_id', $sub->venue_id)->first();
                if ($app_skinning) {
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
                    $venue_data->venue_skin = array('venue_logo' => $venue_data->image, 'bg_color' => '000000', 'txt_color' => 'FFFFFF', 'btn_color' => '5c5c5c', 'hl_color' => '5c5c5c', 'low_color' => 'FFFFFF', 'line_color' => 'FFFFFF');
                }//..... end if-else() .....//

                $operating_hours = DB::table('venue_operating_hours')->where('venue_id', $sub->venue_id)->get();
                $final_array = array();
                if ($operating_hours->isNotEmpty()) {
                    $hours = array();
                    foreach ($operating_hours as $ope_hours) {
                        $hours['day'] = $ope_hours->days;
                        $hours['is_open'] = $ope_hours->is_open;
                        $hours['start_hours'] = date("g:i a", strtotime($ope_hours->start_time));
                        $hours['end_hours'] = date("g:i a", strtotime($ope_hours->end_time));
                        array_push($final_array, $hours);
                    }//..... end foreach() .....//
                }//..... end if() .....//

                $venue_data->operating_hours = $final_array;
                $venue_data->venue_details_flag = DB::table('venue_details_flag')->where('venue_id', $sub->venue_id)->get();
                $venue_array[] = $venue_data;
            }//..... end foreach() .....//

            return ['status' => true, 'message' => 'Venues are found', 'data' => $venue_array];
        } else {
            return ['status' => false, 'message' => 'You do not subscribed any venue.', 'data' => []];
        }//..... end if-else() .....//
    }//..... end of userVenue() .....//

    /**
     * @param $id
     * @param $company_id
     * @return mixed
     */
    public function getVenueInformation($id, $company_id)
    {
        $venue = Venue::find($id);
        if ($venue) {
            return ['status' => true, 'venue' => $venue];
        } else {
            return ['status' => false, 'error' => 'Server error!'];
        }

    }//---- End of getVenueInformation() ----//

    /**
     * @return mixed
     */
    public function getClientId()
    {
        if (Schema::hasTable('oauth_clients')) {
            $client_ids = DB::table("oauth_clients")->select("id", "secret")->where("name", "Laravel Password Grant Client")->get();
            if ($client_ids) {
                return ['status' => true, 'cleint_data' => $client_ids];
            } else {
                return ['status' => true, 'error' => "No Record Found"];
            }
        } else {
            return ['status' => true, 'error' => "Table Not Found"];
        }
    }

    /**
     * @param string $phoneNumber
     * @param string $code
     * @param string $route
     * @return bool
     */
    public function sendSms($phoneNumber, $message, $route = null)
    {
        try {
            $sms = new Sms;
            return $sms->send($phoneNumber, $message, $route);
        }
        catch (\Exception $e) {
            Log::channel('custom')->info('sendSms(): Failed to send SMS');
            return false;
        }
    }

    /**
     * @param string $phoneNumber
     * @param string $code
     * @return bool
     */
    public function sendVerificationSms($phoneNumber, $code, $name, $route = 'default', $appName = null)
    {
        try {
            Log::channel('custom')->info('sendVerificationSms()', [
                'phoneNumber' => $phoneNumber,
                'code' => $code,
                'route' => $route
            ]);

            if (empty($appName)) {
                if (Config::get('constant.APP_SMS_NAME') != '') {
                    $appName = Config::get('constant.APP_SMS_NAME');
                } else if (Config::get('constant.APP_NAME') != '') {
                    $appName = Config::get('constant.APP_NAME');
                    $appName = str_replace($appName, 'engage-', '');
                } else {
                    $appName = "DEFAULT";
                }
            }

            $sms = new Sms();
            $result = $sms->send(
                $phoneNumber,
                sprintf("Hi %s, your activation code is %s for the %s app." .
                    " Simply enter this code and let's get started! The %s Team.",
                    $name, $code, $appName, $appName),
                $route
            );

            Log::channel('custom')->info('sendVertificationSms()', [
                'result' => $result
            ]);

            return $result;
        } catch (\Exception $e) {
            return false;
        }
    }//--- End of sendVerificationSms() ---//


    /**
     * @param Request $request
     * @return array
     * @throws DriverNotConfiguredException
     * @throws GuzzleException
     */
    public function activateUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'user_id' => 'required'
        ]);

        Log::channel('custom')->info('ACTIVATEUSER', ['ACTIVATE' => $request->all()]);
        if ($validator->fails()) {
            $errors = $validator->errors();
            foreach ($errors->get('code') as $message)
                $mess['code'] = $message;

            foreach ($errors->get('user_id') as $message)
                $mess['user_id'] = $message;

            return $mess;
        }//..... end if() .....//
        $user = User::where(['user_id' => $request->user_id, 'activation_token' => $request->code])->first();
        if ($user) {
            if ($request->code === $user->activation_token and strtotime(Carbon::now()) > strtotime($user->expiry_time))
                return ['status' => false, 'message' => "Looks like your verification code has expired. Don't panic. Simply send a new code to yourself."];
            $updateData = ['is_active' => 1, 'activation_token' => ''];
            if ($request->has("phone") && $request->phone != '')
                $updateData['user_mobile'] = $request->phone;

            //=================  create user on soldi  ==============//
            if ($request->is_existing_user == 0) {
                /*if(!$user->kill_bill_id && !$user->kilbill_ire_id) {
                     $status =(new PaymentController())->registerUserToKB($user);
                    if (!$status['status'])
                    {
                         Log::channel('user')->error('Kill bill error', ['Kill bill message' => $status['message']]);
                         return ['status' => false, 'message' => 'Please try again'];
                    }
                }*/
                $updateData['soldi_id'] = $this->createUserSoldi($user);

                $updateData['referral_code'] = $this->getReferralCode($user->user_id);
                $updateData['device_token'] = $request->device_token;
//                $updateData['device_type'] = $request->device_type;
                $updateData['debug_mod'] = $request->debug_mod;

                if ($updateData['soldi_id'] === 0) {
                    User::where(["email" => $request->email, "is_active" => 0])->delete();
                    return ['status' => false, 'message' => 'User with this Email already exists, Please use different email.'];
                }//..... end if() .....///


                if ($request->referal_code != '')
                    $this->userReferedFriendSingup($request->referal_code, $user->user_id, $user->company_id);

                /* $request->request->add(['first_attempt' => true, 'venue_id' => $user->default_venue]);
                 (new GamificationController())->userSignupMissions($request);*/

                (new GamificationController())->assignStampCardOldNewUser($user);
                //$this->updateSegmentJavaCall();

            }//..... end if() .....//
            if ($user->update($updateData)) {

                if ($request->is_existing_user == 0) {
                    Log::channel('user')->error('existing user', ['existing user' => $user]);
                    (new ElasticSearchController())->insertUserToES($user->user_id);
                    $this->send_email($user->email, $user->user_first_name . ' ' . $user->user_family_name, '', '', '', 'welcome_user');

                }

                return ['status' => true, 'message' => 'User is activated'];
                //$this->loginUser($request);
            } else
                return ['status' => false, 'message' => 'Error occurred while activating user'];
        } else
            return ['status' => false, 'message' => "Oops… Your verification code doesn't match up. Please check the code we sent you and try again."];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function codeResendUser(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'user_id' => 'required',
            'phone' => 'required'
        ]);
        if ($validate->fails()) {
            $errors = $validate->errors();
            foreach ($errors->get('user_id') as $message) {
                $mess['user_id'] = $message;
            }
            return $mess;
        }//..... end if() .....//
        $code = rand(1111, 9999);
        $user = User::find($request->user_id);
        $user->activation_token = $code;
        $user->expiry_time = Carbon::now()->addMinute(5);
        $user->save();

        $this->sendVerificationSms($request->phone, $code, $user->user_first_name);

        return ['status' => true, 'message' => 'Message sent successfully.'];

    }//..... end of codeResendUser() .....//

    /**
     * @param Request $request
     * @return array
     * @throws DriverNotConfiguredException
     */
    public function loginUser(Request $request)
    {

        $validate = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);
        if ($validate->fails()) {
            if ($validate->errors()->has('email'))
                $mess['email'] = $validate->errors()->get('email');
            if ($validate->errors()->has('password'))
                $mess['password'] = $validate->errors()->get('password');
            /*if ($validate->errors()->has('company_id'))
                $mess['company_id'] = $validate->errors()->get('company_id');*/

            return $mess;
        }//..... end if() .....//


        //check of old user
        $old_user = User::where(['email' => $request->email, "is_active" => 0, 'user_type' => 'app'])->first();
        if ($old_user) {
            if ($old_user->old_user && ($old_user->password == null or $old_user->password == '')) {
                return [
                    'data' => $old_user,
                    'access_token_info' => (object)[],
                    'status' => true,
                    'message' => '',

                ];
            }
        }

        $user = User::where(['email' => $request->email, "is_active" => 1, 'user_type' => 'app'])->first();
        try {
            if ($user) {

                if (Hash::check($request->password, $user->password)) {

                    if ($user->is_active == 1) {
                        $userCode = ($user->referral_code != '') ?
                            $user->referral_code : $this->getReferralCode($user->user_id);

                        $user->update([
                            'debug_mod' => $request->debug_mod,
                            'device_token' => $request->device_token,
                            'device_type' => $request->device_type,
                            'referral_code' => $userCode,
                        ]);

                        $accessToken = $this->getAccessTokens($user);
                        if (!isset($accessToken['access_token']))
                            return ['status' => false, 'message' => 'Error occurred while getting token.'];

                        // (new ElasticSearchController())->updateUserTokenInEs($user);

                        /**
                         * Check if user demographic data exists then
                         *  add demographic data and  update device data other wise update devices data
                         */

                        //add device_id in user object
                        $user->device_id = $request->device_id;
                        (new ElasticSearchController())->checkUserExists($user);

                        //User to killbill

                        if (!$user->kill_bill_id || !$user->kilbill_ire_id) {
                            (new PaymentController())->registerUserToKB($user);
                        }

                        $app_mode = Setting::where('company_id', '=', $user->company_id)->first();
                        $user->app_mod = $app_mode ? $app_mode->app_mode : 0;
                        $user->dob = ($user->dob) ? $user->dob : '';
                        $user->gender = ($user->gender) ? $user->gender : '';
                        $user->postal_code = ($user->postal_code) ? $user->postal_code : '';


                        $user->venue_name = $this->getVenueName($user->default_venue);

                        $user->card_data = User_Card::where(['is_default' => 1, 'user_id' => $user->user_id])->first();


                        $user->completed_profile = 100;

                        if (!$user->gender && !$user->dob)
                            $user->completed_profile = 35;

                        if ($user->food_preference) {
                            $foodPreferences = json_decode($user->food_preference, true);
                            $foodPreferences = collect($foodPreferences);
                            $user->food = array_values($foodPreferences->where('type', '=', 'food')->toArray());
                            $user->allergy = array_values($foodPreferences->where('type', '=', 'allergy')->toArray());
                        } else {
                            $user->food = [];
                            $user->allergy = [];
                        }
                        if ($user->user_favourites) {

                            $user->user_favourites = json_decode($user->user_favourites, true);
                        } else {
                            $user->user_favourites = [];
                        }
                        if ($user->dependents) {

                            $user->dependents = json_decode($user->dependents, true);
                        } else {
                            $user->dependents = [];
                        }
                        $user->pool_ip_url = 'http://10.22.43.90:90/';

                        return [
                            'data' => $user,
                            'user_cards' => User_Card::where('user_id', '=', $user->user_id)->get(),
                            'access_token_info' => $accessToken,
                            'status' => true,
                            'message' => 'Login Successfully',

                        ];
                    } else {
                        $code = rand(1111, 9999);
                        $this->sendVerificationSms($user->user_mobile, $code, $user->user_first_name . ' ' . $user->user_family_name);
                        User::where(["user_id" => $user->user_id])->update(["activation_token" => $code, 'expiry_time' => Carbon::now()->addMinute(5)]);
                        return ['status' => false, 'data' => $user, 'message' => 'Please activate your account.'];
                    }
                }
                else {
                    return ['status' => false, 'message' => "Oh oh… that's not your password. Please try again."];
                }
            } else {
                return ['status' => false, 'message' => "Hmmm… that email address doesn't seem right. Give it another shot."];
            }
        } catch (\Exception $e) {

            Log::channel('user')->error('Error Occurred: -------------------- ', ['ErrorMessage' => $e->getTrace()]);


        }
    }//--- End of loginUser() ---//

    private function getErrorsList($errors)
    {
        $message = "";
        foreach ($errors->all() as $key => $error)
            $message .= $error ? $error . ' ' : "";

        return trim($message, ' ');
    }//..... end of getErrorsList() .....//

    /**
     * @param $request
     * @return int|string
     * @throws \GuzzleHttp\Exception\GuzzleException
     * User Creation on Soldi
     */
    public function createUserSoldi($request)
    {
        try {
            $business_id = config('constant.COMPANY_ID');
            $parm = ['business_id' =>  $business_id, 'first_name' => $request->user_first_name, 'last_name' => $request->user_family_name,
                'email_address' => $request->email, 'gender' => ($request->gender == 'Male' || $request->gender == '') ? '1' : '0',
                'mobile_number' => $request->user_mobile, 'company_name' => config('constant.COMPANY_NAME'), 'land_line' => '', 'street_1' => '',
                'street_2' => '', 'suburb' => '', 'country' => $request->country, 'provice' => '', 'city' => $request->city, 'code' => $request->postal_code ?? ''];
            $client1 = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')

                ]
            ]);

            $response = $client1->request('POST', config('constant.SOLDI_DEFAULT_PATH') . 'customer/create', [
                'json' => $parm
            ]);
            $soldi_res = $response->getBody()->getContents();
            $soldi_arr = json_decode($soldi_res);

            Log::channel('user')->info('Response', ['SOLDICREATEUSERRESPONSE' => $soldi_arr]);
            if ($soldi_arr->status === 404) {
                return $soldi_arr->customer_id;
            } else {
                return $soldi_arr->data->customer_id;
            }//..... end if-else() .....//

        } catch (\Exception $e) {
            Log::channel('user')->error('Exception from user on creation soldi', ['SOLDICREATEUSER' => $e->getMessage()]);
            return $e->getMessage();
        }//..... end of try-catch() .....//
    }//..... end of createUserSoldi() .....//

    /**
     *  Send test Email
     */
    public function sendTestEmail()
    {
        $this->send_email('tassadaq.hussain@elementarylogics.com', 'test', 'test', 'acm.redemption@soldiwifi.com', 'test', 'forget_email');
    }//--- End of sendTestEmail() ---//

    /**
     * @param $user
     * @return array
     * Get User AccessToken.
     */
    private function getAccessTokens(User $user): array
    {
        return ['access_token' => $user->createToken($user->email)->accessToken];
    }//..... end of getAccessTokens() ......//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     * Auto Checkout Feature For App
     */
    public function autoCheckoutCart(Request $request)
    {
        $data = json_decode($request->product_array, true);
        $valiadtor = Validator::make($request->all(), [
            'venue_id' => 'required',
            'user_id' => 'required',
        ]);

        if ($valiadtor->fails()) {
            $errors = $valiadtor->errors();
            $mess['status'] = false;

            foreach ($errors->get('venue_id') as $message) {
                $mess['message'] = 'venue_id is missing';
                return $mess;
            }
            foreach ($errors->get('user_id') as $message) {
                $mess['message'] = 'user_id is missing';
                return $mess;
            }
        }
        Log::channel('custom')->info('Auto Checkout process started: *****************************************###********************************');

        if ($request->last_synchronise_id) {// Update
            $infoData = AutoOrderPlacement::find($request->last_synchronise_id);
            if ($infoData->operation_performed == 'auto_payment_failed' || $infoData->operation_performed == 'auto_payment_done' || $infoData->operation_performed == 'checkout' || $infoData->operation_performed == 'order_inprocess' || $infoData->operation_performed == 'is_deleted' || $infoData->operation_performed == 'cancel') {
                return ["status" => false, "message" => "No Data Found"];
            } else {
                AutoCheckout::where('user_id', $request->user_id)->delete();
                AutoCheckout::insert($data);
                $updateArray = ['user_id' => $request->user_id, 'business_id' => $request->business_id, 'order_detail' => $request->payment_parameters, 'venue_id' => $request->venue_id];
                $autoOrder = new AutoOrderPlacement();
                if (!$request->server_schedular_update) {
                    $autoOrder->whereId($request->last_synchronise_id)->update($updateArray);
                    Log::channel('custom')->info('Auto Checkout Order updated with last synchronized id: ' . $request->last_synchronise_id . ' and ', ['data' => $updateArray]);
                } else {
                    $autoOrder->timestamps = false;
                    $autoOrder->whereId($request->last_synchronise_id)->update($updateArray);
                    Log::channel('custom')->info('Auto Checkout Order updated with last synchronized id: ' . $request->last_synchronise_id . ' and ', ['data' => $updateArray]);
                }
                $statusArray = ["status" => true, "message" => "Information updated", 'last_synchronise_id' => $request->last_synchronise_id];
                //$this->backgroundThreadCall($request->business_id,$statusArray);
                $this->allBusinessOrder($request->business_id);
                return $statusArray;

            }
        } else { // Insert and delete
            if (!$data) {
                AutoCheckout::where('user_id', $request->user_id)->delete();
                $orderPlacement = AutoOrderPlacement::where('user_id', $request->user_id);
                $orderPlacement->update(['operation_performed' => 'is_deleted']);
                $statusArray = ["status" => false, "message" => "Cart is empty"];
                $this->allBusinessOrder($request->business_id);
                //$this->backgroundThreadCall($request->business_id,$statusArray);
                return $statusArray;
            }
            $data = json_decode($request->product_array, true);
            AutoCheckout::where('user_id', $request->user_id)->delete();
            AutoOrderPlacement::where('user_id', $request->user_id)->update(['operation_performed' => 'is_deleted']);
            $ordePlace = new AutoOrderPlacement();
            $ordePlace->user_id = $request->user_id;
            $ordePlace->order_detail = $request->payment_parameters;
            $ordePlace->venue_id = $request->venue_id;
            $ordePlace->business_id = $request->business_id;
            $ordePlace->updated_at = Carbon::now('UTC');
            $ordePlace->operation_performed = 'default';
            $ordePlace->save();
            $dataInsert = AutoCheckout::insert($data);
            Log::channel('custom')->info('Auto Checkout Order saved: ', ['data' => $data]);
            $dataRecieve['date'] = Carbon::now();
            $dataRecieve['id'] = $ordePlace->id;
            if ($dataInsert) {
                $statusArray = ["status" => true, "message" => "Information added successfully. There are " . AutoCheckout::where('user_id', $request->user_id)->count() . " item in the cart", 'last_synchronise_id' => $ordePlace->id];
            } else {
                $statusArray = ["status" => false, "message" => "Error while adding information"];
            }
            $this->allBusinessOrder($request->business_id);
            return $statusArray;
            //$this->backgroundThreadCall($request->business_id,$statusArray);
        }
    }//--- End of autoCheckoutCart() ---//

    /**
     * @param Request $request
     * @return array
     * Save User data to Elastic Search
     */
    public function userDataES(Request $request)
    {
        try {
            $body = ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, 'device_token' => $request->device_token, 'device_type' => $request->device_type, 'debug_mod' => $request->debug_mod];
            $http = new \GuzzleHttp\Client();
            $response = $http->post(config('contant.JAVA_URL') . 'registerUserES', [
                'headers' => array(),
                'json' => $body,
            ]);

            $d = json_decode($response->getBody());
            if ($d->status)
                return ["status" => true, "message" => "User device added successfully"];
            else
                return ["status" => false, "message" => "Invalid information is added"];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Email or password doesn't match any user to get access token."];
        }

    }//--- End of userDataES() ---//

    public function testTime()
    {
        echo Carbon::now('UTC');
    }

    /**
     * @param Request $request
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    public function user_badges(Request $request)
    {
        if ($request->has('user_id') && $request->user_id && $request->has('user_id') && $request->company_id)
            try {
                $res = (new Client())->request('POST', config('constant.loyalty_api_path') . 'user/badges', [
                    'form_params' => [
                        'user_id' => $request->user_id,
                        'company_id' => $request->company_id
                    ]
                ]);
                return $res->getBody();
            } catch (\Exception $e) {
                return ['status' => false, 'message' => 'Server error'];
            }//..... end of try-catch() .....//
        else
            return ['status' => false, 'message' => 'Requested Parameters are missing'];
    }//..... end of user_badges() .....//

    /**
     * @param Request $request
     * @return \Psr\Http\Message\StreamInterface|string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function user_tier(Request $request)
    {
        $company_id = $request->company_id;
        if ($request->has('user_id') && $request->user_id != '' && $request->has('user_id') && $company_id != '') {
            $client = new Client();
            try {
                $res = $client->request('POST', config('constant.loyalty_api_path') . 'user/tier', [
                    'form_params' => [
                        'user_id' => $request->user_id,
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


    }//--- End of user_tier() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function beaconTriggerData(Request $request)
    {
        try {
            $valiadtor = Validator::make($request->all(), [
                'make_payment' => 'required',
                'payment_type' => 'required',
                'user_id' => 'required',
            ]);
            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess['status'] = false;
                foreach ($errors->get('make_payment') as $message) {
                    $mess['message'] = 'make_payment is missing';
                    return $mess;
                }
                foreach ($errors->get('user_id') as $message) {
                    $mess['message'] = 'user_id is missing';
                    return $mess;
                }
                foreach ($errors->get('payment_type') as $message) {
                    $mess['message'] = 'payment_type is missing';
                    return $mess;
                }

            }
            $body = ['user_id' => $request->user_id, 'make_payment' => $request->make_payment, 'time' => date('h:i:s'), 'payment_type' => $request->payment_type];
            $http = new \GuzzleHttp\Client();
            $response = $http->post(config('contant.JAVA_URL') . 'make_auto_payment', [
                'headers' => array(),
                'json' => $body,
            ]);

            $d = json_decode($response->getBody());
            if ($d->status)
                return ["status" => true, "message" => $d->message];
            else
                return ["status" => false, "message" => $d->message];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }

    }//--- End of beaconTriggerData() ---//

    /**
     * @param Request $request
     * @return array
     * @throws GuzzleException
     */
    public function userActivityVouchers(Request $request)
    {

        Log::channel('custom')->info(['request data' => $request->all()]);
        $user = User::where('user_id', $request->user_id)->first();
        //$user = $request->user();


        $start_date = $request->start_date ?? "";
        $end_date = $request->end_date ?? "";
        $start_date = $start_date ? gmdate("Y-m-d", $start_date) : "";
        $end_date = $end_date ? gmdate("Y-m-d", $end_date) : "";

        try {
            $valiadtor = Validator::make($request->all(), [
                'venue_id' => 'required',
                'user_id' => 'required',
            ]);
            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess['status'] = false;
                foreach ($errors->get('venue_id') as $message) {
                    $mess['message'] = 'venue_id is missing';
                    return $mess;
                }
                foreach ($errors->get('user_id') as $message) {
                    $mess['message'] = 'user_id is missing';
                    return $mess;
                }
            }

            $body = ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, "company_id" => $request->company_id];


            $voucherQuery = ["query"=>["bool"=> ["must"=> [["match"=>["custom_doc_type"=> Config::get('constant.user_integrated_voucher')]],["match"=>["persona_id" =>$user->user_id]]]]]];

            $voucherActivtiy =(new ElasticsearchUtility())->getSource(Config::get('constant.ES_INDEX_BASENAME'),$voucherQuery);

            $new_array = [];
            foreach ($voucherActivtiy as $voucher) {
                $check_punch = '';
                $camp = '';
//                if($voucher['company_id'] == 0) {
//                    $check_punch = PunchCard::where('id',$voucher['from_punch_card'])->first();
//
//
//                }
                //else {
                $camp = Campaign::where('id',$voucher['campaign_id'])->first();
                //}

                if(strtotime(date('Y-m-d H:i:s')) < strtotime($voucher['voucher_end_date']) && ($voucher['uses_remaining']) > 0 && $camp != null) {
                    $voucher['date'] = strtotime($voucher['voucher_start_date']);
                    $voucher['type'] = 'voucher';
                    //$voucher['voucher_code'] = $voucher['pos_ibs'].$voucher['voucher_code'];
                    $new_array[] = $voucher;

                }
            }
            /**
             *  Getting User Transaction data from SOLDI POS
             */
            $req = new \Illuminate\Http\Request();
            $req->replace(['business_id' => $request->business_id, 'customer_id' => $user->soldi_id, 'company_id' => $user->company_id, 'amplify_id' => $user->amplify_id, 'page' => $request->page, 'start_date' => $request->start_date, 'end_date' => $request->end_date]);
            $data = (new StoresApiController())->customer_orders($req);
            if (isset($data['data'])) {
                $data['data'] = json_encode($data['data']);
                $data['data'] = json_decode($data['data'], true);
                foreach ($data['data'] as $transaction) {
                    $transaction['date'] = $transaction['ord_date'];
                    $transaction['sortDate'] = strtotime(str_replace(',', '', $transaction['ord_date']));
                    $transaction['type'] = 'transaction';
                    $new_array[] = $transaction;
                }
            }
            array_multisort(array_column($new_array, 'date'), SORT_DESC, $new_array);

            return ['status' => true, 'message' => 'Data Found', 'data' => collect($new_array)->sortByDesc('sortDate')->toArray() ?? []];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }


    public function userLogout(Request $request)
    {
        if (!$request->device_id) {
            return ['status' => false, 'message' => "Please provide device id"];
        }
        if ($request->user()) {
            Log::channel('custom')->info('print device id : ', ['print device id' => $request->device_id]);
            $query = [
                'bool' => [
                    'must' => [
                        ['match' => ['device_name' => $request->device_id]],
                        ["match" => ["custom_doc_type" => config('constant.persona_devices')]],
                        ["match" => ["persona_id" => $request->user()->user_id]],
                        ["match" => ["company_id" => request()->header('Country') == 'uk' ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID')]]


                    ]
                ]
            ];
            ElasticsearchUtility::deleteByQuery(config('constant.ES_INDEX_BASENAME'), '', '', $query);
            $request->user()->token()->revoke();
            return ['status' => true, 'message' => 'successfully logout'];
        } else
            return ['status' => false, 'message' => 'Please provide user identity'];
    }

    /**
     * @param $business_id
     * @return array|bool
     * @throws GuzzleException
     * Notify Soldi POS about auto checkout cart.
     */
    private function allBusinessOrder($business_id)
    {
        try {
            $store = Store::where("pos_store_id", $business_id)->first();
            (new Client())->request('get', config('constant.SOLDI_DEFAULT_PATH') . '/notification/allbusinessorders?business_id=' . $business_id, [
                'headers' => [
                    'X-API-KEY' => $store->soldi_api_key ?? null,
                    'SECRET' => $store->soldi_secret ?? null
                ]
            ]);

            return true;
        } catch (\Exception $e) {
            return ['status' => true, 'message' => $e->getMessage()];
        }//..... end of try-catch() .....//
    }//.....end of allBusinessOrder() .....//


    /**
     * @param $user_id
     * @return array|void
     */
    private function registerToJava($user_id)
    {
        try {
            $body = ['user_id' => $user_id];

            $http = new \GuzzleHttp\Client();
            $response = $http->post(config('contant.JAVA_URL') . 'registerUserElasticSearchVenues', [
                'headers' => array(),
                'json' => $body,
            ]);
            return;
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//--- End of registerToJava() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function listPunchCard(Request $request)
    {
        try {
            $valiadtor = Validator::make($request->all(), [
                'venue_id' => 'required',
                'user_id' => 'required',
                'company_id' => 'required'
            ]);

            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess['status'] = false;
                foreach ($errors->get('venue_id') as $message) {
                    $mess['message'] = 'venue information is missing';
                    return $mess;
                }
                foreach ($errors->get('user_id') as $message) {
                    $mess['message'] = 'user information is missing';
                    return $mess;
                }
                foreach ($errors->get('company_id') as $message) {
                    $mess['message'] = 'company information  is missing';
                    return $mess;
                }
            }//.... end if() .....//

            $dataArray = ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, 'company_id' => $request->company_id];

            if ($request->has('business_id'))
                $dataArray = ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, 'company_id' => $request->company_id, 'business_id' => $request->business_id];

            $response = (new Client())->post(config('constant.JAVA_URL') . 'punchCardListing', [
                'headers' => array(),
                'json' => $dataArray,
            ]);

            $dd = json_decode($response->getBody());

            if ($dd->status)
                return ["status" => true, "message" => "Successfully get punch card", "body" => $dd->body ?? []];
            else
                return ["status" => false, "message" => "Invalid information is added", 'body' => []];
        } catch (\Exception $e) {
            return ['status' => true, 'message' => $e->getMessage()];
        }//.... end of try-catch() .....//
    }//--- End of listPunchCard() ---//

    /**
     * @param Request $request
     * @return array
     */
    function updateUserAddress(Request $request)
    {
        $valiadtor = Validator::make($request->all(), [
            'postal_code' => 'required',
            'address' => 'required',
            'street_number' => 'required',
            'street_name' => 'required',
            'city' => 'required',
            'state' => 'required',
            'user_id' => 'required',

        ]);

        if ($valiadtor->fails()) {
            $errors = $valiadtor->errors();
            $mess['status'] = false;
            foreach ($errors->get('postal_code') as $message) {
                $mess['message'] = 'postal code is required';
                return $mess;
            }
            foreach ($errors->get('address') as $message) {
                $mess['message'] = 'Address is required';
                return $mess;
            }
            foreach ($errors->get('street_number') as $message) {
                $mess['message'] = 'Street number is required';
                return $mess;
            }

            foreach ($errors->get('street_name') as $message) {
                $mess['message'] = 'Street name is required';
                return $mess;
            }

            foreach ($errors->get('city') as $message) {
                $mess['message'] = 'City name is required';
                return $mess;
            }

            foreach ($errors->get('state') as $message) {
                $mess['message'] = 'State is required';
                return $mess;
            }

            foreach ($errors->get('country') as $message) {
                $mess['message'] = 'Country is required';
                return $mess;
            }

        }//.... end if() .....//
        User::whereUserId($request->user_id)->update([
            'postal_code' => $request->postal_code ?? "",
            'address' => $request->address ?? "",
            'street_number' => $request->street_number ?? "",
            'street_name' => $request->street_name ?? "",
            'city' => $request->city ?? "",
            'state' => $request->state ?? "",
            'country' => $request->country ?? "",
        ]);
        return ["status" => true, "message" => "User info updated successfully"];
    }


    public function check_env()
    {

        echo '<pre>';
        $data = file_get_contents(base_path('/.env'));
        print_r($data);
        echo "=================================================================";
        echo "SOLDI_DEFAULT_PATH        =" . config('constant.SOLDI_DEFAULT_PATH') . "<br>";
        echo "LOYALTY_DEFAULT_PATH      =" . config('constant.LOYALTY_DEFAULT_PATH') . "<br>";
        echo "JAVA_URL                  =" . config('contant.JAVA_URL') . "<br>";
        echo "LOYALTY                   =" . config('constant.LOYALTY') . "<br>";
        echo "SOLDI_API_KEY             =" . config('constant.SOLDI_API_KEY') . "<br>";
        echo "SOLDI_SECRET              =" . config('constant.SOLDI_SECRET') . "<br>";
        echo "CLIENT_ID                 =" . config('constant.CLIENT_ID') . "<br>";
        echo "CLIENT_SECRET             =" . config('constant.CLIENT_SECRET') . "<br>";
        echo "JAVA_ACTIVEMQ_URL         =" . config('constant.JAVA_ACTIVEMQ_URL') . "<br>";
        echo "JAVA_CAMPAIGN_TEST_URL    =" . config('constant.JAVA_CAMPAIGN_TEST_URL') . "<br>";
        echo "ES_URL                    =" . config('constant. ES_URL') . "<br>";
        echo "SOLDI_IRE_APIKEY          =" . config('constant.SOLDI_IRE_API_KEY') . "<br>";
        echo "SOLDI_IRE_SECRET          =" . config('constant.SOLDI_IRE_SECRET') . "<br>";
        echo "Knox_X_API_KEY            =" . config('constant.Knox_X_API_KEY') . "<br>";
        echo "Knox_Secret               =" . config('constant.Knox_Secret') . "<br>";
        echo "ES_INDEX_BASENAME               =" . config('constant.ES_INDEX_BASENAME') . "<br>";
    }


    /**
     * @param $user
     * @param $index
     * @param string $token
     * @return mixed
     * Update user token
     */
    private function updateUserTokenInEs($user, $index, $token = '')
    {
        (new ElasticSearchController())->registerUserDevice($index, [
            'debug_mod' => $user->debug_mod ?? "",
            'persona_device_token' => $user->device_token ?? "",
            'persona_device_type' => $user->device_type ?? "",
            'custom_doc_type' => config('constant.persona_devices'),
            'persona_id' => $user->user_id,
            'id' => $user->user_id . "_" . config('constant.persona_devices')
        ]);

        return true;
    }//..... end of updateUserToken() .....//

    /**
     * @param int $user_id
     * @return string
     */

    public function getReferralCode($user_id = 0)
    {
        $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $res = "";
        if (strlen($user_id) > 6) {
            for ($i = 0; $i < 4; $i++)
                $res .= $chars[mt_rand(0, strlen($chars) - 1)];

            $user_id = $res;
            $res = '';
        }

        for ($i = 0; $i < 6 - strlen($user_id); $i++)
            $res .= $chars[mt_rand(0, strlen($chars) - 1)];

        $code = str_split($res, 3);
        $first = $code[0] ?? '';
        $second = $code[1] ?? '';
        return $first . $user_id . $second;
    }//---- end of function getReferralCode() ----//

    /**
     * @param Request $request
     * @return array
     * @throws DriverNotConfiguredException
     */
    public function refferalFriend(Request $request)
    {
        try {
            $valiadtor = Validator::make($request->all(), [
                'referral_code' => 'required'
            ]);

            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess['status'] = false;
                foreach ($errors->get('referral_code') as $message) {
                    $mess['message'] = 'Reffer code is missing';
                    return $mess;
                }
            }//.... end if() .....//
            /*if()*/
            $user = request()->user();
            //$transaction = MemberTransaction::where('user_id',$user->user_id)->first();
            $refferee = User::where('referral_code', $request->referral_code)->first();

            if ($refferee && $user->referral_code != $request->referral_code) {
                if ($user->referal_by == $request->referral_code)
                    return ['status' => false, 'message' => "You've already used the code."];

                $user->referal_by = $request->referral_code;
                $user->save();
                $punchCard = PunchCard::where('redemption_type', 'transaction_value')->first();

                if ($punchCard) {
                    $requestParam = new \Illuminate\Http\Request();
                    $requestParam->setMethod('POST');

                    $requestParam->request->add(["company_id" => (request()->header('region') == 'uk') ? \config('constant.COMPANY_ID') : \config('constant.COMPANY_IRE_ID'), "venue_id" => "295255", "punch_card_id" => $punchCard->id, "user_id" => $user->user_id, "mrcht_id" => "0", "punch_count" => 1]);

                    $this->punchCardStamp($requestParam);

                    $requestParam->request->replace(["company_id" => (request()->header('region') == 'uk') ? \config('constant.COMPANY_ID') : \config('constant.COMPANY_IRE_ID'), "venue_id" => "295255", "punch_card_id" => $punchCard->id, "mrcht_id" => "0", "punch_count" => 1, 'user_id' => $refferee->user_id]);
                    $this->punchCardStamp($requestParam);
                }
                return ['status' => true, 'message' => 'user data updated succesfully'];
            }
            //return ['status' => false, 'message' => ($user->referral_code == $request->referral_code) ? "You can't refer yourself" : ((!$transaction)?'Please make transaction first':'Refferal code is not valid')];
            return ['status' => false, 'message' => ($user->referral_code == $request->referral_code) ? "You can't refer yourself" : 'Refferal code is not valid'];

        } catch (\Exception $e) {
            return ['status' => false, 'message' => 'Error Occurred while saving data'];

        }

    }//--- End of refferalFriend() ----//

    /**
     * @param $user_email
     * @param $user_name
     * @param $email_subject
     * @param $email_from
     * @param $link
     * @param $view_name
     *  Send Email to user for Referral Friend
     */
    public function sendRefferalEmail($request, $type = 'referral', $user)
    {
        if ($type == 'referral') {

            $email_from = config('constant.mail_from_address');
            $user_email = $request['reffered_email'];
            $user_name = $request['reffered_name'];
            $request['first_name'] = $user->user_first_name;
            $request['refferee_name'] = $user->user_first_name . ' ' . $user->user_family_name;
            $html = EmailTemplate::select('html')->where('title', 'ReferralFriend')->first();
            $vars = ['$reffered_name' => $request['reffered_name'], '$refferee_name' => $user->user_first_name . ' ' . $user->user_family_name, '$first_name' => $user->user_first_name, '$referral_code' => $request['referral_code'], '$imageUrl' => URL::to('/uploads/logo.png')];
            $html = strtr($html->html, $vars);
            $request['text'] = $html;

            $email_subject = 'Referred by friend ' . $user->user_first_name . ' ' . $user->user_family_name;
            $viewName = 'email.referral_code';
        } else if ($type == 'welcome') {
        } else {
            $user_email = $request['email'];
            $email_from = config('constant.mail_from_address');
            $user_name = $request['user_name'];
            $email_subject = 'Inquiry from ' . $request['user_name'] . ' about ' . $request['category'];
            $viewName = 'email.feed_back';
            $request = $request->toArray();
            $html = EmailTemplate::select('html')->where('title', 'FeedBack')->first();
            $vars = ['$user_name' => $request['user_name'], '$category' => $request['category'], '$notes' => $request['notes'], '$user_email' => $user->email, '$phoneNumber' => $request['phoneNumber'], '$imageUrl' => URL::to('/uploads/logo.png'), '$app_name' => $request['app_name'], '$app_version' => $request['app_version'], '$device_model' => $request['device_model'], '$venue_name' => $request['venue_name']];
            $html = strtr($html->html, $vars);
            $request['text'] = $html;
        }

//        Mail::send($viewName, $request, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
//            $message->to($user_email, $user_name)->subject($email_subject);
//        });
    }//..... end of sendRefferalEmail() .....//

    /**
     * @param string $phoneNumber
     * @param string $code
     * @param string $name
     * @return bool
     */
    public function sendReferalSms($request, $user)
    {
        try {
            $result = $this->sendSms(
                $request['reffered_phone'],
                printf("%s wants you to check out this app that supports local community groups when you shop. Use code %s at sign up",
                    $user->user_first_name . ' ' . $user->user_family_name, $request['referral_code']
                ),
                'default'
            );

            return $result;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * @param $referal_code
     * @param $userID
     * @param $company_id
     * @throws GuzzleException
     */
    public function userReferedFriendSingup($referal_code, $userID, $company_id)
    {

        $user = User::where('referral_code', $referal_code)->first();

        Log::channel('custom')->info('Refe : ', ['data' => $referal_code]);
        if ($user) {
            User::whereUserId($userID)->update(['referal_by' => $referal_code]);
            $this->addReferralUserCoins($user, $company_id);
            $this->addReferredUserCoins($userID, $company_id);
            $response = $this->sendReferralVouchers([(string)$user['user_id']]);
            Log::channel('custom')->info('Response from JAVA : ', ['data' => $response]);


            return;
        }
    }//---- End of userReferedFriendSingup() ----//

    /**
     * @param string $device_token
     * @return mixed
     */
    public function sendPushNotificationIos($device_token, $coins = 5, $msg)
    {
        $app_setting = AppSetting::where('company_id', config('constant.COMPANY_ID')->where('key', 'refer_friend_title'))->first();
        Log::channel('custom')->info('Push ios : ', ['data' => $msg, 'device_token' => $device_token, 'coins' => $coins]);
        $push = new \Edujugon\PushNotification\PushNotification('apn');
        $data = $push->setMessage([
            'aps' => [
                'alert' => [
                    'title' => $app_setting != null ? $app_setting->value : 'Refer Friend',
                    'body' => $msg . ' You Earned ' . $coins . ' coins which has been added to your account.'
                ],
                'sound' => 'default',
                'badge' => 1
            ]
        ])->setDevicesToken([(string)$device_token])
            ->send()
            ->getFeedback();
        Log::channel('custom')->info('Logs  : ', ['data' => $data]);
        return $data;

    }//---- End of sendPushNotificationIos() ----//

    /**
     * @param string $deviceToken
     * @return mixed
     */
    private function sendPushNotificationAndroid($deviceToken = '', $coins = 5, $msg = '')
    {
        Log::channel('custom')->info('Push Android : ', ['data' => $msg, 'device_token' => $deviceToken, 'coins' => $coins]);
        $push = new \Edujugon\PushNotification\PushNotification();
        $data = $push->setMessage([
            'notification' => [
                'title' => 'Referral Friend',
                'sound' => 'default'
            ],
            'data' => [
                'message' => $msg . ' You Earned ' . $coins . ' coins which has been added to your account.',
                'content' => ['message' => $msg . ' You Earned ' . $coins . ' coins which has been added to your account.', 'notification_type' => 'referral_friend']
            ]


        ])->setDevicesToken([(string)$deviceToken])
            ->send()
            ->getFeedback();
        Log::channel('custom')->info('Logs  : ', ['data' => $data]);
        return $data;
    }//---- End of sendPushNotificationAndroid() ----//

    /**
     * @param Request $request
     */
    public function sendTestPush(Request $request)
    {
        if ($request->device_type == 'ios')
            dd($this->sendPushNotificationIos($request->device_token, '', ''));
        else
            dd($this->sendPushNotificationAndroid($request->device_token, '', ''));
    }

    private function addReferredUserCoins($userId, $companyID)
    {

        $user = User::where('user_id', $userId)->first();
        $data = Setting::where(['field1' => $user['default_venue'], 'type' => 'referral'])->first();
        if ($data) {
            $count = json_decode($data['remarks']);
            $count = $count->referral_points;
            if ($user['device_type'] == 'ios')
                $response = $this->sendPushNotificationIos($user['device_token'], $count, 'Welcome to GBK.');
            else
                $response = $this->sendPushNotificationAndroid($user['device_token'], $count, 'Welcome to GBK.');

            $count = 10;
            if ($user['device_type'] == 'ios')
                $response = $this->sendPushNotificationIos($user['device_token'], $count, 'Welcome to GBK.');
            else
                $response = $this->sendPushNotificationAndroid($user['device_token'], $count, 'Welcome to GBK.');

            Log::channel('user')->info('Push Notification Referred Friend : ', ['data' => $response]);
            for ($i = 0; $i < $count; $i++) {
                UserCharityCoins::create(['user_id' => $userId, 'coins' => 1, 'company_id' => $companyID, 'venue_id' => $user['default_venue'] ?? '']);

            }


            return;
        }//---- End of addUserCoins() ----//
    }

    /**
     * @param $user
     * @param $companyID
     * @throws GuzzleException
     */
    private function addReferralUserCoins($user, $companyID)
    {

        $count = 10;
        if ($user['device_type'] == 'ios')
            $response = $this->sendPushNotificationIos($user['device_token'], $count, config('constant.REFER_FRIEND_BODY'));
        else
            $response = $this->sendPushNotificationAndroid($user['device_token'], $count, config('constant.REFER_FRIEND_BODY'));

        Log::channel('user')->info('Push Notification Referral Friend : ', ['data' => $response]);
        for ($i = 0; $i < $count; $i++) {
            UserCharityCoins::create(['user_id' => $user['user_id'], 'coins' => 1, 'company_id' => $companyID, 'venue_id' => $user['default_venue'] ?? '']);


        }

        return;
    }//--- End of addReferralUserCoins() ----//

    /**
     * @param Request $request
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    public function punchCardStamp(Request $request)
    {
        try {
            Log::channel('custom')->info('Request for Assign Punch Card', ['PunchCardRequest' => $request->all()]);
            return (new Client(['headers' => []]))
                ->request('POST', config('constant.JAVA_URL') . 'assignPunchCardStamp', [
                    'json' => $request->all()
                ])->getBody();
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }

    /**
     * @param array $data
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws GuzzleException
     */
    private function sendReferralVouchers($data = [])
    {
        try {
            return (new Client(['headers' => []]))
                ->request('POST', config('contant.JAVA_URL') . 'assignReferral', [
                    'json' => ['users_ids' => $data]
                ])->getBody();
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//---- End of sendReferralVouchers() ----//

    /**
     * @param $default_venue
     * @param $referal_code
     * @return array
     */
    private function checkValidReferralCode($default_venue, $referal_code)
    {
        if (!$referal_code)
            return ['status' => false];

        $user = User::where('referral_code', $referal_code)->first();
        if (!$user)
            return ['status' => false];

        $tokens = Setting::where('field1', $default_venue)->first();
        if ($tokens) {
            $tokens = json_decode($tokens['remarks']);
            return ['status' => true, 'message' => 'You have earned yourself ' . $tokens->referred_points . ' Tokens to donate to a charity of your choice'];
        }
    }//--- End of checkValidReferralCode() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function userFeedBack(Request $request)
    {
        $user = request()->user();

        if ($request->has('resturant_email') && $request->resturant_email) {
            $request->merge(['app_name' => $request->resturant, 'email' => $request->resturant_email]);
            $this->sendRefferalEmail($request, $type = 'feedback');

        }


        $this->sendRefferalEmail($request, $type = 'feedback', $user);
        FeedBack::create([
            'venue_id' => $request->venue_id ?? '',
            'notes' => $request->notes ?? '',
            'user_id' => $request->user_id ?? '',
            'type' => $request->type ?? '',
            'category' => $request->category ?? '',

            'resturant' => $request->resturant ?? '',
            'ratings' => $request->resturant ?? 0,

        ]);
        return ['status' => true, 'message' => "Thanks for reaching out to us, we love feedback! Don't worry you'll hear from us soon."];
    }

    /**
     * @param $charity_id
     * @return mixed
     */
    private function getCharityName($charity_id)
    {
        $charityName = Charity::whereId($charity_id)->get(['charity_name']);
        return ($charityName->isNotEmpty()) ? $charityName[0]->charity_name : '';
    }//---- End of userFeedBack();


    /**
     * @param $dependents
     * @param $user_id
     */
    private function addUserDependents($dependents, $user_id, $user)
    {
        Log::channel('user')->info('User Dependents : ', ['data' => $dependents]);
        $venue = Venue::where('company_id', $user->company_id ?? $user['company_id'])->first();
        $dependentsArray = json_decode($dependents);
        if (empty($dependentsArray))
            return true;

        if (!$user->is_completed) {
            (new StoresApiController())->userLoyaltyReward($user, $venue->venue_id ?? $venue['venue_id']);
            $completed = json_decode($user->completed_steps);
            $completed->optional_field = 1;
            $user->completed_steps = json_encode($completed);
            $user->is_completed = 1;
            $user->save();
        }

        foreach (json_decode($dependents) as $users)
            UserDependent::updateOrCreate(['id' => $users->id], [
                'first_name' => $users->first_name ?? '',
                'last_name' => $users->last_name ?? '',
                'dob' => ($users->dob) ? Carbon::parse($users->dob)->format('Y-m-d') : '',
                'user_id' => $user_id
            ]);

    }//---- End of addUserDependents() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function updateMenuFilters(Request $request)
    {
        $user = $request->user();

        $filterMenues = json_decode($user->menue_filters);
        $filterMenues->Gluten_Free = $request->gluten_free ?? $filterMenues->Gluten_Free;
        $filterMenues->Lactose_Free = $request->lactose_free ?? $filterMenues->Lactose_Free;
        $filterMenues->Soya_Free = $request->soya_free ?? $filterMenues->Soya_Free;
        $filterMenues->Egg_Free = $request->egg_free ?? $filterMenues->Egg_Free;

        $user->menue_filters = json_encode($filterMenues);
        $user->save();

        return ['status' => true, 'message' => 'Filters updated successfully', 'data' => $user->only(["menue_filters"])];
    }//---- End of updateMenuFilters() ----//

    //
    private function getVenueName($venue_id)
    {
        if ($venue_id == 0 || $venue_id == "")
            return "";
        $venue = Venue::whereVenueId($venue_id)->first();
        return $venue ? $venue->venue_name : "";
    }//---- End of getVenueName();

    public function testBulkEmails()
    {
        $user_email = ['naqeebonline@gmail.com', 'tassadaqhussain339@gmail.com', 'aliha.tayyab.el@gmail.com'];
        foreach ($user_email as $users) {

            $email_from = config('constant.mail_from_address');
            $user_name = 'test';
            $email_subject = 'Inquiry from  about';
            $viewName = 'email.bulk';
//            Mail::send($viewName, ['data' => 'Hi User ' . $users], function ($message) use ($email_from, $users, $user_name, $email_subject) {
//                $message->to($users, $user_name)->subject($email_subject);
//            });
        }
    }

    /**
     * @param $user_id
     * @return array|void
     */
    public function beaconProximity(Request $request)
    {
        try {
            Log::channel('proximity')->info('Proximity Input : ', ['data' => $request->all()]);
            $data = ['beacons_data' => json_decode($request->beacons_data, true), 'company_id' => $request->company_id, 'user_id' => $request->user_id];
            Log::channel('proximity')->info('Forwarding data to java : ', $data);
            $http = new \GuzzleHttp\Client();
            $response = $http->post(config('constant.JAVA_ACTIVEMQ_URL'), [
                'headers' => ['campaign_type' => 'PROXIMITY_CAMPAIGN'],
                'json' => $data,
            ]);
            return $response->getBody()->getContents();
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//--- End of beaconProximity() ---//

    public function tetCheck()
    {
        dd($this->getReferralCode(12));
    }

    /**
     * @param Request $request
     * @return array
     */


    public function updateNotifications(Request $request)
    {
        $user = $request->user();

        switch ($request->notification_type) {
            case 'app_notification':
                return $this->appNotifications($user, $request->all());
                break;
            case 'marketing_notification':
                return $this->marketingNotifications($user, $request->all());
                break;
            case 'rewards_notification':
                return $this->rewardNotifications($user, $request->all());
                break;
            default:
                return ['status' => false, 'message' => 'Enter valid type for update'];
        }
    }//---- End of updateNotifications() ----//

    /**
     * @param $user
     * @param $request
     * @return array
     */
    private function appNotifications($user, $request)
    {
        $appNotifications = json_decode($user->wimpy_app_notification);
        $appNotifications->Sms = $request['sms'] ?? $appNotifications->Sms;
        $appNotifications->Email = $request['email'] ?? $appNotifications->Email;
        $appNotifications->Push = $request['push'] ?? $appNotifications->Push;
        $user->wimpy_app_notification = json_encode($appNotifications);
        $user->subscribed_venues = NULL;
        $user->save();

        $this->registerUserToElasticSearch($user);// Update data to elasticsearch ......
        return ['status' => true, 'message' => 'App Notifications Updated Successfully', 'data' => $user->only(["wimpy_app_notification"])];
    }//----- End of appNotifications() ----//

    /**
     * @param $user
     * @param array $all
     * @return array
     */
    private function marketingNotifications($user, array $all)
    {
        $marketingNotifications = json_decode($user->wimpy_marketing_notification);
        $marketingNotifications->Sms = $all['sms'] ?? $marketingNotifications->Sms;
        $marketingNotifications->Email = $all['email'] ?? $marketingNotifications->Email;
        $marketingNotifications->Push = $all['push'] ?? $marketingNotifications->Push;
        $user->wimpy_marketing_notification = json_encode($marketingNotifications);
        $user->subscribed_venues = NULL;
        $user->save();

        try {
            $this->registerUserToElasticSearch($user);// Update data to elasticsearch ......
        } catch (Exception $e) {
            return ['message' => $e->getMessage()];
        }
        return ['status' => true, 'message' => 'Marketing Notifications Updated Successfully', 'data' => $user->only(["wimpy_marketing_notification"])];
    }//---- End of marketingNotifications() ----//

    /**
     * @param $user
     * @param array $all
     * @return array
     */
    private function rewardNotifications($user, array $all)
    {
        $rewardNotifications = json_decode($user->wimpy_rewards_notification);
        $rewardNotifications->Sms = $all['sms'] ?? $rewardNotifications->Sms;
        $rewardNotifications->Email = $all['email'] ?? $rewardNotifications->Email;
        $rewardNotifications->Push = $all['push'] ?? $rewardNotifications->Push;
        $user->wimpy_rewards_notification = json_encode($rewardNotifications);
        $user->subscribed_venues = NULL;
        $user->save();

        $this->registerUserToElasticSearch($user);// Update data to elasticsearch ......
        return ['status' => true, 'message' => 'Reward Notifications Updated Successfully', 'data' => $user->only(["wimpy_rewards_notification"])];
    }//---- End of rewardNotifications() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function dashBoardListing(Request $request)
    {
        try {
            $valiadtor = Validator::make($request->all(), [
                'user_id' => 'required',
            ]);

            if ($valiadtor->fails()) {
                $errors = $valiadtor->errors();
                $mess['status'] = false;
                foreach ($errors->get('user_id') as $message) {
                    $mess['message'] = 'user_id is missing';
                    return $mess;
                }
            }
            $company_id = $request->company_id;
            $venue = Venue::where('company_id', $company_id)->first();

            $body = ['user_id' => $request->user_id, 'venue_id' => $venue->venue_id ?? $venue['venue_id'], "company_id" => $request->company_id, 'voucher_type' => 'integrated'];
            $http = new \GuzzleHttp\Client();
            $response = $http->post(config('contant.JAVA_URL') . 'userVoucherListing', [
                'headers' => array(),
                'json' => $body,
            ]);

            $dd = json_decode($response->getBody());
            if ($dd->status) {
                $listingNotifications = $dd->body;
            }
            $user = $request->user();

            $loyalty = $this->getLoyaltyPoints($user);

            $newsData = (new NewsApiController())->getNews($request);

            if ($dd->status)
                return ["status" => true, "message" => "Data Found", "vouchers_array" => $listingNotifications, 'loyalty' => $loyalty['data'] ?? (object)[], 'news' => $newsData['data'] ?? []];
            else
                return ["status" => false, "message" => "Invalid information is added"];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//---- End of dashBoardListing() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function addUserFavourite(Request $request)
    {


        $valiadtor = Validator::make($request->all(), [
            'favourite' => 'required',
            'product_id' => 'required'
        ]);

        if ($valiadtor->fails()) {
            $errors = $valiadtor->errors();
            $mess['status'] = false;
            foreach ($errors->get('favourite') as $message) {
                $mess['message'] = 'favourite is missing';
                return $mess;
            }
            foreach ($errors->get('product_id') as $message) {
                $mess['message'] = 'product_id is missing';
                return $mess;
            }

        }
        $dataNewArray = [];
        $user = $request->user();
        $dataArray = json_decode($user->user_favourites, true);
        if ($user->user_favourites && !empty($dataArray)) {

            if (!$this->find_key_value($dataArray, 'product_id', $request->product_id)) { // search value in the array
                array_push($dataArray, ['product_id' => $request->product_id, 'favourite' => $request->favourite]);
            }

            if ($request->favourite == 'false') {
                $dataArray = $this->removeElementWithValue($dataArray, 'product_id', $request->product_id);
            }
            $newArray = [];
            foreach ($dataArray as $data)
                array_push($newArray, $data);

            $user->user_favourites = json_encode($newArray);
            $user->save();
            return ['status' => true, 'message' => 'Favourites updated successfully', 'favourites' => json_decode($user->user_favourites, true)];
        } else {
            array_push($dataNewArray, ['product_id' => $request->product_id, 'favourite' => $request->favourite]);
            $user->user_favourites = json_encode($dataNewArray);
            $user->save();
            return ['status' => true, 'message' => 'Favourites updated successfully', 'favourites' => json_decode($user->user_favourites, true)];
        }
    }//---- End of addUserFavourite() ----//

    /**
     * @param $array
     * @param $key
     * @param $value
     * @return mixed
     */
    function removeElementWithValue($array, $key, $value)
    {
        foreach ($array as $subKey => $subArray) {
            if ($subArray[$key] == $value) {
                unset($array[$subKey]);
            }
        }
        return $array;
    }//---- End of removeElementWithValue() ----//

    /**
     * @param $array
     * @param $key
     * @param $val
     * @return bool
     */
    function find_key_value($array, $key, $val)
    {
        foreach ($array as $item) {
            if (is_array($item) && $this->find_key_value($item, $key, $val)) return true;

            if (isset($item[$key]) && $item[$key] == $val) return true;
        }

        return false;
    }//---- End of find_key_value

    public function getUserPunchAndStamp(Request $request)
    {
        $user = User::whereUserId($request->user_id)->first();
        switch ($request->type) {
            case 'voucher':
                return $this->getUserVouchers($user, $request->id, $request->venue_id);
                break;
            case 'cards':
                return $this->getUserPunchCard($user, $request->id, $request->venue_id);
                break;
            default:
                return ['status' => false, 'message' => 'Please provide valid type'];
        }
    }//---- End of getUserPunchAndStamp() ----//

    /**
     * @param $user
     * @param $voucher_id
     * @param $venue_id
     * @return array
     */
    private function getUserVouchers($user, $voucher_id, $venue_id)
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $vouchers = ElasticsearchUtility::voucherDetail($index, $voucher_id);
        if ($vouchers['hits']['hits'] > 0 and isset($vouchers['hits']['hits'][0]['_source'])) {
            $vouchers['hits']['hits'][0]['_source']['first_name'] = $user->user_first_name;
            $vouchers['hits']['hits'][0]['_source']['user_id'] = $user->user_id;
            $vouchers['hits']['hits'][0]['_source']['last_name'] = $user->user_family_name;
            $vouchers['hits']['hits'][0]['_source']['user_image'] = $user->user_avatar;
            $vouchers['hits']['hits'][0]['_source']['id'] = $vouchers['hits']['hits'][0]["_id"];
            $vouchers['hits']['hits'][0]['_source']['company_id'] = $user->company_id;

            return ['status' => true, 'message' => 'voucher data retrieve successfully', 'data' => $vouchers['hits']['hits'][0]['_source']];
        }
        return ['status' => false, 'message' => 'voucher data not found', 'data' => []];

    }//---- End of getUserVouchers() ----//

    /**
     * @param $user
     * @param string $card_id
     * @param string $venue_id
     * @return array
     */
    private function getUserPunchCard($user, $card_id = '', $venue_id = '')
    {
        $stampId = $card_id . "_" . $user->user_id . "_" . config('constant.punch_card');
        $index = ElasticsearchUtility::generateIndexName($user->company_id, $venue_id);
        $stampCard = ElasticsearchUtility::stampCardDetail($index, (string)$stampId);
        if ($stampCard['hits']['hits'] > 0 && isset($stampCard['hits']['hits'][0]['_source'])) {
            $stampCard['hits']['hits'][0]['_source']['first_name'] = $user->user_first_name;
            $stampCard['hits']['hits'][0]['_source']['user_id'] = $user->user_id;
            $stampCard['hits']['hits'][0]['_source']['last_name'] = $user->user_family_name;
            $stampCard['hits']['hits'][0]['_source']['user_image'] = $user->user_avatar;
            $stampCard['hits']['hits'][0]['_source']['company_id'] = $user->company_id;

            return ['status' => true, 'message' => 'Stamp Card data retrieve successfully', 'data' => $stampCard['hits']['hits'][0]['_source']];
        }
        $stampCard = [
            'first_name' => $user->user_first_name,
            'user_id' => $user->user_id,
            'last_name' => $user->user_family_name,
            'user_image' => $user->user_avatar,
            'custom_doc_type' => config('constant.punch_card'),
            "persona_id" => $user->user_id,
            "quantity" => 0,
            "punch_card_count" => 0,
            'company_id' => $user->company_id
        ];
        $punchCards = PunchCard::whereId($card_id)->first();
        $punchCards['image'] = url('/') . '/' . $punchCards['image'];
        $punchCards['business_images'] = json_decode($punchCards['business_images']);
        $punchCards['businesses'] = json_decode($punchCards['businesses']);
        $stampCard['punch_card_rule'] = $punchCards;
        return ['status' => true, 'message' => 'Stamp Card data retrieve successfully', 'data' => $stampCard];
    }//---- End of getUserPunchCard() ----//


    public function updateAllUserVenues()
    {
        $user = User::where(['company_id' => config('constant.COMPANY_ID'), 'user_type' => 'app'])->get();
        foreach ($user as $users) {
            $users->subscribed_venues = NULL;
            $users->save();
            $this->registerUserToElasticSearch($users);
        }
    }

    public function venueWiseCharityCoinsCount($start_date = "", $end_date = "")
    {
        $listDontatedCoins = UserCharityCoins::whereUserIdAndVenueId(request()->user_id, request()->venue_id)
            ->where("status", "!=", "user")
            ->when($start_date, function ($query, $start_date) use ($end_date) {
                return $query->whereDate("updated_at", ">=", $start_date);
            })
            ->when($end_date, function ($query, $end_date) {
                return $query->whereDate("updated_at", "<=", $end_date);
            })
            ->groupBy("charity_id")
            ->groupBy(DB::raw('Date(updated_at)'))
            ->get(
                array(
                    "user_charity_coins.id as coin_ids", "user_id", "store_id", "company_id", "charity_id", "venue_id", "status", "created_at", "updated_at",
                    DB::raw('COUNT(coins) as "coins"')
                )
            );
        foreach ($listDontatedCoins as $key => $value) {
            $value->charity_name = $this->getCharityName($value->charity_id);
            $value->created_at = $value->updated_at;
        }
        return $listDontatedCoins;
    }

    /**
     * @return array|string
     */
    private function updateSegmentJavaCall()
    {
        try {
            $url = config('contant.JAVA_URL') . '/updateAllSegment';
            exec("curl -X POST " . $url . " > /dev/null &");
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//----- End of updateSegmentJavaCall() -----//

    public function getQuery()
    {
        $match = '"qr_code":"abc"';
        $result = Segment::where('query_parameters', 'like', '%' . $match . '%')->toSql();
        dd($result);
    }

    public function exportRegisteredUsers()
    {
        $start_date = date("Y-m") . "-1";
        $end_date = date("Y-m-d");
        $users = User::select(["users.created_at", "users.user_first_name", "users.user_family_name", "users.email", 'venues.venue_name'])
            ->leftJoin('venues', 'venues.venue_id', '=', 'users.default_venue')
            ->whereDate("users.created_at", ">=", $start_date)->whereDate("users.created_at", "<=", $end_date)
            ->orderBy("users.created_at", "ASC")
            ->get();
        return Excel::download(new UsersExport($users), 'registered_users_' . $start_date . "to" . $end_date . ".xlsx");

    }


    /**
     * @param Request $request
     * @return array
     */
    public function userSurveys(Request $request)
    {

        try {
            return (new Client(['headers' => []]))
                ->request('POST', config('constant.POS_URL') . 'getWimpyEmployee', [
                    'json' => ["identifier" => $request->identifier]
                ])->getBody();
        } catch (Exception $e) {
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//---- End of getWaitronDetail() ----//

    public function getUserDetailForUDB(Request $request)
    {
        ElasticsearchUtility::getUserVouchers(92);
        exit;
        if ($request->has('user_id') && $request->user_id) {
            return ['stamp_card' => [], 'vouchers' => [], 'badges' => []];

        }
    }


    private function getLoyaltyPoints($request)
    {
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
            $dataReturn['point_balance'] = $creditAmount - $debitAmount;
            return ['status' => true, 'data' => $dataReturn];
        }
        return ['status' => true, 'data' => $dataReturn];
    }



    public function sendVerificationGiftCard($phoneNumber = '', $code = '', $name = '')
    {

        try {
            $phoneNumber = substr_replace($phoneNumber, '+', 0, 2);
            $guzzle = new GuzzleClient();
            $resp = new Response();
            $driver = new Twilio($guzzle, $resp, [
                'account_id' => Config::get('constant.TWILIOID'),
                'api_token' => Config::get('constant.TWILIOAPI'),
            ]);
            $client = new awsClient($driver);
            $msg = [
                'to' => $phoneNumber,
                'from' => Config::get('constant.TWILLIONUMBER'),
                'content' => 'Hi ' . $name . ', Your Gift Card Claim ' . $code . ', put this in and Claim your gift card. Team GBK',
            ];

            //$client->send($msg);
            return true;
        } catch (\Exception $e) {
            return $e->getMessage();
        }

    }//--- End of sendVerificationSms() ---//

    public function userPreferences(Request $request)
    {
        $valiadtor = Validator::make($request->all(), [
            'name' => 'required',
            'status' => 'required',
            'type' => 'required',
        ]);

        if ($valiadtor->fails()) {
            $errors = $valiadtor->errors();
            $mess['status'] = false;
            foreach ($errors->get('name') as $message) {
                $mess['message'] = 'name is missing';
                return $mess;
            }
            foreach ($errors->get('status') as $message) {
                $mess['message'] = 'status is missing';
                return $mess;
            }
            foreach ($errors->get('type') as $message) {
                $mess['message'] = 'type is missing';
                return $mess;
            }
        }
        $dataNewArray = [];
        $user = $request->user();
        $dataArray = json_decode($user->food_preference, true);
        if ($user->food_preference && !empty($dataArray)) {
            if (!$this->find_key_value($dataArray, 'name', $request->name)) { // search value in the array
                array_push($dataArray, ['name' => $request->name, 'type' => $request->type, 'status' => $request->status]);
            }

            if ($request->status == 'false') {
                $dataArray = $this->removeElementWithValue($dataArray, 'name', $request->name);
            }
            $newArray = [];
            foreach ($dataArray as $data)
                array_push($newArray, $data);

            $user->food_preference = json_encode($newArray);
            $user->save();
            return ['status' => true, 'message' => 'Your food preferences have been updated', 'food_preference' => $user->food_preference];
        } else {
            array_push($dataNewArray, ['name' => $request->name, 'type' => $request->type, 'status' => $request->status]);
            $user->food_preference = json_encode($dataNewArray);
            $user->save();
            return ['status' => true, 'message' => 'Your food preferences have been updated', 'food_preference' => $user->food_preference];
        }
    }//---- End of

    public function checkKillBillStatus()
    {
        try {
            $dataPost = ["name" => 'Test Name', "firstNameLength" => strlen('Test Name'), "email" => 'test@gmail.com', "phone" => "(02) 435 6561", "currency" => "GBP", "billCycleDayLocal" => 1, "timeZone" => "UTC", "referenceTime" => Carbon::now()->toIso8601String(), "address2" => "Test Addresss", "postalCode" => "PO 23443"];
            $response = $this->KB_CLIENT->request('POST', Config::get('constant.KILL_BILL_URL') . "/1.0/kb/accounts", [
                'json' => $dataPost
            ])->getHeaders();

            Log::channel('custom')->info('api_keys', ['constant.KILL_BILL_APIKEY' => config('constant.KILL_BILL_APIKEY'),
                'constant.KILL_BILL_IRE_APIKEY' => config('constant.KILL_BILL_IRE_APIKEY'),
                'constant.KILL_BILL_SECRET' => config('constant.KILL_BILL_SECRET'),
                'constant.KILL_BILL_IRE_SECRET' => config('constant.KILL_BILL_IRE_SECRET')
            ]);

            dd($response);

            if (array_key_exists('Location', $response)) {
                return ['status' => true];
            }

            return ['status' => false];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => 'Error occured due' . $e->getMessage()];
        }
    }
    public function addUserToES(Request $request)
    {
        $users = User::get();
        $chunks = $users->chunk(5000);
        foreach ($chunks as $chunk) {
            (new ElasticsearchUtility())->bulkUserDataInsertNew($chunk);
        }
        return 'count : ' . $users->count();
    }

    public function checkingStamp()
    {
        dd((new GamificationController())->userAssignStampCardTransaction());
    }


}

