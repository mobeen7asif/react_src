<?php

namespace App\Http\Controllers\API;

use App\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CronController extends Controller
{
    public function getAllUserStatus()
    {
        //Get Waitron group id
        $groupData = DB::table('groups')->where('group_name', 'Waitron')->first();

        //Get Groups Members whose group is waitron
        $userData = DB::table('group_members')->where('group_id', $groupData->id)->get();


        $userMissions = collect([]);
        $userData->each(function ($item, $key) use (&$userMissions) {
            $find = User::whereUserId($item->user_id)->first();
            $userMissions->push($find->user_mobile);
        });

        if ($userMissions->isNotEmpty()) {
            //Curl Request to Pos for checking the waitron status
            $response = json_decode((new Client(['headers' => []]))
                ->request('POST', config('constant.POS_URL') . 'getWimpyEmployeesStatus', [
                    'json' => ["emp_phone_arr" => $userMissions->toArray()]
                ])->getBody());


            Log::channel('user')->info('Response From POS', ['ResponsePos' => $response]);

            //Delecte user entry from member group table for waitron
            if ($response->status) {
                $users = User::whereIn('user_mobile', $response->body)->pluck('user_id');
                DB::table('group_members')->where('group_id', $groupData->id)->whereIn('user_id', $users)->delete();
            }
        }
    }//----- End of getAllUserStatus() -----//
}
