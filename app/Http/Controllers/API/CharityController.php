<?php

namespace App\Http\Controllers\API;

use App\Exports\CharityExport;
use App\Models\Charity;
use App\Models\CharityBank;
use App\Models\CharityTier;
use App\UnifiedDbModels\Venue;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use File;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

class CharityController extends Controller
{

    /*sonar constants*/
    const COINS                 = 'coins';
    const STATUS                 = 'status';
    const RESOURCE_ID                 = 'resource_id';
    const TIER_COINS                 = 'tier_coins';


    /**
     * @param Request $request
     * @return array
     * Return charities list,
     */
    public function getCharities(Request $request)
    {
        $search = $request->nameSearch;
        $charities = Charity::select('*')->withCount(self::COINS)->where('venue_id', $request->venue_id)->orderby('id', 'desc');
        $total = $charities->count();
        return [self::STATUS => true, 'data' => $charities->when($search, function ($query, $search) {
            $query->where('charity_name', 'like', '%' . $search . '%');
        })->skip($request->offset)->take($request->limit)->get()->each(function ($charity) {
            if ($charity->image) {
                $charity->image = asset('/' . $charity->image);
            }

            if ($charity->bg_image) {
                $charity->bg_image = asset('/' . $charity->bg_image);
            }

            $charity->selected_qb = DB::table("quick_board_news")->select(["board_id", self::RESOURCE_ID, "board_title", "board_level"])
                ->leftJoin("quick_boards", "quick_boards.id", "=", "quick_board_news.board_id")->where(["quick_board_news.resource_id" => $charity->id, "quick_board_news.type" => self::CHARITY])->get();
            foreach ($charity->selected_qb as $value2) {
                $charity->listBoards = $charity->listBoards . $value2->board_title . " (" . $this->getLevelName($value2->board_level) . ")";
            }
        }), 'total' => $charities->when($search, function ($query, $search) {
            $query->where('charity_name', 'like', '%' . $search . '%');
        })->count(), 'subTotal' => $total];
    }//..... end of getCharities() ......//

    /**
     * @param Request $request
     * @param FilesController $filesController
     * @return array
     * Save Charity.
     */
    public function saveCharity(Request $request, FilesController $filesController)
    {
        if ($request->is_edit == 0 && Charity::whereVenueId($request->venue_id)->count() >= 3) {
            return [self::STATUS => false, 'message' => 'You can only add 3 Charities per Venue.'];
        }

        $image = 'uploads/' . time() * rand() . ".png";
        $bgImage = 'uploads/bg_' . time() * rand() . ".png";
        $data = $request->only(["charity_name", "charity_intro", "charity_desc", "venue_id", "contact_number", "charity_email", "charity_address", 'charity_url']);
        if ($filesController->uploadBase64Image(request()->image, $image)) {
            $data['image'] = $image;
        }

        if ($filesController->uploadBase64Image(request()->bg_image, $bgImage)) {
            $data['bg_image'] = $bgImage;
        }

        if ($request->is_edit == 0) {
            $res = Charity::create($data);
            $this->addCharityQuickBoard($res->id);
            return [self::STATUS => true, "message" => "Charity saved successfully"];
        } else {
            Charity::whereId($request->is_edit)->update($data);
            $this->addCharityQuickBoard($request->is_edit);
            return [self::STATUS => true, "message" => "Charity updated Successfully"];
        }//..... end of if-else() .....//
    }//..... end of saveCharity() .....//

    /**
     * @param $id
     * @return array
     * Delete Charity by Id.
     */
    public function deleteCharity($id)
    {
        $status = Charity::destroy($id);
        DB::table("quick_board_news")->where([self::RESOURCE_ID => $id, "type" => self::CHARITY])->delete();
        return [self::STATUS => $status ? true : false, "message" => $status ? "Charity deleted successfully." : 'Error occurred while deleting charity.'];
    }//..... end of deleteCharity() .....//

    public function getVenueCharities(Request $request)
    {
        $data['data'] = Charity::select('*')->where('venue_id', $request->venue_id)->orderBy('charity_name', 'asc')->get();
        $data[self::STATUS] = true;
        return $data;
    }

    /** end of method */

    private function addCharityQuickBoard($resource_id)
    {
        DB::table("quick_board_news")->where([self::RESOURCE_ID => $resource_id, "type" => self::CHARITY])->delete();
        foreach (request()->selected_board as $value) {
            DB::table("quick_board_news")->insert([self::RESOURCE_ID => $resource_id, "board_id" => $value, "type" => self::CHARITY]);
        }
    }

    private function getLevelName($order)
    {
        $res = DB::table("quick_board_level")->where(["level_order" => $order])->first();
        return $res ? $res->level_name : "";
    }

    public function printCharityReport($id)
    {
        $data = Charity::select("charity_name")->withCount(self::COINS)->where('venue_id', $id)->orderby('charity_name', 'desc')->get();
        $res = $data->sortByDesc("coins_count");
        return Excel::download(new CharityExport($res), 'charity_members.xlsx');
    }//.... end of function .....//

    public function allCharityReport()
    {
        $tiers = CharityTier::orderBy(self::TIER_COINS, "asc")->get();
        $venues = Venue::select("venue_name", "venue_id")->get();
        foreach ($venues as $venue) {
            $venue->totalCoins = $this->getVenueTotalCoins($venue->venue_id);
            $venue->totalDonorInVenue = $this->totalDonorInVenue($venue->venue_id);
            $venue->venue_status = $this->getUserTier($tiers, $venue->totalDonorInVenue);
            $venue->charities = $this->getCharites($venue->venue_id);
        }
        return [self::STATUS => true, "data" => $venues->toArray()];
    }//.... end of function  ....//


    private function getCharites($venue_id)
    {
        return Charity::select("charity_name")->withCount(self::COINS)->where('venue_id', $venue_id)->orderby('coins_count', 'desc')->get()->toArray();
    }//.... end of function

    private function getVenueTotalCoins($venue_id)
    {
        return DB::table("user_charity_coins")->whereVenueIdAndStatus($venue_id, "organization")->count(self::COINS);
    }//.... end of function

    private function getUserTier($tiers, $coins)
    {
        if (!empty($tiers) && $coins != 0) {
            $res = $tiers->firstWhere(self::TIER_COINS, ">=", $coins);
            return $res ? $res->toArray()["tier_name"] : $tiers->last()->toArray()["tier_name"];
        } else {
            return "Initial";
        }
    }//.....  end of function getUserTier  .....//


    public function printPdfReport()
    {
        $tiers = CharityTier::orderBy(self::TIER_COINS, "asc")->get();
        $venues = Venue::select("venue_name", "venue_id")->get();
        foreach ($venues as $venue) {
            $venue->totalCoins = $this->getVenueTotalCoins($venue->venue_id);
            $venue->totalDonorInVenue = $this->totalDonorInVenue($venue->venue_id);
            $venue->venue_status = $this->getUserTier($tiers, $venue->totalDonorInVenue);
            $venue->charities = $this->getCharites($venue->venue_id);
        }
        $pdf = PDF::loadView('print', ["data" => $venues->toArray()]);
        return $pdf->download('charityReport.pdf');
    }//.... end of function printPdfReport .....//

    private function totalDonorInVenue($venue_id)
    {
        return DB::table('user_charity_coins')->distinct('user_id')->where("venue_id", $venue_id)->where(self::STATUS, "organization")->count('user_id');
    }//.... end of function

    public function listCharities(Request $request)
    {
        $charities = Charity::where('venue_id', $request->venue_id)->get();
        return [self::STATUS => true, "data" => $charities];

    }//..... end of listCharities() ......//

}
