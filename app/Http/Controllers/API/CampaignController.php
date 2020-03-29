<?php

namespace App\Http\Controllers\API;

use App\Models\Beacon;
use App\Models\Campaign;
use App\Models\CharacterUserScanned;
use App\Models\EmailTemplate;
use App\Models\Games;
use App\Models\GameUserEntry;
use App\Models\LevelConfiguration;
use App\Models\Mission;
use App\Models\MissionUserEntry;
use App\Models\NotificationEvent;
use App\Models\Segment;
use App\Models\Tags;
use App\User;
use App\Utility\ElasticsearchUtility;
use App\Utility\Gamification;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Matthewbdaly\SMS\Client as awsClient;
use Matthewbdaly\SMS\Drivers\Aws;
use function Aws\map;
use Illuminate\Support\Collection;

class CampaignController extends Controller
{
    /*sonar constants*/
    const COMPANY_ID                 = 'company_id';
    const VENUE_ID                 = 'venue_id';
    const CUSTOM                 = 'custom';
    const NEW_PREV                 = 'new_prev';
    const CAMPAIGN_ID                 = 'campaignID';
    const MESSAGE                 = 'message';
    const ACTION_VALUE                 = 'action_value';
    const DATE_FORMAT                 = 'Y-m-d H:i:s';


    public function __construct()
    {
        set_time_limit(0);
        ini_set('max_execution_time', '600');
        ini_set('max_input_time', '600');
    }

    /**
     * Function for get campaign list
     * @param Request $request
     * @return mixed
     */
    public function getCampaignList(Request $request)
    {
        $campaign = Campaign::where(["campaigns.venue_id" => $request->venue_id])
            ->orWhere(["campaigns.venue_id" => 0])->orderBy($request->name, $request->orderData)
            ->leftJoin("venues", "venues.venue_id", "=", "campaigns.venue_id", "campaigns.schedule_type");

        if ($request->has('filterType') && $request->filterType != 'All') {
            $campaign->where('type', ($request->filterType == 'Set & Forget') ? 1 : (($request->filterType == 'Proximity') ? 2 : 3));
        }

        if ($request->has('filterStatus') && $request->filterStatus != 'All') {
            $campaign->where('status', $request->filterStatus);
        }

        if($request->has('show_all_campaign') && !($request->show_all_campaign))
            $campaign->where('created_by',Auth::user()->user_id);

        if ($request->has('nameSearch')) {
            $campaign->where('name', 'like', '%' . $request->nameSearch . '%');
        }

        $res = $campaign->skip($request->offset)->take($request->limit)->get(["campaigns.*", "venues.venue_name"]);
        foreach ($res as $value) {
            $v = $this->getGameAsCompetitionAgainstCampaign($value->id);
            $value->campaign_type = "";
            if ($v) {
                $value->campaign_type = "Competition";
            } else {
                $value->campaign_type = ucfirst(str_replace('_', ' ', $value->schedule_type));
                if ($value->campaign_type == "Run now") {
                    $value->campaign_type = "Immediate";
                }
            }

        }

        return ['status' => true, 'total' => Campaign::where([self::COMPANY_ID => $request->company_id, self::VENUE_ID => $request->venue_id, 'deleted_at' => null])->count(), 'data' => $res];
    }//--- End of getCampaignList() ---//

    /**
     * @param FilesController $filesController
     * @return array
     * Save newly created campaign.
     */
    public function saveCampaign(FilesController $filesController)
    {
        if (request()->type == 4) {
            return $this->saveGamificationCampaign($filesController);
        }
        $campaign = Campaign::updateOrCreate(['id' => request()->campaignID], array_merge(
            [self::ACTION_VALUE => json_encode($this->handleImageUploading(json_decode(request()->action_value), $filesController)),
                "activated_by"=>(request()->status == "Active")? Auth::user()->user_id : 0,"created_by" => Auth::user()->user_id
                ],
            request()->except(['isEditMode', self::CAMPAIGN_ID, 'campaignTags', self::ACTION_VALUE, 'send_email'])));

        if ($campaign) {
            try {

               if ($campaign->schedule_type === 'run_now' && !request()->isEditMode) {

                    $response = $this->forwardCampaignToJavaActiveMQ($campaign);
                    if (!$response) {
                        $campaign->delete();
                        return $this->getResponse(false, 'Error Occurred While forwarding campaign to ActiveMQ');
                    }//..... end if() .....//

                } //..... end if() .....//
                Log::channel(self::CUSTOM)->info('Save Campaign', ['Data ' => request()->all()]);
                if (request()->isEditMode && request()->target_user === self::NEW_PREV) {
                    $responseData = $this->forwardDpdateCampaign($campaign);
                    if (!$responseData) {
                        return $this->getResponse(false, 'Error While Updating');
                    }
                }
                if ($campaign->type === 'Dynamic') {
                    $tagsIDs = [];
                    foreach (json_decode(request()->campaignTags) as $item) {
                        $tagsIDs[] = Tags::firstOrCreate(['name' => $item])->id;
                    }

                    $campaign->tags()->sync($tagsIDs);
                }//.... end if() .....//

                return $this->getResponse(true, 'Campaign saved successfully!');
            } catch (\Exception $e) {
                if (!request()->isEditMode) {
                    $campaign->delete();
                }
                return $this->getResponse(false, 'Error Occurred While forwarding campaign to ActiveMQ.' . $e->getMessage());
            }//..... end of try-catch() .....//
        } else {
            return $this->getResponse(false, 'Error occurred while saving campaign');
        }//..... end if-else() ....//
    }//..... end of saveCampaign() .....//


    public function sendEmails($campaign_name, $usersEmail)
    {
        $html = EmailTemplate::where('title', 'CampaignActivate')->first();

        $html_text = $html->html;
        $email_from = config('constant.mail_from_address');
        $viewName = 'email.referral_code';
        $email_subject = "Activate Campaign";
        foreach ($usersEmail as $value) {
            $user_email = $value['email'];
            $user_name = $value['name'];
            if ($html) {
                $vars = ['|FirstName|' => $value['name'], '|Email|' => $value['email'], '|Campaign Name|' => $campaign_name];
                $html = strtr($html_text, $vars);
                $request['text'] = $html;
            } else {

                $html = "Hi $user_name New campaign <h5>$campaign_name</h5> is created. please activate the campaign.";
                $request['text'] = $html;
            }

            Mail::send($viewName, $request, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
                $message->to($user_email, $user_email)->cc("burhan@plutuscommerce.net")->subject($email_subject);
            });


        }
    }

    public function activateCampaign()
    {
        $campaign = Campaign::select("name", "created_by")->whereId(request()->campaign_id)->first();
        $campaign_name = $campaign->name;
        Campaign::whereId(request()->campaign_id)->update(["status" => "Active", "activated_by" => Auth::user()->user_id, "is_play" => 1]);
        $user = User::whereUserId($campaign->created_by)->first();
        if ($user) {
            $this->sendEmailOnActivation($campaign_name, $user->email, $user->user_first_name . " " . $user->user_family_name);
        }

        return ["status" => true, self::MESSAGE => "Campaign Activated successfully"];

    }

    //====================== send email only to franchisee user i.e campaign creator user  ================//
    public function sendEmailOnActivation($campaign_name, $user_email, $user_name)
    {
        $html = EmailTemplate::where('title', 'CampaignActivated')->first();
        if($html) {
            $html_text = $html->html;
            $email_from = config('constant.mail_from_address');
            $email_subject = "Campaign activation success";
            $viewName = 'email.referral_code';

            if ($html) {
                $vars = ['|FirstName|' => $user_name, '|Email|' => $user_email, '|Campaign Name|' => $campaign_name];
                $html = $html_text;
                $html = strtr($html, $vars);
                $request['text'] = $html;
            } else {
                $html = "Hi $user_name New campaign <h5>$campaign_name</h5> is created. please activate the campaign.";
                $request['text'] = $html;
            }

            Mail::send($viewName, $request, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
                $message->to($user_email, $user_email)->cc("burhan@plutuscommerce.net")->subject($email_subject);
            });
        }

    }


    /**
     * @param $campaign
     * Forward Campaign ID to java Active MQ.
     * @return string
     */
    private function forwardCampaignToJavaActiveMQ($campaign)
    {
        Log::channel(self::CUSTOM)->info('Changes',['forwardCampaignToJavaActiveMQ'=>config('constant.JAVA_ACTIVEMQ_URL')]);
            $response = (new Client())->post(config('constant.JAVA_ACTIVEMQ_URL'), [
                'headers' => array('campaign_type' => "CAMPAIGN"),
                'json' => [self::CAMPAIGN_ID => $campaign->id],
            ]);

            $response = $response->getBody()->getContents();
            $response = json_decode($response);
            return $response->status;

    }//..... end of forwardCampaignToJavaActiveMQ() .....//

    /**
     * @param Request $request
     * @return string
     * @throws \Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException
     */
    public function sendTestCampaign(Request $request)
    {
        if ($request->current_channel == 'sms') {
            $mobile = explode(',', $request->mobile);
            foreach ($mobile as $value) {
                $this->sendTestSms($request, $value);
            }
            return "true";
        }
        $res = (new Client())->post(config('constant.JAVA_CAMPAIGN_TEST_URL') . 'sendTest', [
            'headers' => array(),
            'json' => ['mobile' => $request->mobile, self::VENUE_ID => $request->venue_id, 'chanel' => $request->current_channel, self::ACTION_VALUE => $request->channel_data]
        ]);

        $data = json_decode($res->getBody()->getContents());
        return $data->status ? "true" : "false";
    }//..... end of sendTestCampaign() .....//

    /**
     * @param $id
     * Get Campaign Details by ID.
     * @return
     */
    public function getCampaignById($id)
    {
        $campaign = Campaign::with('tags:name')->find($id);

        $campaign->selectedSegments = Segment::whereIn('id', explode(',', $campaign->target_segments))->get();
        return $campaign;
    }//..... end of getCampaignById() .....//

    /**
     * @param $id
     * @return array
     * Delete intended Campaign.
     */
    public function deleteCampaign($id)
    {
        $campaign = Campaign::find($id);
        if ($campaign) {
            $games = Games::whereCampaignId($id);
            $games->each(function ($game) {
                Mission::where('game_id', $game->id)->delete();
                GameUserEntry::whereGameId($game->id)->delete();
                MissionUserEntry::whereGameId($game->id)->delete();
                CharacterUserScanned::whereGameId($game->id)->delete();
                $game->delete();
            });
        }

        return $campaign->delete() ?
            $this->getResponse(true, 'Campaign Deleted Successfully.') :
            $this->getResponse(false, 'Error occurred while deleting campaign');
    }//..... end of deleteCampaign() .....//

    /**
     * @param $id
     * @return array
     * Duplicate intended campaign.
     */
    public function duplicateCampaign($id)
    {
        try {
            $campaign = Campaign::find($id)->replicate();

            preg_match('#\((.*?)\)#', $campaign->name, $match);
            if (isset($match[1]) && is_numeric($match[1])) {
                $newInc = $match[1] + 1;
                $campaign->name = str_replace($match[1], $newInc, $campaign->name);
            } else {
                $campaign->name = $campaign->name . '(1)';
            }//..... end if-else() .....//

            $campaign->save();
            return $this->getResponse(true, 'Campaign Replicated Successfully.');
        } catch (\Exception $e) {
            return $this->getResponse(false, 'Error occurred while replicating campaign' . $e->getMessage());
        }//..... end of try-catch() .....//
    }//..... end of duplicateCampaign() .....//

    /**
     * @param $venueID
     * @return mixed
     * Get Floor list of a venue.
     */
    public function floorList($venueID)
    {
        return LevelConfiguration::whereVenueId($venueID)->whereStatus(1)->get();
    }//..... end of floorList() .....//

    /**
     * @param $venueID
     * @param $levelID
     * @return
     */
    public function floorBeaconsList($venueID, $levelID)
    {
        return Beacon::whereVenueId($venueID)->whereLevelId($levelID)->whereStatus(1)->get(['id', 'beacon_name', 'x_coordinate', 'y_coordinate']);
    }//..... end of floorBeaconsList() .....//

    /**
     * @param $status
     * @param $message
     * @return array
     * Just use to prepare response object.
     */
    private function getResponse($status, $message)
    {
        return ['status' => $status, self::MESSAGE => $message];
    }//..... end of getResponse() .....//

    /**
     * @return mixed
     * Get tags list.
     */
    public function tagsList()
    {
        return Tags::get();
    }//..... end of tagsList() .....//


    /**
     * @param $request
     * @param $value
     * @return bool
     * @throws \Matthewbdaly\SMS\Exceptions\DriverNotConfiguredException
     */
    private function sendTestSms($request, $value)
    {
        $messageData = '';
        if ($request->channel_data['type'] === 'text') {
            $messageData = $request->channel_data[self::MESSAGE];
        }
        if ($request->channel_data['type'] === 'point') {
            $messageData = $request->channel_data[self::MESSAGE] ?? '';
        }
        $collection = Collection::times(4, function () {
            return "ap-southeast-2";
        });
        $reagion = $collection->all();
        shuffle($reagion);
        $config = [
            'api_key' => config('constant.AWS_SNS_API_KEY'),
            'api_secret' => config('constant.AWS_SNS_API_SECRET'),
            'api_region' => array_pop($reagion)
        ];
        $driver = new Aws($config);
        $client = new awsClient($driver);

        $msg = [
            'to' => $value,
            'from' => 'Wimpy',
            'content' => $messageData,
        ];

        $client->send($msg);
        return true;

    }//..... end of sendTestSms() .....//

    /**
     * @param $action_value
     * @param $filesController
     * @return mixed
     * Handle base64 image.
     */
    private function handleImageUploading($action_value, $filesController)
    {
        try {
            foreach ($action_value as $av) {
                if (!Str::contains($av->value->resource, 'uploads') && base64_decode($av->value->resource)) {
                    $image = 'uploads/' . time() * rand(1, 8) . ".png";

                    if ($filesController->uploadBase64Image($av->value->resource, $image)) {
                        $av->value->resource = $image;
                    }
                }//..... end if() .....//

                if (!Str::contains($av->value->other->content->badgeImage, 'uploads') && isset($av->value->other->content->badgeImage) && base64_decode($av->value->other->content->badgeImage)) {
                    $badgeImage = 'uploads/' . time() * rand(1, 8) . ".png";
                    if ($filesController->uploadBase64Image($av->value->other->content->badgeImage, $badgeImage)) {
                        $av->value->other->content->badgeImage = $badgeImage;
                    }
                }//..... end if() .....//
            }//..... end foreach() .....//

            return $action_value;

        } catch (\Exception $exception) {
            return $action_value;
        }//..... end of try-catch() ......//
    }//..... end of handleImageUploading() .....//

    /**
     * Save Gamification Campaign.
     * @param $filesController
     * @return array
     */
    private function saveGamificationCampaign($filesController): array
    {
        $campaign = Campaign::updateOrCreate(['id' => request()->campaignID], array_merge(request()->except(['isEditMode', self::CAMPAIGN_ID, 'campaignTags', self::ACTION_VALUE, 'send_email']), ["is_play" => 1]));
        $missionOutComes = [];
        $action_value = json_decode(request()->action_value);
        foreach ($action_value as $game) :
            foreach ($game->outcomes as $outcome) :
                $outcome->action_value = $this->handleImageUploading(is_array($outcome->action_value) ? $outcome->action_value : json_decode($outcome->action_value), $filesController);
            endforeach;

            $createdGame = $this->createGame($game, $campaign);
            $game->id = $createdGame->id;

            foreach ($game->missions as $mission):

                foreach ($mission->outcomes as $mOutcome):
                   if (request()->isEditMode && request()->target_user === self::NEW_PREV) {
                       $mOutcome->mission_id = $mission->id;
                       $missionOutComes[] =$mOutcome;
                    }
                    $mOutcome->action_value = $this->handleImageUploading(is_array($mOutcome->action_value) ? $mOutcome->action_value : json_decode($mOutcome->action_value), $filesController);
                endforeach;
                $createdMission = $this->createMission($mission, $createdGame);
                $mission->id = $createdMission->id;
            endforeach;
        endforeach;

       /* if (request()->isEditMode && request()->target_user === self::NEW_PREV) {
            $this->updateGamificationVoucher($missionOutComes);
        }*/
        $campaign->action_value = json_encode($action_value);
        $campaign->save();
        return $this->getResponse(true, 'Campaign saved successfully!');
    }//..... end of saveGamificationCampaign() ......//

    /**
     * @param $game
     * @param $campaign
     * @return mixed
     * Create Game of Campaign.
     */
    private function createGame($game, $campaign)
    {
        return Games::updateOrCreate(['campaign_id' => $campaign->id, 'id' => $game->id ?? 0], [
            'title' => $game->title,
            'campaign_id' => $campaign->id,
            'description' => $game->description,
            'start_date' => ($game->start_date && $game->start_date != "n\/a" && $game->start_date != "n/a") ? Carbon::parse($game->start_date)->format(self::DATE_FORMAT) : null,
            'end_date' => ($game->end_date && $game->end_date != "n\/a" && $game->end_date != "n/a") ? Carbon::parse($game->end_date)->format(self::DATE_FORMAT) : null,
            'outcomes' => json_encode($game->outcomes),
            'is_competition' => $game->is_competition ?? 0
        ]);
    }//.... end of createGame() .....//

    /**
     * @param $mission
     * @param $createdGame
     * @return mixed
     * Create Mission of a Game.
     */
    private function createMission($mission, $createdGame)
    {
        return Mission::updateOrCreate(['game_id' => $createdGame->id, 'id' => $mission->id ?? 0], [
            'game_id' => $createdGame->id,
            'title' => $mission->title,
            'description' => $mission->description,
            'start_date' => ($mission->from_date && $mission->from_date != "n\/a" && $mission->from_date != "n/a") ? Carbon::parse($mission->from_date)->format(self::DATE_FORMAT) : null,
            'end_date' => ($mission->end_date && $mission->end_date != "n\/a" && $mission->end_date != "n/a") ? Carbon::parse($mission->end_date)->format(self::DATE_FORMAT) : null,
            'outcomes' => json_encode($mission->outcomes),
            'target_segments' => $mission->target_segments
        ]);
    }//...... end of createMission() ......//


    private function getGameAsCompetitionAgainstCampaign($campaign_id)
    {
        $res = Games::where(["campaign_id" => $campaign_id, "is_competition" => 1])->first();
        return $res ? "Competition" : "";
    }

    /**
     * @return array
     * Get Businesses List from Soldi.
     */
    public function getBusiness($company_id = '')
    {
        try {

            $api_key = config('constant.SOLDI_API_KEY');
            $api_secret = config('constant.SOLDI_SECRET');
            $companyName = 'GBK';

            if (request()->has(self::COMPANY_ID) || !empty($company_id)) {
                if (request()->company_id == config('constant.COMPANY_IRE_ID') || $company_id == config('constant.COMPANY_IRE_ID')) {
                    $api_key = config('constant.SOLDI_IRE_APIKEY');
                    $api_secret = config('constant.SOLDI_IRE_SECRET');
                    $companyName = 'gbkire';
                }
            }
            Log::channel(self::CUSTOM)->info('data', ['SOLDI_APIKEY' => $api_key, 'api_secret' => $api_secret]);

            $response = (new Client())->get(config('constant.SOLDI_DEFAULT_PATH') . "/restaurants/list?type=$companyName", [
                'headers' => [
                    "SECRET" => $api_secret,
                    "X-API-KEY" => $api_key,
                    "content-type" => "application/x-www-form-urlencoded"
                ]
            ]);

            if ($response->getStatusCode() == '200') {
                $businesses = (json_decode($response->getBody()->getContents()))->data;
                if (request()->venue_id) {
                    $businessList = [];
                    $ids = \DB::table('venue_category')->select('venue_category_shops.shop_id')->where('venue_category.venue_id', request()->venue_id)
                        ->join('venue_category_shops', 'venue_category.category_id', '=', 'venue_category_shops.category_id')->pluck('shop_id');

                    foreach ($businesses as $business) {
                        if ($ids->contains($business->business_id)) {
                            $businessList[] = $business;
                        }
                    }

                    foreach ($businessList as $value) {
                        $value->id = $value->business_id;
                        $value->label = $value->business_name;
                        $value->value = false;
                    }
                    return ['status' => true, 'data' => $businessList];
                }//..... end if() .....//
                //array_unshift($businesses,$all_business);
                return ['status' => true, 'data' => $businesses];
            } else {
                return ['status' => false, 'data' => [], self::MESSAGE => 'Could not get Businesses from Soldi.'];
            }
        } catch (\Exception $e) {
            return ['status' => false, self::MESSAGE => 'Error occurred while grabbing businesses from Soldi. ' . $e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of getBusiness() .....//

    /**
     * @param Request $request
     * @return array
     * Get Business Category from Soldi.
     */
    public function getBusinessCategory(Request $request)
    {
        try {

            $api_key = config('constant.SOLDI_API_KEY');
            $api_secret = config('constant.SOLDI_SECRET');

            if (request()->has(self::COMPANY_ID) && (request()->company_id == config('constant.COMPANY_IRE_ID'))) {
                $api_key = config('constant.SOLDI_IRE_APIKEY');
                $api_secret = config('constant.SOLDI_IRE_SECRET');
                $companyName = 'gbkire';
            }
            $response = (new \GuzzleHttp\Client())->get(config('constant.SOLDI_DEFAULT_PATH') . '/pos/menuslist?business_id=' . $request->business_id, [
                'headers' => [
                    "SECRET" => $api_secret,
                    "X-API-KEY" => $api_key,
                    "content-type" => "application/x-www-form-urlencoded"
                ]
            ]);
            $newData = [];
            if ($response->getStatusCode() == '200') {
                foreach ((json_decode($response->getBody()->getContents()))->data as $value) {
                    $cateData = [];
                    if (count($value->cate_items) == 0) {
                        if (count($value->subcategories) > 0) {
                            foreach ($value->subcategories as $subcategoryValues) {
                                foreach ($subcategoryValues->cate_items as $subItems) {
                                    $cateData[] = $subItems;
                                }
                            }


                            $value->cate_items = $cateData;

                        } else {
                            $value->cate_items = $value->subcategories[0]->cate_items;
                        }
                    }

                    foreach ($value->cate_items as $productItems) {
                        $string = '';

                        if (isset($productItems->metadata_array->PLU_Product) && count($productItems->metadata_array->PLU_Product) > 0) {

                            foreach ($productItems->metadata_array->PLU_Product as $value1) {
                                if(!empty($value1->value)) {
                                    $string = $string . $value1->value . ',';
                                }
                            }
                        }

                        $productItems->voucher_plu_ids = rtrim($string, ',');

                        $value->voucher_plu_idd = "," . rtrim($string, ',') . ',';
                        $productItems->voucher_plu_idd = "," . rtrim($string, ',') . ',';

                    }

                    $newData[] = $value;
                }

                return ['status' => true, 'data' => $newData];
            } else {
                return ['status' => false, 'data' => [], self::MESSAGE => 'Could not get categories from Soldi.'];
            }
        } catch (\Exception $e) {
            return ['status' => false, self::MESSAGE => 'Error occurred while grabbing categories from Soldi. ' . $e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of getBusinessCategory() .....//

    /**
     * @return array
     * Get Category's Products from soldi.
     */
    public function getCategoryProducts()
    {
        try {

            $categoryID = explode('_', request()->cat_id);

            $response = (new \GuzzleHttp\Client())->get(config('constant.SOLDI_DEFAULT_PATH') . '/inventory/list?cate_id=' . $categoryID[0], [
                'headers' => [
                    "SECRET" => config('constant.SOLDI_SECRET'),
                    "X-API-KEY" => config('constant.SOLDI_API_KEY'),
                    "content-type" => 'application/json'
                ]
            ]);
            return ($response->getStatusCode() == '200')
                ? ['status' => true, 'data' => (json_decode($response->getBody()->getContents()))->data]
                : ['status' => false, 'data' => [], self::MESSAGE => 'Could not get products from Soldi.'];
        } catch (\Exception $e) {
            return ['status' => false, self::MESSAGE => 'Error occurred while grabbing category products from Soldi. ' . $e->getMessage()];
        }//..... end of try-catch() .....//
    }

    public function getActiveCampaignList()
    {
        return [
            "status" => true,
            "data" => Campaign::whereNull('deleted_at')->whereVenueId(request()->venue_id)->get(['id', 'name'])
        ];

    }

    /**
     * @param $campaign
     * @return mixed
     */
    private function forwardDpdateCampaign($campaign)
    {
        $response = (new Client())->post(config('constant.JAVA_URL') . 'updateCampaignAssignedVouchers', [
            'headers' => [],
            'json' => ['campaign_id' => $campaign->id],
        ]);

        $response = $response->getBody()->getContents();
        $response = json_decode($response);
        Log::channel(self::CUSTOM)->info('response for api updat', ['response' => $response]);
        return $response->status;
    }//..... end of forwardCampaignToJavaActiveMQ() .....//

    public function updateGamificationVoucher($outcome)
    {

        foreach ($outcome as $value){

            foreach ($value->action_value as $actionValue):

              if($actionValue->value->type =='integrated-voucher' || $actionValue->value->type=='voucher')
              {

                $this->prepareVoucherData($actionValue->value,$value->mission_id);
              }
              endforeach;
        }
      return ['status' =>true];
    }

    private function prepareVoucherData($value,$missionID): array
    {
        $content = $value->other->content;
        $data = [
            'voucher_amount'        => $content->discount??0,
            "voucher_name"          => $content->voucher_name??'',
            'voucher_type'          => $content->discount_type,
            'promotion_text'        => $content->promotion_text,
            'no_of_uses'            => $content->no_of_uses,
            'uses_remaining'        => (int)$content->no_of_uses,
            'voucher_start_date'    => $content->voucher_start_date ?? date('d-m-Y H:i', strtotime('-1 days')),
            'voucher_end_date'      => $content->voucher_end_date ?? date('d-m-Y H:i', strtotime('+' . $content->isNumberOfDays . ' days')),
            'redemption_interval'   => $content->redemption_interval ?? 0,
            'basket_level'          => $content->basket_level,
            'voucher_avail_type'    => $content->voucher_avail_type,
            'voucher_status'        => 1,
            "businesses"            => $content->business,
            'dateadded'             => strtotime(date(self::DATE_FORMAT)),
            'custom_doc_type'       => config('constant.user_integrated_voucher'),
            'voucher_avial_data'    => $content->voucher_avial_data ?? [],
            'campaign_id'           => \request()->campaignID,
            'attachment_url'        =>  url('/'.$value->resource),
            "voucher_redeem_date"   => 0,
            "max_redemption"        => 0,
            "pos_ibs"               =>  $content->pos_ibs,
            self::VENUE_ID              =>"262751",
            "id"                   => $missionID,
            "isNumberOfDays"        => $content->isNumberOfDays ?? 0,
        ];
        $query =  ["query" => ["bool" => ["must" => [["terms"=> ["custom_doc_type"=> [config('constant.user_integrated_voucher')]]],
            ["match" => ["campaign_id" => request()->campaignID]],
            ["match" => ["id" => $missionID]],
        ]]]];

        $comapignData = (new ElasticsearchUtility())->getAllData($query,config('constant.ES_INDEX_BASENAME'));

        if(count($comapignData)>0) {
            return ElasticsearchUtility::bulkUserDataUpdateVoucher($comapignData, $data);
        }else{
            return ['status'=>true];
        }
    }//...... end of prepareVoucherData() .....//

    public function campaignReport()
    {
        //DB::enableQueryLog();
        $campaigns = Campaign::where('action_value', 'like', '%name":"'.request()->event_type.'"%')->orderBy('created_at','DESC')->skip(request()->offset)->take(request()->limit)->get();
        foreach ($campaigns as $key=>$value){
            $notifications = NotificationEvent::where('campaign_id',$value['id'])->get();
            $segemet = Segment::where('id',$value['target_segments'])->first();

            $reports = $this->getCampaignReportData($value['id']);
            $countData = $this->getCampaignReportDataUser($value['id']);
            $campaigns[$key]['delivered'] =($notifications->where('event','delivered')->count())?$notifications->where('event','delivered')->count():0;

            $campaigns[$key]['click'] =($notifications->where('event','click')->count())?$notifications->where('event','click')->count():0;
            if(request()->event_type =='sms'){
                $campaigns[$key]['sent'] =($notifications->where('event','sent')->count())?$notifications->where('event','sent')->count():0;
                $campaigns[$key]['undelivered'] =( $notifications->where('event','undelivered')->count())? $notifications->where('event','undelivered')->count():0;
            }else {
                $campaigns[$key]['processed'] =($notifications->where('event','processed')->count())?$notifications->where('event','processed')->count():0;
                $campaigns[$key]['open'] =( $notifications->where('event','open')->count())? $notifications->where('event','open')->count():0;
                $campaigns[$key]['undelivered'] = (($segemet->persona - count($countData))>=0)?($segemet->persona - count($countData)):0;
            }
            $campaigns[$key]['report'] = $reports;
            $campaigns[$key]['active'] = false;

        }
         return ['status' => true, 'data' => $campaigns];
    }

    public function campaignUnsubscriptionReport()
    {
        $emailEvents = NotificationEvent::select(["notification_events.*","notification_events.email as phone_number","campaigns.name","users.client_customer_id",\DB::raw("CONCAT(user_first_name, ' ', user_family_name) AS userName")])->where(["event"=>request()->event_type])
            ->leftJoin("campaigns","campaigns.id","=","notification_events.campaign_id")
            ->leftJoin("users","users.user_id","=","notification_events.user_id");




        if (!empty(request()->search)) {
            if (is_numeric(request()->search)) {
                $user = User::where('client_customer_id', 'like', '%' . request()->search . '%')
                    ->orWhere('user_id', request()->search)
                    ->pluck('user_id');
                if (count($user->toArray())>0) {
                    $emailEvents->whereIn('notification_events.user_id', $user);
                }
            } else {

                $nameSearch = explode(' ', request()->search);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {

                    $user = User::where('user_first_name', 'like', '%' . str_replace('%', '', $nameSearch[0]) . '%')
                        ->orWhere('user_family_name', 'like', '%' . $nameSearch[1] . '%')
                        ->pluck('user_id');

                    if (count($user->toArray())>0) {
                        $emailEvents->whereIn('notification_events.user_id', $user);
                    }else{
                        $campaign = DB::table("campaigns")->where('name', 'like', '%' . request()->search . '%')->pluck('id');

                        $emailEvents->whereIn('notification_events.campaign_id', $campaign);
                    }
                } else {

                    $user = User::where('user_first_name', 'like', '%' . request()->search . '%')
                        ->orWhere('user_family_name', 'like', '%' . request()->search . '%')
                        ->orWhere('email', 'like', '%' . request()->search . '%')->pluck('user_id');

                    if((count($user)) == 0){
                        $user = NotificationEvent::Where('email', 'like', '%' . request()->search . '%')->orWhere('event', 'like', '%' . request()->search . '%')->pluck('user_id');
                    }

                    if(count($user->toArray())>0) {
                        $emailEvents->whereIn('notification_events.user_id', $user);
                    }else{

                        $campaign = DB::table("campaigns")->where('name', 'like', '%' . request()->search . '%')->pluck('id');
                        $emailEvents->whereIn('notification_events.campaign_id', $campaign);
                    }
                }
            }
        }
        switch (request()->orderBy){
            case "name":
                $emailEvents->orderBy("campaigns.name",request()->orderType);
            case "client_customer_id":
                $emailEvents->orderBy("users.client_customer_id",request()->orderType);
            case "email":
                $emailEvents->orderBy("notification_events.email",request()->orderType);
            case "phone_number":
                $emailEvents->orderBy("notification_events.email",request()->orderType);
            case "userName":
                $emailEvents->orderBy("users.user_first_name",request()->orderType);
            default:
                $emailEvents->orderBy("notification_events.timestamp",request()->orderType);
        }

        $total = $emailEvents->get();


        //dd(DB::getQueryLog());
        $data = ['data' => $emailEvents->skip(request()->offset)->take(request()->limit)->get() ,'status' => true ,'count' => count($total)];
        foreach ($data['data'] as $key=>$value){
            $value->status =$value['event'];
            $value->date_added = date('Y-m-d H:i:00',$value->timestamp);

            $value->active = false;
        }
        return $data ;
    }

    private function getCampaignReportData($id)
    {
        $notifications = NotificationEvent::select(["notification_events.*","notification_events.email as phone_number","campaigns.name","campaigns.created_at as campaign_date","users.client_customer_id",\DB::raw("CONCAT(user_first_name, ' ', user_family_name) AS userName")])->where(["event_type"=>request()->event_type])
            ->leftJoin("campaigns","campaigns.id","=","notification_events.campaign_id")
            ->leftJoin("users","users.user_id","=","notification_events.user_id")
            ->where('campaign_id',$id)->get()->toArray();
        foreach ($notifications as $key=>$value){
            $notifications[$key]['date_added'] = date('Y-m-d H:i',$value['timestamp']);
        }
        return $notifications;
    }
    private function getCampaignReportDataUser($id)
    {
        $notifications = NotificationEvent::select(["notification_events.*","notification_events.email as phone_number","campaigns.name","users.client_customer_id",\DB::raw("CONCAT(user_first_name, ' ', user_family_name) AS userName")])->where(["event_type"=>request()->event_type])
            ->leftJoin("campaigns","campaigns.id","=","notification_events.campaign_id")
            ->leftJoin("users","users.user_id","=","notification_events.user_id")
            ->where('campaign_id',$id)->groupBy(['campaign_id','user_id'])->get()->toArray();

        return $notifications;
    }
    public function playStopCampaign()
    {
        Campaign::whereId(request()->id)->update(["is_play" => request()->status]);
        ['status' => true, 'message' => "success"];
    }


}//..... end of CampaignController.
