<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;


class ReferralFriendController extends Controller
{
    /**
     * @return array
     */
    public function addReferralFriend()
    {
        Setting::updateOrCreate(['id' => request()->editId], request()->except(['editId', 'referral_points', 'referred_points']));
        return ['status' => true, 'message' => 'Referral Friend saved successfully.'];
    }//---- End of addReferralFriend() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function getReferralFriend(Request $request)
    {
        $referralFriend = Setting::where(['type' => 'referral', 'field1' => $request->venue_id]);

        return [
            'status' => true,
            'total' => $referralFriend->count(),
            'data' => $referralFriend->skip($request->offset)->take($request->limit)->get()
        ];
    }//---- End of getReferralFriend() ----//
}//---- End of class ReferralFriendController ----//