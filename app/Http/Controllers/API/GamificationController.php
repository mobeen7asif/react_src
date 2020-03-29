<?php

namespace App\Http\Controllers\API;

use App\Exports\GameMissionExport;
use App\Models\Campaign;
use App\Models\CompetitionUserEntry;
use App\Models\GameUserEntry;
use App\Models\MissionUserEntry;
use App\Models\Recipe;
use App\Models\Segment;
use App\Models\SurveyFront;
use App\Models\Venue;
use App\Utility\ElasticsearchUtility;
use App\Utility\Gamification;
use App\Http\Controllers\Controller;
use App\Utility\Segmentation;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use App\User;

class GamificationController extends Controller
{
    /*sonar constants*/
    const USER_SIGNUP                 = 'user_sign_up';
    const USER_GPS_DETECT                 = 'user_gps_detect';
    const TITLE                 = 'title';
    const START_DATE                 = 'start_date';
    const END_DATE                 = 'end_date';
    const DATE_FORMAT                 = 'Y-m-d';
    const STATUS                 = 'status';
    const SCAN_QR_CODE                 = 'scan_qr_code';
    const VALUE                 = 'value';
    const TRIGGERS                 = 'triggers';
    const MESSAGE                 = 'message';

    
    private $gObj;
    private $games;
    private $userMissions;
    private $segmentation;
    public $missionsFound;
    public $qrCodeIsCompetition;
    public $campaignsData;

    public function __construct()
    {
        $this->gObj = new Gamification;
        $this->missionsFound = false;
        $this->qrCodeIsCompetition = $this->gObj->qrCodeIsCompetition();

    }//..... end of __construct() .....//

    /**
     * @return array|\Illuminate\Support\Collection
     * Handle customer scan qr code.
     */
    public function customerScannedQrCode()
    {
        $validation = Validator::make(request()->all(), [
            'qr_code' => 'required'
        ]);
        $key = "qr_code_" . request()->qr_code . "_" . request()->user()->user_id;

        //...... stop multiple requests  .....//
        $key_exists = Redis::get($key);
        if ($key_exists) {
            $diff = time() - Redis::get($key);
            if ($diff <= 5) {
                return [self::STATUS => false, self::MESSAGE => ''];
            }
            else {
                Redis::set($key, strtotime(date("Y-m-d H:i:s")));
            }
        } else {
            Redis::set($key, strtotime(date("Y-m-d H:i:s")));
        }
        //...... end of stop multiple requests  .....//

        if ($validation->fails()) {
            return [self::STATUS => false, self::MESSAGE => 'Please provide missing params: QR code'];
        }//...... end if() ......//

        $this->segmentation = new Segmentation(ElasticsearchUtility::generateIndexName(config('constant.COMPANY_ID'), request()->user()->default_venue));
        $this->filterCampaignsForActiveGamesAndMissions();
        $qrCodesMissions = $this->checkMissionsForQrCodes();




        if ($qrCodesMissions->isEmpty()) {
            return [self::STATUS => false, self::MESSAGE => 'Stuck in a glitch? Try scanning the QR code again, or check out our help section..', self::TRIGGERS => []];
        }

        $this->userMissions = $this->gObj->setActiveMissions($qrCodesMissions, request()->user());

        if ($this->userMissions->isEmpty()) {
            if ($qrCodesMissions->isNotEmpty()) {
                if ($this->gObj->lastEntry) {
                    return [self::STATUS => ($this->qrCodeIsCompetition) ? true : false, 'type' => ($this->qrCodeIsCompetition) ? "petpack" : "normal", self::MESSAGE => "Qr Code is already scanned.", self::TRIGGERS => []];
                }
                //..... this message will be changed letter  ......//
                return [self::STATUS => false, self::MESSAGE => "Stuck in a glitch? Try scanning the QR code again, or check out our help section.", self::TRIGGERS => []];
            } else {
                return [self::STATUS => $this->qrCodeIsCompetition ? true : false, self::MESSAGE => "Whoops! You have just scanned this code. Find a different code or come back later for another token .", self::TRIGGERS => []];
            }
        }
            

        $response = $this->gObj->processMissions($this->userMissions, request()->user());
        Redis::del($key);
        return [self::STATUS => true, 'type' => ($this->qrCodeIsCompetition) ? "petpack" : "normal", self::MESSAGE => !empty($response) ? "Yay! You’ve scanned one of the Pet Pack!" : "And scanned. Good work!", self::TRIGGERS => $response];
    }//..... end of customerScannedQrCode() .....//

    /**
     * Check if campaign has active games/missions.
     */
    private function filterCampaignsForActiveGamesAndMissions(): void
    {
        $campaigns = $this->gObj->getGamificationCampaigns();
        $this->games = $this->gObj->retrieveActiveGamesFromCampaigns($campaigns, request()->user());

    }//..... end of filterCampaignsForActiveGamesAndMissions() ......//

    /**
     * @return \Illuminate\Support\Collection
     * Check mission segment for specific qr code.
     */
    private function checkMissionsForQrCodes(): \Illuminate\Support\Collection
    {
        $userMissions = collect([]);
        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(function ($mission) use (&$userMissions, $game) {
                $this->missionsFound = true;
                $mission->venue_id = $game->venue_id;
                $mission->campaign_id = $game->campaign_id;
                $segments = explode(',', $mission->target_segments);

                if ($this->filterUserInSegments($segments, ['type' => self::SCAN_QR_CODE, self::VALUE => request()->qr_code])) {

                    Segment::whereIn('id', $segments)->get(['id', 'query_parameters'])->each(function ($value) use (&$mission) {
                        $qr_code = json_decode($value->query_parameters);
                        if ($qr_code[0]->name == self::SCAN_QR_CODE) {
                            $mission->interval = $qr_code[0]->value->interval;
                            return false;
                        }
                    });

                    $userMissions->push($mission);
                }

            });
        });
        return $userMissions;
    }//..... end of checkMissionsForQrCodes() .....//

    /**
     * @param $segmentIds
     * @param array $extraConditions
     * @return bool
     * Check if user lies in segment.
     */
    private function filterUserInSegments($segmentIds, $extraConditions = [],$userId): bool
    {

        if ($this->segmentsHasExtraConditions($segmentIds, $extraConditions)) {
            $users =$this->getUserBySegments($segmentIds,request()->user()->user_id);

            if (in_array(request()->user()->user_id, $users)) {
                return true;
            }

            return false;
        }//..... end if() .....//

        return false;
    }//..... end of filterUserInSegments() ......//

    /**
     * @param $segmentIds
     * @param $condition
     * @return bool
     * Check if segment has extra condition like qr code etc.
     */
    private function segmentsHasExtraConditions($segmentIds, $condition): bool
    {
        $found = false;

        Segment::whereIn('id', $segmentIds)->get(['id', 'query_parameters'])
            ->each(function ($segment) use (&$found, $condition) {
                if (!$found) {
                    foreach (json_decode($segment->query_parameters) as $qp) {

                        switch ($condition['type']) {
                            case self::SCAN_QR_CODE:
                                return ($qp->name == $condition['type'] && $qp->value->qr_code == $condition[self::VALUE]) ? $found = true : $found;
                                break;
                            case self::USER_SIGNUP:

                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                            case self::USER_GPS_DETECT:
                                return ($qp->name == $condition['type'] && $qp->value == $condition[self::VALUE]) ? $found = true : $found;
                                break;
                            case 'user_optional_field':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                            case 'transaction_amount':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                            case 'target_users':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                            case 'old_user':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                                case 'referral_user':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                            case 'member_group':
                                return ($qp->name == $condition['type']) ? $found = true : $found;
                                break;
                        }
                    }
                }//..... end if() .....//
            });

        return $found;
    }//..... end of segmentsHasExtraConditions() .....//

    /**
     * @return array
     * Get Campaign's Games and missions statistics for frontend.
     */
    public function loadCampaignStatistics(): array
    {
        $campaign = $this->getCampaignById(request()->campaign_id);
        return [
            'campaign_title' => $campaign ? $campaign->name : '',
            'games' => $campaign ? $this->populateGamesStatistics($campaign->games) : []
        ];
    }//..... end of loadCampaignStatistics() .....//

    /**
     * @param array $games
     * @return mixed
     * Populate games' statistics.
     */
    private function populateGamesStatistics($games = [])
    {
        return $games->map(function ($game) {
            $gStatus = $this->getGameCompletionStatistics($game->id);
            return [
                'id' => $game->id,
                self::TITLE => $game->title,
                self::START_DATE => $game->start_date,
                self::END_DATE => $game->end_date,
                'completion' => $gStatus,
                // 'inProgress'    => $this->getGameInProgressStatistics($game->id) - $gStatus,
                'inProgress' => $this->getInprogressMission($game->id),
                'missions' => $this->getMissionsStatistics($game->missions),
                'url' => URL::signedRoute('export.game.mission.members', ['type' => 'game', 'id' => $game->id])
            ];
        });
    }//..... end of populateGamesStatistics() ......//

    /**
     * @param $missions
     * @return mixed
     * Populate missions statistics.
     */
    private function getMissionsStatistics($missions)
    {
        return $missions->map(function ($mission) {
            return [
                'id' => $mission->id,
                self::TITLE => $mission->title,
                self::START_DATE => $mission->start_date,
                self::END_DATE => $mission->end_date,
                'completion' => $this->getMissionCompletionStatistics($mission->id),
                'url' => URL::signedRoute('export.game.mission.members', ['type' => 'mission', 'id' => $mission->game_id, 'mid' => $mission->id])
            ];
        });
    }//..... end of getMissionsStatistics() .....//

    /**
     * @param $id
     * @return mixed
     * Get Statistics of a mission.
     */
    private function getMissionCompletionStatistics($id)
    {
        return MissionUserEntry::where('mission_id', $id)->count();
    }//..... end of getMissionCompletionStatistics() .....//

    /**
     * @param $id
     * @return mixed
     * Get Game completion statistics.
     */
    private function getGameCompletionStatistics($id)
    {
        return GameUserEntry::where('game_id', $id)->count();
    }//..... end of getGameCompletionStatistics() ......//

    /**
     * @param $game_id
     * @return mixed
     * Get Game in Progress statistics.
     */
    private function getGameInProgressStatistics($game_id)
    {
        return MissionUserEntry::where('game_id', $game_id)->groupBy('mission_id')->get()->count();
    }//..... end of getGameInProgressStatistics() ......//

    /**
     * @param $id
     * @return mixed
     * Get Campaign By id.
     */
    private function getCampaignById($id)
    {
        return Campaign::whereId($id)->with(['games.missions'])->first();
    }//..... end of getCampaignById() .....//

    /**
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * Export Game/Mission involved users list.
     */
    public function exportGameMissionMembers(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        if (!request()->hasValidSignature()) {
            abort(401);
        }

        $members = request()->type === 'mission'
            ? $this->missionMembers(request()->id, request()->mid)
            : $this->gameMembers(request()->id);

        return Excel::download(new GameMissionExport($members), 'game_mission_members_list.xlsx');
    }//..... end of exportGameMissionMembers() .....//

    /**
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * Download Competition members list.
     */
    public function exportCompetitionMembers()
    {
        $members = CompetitionUserEntry::where('competition_user_entries.competition_id', request()->id)
            ->where('competition_user_entries.in_draw', 1)
            // ->groupBy('competition_user_entries.user_id')
            ->join('users', 'users.user_id', '=', 'competition_user_entries.user_id')
            ->leftJoin('venues', 'venues.venue_id', '=', 'users.default_venue')
            ->orderBy('competition_user_entries.created_at', 'ASC')
            ->get(['competition_user_entries.created_at', 'users.user_first_name', 'users.user_family_name', 'users.user_mobile', 'users.email', 'venues.venue_name']);
        return Excel::download(new GameMissionExport($members), 'competition_members_list.xlsx');
    }//..... end of exportCompetitionMembers() .....//

    /**
     * @param $id
     * @return Collection
     * Get all members that are involved in a game.
     */
    private function gameMembers($id): Collection
    {
        return GameUserEntry::where('game_user_entries.game_id', $id)
            ->join('users', 'users.user_id', '=', 'game_user_entries.user_id')
            ->leftJoin('venues', 'venues.venue_id', '=', 'users.default_venue')
            ->get(['game_user_entries.created_at', 'users.user_first_name', 'users.user_family_name', 'users.user_mobile', 'users.email', 'venues.venue_name']);
    }//..... end of gameMembers() .....//

    /**
     * @param $game_id
     * @param $mission_id
     * @return mixed
     * Get all members that are involved in mission.
     */
    private function missionMembers($game_id, $mission_id): Collection
    {
        return MissionUserEntry::where('mission_users_entries.game_id', $game_id)
            ->where('mission_users_entries.mission_id', $mission_id)
            ->join('users', 'users.user_id', '=', 'mission_users_entries.user_id')
            ->leftJoin('venues', 'venues.venue_id', '=', 'users.default_venue')
            //->groupBy('mission_users_entries.user_id')
            ->get(["mission_users_entries.created_at", 'users.user_first_name', 'users.user_family_name', 'users.user_mobile', 'users.email', 'venues.venue_name']);
    }//..... end of missionMembers() .....//

    public function saveMissionLogs($missionData)
    {
        return true;
    }//..... end of saveVoucherToEs() .....//

    /**
     * @param $userID
     * @return Collection
     */
    public function userSignupMissions(Request $request)
    {


        $user = User::whereUserId($request->user_id)->first();
        $this->segmentation = new Segmentation(ElasticsearchUtility::generateIndexName(config('constant.COMPANY_ID'), 295255));
        $this->filterCampaignsActiveGamesAndMissions($request->user_id);

        $signUpmissions = $this->checkMissionsForSignUp($user);
        $this->userMissions = $this->gObj->setActiveMissions($signUpmissions, $user);

        $this->gObj->processMissions($this->userMissions, $user);
        return $this->userMissions;
    }//--- End of userSignupMissions() ---//

    private function checkMissionsForSignUp()
    {
        $userMissions = collect([]);

        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(
                function ($mission) use (&$userMissions, $game) {
                    $mission->venue_id = $game->venue_id;
                    $mission->campaign_id = $game->campaign_id;
                    $segments = explode(',', $mission->target_segments);

                    if ($this->filterCheckSegments($segments, ['type' => self::USER_SIGNUP])) {
                        $userMissions->push($mission);
                    }
                });
        });

        return $userMissions;
    }

    /**
     * @param $segments
     * @param $array
     * @return bool
     */
    private function filterCheckSegments($segments, $array)
    {
        if ($this->segmentsHasExtraConditions($segments, $array)) {
            return true;
        }

        return false;
    }//..... end of filterCheckSegments() .....//

    /**
     * @param $userid
     */
    private function filterCampaignsActiveGamesAndMissions($userid): void
    {
        $campaigns = $this->gObj->getGamificationCampaigns();
        $this->games = $this->gObj->retrieveActiveGamesFromCampaigns($campaigns, User::whereUserId($userid)->first());
    }//..... end of filterCampaignsForActiveGamesAndMissions() ......//

    /**
     * @param Request $request
     * @return array|Collection
     */
    public function userLocationDetection($venueId)
    {

        $this->segmentation = new Segmentation(ElasticsearchUtility::generateIndexName(config('constant.COMPANY_ID'), $venueId));

        $this->filterCampaignsForActiveGamesAndMissions();

        $gpsMissions = $this->checkMissionsVenueID();
        $this->userMissions = $this->gObj->setActiveMissions($gpsMissions, request()->user());
        $this->gObj->processMissions($this->userMissions, request()->user());
        return [self::STATUS => true, self::MESSAGE => 'Location is detected successfully'];
    }

    private function checkMissionsVenueID()
    {
        $userMissions = collect([]);
        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(function ($mission) use (&$userMissions, $game) {
                $mission->venue_id = $game->venue_id;
                $mission->campaign_id = $game->campaign_id;
                $segments = explode(',', $mission->target_segments);

                if ($this->filterUserForLocation($segments, ['type' => self::USER_GPS_DETECT, self::VALUE => request()->venue_id])) {
                    Segment::whereIn('id', $segments)->get(['id', 'query_parameters'])->each(function ($value) use (&$mission) {
                        $qr_code = json_decode($value->query_parameters);
                        if ($qr_code[0]->name == self::USER_GPS_DETECT) {
                            $mission->interval = (int)$qr_code[0]->interval * 60;
                            return false;
                        }
                    });
                    $userMissions->push($mission);
                }

            });
        });
        return $userMissions;
    }

    private function filterUserForLocation(array $segments, array $array)
    {

        if ($this->segmentsHasExtraConditions($segments, $array)) {
            return true;
        }

        return false;
    }//..... end of filterUserForLocation() .....//

    public function userOptionalFields(Request $request, $user)
    {

        $this->segmentation = new Segmentation(ElasticsearchUtility::generateIndexName(config('constant.COMPANY_ID'), $request->venue_id));

        $this->filterCampaignsForOptionalFields($user);

        $optionalMissions = $this->checkMissionsForOptionalFields();
        $this->userMissions = $this->gObj->setActiveMissions($optionalMissions, $user);
        $this->gObj->processMissions($this->userMissions, $user);
        return true;
    }

    private function filterCampaignsForOptionalFields($user): void
    {
        $campaigns = $this->gObj->getGamificationCampaigns();
        $this->games = $this->gObj->retrieveActiveGamesFromCampaigns($campaigns, $user);
    }

    private function checkMissionsForOptionalFields()
    {
        $userMissions = collect([]);
        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(function ($mission) use (&$userMissions, $game) {
                $mission->venue_id = $game->venue_id;
                $mission->campaign_id = $game->campaign_id;
                $segments = explode(',', $mission->target_segments);

                if ($this->filterUserOptionalFields($segments, ['type' => 'user_optional_field'])) {
                    $userMissions->push($mission);
                }
            });
        });

        return $userMissions;
    }

    private function filterUserOptionalFields(array $segments, array $array)
    {

        if ($this->segmentsHasExtraConditions($segments, $array)) {
            return true;
        }

        return false;
    }//..... end of filterCampaignsForActiveGamesAndMissions() ......//

    private function getInprogressMission($game_id)
    {

        return DB::table("missions")->whereGameId($game_id)
            ->where(self::START_DATE, "<=", date(self::DATE_FORMAT))
            ->where(self::END_DATE, ">=", date(self::DATE_FORMAT))->count();
    }

    private function getUserBySegments($segmentIds,$userID)
    {
        try {

            $segments = Segment::whereIn('id',$segmentIds)->get();
            $userData = [];
            foreach ($segments as $value) {
                $query = json_decode($value->query, true);
                $query['query']['bool']['must'][] = ['match'=>['persona_id' => $userID]];

                $userFromES = (new ElasticsearchUtility())->getAllData($query,config('constant.ES_INDEX_BASENAME'));

               foreach ($userFromES as $value) {
                   $userData[] = $value['_id'];
               }
            }

              return array_unique($userData);
        } catch (Exception $e) {
            Log::channel('custom')->error('getUserBySegments :', ['getUserBySegments' => $e->getMessage()]);
            return [self::STATUS => false, self::MESSAGE => "Error " . $e->getMessage()];
        }

    }


    //======================== testing api methods to test server   ==================//

    public function php()
    {
        dd("php testing....");
    }

    public function db()
    {
        echo "<pre>";
        print_r(Venue::get());
        print_r(Recipe::get());
    }

    public function es($venue_id)
    {
        $index = ElasticsearchUtility::generateIndexName(config('constant.COMPANY_ID'), $venue_id);
        ElasticsearchUtility::esTest($index);
    }

    public function redis()
    {
        $key = "soldi_data_" . date(self::DATE_FORMAT);
        $key_exists = Redis::get($key);
        if ($key_exists) {
            $key_exists = json_decode($key_exists, true);
            dd($key_exists['data']);
            return $key_exists['data'];
        }
        dd(Redis::keys("*"));
    }

    //========================  end of testing server  functions  ===============//

    public function surveyList()
    {
        return [self::STATUS => true, "data" => SurveyFront::get(['id', self::TITLE])];
    }

    /**
     * @param $venueId
     * @return array
     */
    public function userAssignStampCardTransaction($user)
    {

        $this->segmentation = new Segmentation(config('constant.ES_INDEX_BASENAME'));
        $this->filterCampaignsActiveGamesAndMissions($user->user_id);

        $signUpmissions = $this->checkMissionsForTransaction($user);

        $this->userMissions = $this->gObj->setActiveMissionsForTransactions($signUpmissions, $user);

        $this->gObj->processMissions($this->userMissions, $user);
        if ($this->userMissions->isNotEmpty()) {
            return [self::STATUS => true, 'data' => $this->userMissions];
        } else {
            return [self::STATUS => false];
        }
    }

    /**
     * @return Collection
     */
    private function checkMissionsForTransaction()
    {
        $userMissions = collect([]);

        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(
                function ($mission) use (&$userMissions, $game) {
                    $mission->venue_id = $game->venue_id;
                    $mission->campaign_id = $game->campaign_id;
                    $segments = explode(',', $mission->target_segments);

                    if ($this->filterCheckSegments($segments, ['type' => 'transaction_amount'])) {
                        $userMissions->push($mission);
                    }
                });
        });

        return $userMissions;
    }//---- End of checkMissionsForTransaction() -----//

    public function groupList()
    {
        return [self::STATUS => true, "data" => DB::table('groups')->get(['group_id as id', 'group_name'])];
    }

    public function assignStampCardOldNewUser($user)
    {

        $this->segmentation = new Segmentation(config('constant.ES_INDEX_BASENAME'));
        $this->filterCampaignsActiveGamesAndMissionsForUser($user->user_id);

        $signUpmissions = $this->checkMissionsForOldNewUser($user);


         if($signUpmissions->isNotEmpty()) {

             $this->userMissions = $this->gObj->setActiveMissionsForTransactions($signUpmissions, $user);

             $this->gObj->processMissions($this->userMissions, $user);
             if ($this->userMissions->isNotEmpty()) {
                 return [self::STATUS => true, 'data' => $this->userMissions];
             } else {
                 return [self::STATUS => false];
             }
         }else{
             return [self::STATUS=>false, self::MESSAGE=> 'Mission for old user is not created'];
         }
    }

    /**
     * @return Collection
     */
    private function  checkMissionsForOldNewUser($user)
    {

        $userMissions = collect([]);

        $this->games->each(function ($game) use (&$userMissions,&$user) {
            $game->missions->each(
                function ($mission) use (&$userMissions, $game,&$user) {
                    $mission->venue_id = $game->venue_id;
                    $mission->campaign_id = $game->campaign_id;
                   $segmentId = explode(',',$mission->target_segments);

                       if ($this->filterUserInSegmentsForSignUp($segmentId, ['type' => self::USER_SIGNUP], $user)) {
                           $userMissions->push($mission);
                       }

                });
        });

        return $userMissions;
    }//---- End of checkMissionsForTransaction() -----//

    private function filterCampaignsActiveGamesAndMissionsForUser($userid): void
    {
        $campaigns = $this->gObj->getGamificationCampaignsFor();
        $this->games = $this->gObj->retrieveActiveGamesFromCampaigns($campaigns, User::whereUserId($userid)->first());
    }

    private function filterUserInSegmentsForSignUp($segmentIds, $extraConditions = [],$user): bool
    {

        if ($this->segmentsHasExtraConditions($segmentIds, $extraConditions)) {

            $users = $this->getUserBySegments($segmentIds,$user->user_id??$user['user_id']);


            if (in_array($user->user_id??$user['user_id'], $users)) {
                Log::channel('custom')->info('sfsdf',['$user'=>$user]);
                return true;
            }

            return false;
        }//..... end if() .....//

        return false;
    }//..... end of filterUserInSegments() ......//

    /**
     * @param $user
     * @return array
     */
    public function userRefferalAssignReward($user)
    {
        $this->segmentation = new Segmentation(config('constant.ES_INDEX_BASENAME'));
        $this->filterCampaignsActiveGamesAndMissions($user->user_id);

        $signUpmissions = $this->checkMissionsForRefferalAssign($user);

        $this->userMissions = $this->gObj->setActiveMissionsForTransactions($signUpmissions, $user);

        $this->gObj->processMissions($this->userMissions, $user);
        if ($this->userMissions->isNotEmpty()) {
            return [self::STATUS => true, 'data' => $this->userMissions];
        } else {
            return [self::STATUS => false];
        }
    }

    /**
     * @return Collection
     */
    private function checkMissionsForRefferalAssign()
    {
        $userMissions = collect([]);

        $this->games->each(function ($game) use (&$userMissions) {
            $game->missions->each(
                function ($mission) use (&$userMissions, $game) {
                    $mission->venue_id = $game->venue_id;
                    $mission->campaign_id = $game->campaign_id;
                    $segments = explode(',', $mission->target_segments);

                    if ($this->filterCheckSegments($segments, ['type' => 'referral_user'])) {
                        $userMissions->push($mission);
                    }
                });
        });

        return $userMissions;
    }//---- End of checkMissionsForTransaction() -----//

    /**
     * @param array $segmentId
     * @param $condition
     * @return bool
     */
    private function getSegmenTDetails(array $segmentId,$condition)
    {
        $found = false;
        Segment::whereIn('id', $segmentId)->get(['id', 'query_parameters'])
            ->each(function ($segment) use (&$found, $condition) {
                if (!$found) {
                    foreach (json_decode($segment->query_parameters) as $qp) {

                        switch ($condition['type']) {

                            case self::USER_SIGNUP:
                                return $found =($qp->value)?1:0;
                                break;
                            default:
                                return $found=0;
                        }
                    }
                }//..... end if() .....//
            });
        return $found;
    }//----- end of getSegmenTDetails() ------//

    /**
     * @return array
     */
    public function changeMemberShip($id)
    {

        $user = User::where('user_id',$id)->first();

        $this->segmentation = new Segmentation(config('constant.ES_INDEX_BASENAME'));
        $this->filterCampaignForStudentVoucher($user);//Filter campaign with user region
        $signUpmissions = $this->checkMissionsForMembership($user);

        $this->userMissions = $this->gObj->setActiveMissionsForTransactions($signUpmissions, $user);


        if ($this->userMissions->isNotEmpty()) {
            $this->gObj->processMissions($this->userMissions, $user);
            Log::channel('custom')->info('changeMemberShip',['changeMemberShip'=>$this->userMissions]);
            return [self::STATUS => true, 'data' => $this->userMissions];
        } else {
            return [self::STATUS => false];
        }
    }//---- End of changeMemberShip() ----//

    /**
     * @param $user
     * @return Collection
     */
    private function checkMissionsForMembership($user)
    {
        $userMissions = collect([]);

        $this->games->each(function ($game) use (&$userMissions,&$user) {
            $game->missions->each(
                function ($mission) use (&$userMissions, $game,&$user) {
                    $mission->venue_id = $game->venue_id;
                    $mission->campaign_id = $game->campaign_id;
                    $segmentId = explode(',',$mission->target_segments);


                    Log::channel('custom')->info('segments',['segments'=>$segmentId]);
                    if ($this->filterUserInSegmentsForSignUp($segmentId, ['type' => 'member_group'], $user)) {
                        $userMissions->push($mission);
                    }

                });
        });

        return $userMissions;
    }//----- End of checkMissionsForMembership() ------//



    /**
     * @param $userid
     */
    private function filterCampaignForStudentVoucher($user): void
    {
        $campaigns = $this->gObj->getGamificationCampaignsForStudent($user);
        $this->games = $this->gObj->retrieveActiveGamesFromCampaigns($campaigns, $user);
    }//..... end of filterCampaignsForActiveGamesAndMissions() ......//



}