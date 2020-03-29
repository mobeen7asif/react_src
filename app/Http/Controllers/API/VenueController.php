<?php
namespace App\Http\Controllers\API;
use App\ApiCalls\DashboardReportApiCall;
use App\Classes\CommonLibrary;
use App\Models\Companies_Hirarchy;
use App\Models\Groups;
use App\models\LevelVenues;
use App\Models\Role;
use App\Models\Segment;
use App\Models\Setting;
use App\Models\ShopCategory;
use App\Models\ShopCategoryDetail;
use App\Models\Store;
use App\Models\UserCustomField;
use App\Models\Venue;
use App\Models\VenueShops;
use App\User;
use App\Utility\ElasticsearchUtility;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Session;
use File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;
class VenueController extends Controller
{

    public function __construct()
    {
        set_time_limit(0);
    }


    public function configurations_id(Request $request)
    {
        $venue_id = $request->venue_id;
        $venue_data = DB::table('venues')->where(["venue_id" => $venue_id])->first();
        $campSaturation = DB::table('venue_campaign_saturation')->where('venue_id', $venue_id)->first();
        $venue_loyalty = DB::table('loyalty_configurations')->where('venue_id', $venue_id)->first();
        $venue_test_alerts = DB::table('venue_configurations_test_alerts')->where('venue_id', $venue_id)->first();
        $venue_operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue_id)->get();

        $users = [];//User::join('users_mubuss', 'users.id', '=', 'users_mubuss.user_id')->where('users.venue_id', $venue_id)->where('business_id', $company_id)->orderby('users.first_name', 'ASC')->get()->toArray();
        $levels_data = DB::table('level_configurations')->where('venue_id', $venue_id)->get();
        $single_level = DB::table('level_configurations')->where('venue_id', $venue_id)->first();
        $beacon_data = DB::table('beacon_configurations')->where('venue_id', $venue_id)->orderBy("beacon_name", "ASC")->get();
        $stores_data = DB::table('store')->where('venue_id', $venue_id)->orWhere('venue_id', 0)->get();

        $data['stores'] = $stores_data;
        $data['levels_data'] = $levels_data;
        $data['beacon_data'] = $beacon_data;
        $data['users'] = $users;
        $data['venue_data'] = $venue_data;
        if (!empty($campSaturation)) {

            $campSaturation->contact_perioud_start_sms = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_start_sms));
            $campSaturation->contact_perioud_end_sms = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_end_sms));
            $campSaturation->contact_perioud_start_point_me = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_start_point_me));
            $campSaturation->contact_perioud_end_point_me = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_end_point_me));
            if ($campSaturation->rewards) {
                $campSaturation->is_reward = true;
            } else {
                $campSaturation->is_reward = false;
            }
        }
        $data['venue_conpain_saturation'] = $campSaturation;
        $data['venue_loyalty'] = $venue_loyalty;
        $data['venue_test_alerts'] = $venue_test_alerts;
        $data['venue_operating_hours'] = $venue_operating_hours;
        $data['level'] = $single_level;
        return $data;

    }

    public function listVenues(Request $request, $company_id)
    {
        $venues['list'] = ($request->nameSearch) ? DB::table('venues')->where('venue_name', 'like', '%' . $request->nameSearch . '%')->skip($request->offset)->take($request->limit)->orderBy("venues." . $request->order_by, $request->orderData)->get() :
            DB::table('venues')->skip($request->offset)->take($request->limit)->orderBy("venues." . $request->order_by, $request->orderData)->get();
        $venues['totalSegments'] = ($request->nameSearch) ? DB::table('venues')->where('venues.venue_name', 'like', '%' . $request->nameSearch . '%')->count() : DB::table('venues')->where("venues.company_id", $company_id)->count();
        $venues['settings'] = DB::table('settings')->select('field2')->where('type', 'venue_settings')->first();
        $getCategory = false;
        if ($venues['settings']) {
            $getCategoryData = json_decode($venues['settings']->field2);
            $getCategory = $getCategoryData->from_pos;
        }
        if (!$getCategory)
            foreach ($venues['list'] as $key => $value) {
                $value->listAssignCat = DB::table("venue_category")->leftJoin("venue_categories", "venue_categories.id", "=", "venue_category.category_id")->where(["venue_category.venue_id" => $value->venue_id])->get(["venue_categories.*"]);
                $value->venue_image = url('/') . '/venue_category/' . $value->image;
            }

        return $venues;
    }//.... end of function

    public function venueConfigurationsAdd(Request $request)
    {

        $data = $request->all();

        if (Session::get("user_lvl") == "venue") {
            $list = array(
                'venue_name' => $data['dataArray']['account_id'],
                'facebook_id' => $data['dataArray']['facebook_id'],
                'instagram_id' => $data['dataArray']['instagram_id'],
                'twitter_id' => $data['dataArray']['twitter_id']
            );
        } else {
            $list = array(
                'venue_name' => $data['dataArray']['account_id'],
                'facebook_id' => $data['dataArray']['facebook_id'],
                'instagram_id' => $data['dataArray']['instagram_id'],
                'twitter_id' => $data['dataArray']['twitter_id'],
                'pointme_sender_id' => $data['dataArray']['pointme_sender_id'],
                'sms_sender_id' => $data['dataArray']['sms_sender_id'],
                'email_sender_id' => $data['dataArray']['email_sender_id'],
            );
        }


        $time_array = array(
            '0' => $data['dataArray']['sunday_venue'],
            '1' => $data['dataArray']['monday_venue'],
            '2' => $data['dataArray']['tuesday_venue'],
            '3' => $data['dataArray']['wednesday_venue'],
            '4' => $data['dataArray']['thursday_venue'],
            '5' => $data['dataArray']['friday_venue'],
            '6' => $data['dataArray']['saturday_venue'],
        );

        $is_open_array = array(
            '0' => $data['dataArray']['open_sunday'],
            '1' => $data['dataArray']['open_monday'],
            '2' => $data['dataArray']['open_tuesday'],
            '3' => $data['dataArray']['open_wednesday'],
            '4' => $data['dataArray']['open_thursday'],
            '5' => $data['dataArray']['open_friday'],
            '6' => $data['dataArray']['open_saturday'],
        );
        $days_array = array(
            '0' => 'sunday',
            '1' => 'monday',
            '2' => 'tuesday',
            '3' => 'wednesday',
            '4' => 'thursday',
            '5' => 'friday',
            '6' => 'saturday',
        );
        $venue_detail = DB::table('venues')->where('venue_id', $data['dataArray']['venue_id'])->first();
        if ($venue_detail) {
            DB::table('venues')->where('venue_id', $venue_detail->venue_id)->update($list);
        } else {
            DB::table('venues')->insertGetId($list);
        }

        $venue_detail = DB::table('venues')->where('venue_id', $data['dataArray']['venue_id'])->first();
        if ($venue_detail) {
            DB::table('venues')->where('venue_id', $venue_detail->venue_id)->update($list);
            $venue_detail->venue_id;
        } else {
            DB::table('venues')->insertGetId($list);
        }

        /*         * **************Add Oprations Hours**************** */
        if (!empty($time_array) && !empty($is_open_array))
            DB::table('venue_operating_hours')->where('venue_id', '=', $data['dataArray']['venue_id'])->delete();
        foreach ($time_array as $key => $val) {

            $exp_time_arr = explode(';', $val);
            $open_time = $exp_time_arr[0] / 1000;
            $close_time = $exp_time_arr[1] / 1000;
            date_default_timezone_set("Asia/Karachi");
            $start_time = date('Y-m-d H:i', $open_time);
            $end_time = date('Y-m-d H:i', $close_time);
            date_default_timezone_set("UTC");
            DB::table('venue_operating_hours')->insertGetId(['venue_id' => $data['dataArray']['venue_id'], 'is_open' => $is_open_array[$key], 'days' => $days_array[$key], 'start_time' => $start_time, 'end_time' => $end_time, 'updated_at' => date("Y-m-d H:i:s")]);
        }
        /*         * **************Add Oprations Hours**************** */
        Session::flash('success_message', 'Venue confiuration Added Successfully');
        return 'success';
    }

    public function getVenueData(Request $request)
    {
        $data = $request->all();
        if ($data) {
            $venue_data = DB::table('venues')->where('id', $data['venue_id'])->first();
        } else {
            $venue_data = "";
        }
        return array('message' => 'success', 'data' => $venue_data);
    }

    public function addloyaltyConfigurations(Request $request)
    {

        $data = $request->all();
        $list = array(
            'venue_id' => $data['dataArray']['venue_id'],
            'rate_grade_1' => $data['dataArray']['rate_grade_1'],
            'rate_grade_2' => $data['dataArray']['rate_grade_2'],
            'rate_grade_3' => $data['dataArray']['rate_grade_3'],
            'rate_grade_4' => $data['dataArray']['rate_grade_4'],
            'rate_grade_5' => $data['dataArray']['rate_grade_5'],
            'rate_grade_6' => $data['dataArray']['rate_grade_6'],
        );
        $venue_detail = DB::table('loyalty_configurations')->where('venue_id', $data['dataArray']['venue_id'])->first();
        if ($venue_detail)
            DB::table('loyalty_configurations')->where('venue_id', $data['dataArray']['venue_id'])->update($list);
        else
            DB::table('loyalty_configurations')->insertGetId($list);

        Session::flash('success_message', 'Venue Loyalty Configurations Added Successfully');
        return 'success';

    }

    public function getVenueLoyaltyData(Request $request)
    {
        $data = $request->all();
        if ($data) {
            $venue_loyalty = DB::table('loyalty_configurations')->where('venue_id', $data['venue_id'])->first();
        } else {
            $venue_loyalty = "";
        }
        return array('message' => 'success', 'data' => $venue_loyalty);
    }

    public function addCompaignTestAlerts(Request $request)
    {
        $data = $request->all();
        $list = [
            'venue_id' => $data['dataArray']['venue_id'],
            'reporting_email' => $data['dataArray']['reporting_email'],
            'recipient_email' => json_encode($data['dataArray']['recipient_email']),
            'mobile' => json_encode($data['dataArray']['mobile']),
            'application_recipient' => json_encode($data['dataArray']['application_recipient']),
            'mimimum_recipient_warning' => $data['dataArray']['mimimum_recipient_warning'],
            'maximum_recipient_warning' => $data['dataArray']['maximum_recipient_warning'],
        ];
        $venue_detail = DB::table('venue_configurations_test_alerts')->where('venue_id', $data['dataArray']['venue_id'])->first();
        if ($venue_detail) {
            DB::table('venue_configurations_test_alerts')->where('id', $venue_detail->id)->update($list);
        } else {
            DB::table('venue_configurations_test_alerts')->insertGetId($list);
        }
        Session::flash('success_message', 'Venue Compaign Alerts Added Successfully');
        return ["status"=>true,"message"=>"Success"];
    }

    public function getVenueConfigurationsTestAlerts(Request $request)
    {
        $data = $request->all();
        if ($data)
            $venue_test_alerts = DB::table('venue_configurations_test_alerts')->where('venue_id', $data['venue_id'])->first();
        else
            $venue_test_alerts = "";

        return ["status"=>true,'message' => 'success', 'data' => $venue_test_alerts];
    }

    public function getVenueConfigChartsData(Request $request)
    {
        $venue_id = $request->venue_id;
        $campSaturation = DB::table('venue_campaign_saturation')->where('venue_id', $venue_id)->first();
        //------- if empty then insert default record for venue campaign saturation alerts  --------//
        if (empty($campSaturation)) {
            DB::table('venue_campaign_saturation')->insert(["venue_id" => $venue_id, "saturation_alerts" => 0, "saturation_block" => 0, "contact_perioud_start_sms" => "00", "contact_perioud_end_sms" => "00",
                "contact_perioud_start_point_me" => "00",
                "contact_perioud_end_point_me" => "00",
                "compaing_satu_alerts" => "00",
                "compaing_satu_block" => "00",
                "rewards" => 0,
                "created_at" => date("Y-m-d H:i:s"),
                "updated_at" => date("Y-m-d H:i:s")]);
            $campSaturation = DB::table('venue_campaign_saturation')->where('venue_id', $venue_id)->first();
        }

        if (!empty($campSaturation)) {
            $campSaturation->contact_perioud_start_sms = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_start_sms));
            $campSaturation->contact_perioud_end_sms = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_end_sms));
            $campSaturation->contact_perioud_start_point_me = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_start_point_me));
            $campSaturation->contact_perioud_end_point_me = date("Y-m-d") . " " . date("H:i", strtotime($campSaturation->contact_perioud_end_point_me));
        }

        $venue_operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue_id)->get();
        //------- if empty then insert default record for venue operating hours  --------//
        if (empty($venue_operating_hours->toArray())) {
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "saturday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "sunday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "monday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "tuesday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "wednesday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "thursday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            DB::table('venue_operating_hours')->insert(["venue_id" => $venue_id, "is_open" => 0, "days" => "friday", "start_time" => date("Y-m-d H:i:s"), "end_time" => date("Y-m-d H:i:s"), "created_at" => date("Y-m-d 09:00:10"), "updated_at" => date("Y-m-d 09:30:10")]);
            $venue_operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue_id)->get();
        }
        foreach ($venue_operating_hours as $key => $value) {
            if ($value->is_open === 1) {
                $value->is_open = true;
            } else {
                $value->is_open = false;
            }
        }
        $data['campaign_saturation_data'] = $campSaturation;
        $data['opening_hr'] = $venue_operating_hours;
        $data['numberConfigure'] = Setting::where('type','configure_numbers')->first();;
        $data['voucherCode'] = Setting::where('type','voucher_code_length')->first();
        $billing = Setting::where('type','billing_on_off')->first();
        $giftCard = Setting::where('type','gift_card')->first();

        $billingStatus = false;
        $billingValue = [];
        if(!empty($billing)){
            $billingStatus = $billing->field1;
            $billingValue = $billing->field2 != "" ? json_decode($billing->field2) : [];
        }

        $data['billing'] = $billingStatus;
        $data['billingValues'] = $billingValue;
        $data['giftCard'] = ($giftCard) ? $giftCard->field1:0;
        return $data;
    }

    public function venueTotalCampaign(Request $request)
    {
        $venue_id = $request->venue_id;
        $campaign = new DashboardReportApiCall();
        $activeCampaign = $campaign->getActiveCampaigns($venue_id);
        $recentlyFinished = $campaign->getRecentlyFinished($venue_id);
        $total = $activeCampaign + $recentlyFinished;
        $beacons = DB::table('beacon_configurations')->select('*')
            ->where('venue_id', $venue_id)->count();
        return ['status' => "true", 'active' => $activeCampaign, 'recently_finished' => $recentlyFinished, "total_campaign" => $total, "total_beacons" => $beacons];
    }

    public function getStores(Request $request)
    {
        $venue_id = $request->venue_id;
        $data['data'] = DB::table('store')->where(["venue_id" => $venue_id])->skip($request->offset)->take($request->limit)->get();
        foreach ($data['data'] as $key => $val) {
            if (!$val->venue_id) {
                $val->is_onboard = false;
            } else {
                $val->is_onboard = true;
            }
        }
        $data['total'] = DB::table('store')->where(["venue_id" => $venue_id])->count();
        return $data;
    }

    /** end of method */


    function updateStoreVenue(Request $request)
    {
        $checked = $request->checked;
        $store_id = $request->store_id;
        $venue_id = 0;
        if ($checked) {
            $venue_id = $venue_id = $request->venue_id;
        }
        DB::table('store')->where('store_id', $store_id)
            ->update([
                'venue_id' => $venue_id
            ]);
        if ($checked) {
            return 'success';
        } else {
            return 'unsubscribe';
        }
    }

    /** end of method */

    function getUsers(Request $request)
    {
        if ($request->nameSearch != "") {
            if ($request->nameSearch != '') {
                $users = $this->searchUser('first_name', $request->nameSearch, $request->venue_id, $request->company_id);
                if (count($users) == 0)
                    $users = $this->searchUser('email', $request->nameSearch, $request->venue_id, $request->company_id);

                if (count($users) == 0)
                    $users = $this->searchUser('last_name', $request->nameSearch, $request->venue_id, $request->company_id);
            } else {
                $users = \App\models\User::join('users_mubuss', 'users.id', '=', 'users_mubuss.user_id')
                    ->where('business_id', $request->company_id)
                    ->orderby("users.{$request->order_by}", "{$request->orderData}")->get();
            }

            $temp = array();
            $data = array();
            foreach ($users as $user) {
                $temp['id'] = $user->id;
                $temp['first_name'] = $user->first_name;
                $temp['last_name'] = $user->last_name;
                $temp['email'] = $user->email;
                $temp['user_id'] = $user->user_id;
                array_push($data, $temp);
            }
            $data_array['data'] = $data;
            return $data_array;
        } else {
            return [
                'data' => \App\models\User::leftJoin('users_mubuss', 'users.id', '=', 'users_mubuss.user_id')
                    ->where('business_id', $request->company_id)->orderby("users.{$request->order_by}", "{$request->orderData}")->get()->toArray(),
                'levels' => $this->getCompanyLevelForRolesOptions($request->company_id)
            ];
        }
    }

    /** end of method */

    public function addCompaignSaturations(Request $request)
    {
        $data = $request->all();
        $list = array(
            'venue_id' => $data['dataArray']['venue_id'],
            'saturation_alerts' => $data['dataArray']['saturation_alerts'],
            'saturation_block' => $data['dataArray']['saturation_block'],
            'contact_perioud_start_sms' => trim($data['dataArray']['contact_perioud_start_sms']),
            'contact_perioud_end_sms' => $data['dataArray']['contact_perioud_end_sms'],
            'contact_perioud_start_point_me' => $data['dataArray']['contact_perioud_start_point_me'],
            'contact_perioud_end_point_me' => $data['dataArray']['contact_perioud_end_point_me'],
            'compaing_satu_alerts' => $data['dataArray']['compaing_satu_alerts'],
            'compaing_satu_block' => $data['dataArray']['compaing_satu_block'],
            'rewards' => $data['dataArray']['rewards'] ? 1 : 0,
        );
        $venue_detail = DB::table('venue_campaign_saturation')->where('venue_id', $data['dataArray']['venue_id'])->first();
        if ($venue_detail) {
            DB::table('venue_campaign_saturation')->where('id', $venue_detail->id)->update($list);
        } else {
            DB::table('venue_campaign_saturation')->insertGetId($list);
        }
        Session::flash('success_message', 'Venue Conpaign Saturation Added Successfully');
        return 'success';
    }


    public function searchUser($search_by, $key, $venue_id, $company_id)
    {
        $users = \App\models\User::leftJoin('users_mubuss', 'users.id', '=', 'users_mubuss.user_id');

        if ($search_by == 'email') {
            $users = $users->where('business_id', $company_id);
            $users = $users->where('users.email', 'LIKE', "%$key%");
        }

        if ($search_by == 'first_name') {
            $users = $users->where('business_id', $company_id);
            $users = $users->where('users.first_name', 'LIKE', "%$key%");
        }

        if ($search_by == 'last_name') {
            $users = $users->where('business_id', $company_id);
            $users = $users->where('users.last_name', 'LIKE', "%$key%");
        }

        return $users->orderby("users." . request()->order_by, request()->orderData)->get();
    }

    public function getVenueLevels(Request $request)
    {
        if (isset($request->level_id)) {
            $levels_data = DB::table('level_configurations')->where('venue_id', $request->venue_id)->where('venue_level', $request->level_id)->get();
        } else {
            $levels_data = DB::table('level_configurations')->where('venue_id', $request->venue_id)->get();
        }
        $data['levels'] = $levels_data;
        $data['status'] = true;
        $data['beacon_data'] = DB::table('beacon_configurations')->where('venue_id', $request->venue_id)->orderBy("beacon_name", "ASC")->get();

        return $data;
    }

    public function addVenueLevel(Request $request)
    {
        $data = $request->all();
        $editVenueLevelID = $request->editVenueLevelID;
        $imageName = 'no';
        $list = array(
            'venue_id' => $data['venue_id'],
            'floor_name' => $data['floor_name'],
            'floor_number' => $data['floor_number'],
            'status' => 1,
        );
        if ($request->hasFile('image')) {
            $venue_img_extension = $request->image->extension();
            $imageName = uniqid() . '.' . $venue_img_extension;
            $path = base_path() . '/public/floor_plan/';
            $request->file('image')->move($path, $imageName);

            $path_thumbs = base_path() . '/public/floor_plan/thumbs';
            Image::make($path . $imageName, array(
                'width' => 200,
                'height' => 200,
                'grayscale' => false
            ))->save($path_thumbs . '/thumb_' . $imageName);
            $list['floor_plan'] = $imageName;
        }
        if ($editVenueLevelID == 0) {
            $venue_level = $this->getVenueLevel($data['venue_id']);
            $list['venue_level'] = $venue_level;
            DB::table('level_configurations')->insertGetId($list);
        } else {
            DB::table('level_configurations')->where('venue_level', $editVenueLevelID)->where('venue_id', $data['venue_id'])->update($list);
        }
        return ['data' => 'success', 'image' => $imageName];
    }

    public function getVenueLevel($venue_id)
    {
        $level = 0;
        if ($venue_id) {
            $venue_level_count = DB::table('level_configurations')->where('venue_id', $venue_id)->count();
            if ($venue_level_count == 0) {
                $level = 1;
            } else {
                $venue_level_id = DB::table('level_configurations')->where('venue_id', $venue_id)->max('venue_level');
                $venue_level_id++;
                $level = $venue_level_id;
            }
        }
        return $level;
    }

    public function deleteLevelData(Request $request)
    {
        $venue_id = $request->venue_id;
        $data = $request->all();
        DB::table('beacon_configurations')->where('level_id', '=', $data["del_level_id"])->where('venue_id', '=', $venue_id)
            ->delete();
        DB::table('level_configurations')->where('venue_level', '=', $data["del_level_id"])->where('venue_id', '=', $venue_id)
            ->delete();
        return ['status' => 'success', 'data' => 'Deleted'];
    }

    public function addBeconInVenue(Request $request)
    {
        $data = $request->all();
        $list = [
            'venue_id' => $data['dataArray']['venue_id'],
            'level_id' => $data['dataArray']['becon_level_id'],
            'beacon_name' => $data['dataArray']['becon_name'],
            'beacon_type' => $data['dataArray']['becon_type'],
            'uuid' => $data['dataArray']['becon_uuid'],
            'major' => $data['dataArray']['becon_major'],
            'minor' => $data['dataArray']['becon_minor'],
            'x_coordinate' => $data['dataArray']['x_coordinate'],
            'y_coordinate' => $data['dataArray']['y_coordinate'],
            'status' => 1,
        ];

        $id = DB::table('beacon_configurations')->insertGetId($list);
        return $id;
    }

    public function getFloorBeacons(Request $request)
    {
        $data = $request->all();
        $beacon_data = DB::table('beacon_configurations')->where('id', $data['id'])->get();
        return ['message' => 'success', 'data' => $beacon_data];
    }

    public function updateBeconInVenue(Request $request)
    {
        $list = array(
            'beacon_name' => $request->beacon_name,
            'beacon_type' => $request->becon_type,
            'uuid' => $request->uuid,
            'major' => $request->major,
            'minor' => $request->minor,
            'x_coordinate' => $request->x_coordinate,
            'y_coordinate' => $request->y_coordinate
        );

        DB::table('beacon_configurations')->where('id', $request->beacon_id)->update($list);
        return 'success';
    }

    public function deleteBeaconData(Request $request)
    {
        DB::table('beacon_configurations')->where('id', '=', $request->id)->delete();
        return ['message' => 'success', 'data' => 'Deleted'];
    }

    public function getFloorBeacon(Request $request)
    {
        $data = $request->all();
        $beacon_data = DB::table('beacon_configurations')->where('level_id', $data['floor_level'])->where('venue_id', $data['venue_id'])->get();
        return ['message' => 'success', 'data' => $beacon_data];
    }

    function getSoldiBusiness()
    {
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

        try {
            if(config('constant.SOLDI_DEFAULT_PATH') == "") {
                return ['status' => true, 'data' => [], 'company_levels' => []];
            }
            $http = new \GuzzleHttp\Client();
            $response = $http->get(config('constant.SOLDI_DEFAULT_PATH') . '/business/venue?s=' . $companyName, [
                'headers' => ['X-API-KEY' => $api_key, 'SECRET' => $api_secret],

            ]);
            $d = json_decode($response->getBody());
            $update_businesses = [];
            $all_business = [];
            if ($d->success)
            {
                foreach ($d->data as $business){
                    if($business->business_role == 0) {
                        $all_business = ['business_id' => $business->business_id,
                            'business_name' =>  'All',
                            'store_name' =>  $business->business_name,
                            'api_key' => $business->api_key,
                            'secret_key' => $business->secret_key,
                            'label' => 'All',
                            'value' => $business->business_id,
                        ];
                    }
                    if($business->business_role != 0) {
                        $business->label = $business->business_name;
                        $business->store_name = $business->business_name;
                        $business->business_name = $business->store_name;
                        $business->value = $business->business_id;
                        $update_businesses[] = $business;
                    }
                }
                if(count($all_business)>0) {
                    array_unshift($update_businesses, (object)$all_business);
                }
                return ['status' => true, 'data' => $update_businesses, 'company_levels' => []];
            }
            else
                return ["status" => false, "message" => "Data not found"];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Email or password doesn't match any user to get access token."];
        }
    }


    function getSoldiBussinessProducts(Request $request)
    {
        try {
            $http = new \GuzzleHttp\Client();
            $response = $http->get(config('constant.SOLDI_DEFAULT_PATH') . '/business/store', [
                'headers' => ['X-API-KEY' => $request->api_key, 'SECRET' => $request->secret],
            ]);

            $d = json_decode($response->getBody());
            if ($d->success)
                return ['status' => true, 'data' => $d->data];
            else
                return ["status" => false, "message" => "Data not found"];
        } catch (Exception $e) {
            return ["status" => false, "message" => "Email or password doesn't match any user to get access token."];
        }
    }

    function getCompanyLevel($company_id)
    {
        $store_level = LevelVenues::where('company_id', $company_id)->get();
        $store_level_arr = [];
        foreach ($store_level as $l) {
            array_push($store_level_arr, $l->level_id);
        }
        $levels_array = [];
        $cmsLevels = Companies_Hirarchy::where('comp_id', $company_id)->where('tree_id', 1)->get();
        $commonLib = new CommonLibrary();
        foreach ($cmsLevels as $key => $level) {
            $level2 = $commonLib->getFirst_Level($level->tree_id, $level->comp_id);
            if ($level2) {
                foreach ($level2 as $lev1) {
                    $level3 = $commonLib->getSec_Level($lev1->tree_id, $lev1->comp_id);
                    if ($level3) {
                        foreach ($level3 as $lev2) {
                            if (!in_array($lev2->tree_id, $store_level_arr)) {
                                array_push($levels_array, ["tree_id" => $lev2->tree_id, "level_name" => $lev2->level_name]);
                                $level4 = $commonLib->getclub_Level($lev2->tree_id, $lev2->comp_id);
                                if ($level4) {
                                    foreach ($level4 as $lev3) {

                                    }//---- end foreach
                                }
                            }
                        }//----- end foreach
                    }
                }//---- end foreach
            }
        }//----- end foreach
        return $levels_array;
    }//------------------------- end of function --------------//

    public function saveVenue(Request $request, ElasticsearchUtility $elasticsearchUtility, FilesController $filesController)
    {

        $venueData = ['venue_name' => $request->venue_name, "address" => $request->venue_location, 'additional_information' => $request->additional_information, 'email' => $request->email];
        $image = time() * rand() . ".png";

        if ($filesController->uploadBase64Image(request()->image, 'venue_category/' . $image))
            $venueData['image'] = $image;

        $venue_id = rand(1111, 999999);

        if ($request->is_edit == 0) {
            Venue::create(array_merge($venueData, ['venue_id' => $venue_id, "company_id" => $request->company_id, "store_news_id" => 0]));

            /****  Create index on elastic search $req *****/
            /*try {
                if ($request->venue_id && $request->company_id)
                    $elasticsearchUtility->createIndex($elasticsearchUtility->generateIndexName($request->company_id, $venue_id));
            } catch (Exception $e) {
                return ['status' => false, 'message' => 'Error occurred while creating index.'];
            }*/
            /******* end of create index on elastic search ****/

            if (!empty($request->level)) {
                $level_venues = DB::table('levels_venues')->where('company_id', '=', $request->company_id)->where('level_id', '=', $request->level)->first();
                if (!empty($level_venues))
                    DB::table('levels_venues')->where('id', $level_venues->id)->update(['company_id' => $request->company_id, 'venue_id' => $venue_id, 'level_id' => $request->level]);
                else
                    DB::table('levels_venues')->insertGetId(['level_id' => $request->level, 'company_id' => $request->company_id, 'venue_id' => $venue_id, "created_at" => date("Y-m-d H:i:s"), "updated_at" => date("Y-m-d H:i:s")]);
            }//..... end if() .....//
        } else {
            $venue_id = $request->is_edit;
            VenueShops::where("venue_id", $request->is_edit)->delete();
            Store::where("venue_id", $request->is_edit)->delete();
            Venue::where(["venue_id" => $request->is_edit])->update($venueData);
        }//..... end if-else() .....//
        if ($request->has('list_assign_categories')) {
            DB::table('venue_category')->where(["venue_id" => $request->is_edit])->delete();
            $r = json_decode($request->list_assign_categories);
            foreach ($r as $key => $value) {
                $cat_data = [
                    'category_id' => $value->id,
                    'venue_id' => $venue_id
                ];
                DB::table('venue_category')->insert($cat_data);
            }//..... end of foreach() ......//
        }

        return ['status' => true, 'message' => 'Venue saved successfully!'];
    }//..... end of saveVenue() ......//


    function getCompanyVenues(Request $request)
    {
        return ['status' => true, 'data' => Venue::where(["company_id" => $request->company_id])->get()];
    }

    public function getVenueCategories(Request $request)
    {
        if ($request->nameSearch != "") {
            $data['data'] = ShopCategory::select('id', 'name', 'description', 'image', 'created_at', 'updated_at')->where('company_id', $request->company_id)->where('name', 'like', '%' . $request->nameSearch . '%')->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = ShopCategory::select('id', 'name', 'description', 'image', 'created_at', 'updated_at')->where('company_id', $request->company_id)->where('name', 'like', '%' . $request->nameSearch . '%')->count();
        } else {
            $data['data'] = ShopCategory::select('id', 'name', 'description', 'image', 'created_at', 'updated_at')->where('company_id', $request->company_id)->orderby('created_at', 'desc')->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = ShopCategory::select('id', 'name', 'description', 'image', 'created_at', 'updated_at')->where('company_id', $request->company_id)->orderby('created_at', 'desc')->count();
        }

        $data['status'] = true;
        return $data;
    }

    public function addVenueCategories(Request $request, FilesController $filesController)
    {

        if (request()->image !== 'null') {
            $image = time() * rand() . ".png";

            if (!$filesController->uploadBase64Image(request()->image, 'venue_category/' . $image))
                $image = '';
        }

        if ($request->is_edit == 0) {
            $category_id = ShopCategory::insertGetId([
                "company_id" => $request->company_id,
                "name" => $request->category_name,
                "description" => $request->description,
                "category_shops" => $request->soldiBussiness,
                "image" => $image ? $image : "default.jpg",
                "created_at" => date("Y-m-d H:i:s"),
                "updated_at" => date("Y-m-d H:i:s"),
            ]);
            $this->addCategoryBussiness($category_id, $request->soldiBussiness);
            $shops = json_decode($request->soldiBussiness);
            if ($shops) {
                foreach ($shops as $key => $value) {
                    DB::table("store")->insert([
                        "pos_store_id" => $value->business_id,
                        "pos_code" => 1,
                        "venue_id" => 00000,
                        "store_name" => $value->business_name,
                        "store_phone" => rand(1111111, 9999999),
                        "store_email" => rand(1111111, 9999999) . "@gmail.com",
                        "pos_user_id" => 1234,
                    ]);

                }
            }
            return ['status' => true, 'message' => 'Category saved successfully',];

        } else {

            $data = [
                "company_id" => $request->company_id,
                "name" => $request->category_name,
                "description" => $request->description,
                "category_shops" => $request->soldiBussiness,
                "updated_at" => date("Y-m-d H:i:s"),
            ];

            if (request()->image !== 'null') {
                $data['image'] = $image;
            }
            ShopCategory::where("id", $request->is_edit)->update($data);
            $this->addCategoryBussiness($request->is_edit, $request->soldiBussiness);
            return ['status' => true, 'message' => 'Category updated successfully',];
        }
    }//---- End of addShopsCategories() ---//

    public function addCategoryBussiness($category_id, $shops)
    {
        $shops = json_decode($shops);

        DB::table("venue_category_shops")->where(["category_id" => $category_id])->delete();
        foreach ($shops as $key => $value) {
            DB::table("venue_category_shops")->insert([
                "category_id" => $category_id,
                "shop_id" => $value->business_id,
                "shop_name" => $value->business_name,
                "status" => 1
            ]);
        }
    }

    public function deleteVenueCategories($id)
    {
        ShopCategory::where(["id" => $id])->delete();
        ShopCategoryDetail::where(["category_id" => $id])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    }

    public function getUserRoles(Request $request)
    {
        if ($request->nameSearch != "") {
            $data['roles'] = Role::where('company_id', $request->company_id)->where('name', 'like', '%' . $request->nameSearch . '%')->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = Role::where('company_id', $request->company_id)->where('name', 'like', '%' . $request->nameSearch . '%')->count();
        } else {
            $data['roles'] = Role::where('company_id', $request->company_id)->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = Role::where('company_id', $request->company_id)->count();
        }

        $commonLib = new CommonLibrary();
        if (!empty($data['roles'])) {
            foreach ($data['roles'] as $key => $value) {
                $value->role_levels = $commonLib::getLevels($value->id, $value->company_id);
            }

        }
        $data['roleCompanyLevels'] = $this->getCompanyLevelForRoles($request->company_id);
        return $data;
    }


    function getCompanyLevelForRoles($company_id)
    {

        $store_level = LevelVenues::where('company_id', $company_id)->get();
        $store_level_arr = [];
        foreach ($store_level as $l) {
            array_push($store_level_arr, $l->level_id);
        }
        $levels_array = [];
        $cmsLevels = Companies_Hirarchy::where('comp_id', $company_id)->where('tree_id', 1)->get();
        $commonLib = new CommonLibrary();
        $html = '';
        foreach ($cmsLevels as $key => $level) {
            $html .= '<li class="dragVenues list_levels"  id="' . $level->tree_id . '" value="' . $level->tree_id . '-' . $level->level_name . '"><a>' . $level->level_name . '</a></li>';
            $level2 = $commonLib->getFirst_Level($level->tree_id, $level->comp_id);
            $level->level2 = $level2;
            if ($level2) {
                foreach ($level2 as $lev1) {
                    $html .= '<li class="dragVenues list_levels level2"  id="' . $lev1->tree_id . '" value="' . $lev1->tree_id . '-' . $lev1->level_name . '"><a>' . $lev1->level_name . '</a></li>';
                    $level3 = $commonLib->getSec_Level($lev1->tree_id, $lev1->comp_id);
                    $lev1->level3 = $level3;
                    if ($level3) {
                        foreach ($level3 as $lev2) {
                            $html .= '<li class="dragVenues list_levels level3" id="' . $lev2->tree_id . '" value="' . $lev2->tree_id . '-' . $lev2->level_name . '"><a>' . $lev2->level_name . '</a></li>';
                            $level4 = $commonLib->getclub_Level($lev2->tree_id, $lev2->comp_id);
                            $level2->level4 = $level4;
                            if ($level4) {
                                foreach ($level4 as $lev3) {
                                    $html .= '<li class="dragVenues list_levels level4" id="' . $lev3->tree_id . '" value="' . $lev3->tree_id . '-' . $lev3->level_name . '"><a>' . $lev3->level_name . '</a></li>';

                                }//---- end foreach
                            }

                        }//----- end foreach
                    }
                }//---- end foreach
            }
        }//----- end foreach

        return $html;
    }//------------------------- end of function --------------//

    function getCompanyLevelForRolesOptions($company_id)
    {
        $store_level = LevelVenues::where('company_id', $company_id)->get();
        $store_level_arr = [];
        foreach ($store_level as $l) {
            array_push($store_level_arr, $l->level_id);
        }
        $levels_array = [];
        $cmsLevels = Companies_Hirarchy::where('comp_id', $company_id)->where('tree_id', 1)->get();
        $commonLib = new CommonLibrary();
        $html = '';
        foreach ($cmsLevels as $key => $level) {
            $html .= '<option class="1"  value="' . $level->tree_id . '">' . $level->level_name . '</option>';
            $level2 = $commonLib->getFirst_Level($level->tree_id, $level->comp_id);
            $level->level2 = $level2;
            if ($level2) {
                foreach ($level2 as $lev1) {
                    $html .= '<option class="level2"  value="' . $lev1->tree_id . '">' . $lev1->level_name . '</option>';
                    $level3 = $commonLib->getSec_Level($lev1->tree_id, $lev1->comp_id);
                    $lev1->level3 = $level3;
                    if ($level3) {
                        foreach ($level3 as $lev2) {
                            $html .= '<option class="level3" value="' . $lev2->tree_id . '">' . $lev2->level_name . '</option>';
                            $level4 = $commonLib->getclub_Level($lev2->tree_id, $lev2->comp_id);
                            $level2->level4 = $level4;
                            if ($level4) {
                                foreach ($level4 as $lev3) {
                                    $html .= '<option class="level4" value="' . $lev3->tree_id . '">' . $lev3->level_name . '</option>';

                                }//---- end foreach
                            }

                        }//----- end foreach
                    }
                }//---- end foreach
            }
        }//----- end foreach

        return $html;
    }//------------------------- end of function --------------//


    public function saveUserRoles(Request $request)
    {
        $company_id = $request->company_id;
        $name = $request->name;
        $description = $request->description;
        if ($request->is_edit === 0) {
            $role = Role::create(["name" => $name, "slug" => $name, "description" => $description, "company_id" => $company_id, "level" => 1, "created_at" => date("Y-m-d H:i:s"), "updated_at" => date("Y-m-d H:i:s")]);
            $role_id = $role->id;
            $message = "Role saved successfully.";
        } else {
            $role_id = $request->is_edit;
            Role::where("id", $role_id)->update(["name" => $name, "slug" => $name, "description" => $description, "updated_at" => date("Y-m-d H:i:s")]);
            DB::table('role_assigns')->where(["role_id" => $role_id])->delete();
            $message = "Role updated successfully.";
        }

        $single_user_level = $request->single_user_level;
        if (!empty($single_user_level)) {
            foreach ($single_user_level as $level_id) {
                DB::table('role_assigns')->insertGetId(['role_id' => $role_id, 'level_id' => $level_id, "created_at" => date("Y-m-d H:i:s"), "updated_at" => date("Y-m-d H:i:s")]);
            }
        }
        return ["status" => true, "message" => $message];

    }

    public function deleteRole($roleID)
    {
        Role::where(["id" => $roleID])->delete();
        DB::table('role_assigns')->where(["role_id" => $roleID])->delete();
        return ["status" => true, "message" => "Role deleted successfully"];
    }

    public function getVenueInfo(Request $request)
    {
        return ["status" => true, "payment_gatway" => \config("constant.IS_EWAY_PAYMENT_ENABLED"), "data" => Venue::where(["venue_id" => $request->venue_id])->first()];
    }

    public function saveAutoCheckOut(Request $request)
    {
        Venue::where(['venue_id' => $request->venue_id])->update([
            "auto_checkout" => ($request->autoChecked) ? 1 : 0,
            "beacon_condition" => ($request->beacon_condition) ? 1 : 0,
            "beacon_listining" => ($request->beacon_listining) ? 1 : 0,
            "minutes_condition" => ($request->minutes_condition) ? 1 : 0,
            "beacon_area" => $request->beacon_area,
            "beacon_minutes" => $request->minutesData,
        ]);
        return ['status' => true, "message" => "Auto Checkout saved successfully"];
    }

    public function saveAppColor(Request $request)
    {
        Venue::where(['venue_id' => $request->venue_id])->update(["app_color" => $request->background]);
        return ['status' => true, "message" => "App color saved successfully"];
    }

    public function getPaymentGatwayStatus(Request $request)
    {
        $venues = \Illuminate\Support\Facades\DB::table('venues')->where(['venue_id' => $request->venue_id, 'company_id' => $request->company_id])->first();

        $venuesSettings = \Illuminate\Support\Facades\DB::table('settings')->select('field2')->where('type', 'venue_settings')->first();
        $getCategory = false;
        if ($venuesSettings) {
            $getCategoryData = json_decode($venuesSettings->field2);
            $getCategory = $getCategoryData->from_pos;
        }
        return ["status" => true, "payment_gatway" => \config("constant.IS_EWAY_PAYMENT_ENABLED"), 'venue_data' => $venues, 'venue_setting' => $getCategory];
    }

    public function updatePaymentGateway(Request $request)
    {
        $array = \Illuminate\Support\Facades\Config::get('constant');
        $array['IS_EWAY_PAYMENT_ENABLED'] = ($request->is_enable == "true") ? true : false;
        $data = var_export($array, 1);
        if (\Illuminate\Support\Facades\File::put(config_path() . '/constant.php', "<?php\n return $data ;")) {
            return ["status" => true, "message" => "Setting Saved successfully"];
        }
    }

    public function getAllVenues()
    {
        $board = Venue::select(["venue_id as id", "venue_name as label"])->get();
        foreach ($board as $key => $value) {
            $value->value = false;
        }
        return ['data' => $board->toArray()];
    }

    public function getVenueStore()
    {
        $board = Venue::select(["venue_shops"])->where("venue_id", $_GET['id'])->first();
        $shops = json_decode($board->venue_shops);
        $list = [];
        foreach ($shops as $key => $value) {
            $a = ["id" => (int)$value->business_id, "label" => $value->business_name, "value" => false];
            array_push($list, $a);
        }
        return ['data' => $list];
    }

    public function getAllCategories(Request $request)
    {
        $data['data'] = ShopCategory::select('*')->where('company_id', $request->company_id)->get();
        $data['status'] = true;
        return $data;
    }

    function getComapanyLevel()
    {
        $company_id = isset($_GET['company_id']) ? $_GET['company_id'] : 0;
        //$company_levels = $this->getCompanyLevel($company_id);
        return ['status' => true, 'company_levels' => []];
    }

    public function getVenueDropDownList($id)
    {
        return ['status' => true, 'data' => Venue::get(['venue_id as id', 'venue_name as title', 'ibs', 'is_integrated', "company_id"])];
    }//..... end of getVenueDropDownList() .....//


    public function getVenvueDetail(Request $request)
    {
        $data = DB::table("venue_category_shops")->select("*")
            ->join("venue_category", "venue_category.category_id", "=", "venue_category_shops.category_id")
            ->groupBy('venue_category_shops.shop_id')->where(["venue_category.venue_id" => $request->venue_id])->get();
        if (!$data->isEmpty())
            return ['status' => true, 'data' => $data];
        else
            return ['status' => false, 'data' => []];

    }


    public function getGroups(Request $request)
    {
        if ($request->nameSearch != "") {
            $data['data'] = DB::table("groups_bussiness")->where('name', 'like', '%' . $request->nameSearch . '%')->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = DB::table("groups_bussiness")->where('name', 'like', '%' . $request->nameSearch . '%')->count();
        } else {
            $data['data'] = DB::table("groups_bussiness")->skip($request->offset)->take($request->limit)->orderBy($request->order_by, $request->orderData)->get();
            $data['total'] = DB::table("groups_bussiness")->count();
        }
        $data['data']->each(function ($d) {
            //$d->listAssignVenues = ShopCategoryDetail::select("*")->join("venues","venues.venue_id","=","venue_cat_details.venue_id")->where(["venue_cat_details.category_id"=>$d->id])->get();
            $d->image = url('/') . '/venue_category/' . $d->image;
            if ($d->group_shops == "null" || $d->group_shops === null) {
                $d->group_shops = json_encode([]);
            }
        });
        $data['status'] = true;
        return $data;
    }

    public function saveGroup(Request $request, FilesController $filesController)
    {
        $shops = json_decode($request->as_shops);
        $shops_data = [];
        foreach ($shops as $key => $value) {
            array_push($shops_data, ["business_id" => $value->business_id, "business_name" => $value->business_name, "business_image" => $value->business_image->thumb1 ?? ""]);
        }
        $insertData = [
            "group_name" => $request->group_name,
            "group_shops" => json_encode($shops_data),
        ];

        $image = time() * rand() . ".png";
        if ($filesController->uploadBase64Image(request()->image, 'venue_category/' . $image))
            $insertData['image'] = $image;

        if ($request->is_edit == 0) {
            DB::table("groups_bussiness")->insert($insertData);
            return ['status' => true, 'message' => 'Group created successfully',];
        } else {

            DB::table("groups_bussiness")->where("id", $request->is_edit)->update($insertData);
            return ['status' => true, 'message' => 'Group updated successfully',];
        }
    }//---- End of addShopsCategories() ---//

    public function deleteGroup($id)
    {
        DB::table("groups_bussiness")->where(["id" => $id])->delete();
        return ["status" => true, "message" => "Group Deleted successfully "];
    }

    public function getListGroups()
    {
        $data['data'] = DB::table("groups_bussiness")->get();
        $data['data']->each(function ($d) {
            $d->image = url('/') . '/venue_category/' . $d->image;
            if ($d->group_shops == "null" || $d->group_shops === null) {
                $d->group_shops = json_encode([]);
            }

        });
        $data["status"] = true;
        return $data;
    }

    public function app_settings()
    {
        $a = [
            "modules" => [
                ['type' => 'SHOPPING CENTERS', 'enable' => true,],
                ['type' => 'NEWS', 'enable' => true,],
                ['type' => 'CHARITY', 'enable' => true,],
                ['type' => 'RECIPE', 'enable' => true,],
                ['type' => 'LOYALTY', 'enable' => true,],
                ['type' => 'STORE', 'enable' => true,],
                ['type' => 'SCAN', 'enable' => true,],
                ['type' => 'PETPACK', 'enable' => true,],
                ['type' => 'RECEIPTS', 'enable' => true,],
                ['type' => 'GIFTCARDS', 'enable' => true,],
                ['type' => 'MYACTIVITY', 'enable' => true,],

            ],
            //"initial_message" => ""
            "initial_message" => "Make sure you fill out all the fields below for 5 bonus tokens to use within the app!",
            "tutorials" => true


        ];
        echo json_encode($a);
    }

    public function updatePosConfiguration(Request $request)
    {
        if ($request->type == 'ibs') {
            DB::table('venues')->where(['venue_id' => $request->venue_id, 'company_id' => $request->company_id])->update([
                'ibs' => ($request->is_enable == "true") ? 1 : 0
            ]);

        } else if ($request->type == 'voucher') {
            DB::table('venues')->where(['venue_id' => $request->venue_id, 'company_id' => $request->company_id])->update([
                'is_integrated' => ($request->is_integrated == "true") ? 1 : 0
            ]);

        }

        return ['status' => true, 'message' => 'POS Configuration is update successfully'];
    }

    public function addPosVenues()
    {
        $soldiBusiness = $this->getSoldiBusiness();
        $venue = Venue::where('company_id', request()->company_id)->get();
        $soldiBusiness = collect($soldiBusiness['data']);

        $newVenues = $soldiBusiness->filter(function ($vale) use ($venue) {
            if ($venue->where('venue_id', $vale->business_id)->isEmpty())
                return $vale;
        });
        if ($newVenues->isNotEmpty()) {
            foreach ($newVenues as $value) {
                Venue::create([
                    'venue_id' => $value->business_id,
                    'venue_name' => $value->business_name,
                    'company_id' => Config::get('constant.COMPANY_ID'),
                    'address' => 'South Africa'
                ]);


            }
            return ['status' => true, 'message' => 'Venues inserted succesfully'];
        } else {
            return ['status' => false, 'message' => 'No Venue Found'];
        }

    }

    public function getVenue(Request $request)
    {
        $data = $request->all();
        if(!request()->has("parent_id")){
            $custom_fields = UserCustomField::where('venue_id', $data['venue_id'])
                ->where('parent_id', 0);

              if(!$request->has("get_form")){
                  $custom_fields = $custom_fields->where('field_type',"!=","form");
              }

            $custom_fields = $custom_fields->get();

            foreach ($custom_fields as $key => $value){
                $value->children = UserCustomField::where('venue_id', $data['venue_id'])->where('parent_id', $value->id)->get()->toArray();
            }
            $custom_fields = json_encode($custom_fields);

            $total_forms = [];
            $findUserForms = DB::table("user_custom_field_data")
                ->where('user_id',request()->user_id)
                ->where('form_id',"!=",0)
                ->groupBy('form_id', 'form_index')
                ->pluck("form_id");

            foreach ($findUserForms as $key => $value){
                array_push($total_forms,$value);
            }

            $custom_forms = DB::table("user_custom_field")
                ->where('field_type',"=","form")
                ->pluck("id");

            foreach ($custom_forms as $key => $value){
                if(!$findUserForms->contains($value)){
                    array_push($total_forms,$value);
                }
            }
            $custom_forms = [];
            foreach ($total_forms as $key => $value){

                $form = DB::table("user_custom_field")
                    ->where('id',"=",$value)
                    ->get()->toArray();
                array_push($custom_forms,(array) $form[0]);
            }
            $custom_forms = collect($custom_forms);

            $form_data = $custom_forms->groupBy('id');
            $form_data->toArray();

            $custom_forms = [];
            foreach ($form_data as $form_id => $value){
                foreach ($value as $key => $value2){
                    $value2["form_index"] = $key;
                    array_push($custom_forms,(array) $value2);
                }
            }

        }else{
            $custom_fields = DB::table("user_custom_field")
                ->where('parent_id', request()->parent_id)
                ->get();
            $custom_fields = json_encode($custom_fields);
            $custom_forms = [];
        }

        //============== get form and fields  =====================//

        $user_forms = DB::table("user_custom_field")
            ->where('field_type', 'form')->get();

        foreach ($user_forms as $key => $value){
            $value->custom_fields =  UserCustomField::where('parent_id', $value->id)->get();
        }


        $all_custom_fields = DB::table("user_custom_field")
            ->where('field_type',"!=", 'form')->get();






        //================ end of from and fields  ================//

        if(!empty($custom_fields) || !empty($user_forms))
                    return array('message' => 'success', 'data' => ["custom_fields"=>$custom_fields],'forms'=>$custom_forms,"user_form"=>$user_forms,"all_custom_fields"=>$all_custom_fields);
                else
                    return array('message' => 'success', 'data' => [],"forms"=>[],"user_form"=>[],"all_custom_fields"=>[]);

        /*if(!empty($venue_data))
            return array('message' => 'success', 'data' => $venue_data);
        else
            return array('message' => 'success', 'data' => []);*/
    }

    public function getFormCustomFields(Request $request)
    {
        $data = $request->all();

        $custom_fields = DB::table("user_custom_field")
            ->where('venue_id', $data['venue_id'])
            ->where('parent_id', request()->parent_id)
            ->get();
        $custom_fields = json_encode($custom_fields);

        if(!empty($custom_fields))
                    return array('message' => 'success', 'data' => ["custom_fields"=>$custom_fields]);
                else
                    return array('message' => 'success', 'data' => []);

        /*if(!empty($venue_data))
            return array('message' => 'success', 'data' => $venue_data);
        else
            return array('message' => 'success', 'data' => []);*/
    }

    public function updateCustomFields(Request $request)
    {


        $fields = request()->fields;
        $delete_items = request()->delete_items;
        UserCustomField::whereIn("id",$delete_items)->delete();
        UserCustomField::whereIn("parent_id",$delete_items)->delete();


        $data = [];
        foreach ($fields as $key => $value){

            $dropdown = $value["drop_down_values"] ?? NULL;
            if(gettype($dropdown) == "string"){
                $dropdown = json_decode($value["drop_down_values"],true);

            }

            $parent_id= UserCustomField::updateOrCreate(
                ["field_unique_id"=>$value["field_unique_id"]],
                [
                    "company_id"=>request()->company_id,
                    "venue_id"=>request()->venue_id,
                    "field_name"=>$value["field_name"],
                    "field_label"=>$value["field_label"],
                    "field_type"=>$value["field_type"],
                    "segment_name"=>$value["segment_name"],
                    "search_name"=>$value["search_name"],
                    "field_unique_id"=>$value["field_unique_id"],
                    "drop_down_values"=> isset($dropdown) ? json_encode($dropdown) : NULL,
                    "is_multi_select"=> isset($value["is_multi_select"]) ? json_encode($value["is_multi_select"]) : NULL,
                    "created_at"=>date("Y-m-d H:i:s"),
                    "updated_at"=>date("Y-m-d H:i:s"),
                    "parent_id"=>0,
                ]
            );
            if(isset($value['children']) && count($value['children']) > 0 ){
                 foreach ($value['children'] as $key => $child){
                     $child_dropdown = $child["drop_down_values"] ?? NULL;
                     $child_multi_select = $child["is_multi_select"] ?? NULL;
                     if(gettype($child_dropdown) == "string")
                         $child_dropdown = json_decode($child["drop_down_values"],true);
                     if(gettype($child_multi_select) == "string")
                         $child_multi_select = $child["drop_down_values"];

                     UserCustomField::updateOrCreate(
                         ["parent_id"=>$parent_id->id,"id"=>$child["id"]],
                         [
                             "parent_id"=>$parent_id->id,
                             "company_id"=>request()->company_id,
                             "venue_id"=>request()->venue_id,
                             "field_name"=>$child["field_name"],
                             "field_label"=>$child["field_label"],
                             "field_type"=>$child["field_type"],
                             "segment_name"=>$child["segment_name"],
                             "search_name"=>$child["search_name"],
                             "field_unique_id"=>$child["field_unique_id"],
                             "drop_down_values"=> isset($child_dropdown) ? json_encode($child_dropdown) : NULL,
                             "is_multi_select"=> ($child_multi_select == "true") ? "true" : "false",
                             "created_at"=>date("Y-m-d H:i:s"),
                             "updated_at"=>date("Y-m-d H:i:s"),
                         ]
                     );
                 }
            }
        }





        //DB::table('venues')->where('venue_id', $request->venue_id)->update(["custom_fields"=>json_encode($request->fields)]);

        return array('status' => true, 'message' => "Fields are updated successfully");
    }

    public function getAllGroups(Request $request)
    {
        return ['status' => true, 'data' => DB::table('groups')->get(["group_id as id","group_name"])];
    }

    public function saveGroups(Request $request)
    {
        if(request()->deleteFields)
            Groups::whereIn("group_id",request()->deleteFields)->delete();

        $groups = request()->fields;

        foreach ($groups as $key => $value){
            Groups::updateOrCreate(['group_id' => $value["id"]], ["group_name"=>$value["group_name"],"group_description"=>$value["group_name"],"company_id"=>request()->company_id]);
        }

        return ["status"=>true,"message"=>"Successfully"];
    }


    public function getSettings()
    {
        $data = [];
        $billing = Setting::where('type','billing_on_off')->first();
        $billingStatus = false;
        $billingValue = [];
        if(!empty($billing)){
            $billingStatus = $billing->field1;
            $billingValue = $billing->field2 != "" ? json_decode($billing->field2) : [];
        }

        $data['status'] = true;
        $data['billingStatus'] = $billingStatus;
        $data['billingFieldValues'] = $billingValue;
        return ["status"=>true,"billingStatus"=>$billingStatus,"billingFieldValues"=>$billingValue,"data"=>[]];
    }

    public function testEmailsSmsApp()
    {
        $data = DB::table('venue_configurations_test_alerts')->where('venue_id', request()->venue_id)->first();
        if(!empty($data)){
            $data->mobile = json_decode($data->mobile,true);
            $data->recipient_email = json_decode($data->recipient_email,true);
            $data->application_recipient = json_decode($data->application_recipient,true);
        }else{
            $data = [];
        }
        return ["status" => true,"data"=>$data];
    }



    function test(){
        $request_headers = array(
            "X-API-KEY:9PIyECmJ8AOUPo2fvvuEvPSTerYCs8",
            "SECRET:8WjEvEC3CDfPJyYDb8wyMpeA6TNP37"
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://gbk.engage.qa.ire.soldi.io/api/v1/app/restaurants/list?type=GBK');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);

        $season_data = curl_exec($ch);

        if (curl_errno($ch)) {
            print "Error: " . curl_error($ch);
            exit();
        }

        // Show me the result
        curl_close($ch);
        $json= json_decode($season_data, true);
        print_r($season_data);
    }





}//..... end of class.