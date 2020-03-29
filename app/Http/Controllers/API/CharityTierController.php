<?php

namespace App\Http\Controllers\API;

use App\Models\CharityTier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CharityTierController extends Controller
{
    public function getListTiers()
    {
        return ["status" => true, "data" => CharityTier::orderBy("tier_coins", "desc")->get()];
    }//.... end of function getListTiers

    public function saveTiers()
    {
        CharityTier::updateOrCreate(["id" => request()->is_edit], request()->only(["tier_name", "tier_coins", "venue_id", "budget"]));
        return ["status" => true, "message" => "Tiers saved successfully"];
    }//.... end of function saveTiers

    public function deleteTier($id)
    {
        CharityTier::destroy($id);
        return ["status" => true, "message" => "Tier Deleted Successfully"];
    }
}
