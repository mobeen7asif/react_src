<?php

namespace App\Http\Controllers\API;

use App\Models\CharityDetails;
use App\Models\UserAccount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserCharityController extends Controller
{
    /**
     * Add User Coins Detail For Charity
     * @param Request $request
     * @return array
     */
    public function addCharity(Request $request)
    {
        try {
            $requestValidator = Validator::make(request()->all(), [
                'user_id' => 'required',
                'store_id' => 'required',
                'company_id' => 'required'
            ]);

            if ($requestValidator->fails()) {
                return ['status' => false, 'message' => implode(' ', $requestValidator->errors()->all())];
            }//..... end if() .....//

            $currentDeatils = UserAccount::where(['user_id' => request()->user_id, 'store_id' => request()->store_id, 'company_id' => request()->company_id, 'status' => 'user'])
                ->latest()->first();

            $lastDate = strtotime($currentDeatils->created_at);
            $currentDate = strtotime(Carbon::now());
            $diff = $currentDate - $lastDate;
            $days = floor($diff / (60 * 60));//seconds/minute*minutes/hour*hours/day)

            if ($days > 18) {
                $dataInsert = UserAccount::create([
                    'user_id' => $request->user_id,
                    'store_id' => $request->store_id,
                    'company_id' => $request->company_id,
                    'coins' => 1,
                    'status' => 'user'
                ]);
                if ($dataInsert)
                    return ['status' => true, 'message' => 'Coin Added Success fully'];
            } else
                return ['status' => false, 'message' => 'Coins will be given you after 18 hours'];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => 'Error Occur while saving data'];
        }

    }//--- End of addCharity() ---//

    /**
     * @param Request $request
     * @return array
     */
    public function addCharityToOrganisation(Request $request)
    {
        $requestValidator = Validator::make($request->all(), [
            'user_id' => 'required',
            'store_id' => 'required',
            'company_id' => 'required',
            'charity_id' => 'required',
        ]);

        if ($requestValidator->fails()) {
            return ['status' => false, 'message' => implode(' ', $requestValidator->errors()->all())];
        }//--- end if() ---//
        try {
            $currentDetails = UserAccount::where(['user_id' => request()->user_id, 'store_id' => request()->store_id, 'company_id' => request()->company_id, 'status' => 'user'])->first();

            if ($currentDetails) {

                $currentDetails->status = 'organisation';
                $currentDetails->save();

                $charityDetails = CharityDetails::create([
                    'charity_id' => $request->charity_id,
                    'user_id' => $request->user_id,
                    'store_id' => $request->store_id,
                    'company_id' => $request->company_id,
                    'coins' => 1,
                    'status' => 'active'
                ]);

                if ($charityDetails)
                    return ['status' => true, 'message' => "Yay! Your tokens have been donated. Thanks for making a difference"];
                else
                    return ['status' => false, 'message' => 'Error Occurred in adding charity'];
            } else
                return ['status' => false, 'message' => 'User Account is empty'];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => 'Error Occur while add coins to charity'];
        }
    }//--- End of addCharityToOrganisation() ---//

}
