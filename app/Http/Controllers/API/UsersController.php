<?php

namespace App\Http\Controllers\API;

use App\Models\Campaign;
use App\Models\Games;
use App\Models\Groups;
use App\Models\Mission;
use App\Models\PunchCard;
use App\Models\Role;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\User;
use App\Utility\ElasticsearchUtility;
use App\Utility\Gamification;
use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use DB;
use Illuminate\Support\Facades\Log;
use Session;
use File;
use Image;

class UsersController extends Controller
{
    public $autoNumber=999999;
    public function __construct()
    {
        set_time_limit(0);
        ini_set('memory_limit', '-1');
    }

    public function deleteMember()
    {

        $delete_ids = request()->delete_ids;

        User::whereIn('user_id', $delete_ids)->update(['is_active' => 0]);

        /**
         *  Delete User From Soldi
         */
        $this->deleteCustomerFromSoldi($delete_ids);

        User::whereIn('user_id', $delete_ids)->delete();

        /**
         *  Delete User From ES
         */
        $status = ElasticsearchUtility::deleteByQuery(ElasticsearchUtility::generateIndexName(request()->company_id, request()->venue_id), '', '',
            ['terms' => ['persona_id' => $delete_ids]]
        );
        return ['status' => true, 'message' => 'Member Deleted'];
    }


    public function deleteUsersCrone()
    {
        $users = User::where('is_active', 0)->get();
        foreach ($users as $user) {

            $user_creation_date = Carbon::parse($user->created_at);

            $diff = $user_creation_date->diffInDays(Carbon::now());
            if ($diff >= 30) {
                ElasticsearchUtility::deleteByQuery(ElasticsearchUtility::generateIndexName($user->company_id, $user->default_venue), 'persona_id', $user->user_id, '');
                $user->delete();
            }
        }
    }

    public function usercreate(Request $request)
    {
        $KNOX_URL = config('constant.Knox_Url');
        $client = new Client();
        $company_id = $request->company_id;
        $parm = array(
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'company' => $company_id,//$company_id,
            'email' => $request->email,
            'contact_number' => "123456" . rand(111, 999),//$request->contact_number,
            'group_id' => '2',
            'password' => 12345678,//$request->password,
            'user_level' => $request->user_level,
            'venue_name' => 'Plutus'
        );

        try {
            $response = $client->request('POST', $KNOX_URL . 'apis/user_with_level', [
                'json' => $parm
            ]);
            $users_res = $response->getBody()->getContents();
            $data = json_decode($users_res);
            $user_id = $data->users;
            if ($request->user_role_id != '') {
                $id = DB::table('role_level_users')->insertGetId(['user_id' => $user_id, 'level_id' => $request->user_level, 'role_id' => $request->user_role_id, "created_at" => date("Y-m-d H:i:s"), "updated_at" => date("Y-m-d H:i:s")]);
            }

            if (isset($data->Status)) {
                $arr['message'] = 'success';
                $arr['user_id'] = $user_id;
                return json_encode($arr);
            } else {
                $arr['message'] = 'already_exist';
                $arr['user_id'] = '0';
                return json_encode($arr);
            }
        } catch (RequestException $e) {
            $arr['message'] = 'falier';
            $arr['user_id'] = '0';
            return json_encode($arr);
        }
    }


    public function getRole(Request $request)
    {
        $company_id = $request->company_id;
        $level_id = $request->level_id;
        $role_level = \Illuminate\Support\Facades\DB::table("role_assigns")->where('level_id', $level_id)->get();
        $roleArray = [];
        $level = '';
        foreach ($role_level as $row) {
            $role_id = $row->role_id;
            $roles = Role::where('id', $role_id)->where('company_id', $company_id)->first();
            if ($roles) {
                $roleArray[] = $roles;
            }
        }
        return $roleArray;
        /*$data['role_arr'] = $roleArray;
        return view('layouts/dashboard_master/users/ajax_roles', $data);*/
    }

    /**
     * @param $id
     * @return array|string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function deleteCustomerFromSoldi($delete_ids)
    {
        if (count($delete_ids) > 0) {
            try {
                //get soldi ids
                $soldi_ids = User::whereIn('user_id', $delete_ids)->whereNotNull('soldi_id')->pluck('soldi_id')->toArray();
                Log::channel('custom')->info('User Data', ['UserData' => implode(',', $soldi_ids)]);
                $response = (new Client([
                    'headers' => [
                        'Content-Type' => 'application/x-www-form-urlencoded',
                        'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                        'SECRET' => config('constant.SOLDI_SECRET')
                    ]
                ]))->request('DELETE', config('constant.SOLDI_DEFAULT_PATH') . 'customer/delete_bulk', array(
                        'form_params' => array(
                            'customer_id' => implode(',', $soldi_ids),
                        )
                    )
                )->getBody();
                Log::channel('custom')->info('User Delete From Soldi', ['ResponseData' => $response]);
                return $response;
            } catch (\Exception $e) {
                Log::channel('custom')->info('Error Occured', ['ErrorINDELETE' => $e->getMessage()]);
                return ['status' => false];
            }
        } else {
            return ['status' => false];
        }
    }//------- End of deleteCustomerFromSoldi() ------//

    public function emailTrackEvents()
    {
        try {
            //get soldi ids

            Log::channel('custom')->info('User Data', ['UserData' => \request()->all()]);
            return (new Client())->request('POST', config('constant.JAVA_URL') . 'emailTrackingEvents', [
                'headers' => [
                ],
                'json' => request()->all()
            ]);

        } catch (\Exception $e) {
            Log::channel('custom')->info('Error Occured', ['ErrorINDELETE' => $e->getMessage()]);
            return ['status' => false];
        }

    }

    public function getAllCampaignData()
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $campaigns = Campaign::where(['action_type' => 'reward'])->get();
        foreach ($campaigns as $key => $value) {

            $query = [
                "query" => [
                    "bool" => [
                        "must" => [
                            [
                                "term" => [
                                    "custom_doc_type" => [
                                        "value" => "user_integrated_voucher"
                                    ]
                                ]
                            ],
                            [
                                "term" => [
                                    "campaign_id" => [
                                        "value" => $value['id']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $response = (new ElasticsearchUtility())->getAllData($query, $index);

            if (count($response) > 0) {

                $recieveResponse = $this->voucherDataInsert($response, $value);

                $campaigns[$key]['action_value'] = json_encode($recieveResponse);
                $campaigns[$key]->save();


            }
        }
        return ['status' => true, 'message' =>'Successfully added'];
    }

    private function voucherDataInsert($response, $value)
    {

        $actionValue = $resource = json_decode($value['action_value'], true);


        if ($actionValue[0]['value']['type'] == 'integrated-voucher') {


            $actionValue = $actionValue[0]['value']['other']['content'];
            $startDate='';
            $endDate='';
            if(isset( $actionValue['isNumberOfDays'])){
               $startDate =  date('Y-m-d H:i:00', strtotime('-1 days'));
               $endDate =  date('Y-m-d H:i:00', strtotime('+'.$actionValue['isNumberOfDays'].' days'));
            }else{
                $startDate= date('Y-m-d H:i:00', strtotime($actionValue['voucher_start_date']));
                $endDate=  date('Y-m-d H:i:00', strtotime($actionValue['voucher_end_date']));
            }

            $data = [
                'business' => json_encode($actionValue['business']),
                'name' => $actionValue['voucher_name'] ?? $actionValue['promotion_text'],
                'promotion_text' => $actionValue['promotion_text'],
                'discount_type' => $actionValue['discount_type'],
                'amount' => $actionValue['discount'],
                'no_of_uses' => $actionValue['no_of_uses'],
                'isNumberOfDays' => $actionValue['isNumberOfDays'] ?? '',
                'category' => 'Normal Voucher',
                'company_id' => $value['company_id'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'voucher_avial_data' => json_encode($actionValue['voucher_avial_data']),
                'image' => $resource[0]['value']['resource'],
                'tree_structure' => json_encode(['selectedKeys' => $actionValue['checkedKeys'], 'treeSelected' => $actionValue['treeData'],
                    'expended' => $actionValue['expanded'] ?? []
                ]),
            ];
            $groupid = 1;
            if ($resource[0]['value']['other']['content']['voucher_name'] == 'Student Voucher') {
                $groupData = Groups::where('group_name', 'Student')->first();
                $groupid = $groupData->group_id;

            } else if ($resource[0]['value']['other']['content']['voucher_name'] == 'Staff Voucher') {
                $groupData = Groups::where('group_name', 'Staff')->first();
                $groupid = $groupData->group_id;

            }
            $voucherid = Voucher::create($data);
            $resource[0]['value']['type'] = 'voucher';
            $resource[0]['value']['other']['content'] = ["showDate" => false, "voucher_id" => $voucherid->id];
            $this->insertUserData(0, $response, $voucherid->id, $value['company_id'], $groupid, '');

            unset($resource[0]['value']['other']['content']['selectedData']);
            unset($resource[0]['value']['other']['content']['pos_ibs']);
            unset($resource[0]['value']['other']['content']['basket_level']);
            unset($resource[0]['value']['other']['content']['voucher_name']);
            unset($resource[0]['value']['other']['content']['business']);
            unset($resource[0]['value']['other']['content']['treeData']);
            unset($resource[0]['value']['other']['content']['voucher_avial_data']);
            unset($resource[0]['value']['other']['content']['checkedKeys']);
            unset($resource[0]['value']['other']['content']['expanded']);
            unset($resource[0]['value']['other']['content']['voucher_avail_type']);
            unset($resource[0]['value']['other']['content']['discount_type']);
            unset($resource[0]['value']['other']['content']['discount']);
            unset($resource[0]['value']['other']['content']['discount']);
            unset($resource[0]['value']['other']['content']['type']);
            unset($resource[0]['value']['other']['content']['voucher_start_date']);
            unset($resource[0]['value']['other']['content']['voucher_valid']);
            unset($resource[0]['value']['other']['content']['voucher_end_date']);

            return $resource;
        }
    }

    private function voucherDataInsertGame(array $response, $value)
    {
        $company_id = $value['company_id'];
        $actionValue = json_decode($value['action_value'], true);


        foreach ($actionValue as $key => $value) {

            foreach ($value['missions'] as $missionKey => $missionValue) {
                if ($missionValue['outcomes'][0]['action_value'][0]['value']['type'] == 'integrated-voucher') {
                    $newValue = $actionValue[$key]['missions'][$missionKey]['outcomes'][0]['action_value'][0]['value'];
                    if (isset($newValue['other']['content']['isNumberOfDays'])) {
                        $startDate = date('Y-m-d H:i', strtotime('-1 days'));
                        $endDate = date('Y-m-d H:i', strtotime('+' . $newValue['other']['content']['isNumberOfDays'] . ' days'));
                    } else {

                        $startDate = date('Y-m-d H:i', strtotime($newValue['other']['content']['voucher_start_date']));
                        $endDate = date('Y-m-d H:i', strtotime($newValue['other']['content']['voucher_end_date']));

                    }

                    $groupid = 1;
                    if ($newValue['other']['content']['voucher_name'] == 'Student Voucher') {
                        $groupData = Groups::where('group_name', 'Student')->first();
                        $groupid = $groupData->group_id;

                    } else if ($newValue['other']['content']['voucher_name'] == 'Staff Voucher') {
                        $groupData = Groups::where('group_name', 'Staff')->first();
                        $groupid = $groupData->group_id;

                    }
                    $data = [
                        'business' => json_encode($newValue['other']['content']['business']),
                        'name' => $newValue['other']['content']['voucher_name'],
                        'promotion_text' => $newValue['other']['content']['promotion_text'],
                        'discount_type' => $newValue['other']['content']['discount_type'],
                        'amount' => $newValue['other']['content']['discount'],
                        'no_of_uses' => $newValue['other']['content']['no_of_uses'],
                        'isNumberOfDays' => $newValue['other']['content']['isNumberOfDays'] ?? 0,
                        'basket_level' => ($newValue['other']['content']['basket_level']) ? 1 : 0,
                        'pos_ibs' => $newValue['other']['content']['pos_ibs'],
                        'category' => 'Normal Voucher',
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'group_id' => $groupid,
                        'company_id' => $company_id,
                        'voucher_avial_data' => json_encode($newValue['other']['content']['voucher_avial_data']),
                        'image' => $newValue['resource'],
                        'tree_structure' => json_encode(['selectedKeys' => $newValue['other']['content']['checkedKeys'], 'treeSelected' => $newValue['other']['content']['treeData'],
                            'expended' => $newValue['other']['content']['expanded'] ?? []
                        ]),
                    ];

                    $voucherid = Voucher::create($data);
                    $this->insertUserData(0, $response, $voucherid->id, $company_id, $groupid, $newValue['other']['content']['voucher_name']);
                    unset($newValue['other']['content']['selectedData']);
                    unset($newValue['other']['content']['pos_ibs']);
                    unset($newValue['other']['content']['basket_level']);
                    unset($newValue['other']['content']['voucher_name']);
                    unset($newValue['other']['content']['business']);
                    unset($newValue['other']['content']['treeData']);
                    unset($newValue['other']['content']['voucher_avial_data']);
                    unset($newValue['other']['content']['checkedKeys']);
                    unset($newValue['other']['content']['expanded']);
                    unset($newValue['other']['content']['voucher_avail_type']);
                    unset($newValue['other']['content']['discount_type']);
                    unset($newValue['other']['content']['discount']);
                    unset($newValue['other']['content']['discount']);
                    unset($newValue['other']['content']['type']);
                    unset($newValue['other']['content']['voucher_start_date']);
                    unset($newValue['other']['content']['voucher_valid']);
                    unset($newValue['other']['content']['voucher_end_date']);
                    $newValue['other']['content'] = [];


                    $actionValue[$key]['missions'][$missionKey]['outcomes'][0]['action_value'][0]['value']['type'] = 'voucher';
                    $actionValue[$key]['missions'][$missionKey]['outcomes'][0]['action_value'][0]['value']['other']['content'] = ["showDate" => false, "voucher_id" => $voucherid->id];


                    Mission::where('id',$missionValue['id'])->update([
                        'outcomes' => json_encode($actionValue[$key]['missions'][$missionKey]['outcomes'])
                    ]);

                }
            }

        }
        return $actionValue;
    }

    public function importGamificationData()
    {
        $index = config('constant.ES_INDEX_BASENAME');
        $campaigns = Campaign::where(['type' => '4'])->get();
        foreach ($campaigns as $key => $value) {

            $query = [
                "query" => [
                    "bool" => [
                        "must" => [
                            [
                                "term" => [
                                    "custom_doc_type" => [
                                        "value" => "user_integrated_voucher"
                                    ]
                                ]
                            ],
                            [
                                "term" => [
                                    "campaign_id" => [
                                        "value" => $value['id']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $response = (new ElasticsearchUtility())->getAllData($query, $index);

            if (count($response) > 0) {

                $recieveResponse = $this->voucherDataInsertGame($response, $value);

                $campaigns[$key]['action_value'] = json_encode($recieveResponse);
                $campaigns[$key]->save();


            }
        }
        return ['status' => true, 'message' =>'Successfully added'];

    }

       public function insertUserData($count = 0, $response, $voucherid, $companyid, $groupid, $voucherName)
    {
        $userException = [];
        $len = count($response);
        $userResponseData= $response;
        try {

            foreach ($userResponseData as $key => $userdata) {
                $voucherCode = (new Gamification())->getIBSCode($userdata['pos_ibs'] ?? 0);
                if($userdata['voucher_name'] == $voucherName) {
                    Log::channel('custom')->info('user',['user'=>$userdata['user_id'],'voucher_name'=>$userdata['voucher_name']]);
                    $user = VoucherUser::updateOrCreate(['campaign_id' => $userdata['campaign_id'],'user_id' => $userdata['user_id'], 'voucher_id' => $voucherid],[
                        'campaign_id' => $userdata['campaign_id'],
                        'user_id' => $userdata['user_id'],
                        'company_id' => $companyid,
                        'voucher_code' => $voucherCode,
                        'voucher_start_date' => date('Y-m-d h:i:s', strtotime($userdata['voucher_start_date'])),
                        'voucher_end_date' => date('Y-m-d h:i:s', strtotime($userdata['voucher_end_date'])),
                        'created_at' => date('Y-m-d h:i:s', $userdata['dateadded']),
                        'updated_at' => date('Y-m-d h:i:s', $userdata['dateadded']),
                        'voucher_id' => $voucherid,
                        'uses_remaining' => $userdata['uses_remaining'],
                        'no_of_uses' => $userdata['no_of_uses'],
                        'group_id' => $groupid
                    ]);
                    if($user){
                        unset($userResponseData[$key]);
                    }

                }



            }
            return true;
        } catch (\Exception $e) {
            Log::channel('custom')->info('user',['error'=>'exception','user'=>$userdata['user_id'],'voucher_name'=>$userdata['voucher_name']]);
            return $this->insertUserData($count, $userResponseData, $voucherid, $companyid, $groupid, $voucherName);
        }
    }


    public function importPunchCard()
    {
        $punch = PunchCard::get();
        $index = config('constant.ES_INDEX_BASENAME');
        foreach ($punch as $key => $value) {

            $query = [
                "query" => [
                    "bool" => [
                        "must" => [
                            [
                                "term" => [
                                    "custom_doc_type" => [
                                        "value" => "user_integrated_voucher"
                                    ]
                                ]
                            ],
                            [
                                "term" => [
                                    "from_punch_card" => [
                                        "value" => $value['id']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];

            $response = (new ElasticsearchUtility())->getAllData($query, $index);
            if (count($response) > 0) {
                $actionValue = $this->insertPunchCardData($response, $value);
                $punch[$key]['voucher_id'] = $actionValue;
                $punch[$key]->save();
            }

        }
        return ['status' => true,'message' => 'successfully inserted data'];
    }

    private function insertPunchCardData(array $response, $value)
    {
      
        $treeData = json_decode($value['tree_structure']);
        $punchCardDat = json_decode($value['punch_card_data'], true);


        $business = ["business_id" => $value['business_id'], "business_name" => $value['business_name'],
            "business_image" => json_decode($value['business_images'])
        ];

        $data = [
            'business' => json_encode($business),
            'name' => $value['name'],
            'promotion_text' => $value['description'],
            'discount_type' => $value['discount_type'],
            'amount' => $value['voucher_amount'] ?? 0,
            'no_of_uses' => 1,
            'isNumberOfDays' => 0,
            'basket_level' => $value['basket_level'],
            'pos_ibs' => $value['pos_ibs'],
            'category' => 'Normal Voucher',
            'start_date' => date('Y-m-d h:i:s', strtotime($response[0]['voucher_start_date'])),
            'end_date' => date('Y-m-d h:i:s', strtotime($response[0]['voucher_end_date'])),
            'group_id' => 1,
            'company_id' => $value['company_id'],
            'voucher_avial_data' => json_encode($punchCardDat),
            'image' => $value['image'],
            'tree_structure' => json_encode(['selectedKeys' => $treeData->selectedKeys??[],
                'treeSelected' => $treeData->treeSelected??[],
                'expended' => $treeData->expended??[]
            ]),
        ];
        $voucherID = Voucher::create($data);

        $this->insertPunchUserData($count = 0, $response, $voucherID->id, $value['id'], 1, $value['company_id']);
        return $voucherID->id;
    }

    public function insertPunchUserData($count = 0, $response, $voucherid, $punchid, $groupid, $company_id)
    {
        $userException = [];

        try {

            foreach ($response as $key => $userdata) {
                $userException = $userdata;
                $index = $key;
                $count++;

                $user = VoucherUser::create([
                    'campaign_id' => $userdata['campaign_id'],
                    'user_id' => $userdata['user_id'],
                    'company_id' => $company_id,
                    'voucher_code' => $userdata['pos_ibs'] . $this->getRandomSix(),
                    'punch_id' => $punchid,
                    'voucher_start_date' => date('Y-m-d h:i:s', strtotime($userdata['voucher_start_date'])),
                    'voucher_end_date' => date('Y-m-d h:i:s', strtotime($userdata['voucher_end_date'])),
                    'created_at' => date('Y-m-d h:i:s', $userdata['dateadded']),
                    'updated_at' => date('Y-m-d h:i:s', $userdata['dateadded']),
                    'voucher_id' => $voucherid,
                    'uses_remaining' => $userdata['uses_remaining'],
                    'no_of_uses' => 1,
                    'group_id' => $groupid
                ]);
                if ($user)
                    unset($response[$key]);


            }
            return true;
        } catch (\Exception $e) {
            $voucherCode = $userException['pos_ibs'].$this->getRandomSix();
            $userVoucher = VoucherUser::where('voucher_code', $voucherCode)->first();
            if ($userVoucher) {
                $voucherCode = $userException['pos_ibs'].$this->getRandomSix();
            } else {

                    $user = VoucherUser::create([
                        'punch_id' => $punchid,
                        'user_id' => $userException['user_id'],
                        'company_id' => $company_id,
                        'voucher_code' => $voucherCode,
                        'voucher_start_date' => date('Y-m-d h:i:s', strtotime($userException['voucher_start_date'])),
                        'voucher_end_date' => date('Y-m-d h:i:s', strtotime($userException['voucher_end_date'])),
                        'created_at' => date('Y-m-d h:i:s', $userException['dateadded']),
                        'updated_at' => date('Y-m-d h:i:s', $userException['dateadded']),
                        'voucher_id' => $voucherid,
                        'uses_remaining' => $userException['uses_remaining'],
                        'no_of_uses' => $userException['no_of_uses'],
                        'group_id' => $groupid
                    ]);
                    if ($user) ;
                    {
                        unset($response[$index]);
                    }

                $count++;
                return $this->insertPunchUserData($count , $response, $voucherid, $punchid, $groupid, $company_id);
            }
        }
    }

    public function getRandomSix()
    {
        return $this->autoNumber = ($this->autoNumber + 1);
    }
}
