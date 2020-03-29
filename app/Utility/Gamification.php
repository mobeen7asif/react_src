<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 2/27/19
 * Time: 9:59 AM
 */

namespace App\Utility;


use App\Http\Controllers\API\ElasticSearchController;
use App\Http\Controllers\Api\UserApiController;
use App\Models\Campaign;
use App\Models\CharacterUserScanned;
use App\Models\CompetitionUserEntry;
use App\Models\Games;
use App\Models\GameUserEntry;
use App\Models\MemberTransaction;
use App\Models\Mission;
use App\Models\MissionUserEntry;
use App\Models\PunchCard;
use App\Models\Segment;
use App\Models\Setting;
use App\Models\UserCharityCoins;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Matthewbdaly\SMS\Client as awsClient;
use Matthewbdaly\SMS\Drivers\Aws;
use App\Utility\TagReplacementUtility;
use function foo\func;

class Gamification
{
    private $user;
    private $currentChannel;
    private $venue_id;
    private $campaign_id;
    private $curl;
    private $campaigns;
    private $games;
    private $messionAndGameLogs = [];
    private $response = [];
    private $mission_id,

        $game_id;

    public $lastEntry = null;

    public function __construct()
    {
        set_time_limit(0);
        $this->curl = new CurlGuzzle();
    }//..... end of __construct() ......//

    /**
     * @return mixed
     * Get Gamification campaigns from database.
     */
    public function getGamificationCampaigns()
    {
        if ($this->qrCodeIsCompetition()) {

            $this->campaigns = Campaign::whereType(4)
                ->join('games', 'games.campaign_id', '=', 'campaigns.id')
                ->where('games.is_competition', 1)
                ->with(['games.missions'])->get(['campaigns.id', 'campaigns.name', 'campaigns.venue_id', 'campaigns.type', 'campaigns.target_value', 'campaigns.action_type']);
        } else {

            $this->campaigns = Campaign::whereType(4)->when(request()->venue_id, function ($query) {
                return $query->where('venue_id', request()->venue_id);
            })->with(['games.missions'])->get(['id', 'name', 'venue_id', 'type', 'target_value', 'action_type']);
        }
        return $this->campaigns;
    }//..... end of getCampaignsWhichHaveActiveGames() .....//

    /**
     * @param $campaigns
     * @param null $user
     * @return object
     * Filter Active Games.
     */
    public function retrieveActiveGamesFromCampaigns($campaigns, $user = null)
    {
        $games = collect([]);


        $campaigns->map(function ($cpn) use (&$games, $user) {
            $cpn->games->each(function ($game) use (&$games, $cpn, $user) {
                if ($this->qrCodeIsCompetition() and Route::current()->uri() === "api/gamification-qr-code-scanned" and $game->is_competition === 0)
                    return;

                if ((strtotime($game->start_date) <= strtotime(now()->format('Y-m-d H:i:s')) and $game->end_date == null) || (strtotime($game->start_date) <= strtotime(now()->format('Y-m-d H:i:s')) and strtotime($game->end_date) >= strtotime(now()->format('Y-m-d H:i:s')))) {
                    if (!is_array($game->outcomes))
                        $game->outcomes = json_decode($game->outcomes);

                    //$game->activeMissions = $this->setActiveMissions($game->missions, $user);
                    $game->venue_id = $cpn->venue_id;

                    $games->push($game);
                }
            });
        });

        $this->games = $games;
        return $games;
    }//..... end of retrieveActiveGamesFromCampaigns() ......//


    public function qrCodeIsCompetition()
    {
        $activeMission = false;
        $segments = DB::table('segment')->where('query_parameters', 'like', '%qr_code":"' . request()->qr_code . '"%')->orderBy('created_at', "desc")->first();


        if ($segments) {
            $missions = Mission::where(['target_segments' => $segments->id])->first();


            if ((strtotime($missions->start_date ?? $missions['start_date']) <= strtotime(now()->format('Y-m-d H:i:s')) and $missions->end_date ?? $missions['end_date'] == null)
                || (strtotime($missions->start_date ?? $missions['start_date']) <= strtotime(now()->format('Y-m-d H:i:s'))
                    and strtotime($missions->end_date ?? $missions['end_date']) >= strtotime(now()->format('Y-m-d H:i:s')))) {


                $game = Games::where(['id' => $missions['game_id']])->first();


                $activeMission = ($game->is_competition ?? $game['is_competition']) ? true : false;
            }
        }
        return $activeMission;
    }

    /**
     * @param $missions
     * @param null $user
     * @return object
     * Filter for active missions.
     */
    public function setActiveMissions($missions, $user = null): object
    {
        $activeMissions = collect([]);
        $missions->each(function ($mission) use (&$activeMissions, $user) {
            if ((strtotime($mission->start_date) <= strtotime(now()->format('Y-m-d H:i:s')) and $mission->end_date == null)
                || (strtotime($mission->start_date) <= strtotime(now()->format('Y-m-d H:i:s'))
                    and strtotime($mission->end_date) >= strtotime(now()->format('Y-m-d H:i:s')))) {

                $lastEntry = MissionUserEntry::where(['mission_id' => $mission->id, 'user_id' => $user->user_id])->latest()->first();

                if (!$this->lastEntry and $lastEntry)
                    $this->lastEntry = $lastEntry;

                if (!$lastEntry || (isset($mission->interval) and Carbon::parse($lastEntry->created_at)->diffInMinutes(now()) > $mission->interval) || (Carbon::parse($lastEntry->created_at)->diffInHours(now()) > 20)) {
                    if (!is_array($mission->outcomes))
                        $mission->outcomes = json_decode($mission->outcomes);
                    $activeMissions->push($mission);
                }//..... end of if() .....//
            }//..... end of if() .....//
        });
        return $activeMissions;
    }//..... end of setActiveMissions() .....//

    /**
     * @param $missions
     * @param User $user
     * Process Missions.
     * @return array
     */
    public function processMissions($missions, User $user): array
    {
        $this->user = $user;
        foreach ($missions as $key => $mission) :
            $this->venue_id = $mission->venue_id;
            $this->campaign_id = $mission->campaign_id;
            $this->game_id = $mission->game_id;
            $this->mission_id = $mission->id;
            $this->processOutcomes($mission->outcomes);
            $this->makeUserAndMissionEntry($mission, $user);
        endforeach;

        $this->checkUserIfQualifyTheGame($missions);
        return $this->response;
    }//..... end of processMissions() .....//

    /**
     * @param $outcomes
     * Process Missions' outcomes.
     */
    private function processOutcomes($outcomes): void
    {
        foreach ($outcomes as $key => $outcome) :
            foreach ($outcome->action_value as $k => $av) :
                switch ($av->name) {
                    case 'push':
                        $this->processPushMessages($av->value);
                        break;
                    case 'sms':
                        $this->processSmsMessages($av->value);
                        break;
                    case 'email':
                        $this->processEmailMessages($av->value);
                        break;
                }
            endforeach;
        endforeach;
    }//...... end of processOutcomes() .....//

    /**
     * @param $value
     * Process push messages.
     */
    private function processPushMessages($value): void
    {
        $this->currentChannel = 'push';
        Log::channel('custom')->info('jk');
        $data = $this->persistDataIfRequired($value);


        if (empty($data))//.... in case of gamification outcome => play emoji
            return;

        $message = (new TagReplacementUtility())->generateTagText($data['message'], $this->venue_id, $this->user->user_id);
        switch ($this->user->device_type) {
            case 'android':

                $this->sendPushToAndroid($this->user->device_token, $message, $data['from'], $data['url'] ?? '', $data['type'] ?? '', $data['voucher'] ?? '');
                break;
            case 'ios':
                $this->sendPushToIos($this->user->device_token, $message ?? '', $data['from'], $data['url'] ?? '', $data['type'] ?? '', $data['voucher'] ?? '');
                break;
            default:
                if (config('constant.isLogging'))
                    Log::channel('custom')->info('processPushMessages()      User device type not recognized :', (array)$this->user);
                break;
        }//..... end of switch() .....//
    }//..... end of processPushMessages() .....//

    /**
     * @param $value
     * @return void
     * Process Sms messages.
     */
    private function processSmsMessages($value): void
    {
        $this->currentChannel = 'sms';

        $data = $this->persistDataIfRequired($value);

        if (empty($data))//.... in case of gamification outcome => play emoji
            return;

        $message = (new TagReplacementUtility())->generateTagText($data['message'], $this->venue_id, $this->user->user_id);
        $payload = [
            'to' => $this->user->user_mobile,
            'from' => $data['from'],
            'content' => $message
        ];
        $this->sendSms($payload);
    }//...... end of processSmsMessages() ......//

    /**
     * @param $value
     * Process Email messages.
     */
    private function processEmailMessages($value)
    {
        $this->currentChannel = 'email';

        $data = $this->generateEmailContents($value, $this->user->email);
    }//..... end of processEmailMessages() ......//

    /**
     * @param $value
     * @return array
     * Persist data if required.
     */
    private function persistDataIfRequired($value)
    {

        switch ($value->type) {
            case 'nooutcome':
                return [];
                break;
            case 'voucher':
                if ($this->currentChannel === 'sms')
                    return $this->getVoucherPayload('sms', $value);

                if ($this->currentChannel === 'push')
                    return $this->getVoucherPayload('push', $value);
                break;
            case 'integrated-voucher':
                if ($this->currentChannel === 'sms')
                    return $this->getVoucherPayload('sms', $value);

                if ($this->currentChannel === 'push')
                    return $this->getVoucherPayload('push', $value);
                break;
            case 'text':
                $message = $this->replaceTags($value->message);
                return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'type' => $value->type];
                break;
            case 'stamp-card':
                $this->awardStampCard($value);
                return ['from' => $value->venue_name, 'message' => 'You have got ' . (($this->user->old_user) ? '2 stamps' : '1 stamp'), 'url' => '', 'type' => 'punch_card_voucher'];
                break;
            case 'image':
                $message = $this->replaceTags($value->message);
                if ($this->currentChannel === 'sms')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message . ' URL: ' . url('/' . $value->resource), 'type' => $value->type];
                if ($this->currentChannel === 'push')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'url' => url('/' . $value->resource), 'type' => 'image'];
                break;
            case 'url':
                $message = $this->replaceTags($value->message);
                if ($this->currentChannel === 'sms')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message . ' URL: ' . $value->other->url, 'type' => $value->type];
                if ($this->currentChannel === 'push')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'url' => url('/' . $value->other->url), 'type' => 'url'];
                break;
            case 'video':
                $message = $this->replaceTags($value->message);
                if ($this->currentChannel === 'sms')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message . ' URL: ' . url('/' . $value->resource), 'type' => $value->type];
                if ($this->currentChannel === 'push')
                    return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'url' => url('/' . $value->resource), 'type' => 'video'];
                break;
            case 'point':
                $valuePoints = "Value Points";
                $statusPoints = "Status Points";
                $message = $value->venue_name . ': ' . $value->message . 'Value Points: ' . $value->other->content->points->$valuePoints . ' And Status Points:' . $value->other->content->points->$statusPoints;
                $this->awardPointsToUser($value);
                return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'url' => '', 'type' => 'points'];
                break;
            case 'token':
                $tokens = $value->other->content->tokens->tokens ?? 0;
                $this->rewardTokensToUser($tokens);
                $message = $this->replaceTags($value->message);
                return ['from' => $value->venue_name, 'message' => $value->venue_name . ': ' . $message, 'url' => '', 'type' => 'tokens'];
                break;
            case 'competition' || 'animation':
                if (isset($value->other->content->character) and $value->other->content->character) {
                    $this->markUserScannedCharacter($value->other->content->character);
                    $this->response[] = $value->other->content->character;
                    return [];
                } elseif (isset($value->other->content->competition) and $value->other->content->competition) {
                    if ($this->makeUserEntryIntoCompetition($value->other->content->competition, $value->other->content->entry_interval ?? null, $value->other->content->max_entry ?? null)) {
                        $message = 'You have successfully involved in competition ' . $value->other->content->competition->title;
                        //return ['from' => $value->venue_name, 'message' => $value->venue_name.': '.$message, 'url' => '', 'type' => 'tokens'];
                        return [];
                    }//..... end if() .....//

                    return [];
                }//..... end of if-else() .....//
                break;


            default:
                if (config('constant.isLogging'))
                    Log::channel('custom')->info('persistDataIfRequired()    Action type not recognized...');
        }//..... end of switch() .....//

        return $value;
    }//..... end of persistDateIfRequired() ......//

    /**
     * @param $tokens
     * @return bool
     * Save tokens against user to database.
     */
    private function rewardTokensToUser($tokens): bool
    {
        try {
            $data = [
                'user_id' => $this->user->user_id,
                'venue_id' => $this->venue_id,
                'coins' => $tokens,
                'company_id' => config('constant.COMPANY_ID')
            ];

            $data['coins'] = 1;

            for ($i = 0; $i < $tokens; $i++)
                UserCharityCoins::create($data);


            return true;
        } catch (\Exception $exception) {
            if (config('constant.isLogging'))
                Log::channel('custom')->info('rewardTokensToUser()    Tokens could not be Rewarded to user id: ', $this->user->user_id);

            return false;
        }//..... end of try-catch() .....//
    }//..... end of rewardTokensToUser() ......//

    public function replaceTags($message)
    {
        return (new TagReplacementUtility())->generateTagText($message, $this->venue_id, $this->user->user_id);
    }//..... end of replaceTags() .....//

    /**
     * @param int $user_id
     * @return string
     * Generate Voucher code.
     */
    private function getVoucherCode($user_id = 0): string
    {
        $setting = Setting::where('type', 'configure_points')->first();
        $chars = "0123456789";
        if ($setting) {
            if ($setting->field1 == 0) {
                $chars = "0123456789";
            } else {
                $chars = "ABCDEFGHIJKL0123456789MNOPQRSTUVWXYZ";
            }
        }

        $res = "";
        for ($i = 0; $i < 4; $i++)
            $res .= $chars[mt_rand(0, strlen($chars) - 1)];

        $code = str_split($res, 3);
        return $code[0] . $user_id . $code[1];
    }//..... end of getVoucherCode() .....//

    /**
     * @param $value
     * @param $voucher_code
     * Save voucher details to Elasticsearch.
     */
    private function saveVoucherToEs($value, $voucher_code)
    {
        $data = $this->prepareVoucherData($value, $voucher_code);


        if (!empty($data)) {
            VoucherUser::insert($data);
            return ['status' => true];
        } else {
            return ['status' => false];
        }

    }//..... end of saveVoucherToEs() .....//

    /**
     * @param $value
     * Send Points rewarding calls to loyalty.
     */
    private function awardPointsToUser($value): void
    {
        $valuePoints = 'Value Points';
        $statusPoints = 'Status Points';

        try {
            $data = [
                'company_id' => $this->campaign_id,
                'venue_id' => $this->venue_id,
                'amplify_id' => [$this->user->soldi_id],
            ];

            $this->curl->postJsonThroughGuzzle(config('constant.LOYALTY_DEFAULT_PATH') . 'assignCampaignPoints', [], array_merge($data, ['point_type' => 'status', 'points' => [['point_id' => 1, 'point_value' => $value->other->content->points->$statusPoints]]]));
            $this->curl->postJsonThroughGuzzle(config('constant.LOYALTY_DEFAULT_PATH') . 'assignCampaignPoints', [], array_merge($data, ['point_type' => 'value', 'points' => [['point_id' => 1, 'point_value' => $value->other->content->points->$valuePoints]]]));

        } catch (\Exception $exception) {
            if (config('constant.isLogging'))
                Log::channel('custom')->error('awardPointsToUser()    Error occurred while sending points types values to loyalty : ' . $exception->getMessage());
        }//..... end of try-catch() .....//
    }//..... end of awardPointsToUser() .....//

    /**
     * @param string $device_token
     * @param $message
     * @param $title
     * @param string $attachment_url
     * @param string $type
     * @return mixed
     */
    private function sendPushToIos($device_token, $message, $title, $attachment_url = '', $type = '', $voucher = ''): bool
    {
        $this->sendNotifications($this->user->device_token, $message, 'ios', $this->user->debug_mod, $type);
        return true;

    }//..... end of sendPushToIos() .....//

    /**
     * @param string $deviceToken
     * @param string $message
     * @param string $title
     * @param string $attachment_url
     * @param string $type
     * @return mixed
     */
    private function sendPushToAndroid($deviceToken = '', $message = '', $title = '', $attachment_url = '', $type = '', $voucher = ''): bool
    {

        $this->sendNotifications($this->user->device_token, $message, $deviceType = 'android', $debugMod = 0, $type);
        return true;
    }//..... end of sendPushToAndroid() ......//

    /**
     * @param string $type
     * @param $value
     * @return array
     */
    private function getVoucherPayload($type = '', $value): array
    {
        try {

            $voucher_code = $this->getVoucherCode($this->user->user_id);

            $response = $this->saveVoucherToEs($value, $voucher_code);
            if ($response['status']) {
                if ($type === 'sms') {
                    $message = 'You have got a voucher';
                    return ['from' => $value->venue_name, 'message' => $message, 'url' => '', 'type' => $value->type];
                }//..... end if() .....//

                if ($type === 'push') {
                    $message = 'You have got a voucher';

                    return ['from' => $value->venue_name, 'message' => $message, 'url' => url('/' . $value->resource), 'type' => $value->type];
                }//..... end if() .....//
            }
            return [];
        } catch (\Exception $e) {
            Log::channel('custom')->info('getVoucherPayloadError()', ['getVoucherPayloadError()' => $e->getMessage()]);
            return [];
        }
    }//..... end of getVoucherPayload() .....//

    /**
     * @param $value
     * @param $voucher_code
     * @return array
     * Prepare voucher data payload.
     */
    private function prepareVoucherData($value, $voucher_code): array
    {
        try {
            $content = $value->other->content;

            $voucher = Voucher::where(['id' => $content->voucher_id])->first();
            if ($voucher) {

                if ($voucher->voucher_type == 'group-voucher') {
                    $vouchers = collect(json_decode($voucher->voucher_avial_data, true))->pluck('id');
                } else {
                    $vouchers = [$voucher->id];
                }
                Log::channel('custom')->info('randomVoucher()', ['randomVoucher', $vouchers]);
                $voucherList = Voucher::whereIn('id', $vouchers)->get();

                $random = rand(0, (count($vouchers) - 1));
                $randomVoucher = (object)$voucherList[$random];
                return [
                    "user_id" => $this->user->user_id,
                    "company_id" => request()->company_id,
                    "voucher_start_date" => ($randomVoucher->isNumberOfDays)?date('Y-m-d H:i', strtotime('-1 days')):$randomVoucher->start_date,
                    "voucher_end_date" => ($randomVoucher->isNumberOfDays)?date('Y-m-d H:i', strtotime('+' . $randomVoucher->isNumberOfDays . ' days')):$randomVoucher->end_date,
                    "no_of_uses" => $randomVoucher->no_of_uses,
                    "uses_remaining" => $randomVoucher->no_of_uses,
                    "created_at" => date('Y-m-d H:i'),
                    "updated_at" => date('Y-m-d H:i'),
                    "voucher_id" => $randomVoucher->id,
                    "group_id" => $randomVoucher->group_id ?? 0,
                    "voucher_code" => $this->uniqueVoucherCode($randomVoucher->pos_ibs ?? 0),
                    'campaign_id' => $this->campaign_id
                ];
            } else {
                return [];
            }
        } catch (\Exception $e) {
            Log::channel('custom')->info('check', ['prepareVoucherData' => $e->getMessage()]);
            return [];
        }
    }//...... end of prepareVoucherData() .....//

    private function uniqueVoucherCode($ibs='')
    {
        $voucherCode = $this->getIBSCode($ibs??0);
        $voucherFind = VoucherUser::where('voucher_code',$voucherCode)->first();
        if(!empty($voucherFind)){
            return $this->uniqueVoucherCode($ibs??0);
        }else{
            return $voucherCode;
        }
    }
    public function getIBSCode($ibs = 0)
    {
        $settings = Setting::where('type', 'configure_numbers')->first();
        if ($settings->field1 == 1) {
            $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            $res = "";

            for ($i = 0; $i < 15; $i++)
                $res .= $chars[mt_rand(0, strlen($chars) - 1)];

            $code = str_split($res, 5);

            $first = $code[0] ?? '';
            $second = $code[1] ?? '';
            $third = $code[2] ?? '';
            $string = str_split($third, 2);
            $newString = $string[0] ?? "";
            return ($ibs) ? $ibs . $first . $second . $newString : $first . $second . $third;
        } else {
            $chars = "0123456789";
            $res = "";

            for ($i = 0; $i < 9; $i++)
                $res .= $chars[mt_rand(0, strlen($chars) - 1)];

            $code = str_split($res, 3);

            $first = $code[0] ?? '';
            $second = $code[1] ?? '';
            return ($ibs) ? $ibs . $first . $second : $first . $second;
        }
    }

    /**
     * @param $payload
     * Send sms to user.
     */
    private function sendSms($payload): void
    {
        try {
            $reagion = ["ap-southeast-2", "ap-southeast-2", "ap-southeast-2", "ap-southeast-2"];
            shuffle($reagion);
            (new awsClient(new Aws([
                'api_key' => config('constant.AWS_SNS_API_KEY'),
                'api_secret' => config('constant.AWS_SNS_API_SECRET'),
                'api_region' => array_pop($reagion)
            ])))->send($payload);

            if (config('constant.isLogging'))
                Log::channel('custom')->info('sendSms()       SMS Message Sent :', $payload);
        } catch (\Exception $exception) {
            if (config('constant.isLogging'))
                Log::channel('custom')->info('sendSms()       SMS Message could not be sent :', $payload);
        }//..... end of try-catch() .....//
    }//..... end of sendSms() .....//

    /**
     * @param $mission
     * @param $user
     * @return object
     * Record user and mission entry.
     */
    private function makeUserAndMissionEntry($mission, $user): object
    {
        $fetchRecord = MissionUserEntry::where(['user_id' => $user->user_id, 'mission_id' => $mission->id, 'game_id' => $mission->game_id, "created_at" => date("Y-m-d H:i:s")])->first() ? true : false;
        if (!$fetchRecord)
            return MissionUserEntry::create(['user_id' => $user->user_id, 'mission_id' => $mission->id, 'game_id' => $mission->game_id]);
    }//..... end of makeUserAndMissionEntry() .....//


    /**
     * @param $missions
     * Check user if he/she involved in all missions of a game.
     */
    private function checkUserIfQualifyTheGame($missions): void
    {
        //$outcomes = collect([]);
        $game_ids = $missions->unique('game_id')->pluck('game_id')->all();
        foreach ($game_ids as $game_id) :
            $game = $this->games->firstWhere('id', $game_id);
            if ($game->is_competition) {
                if ($game->missions->count() === CompetitionUserEntry::where(['game_id' => $game_id, 'user_id' => $this->user->user_id])->groupBy('competition_id')->get()->count()) {

                    $this->mission_id = 0;
                    $this->game_id = $game_id;
                    $this->processOutcomes($game->outcomes);

                    if (!$this->userInGame($this->user->user_id, $game_id)) {
                        GameUserEntry::create(['user_id' => $this->user->user_id, 'game_id' => $game_id]);
                    }//..... end of inner if() .....//
                }//..... end of outer if() .....//
            } else if ($game->missions->count() === MissionUserEntry::where(['game_id' => $game_id, 'user_id' => $this->user->user_id])->groupBy('mission_id')->get()->count()) {
                if (!$this->userInGame($this->user->user_id, $game_id)) {
                    //$outcomes = $outcomes->merge(collect($game->outcomes));
                    $this->mission_id = 0;
                    $this->game_id = $game_id;
                    $this->processOutcomes($game->outcomes);
                    GameUserEntry::create(['user_id' => $this->user->user_id, 'game_id' => $game_id]);
                }//..... end of inner if() .....//
            }//..... end of outer if() .....//
        endforeach;

        /*if ($outcomes->isNotEmpty())
            $this->processOutcomes($outcomes->toArray());*/
    }//...... end of checkUserIfQualifyTheGame() .....//

    /**
     * @param $user_id
     * @param $game_id
     * Check if user exist in game
     * @return bool
     */
    private function userInGame($user_id, $game_id): bool
    {
        return GameUserEntry::whereUserId($user_id)->whereGameId($game_id)->first() ? true : false;
    }//..... end of userInGame() .....//

    /**
     * @param array $value
     * @param string $email
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function generateEmailContents($value = [], $email = '')
    {
        $text = (new EmailGenerator())->makeGeneratedEmail($value);

        $r = (new TagReplacementUtility())->generateTagText($text->html ?? $text['html'], $this->venue_id, $this->user->user_id);
        try {
            return (new Client(['headers' => []]))
                ->request('POST', config('contant.JAVA_URL') . 'sendEmail', [
                    'json' => ["from" => "", "to" => $this->user->email, "subject" => $text['subject'] ?? $text->subject, "payload" => $r]
                ])->getBody();
        } catch (Exception $e) {
            Log::channel('custom')->error('generateEmailContents()      Email Forwarding To :', ['EmailMessageError' => $e->getMessage()]);
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }

        if (config('constant.isLogging'))
            Log::channel('custom')->info('generateEmailContents()        Email Forwarding To :', ['UserEmail' => $this->user->email]);
    }//..... end of generateEmailContents() .....//


    private function saveGamificationLogs()
    {

        try {
            $data = [
                "member_id" => $this->user->user_id,
                "campaign_id" => $this->campaign_id,
                "camp_channel" => strtoupper($this->currentChannel),
                "campaign_type" => 4,
                "date_added" => date("Y-m-d H:i:s"),
                "is_send" => 1,
                "type" => strtoupper($this->currentChannel),
                "company_id" => config('constant.COMPANY_ID'),
                "persona_id" => $this->user->user_id,
                "custom_doc_type" => config('constant.game_logs'),
            ];

            $index = config('constant.ES_INDEX_BASENAME');
            ElasticsearchUtility::insert($index, $data);


            return;
        } catch (\Exception $exception) {
            if (config('constant.isLogging'))
                Log::channel('custom')->error('saveGamificationLogs()     Error occurred while insertion Voucher Data into Elasticsearch : ' . $exception->getMessage());
            return;
        }//..... end of try-catch() .....//
    }//..... end of saveVoucherToEs() .....//


    private function setMissionAndGameLogs($data)
    {
        $res = [
            "member_id" => $this->user->user_id,
            "campaign_id" => $this->campaign_id,
            "camp_channel" => $data['type'],
            "campaign_type" => 4,
            "date_added" => date("Y-m-d H:i:s"),
            "company_id" => config('constant.COMPANY_ID'),
            "persona_id" => request()->user()->user_id,
            "message" => $data["message"],
            "device_token" => $data["device_token"],
            "custom_doc_type" => config('constant.mission_logs'),
            "details" => $data["push_result"]

        ];
        array_push($this->messionAndGameLogs, $res);
    }

    /**
     * @param $competition
     * Make user entry into competition.
     * @param $entry_interval
     * @param null $max_entry
     * @return bool
     */
    public function makeUserEntryIntoCompetition($competition, $entry_interval, $max_entry = null): bool
    {
        $lastEntry = $this->userInCompetition($competition->id, $this->user->user_id);

        if ($competition->is_unique_entry == 0 and $lastEntry)
            return false;

        /*   if ($max_entry and $this->countUserEntryIntoCompetition($competition->id, $this->user->user_id) >= $max_entry)
               return false;*/

        if ($lastEntry and Carbon::parse($lastEntry->created_at)->diffInHours(now()) <= $entry_interval and $entry_interval != 0)
            return false;

        $CompetitionToCreate = ['user_id' => $this->user->user_id, 'competition_id' => $competition->id, 'game_id' => $this->game_id];

        if (Carbon::parse($competition->end_date) >= now()) {
            CompetitionUserEntry::create($CompetitionToCreate);

        } else {
            CompetitionUserEntry::create(array_merge($CompetitionToCreate, ['in_draw' => 0]));

        }//..... end if-else() .....//

        return true;
    }//..... end of makeUserEntryIntoCompetition() .....//

    /**
     * Check if user is already in competition.
     * @param $competition_id
     * @param $user_id
     * @return mixed
     */
    private function userInCompetition($competition_id, $user_id)
    {
        return CompetitionUserEntry::whereCompetitionId($competition_id)->whereUserId($user_id)->latest()->first();
    }//..... end of userInCompetition() .....//

    /**
     * @param $cpt_id
     * @param $usr_id
     * @return mixed
     */
    private function countUserEntryIntoCompetition($cpt_id, $usr_id)
    {
        return CompetitionUserEntry::whereCompetitionId($cpt_id)->whereUserId($usr_id)->count();
    }//..... end of countUserEntryIntoCompetition() .....//

    /**
     * @param $character
     * Mark character against user.
     */
    private function markUserScannedCharacter($character): void
    {
        CharacterUserScanned::create([
            'game_id' => $this->game_id,
            'mission_id' => $this->mission_id,
            'character_id' => $character->id,
            'unique_title' => $character->unique_title,
            'user_id' => $this->user->user_id,
            'venue_id' => $this->venue_id
        ]);
    }

    private function sendNotifications($deviceToken = '', $message = '', $deviceType = '', $debugMod = '', $type = '')
    {
        try {
            Log::channel('custom')->info('sendNotifications()  :', ['PUSHNOTIFICATION' => ["device_token" => $this->user->device_token, 'message' => $message, 'deviceType' => $this->user->device_type, 'debugMode' => $this->user->debug_mod, 'tokenCompanyId' => $this->user->company_id, 'notification_type' => $type]]);
            $response = (new Client(['headers' => []]))
                ->request('POST', config('constant.JAVA_URL') . 'sendPush', [
                    'json' => ["device_token" => $this->user->device_token, 'message' => $message, 'deviceType' => $this->user->device_type, 'debugMode' => $this->user->debug_mod, 'tokenCompanyId' => $this->user->company_id, 'notification_type' => $type]
                ])->getBody();
            Log::channel('custom')->info('sendNotifications() :', ['sendNotifications()' => $response]);
            return true;
        } catch (Exception $e) {
            Log::channel('custom')->error('sendNotifications() :', ['sendNotifications()' => $e->getMessage()]);
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }

    }//..... end of markUserScannedCharacter() .....//

    /**
     * @param $value
     * @return array
     */
    private function awardStampCard($value)
    {

        try {
            $punchCardData = collect($value->other->content->punch_card)->pluck('id');
            $punchCount = 0;
            $through ='';
            $campaign = Campaign::where('id',$this->campaign_id)->first();
            $campaignName = $campaign->name;
            $campaignID = $campaign->id;
            if (isset($this->user->referalType) and ($this->user->referalType == 'refered' || $this->user->referalType == 'refree')) {
                $punchCount = $value->other->content->punch_count_referred;
                if($this->user->referalType  =='refered'){
                    $user =User::where('referral_code',$this->user->referal_by)->first();
                    $userEmail = $user->email;
                    $memberId = $user->client_customer_id;

                    $through = " From Referral: Referrer   $userEmail ($memberId) campaign name $campaignName and campaign id $campaignID";
                }
                if($this->user->referalType == 'refree'){
                    $user =User::where('referal_by',$this->user->referral_code)->orderBy('updated_at','DESC')->first();

                    $userEmail = $user->email;
                    $memberId = $user->client_customer_id;
                    if(isset($value->other->content->is_transaction) and !$value->other->content->is_transaction) {
                        $through = " From Referral: Referral User $userEmail ($memberId) campaign name $campaignName and campaign id $campaignID";
                    }else if(isset($value->other->content->is_transaction) and $value->other->content->is_transaction){
                        $memberTransaction = MemberTransaction::where('user_id' ,$user->user_id)->first();
                        if($memberTransaction){
                            $through = " From Referral: Referral User $userEmail ($memberId) campaign name $campaignName and campaign id $campaignID";
                        }else{
                            $through ='';
                        }
                    }
                }

            } else {
                $punchCount = $value->other->content->punch_count;
                $through = "From Signup: User campaign name $campaignName and campaign id $campaignID";
            }
            if ($punchCardData->isNotEmpty()) {
                if(!empty($through)) {
                    $allPunchCard = PunchCard::whereIn('id', $punchCardData)->get();

                    foreach ($allPunchCard as $key => $value) {
                        request()->merge(["company_id" => (request()->header('Country') == 'uk') ? \config('constant.COMPANY_ID') : \config('constant.COMPANY_IRE_ID'), "stampid" => $value->id, "userID" => $this->user->user_id, "stampassign" => $punchCount, 'notify' => false, 'addStamps' => false, 'assign_through' => $through]);
                        //call
                        (new ElasticSearchController())->stampCardAssign();
                    }
                }
            }
            return ['status' => true, 'message' => 'Stamp is assigned'];
        } catch (\Exception $e) {
            Log::channel('custom')->info('awardStampCard()     Award StampCard Error:', ['EROOR' => $e->getMessage()]);
        }
    }//----- End of awardStampCard() -----//

    /**
     * @param $missions
     * @param null $user
     * @return object
     * Filter for active missions.
     */
    public function setActiveMissionsForTransactions($missions, $user = null): object
    {
        $activeMissions = collect([]);
        $missions->each(function ($mission) use (&$activeMissions, $user) {
            /* if ((strtotime($mission->start_date) <= strtotime(now()->format('Y-m-d H:i:s')) and $mission->end_date == null)
                 || (strtotime($mission->start_date) <= strtotime(now()->format('Y-m-d H:i:s'))
                     and strtotime($mission->end_date) >= strtotime(now()->format('Y-m-d H:i:s')))) {*/

            if (!is_array($mission->outcomes))
                $mission->outcomes = json_decode($mission->outcomes);

            $activeMissions->push($mission);
            /* }//..... end of if() .....//*/
        });
        return $activeMissions;
    }//..... end of setActiveMissions() .....//

    /**
     * @return mixed
     * Get Gamification campaigns from database.
     */
    public function getGamificationCampaignsFor()
    {
        $companyID = (request()->header('Country') == 'uk') ? \config('constant.COMPANY_ID') : \config('constant.COMPANY_IRE_ID');
        $this->campaigns = Campaign::whereType(4)->when($companyID, function ($query) use ($companyID) {
            return $query->where('company_id', $companyID);
        })->with(['games.missions'])->get(['id', 'name', 'venue_id', 'type', 'target_value', 'action_type']);
        return $this->campaigns;
    }//---- End of getGamificationCampaignsFor() ----//

    /**
     * @param $user
     * @return mixed
     */
    public function getGamificationCampaignsForStudent($user)
    {

        $companyID = ($user->region_type??$user['region_type'] == 'uk') ? \config('constant.COMPANY_ID') : \config('constant.COMPANY_IRE_ID');
        $this->campaigns = Campaign::whereType(4)->when($companyID, function ($query) use ($companyID) {
            return $query->where('company_id', $companyID);
        })->with(['games.missions'])->get(['id', 'name', 'venue_id', 'type', 'target_value', 'action_type']);
        return $this->campaigns;
    }//..... end of getGamificationCampaignsForStudent() .....//

    public function sendNotificationsToDevices($user_id, $message, $type)
    {
        $this->user = User::where('user_id', $user_id)->first();

        $this->sendNotifications($deviceToken = '', $message, $deviceType = '', $debugMod = '', $type);
    }
}