<?php

namespace App\Http\Controllers\API;

use App\Models\Character;
use App\Models\CharacterUserScanned;
use App\Models\Competition;
use App\Models\CompetitionUserEntry;
use App\Models\Games;
use App\Models\Mission;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompetitionController extends Controller
{
    /*sonar constants*/
    const TITLE                 = 'title';
    const START_DATE                 = 'start_date';
    const MESSAGE                 = 'message';
    const UNIQUE_TITLE                 = 'unique_title';
    const YMD                 = 'Y-m-d';
    const CHARACTER_ID                 = 'character_id';


    /**
     * @return array
     * List Competitions
     */
    public function listCompetitions(): array
    {

        $competitions = Competition::orderby(request()->orderBy, request()->orderType);
        $total = $competitions->count();

        $competitions = $competitions->when(request()->search, function ($q) {
            return $q->where(self::TITLE, 'like', '%' . request()->search . '%')
                ->orWhere('description', 'like', '%' . request()->search . '%');
        })->skip(request()->offset)->take(request()->limit)->get()->each(function ($competition) {
            $competition->start_date = date("d-m-Y H:i:s", strtotime($competition->start_date));
            $competition->end_date = date("d-m-Y H:i:s", strtotime($competition->end_date));
            $competition->total_users = CompetitionUserEntry::where('competition_id', $competition->id)->where('in_draw', 1)->count();
            return $competition;
        });

        return ['status' => true, 'data' => $competitions, 'total' => $total];
    }//..... end of listCompetitions() .....//

    /**
     * @return array
     * Save competition.
     */
    public function saveCompetition(): array
    {
        $competitionData = request()->only([self::TITLE, 'description', 'is_unique_entry', 'venue_id', 'company_id']);
        $competitionData[self::START_DATE] = Carbon::parse(request()->start_date);
        $competitionData[self::END_DATE] = Carbon::parse(request()->end_date);

        if (request()->type == "edit") {
            Competition::whereId(request()->editId)->update($competitionData);
        }
        else {
            Competition::create($competitionData);
        }

        return ['status' => true, self::MESSAGE => 'Competition saved successfully.'];
    }//..... end of saveCompetition() .....//

    /**
     * Delete Competition.
     */
    public function deleteCompetition(): array
    {
        Competition::destroy(request()->id);

        return ['status' => true, self::MESSAGE => 'Competition deleted successfully.'];
    }//..... end of deleteCompetition() .....//

    /**
     * Get Competitions and characters list for dropdown list.
     */
    public function getCompetitionsListForDropdownList(): array
    {
        return [
            'competitionList' => Competition::/*whereDate(self::START_DATE, '<=', now())->whereDate(self::END_DATE, '>=', now())->*/ get(['id', self::TITLE, 'is_unique_entry', self::START_DATE, self::END_DATE]),
            'status' => true,
            self::MESSAGE => 'Data fetched successfully.'];
    }//..... end of getCompetitionAndCharacterListForDropdownList() .....//

    /**
     * Get characters list for dropdown list.
     */
    public function getPetPacksListForDropdownList(): array
    {
        return [
            'petPackList' => Character::get(['id', self::TITLE, self::UNIQUE_TITLE]),
            'status' => true,
            self::MESSAGE => 'Data fetched successfully.'];
    }//..... end of getPetPacksListForDropdownList() .....//

    /**
     * Get user scanned characters list.
     */
    public function getUserScannedCharacteresList(): array
    {

        $game = Games::select('games.id', 'games.start_date', 'games.end_date', 'games.is_competition', 'games.campaign_id', 'campaigns.venue_id')
            ->join('campaigns', 'campaigns.id', '=', 'games.campaign_id')
            ->whereDate(self::START_DATE, '<=', now()->format(self::YMD))
            ->whereTime(self::START_DATE, '<=', now()->format("H:i:s"))
            ->whereDate(self::END_DATE, '>=', now()->format(self::YMD))
            ->whereRaw('CASE WHEN `end_date` ="' . now()->format(self::YMD) . '" THEN TIME(`end_date`) >="' . now()->format("H:i:s") . '" ELSE 1 END')
            ->where('is_competition', 1)->get();
        $game_ids = $game->pluck("id");

        $response = Character::select('id as character_id', self::UNIQUE_TITLE)->get();

        foreach ($response as $value) {
            $details = $this->getCharacterUserList($game_ids, $value->character_id);
            if ($details) {
                $value->total_count = $details[0]['total_count'] ?? 0;
                $value->mission_id = $details[0]['mission_id'] ?? 0;
                $value->mission_startdate = $this->getCompetitionStartTime($value->unique_title);
            }
        }

        return ['status' => true, 'data' => $response];
    }

    private function getCompetitionStartTime($missID)
    {
        $mission = Mission::select(self::START_DATE)->where('outcomes', 'like', '%unique_title":"' . $missID . '"%')->orderBy('created_at', 'desc')->first();

        if ($mission) {
            $startDate = Carbon::parse($mission[self::START_DATE]);
            return $startDate->format('jS F Y');
        } else {
            return "";
        }

    }

    private function getCharacterUserList($gameID, $character_id)
    {
        return CharacterUserScanned::select(self::CHARACTER_ID, self::UNIQUE_TITLE, \DB::raw('COUNT(character_id) as total_count'), 'mission_id')
            ->where(['user_id' => request()->user()->user_id])
            ->whereIn("game_id", $gameID)
            ->where(self::CHARACTER_ID, $character_id)
            ->groupBy(self::CHARACTER_ID)->get();

    }//..... end of getCharacterUserList() ....//
}
