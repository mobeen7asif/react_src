<?php
namespace App\Traits;
use Illuminate\Support\Facades\Session;

trait getDateFormates{
    public function getDays($start_date, $end_date){
        $day = "86400";
        $formate = "Y-m-d";
        $startTime = strtotime($start_date);
        $endTime = strtotime($end_date);
        $numDays = round(($endTime - $startTime)/$day);
        $days = array();
        for($i = 0; $i <= $numDays; $i++){
            $days[] = date($formate,($startTime + ($i * $day)));
        }
        $days = count($days);
        return $days;
    }

    public function get_last_month(){
        $start_date = date("Y-n-j", strtotime("first day of previous month"));
        $end_date   = date("Y-n-j", strtotime("last day of previous month"));
        return $start_date."|".$end_date;
    }

    public function get_month_to_date(){
        $month = date('m');
        $year = date('Y');
        $start_date = "{$year}-{$month}-01";
        $end_data = date("Y-m-d");
        //$start_date = date('Y-m-d', strtotime('-30 day', strtotime($end_data)));
        return $start_date."|".$end_data;
    }

    public function get_year_to_date(){
        $year = date('Y');
        $end_data = date("Y-m-d");
        $start_date = "{$year}-01-01";
        return $start_date."|".$end_data;
    }

    public function get_last_year(){
        $year = date('Y') - 1;
        $start_date = "{$year}-01-01";
        $end_date = "{$year}-12-31";
        return $start_date."|".$end_date;
    }

    public function get_week_to_date(){
        $start_date = date("Y-m-d", strtotime('monday this week'));
        $end_date = date("Y-m-d");
        return $start_date."|".$end_date;
    }

    public function get_last_week(){
        $previous_week = strtotime("-1 week +1 day");
        $start_week = strtotime("last sunday midnight",$previous_week);
        $end_week = strtotime("next saturday",$start_week);
        $start_week = date("Y-m-d",$start_week);
        $end_week = date("Y-m-d",$end_week);
        //echo $start_week.' '.$end_week ;
        return $start_week."|".$end_week;
    }

    public function get_last_week_new(){
        $previous_week = strtotime("-1 week +1 day");
        $start_week = strtotime("last monday midnight",$previous_week);
        $end_week = strtotime("next sunday",$start_week);
        $start_week = date("Y-m-d",$start_week);
        $end_week = date("Y-m-d",$end_week);
        //echo $start_week.' '.$end_week ;
        return $start_week."|".$end_week;
    }

    public function get_yesterday(){
        $start_date = date('Y-m-d',strtotime("-1 days"));
        $end_date = date('Y-m-d',strtotime("-1 days"));
        return $start_date."|".$end_date;
    }

    public function getMembers()
    {
        //Session::set('venue_id',-25779);
        $venue_id =Session::get('venue_id');
        $client = new Client();
        $amplify_URL = config('constant.amplify_URL');
        $end_url = $amplify_URL.'personas/members/listing/vid/'.$venue_id;
        try {
            $res = $client->request('GET', $end_url,
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => "PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"

                    ]
                ]
            );
            $data = $res->getBody()->getContents();

            $res = json_decode($data);
            if($res->status == true){
                $arr['status'] = true;
                $arr['data'] = $res->data;
                //$arr['data'] = $res->data->patron;
            }else{
                $arr['status'] = false;
            }

        }  catch (exception $e) {
            $arr['status'] = false;
        }
        return $arr;

    }

    public function getSegments()
    {
        $venue_id =Session::get('venue_id');
        $client = new Client();
        $amplify_URL = config('constant.amplify_URL');
        $end_url = $amplify_URL.'existing/segments/'.$venue_id;
        try {
            $res = $client->request('GET', $end_url,
                [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => "PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"

                    ]
                ]
            );
            $data = $res->getBody()->getContents();

            $res = json_decode($data);
            if($res->status == true){
                $arr['status'] = true;
                $arr['data'] = $res->data;
            }else{
                $arr['status'] = false;
            }

        }  catch (exception $e) {
            $arr['status'] = false;
        }
        return $arr;

    }

    public function getActiveCampaign($start_date="",$end_date="",$member_id="",$segment_id=""){
        $curl = curl_init();
        $amplify_URL = config('constant.amplify_URL');
        $venue_id =Session::get('venue_id');
        curl_setopt_array($curl, array(
            CURLOPT_URL => $amplify_URL."Reporting/segmentCampaigns",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\n\t\"start_date\" : \"$start_date 00:00:00\",\n\t\"end_date\" : \"$end_date 00:00:00\",\n\t\"segment_id\" : {\n\t\t\"id\" :$segment_id\n\t},\n\t\"index\" : $venue_id,\n\t\"patrons\": \n      {\n      \t\"id\" : $member_id\n      }\n}",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                "postman-token: 3f959f20-d84d-4b90-171d-437f02ab5bc6",
                "x-api-key: PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;

        } else {
            $res = json_decode($response);
            if(isset($res->data->data)){
                return $res->data->data;
            }

        }
    }

    public function getTotalSegmentMembers($start_date="",$end_date="",$member_id="",$segment_id=""){

        $curl = curl_init();
        $amplify_URL = config('constant.amplify_URL');
        $venue_id =Session::get('venue_id');
        curl_setopt_array($curl, array(
            CURLOPT_URL => $amplify_URL."Reporting/totalSegment_members",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\n\t\"start_date\" : \"$start_date 00:00:00\",\n\t\"end_date\" : \"$end_date 00:00:00\",\n\t\"segment_id\" : {\n\t\t\"id\" :$segment_id\n\t},\n\t\"index\" : $venue_id,\n\t\"patrons\": \n      {\n      \t\"id\" : $member_id\n      }\n}",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                "postman-token: 52590e6b-a73d-4189-72ab-5cc3be7cc01d",
                "x-api-key: PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err."Reporting/totalSegment_members";
        } else {
            $res = json_decode($response);
            if($res){
                return $res->data;
            }else{
                return 0;
            }



        }
    }

    function getDatesByDay($day = "monday"){
        $listDates = [];
        $year = date("Y");
        $first = strtotime("$day jan $year");
        $lastday = mktime(0, 0, 0, 12, 31, 2017);

        $day = $first;
        do {
            array_push($listDates,date("Y-m-d",$day));
            //echo date('M d, Y', $day)."---";
            $day += 7 * 86400;

        } while ($day < $lastday);
    return $listDates;
    }


}
