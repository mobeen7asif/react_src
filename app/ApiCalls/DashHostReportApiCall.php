<?php

namespace App\ApiCalls;

use App\ApiCalls\BaseReportApiCall;
use DB;
use Illuminate\Support\Facades\Session;

class DashHostReportApiCall extends BaseReportApiCall {

    private $baseUrl;
    private $baseUrl2;
    private $header;

    /*sonar constants*/
    const TOTAL                     = 'total';
    const CHANNEL                   = 'Channel';
    const POINTME                   = 'POINTME';
    const EMAIL                     = 'EMAIL';
    const TOTAL_MEMBERS             = 'total_members';
    const TOTAL_CAMP                = 'total_camp';
    const SET_FORGET_CAMP           = 'set_forget_camp';
    const PROXY_CAMP                = 'prox_camp';
    const STANDARD_CAMP             = 'standard_camp';
    const VENUE_ID                  = 'venue_id';
    const JSON                      = '[{"name":"No Name","total_members":0,"y":100}]';
    const TOTAL_PATRONS             = 'total_patrons';
    const AVG_CAMP_REDEMPTION       = 'average_campaign_redemption';
    const TOP_PERFORMING_CAMPAIGNS  = 'top_performing_campaigns';
    const TOTAL_MEMBERSHIP          = 'total_membership';
    const CLUB_MEMBERS              = 'clubNewmembers';
    const POINT_ME                  = 'pointme';
    const E_MAIL                    = 'email';
    const ALL_UNSUB_VENUES          = 'all_unsub_venues';
    const POINTME_UNSUB_VENUES      = 'pointme_unsub_venues';
    const EMAIL_UNSUB_VENUES        = 'email_unsub_venues';
    const SMS_UNSUB_VENUES          = 'sms_unsub_venues';

    public function __construct() {
        parent::__construct();
        $this->baseUrl = config('constant.amplify_URL') . "DashboardReporting/";
        $this->baseUrl2 = config('constant.amplify_URL') . "HomePageReporting/";
        $this->header = ["X-API-KEY" => "PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"];
    }

    public function getChannelUtilization() {
        $retData = ['last_week'=>self::JSON,
                    'last_three_month'=>self::JSON,
                    'all'=>self::JSON];
        $url = $this->baseUrl . 'channel_utilisation_chart';
        $data = [];
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                
                $optionArr = ['last_week','last_three_month','all'];
            foreach($optionArr as $optV):
                if(isset($res_arr['data'][$optV])){
                    $dataArr = $res_arr['data'][$optV];
                    $total = isset($dataArr[self::TOTAL]) ? $dataArr[self::TOTAL] : 0;
                    if (isset($dataArr[self::CHANNEL]) && !empty($dataArr[self::CHANNEL]) && $total > 0) {
                        $chnlArr = $dataArr[self::CHANNEL];

                        $pointme = (isset($chnlArr[self::POINTME])) ? $chnlArr[self::POINTME] : 0;
                        $email = (isset($chnlArr[self::EMAIL])) ? $chnlArr[self::EMAIL] : 0;
                        $sms = (isset($chnlArr['SMS'])) ? $chnlArr['SMS'] : 0;

                        $pointme_prcnt = intval(($pointme / $total) * 100);
                        $email_prcnt = intval(($email / $total) * 100);
                        $sms_prcnt = intval(($sms / $total) * 100);

                        $channel = [
                            ['name' => self::POINTME, self::TOTAL_MEMBERS => $pointme, 'y' => $pointme_prcnt],
                            ['name' => self::EMAIL, self::TOTAL_MEMBERS => $email, 'y' => $email_prcnt],
                            ['name' => 'SMS', self::TOTAL_MEMBERS => $sms, 'y' => $sms_prcnt]
                        ];
                    
                        $retData[$optV] = json_encode($channel);
                    } 
                }
            endforeach;
            }
        }
       
        return $retData;
    }

    public function getActiveCampaignsData($venue_id) {
        $retData = [self::TOTAL_CAMP => 0, self::SET_FORGET_CAMP => 0, self::PROXY_CAMP => 0, self::STANDARD_CAMP => 0];
        $url = $this->baseUrl . 'active_campaign_chart';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];

                $total = (isset($dataArr[self::TOTAL][self::TOTAL_CAMP])) ? $dataArr[self::TOTAL][self::TOTAL_CAMP] : 0;

                $retData[self::TOTAL_CAMP] = $total;
                if (isset($dataArr[self::CHANNEL]) && $total > 0) {
                    $chnlArr = $dataArr[self::CHANNEL];

                    foreach ($chnlArr as $chnl):
                        if (isset($chnl['type']) && isset($chnl[self::TOTAL])):
                            if ($chnl['type'] == 'Send & Forget') {
                                $retData[self::SET_FORGET_CAMP] = $chnl[self::TOTAL];
                            } else if ($chnl['type'] == 'Proximity') {
                                $retData[self::PROXY_CAMP] = $chnl[self::TOTAL];
                            } else if ($chnl['type'] == 'Standard') {
                                $retData[self::STANDARD_CAMP] = $chnl[self::TOTAL];
                            }
                        endif;
                    endforeach;
                }
            }
        }

        return $retData;
    }

    public function getPointmeUsers($venue_id) {

        $retData = ['pointme_users_percentage' => 0, self::TOTAL_PATRONS => 0];
        $url = $this->baseUrl . 'pointme_users_chart';
        $data[self::VENUE_ID] = $venue_id;
     
        $resData = $this->rawPost($url, $this->header, $data,0);
   
        if ($resData) {
            $res_arr = json_decode($resData, true);
                  
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];
                
                $pointme_users = (isset($dataArr['pointme_users'])) ? $dataArr['pointme_users'] : 0;
                $total_patrons = (isset($dataArr[self::TOTAL_PATRONS])) ? $dataArr[self::TOTAL_PATRONS] : 0;
             
                if ($total_patrons > 0) {
                    $pm_per = ($pointme_users/$total_patrons) * 100;

                    $retData['pointme_users_percentage'] = round($pm_per,1);
                    $retData[self::TOTAL_PATRONS] =  $pointme_users;
                  
                }
            }
        }
 
        return $retData;
    }

    public function average_campaign_redemption_chart() {

        $retData = ['KIOSK' => 0, self::POINTME => 0, 'SMS' => 0, self::EMAIL => 0];
        $url = $this->baseUrl . 'average_campaign_redemption_chart';
        $data[self::VENUE_ID] = 0;
        $resData = $this->post($url, $this->header , $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            $dataArr = $res_arr['data'];
            if (isset($dataArr[self::AVG_CAMP_REDEMPTION]) && !empty($dataArr[self::AVG_CAMP_REDEMPTION])) {
                $retData = $dataArr[self::AVG_CAMP_REDEMPTION];
            }
        }
        return $retData;
    }

    public function best_campaign_redemption()
    {
        $result = [];
        $url = $this->baseUrl . 'best_campaign_redemption_chart';
        $data[self::VENUE_ID] = 0;
        $resData = $this->post($url, $this->header , $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            $dataArr = $res_arr['data'];
            if (isset($dataArr[self::TOP_PERFORMING_CAMPAIGNS]) && !empty($dataArr[self::TOP_PERFORMING_CAMPAIGNS])) {
                $retData = $dataArr[self::TOP_PERFORMING_CAMPAIGNS];
                $result = [];
                foreach($retData as $key => $value){
                    $venue_exp =  explode('_' , $key);
                    $venue_id = $venue_exp[2];
                    $venue_data = DB::table('venues')->where(self::VENUE_ID , $venue_id)->first();
                    $name = $venue_data->venue_name;
                    array_push($result,array("name"=>$name,"y"=>$value));
                }
            }
        }
        return $result;
    }

    public function getActivePointmeCampaignsData($venue_id) {
        $retData = [self::SET_FORGET_CAMP => 0, self::PROXY_CAMP => 0, self::STANDARD_CAMP => 0];
        $url = $this->baseUrl . 'active_pointme_campaigns';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];

                if (isset($dataArr['pointme_campaigns'])) {
                    $chnlArr = $dataArr['pointme_campaigns'];

                    foreach ($chnlArr as $chnl):
                        if (isset($chnl['type']) && isset($chnl[self::TOTAL])):
                            if ($chnl['type'] == 'Send & Forget') {
                                $retData[self::SET_FORGET_CAMP] = $chnl[self::TOTAL];
                            } else if ($chnl['type'] == 'Proximity') {
                                $retData[self::PROXY_CAMP] = $chnl[self::TOTAL];
                            } else if ($chnl['type'] == 'Standard') {
                                $retData[self::STANDARD_CAMP] = $chnl[self::TOTAL];
                            }
                        endif;
                    endforeach;
                }
            }
        }

        return $retData;
    }

    public function getMemberVisitationHost($venue_id) {
        $retData = 0;
        $url = $this->baseUrl2 . 'total_members_visitation';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_visit_percent'])) ? $dataArr['total_member_visit_percent'] : 0;
            }
        }

        return $retData;
    }

    public function getMemberTurnoverHost($venue_id) {
        $retData = 0;
        $url = $this->baseUrl2 . 'total_members_turnover';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_pos_percent'])) ? $dataArr['total_member_pos_percent'] : 0;
            }
        }

        return $retData;
    }

    public function getMemberPointmeHost($venue_id) {
        $retData = 0;
        $url = $this->baseUrl2 . 'total_members_pointme_dwell';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_dwell_percent'])) ? $dataArr['total_member_dwell_percent'] : 0;
            }
        }

        return $retData;
    }

    public function getTotalAndAlveoMembership($venue_id) {

        $retData = [self::TOTAL_MEMBERSHIP => 0, self::CLUB_MEMBERS => 0];
        $url = $this->baseUrl . 'alveo_venues_membership';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                $retData[self::TOTAL_MEMBERSHIP] = (isset($dataArr[self::TOTAL_MEMBERSHIP])) ? $dataArr[self::TOTAL_MEMBERSHIP] : 0;
                $retData[self::CLUB_MEMBERS] = (isset($dataArr[self::CLUB_MEMBERS])) ? $dataArr[self::CLUB_MEMBERS] : 0;
            }
        }

        return $retData;
    }
    
    public function getAverageVenueLinked() {
        $retData = 0;
        $url = url('/api/average_venues');
        $resData = $this->get($url);
        if ($resData) {
            $res_arr = json_decode($resData, true);

            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                 $retData = (isset($dataArr['average_venues'])) ? $dataArr['average_venues'] : 0;
            }
        }

        return $retData;
    }
    
    public function getHighestUnsbuscribeRate() {

        $retData = ['all'       =>  ['rate' => [["name"=>"","y"=>0]], 'avg' => 0],
                    self::POINT_ME   =>  ['rate' => [["name"=>"","y"=>20]], 'avg' => 0],
                    'sms'       =>  ['rate' => [["name"=>"","y"=>10]], 'avg' => 0],
                    self::E_MAIL     =>  ['rate' => [["name"=>"","y"=>0]], 'avg' => 0]
                    ];
        $url = $this->baseUrl . 'highest_unsubscribe_rates';
        
        $data = [
            "start_date"=>date('Y-m-d 00:00:00',strtotime('-7 days')),
            "end_date" => date('Y-m-d 00:00:00',strtotime('+1 days'))
        ];
     
        $resData = $this->rawPost($url, $this->header, $data);

        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $unsubdataArr = $res_arr['data'];
                
                if(isset($unsubdataArr['all_unsub']))
                {
                    $allArr = $unsubdataArr['all_unsub'];
                    if(isset($allArr[self::ALL_UNSUB_VENUES])&& count($allArr[self::ALL_UNSUB_VENUES])>0)
                    {    
                    $all_json_Arr = [];
                    $limit= 1;
                    foreach($allArr[self::ALL_UNSUB_VENUES] as $key => $v):
                      if($limit < 6):
                        $popData = [];
                        $popData['name'] = $key;
                        $popData['y']    = round($v);
                        $all_json_Arr[] = $popData;
                      endif;
                        $limit++;
                    endforeach;
                    $retData['all']['rate'] = $all_json_Arr;
                    }
                    $retData['all']['avg'] = (isset($allArr['all_unsub_avg']))?round($allArr['all_unsub_avg']):0;
                }
                
                if(isset($unsubdataArr['pointme_unsub']))
                {
                    $pointArr = $unsubdataArr['pointme_unsub'];
                    if(isset($pointArr[self::POINTME_UNSUB_VENUES])&& count($pointArr[self::POINTME_UNSUB_VENUES])>0)
                    {
                    $pointme_json_Arr = [];
                    $limit= 1;
                    foreach($pointArr[self::POINTME_UNSUB_VENUES] as $key => $v):
                        if($limit < 6):
                            $popData = [];
                            $popData['name'] = $key;
                            $popData['y']    = round($v);
                            $pointme_json_Arr[] = $popData;
                        endif;
                        $limit++;
                    endforeach;
                    $retData[self::POINT_ME]['rate'] = $pointme_json_Arr;
                    }
                    $retData[self::POINT_ME]['avg'] = (isset($pointArr['pointme_unsub_avg']))?round($pointArr['pointme_unsub_avg']):0;
                }
                
                if(isset($unsubdataArr['email_unsub']))
                {
                    $emailArr = $unsubdataArr['email_unsub'];
                    if(isset($emailArr[self::EMAIL_UNSUB_VENUES])&& count($emailArr[self::EMAIL_UNSUB_VENUES])>0)
                    {
                    $email_json_Arr = [];
                    $limit= 1;
                    foreach($emailArr[self::EMAIL_UNSUB_VENUES] as $key => $v):
                        if($limit < 6):
                            $popData = [];
                            $popData['name'] = $key;
                            $popData['y']    = round($v);
                            $email_json_Arr[] = $popData;
                        endif;
                        $limit++;
                    endforeach;
                    $retData[self::E_MAIL]['rate'] = $email_json_Arr;
                    }
                    $retData[self::E_MAIL]['avg'] = (isset($emailArr['email_unsub_avg']))?round($emailArr['email_unsub_avg']):0;
                }
                
                if(isset($unsubdataArr['sms_unsub']))
                {
                    $smsArr = $unsubdataArr['sms_unsub'];
                    if(isset($smsArr[self::SMS_UNSUB_VENUES])&& count($smsArr[self::SMS_UNSUB_VENUES])>0)
                    {
                    $sms_json_Arr = [];
                    $limit= 1;
                    foreach($smsArr[self::SMS_UNSUB_VENUES] as $key => $v):
                        if($limit < 6):
                            $popData = [];
                            $popData['name'] = $key;
                            $popData['y']    = round($v);
                            $sms_json_Arr[] = $popData;
                        endif;
                        $limit++;
                    endforeach;
                    $retData['sms']['rate'] = $sms_json_Arr;
                    }
                    $retData['sms']['avg'] = (isset($smsArr['sms_unsub_avg']))?round($smsArr['sms_unsub_avg']):0;
                }
            }
        }
        return $retData;
    }

    
    
    
    
    
}
