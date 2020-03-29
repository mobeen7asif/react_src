<?php

namespace App\Http\Controllers\API;

use App\Models\Charity;
use App\Models\CharityTier;
use App\Models\UserCharityCoins;
use App\Models\Venue;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\API\GamificationController;

class CharityApiController extends Controller
{

    /*sonar constants*/
    const STATUS                 = 'status';
    const MESSAGE                 = 'message';
    const CHARITIES                 = 'charities';
    const REQUIRED                 = 'required';
    const COMPANY_ID                 = 'company_id';
    const USER_ID                 = 'user_id';
    const COINS                 = 'coins';
    const CHARITY_ID                 = 'charity_id';
    const ORGANIZATION                 = 'organization';
    const CHARITY                 = 'charity';


    /**
     * @param Request $request
     * @return array
     * Get List of Charities.
     */
    public function listCharities(Request $request)
    {
        $data = Charity::where('venue_id', $request->venue_id)->orderby('venue_id', 'desc')->withCount('coins as total_donated_coins')->get();
        $avaliableCoins = $this->avaliableCoins();
        $totalDonatedCoins = $this->totalDonatedCoins($request->venue_id);

        foreach ($data as $value) {
            if ($value->image) {
                $value->image = url("/" . $value->image);
            }

            if ($value->image == "null" || $value->image === null) {
                $value->image = "";
            }
            $value->donated_coins = $this->userCharityDontedCoins($request->venue_id, $value->id);
            $coin_percentage = 0;
            if ($totalDonatedCoins) {
                $coin_percentage = (($value->donated_coins) / ($totalDonatedCoins)) * (100);
            }
            $value->percentage = number_format((float)$coin_percentage, 2, '.', '');

        }//..... end of foreach  ....//
        return [self::STATUS => true, self::MESSAGE => "Data Found", "user_available_coins" => $avaliableCoins, "total_donated_coins" => $totalDonatedCoins, self::CHARITIES => $data, 'user_donated_coins' => $this->calculateUserDonations($request->venue_id), 'charities_awarded' => $this->userDonatedCharities($request->venue_id)];
    }//..... end of listCharities() .....//

    /**
     * @return array
     * Reward coin to user.
     */
    public function addUserCoins()
    {
        //...... logging user enter in venue  .....//
        $this->loggedUserEnterInVenue();
        if (request()->has('type') && request()->type == 'location') {
            return (new GamificationController())->userLocationDetection(request()->venue_id);
        }


        else {

            $requestValidator = Validator::make(request()->all(), [
                'venue_id' => self::REQUIRED,
                self::COMPANY_ID => self::REQUIRED
            ]);
            if ($requestValidator->fails()) {
                return [self::STATUS => false, self::MESSAGE => implode(' ', $requestValidator->errors()->all())];
            }

            $data = [self::USER_ID => request()->user()->user_id, 'venue_id' => request()->venue_id, self::COMPANY_ID => request()->company_id, "charity_type" => "venue_entry"];

            $lastEntry = UserCharityCoins::where($data)->latest()->first();

            if (is_null($lastEntry) || $lastEntry->created_at->diffInHours(Carbon::now()) > 18) {
                $dataInsert = UserCharityCoins::create(array_merge($data, [self::COINS => 1]));
                Log::channel('custom')->info('User Coins Added: ', ['data' => $dataInsert]);

                return ($dataInsert)
                    ? [self::STATUS => true, self::MESSAGE => 'Coin Added Successfully']
                    : [self::STATUS => false, self::MESSAGE => 'Error occurred while adding coin, please try later.'];
            } else {
                return [self::STATUS => false, self::MESSAGE => 'Coin will be rewarded after 18 hours.'];
            }
        }
    }//..... end of addUserCoins() .....//

    /**
     * @return array
     * Donate user's coin to charity.
     */
    public function transferUserCoinToCharity()
    {
        $requestValidator = Validator::make(request()->all(), [
            self::COMPANY_ID => self::REQUIRED,
            self::CHARITY_ID => self::REQUIRED,
            'venue_id' => self::REQUIRED
        ]);

        if ($requestValidator->fails()) {
            return [self::STATUS => false, self::MESSAGE => implode(' ', $requestValidator->errors()->all())];
        }

        $firstEntry = UserCharityCoins::where([self::USER_ID => request()->user()->user_id, 'venue_id' => request()->venue_id, self::COMPANY_ID => request()->company_id, self::STATUS => 'user'])->orderBy('id', 'asc')->first();
        $this->CharityPercentage(request()->venue_id, request()->charity_id);
        if ($firstEntry) {
            return ($firstEntry->update([self::STATUS => self::ORGANIZATION, self::CHARITY_ID => request()->charity_id]))
                ? [self::STATUS => true, self::MESSAGE => 'Yay! Your tokens have been donated. Thanks for making a difference.', self::CHARITIES => $this->CharityPercentage(request()->venue_id, request()->charity_id)]
                : [self::STATUS => false, self::MESSAGE => 'Error occurred while donating coin, please try later.'];
        } else {
            return [self::STATUS => false, self::MESSAGE => 'You do not have enough coins to donate.', self::CHARITIES => $this->CharityPercentage(request()->venue_id, request()->charity_id)];
        }
    }//..... end of transferUserCoinToCharity() .....//

    /**
     * List User's Coins.
     */
    public function listUserCoins()
    {
        $requestValidator = Validator::make(request()->all(), [
            self::COMPANY_ID => self::REQUIRED,
            'venue_id' => self::REQUIRED
        ]);

        if ($requestValidator->fails()) {
            return [self::STATUS => false, self::MESSAGE => implode(' ', $requestValidator->errors()->all())];
        }

        return [
            self::STATUS => true, 'data' => UserCharityCoins::where([self::USER_ID => request()->user()->user_id, self::COMPANY_ID => request()->company_id, self::STATUS => 'user', 'venue_id' => request()->venue_id])->count(self::COINS)
        ];
    }//..... end of listUserCoins() .....//

    private function avaliableCoins()
    {
        return DB::table("user_charity_coins")->whereUserId(request()->user()->user_id)->where([self::STATUS => "user", "venue_id" => request()->venue_id])->count(self::COINS);
    }//...... end of avaliableCoins  .....//

    private function totalDonatedCoins($venue_id)
    {
        return DB::table("user_charity_coins")->whereUserId(request()->user()->user_id)->where(self::STATUS, "=", self::ORGANIZATION)->where("venue_id", $venue_id)->count(self::COINS);
    }//...... end of avaliableCoins  .....//

    private function userCharityDontedCoins($venue_id, $charity_id)
    {
        return DB::table("user_charity_coins")->where([self::STATUS => self::ORGANIZATION, "venue_id" => $venue_id, self::USER_ID => request()->user()->user_id, self::CHARITY_ID => $charity_id])->count(self::COINS);
    }//...... end of userCharityCoins  .....//

    private function getTierStatus($tiers, $coins)
    {
        if (!empty($tiers) && $coins != 0) {
            $res = $tiers->firstWhere('tier_coins', ">=", $coins);
            return $res ? $res->toArray()["tier_name"] : $tiers->last()->toArray()["tier_name"];
        } else {
            return "Initial";
        }
    }//.....  end of function getTierStatus  .....//

    //.......  venue wise charity report mobile api  ......//
    public function venueWiseReport()
    {
        $venue_id = request()->has("venue_id") ? request()->venue_id : "";
        $tiers = CharityTier::orderBy("tier_coins", "asc")->get();
        $venues = Venue::select("venue_name", "venue_id")
            ->when($venue_id, function ($query, $venue_id) {
                return $query->where("venue_id", $venue_id);
            })->get();
        foreach ($venues as $venue) {
            $venue->status = true;
            $venue->totalCoins = $this->getVenueTotalCoins($venue->venue_id);
            $venue->totalDonorInVenue = $this->totalDonorInVenue($venue->venue_id);
            $venue->venue_status = $this->getTierStatus($tiers, $venue->totalCoins);
            $venue->charities = $this->getCharites($venue->venue_id, $venue->totalCoins);
        }

        return $venues->toArray()[0] ?? [];
    }

    private function getCharites($venue_id, $total_coins)
    {
        $data = Charity::select("*")->withCount(self::COINS)->where('venue_id', $venue_id)->orderby('charity_name', 'desc')->get();
        foreach ($data as $value) {
            if ($value->image) {
                $value->image = url("/" . $value->image);
            }

            if ($value->bg_image) {
                $value->bg_image = url("/" . $value->bg_image);
            }

            if ($value->image == "null" || $value->image === null) {
                $value->image = "";
            }

            if ($value->bg_image == "null" || $value->bg_image === null) {
                $value->bg_image = "";
            }
            $percentage = 0;
            if ($total_coins) {
                $percentage = ($value->coins_count) / ($total_coins) * (100);
            }
            $value->percentage = number_format((float)$percentage, 2, '.', '');
        }
        return $data->toArray();
    }//.... end of function .....//

    private function getVenueTotalCoins($venue_id)
    {
        return DB::table("user_charity_coins")->rightJoin(self::CHARITY, "charity.id", "=", "user_charity_coins.charity_id")->where(["user_charity_coins.status" => self::ORGANIZATION, "user_charity_coins.venue_id" => $venue_id])->count("user_charity_coins.coins");
    }

    /**
     * @param $venue_id
     * @return int]
     */
    private function calculateUserDonations($venue_id)
    {
        return DB::table("user_charity_coins")->rightJoin(self::CHARITY, "charity.id", "=", "user_charity_coins.charity_id")->where(["user_charity_coins.status" => self::ORGANIZATION, "user_charity_coins.venue_id" => $venue_id, "user_charity_coins.user_id" => request()->user()->user_id])->count("user_charity_coins.coins");
    }

    /**
     * @param $venue_id
     * @return int
     */
    private function userDonatedCharities($venue_id)
    {
        return DB::table("user_charity_coins")->rightJoin(self::CHARITY, "charity.id", "=", "user_charity_coins.charity_id")->where(["user_charity_coins.status" => self::ORGANIZATION, "user_charity_coins.venue_id" => $venue_id, "user_charity_coins.user_id" => request()->user()->user_id])->distinct()->count("user_charity_coins.charity_id");
    }//---- end of function userDonatedCharities()  ----//

    private function CharityPercentage($venue_id, $charity_id)
    {
        $data = Charity::where('venue_id', $venue_id)->withCount('coins as total_donated_coins')->get();
        $totalDonatedCoins = $this->totalDonatedCoins($venue_id);
        foreach ($data as $value) {
            if ($value->image) {
                $value->image = url("/" . $value->image);
            }

            if ($value->image == "null" || $value->image === null) {
                $value->image = "";
            }
            $value->donated_coins = $this->userCharityDontedCoins($venue_id, $value->id);
            $value->percentage = 0;
            $coin_percentage = 0;
            if ($totalDonatedCoins) {
                $coin_percentage = (($value->donated_coins) / ($totalDonatedCoins)) * (100);
            }
            $value->percentage = number_format((float)$coin_percentage, 2, '.', '');

        }//..... end of foreach  ....//
        return $data;

    }

    private function totalDonorInVenue($venue_id)
    {
        return DB::table('user_charity_coins')->distinct(self::USER_ID)->where("venue_id", $venue_id)->where(self::STATUS, self::ORGANIZATION)->count(self::USER_ID);
    }//.... end of function

    public function loggedUserEnterInVenue()
    {
        return DB::table("user_entered_venue_logs")->insert(["venue_id" => request()->venue_id, self::USER_ID => request()->user()->user_id, "enter_time" => date("Y-m-d H:i:s")]);
    }


}