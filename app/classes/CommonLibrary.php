<?php 
namespace App\Classes;
use App\Models\LevelVenues;
use App\Models\Setting;
use Session;
use Redirect;

use Request;
use Cookie;
use URL;
use DB;
use App\CommonModel;
use GuzzleHttp\Client;
use App\Models\Venue;
use App\Models\VenueSubscrition;
use App\Models\UserVouchers;
use App\Models\RoleAcl;
use App\Models\CmsLevel;
use App\Models\AclRepository;
use App\Models\Companies_Hirarchy;
use GuzzleHttp\Exception\RequestException;
use File;
use App\Models\User;
use App\Models\NewsCategory;
use App\Models\Repository;
use App\Models\Storage;
use App\Models\VenuesStorage;
use App\Models\Role;
use App\Models\Role_Assign;
use App\Models\BowserSides;
use App\Models\BowserSideHoses;
use App\Models\DatasourceType;
use App\UnifiedDbModels\Product;
class CommonLibrary {


    const X_API_KEY = "2bfb2eb207f94c53ccc12df8540d144e";
    const DEFAULT_PATH = 'www.mywatchtower.co/api_v1';
	
	public static function verifyMaxLogin() 
    {
        $company_id =  Session::get('company_id');
        if($company_id == "" || $company_id == 3){
            Session::flash('login_error_message', 'You are not login.Please login to continue.');
            redirect()->to('/admin/login')->send(); 
        }
    }
  
	public function verifyBuyerLogin() 
	{
		$user_id =  Session::get('user_id');
		$user_type = Session::get('user_type');
		if($user_id == ""){
		
			Session::flash('error_message', 'You are not login.Please login to continue.');
			redirect()->to('/search')->send(); 
		}else if($user_type == 1 ){
			Session::flash('error_message', 'You are not login.Please login to continue.');
			redirect()->to('/search')->send();	
		}
	}


	public function verifyFrontLogin() 
	{
		$user_id =  Session::get('user_id');
		if($user_id == ""){
			Session::flash('error_message', 'You are not login.Please login to continue.');
			 redirect()->to('/')->send(); 
		}
	}

    public static function getSingleVenue($id)
	{

		$client = new Client();
		$company_id =  Session::get('company_id');
		if($company_id == 2){
			$beacon_Api_key = config('constant.Max_Beacons_AP1_key');
		}else{
			$beacon_Api_key = config('constant.Puma_Beacons_AP1_key');
		}
		
		$res = $client->request('GET', self::DEFAULT_PATH."/venues/id/$id", [
			'headers' => [
				'Content-Type' => 'application/json',
				'X-API-KEY' => $beacon_Api_key,
			]
		]);
		$venues_list = $res->getBody();
		$venue_data = json_decode($venues_list);
		$venue_arr = $venue_data->data;
		return @$venue_arr[0]->venue_name;
    }
	
    public static function getstoreVenueid($id)
    {
        $company_id =  Session::get('company_id');
        $store_venues = Venue::where('company_id', '=', $company_id)->where('store_news_id', '=', $id)->get()->toArray();
        if($store_venues){
            return $id = $store_venues[0]['venue_id'];
        }else{
            return 0; 
        }
        
        
    }
	
	public static function getVenueID()
    {
        $company_id =  Session::get('company_id');
        $venues = DB::table('venue_image')->where('company_id', '=', $company_id)->first();
        if($venues){
            return $id = $venues->venue_id;
        }else{
            return 0; 
        }
        
        
    }
	
	public static function getLevelVenueid($id)
    {
        $company_id =  Session::get('company_id');
        $level_venues = DB::table('levels_venues')->where('company_id', '=', $company_id)->where('level_id', '=', $id)->first();
        if($level_venues){
            return $id = $level_venues->venue_id;
        }else{
            return 0; 
        }
        
        
    }
	public static function getlatLong($id){
        
            $client = new Client();
            $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
            // Soldi Api's and Url
            $company_id = Session::get('company_id');
            $responce_set = DB::table('settings')->where('company_id', '=', $company_id)->first();
            if($company_id == 3 ){
                $beacon_Api_key = $responce_set->beacons_api_key;
                try{
                    $res = $client->request('GET', $Beacons_AP1_URL."/venues/id/$id", [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'X-API-KEY' => $beacon_Api_key,
                        ]
                    ]);
                    $venues_list = $res->getBody();
                    $venue_data = json_decode($venues_list);
                    $venue_arr = $venue_data->data;
                    return @$venue_arr[0];
                }catch(RequestException $e){
                    return $venue_arr = '';
                }
            }else{
                echo 'blabla';exit;
                return $venue_arr = '';
            }
            
        
    }


    public static function getCatName($cat_id)
    {
		$company_id =  Session::get('company_id');
        $expCat =   explode(',',$cat_id);
        $catNames  =         NewsCategory::select('news_category_name','news_category_id')->where('company_id', '=', $company_id)->whereIn('news_category_id',$expCat)->get();
        return $catNames;

    }

    public static function getVenueNames($id){

        $client = new Client();
        $arr = [];
        try{
            $beacon_Api_key = config('constant.Beacons_AP1_key');
            $res = $client->request('GET', self::DEFAULT_PATH."/venues/id/$id", [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $beacon_Api_key,
                ]
            ]);
            $venues_list = $res->getBody();
            $venue_data = json_decode($venues_list);
            $venue_arr = $venue_data->data;
            if($venue_arr){
                $arr['status'] = true;
                $arr['venues'] = $venue_arr;
                return @$venue_arr[0]->venue_name;

            }else{
                $arr['status'] = false;
                $arr['error'] = 'Venue not Assign';
            }
        }catch (RequestException $e){

            $arr['status'] = false;
            $arr['error'] = 'Server error!';
            ;
        }
        return $arr;
        /*$client = new Client();
        $beacon_Api_key = config('constant.Beacons_AP1_key');
        $res = $client->request('GET', self::DEFAULT_PATH."/venues/id/$id", [
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $beacon_Api_key,
            ]
        ]);
        $venues_list = $res->getBody();
        $venue_data = json_decode($venues_list);
        $venue_arr = $venue_data->data;

        return @$venue_arr[0]->venue_name;*/
    }
    //
    public static function getAllVenuesNames($news_id)
    {
        $venues    =     NewsVenue::select('venue_id','news_id')->where('news_id',$news_id)->get();
        return $venues;
    }
    //
    public static function freeSpace($dir){

        //return $dir;
        $file_size = 0;
        $news_img_destinationPath =  storage_path('repository').'/'.$dir;
        //return $news_img_destinationPath;
        foreach( File::allFiles($news_img_destinationPath) as $file) {
            $file_size += $file->getSize();
        }
        $dir_size  =                number_format($file_size / 1048576,2);
        $total_dir_size =           $dir_size."MB";
        return     $total_dir_size;

    }

    public static function getFirst_Level($level_id,$company_id)
    {
        $level2 = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('parent_level_id', '=', $level_id)->orderBy('tree_id','ASC')->get();
        if(count($level2) > 0){
            return $level2;
        }else{
            return '';
        }
    }

    public static function getSec_Level($level_id,$company_id)
    {
        $level3 = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('parent_level_id', '=', $level_id)->orderBy('tree_id','ASC')->get();
        if(count($level3) > 0){
            return $level3;
        }else{
            return '';
        }
    }
    public static function getclub_Level($level_id,$company_id)
    {
        $level4 = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('parent_level_id', '=', $level_id)->orderBy('tree_id','ASC')->get();

        return $level4;
    }

    public static function getLevelName($level_id,$company_id)
    {
		$levelName = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('tree_id', '=', $level_id)->first();
        if($levelName){
            return $levelName;
        }else{
			return $levelName = '';
        }

    }
	
	public static function getNewsPermission($news_id)
    {
        $user_id  =  Session::get('user_id');
        $newsList =  RoleAcl::where('user_id',$user_id)->where('news_id',$news_id)->get();
        return $newsList;
    }
	
	public static function getRoleName($role_id)
    {
        $ownerName =  RoleAcl::where('user_id',$role_id)->first();
        return $ownerName->owner_name;
     
    }
	
	public static function getRoleNameRepo($role_id)
    {

        $ownerRepoName =  AclRepository::where('user_id',$role_id)->first();
        return $ownerRepoName->role_name;
    }
	
	public static function getRepositoryPermission($repository_id)
    {
        $user_id  =  Session::get('user_id');
        $repoList =  AclRepository::where('user_id',$user_id)->where('repository_id',$repository_id)->get();
        return $repoList;
    }
    public static function getKnoxSingleUsers($id,$company_id)
    {
        $KNOX_URL = config('constant.Knox_Url');
        $client = new Client();
        try{
            $response = $client->request('GET', $KNOX_URL.'apis/single_user_with_level?user_id='.$id.'&company_id='.$company_id);
            $users_res = $response->getBody()->getContents();
            $users = json_decode($users_res,true);
            $user_data = $users['users'];
            if($user_data){
                $arr['status'] = true;
                $arr['users'] = $user_data;
                return $user_data[0];
            }else{
                $arr['status'] = false;
                $arr['error'] = 'User not found';
            }

        }  catch (RequestException $e) {
            $arr['status'] = false;
            $arr['error'] = 'Server error!';
        }
        return $arr;
    }
	
	public static function getStoreName($venue_id,$company_id)
    {
        $stores = Venue::where('company_id', '=', $company_id)->where('venue_id', '=', $venue_id)->get();
        
        return $stores;
    }
	
	public static function getMemberId($user_id, $venue_id)
    {
        $member_id = VenueSubscrition::select('membership_id')->where('user_id', '=', $user_id)->where('venue_id', '=', $venue_id)->first();
        return $member_id['membership_id'];
    }
	
	public static function getProductCount($product_id,$status)
    {
		$session_data = Session::get('current_post_data');
        if (!empty($session_data)) {
            $filter_term = $session_data['filter_term'];
            if ($filter_term == 'today') {
                $from = date('Y-m-d');
                $to = date('Y-m-d');
            } else if ($filter_term == 'weektodate' || $filter_term == 'monthtodate' | $filter_term == 'yeartodate' | $filter_term == 'yesterday' | $filter_term == 'lastweek' | $filter_term == 'lastmonth' | $filter_term == 'lastyear') {
                if ($filter_term == 'weektodate') {
                    $week_to_date = self::get_week_to_date();
                    $from_and_two = explode('|', $week_to_date);
                } else if ($filter_term == 'monthtodate') {
                    $week_to_date = self::get_month_to_date();
                    $from_and_two = explode('|', $week_to_date);
				}else if ($filter_term == 'yeartodate') {
                    $week_to_date = self::get_year_to_date();
                    $from_and_two = explode('|', $week_to_date);
				}else if ($filter_term == 'yesterday') {
                    $week_to_date = self::get_yesterday();
                    $from_and_two = explode('|', $week_to_date);
                } else if ($filter_term == 'lastweek') {
                    $week_to_date = self::get_last_week();
                    $from_and_two = explode('|', $week_to_date);
                } else if ($filter_term == 'lastmonth') {
                    $week_to_date = self::get_last_month();
                    $from_and_two = explode('|', $week_to_date);
                } else if ($filter_term == 'lastyear') {
                    $week_to_date = self::get_last_year();
                    $from_and_two = explode('|', $week_to_date);
                }
                $from = $from_and_two[0];
                $to = $from_and_two[1];
            } else if ($filter_term == 'daterange') {
				$from = date("Y-m-d", strtotime($session_data['start_date']));
                $to =   date("Y-m-d", strtotime($session_data['end_date']));
            }
			else if ($filter_term == 'member_list' || $filter_term == 'segment_list_dropdown') {
                $product_count = UserVouchers::select('*')->where('product_id','=',$product_id)->where('status','=',1)->count();
                return $product_count;
            }
        } else {
            $from = Session::get('from');
            $to = Session::get('to');
        }
        
        $product_count = UserVouchers::select('*')->where('product_id','=',$product_id)->where('status','=',1) ->whereRaw("user_vouchers.redemption_date >= ? AND user_vouchers.redemption_date <= ?", array($from." 00:00:00", $to." 23:59:59"))->count();
        
        return $product_count;
    }
    
    public static function getStoreid($venue_id,$company_id)
    {
        $stores_res = Venue::where('company_id', '=', $company_id)->where('venue_id', '=', $venue_id)->get();
        if(count($stores_res) > 0){
            return $stores_res;
        }else{
            return '';
        }
    }

    public static function getLevelVeName($venue_id,$company_id)
    {
        $level_venues = DB::table('levels_venues')->select('level_id')->where('company_id', '=', $company_id)->where('venue_id', '=', $venue_id)->first();
        if(count($level_venues) > 0){
            $level_id = $level_venues->level_id;
            $levelName = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('tree_id', '=', $level_id)->first();
            return $levelName->level_name;
        }else{
            return '';
        }
    }

    public static function getlevelID($venue_id,$company_id)
    {
        $level_venues = DB::table('levels_venues')->select('level_id')->where('company_id', '=', $company_id)->where('venue_id', '=', $venue_id)->first();
        if(count($level_venues) > 0){
            $level_id = $level_venues->level_id;
            $levelName = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('tree_id', '=', $level_id)->first();
            return $levelName->level_name.','.$levelName->tree_id;
        }else{
            return '';
        }
    }
	
	public static function getCompanySittings($company_id)
    {
        $settings = DB::table('settings')->where('company_id', '=', $company_id)->first();
        if($settings){
            return $settings;
        }
    }
    public static function getFirst_LevelUser($level,$company_id)
    {
        $users =   User::join('users_mubuss','users.id','=','users_mubuss.user_id')->where('business_id',$company_id)->where('company_level',$level)->get();
        return $users;
    }
    public static function getOrderStoreName($company_id,$bussinessId)
    {
        $orderStoreNames = Venue::where('company_id', '=', $company_id)->where('store_news_id', '=', $bussinessId)->first();
        return $orderStoreNames;
    }
    public static function getUsers($level,$company_id)
    {
        $users =   User::leftJoin('users_mubuss','users.id','=','users_mubuss.user_id')->where('business_id',$company_id)->whereIn('company_level',$level)->get();
        return $users;
    }
    //

    public static function getRolesNames($user_id)
    {
        $news_id =  RoleAcl::select('news_id','id')->where('role_id',$user_id)->where('type','news')->get();
        return $news_id;
    }
    //
    public static function getKnoxUsername($user_id,$company_id)
    {
        $users =   User::join('users_mubuss','users.id','=','users_mubuss.user_id')->where('business_id',$company_id)->where('users.id',$user_id)->first();
        if($users){
            return  $users->username;
        }else{
            return '';
        }
    }
    public static function getUsername($user_id)
    {
        $users =   User::join('users_mubuss','users.id','=','users_mubuss.user_id')->where('users.id',$user_id)->first();
        if($users){
            return  $users->username;
        }else{
            return '';
        }
    }
	
	public static function getCountProducts($category_id){
		
        $settings =  Product::join('category', 'product.category_id', '=', 'category.category_id')->join('product_images', 'product_images.product_id', '=', 'product.product_id')->join('store', 'store.store_id', '=', 'product.store_id')
				->where('product.pos_code', '=', 1)
				->where('product.category_id', '=', $category_id)
				->get();
				
        if(count($settings) > 0){
            return count($settings);
        }else{
            return 0;
        }
    }
	
    //
    public static function TotalSizeRepository($levelId,$company_id)
    {
        $totalSize =   Repository::select('size')->where('level_id',$levelId)->where('company_id',$company_id)->get();
        $sizeArray = [];
        foreach ($totalSize as $repSize)
        {
            //$sizeArray[] = $repSize->size;
            $expSize =     $repSize->size;
            $sizeArray[] = $expSize;
        }
        return array_sum($sizeArray);

    }
	
	public static function getGroupUser($group_id,$company_id)
    {
		$groups =   DB::table('group_members')->select('user_id')->where('group_id',$group_id)->get();
		if(count($groups)){
			$userArray = [];
			foreach($groups as $user){
				$users =   User::join('users_mubuss','users.id','=','users_mubuss.user_id')->where('business_id',$company_id)->where('users.id',$user->user_id)->first();
				$userArray[] = $users;
			}
		}
		return $userArray;
    }
	
	
    public static function getGrpUsers($group_id)
    {
        $grpUsers = DB::table('group_members')->select('user_id')->where('group_id',$group_id)->get();
        return $grpUsers;
    }
	
	public static function getLevels($role_id,$company_id)
    {
		$roles =   DB::table('role_assigns')->select('level_id')->where('role_id',$role_id)->get();
		if(count($roles)){
			$levelArray = [];
			foreach($roles as $level){
				
				$levelName = Companies_Hirarchy::where('comp_id', '=', $company_id)->where('tree_id', '=', $level->level_id)->first();
            	//return $levelName->level_name;
				$levelArray[] = $levelName;
			}
		}
		return $levelArray;
    }
	
	public static function getRoleLevel($role_id)
    {
        $reoleLevels = DB::table('role_assigns')->select('level_id')->where('role_id',$role_id)->get();
        return $reoleLevels;
    }
    public static function getRepoLevels($level_id)
    {
        $levels  = LevelVenues::where('level_id',$level_id)->first();
        if ($levels){
            return $levels->level_id;
        }else{
            return "";
        }
    }

    /**
     * @param $user_level
     * @return bool
     */
    public static function setDefaulLevelSize($user_level)
    {
        $company_id  =    Session::get('company_id');
        $user_id     =    Session::get('user_id');
        $venueStorage =   VenuesStorage::select('*')->where('level_id',$user_level)->where('company_id',$company_id)->first();
        if($venueStorage){
            return false;

        }else{
            //echo 'ssssss';exit;
            $id = DB::table('venue_storages')->insertGetId(['company_id' => $company_id,'user_id' => $user_id,'level_id' => $user_level,'venue_repo_size' => 500]);
            return true;
        }
        // exit();
    }
	
	public static function getLevelRoleName($user_id)
    {
		$company_id  =    Session::get('company_id');
        $level_role = DB::table('role_level_users')->select('role_id')->where('user_id', '=', $user_id)->first();
        if(!empty($level_role)){
            $role_id = $level_role->role_id;
            $roleName = Role::where('id', '=', $role_id)->where('company_id',$company_id)->first();
			if(!empty($roleName)){
            	return $roleName->name;
			}else{
				return '';
			}
        }else{
            return '';
        }
    }
	
	public static function getCompanyKeySittings($amplify_AP1_key){
        $settings = Setting::where('amplify_api_key', '=', $amplify_AP1_key)->first();
        if(count($settings) > 0){
            return $settings;
        }else{
            return '';
        }
    }
		
	public static function getBowserSids($bowser_id){
        $bowserSides = BowserSides::where('bowser_id', '=', $bowser_id)->get();
        if(count($bowserSides) > 0){
            return $bowserSides;
        }else{
            return '';
        }
    }
    
    public static function getBowserSidsHoses($bowser_side_id){
        $bowserSideHoses = BowserSideHoses::where('bowser_side_id', '=', $bowser_side_id)->get();
        return count($bowserSideHoses);
    }
	
	public static function getSourceType($type_id)
    {
		$connection = 'mysqldashboard';
        $sourceType  =         DB::connection($connection)->table('datasource_types')->select('title')->where('id', '=', $type_id)->first();
		if($sourceType){
			return $sourceType->title;
		}else{
			return '';
		}
    }
	
	public static function get_last_month(){
        $start_date = date("Y-n-j", strtotime("first day of previous month"));
        $end_date   = date("Y-n-j", strtotime("last day of previous month"));
        return $start_date."|".$end_date;
    }

    public static function get_month_to_date(){
        $month = date('m');
        $year = date('Y');
        $start_date = "{$year}-{$month}-01";
        $end_data = date("Y-m-d");
        return $start_date."|".$end_data;
    }

    public static function get_year_to_date(){
        $year = date('Y');
        $end_data = date("Y-m-d");
        $start_date = "{$year}-01-01";
        return $start_date."|".$end_data;
    }

    public static function get_last_year(){
        $year = date('Y') - 1;
        $start_date = "{$year}-01-01";
        $end_date = "{$year}-12-31";
        return $start_date."|".$end_date;
    }

    public static function get_week_to_date(){
        $start_date = date("Y-m-d", strtotime('monday this week'));
        $end_date = date("Y-m-d");
        return $start_date."|".$end_date;
    }

    public static function get_last_week(){
        $previous_week = strtotime("-1 week +1 day");
        $start_week = strtotime("last sunday midnight",$previous_week);
        $end_week = strtotime("next saturday",$start_week);
        $start_week = date("Y-m-d",$start_week);
        $end_week = date("Y-m-d",$end_week);
        return $start_week."|".$end_week;
    }

    public static function get_yesterday(){
        $start_date = date('Y-m-d',strtotime("-1 days"));
        $end_date = date('Y-m-d',strtotime("-1 days"));
        return $start_date."|".$end_date;
    }

    public static function getBeacon_Data($floor_id,$level_id,$filters)
    {
        $commennClass = New CommonLibrary;
        $hotspot_json = $commennClass->getHotSpotsData($filters);
        $hotspotArr = json_decode($hotspot_json,true);
        $hotspotArr = $hotspotArr['data']['venueUtilisation'];
        $hotspotArr = $commennClass->sum_beacon_data($hotspotArr);

        $floorBeacons = (isset($hotspotArr[$level_id]))?$hotspotArr[$level_id]:[];
        $locArr = [];
        $beacons = [];
        if(count($floorBeacons)>0) {
            foreach ($floorBeacons as $bec_row) {
                $beacon_id = $bec_row['key'];
                $beacon_users = $bec_row['doc_count'];
                $beacon_row = DB::table('beacon_configurations')->where(['id' => $beacon_id, 'level_id' => $level_id])->first();
                if ($beacon_row) {
                    $locArr['id'] = $beacon_row->id;
                    $locArr['title'] = 'Beacon Name:' . $beacon_row->beacon_name . ' Major:' . $beacon_row->major . ' Minor:' . $beacon_row->minor . ' Total Vistors:' . $beacon_users . ' Unique Vistors:12';
                    $locArr['x_axis'] = $beacon_row->x_coordinate;
                    $locArr['y_axis'] = $beacon_row->y_coordinate;
                    $locArr['zoom'] = "10";
                    $locArr['total'] = $beacon_users;
                    $beacons[] = $locArr;
                }
            }
            return $beacons;
        }else{
            return $beacons;
        }
    }

    public function getHotSpotsData($filters){
        $venue_id =  request()->session()->get('venue_id');
        $filters_arr = json_decode($filters);
        $start_date =  $filters_arr->start_date;
        $end_date =  $filters_arr->end_date;
        $segment_list =  json_encode($filters_arr->segment_list);
        $weekDays =  $filters_arr->weekDays;

        $curl = curl_init();
        $amplify_URL = config('constant.amplify_URL');

        $end_url = $amplify_URL.'DashboardReporting/all_venue_utilization_heatmap';

        curl_setopt_array($curl, array(
            CURLOPT_URL => $end_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\r\n \"venue_id\": \"$venue_id\",\r\n \"start_date\": \"$start_date\",\r\n \"end_date\": \"$end_date\",\r\n \"segment_id\": {\r\n  \"id\": $segment_list\r\n },\r\n \"dayOfWeek\": $weekDays\r\n}",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                "postman-token: ad597b39-0021-4a85-ca50-fc8d28c6db28",
                "x-api-key: PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            return  $response;
        }
    }

    public function sum_beacon_data($hotspotArr){
        $newArr = [];

        if(!empty($hotspotArr)){
            foreach($hotspotArr as $segment):
                foreach($segment as $fkey =>  $floors):
                    foreach ($floors as $bkey => $val):
                        $becArr = [];
                        $becArr['key'] = $val['key'];
                        $becArr['doc_count'] = $val['doc_count']+$val['doc_count'];
                        $newArr[$fkey][$bkey] = $becArr;
                    endforeach;
                endforeach;
            endforeach;
            return $newArr;
        }else{
            return $newArr;
        }

    }
}

?>