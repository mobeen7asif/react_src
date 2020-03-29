<?php

namespace App\Http\Controllers\API;

use App\Models\Beacon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BeaconController extends Controller
{
    /**
     * Get Beacons list (id, name).
     * To populate dropdown list.
     */
    public function getBeaconsShortList($venue_id)
    {
        return Beacon::whereVenueId($venue_id)->get(['id', 'beacon_name as name']);
    }//..... end of getBeaconsShortList() .....//
}
