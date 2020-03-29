<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\MissionUserEntry;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CharacterController extends Controller
{
    /*sonar constants*/
    const QR_CODE                 = 'qr_code';
    const STATUS                 = 'status';
    const USER_ID                 = 'user_id';
    const MISSION_ID                 = 'mission_id';
    const CHARACTER_ID                 = 'character_id';
    const MESSAGE                 = 'message';


    /**
     * @return array
     * Load Characters list.
     */
    public function loadCharacters(): array
    {
        $characters = Character::query();
        $total = $characters->count();

        $characters = $characters->when(request()->orderBy, function ($q) {
            return $q->orderby(request()->orderBy, request()->orderType);
        })->when(request()->search, function ($q) {
            return $q->where('title', 'like', '%' . request()->search . '%')
                ->orWhere('description', 'like', '%' . request()->search . '%')
                ->orWhere('prize', 'like', '%' . request()->search . '%')
                ->orWhere(self::QR_CODE, 'like', '%' . request()->search . '%');
        })->when(request()->offset, function ($q) {
            return $q->skip(request()->offset);
        })->when(request()->limit, function ($q) {
            return $q->take(request()->limit);
        })->get()->each(function ($character) {
            return ($character->image) ? $character->image = asset('/' . $character->image) : '';
        });

        return [self::STATUS => true, 'data' => $characters, 'total' => $total];
    }//..... end of loadCharacters() .....//

    /**
     * @param FilesController $filesController
     * @return array
     */
    public function saveCharacter(/*FilesController $filesController*/): array
    {
        $character = request()->only(['title', 'description', 'unique_title']);

        Character::updateOrCreate(['id' => request()->editId], $character);
        return [self::STATUS => true, self::MESSAGE => 'Character saved successfully.'];
    }//..... end of saveCharacter() .....//

    /**
     * @return array
     * Delete a character.
     */
    public function deleteCharacter()
    {
        Character::destroy(request()->id);
        return [self::STATUS => true, self::MESSAGE => 'Character deleted successfully.'];
    }//..... end of deleteCharacter() .....//

    /**
     * Record user entry in a draw.
     * This function used for mobile api.
     */
    public function customerScannedQrCode()
    {
        $validation = Validator::make(request()->all(), [self::QR_CODE => 'required']);
        if ($validation->fails()) {
            return [self::STATUS => false, self::MESSAGE => 'Please provide QR code.'];
        }

        $character = $this->getActiveMissionCharacterByQrCode(request()->qr_code);

        if (!$character) {
            return [self::STATUS => false, self::MESSAGE => 'Invalid QR Code.'];
        }

        if ($character->missions->isEmpty()) {
            return [self::STATUS => false, self::MESSAGE => 'There is no any active mission.'];
        }

        $existUserEntry = $this->getUserLastEntryAgainstCharacter($character->missions[0]->id, $character->id, Auth::user()->user_id);

        if ($existUserEntry && $character->missions[0]->max_entry == 1) {
            return [self::STATUS => false, self::MESSAGE => 'You have already scanned this character before.'];
        }

        if ($existUserEntry && $character->missions[0]->max_entry <= $this->countUserTotalEntriesAgainstCharacterOfMission($character->missions[0]->id, $character->id, Auth::user()->user_id)) {
            return [self::STATUS => false, self::MESSAGE => 'You have exceed max scanned count for this character.'];
        }

        if ($existUserEntry && $existUserEntry->created_at->diffInMinutes(now()) <= ($character->missions[0]->entry_interval * 60)) {
            return [self::STATUS => false, self::MESSAGE => 'You have to scan at least ' . $character->missions[0]->entry_interval . ' hours later the last scanned.'];
        }

        $data = [
            self::USER_ID => Auth::user()->user_id,
            self::MISSION_ID => $character->missions[0]->id,
            self::CHARACTER_ID => $character->id,
        ];

        if ($character->missions[0]->pivot->is_executed == 0 && Carbon::parse($character->missions[0]->pivot->start_date) <= now() && Carbon::parse($character->missions[0]->pivot->end_date) >= now()) {
            $data['in_draw'] = 1;
        }

        MissionUserEntry::create($data);
        return [self::STATUS => true, self::MESSAGE => 'You have successfully involved in draw.'];
    }//..... end of customerScannedQrCode() .....//

    /**
     * @param $mission_id
     * @param $character_id
     * @param $user_id
     * @return mixed
     * Get User Last entry in a character of a mission.
     */
    private function getUserLastEntryAgainstCharacter($mission_id, $character_id, $user_id)
    {
        return MissionUserEntry::where([
            self::MISSION_ID => $mission_id,
            self::CHARACTER_ID => $character_id,
            self::USER_ID => $user_id
        ])->latest()->first();
    }//..... end of getUserLastEntryAgainstCharacter() .....//

    /**
     * @param $qrCode
     * @return mixed
     * Get Active mission's character by QR code.
     */
    private function getActiveMissionCharacterByQrCode($qrCode)
    {
        return Character::where(self::QR_CODE, $qrCode)->with(['missions' => function ($q) {
            return $q->where('missions.start_date', '<=', now())
                ->where('missions.end_date', '>=', now())
                ->where('missions.is_executed', 0);
        }])->first();
    }//..... end of getActiveMissionCharacterByQrCode() ......//

    /**
     * @param $mission_id
     * @param $character_id
     * @param $user_id
     * @return int
     * Count user entries against a character in a mission.
     */
    private function countUserTotalEntriesAgainstCharacterOfMission($mission_id, $character_id, $user_id): int
    {
        return MissionUserEntry::where([
            self::MISSION_ID => $mission_id,
            self::CHARACTER_ID => $character_id,
            self::USER_ID => $user_id
        ])->count();
    }//..... end of countUserTotalEntriesAgainstCharacterOfMission() .....//
}//..... end of class.