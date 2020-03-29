<?php

namespace App\Http\Controllers\API;

use App\Exports\MemberDetailSheet;
use App\Exports\PublicVoucher;
use App\Models\Campaign;
use App\Models\MemberTransaction;
use App\Models\Setting;
use App\Models\UserStamp;
use App\Models\Voucher;
use App\Models\VoucherLog;
use App\Models\VoucherUser;
use App\User;
use App\Utility\ElasticsearchUtility;
use App\Utility\Gamification;
use Carbon\Carbon;
use http\Exception\BadMethodCallException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\API\PaymentController;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VoucherController extends Controller
{
    public $setting;

    public function __construct()
    {
        set_time_limit(0);
        ini_set('memory_limit', '-1');
        ini_set('display_errors', 1);
        $this->setting = Setting::where('type', 'configure_numbers')->first();

    }

    public function saveVoucher(FilesController $filesController)
    {

        $image = 'uploads/' . time() * rand() . ".png";

        $voucher = Voucher::updateOrCreate(['id' => request()->editId], $filesController->uploadBase64Image(request()->image, $image)
            ? array_merge(request()->except(['editId', 'image']), ['image' => $image, 'start_date' => (request()->isNumberOfDays > 0) ? date('Y-m-d H:i', strtotime('-1 days')) : request()->start_date, 'end_date' => (request()->isNumberOfDays > 0) ? date('Y-m-d H:i', strtotime('+' . request()->isNumberOfDays . ' days')) : request()->end_date])
            : request()->except(['editId', 'image']));

        if (request()->category == 'Public Voucher') {
            if (request()->editId == 0) {
                $this->assignPublicVoucher($voucher->id);
            }
        }

        return ['status' => true, 'message' => 'Voucher saved successfully.'];
    }//..... end of saveVoucher() ......//

    /**
     * @return array
     */
    public function listAllVouchers(Request $request)
    {
        $voucher = Voucher::orderBy(request()->orderBy, request()->orderType)->where('company_id', $request->company_id);

        if (request()->has('search') && request()->search)
            $voucher->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            });
        if ($request->has('category')) {
            $voucher->where('category', '!=', 'Public Voucher');
        }
        $data = ($request->has('offset') and $request->has('limit')) ? $voucher->skip(request()->offset)->take(request()->limit)->get() : $voucher->get();
        foreach ($data as $key => $value) {
            $value->billingFields = json_decode($value->billingFields, true);
        }
        return [
            'status' => true,
            'total' => $voucher->count(),
            'data' => ($request->has('offset') and $request->has('limit')) ? $voucher->skip(request()->offset)->take(request()->limit)->get() : $voucher->get()
        ];
    }//---- End of listAllVouchers() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function deleteVoucher(Request $request)
    {
        $campaign = Campaign::where('status', '!=', 'Completed')->get();
        $actionData = [];
        foreach ($campaign as $value)
            $actionData[] = json_decode($value->action_value, true);

        $found = false;
        foreach ($actionData as $key => $value) {
            foreach ($actionData[$key] as $key1 => $value1) {
                if (isset($value1['value']))
                    if ($value1['value']['type'] == 'voucher') {
                        if (isset($value1['value']['other']['content']['voucher_id'])) {
                            if ($value1['value']['other']['content']['voucher_id'] == $request->id) {
                                $found = true;
                            }
                        }
                    }
            }
        }
        if (!$found) {
            Voucher::where('id', $request->id)->delete();
            VoucherUser::where('voucher_id', $request->id)->delete();
            VoucherLog::where('voucher_id', $request->id)->delete();
            return ['status' => true, 'message' => 'Voucher delete success fully'];
        } else {
            return ['status' => false, 'message' => 'Voucher cannot be delete because its part of active campaign'];
        }

    }//------ End of deleteVoucher() ------//

    /**
     * @param Request $request
     * @return array
     */
    public function getAllVouchers(Request $request)
    {
        $vouchers = collect([]);
        $data = Voucher::where('voucher_type', '!=', 'group-voucher')->where('category', '!=', 'Public Voucher')->where('company_id', $request->company_id)->skip(request()->offset)->take(request()->pageSize)->get();
        $data->map(function ($vc) use (&$vouchers) {
            $vouchers->push(['name' => $vc->name, 'id' => $vc->id, 'showvalue' => false, 'voucher_value' => 1]);
        });
        return ['status' => true, 'data' => $vouchers->toArray(), 'count' => Voucher::count()];
    }//------ End of getAllVouchers() ------//

    public function getVoucherForGroup(Request $request)
    {
        $vouchers = collect([]);

        $data = Voucher::where('voucher_type', '!=', 'group-voucher')->where('category', '!=', 'Public Voucher')->where('company_id', $request->company_id)->get();
        $data->map(function ($vc) use (&$vouchers) {
            $vouchers->push(['name' => $vc->name, 'id' => $vc->id, 'showvalue' => false, 'voucher_value' => 1]);
        });
        return ['status' => true, 'data' => $vouchers->toArray(), 'count' => Voucher::count()];
    }//------ End of getAllVouchers() ------//

    /**
     * @return array
     */
    public function assignVoucher()
    {
        if (request()->voucherdata['category'] != 'Public Voucher') {
            $vouchers = json_decode(request()->voucherdata['voucher_avial_data'], true);

            $data = [
                'voucher_id' => request()->voucherdata['id'],
                'company_id' => request()->company_id,
                "no_of_uses" => request()->voucherdata['no_of_uses'],
                "uses_remaining" => request()->voucherdata['no_of_uses'],
                "group_id" => request()->voucherdata['group_id'] ?? 0
            ];
            if (request()->number_of_days) {
                $data['voucher_start_date'] = date('Y-m-d H:i', strtotime('-1 days'));
                $data['voucher_end_date'] = date('Y-m-d H:i', strtotime('+' . request()->number_of_days . ' days'));
            } else {
                $data['voucher_start_date'] = date('Y-m-d H:i', strtotime(request()->start_date));
                $data['voucher_end_date'] = date('Y-m-d H:i', strtotime(request()->end_date));
            }
            $users = request()->userdata;
            try {
                if (request()->voucherdata['voucher_type'] != 'group-voucher') {
                    foreach (request()->userdata as $user) {

                        $data['user_id'] = $user['id'];
                        $data["voucher_code"] = $this->uniqueVoucherCode(request()->voucherdata['pos_ibs']);
                        $data["created_at"] = date('Y-m-d h:i:s a');
                        $data["updated_at"] = date('Y-m-d h:i:s a');
                        VoucherUser::insert($data);

                    }
                    return ['status' => true, 'message' => 'voucher assign '];
                } else {
                    $voucher_value = array_column($vouchers, 'voucher_value');
                    array_multisort($voucher_value, SORT_DESC, $vouchers);
                    $vouchersTemp = $vouchers;
                    $this->randomizeData($users, $vouchersTemp, $vouchers, $data);
                    return ['status' => true, 'message' => 'voucher assign '];
                }
            } catch (QueryException $e) {

                if ($e->errorInfo[1]) {
                    return ['status' => false, 'message' => 'Duplicated Voucher Code'];
                } else {
                    return ['status' => false, 'message' => $e->getMessage()];
                }
            }
        } else {
            if (count(request()->userdata) == 0) {
                request()->merge(["no_of_uses" => request()->voucherdata['no_of_uses'],
                    "start_date" => request()->start_date,
                    "end_date" => request()->end_date,
                    "pos_ibs" => request()->voucherdata['pos_ibs'],
                    'isNumberOfDays' => request()->number_of_days,
                    "group_id" => request()->voucherdata['group_id'] ?? 0
                ]);
                return $this->assignPublicVoucher(request()->voucherdata['id'], 0);
            } else {
                request()->merge(["no_of_uses" => request()->voucherdata['no_of_uses'],
                    "start_date" => request()->start_date,
                    "end_date" => request()->end_date,
                    "pos_ibs" => request()->voucherdata['pos_ibs'],
                    'isNumberOfDays' => request()->number_of_days,
                    "group_id" => request()->voucherdata['group_id'] ?? 0
                ]);
                return $this->assignPublicVoucherUser(request()->userdata);
            }
        }
    }//----- End of assignVoucher() ------//

    public function randomizeData($users, &$vouchersTemp, &$vouchers, &$data)
    {


        foreach ($users as $key1 => $value) {
            $item = $this->getRandomWeightedElement($vouchers);
            $randomNumber = $vouchers[$item];
            $voucherData = Voucher::where('id', $randomNumber['id'])->first();
            if ($voucherData) {
                $data['user_id'] = $value['id'];
                $data['voucher_id'] = $randomNumber['id'];
                $data["voucher_code"] = $this->uniqueVoucherCode($voucherData->pos_ibs);
                $data["created_at"] = date('Y-m-d h:i:s a');
                $data["updated_at"] = date('Y-m-d h:i:s a');
                $data["no_of_uses"] = $voucherData->no_of_uses;
                $data["uses_remaining"] = $voucherData->no_of_uses;
                $data["group_id"] = $voucherData->group_id;
                VoucherUser::insert($data);
            }

        }
        return ['status' => true];
    }

    public function getJavaData($data = '', $queryparam = '')
    {
        $url = parse_url(config('constant.JAVA_URL'));
        $url = $url['scheme'] . '://' . $url['host'] . ':' . $url['port'];
        $url = (!empty($queryparam)) ? $url . '/' . $data . '/' . $queryparam : $url . '/' . $data;

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);


        // Make it so the data coming back is put into a string
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        // Insert the data
        if (isset($_POST) and !empty($_POST)) {

            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $_POST);
        }
        $result = curl_exec($curl);

        // Get some cURL session information back
        $info = curl_getinfo($curl);
        curl_close($curl);
        echo $result;
    }

    /**
     * function for configure number(numeric=false, aplhanumeric=true)
     */
    public function configureNumber()
    {
        if (\request()->type == 'configure_numbers') {
            $find = Setting::where('type', 'configure_numbers')->first();
            if ($find) {
                $find->update(['field1' => (request()->value) ? 1 : 0]);
            } else {
                Setting::create(['type' => 'configure_numbers', 'field1' => (request()->value) ? 1 : 0]);
            }
        } else if (request()->type == 'billing_on_off') {
            $find = Setting::where('type', 'billing_on_off')->first();
            if ($find) {
                $find->update(['field1' => request()->value, "field2" => json_encode(request()->billingValues)]);
            } else {
                Setting::create(['type' => 'billing_on_off', 'field1' => request()->value, "field2" => json_encode(request()->billingValues)]);
            }
        } else if (request()->type == 'gift_card') {
            $find = Setting::where('type', 'gift_card')->first();
            if ($find) {
                $find->update(['field1' => request()->value]);
            } else {
                Setting::create(['type' => 'gift_card', 'field1' => request()->value]);
            }
        } else {
            $find = Setting::where('type', 'voucher_code_length')->first();
            if ($find) {
                $find->update(['field1' => request()->value]);
            } else {
                Setting::create(['type' => 'voucher_code_length', 'field1' => request()->value]);
            }
        }

        return ['status' => true, 'message' => 'Successfully added'];
    }

    /**
     * @param $id
     * @return array
     */
    private function assignPublicVoucher($id, $i = 0)
    {
        try {
            if (ob_get_level() == 0) ob_start();
            do {
                VoucherUser::insert([
                    'voucher_code' => $this->getIBSCode(request()->pos_ibs ?? 0),
                    'company_id' => request()->company_id,
                    "no_of_uses" => request()->no_of_uses ?? 1,
                    "uses_remaining" => request()->no_of_uses ?? 1,
                    'group_id' => request()->group_id ?? 0,
                    "created_at" => date('Y-m-d h:i:s a'),
                    "updated_at" => date('Y-m-d h:i:s a'),
                    'voucher_id' => $id,
                ]);
                $i++;
            } while ($i < request()->quantity);


            ob_flush();
            flush();

            ob_end_flush();
            return ['status' => true, 'message' => 'Successfully Assgin Public Voucher'];
        } catch (QueryException $e) {

            if ($e->errorInfo[1]) {

                return $this->assignPublicVoucher($id, $i);
            } else {
                return ['status' => false, 'message' => $e->getMessage()];
            }
        } catch (BadMethodCallException $e) {
            return $this->assignPublicVoucher($id, $i);
        }
    }//------ End of assignPublicVoucher() -----//

    /**
     * @param $userdata
     * @return array
     */
    private function assignPublicVoucherUser($userdata)
    {
        try {
            $startDate = '';
            $endDate = '';
            if (request()->isNumberOfDays > 0) {

                $startDate = date('Y-m-d H:i', strtotime('-1 days'));
                $endDate = date('Y-m-d H:i', strtotime('+' . request()->isNumberOfDays . ' days'));
            } else {
                $startDate = date('Y-m-d H:i', strtotime(request()->start_date));
                $endDate = date('Y-m-d H:i', strtotime(request()->end_date));
            }
            $vouchers = VoucherUser::whereNull('user_id')->where('voucher_id', request()->voucherdata['id'])->take(count($userdata))->get();
            $pushData = [];
            for ($i = 0; $i < count($userdata); $i++) {

                $vouchers[$i]->user_id = $userdata[$i]['id'];
                $vouchers[$i]->voucher_start_date = $startDate;
                $vouchers[$i]->voucher_end_date = $endDate;
                $vouchers[$i]->created_at = date('Y-m-d H:i:00');
                $vouchers[$i]->save();
            }
            return ['status' => true, 'message' => 'Successfully Assgin Public Voucher'];
        } catch (\Exception $e) {
            return ['status' => true, 'message' => $e->getMessage()];
        }
    }//----- End of assignPublicVoucherUser() -----//

    public function downloadVoucher()
    {
        $finalData = [];
        $vouchersData = collect([]);
        $voucher = Voucher::where('id', request()->id)->first();
        if ($voucher->voucher_type == 'group-voucher') {
            $json = collect(json_decode($voucher->voucher_avial_data))->pluck('id');
            $vouchersData = VoucherUser::whereIn('voucher_id', $json)->get();
        } else {
            $vouchersData = VoucherUser::where('voucher_id', request()->id)->get();
        }
        foreach ($vouchersData as $value) {
            $user = '';
            if (!empty($value['user_id'])) {
                $user = User::where('user_id', $value['user_id'])->first();
            }
            $finalData[] = ['client_id' => (!empty($user)) ? $user->client_customer_id : '', 'Email' => (!empty($user)) ? $user->email : '', 'Voucher_Code' => $value['voucher_code'], 'No_Uses' => $value['no_of_uses'], 'Uses_Remaining' => ($value['uses_remaining'] > 0) ? $value['uses_remaining'] : "0", 'Voucher_Start_Date' => (!empty($value['user_id'])) ? $value['voucher_start_date'] : '', 'Voucher_End_Date' => (!empty($value['user_id'])) ? $value['voucher_end_date'] : ''];
        }
        ob_end_clean();
        ob_start();
        return Excel::download((new PublicVoucher($finalData)), $voucher->name . '-' . date('Y-m-d') . '-' . time() . '.xlsx');
    }

    public function validateVoucherQrCode()
    {
        $validation = Validator::make(request()->all(), [
            'qr_code' => 'required'
        ]);
        if ($validation->fails()) {
            return ['status' => false, 'message' => 'Please provide missing params: QR code'];
        }//...... end if() ......//

        /*if (Str::contains(request()->qr_code, 'GBK-')) {*/

        $user = request()->user();
        request()->merge(['region' => (request()->header('Country') == 'uk') ? 'uk' : 'ireland']);
        $currentDate = date('Y-m-d H:i:00');
        return (new PaymentController())->publicVoucherCheck(request()->qr_code, $user->region_type, $user, $currentDate);
        /* } else {
             return ['status' => false, 'message' => 'Voucher code is not valid'];
         }*/

    }

    private function uniqueVoucherCode($ibs = '')
    {
        $voucherCode = (new Gamification())->getIBSCode($ibs ?? 0);
        $voucherFind = VoucherUser::where('voucher_code', $voucherCode)->first();
        if (!empty($voucherFind)) {
            return $this->uniqueVoucherCode($ibs ?? 0);
        } else {
            return $voucherCode;
        }
    }

    public function getIBSCode($ibs = 0)
    {

        if ($this->setting->field1 == 1) {
            $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            $res = "";

            for ($i = 0; $i < 15; $i++)
                $res .= $chars[mt_rand(0, strlen($chars) - 1)];

            $code = str_split($res, 5);

            $first = $code[0] ?? '';
            $second = $code[1] ?? '';
            $third = $code[2] ?? '';
            $string = str_split($third, 2);
            $newString = $string[0] ?? "";
            return ($ibs) ? $ibs . $first . $second . $newString : $first . $second . $third;
        } else {
            $chars = "0123456789";
            $res = "";

            for ($i = 0; $i < 9; $i++)
                $res .= $chars[mt_rand(0, strlen($chars) - 1)];

            $code = str_split($res, 3);

            $first = $code[0] ?? '';
            $second = $code[1] ?? '';
            return ($ibs) ? $ibs . $first . $second : $first . $second;
        }
    }

    public function listVoucherPunchCard(Request $request)
    {
        $voucher = Voucher::get();

        return [
            'status' => true,
            'data' => $voucher
        ];
    }//---- End of listAllVouchers() ----//

    public function testData()
    {
        dd(Carbon::parse('2019-10-20 06:10:10')->format('Y-m-d h:i:s'));
    }

    public function getSegmentData()
    {
        $segmentData = Setting::where('field1', 'segment')->get();
        return ['status' => true, 'data' => $segmentData];
    }

    public function saveSegmentCriteria()
    {

        $segment = Setting::where('type', request()->type)->first();
        $segment->field2 = \request()->fied2;
        $segment->save();
        return ['status' => true, 'message' => 'Successfully updated'];
    }

    public function voucherView($id = '')
    {
        $decoded = json_decode(base64_decode(urldecode($id)));

        $voucher = VoucherUser::where(['voucher_id' => $decoded->voucher_id, 'user_id' => $decoded->user_id])->first();
        $voucher->detail = Voucher::where('id', $decoded->voucher_id)->first()->toArray();

        return view('voucher_template', ['voucher' => $voucher->toArray()]);
    }

    function getRandomWeightedElement(array $voucher)
    {
        $numbers = array();
        foreach ($voucher as $k => $v) {
            for ($i = 0; $i < $v['voucher_value']; $i++)
                $numbers[] = $k;
        }

        # then you just pick a random value from the array
        # the more occurrences, the more chances, and the occurrences are based on "priority"
        $entry = $numbers[array_rand($numbers)];
        return $entry;


        /*  $i = 0;
          $pushData = [];
          $max = 0;

          foreach ($voucher as $item => $weight)
          {

              $max += $weight['voucher_value'];
              $vouchers[$item]['voucher_value']  = $max;
          }

          $random = mt_rand(1, $max);
          $closest = null;
          Log::channel('custom')->info('getRandomWeightedElement',['random'=>$random]);
          foreach ($vouchers as $item => $max)
          {
              if ($closest === null || abs($random - $closest) > abs($max['voucher_value'] - $random)) {
                  $closest = $item;
              }
          }
          Log::channel('custom')->info('getRandomWeightedElement',['randomvalue'=>$closest]);
          return $closest;*/
    }

    public function membersDetailReport()
    {
        $filename = 'UserDetails-' . date('Y-m-d h:i:s');
        $response = new StreamedResponse(function () {
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($handle, [
                'MemberId',
                'Email',
                'Vouchers Count',
                'Active Vouchers ',
                'Expired Vouchers',
                'Redeemed Vouchers',
                'Stamps Count',
                'Transaction Count',
                'Transaction Amount Count',
                'Referred'
            ]);

            User::whereNotNull('soldi_id')->where('soldi_id', '!=', '0')->chunk(500, function ($users) use ($handle) {
                foreach ($users as $user) {
                    // Add a new row with data
                    $voucherCount = $this->getUserVoucherCounts('voucher_count', $user->user_id);

                    $activeVoucher = $this->getUserVoucherCounts('active_voucher', $user->user_id);

                    $redeemvoucher = $this->getUserVoucherCounts('redeem_voucher', $user->user_id);
                    $expiredVouchers = $this->getUserVoucherCounts('expire_voucher', $user->user_id);

                    $stampCount = $this->getUserStampCount('stamp_count', $user->user_id);

                    $transactionCount = $this->getUserTransactions('transaction_count', $user->user_id);
                    $transactionAmount = $this->getUserTransactions('transaction_amount_count', $user->user_id);
                    $refferd = User::where('referal_by', $user->referral_code)->count();
                    fputcsv($handle, [
                        'client_customer_id' => $user->client_customer_id,
                        'email' => $user->email,
                        'voucher_count' => ($voucherCount) ? $voucherCount : '0',
                        'active_voucher' => ($activeVoucher) ? $activeVoucher : '0',
                        'expired_voucher' => ($expiredVouchers) ? $expiredVouchers : '0',
                        'redeem_voucher' => ($redeemvoucher) ? $redeemvoucher : '0',
                        'stamp_count' => ($stampCount) ? $stampCount : '0',
                        'transaction_count' => ($transactionCount) ? $transactionCount : '0',
                        'transaction_amount_count' => ($transactionAmount) ? $transactionAmount : '0',
                        'Referred' => ($refferd) ? $refferd : '0',

                    ]);
                }
            });


            // Close the output stream
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ]);

        return $response;

    }

    private function getUserVoucherCounts(string $string, $userid)
    {
        switch ($string) {
            case 'voucher_count':
                return VoucherUser::where('user_id', $userid)->count();
            case 'active_voucher':
                return VoucherUser::where('user_id', $userid)->where('no_of_uses', '>', '0')->whereDate('voucher_start_date', '<=', date('Y-m-d 00:00:00'))->whereDate('voucher_end_date', '>=', date('Y-m-d 23:59:59'))->count();
            case 'redeem_voucher':
                return VoucherLog::where('user_id', $userid)->count();
            case 'expire_voucher':
                return VoucherUser::where('user_id', $userid)->whereDate('voucher_end_date', '<', date('Y-m-d 00:00:00'))->whereDate('voucher_end_date', '<', date('Y-m-d 23:59:59'))->count();

        }
    }

    private function getUserTransactions(string $string, $userid)
    {
        switch ($string) {
            case 'transaction_count':
                return MemberTransaction::where('user_id', $userid)->count();
            case 'transaction_amount_count':
                return MemberTransaction::where('user_id', $userid)->sum('amount');
        }
    }

    private function getUserStampCount(string $string, $user_id)
    {
        $credit = UserStamp::where(['user_id' => $user_id])->sum('credit');
        $debit = UserStamp::where(['user_id' => $user_id])->sum('debit');
        $initialTotal = $credit - $debit;

        return $initialTotal;
    }

    public function reportOfReferedFriend()
    {
        $filename = 'UserDetails-' . date('Y-m-d h:i:s');
        $response = new StreamedResponse(function () {
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($handle, [
                'MemberId',
                'Email',
                'Vouchers Count',
                'Active Vouchers ',
                'Expired Vouchers',
                'Redeemed Vouchers',
                'Stamps Count',
                'Transaction Count',
                'Transaction Amount Count',
                'Referred'
            ]);

            User::whereNotNull('soldi_id')->where('soldi_id', '!=', '0')->chunk(1000, function ($users) use ($handle) {
                foreach ($users as $user) {
                    // Add a new row with data
                    $refferd = User::where('referal_by', $user->referral_code)->count();
                    $transactionCount = $this->getUserTransactions('transaction_count', $user->user_id);
                    $transactionAmount = $this->getUserTransactions('transaction_amount_count', $user->user_id);
                    $vouchersData = $this->getActiveVoucherES($user->user_id);
                    fputcsv($handle, [
                        'client_customer_id' => $user->client_customer_id,
                        'email' => $user->email,
                        'voucher_count' => $vouchersData['count'],
                        'active_voucher' => $vouchersData['active'],
                        'expired_voucher' => $vouchersData['expiredVoucher'],
                        'Redeemed_voucher' => $vouchersData['redeemed_voucher'],
                        'stamps_count' => $this->getStampCountES($user->user_id),
                        'transaction_count' => ($transactionCount) ? $transactionCount : '0',
                        'transaction_amount_count' => ($transactionAmount) ? $transactionAmount : '0',
                        'Referred' => ($refferd) ? $refferd : '0',

                    ]);
                }
            });


            // Close the output stream
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ]);

        return $response;
    }

    public function userReportForProd()
    {
        $filename = 'UserDetails_'.date('Y-m-d').'.csv';

        $response = new StreamedResponse(function () use ($filename) {
            $handle = fopen(public_path('/uploads/') . $filename, 'w+');

            // Add CSV headers
            fputcsv($handle, [
                'MemberId',
                'Email',
                'Vouchers Count',
                'Active Vouchers ',
                'Expired Vouchers',
                'Redeemed Vouchers',
                'Stamps Count',
                'Transaction Count',
                'Transaction Amount Count',
                'Referred'
            ]);

            User::whereNotNull('soldi_id')->where('soldi_id', '!=', '0')->chunk(1000, function ($users) use ($handle) {
                foreach ($users as $user) {
                    // Add a new row with data
                    $refferd = User::where('referal_by', $user->referral_code)->count();
                    $transactionCount = $this->getUserTransactions('transaction_count', $user->user_id);
                    $transactionAmount = $this->getUserTransactions('transaction_amount_count', $user->user_id);
                    $activeVouchers = $this->getActiveVoucherES($user->user_id);
                    $totalVoucher = $this->getTotalVoucherES($user->user_id);
                    $expireVouchers = $this->getExpireVoucherES($user->user_id);
                    $redeemVouchers = $this->getRedeemVoucherES($user->user_id);
                    fputcsv($handle, [
                        'client_customer_id' => $user->client_customer_id,
                        'email' => $user->email,
                        'voucher_count' => $totalVoucher,
                        'active_voucher' => $activeVouchers,
                        'expired_voucher' => $expireVouchers,
                        'Redeemed_voucher' => $redeemVouchers,
                        'stamps_count' => $this->getStampCountES($user->user_id),
                        'transaction_count' => ($transactionCount) ? $transactionCount : '0',
                        'transaction_amount_count' => ($transactionAmount) ? $transactionAmount : '0',
                        'Referred' => ($refferd) ? $refferd : '0',

                    ]);
                }
            });


            // Close the output stream
            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename,
        ]);

        return $response;
    }


    private function getActiveVoucherES($user_id)
    {
        $query = [

            "query" =>[
                'bool' => [
                    'must' => [
                        ['match' => ["custom_doc_type" => config('constant.user_integrated_voucher')]], [
                            "term" => [
                                "persona_id" => [
                                    "value" => $user_id
                                ]
                            ]
                        ], [
                            "range" => [
                                "voucher_end_date" => [
                                    "gt" => date('d-m-Y'),
                                    "format" => "dd-MM-yyyy"
                                ]
                            ]
                        ],[
                            "range" =>[
                                "uses_remaining" =>[
                                    "gt" =>"0"
                                ]
                            ]
                        ]
                    ]
                ]
            ]

        ];
        
        return  ElasticsearchUtility::count(config('constant.ES_INDEX_BASENAME'),  $query);
    }

    private function getStampCountES($user_id)
    {
        $requestParam = new \Illuminate\Http\Request();
        $requestParam->setMethod('POST');
        $requestParam->request->add(['persona_id' => $user_id, 'filter' => 'week', 'company_id' => 2, 'venue_id' => '262751']);
        $totalAmount = (new ElasticSearchController())->getMemberStampCardsStas($requestParam);
        return $totalAmount['total'];
    }

    private function checkDirOrMake($dirname)
    {
        $filename = $dirname . "/";

        if (!file_exists($filename)) {
            mkdir($dirname, 0777);
        }
    }

    private function getTotalVoucherES($user_id)
    {
        $query = [
            "query" =>[
                'bool' => [
                    'must' => [
                        ['match' => ["custom_doc_type" => config('constant.user_integrated_voucher')]], [
                            "term" => [
                                "persona_id" => [
                                    "value" => $user_id
                                ]
                            ]
                        ]
                    ]
                ]
            ]

        ];
        return  ElasticsearchUtility::count(config('constant.ES_INDEX_BASENAME'),  $query);
    }

    private function getExpireVoucherES($user_id)
    {
        $query = [

           "query"=>[
               'bool' => [
                   'must' => [
                       ['match' => ["custom_doc_type" => config('constant.user_integrated_voucher')]], [
                           "term" => [
                               "persona_id" => [
                                   "value" => $user_id
                               ]
                           ]
                       ], [
                           "range" => [
                               "voucher_end_date" => [
                                   "lt" => date('d-m-Y'),
                                   "format" => "dd-MM-yyyy"
                               ]
                           ]
                       ]
                   ]
               ]
           ]

        ];
        return  ElasticsearchUtility::count(config('constant.ES_INDEX_BASENAME'),  $query);
    }

    private function getRedeemVoucherES($user_id)
    {
        $query = [

           "query" => [
               'bool' => [
                   'must' => [
                       ['match' => ["custom_doc_type" => config('constant.redeemed_voucher')]], [
                           "term" => [
                               "persona_id" => [
                                   "value" => $user_id
                               ]
                           ]
                       ]
                   ]
               ]
           ]

        ];
        return  ElasticsearchUtility::count(config('constant.ES_INDEX_BASENAME'),  $query);
    }

}
