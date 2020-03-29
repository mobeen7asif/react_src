<?php

namespace App\Http\Controllers\API;

use App\ApiCalls\BaseReportApiCall;
use App\Models\Campaign;
use App\Models\Venue;
use App\Traits\getDateFormates;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Session;
use DB;
use Image;
use File;


class HostDashboardController extends Controller
{
    /*sonar constants*/
    const HIGHEST_UNSUB_RATE                 = 'highestUnsubscribeRate';
    const TOTAL_VENUES                 = 'total_venues';
    const LAST_WEEK                 = 'last_week';
    const TOTAL_MEMBERS                 = 'total_members';
    const LAST_THREE_MONTHS                 = 'last_three_month';
    const STATUS                 = 'status';
    const ACTIVE                 = 'Active';
    const SCHEDULED                 = 'Scheduled';
    const TOTAL_PATRONS                 = 'total_patrons';
    const VENUE_ID                 = 'venue_id';
    const TOTAL_MEMBERSHIP                 = 'total_membership';
    const CLUB_NEW_MEMBERS                 = 'clubNewmembers';


    private $baseUrl;
    private $baseUrl2;
    private $header;
    private $apiCall;
    use getDateFormates;

    public function __construct()
    {
        $this->baseUrl = config('constant.amplify_URL') . "DashboardReporting/";
        $this->baseUrl2 = config('constant.amplify_URL') . "HomePageReporting/";
        $this->header = ["X-API-KEY" => "PulSCqMnXGchW0pC0s5o9ngHVTWMeLqk"];
        $this->apiCall = new BaseReportApiCall;
    }

    /**
     * @return mixed
     * Get Venues list by locations.
     */
    public function getVenueByLocation($company_id = 0)
    {
        return Venue::select("stateProvince as name", DB::raw('count(stateProvince) as y'))
            ->whereCompanyId($company_id)->groupBy("stateProvince")->get();
    }//.... end of function


    /**
     * @param string $type
     * @return mixed
     * Get Highest Unsubscribe Rate.
     */
    public function getHighestUnsbuscribeRate($type = '')
    {
        $retData = [
            'all' => [self::HIGHEST_UNSUB_RATE => [["name" => "", "y" => 90]], 'avg' => 50],
            'pointme' => [self::HIGHEST_UNSUB_RATE => [["name" => "", "y" => 70]], 'avg' => 35],
            'sms' => [self::HIGHEST_UNSUB_RATE => [["name" => "", "y" => 50]], 'avg' => 15],
            'email' => [self::HIGHEST_UNSUB_RATE => [["name" => "", "y" => 30]], 'avg' => 10]
        ];

        switch ($type) {
            case 'Pointme':
                return $retData['pointme'];
            case 'SMS':
                return $retData['sms'];
            case 'Email':
                return $retData['email'];
            default:
                return $retData['all'];
        }//..... end switch() .....//
    }//..... end of getHighestUnsbuscribeRate() .....//

    /**
     * @return array|mixed
     * Get Venue Dashboard Data.
     */
    public function getVenueDashboardData()
    {
        if (request()->type === 'all') {
            return array_merge([
                'venueByLocation' => $this->getVenueByLocation(request()->company_id),
                'last_month_onboarded' => $this->getLastMonthOnBoarded(request()->company_id),
                self::TOTAL_VENUES => Venue::whereCompanyId(request()->company_id)->count()
            ],
                $this->getHighestUnsbuscribeRate('all')
            );
        }

        switch (request()->type) {
            case 'usr':
                return $this->getHighestUnsbuscribeRate(request()->filter);
            default:
                return [];
        }//..... end switch() .....//
    }//..... end of getVenueDashboardData() .....//

    /**
     * @return mixed
     * Get all venues that are onBoarded last month
     */
    public function getLastMonthOnBoarded($company_id = 0)
    {
        $start_date = date("Y-m-d", strtotime("first day of previous month"));
        $end_date = date("Y-m-d", strtotime("last day of previous month"));

        return (Venue::where("is_onBoard", "=", 1)->count()) - (Venue::where("is_onBoard", 1)->whereDate("updated_at", ">=", $start_date)
                ->whereDate("updated_at", "<=", $end_date)->whereCompanyId($company_id)->count());
    }//..... end of getLastMonthOnBoarded() .....//

    public function getChannelUtilization($type = '')
    {
        if (!$type) {
            $type = $_GET['data'];
        }

        $retData = [self::LAST_WEEK => [["name" => "Last Week", self::TOTAL_MEMBERS => 50, "y" => 50]],
            self::LAST_THREE_MONTHS => [["name" => "Last three months", self::TOTAL_MEMBERS => 20, "y" => 20]],
            'all' => [["name" => "All", self::TOTAL_MEMBERS => 10, "y" => 10], ["name" => "Last Week", self::TOTAL_MEMBERS => 50, "y" => 50],
                ["name" => "Last three months", self::TOTAL_MEMBERS => 20, "y" => 20]]];
        if ($type == self::LAST_WEEK) {
            return $retData[self::LAST_WEEK];
        } else if ($type == self::LAST_THREE_MONTHS) {
            return $retData[self::LAST_THREE_MONTHS];
        } else {
            return $retData['all'];
        }
    }

    public function best_campaign_redemption_chart()
    {
        return [['name' => "Test 1", "y" => 30], ['name' => "Test 2", "y" => 60], ['name' => "Test 3", "y" => 90]];
    }

    /**
     * @return mixed
     * Get Active Campaigns and other campaigns statistics.
     */
    public function active_campaigns()
    {
        $data['total_campaign'] = Campaign::whereIn(self::STATUS, [self::ACTIVE, self::SCHEDULED])->count();
        $data['set_and_forget'] = Campaign::whereIn(self::STATUS, [self::ACTIVE, self::SCHEDULED])->whereType(1)->count();
        $data['proximity'] = Campaign::whereIn(self::STATUS, [self::ACTIVE, self::SCHEDULED])->whereType(2)->count();
        return $data;
    }//..... end of active_campaigns() .....//

    public function getPointmeUsers($venue_id = '')
    {
        $retData = ['pointme_users_percentage' => rand(20, 50), self::TOTAL_PATRONS => rand(15, 90), 'total_patronss' => rand(20, 95), 'total_patronsss' => rand(10, 90)];
        $url = $this->baseUrl . 'pointme_users_chart';
        $data[self::VENUE_ID] = $venue_id;

        $resData = $this->apiCall->rawPost($url, $this->header, $data, 0);
        if ($resData) {
            $res_arr = json_decode($resData, true);

            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                $pointme_users = (isset($dataArr['pointme_users'])) ? $dataArr['pointme_users'] : 0;
                $total_patrons = (isset($dataArr[self::TOTAL_PATRONS])) ? $dataArr[self::TOTAL_PATRONS] : 0;
                if ($total_patrons > 0) {
                    $pm_per = ($pointme_users / $total_patrons) * 100;
                    $retData['pointme_users_percentage'] = round($pm_per, 1);
                    $retData[self::TOTAL_PATRONS] = $pointme_users;
                }
            }
        }
        $retData[self::STATUS] = true;
        return $retData;
    }

    public function getMemberVisitationHost($venue_id)
    {
        $retData = (rand(5, 100));
        $url = $this->baseUrl2 . 'total_members_visitation';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->apiCall->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_visit_percent'])) ? $dataArr['total_member_visit_percent'] : 0;
            }
        }

        return $retData;
    }

    public function getMemberTurnoverHost($venue_id)
    {
        $retData = -(rand(15, 100));
        $url = $this->baseUrl2 . 'total_members_turnover';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->apiCall->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_pos_percent'])) ? $dataArr['total_member_pos_percent'] : 0;
            }
        }

        return $retData;
    }

    public function getMemberPointmeHost($venue_id)
    {
        $retData = (rand(60, 100));
        $url = $this->baseUrl2 . 'total_members_pointme_dwell';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->apiCall->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {

                $dataArr = $res_arr['data'];
                $retData = (isset($dataArr['total_member_dwell_percent'])) ? $dataArr['total_member_dwell_percent'] : 0;
            }
        }

        return $retData;
    }


    public function getTotalAndAlveoMembership($venue_id)
    {

        $total_venues = DB::table('venues')->count();
        $retData = [self::TOTAL_MEMBERSHIP => 20, self::CLUB_NEW_MEMBERS => 90, self::TOTAL_VENUES => $total_venues];
        $url = $this->baseUrl . 'alveo_venues_membership';
        $data[self::VENUE_ID] = $venue_id;
        $resData = $this->apiCall->rawPost($url, $this->header, $data);
        if ($resData) {
            $res_arr = json_decode($resData, true);
            if (isset($res_arr['data']) && !empty($res_arr['data'])) {
                $dataArr = $res_arr['data'];
                $retData[self::TOTAL_MEMBERSHIP] = (isset($dataArr[self::TOTAL_MEMBERSHIP])) ? $dataArr[self::TOTAL_MEMBERSHIP] : 0;
                $retData[self::CLUB_NEW_MEMBERS] = (isset($dataArr[self::CLUB_NEW_MEMBERS])) ? $dataArr[self::CLUB_NEW_MEMBERS] : 0;
                $retData[self::TOTAL_VENUES] = $total_venues;
            }
        }

        return $retData;
    }

    /**
     * @return array
     * Get Campaign Dashboard data.
     */
    public function getCampaignDashboardData()
    {
        if (request()->type === 'all') {
            return array_merge(array_merge(
                $this->active_campaigns(),
                ['bestCampaignChartData' => $this->best_campaign_redemption_chart()]
            ), ["chanelUtilizationChartData" => $this->getChannelUtilization(request()->type)]);
        }

        switch (request()->type) {
            case 'chu':
                return ['chanelUtilizationChartData' => $this->getChannelUtilization(request()->filter)];
            default:
                return [];
        }//..... end switch() .....//
    }//..... end of getCampaignDashboardData() .....//

    /**
     * @param $venue_id
     * @return array
     * Get Member Dashboard data.
     */
    public function getMemberDashboardData($venue_id)
    {
        return array_merge([
            'memberVisitationHost' => $this->getMemberVisitationHost($venue_id),
            'memberTurnOverHost' => $this->getMemberTurnoverHost($venue_id),
            'memberPointMeHost' => $this->getMemberPointmeHost($venue_id)
        ], $this->getTotalAndAlveoMembership($venue_id));
    }//..... end of getMemberDashboardData() .....//
}//..... end of class.