<?php
namespace App\ApiCalls;
use App\ApiCalls\BaseReportApiCall;


class DashboardReportApiCall extends BaseReportApiCall
{
    private $baseUrl;
    private $header;

    /*sonar constants*/
    const VENUE_ID                  = 'venue_id';
    const TOTAL_MEMBERS             = 'total_members';
    const POINT_ME_PERCENT          = 'point_me_percent';
    const NEW_MEMBERS               = 'new_members';
    const STATUS                    = 'status';
    const GAMING_TURNOVER           = 'gaming_turnover';
    const TOP_PERFORMING_CAMPAIGNS  = 'top_performing_campaigns';

    
    public function __construct() {
        parent::__construct();
        $this->baseUrl = config('constant.amplify_URL')."DashboardReporting/";
        $this->header = ["X-API-KEY"=>"PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"];
    }
    
    public function getActiveCampaigns($venue_id)
    {
        $url = $this->baseUrl.'active_campaigns';
        $data[self::VENUE_ID] = $venue_id;
        $active_camp_data = $this->rawPost($url, $this->header, $data);
        return ($active_camp_data)?$active_camp_data:0;
    }
    
    public function getRecentlyFinished($venue_id)
    {
        $url = $this->baseUrl.'recently_finished_campaigns';
        $data[self::VENUE_ID] = $venue_id;
       $recent_finish_data = $this->rawPost($url, $this->header, $data);
        if($recent_finish_data)
        {
            $rf_json = json_decode($recent_finish_data);
            if(isset($rf_json->status) && $rf_json->status){
                return isset($rf_json->data->total)?$rf_json->data->total:0;
            }
            else{
                return 0;
            }
        }else
        {
            return 0;
        }
    }
    
    public function getMembersPointMe($venue_id)
    {
        $pointMe = [self::TOTAL_MEMBERS=>0,self::POINT_ME_PERCENT=>0];
        $url = $this->baseUrl.'pointme_users';
        $data[self::VENUE_ID] = $venue_id;
       $members_point_me = $this->rawPost($url, $this->header, $data);

        if($members_point_me)
        {
            $mpm_json = json_decode($members_point_me);

            if(isset($mpm_json->status) && $mpm_json->status):
            
                $pointme_users = isset($mpm_json->data->pointme_users)?$mpm_json->data->pointme_users:0;
                $total_users = isset($mpm_json->data->total_patrons)?$mpm_json->data->total_patrons:0;
                $pointMe[self::TOTAL_MEMBERS] = $pointme_users;
                $pointMe[self::POINT_ME_PERCENT] = (!empty($total_users) || $total_users > 0)?(($pointme_users/$total_users) * 100):0;
                $pointMe[self::POINT_ME_PERCENT] = round($pointMe['point_me_percent'],1);
            endif;
        }
        
       return $pointMe; 
    }
    
    public function getClubMembers($venue_id)
    {
        $retData = [self::TOTAL_MEMBERS=>0,self::NEW_MEMBERS=>0];
        $url = $this->baseUrl.'club_membership';
        $data[self::VENUE_ID] = $venue_id;
        $clubMem = $this->rawPost($url, $this->header, $data);
        if($clubMem)
        {
            $cm_json = json_decode($clubMem);
            if(isset($cm_json->status) && $cm_json->status):
                $retData[self::TOTAL_MEMBERS] = isset($cm_json->data->clubmembers)?$cm_json->data->clubmembers:0;
                $retData[self::TOTAL_MEMBERS] = number_format($retData[self::TOTAL_MEMBERS]);
                $retData[self::NEW_MEMBERS] = isset($cm_json->data->new_members)?$cm_json->data->clubmembers:0;
                $retData[self::NEW_MEMBERS] = number_format($retData[self::NEW_MEMBERS]);
            endif;
        }
        
       return $retData; 
    }
    
    public function getMembersRatingGrade($venue_id)
    {
        $retData = ['rating_result'=>'[{"name":"No Name","total_members":0,"y":100}]',self::TOTAL_MEMBERS=>0];
        $url = $this->baseUrl.'members_by_rating_grade';
        $data[self::VENUE_ID] = $venue_id;
  
        $ratingData = $this->rawPost($url, $this->header, $data);
        if($ratingData)
        {
            $rd_json = json_decode($ratingData,true);
            if(isset($rd_json[self::STATUS]) && $rd_json[self::STATUS]):
                $rating_data = isset($rd_json['data']['rating_data'])?$rd_json['data']['rating_data']:[];
                $total_members = isset($rd_json['data'][self::TOTAL_MEMBERS])?$rd_json['data'][self::TOTAL_MEMBERS]:0;
                
                $gradeArr = [];
                foreach($rating_data as $key => $v):
                    $popData = [];
                     $popData['name'] = $key;
                     $popData[self::TOTAL_MEMBERS] = $v;
                     $popData['y']    = ($total_members >0)?(($v/$total_members)*100):0;
                     $popData['y'] = round($popData['y'], 2);

                     
                     $gradeArr[] = $popData;
                endforeach;
                
                $retData['rating_result'] = json_encode($gradeArr);  
                $retData[self::TOTAL_MEMBERS] = $total_members;
              
            endif;
        }

       return $retData; 
    }
    
    public function getGamingBreakDown($venue_id)
    {
        $retData = ['breakdown_data'=>'[{"name":"No Name","y":100}]',self::GAMING_TURNOVER=>['all'=>0,'today'=>0,'last_3_month'=>0]];
        $url = $this->baseUrl.'gaming_breakdown';
        $data[self::VENUE_ID] = $venue_id;
         
        $gameBrk = $this->rawPost($url, $this->header, $data);
     
        if($gameBrk)
        {
            $gb_json = json_decode($gameBrk);
            if(isset($gb_json->status) && (isset($gb_json->data->gaming_turnover)) && $gb_json->status):
                $gaming_turnover_obj = $gb_json->data->gaming_turnover;
                $all_turnover = (isset($gaming_turnover_obj->all))?$gaming_turnover_obj->all:0;
                $today_turnover = (isset($gaming_turnover_obj->today))?$gaming_turnover_obj->today:0;
                $last_3_month = (isset($gaming_turnover_obj->last_three_month))?$gaming_turnover_obj->last_three_month:0;

                if($all_turnover > 0){
                    $carded = isset($gb_json->data->carded)?$gb_json->data->carded:0;
                    $non_carded = isset($gb_json->data->non_carded)?$gb_json->data->non_carded:0;



                    $y_carded = ($all_turnover > 0)?(intval(round(($carded/$all_turnover)*100))):0;
                    $y_uncarded = ($all_turnover > 0)?(intval(round(($non_carded/$all_turnover)*100))):0;

                    $breakdown =[
                        ['name'=>'Uncarded','y'=>$y_uncarded],
                        ['name'=>'Carded','y'=>$y_carded]

                    ];

                    if($y_carded>0 || $y_uncarded > 0) {
                        $retData['breakdown_data'] = json_encode($breakdown);
                    }

                    $retData[self::GAMING_TURNOVER]['all'] = number_format($all_turnover,2);
                    $retData[self::GAMING_TURNOVER]['today'] = number_format($today_turnover,2);
                    $retData[self::GAMING_TURNOVER]['last_3_month'] = number_format($last_3_month,2);
                }
            endif;
        }

       return $retData;
    }
    
    public function getHotSpotsToday($venue_id)
    {
        $retData = '';
        $url = $this->baseUrl.'dashboard_venue_utilization_heatmap';
        $data[self::VENUE_ID] = $venue_id;
        $hotspot = $this->rawPost($url, $this->header, $data);
        if($hotspot)
        {
            $hs_json = json_decode($hotspot);
           
            if(isset($hs_json->status) && (isset($hs_json->data->venueUtilisation)) && $hs_json->status):
                $retData = json_encode($hs_json->data->venueUtilisation);
            endif;
        }
        
       return $retData;
    }

    public function getHotSpotsDataApi($venue_id,$start_date,$end_date,$segment_list)
    {
        $retData = '';
        $url = $this->baseUrl.'all_venue_utilization_heatmap';
        $data[self::VENUE_ID] = $venue_id;
        $data['start_date'] = $start_date;
        $data['end_date'] = $end_date;
        $data['segment_list'] = $segment_list;
        $hotspot = $this->rawPost($url, $this->header, $data);
        if($hotspot)
        {
            $hs_json = json_decode($hotspot);

            if(isset($hs_json->status) && (isset($hs_json->data->venueUtilisation)) && $hs_json->status):
                $retData = json_encode($hs_json->data->venueUtilisation);
            endif;
        }

        return $retData;
    }
    
    public function getTurnoverPercentage($venue_id)
    {
        $url = $this->baseUrl.'members_turnover';
        $data[self::VENUE_ID] = $venue_id;
        $turnover_percent_data = $this->rawPost($url, $this->header, $data);
        if($turnover_percent_data)
        {
            $tp_json = json_decode($turnover_percent_data);
            if(isset($tp_json->status) && $tp_json->status) {
                return isset($tp_json->data->member_pos_percent)?$tp_json->data->member_pos_percent:0;
            }
            else {
                return 0;
            }
        }else
        {
            return 0;
        }
    }
    
    public function getPointmeDwellPercentage($venue_id)
    {
        $url = $this->baseUrl.'members_pointme_dwell';
        $data[self::VENUE_ID] = $venue_id;
        $pointme_dwell_percent_data = $this->rawPost($url, $this->header, $data);
        if($pointme_dwell_percent_data)
        {
            $pmp_json = json_decode($pointme_dwell_percent_data);
            if(isset($pmp_json->status) && $pmp_json->status) {
                return isset($pmp_json->data->member_dwell_percent)?$pmp_json->data->member_dwell_percent:0;
            }
            else {
                return 0;
            }
        }else
        {
            return 0;
        }
    }
    
    public function getMembersVisitationPercentage($venue_id)
    {
        $url = $this->baseUrl.'members_visitation';
        $data[self::VENUE_ID] = $venue_id;
        $members_visitation_percent_data = $this->rawPost($url, $this->header, $data);
        if($members_visitation_percent_data)
        {
            $mvp_json = json_decode($members_visitation_percent_data);
            if(isset($mvp_json->status) && $mvp_json->status) {
                return isset($mvp_json->data->member_visit_percent)?$mvp_json->data->member_visit_percent:0;
            }
            else {
                return 0;
            }
        }else
        {
            return 0;
        }
    }

    public function top_performing_campaigns($venue_id , $status) {
        $result = [];
        $url = $this->baseUrl . self::TOP_PERFORMING_CAMPAIGNS;
        $data = [
            "venue_id"=>$venue_id,
            "status" => 'all'
        ];
        $resData = $this->post($url, $this->header , $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            $dataArr = $res_arr['data'];
            if (isset($dataArr[self::TOP_PERFORMING_CAMPAIGNS]) && !empty($dataArr[self::TOP_PERFORMING_CAMPAIGNS])) {
                $retData = $dataArr[self::TOP_PERFORMING_CAMPAIGNS];

                foreach($retData as $key => $value){
                    array_push($result,array("name"=>$key,"y"=>round($value , 2)));
                }
            }
        }
        return $result;
    }
}

