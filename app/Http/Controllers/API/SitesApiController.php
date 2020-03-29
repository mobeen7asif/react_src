<?php

namespace App\Http\Controllers\API;

use App\Models\Gym;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Validator;

class SitesApiController extends Controller
{
    //
    public function getGyms(Request $request)
    {
        $sites = Gym::get();
        $data['status'] = true;
        $data['message'] = 'Data found!';
        $data['content_list'] = $sites;
        return json_encode($data);
    }

    public function getGymTimetable(Request $request)
    {
        $data = [];
        $cat = [
            ['state' => 'NSW'],
            ['state' => 'ACT'],
            ['state' => 'QLD'],
            ['state' => 'TA'],
            ['state' => 'NT'],
            ['state' => 'SA'],
            ['state' => 'VIC'],
            ['state' => 'WA'],
        ];
        foreach ($cat as $k => $c) {
            $cat[$k]['contents'] = Gym::whereState($c['state'])->get();
        }
        $data['status'] = true;
        $data['message'] = 'Data found!';
        $data['content_list'] = $cat;


        return $data;
    }
}
