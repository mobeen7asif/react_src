<?php

namespace App\Http\Controllers\API;

use App\Mail\TestEmail;
use App\Models\EmailTemplate;
use App\Utility\TagReplacementUtility;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\API\UserApiController;

class TestEmailController extends Controller
{
    const DEFAULT                   = 'default';


    public function sendEmail(Request $request)
    {

        //$res = DB::table("venue_configurations_test_alerts")->where("venue_id",request()->venue_id)->first();
        $usersEmail = request()->email;
        $users = DB::table("users")->whereIn("email",$usersEmail)->get();
        $html = "";
        $data = EmailTemplate::select('html')->where('id', $request->template_id)->first();
        if($users){
            foreach ($users as $key => $value){
                if(!empty($data))
                    $html = $data->html;

                $html = (new TagReplacementUtility())->generateTagText($html,request()->venue_id,$value->user_id);
                (new UserApiController())->sendEmailToVerification($value->email, 'test email', $html);
            }

        }
        return ['status' => true,'message' =>'Successfully send'];
    }


    public function sendSms()
    {
        try {

            if (empty($route)) {
                $route = self::DEFAULT;
            }

            $http = new \GuzzleHttp\Client();
            $message = request()->channel_data['message'];

            if(request()->current_channel == "sms"){
                foreach (request()->mobile as $key => $value){
                    $users = DB::table("users")->where("user_mobile",$value)->first();
                    $user_message = (new TagReplacementUtility())->generateTagText($message,request()->venue_id,$users->user_id??0);

                    $response = $http->post(config('constant.JAVA_URL') . 'sendSMS', [
                        'headers' => array(),
                        'json' => [
                            'mobile' => $value,
                            "route" => "default",
                            'message_txt' => $user_message,
                        ]
                    ]);
                    $smsResponse = json_decode($response->getBody(), true);
                }
            }else{

                foreach (request()->push as $key => $value){
                    $users = DB::table("users")->where("user_id",$value)->first();
                    $user_message = (new TagReplacementUtility())->generateTagText($message,request()->venue_id,$users->user_id??0);
                    $response = $http->post(config('constant.JAVA_URL') . 'sendTestPushToUser', [
                        'headers' => array(),
                        'json' => [
                            'notification_type' => "push",
                            'petronID' => $value,
                            'message' => $user_message
                        ]
                    ]);
                    $smsResponse = json_decode($response->getBody(), true);

                }
            }



            if ($smsResponse["status"]) {
                return ["status"=>true,"message"=>"Sms sent successfully"];
            } else {
                return ["status"=>false,"message"=>"Something went wrong"];
            }
        } catch (\Exception $e) {
            return ["status"=>false,"message"=>$e->getMessage()];

        }
    }//--- End of sendSms() ---//

}
