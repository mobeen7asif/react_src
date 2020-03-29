<?php 
namespace App\Classes;
use Session;
use Redirect;
// use Illuminate\Http\Request;
use Request;
use Cookie;
use URL;
use DB;
use App\CommonModel;

class CommonLibrary_old {
	
  public function verifyLogin() {
	  
    $admin_id =  Session::get('admin_id');
	$facebook_id = Session::get('facebook_id');
	
	if($admin_id == "" && $facebook_id == ""){
		
		Session::flash('login_error_message', 'You are not login.Please login to continue.');
		redirect()->to('/admin/login')->send(); 
	}
	
  }
  
  
  
  public function verifyBuyerLogin() {
	  
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


public function verifyFrontLogin() {
	  
    $user_id =  Session::get('user_id');
	
	if($user_id == ""){
		
		Session::flash('error_message', 'You are not login.Please login to continue.');
		 redirect()->to('/')->send(); 
	}
  }
  
  
 public static function get_curency(){
  //$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1));   
  $currency = DB::table("settings")
  ->select("*")
  ->where("id",'=',1)->first();
  return $currency->settings_currency;
}

public static function get_curency_code(){
  //$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1));   
  $currency = DB::table("settings")
  ->select("*")
  ->where("id",'=',1)->first();
  return $currency->settings_currency_code;
}

public static function get_content(){
  //$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1));   
  $contact = DB::table("settings")
  ->select("*")
  ->where("id",'=',1)->first();
  return $contact->settings_contact_seller;
}

public static function get_content_paypal(){
  //$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1));   
  $contact = DB::table("settings")
  ->select("*")
  ->where("id",'=',1)->first();
  return $contact->setting_paypal_msg;
}

public static function get_email(){
  //$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1));   
  $email = DB::table("settings")
  ->select("*")
  ->where("id",'=',1)->first();
  return $email->settings_email;
}

  public static function get_setting(){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$setting_obj = DB::table("settings")
		->select("*")
		->where("id",'=',1)->first();
		return $setting_obj;
}
public static function get_uni_name($uni_id){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$universities_obj = DB::table("universities")
		->select("*")
		->where("uni_id",'=',$uni_id)->first();
		return $universities_obj;
}

public static function get_user_name($user_id){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$users_obj = DB::table("users")
		->select("*")
		->where("user_id",'=',$user_id)->first();
		return $users_obj;
}

public static function get_cat_name($cat_id){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$cat_obj = DB::table("categories")
		->select("*")
		->where("cat_id",'=',$cat_id)->first();
		return $cat_obj;
}

public static function get_order_info($order_id){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$oredr_obj = DB::table("order")
		->select("*")
		->where("order_id",'=',$order_id)->first();
		return $oredr_obj;
}




  
  public static function get_categories($parent_id){
		//$currency = $this->commonModel->selectSingleRow('*','settings',array('setting_id'=>1)); 		
		$categories = DB::table("categories")
		->select("*")
		->where("parent_id",'=',$parent_id)->get();
		return $categories;
}




public static function get_user_balance(){
	
	$user_id = Session::get('user_id');
	$desposited_obj = DB::table("transactions")
		->selectRaw(DB::raw('SUM(transaction_amount) as total_balance'))
		->where("user_from",'=',$user_id)
		->where("transaction_status","=",1)
		->where("transaction_type","=",1)->first();
	
	
	$total_balance = 	$desposited_obj->total_balance;
	if($desposited_obj->total_balance == 0){
		$total_balance = 0;
	}	
	
	
	
	$transfer_obj = DB::table("transactions")
		->selectRaw(DB::raw('SUM(actual_amount) as total_transfer'))
		->where("user_from",'=',$user_id)
		->where("transaction_status","=",1)
		->where("transaction_type","=",2)->first();
		
	$total_transfer = 	$transfer_obj->total_transfer;
	if($transfer_obj->total_transfer == 0){
		$total_transfer = 0;
	}		
		
	
	$withdraw_obj = DB::table("transactions")
		->selectRaw(DB::raw('SUM(actual_amount) as total_withdraw'))
		->where("user_from",'=',$user_id)
		->where("transaction_status","=",1)
		->where("transaction_type","=",3)->first();
	
	$total_withdraw = 	$withdraw_obj->total_withdraw;
	if($withdraw_obj->total_withdraw == 0){
		$total_withdraw = 0;
	}		
	
	$fee_obj = DB::table("transactions")
		->selectRaw(DB::raw('SUM(transaction_amount) as total_fee'))
		->where("user_from",'=',$user_id)
		->where("transaction_status","=",1)
		->where("transaction_type","=",4)->first();	
		
	
							
	
	$total_fee = 	$fee_obj->total_fee;
	if($fee_obj->total_fee == 0){
		$total_fee = 0;
	}	
	
	$refund_obj = DB::table("transactions")
		->selectRaw(DB::raw('SUM(transaction_amount) as total_refund'))
		->where("user_from",'=',$user_id)
		->where("transaction_status","=",1)
		->where("transaction_type","=",5)->first();	
	
	$total_refund = 	$refund_obj->total_refund;
	if($refund_obj->total_refund == 0){
		$total_refund = 0;
	}
	
	return $final_balance = $total_refund + $total_balance - $total_transfer - $total_withdraw; 	
	
}



function remove_remember_me_cookie(){
    $cookie = Cookie::forget('user_email');
    $cookie1 = Cookie::forget('user_password');
    $cookie2 = Cookie::forget('remember_me');
}

    function remember_me_cookie_login(){
        
        $user_id            = Session::get('user_id');
        
        if(!$user_id){
            
            if(Request::cookie('remember_me') == 'yes'){
                
        
            $arr['user_email']      = Request::cookie('user_email');
            $arr['user_password']   = Request::cookie('user_password');
	
        
            // $userInfo = $this->commonModel->select('*','users',$arr);
            
            $userInfo = DB::table("users")->select("*")->where($arr)->get();
            
            
            if(count($userInfo) > 0){
                 // echo 'found'; exit;
                
                $userInfo = $userInfo[0];
                
                Session::put('user_id' ,$userInfo->user_id);
                Session::put('user_email' ,$userInfo->user_email);
                Session::put('user_fullname' ,$userInfo->user_fname.' '.$userInfo->user_lname);
                Session::put('user_phone' ,$userInfo->user_phone);
                Session::put('user_address' ,$userInfo->user_address);
                Session::put('user_city' ,$userInfo->user_city);
                Session::put('user_state' ,$userInfo->user_state);
                Session::put('user_image' ,$userInfo->user_image);
		Session::put('user_type',$userInfo->user_type);
                
                          
                if($userInfo->user_status == 2){
                    $this->remove_remember_me_cookie();
                }
                
                    Cookie::queue('user_email', $arr['user_email'],1209600);
                    Cookie::queue('user_password', $arr['user_password'],1209600);
                    Cookie::queue('remember_me', 'yes',1209600);
                
            }else{
               // echo 'found'; exit;
                $this->remove_remember_me_cookie();
            } 
        }
        }
    } // fun end

	
	
public static function get_productName($id = "")
{
	$resu = DB::table("products")
	->select("product_title")
	->where("product_id",'=', $id)->first();
	$product_name = $resu->product_title;
	return $product_name;
}

public static function get_username($id = "")
{
	$resu = DB::table("users")
	->select("user_fullname")
	->where("user_id",'=', $id)->first();
	$user_name = $resu->user_fullname;
	return $user_name;
}

public static function get_category_name($id = "")
{
	$resu = DB::table("categories")
	->select("cat_name")
	->where("cat_id",'=', $id)->first();
	$cat_name = $resu->cat_name;
	return $cat_name;
}

public static function get_delivery_option($id = "")
{
	$resu = DB::table("delivery_option")
	->select("*")
	->where("delivery_id",'=', $id)->first();
	$delivery_title = $resu->delivery_title;
	$delivery_cost = $resu->delivery_cost;
	return $delivery_title.'-$'.$delivery_cost;
}

public static function get_delivery_cost($id = "")
{
	$resu = DB::table("delivery_option")
	->select("*")
	->where("delivery_id",'=', $id)->first();
	$row_count = count($resu);
	if($row_count != 0){
		$delivery_cost = $resu->delivery_cost;
		return $delivery_cost;
	}else{
		$delivery_cost = 0;
		return $delivery_cost;
	}
	
}


public static function get_user_image($id = "")
{
	$resu = DB::table("users")
	->select("user_image")
	->where("user_id",'=', $id)->first();
	$user_image = $resu->user_image;
	return $user_image;
}

public static function get_user_verified($id = "")
{
	$resu = DB::table("users")
	->select("is_varified")
	->where("user_id",'=', $id)->first();
	$is_varified = $resu->is_varified;
	return $is_varified;
}
	
	public static function get_days($date_database = ""){

		$current_date = date("Y-m-d");        
		$db_date = date('Y-m-d',$date_database);          
		$diff_header = abs(strtotime($current_date) - strtotime($db_date));
		$total_days_header = floor ($diff_header /  (60*60*24));
		
		$msg_time_header = $total_days_header ." days ago";
							
		if($current_date == $db_date){
			$hours_diff = abs(time() - $date_database);
			$msg_time_header = floor($hours_diff / (60*60))." hours ago";
			
			if(floor($hours_diff / (60*60)) == 0){
				$msg_time_header = floor($hours_diff / (60))." mins ago";
			}
			
			
		}
		
		return $msg_time_header;
	}	

	
	
	public static function get_product_detail($product_id)
	{
		 $product_obj = DB::table("products")
		 ->select("*")
		 ->where("product_id",'=',$product_id)->get();
		 
		 return $product_obj;
	}
	
	public static function get_userlike_count($product_id)
	{
		 $like_obj = DB::table("favourites_items")
		 ->select("*")
		 ->where("product_id",'=',$product_id)
		 ->get();
		 $like_count = count($like_obj);
		 return $like_count;
	}
	
	public static function get_review_count($product_id)
	{
		 $review_obj = DB::table("customer_reviews")
		 ->select("*")
		 ->where("product_id",'=',$product_id)
		 ->get();
		 $review_count = count($review_obj);
		 return $review_count;
	}
	
	public static function sold_product_detail($product_id)
	{
		 $product_obj = DB::table("products")
		 ->select("*")
		 ->where("product_id",'=',$product_id)->get();
		 return $product_obj;
	}
	
	public static function get_user_detail($user_id)
	{
		 $users_obj = DB::table("users")
		 ->select("*")
		 ->where("user_id",'=',$user_id)->first();
		 return $users_obj;
	}
	
	public static function fav_product_detail($product_id)
	{
	   $product_obj = DB::table("products")
	   ->select("*")
	   ->where("product_id",'=',$product_id)->get();
	   return $product_obj;
	 }
	




}

?>