<?php /** @noinspection ALL */

namespace App\Http\Controllers\Auth;

use App\Models\AppSetting;
use App\Models\Venue;
use App\User;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebLoginController extends Controller
{
    private $userData;

    public function login()
    {
        try {


//            if(config('constant.APP_ENV') == 'production') {
//                return $this->prodLogin();
//            }
//            else {
//                return $this->devLogin();
//            }
            return $this->devLogin();

        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => 'Error occurred while requesting knox server for authorization.'.$e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of login() .....//

    /**
     * @return array.
     * Create or update user returned from knox server after authorization.
     */
    private function createAndUpdateUserLocally()
    {
        $user = User::updateOrCreate(['email' => $this->userData->email, 'user_type' => 'web'], ['knox_user_id' => $this->userData->user,
            'user_first_name' => $this->userData->first_name, 'company_name' => $this->userData->user_company,
            'user_family_name' => $this->userData->last_name, 'user_is_active' => $this->userData->user_status,
            'company_id' => $this->userData->company, 'password' => bcrypt(request()->password)
        ]);
        $this->userData->user_id = $user->user_id;
        $app_setting = AppSetting::where('company_id',$this->userData->company)->where('key','currency')->first();
        if($app_setting) {
            $this->userData->currency = $app_setting->value;
        } else {
            $this->userData->currency = '$';
        }

        return array_merge((array)$this->userData, $this->getAccessToken($user));
    }//..... end of createAndUpdateUserLocally() .....//

    /**
     * @return array
     * Get Access token.
     */
    public function getAccessToken(User $user)
    {
        try {
            /*$response = (new Client)->post(url('/oauth/token'), [
                'form_params' => [
                    'grant_type'    => 'password',
                    'client_id'     => config('constant.CLIENT_ID'),
                    'client_secret' => config('constant.CLIENT_SECRET'),
                    'username'      => request('email'),
                    'password'      => request('password'),
                    'scope'         => '',
                ],
            ]);
            return array_merge(json_decode((string)$response->getBody(), true),
                ['access_token_status' => true, 'access_token_message' => 'Access token generated successfully.']
            );*/
            return ['access_token' => $user->createToken($user->email)->accessToken, 'access_token_status' => true, 'access_token_message' => 'Access token generated successfully.'];
        } catch (\Exception $e) {
            return ['access_token_status' => false, 'access_token_message' => 'Could not get access token, please try later.'];
        }//..... end of try-catch() .....//
    }//..... end of getAccessToken() .....//


    private function prodLogin() {
        $this->userData = json_decode(((new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => config('constant.Knox_Authorization'),
                'X-API-KEY' => config('constant.Knox_X_API_KEY'),
                'secret' => config('constant.Knox_Secret'),
            ]
        ]))->request('POST', config('constant.Knox_Url')."/api/ApiController/login", [
            'json' => [ 'email' => request()->email, 'password' => request()->password]
        ]))->getBody()->getContents());


        if (isset($this->userData->status) && $this->userData->status == true) {
            if(request()->email == 'christopher@gbkire.com') {
                $this->userData->company =  config('constant.COMPANY_IRE_ID');
            } else if(request()->email == 'darcy@gbkuk.com') {
                $this->userData->company =  config('constant.COMPANY_ID');
            } else {
                return ['status' => false, 'message' => 'Invalid email or password'];
            }
            $this->userData->Acl = $this->getAcl();
            $this->userData->acl_roles = $this->getAclRoles();

            //match company_id from env
            $uk_id = config('constant.COMPANY_ID');
            $ire_id = config('constant.COMPANY_IRE_ID');
            if($this->userData->company == $uk_id) {

                AppSetting::updateOrCreate(
                    ['company_id' => $this->userData->company],
                    ['value' => '$', 'key' => 'currency','çompany_id' => $this->userData->company]
                );
                //save venues for the first login

                $venueData = ['venue_name' => 'GBK UK', "address" => 'UK', 'additional_information' => '', 'email' => 'uk@gmail.com'];
                $exit_venue = Venue::where('company_id',$this->userData->company)->first();
                if(!$exit_venue) {
                    Venue::create(
                        array_merge($venueData, ['company_id' => $this->userData->company,'venue_id' => rand(1111, 999999), "company_id" => $this->userData->company, "store_news_id" => 0]));
                }
            }
            else if($this->userData->company == $ire_id) {
                AppSetting::updateOrCreate(
                    ['company_id' => $this->userData->company],
                    ['value' => '£', 'key' => 'currency','çompany_id' => $this->userData->company]
                );
                //save venues for the first login
                $venueData = ['venue_name' => 'GBK IRE', "address" => 'IRE', 'additional_information' => '', 'email' => 'ire@gmail.com'];
                $exit_venue = Venue::where('company_id',$this->userData->company)->first();
                if(!$exit_venue) {
                    Venue::create(
                        array_merge($venueData, ['company_id' =>$this->userData->company, 'venue_id' => rand(1111, 999999), "company_id" => $this->userData->company, "store_news_id" => 0]));
                }
            }
            else {
                return ['status' => false, 'message' => 'Invalid email or password'];
            }

            $venue = DB::table('venues')->where('company_id',$this->userData->company)->orderBy('id', 'ASC')->first();
            $venuesSettings = DB::table('settings')->select('field2')->where('type', 'venue_settings')->first();
            $getCategory = false;
            if ($venuesSettings) {
                $getCategoryData = json_decode($venuesSettings->field2);
                $getCategory = $getCategoryData->from_pos;
            }
            $this->userData->venue_id  =  $venue->venue_id ?? 0;

            $this->userData->venue_name = $venue->venue_name;
            $this->userData->ibs = $venue->ibs ?? 0;
            $this->userData->is_integrated = $venue->is_integrated ?? 0;
            $this->userData->venue_settings = $getCategory ?? 0;

            $this->userData->email = request()->email;
            // $this->userData->Acl = [];//$this->getAcl();
            //$this->userData->acl_roles = [];//$this->getAclRoles();

            return $this->createAndUpdateUserLocally();
        } else {
            return ['status' => false, 'message' => $this->userData->message];
        }//..... end if-else() .....//
    }

    private function devLogin() {

//        Log::channel('custom')->info('api_keys',['constant.KILL_BILL_APIKEY'=>config('constant.KILL_BILL_APIKEY'),
//            'constant.KILL_BILL_IRE_APIKEY'=>config('constant.KILL_BILL_IRE_APIKEY'),
//            'constant.KILL_BILL_SECRET'=>config('constant.KILL_BILL_SECRET'),
//            'constant.KILL_BILL_IRE_SECRET'=>config('constant.KILL_BILL_IRE_SECRET')
//
//
//        ]);

        $this->userData = json_decode(((new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => config('constant.Knox_Authorization'),
                'X-API-KEY' => config('constant.Knox_X_API_KEY'),
                'secret' => config('constant.Knox_Secret'),
            ]
        ]))->request('POST', config('constant.Knox_Url')."/api/ApiController/login", [
            'json' => [ 'email' => request()->email, 'password' => request()->password]
        ]))->getBody()->getContents());

        if (isset($this->userData->status) && $this->userData->status == true) {


            //match company_id from env
            $this->userData->company  = $uk_id = config('constant.COMPANY_ID');
            $ire_id = config('constant.COMPANY_IRE_ID');
            Log::channel('custom')->info('user data : ', ['uk_id' => $uk_id, 'ire_id' => $ire_id]);
            if($this->userData->company == $uk_id) {

                AppSetting::updateOrCreate(
                    ['company_id' => $this->userData->company],
                    ['value' => '$', 'key' => 'currency','çompany_id' => $this->userData->company]
                );
                //save venues for the first login

                $venueData = ['venue_name' => 'Default Venue', "address" => '', 'additional_information' => '', 'email' => 'venue@gmail.com'];
                $exit_venue = Venue::where('company_id',$this->userData->company)->first();
                if(!$exit_venue) {
                    Venue::create(
                        array_merge($venueData, ['company_id' => $this->userData->company,'venue_id' => rand(1111, 999999), "company_id" => $this->userData->company, "store_news_id" => 0]));
                }
            }
            else if($this->userData->company == $ire_id) {
                AppSetting::updateOrCreate(
                    ['company_id' => $this->userData->company],
                    ['value' => '£', 'key' => 'currency','çompany_id' => $this->userData->company]
                );
                //save venues for the first login
                $venueData = ['venue_name' => 'GBK IRE', "address" => 'IRE', 'additional_information' => '', 'email' => 'ire@gmail.com'];
                $exit_venue = Venue::where('company_id',$this->userData->company)->first();
                if(!$exit_venue) {
                    Venue::create(
                        array_merge($venueData, ['company_id' =>$this->userData->company, 'venue_id' => rand(1111, 999999), "company_id" => $this->userData->company, "store_news_id" => 0]));
                }
            }
            else {
                Log::channel('custom')->info('my else : ', ['data' => $this->userData]);
                return ['status' => false, 'message' => 'Invalid email or password'];
            }

            $venue = DB::table('venues')->where('company_id',$this->userData->company)->orderBy('id', 'ASC')->first();
            $venuesSettings = DB::table('settings')->select('field2')->where('type', 'venue_settings')->first();
            $getCategory = false;
            if ($venuesSettings) {
                $getCategoryData = json_decode($venuesSettings->field2);
                $getCategory = $getCategoryData->from_pos;
            }
            $this->userData->venue_id  =  $venue->venue_id ?? 0;

            $this->userData->venue_name = $venue->venue_name;
            $this->userData->ibs = $venue->ibs ?? 0;
            $this->userData->is_integrated = $venue->is_integrated ?? 0;
            $this->userData->venue_settings = $getCategory ?? 0;

            $this->userData->email = request()->email;
            $this->userData->Acl = count($this->userData->Acl) > 0 ? $this->userData->Acl : $this->getAcl();
            $this->userData->acl_roles = count($this->userData->acl_roles) > 0 ? $this->userData->acl_roles : $this->getAclRoles();

            return $this->createAndUpdateUserLocally();
        } else {
            Log::channel('custom')->info('knox else : ', ['data' => $this->userData]);
            return ['status' => false, 'message' => $this->userData->message];
        }//..... end if-else() .....//
    }

    public function getAcl()
    {
        return
            [
                [
                    "id" => "27815",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "166",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Activate Campaigns",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27816",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "167",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Dashboard",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27817",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "168",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Members",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27818",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "169",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Campaigns",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27819",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "170",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Campaign List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27820",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "171",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Email Builder",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27821",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "172",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Pet Pack",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27822",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "173",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Competition",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27823",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "174",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Surveys",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27824",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "175",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Venue",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27825",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "176",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "News",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27826",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "177",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Charities",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27827",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "178",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Help",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27828",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "179",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Recipe",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27829",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "180",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Venue List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27830",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "181",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Venue Category",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27831",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "182",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Venue Configuration",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27832",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "183",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "User Role",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27833",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "184",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Punch Card",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27834",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "185",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Referral Settings",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27835",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "186",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "News Category",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27836",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "187",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Quick Board Levels",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27837",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "188",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Quick Board",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27838",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "189",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Charities List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27839",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "190",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Tiers",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27840",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "191",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Venue Charities Report",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27841",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "192",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Faqs Category",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27842",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "193",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Faqs",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27843",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "194",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Contact",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27844",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "195",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Terms And Conditions",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27845",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "196",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "About Loyalty",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27846",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "197",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Recipe List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27847",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "198",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "0",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Chef Registration",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27848",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "199",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Offers List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27849",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "200",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Category List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27850",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "201",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "TargetChannels",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27851",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "202",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CharactersListing",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27852",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "203",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Member List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27853",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "204",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Segment List",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27854",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "205",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Campaign Builder",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27855",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "206",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Target Chanel Application",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27856",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "207",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Target Chanel Email",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27857",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "208",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Target Chanel Sms",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27858",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "209",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Target Chanel Wifi",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27859",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "210",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Target Chanel Web",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27860",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "211",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignPlayStop",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27861",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "258",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "Export Segment",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27862",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "259",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentSubUnsub",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27863",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "260",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "ViewAllCampaigns",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27864",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "261",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignTypeSetForget",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27865",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "262",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignTypeProximity",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27866",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "263",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignTypeDynamic",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27867",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "264",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignTypeGamification",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27868",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "265",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CampaignTypeVirtualVoucher",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27869",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "266",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "ChannelTypeAlert",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27870",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "267",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "ChannelTypeReward",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27871",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "268",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "ChannelTypeGame",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27872",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "269",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeVoucher",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27873",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "270",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeIntegratedVoucher",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27874",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "271",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomePoints",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27875",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "272",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeTokens",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27876",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "273",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeCompetition",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27877",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "274",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeAnimation",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27878",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "275",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "OutcomeNoOutcome",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27879",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "276",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographicCriteria",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27880",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "277",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographic-AllUsers",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27881",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "278",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographic-Gender",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27882",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "279",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographic-Age",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27883",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "280",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographic-BirthDay",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27884",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "281",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentDemographic-Postcode",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27885",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "282",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembershipCriteria",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27886",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "283",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-MembershipJoinDate",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27887",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "284",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-MembershipNumber",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27888",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "285",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-LastLogin",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27889",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "286",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-RefferingUsers",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27890",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "287",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-RefferedUser",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27891",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "288",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-EnterVenue",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27892",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "289",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-DefaultVenue",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27893",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "290",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-MemberGroup",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27894",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "291",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-Source",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27895",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "292",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-LastTransaction",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27896",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "293",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-TotalSpending",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27897",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "294",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-AverageBasketValue",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27898",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "295",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-SpenderPercentage",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27899",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "296",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-Activity",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27900",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "297",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27901",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "298",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-VoucherExpiry",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27902",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "299",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-VoucherStatus",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27903",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "300",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-PunchCardStatus",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27904",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "301",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-TokenNotUsed",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27905",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "302",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-TokenUsedInCharity",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27906",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "303",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-TokenUsed",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27907",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "304",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-CompletedSurvey",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27908",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "305",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-SeenVideos",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27909",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "306",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentPromotions-CampaignTriggers",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27910",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "307",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "SegmentMembership-TransactionCompleted",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27911",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "308",
                    "add" => "1",
                    "edit" => "1",
                    "delete" => "1",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "EmailBuilderDragDrop",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27912",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "309",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "ViewUsersFromOtherPostcode",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27913",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "310",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => "0",
                    "project_id" => "45",
                    "resource" => "CanContinueWithSegment",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27914",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "311",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => null,
                    "project_id" => "45",
                    "resource" => "GlobalSegment",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ],
                [
                    "id" => "27915",
                    "company_id" => "405",
                    "level_id" => "0",
                    "role_id" => "63",
                    "resource_id" => "312",
                    "add" => "0",
                    "edit" => "0",
                    "delete" => "0",
                    "view" => "1",
                    "resource_weight" => null,
                    "project_id" => "45",
                    "resource" => "SegmentMembership-GapMap",
                    "business_name" => "Berners Street",
                    "role_name" => "Admin",
                    "project_name" => "Soldi Pos"
                ]
            ];


    }

    public function getAclRoles()
    {
        return [
            [
                "Admin" => [
                    [
                        "user_id" => "887",
                        "user_name" => "admin gbk",
                        "user_email" => "admin@gbk.co"
                    ]
                ]
            ],
            [
                "Staff" => [
                    [
                        "user_id" => "1086",
                        "user_name" => "Standard User",
                        "user_email" => "rest1@test.com"
                    ]
                ]
            ],
            [
                "restricted_user" => [
                    [
                        "user_id" => "1085",
                        "user_name" => "sdfs sdfs",
                        "user_email" => "gsdfsbk@soldi.net"
                    ],
                    [
                        "user_id" => "1087",
                        "user_name" => "Resticed User",
                        "user_email" => "restricted@user.com"
                    ],
                    [
                        "user_id" => "1088",
                        "user_name" => "Restricted User",
                        "user_email" => "restricted@gbk.com"
                    ]
                ]
            ]
        ];



    }// end of function


    public function getProductionUserReport()
    {

    }

}
