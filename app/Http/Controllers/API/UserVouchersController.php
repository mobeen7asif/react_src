<?php /** @noinspection PhpLanguageLevelInspection */

namespace App\Http\Controllers\Api;


use App\Models\Campaign;
use App\Models\PunchCard;
use App\Models\Voucher;
use App\Models\VoucherUser;
use App\Utility\ElasticsearchUtility;
use Illuminate\Support\Facades\Log;

use App\Models\UserLoyaltyPoints;

use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;
use Illuminate\Support\Facades\Config;
use Image;
use App\classes\CommonLibrary;
use App\Models\NewsCategory;
use App\Models\VenueSubscrition;
use App\UnifiedDbModels\Product;
use Validator;

class UserVouchersController extends Controller
{

    public $_common_library;

    public function __construct()
    {
        $this->common_library = new CommonLibrary();
    }

    public function userVoucherAdd(Request $request)
    {

        $user_id = $request->user_id;
        $venue_id = $request->venue_id;
        $product_id = $request->product_id;
        $pos_name = $request->pos_name;
        $first_name = $request->first_name;
        $last_name = $request->last_name;
        $payment_method = $request->payment_method;
        $email = $request->email;
        $patronId = $request->patronId;
        $amount = $request->amount;
        $type = $request->type;
        $voucher_id = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, 10);
        $current = Carbon::now();
        $random_id = mt_rand();

        $get_point_type_id = DB::table('product')
            ->where('product_id', $product_id)
            ->select('point_type_id')
            ->first();
        if (!$get_point_type_id) {
            return ["status" => false, "mesage" => "Invalid Product ID to get point type of product"];
        }

        $data_inserted = [
            'venueId' => $venue_id,
            'patronId' => $patronId,
            'transactionId' => mt_rand(100, 999),
            'pointTypeId' => $get_point_type_id->point_type_id,
            'amount' => $amount,
            'description' => "This is Description"
        ];
        $deduction_response = $this->deductUserPoints($data_inserted);

        if (isset($deduction_response['status']) && $deduction_response['status']) {
            /* Start Barcode image genrate and upload to directory */
            $en_code = $this->generateEAN($product_id);

            $bar_code_image = DNS1D::getBarcodePNG($en_code, "EAN13", 3, 33);
            $path = base_path() . '/public/barcode_images';
            $file = $path . "/" . $en_code . '.png'; //file name to write to include location if needed
            $data = base64_decode($bar_code_image);
            file_put_contents($file, $data);
            /* End Start Barcode image genrate and upload to directory */
            $voucher_create = DB::table('user_vouchers')->insertGetId(
                [
                    'user_id' => $user_id,
                    'venue_id' => $venue_id,
                    'barcode_image' => $en_code . ".png",
                    'first_name' => $first_name,
                    'email' => $email,
                    'last_name' => $last_name,
                    'voucher_id' => $en_code,
                    'product_id' => $product_id,
                    'expiry_date' => date('Y-m-d H:i:s', strtotime("+30 days")),
                    'pos' => $pos_name,
                    'payment_method' => $payment_method,
                    'status' => 0,
                    'voucher_type' => $type,
                    'created_at' => $current,
                    'updated_at' => $current
                ]
            );


            if (isset($voucher_create)) {
                $get_product_result = Product::select('product_name', 'short_description')
                    ->where('product_id', '=', $product_id)
                    ->first();
                $response_voucher['product_name'] = $get_product_result->product_name;
                $response_voucher['barcode_image'] = config('constant.FileUrl') . 'barcode_images/' . $en_code . '.png';
                $response_voucher['voucher_id'] = $en_code;
                $response_voucher['expiry_date'] = date('Y-m-d H:i:s', strtotime("+30 days"));
                $response_voucher['status'] = 'pending';
                $response_voucher['terms'] = $get_product_result->short_description;
                return $this->getResponse($response_voucher, 'Voucher added successfully', true);
            } else {
                return $this->getResponse([], 'Unfortunately! Voucher not created', false);
            }
        } else {
            $array['status'] = false;
            $array['message'] = 'Unfortunately! Voucher not created due to server issue';
            return $array;
        }
    }

    public function userCampaignVoucherAdd(Request $request)
    {

        $user_id = $request->user_id;
        $venue_id = $request->venue_id;
        $product_id = explode("_", $request->product_id);

        if (count($product_id) == 1) {
            $product_id = $product_id[0];
        } else {
            $product_id = $product_id[1];
        }
        $pos_name = $request->pos_name;
        $first_name = $request->first_name;
        $last_name = $request->last_name;
        $payment_method = $request->payment_method;
        $email = $request->email;
        $patronId = $request->patronId;
        $campaignId = $request->campaign_id;
        $amount = $request->amount;
        $type = $request->type;

        $voucher_id = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, 10);
        $current = Carbon::now();
        $random_id = mt_rand();
        /* Start Barcode image genrate and upload to directory */
        $en_code = $this->generateEAN($product_id);
        $bar_code_image = DNS1D::getBarcodePNG($en_code, "EAN13", 3, 33);
        $path = base_path() . '/public/barcode_images';
        $file = $path . "/" . $en_code . '.png'; //file name to write to include location if needed
        $data = base64_decode($bar_code_image);
        file_put_contents($file, $data);
        /* End Start Barcode image genrate and upload to directory */
        $voucher_create = DB::table('user_vouchers')->insertGetId(
            [
                'user_id' => $user_id,
                'venue_id' => $venue_id,
                'campaign_id' => $campaignId,
                'barcode_image' => $en_code . ".png",
                'first_name' => $first_name,
                'email' => $email,
                'last_name' => $last_name,
                'voucher_id' => $en_code,
                'product_id' => $product_id,
                'expiry_date' => date('Y-m-d H:i:s', strtotime("+30 days")),
                'pos' => $pos_name,
                'patron_id' => $patronId,
                'payment_method' => $payment_method,
                'status' => 0,
                'voucher_type' => $type,
                'created_at' => $current,
                'updated_at' => $current
            ]
        );

        if (isset($voucher_create)) {
            $get_product_result = Product::select('product_name', 'short_description')
                ->where('product_id', '=', $product_id)
                ->first();
            if ($get_product_result) {
                $response_voucher['product_name'] = $get_product_result->product_name;
                $response_voucher['terms'] = $get_product_result->short_description;
            } else {
                $response_voucher['product_name'] = "";
                $response_voucher['terms'] = "";
            }
            $response_voucher['barcode_image'] = config('constant.FileUrl') . 'barcode_images/' . $en_code . '.png';
            $response_voucher['voucher_id'] = $en_code;
            $response_voucher['expiry_date'] = date('Y-m-d H:i:s', strtotime("+30 days"));
            $response_voucher['status'] = 'pending';

            return $this->getResponse($response_voucher, 'Voucher added successfully', true);
        } else {
            return $this->getResponse([], 'Unfortunately! Voucher not created', false);
        }
    }

    public function deductUserPoints($data)
    {

        $swager_url = config('constants.swager_URL');
        $swager_apikey = config('constants.swager_apikey');
        $venue_url = $swager_url . 'cougar/v1/point/redeem';
        $client = new Client([
            'headers' => [
                'apikey' => $swager_apikey,
                "content-type" => "application/json",
            ]
        ]);
        try {
            $response = $client->request('POST', $venue_url, [
                'json' => $data
            ]);

            if ($response->getStatusCode() == "202") {
                $arr['status'] = TRUE;
                $arr['message'] = 'Server accepted';
            }
        } catch (RequestException $e) {
            $arr['status'] = false;
            $arr['message'] = $e->getMessage();
        }
        return $arr;
    }

    function generateEAN($number)
    {

        $code = mt_rand(100, 999) . str_pad($number, 9, mt_rand(0, 9));
        $weightflag = true;
        $sum = 0;
        for ($i = strlen($code) - 1; $i >= 0; $i--) {
            $sum += (int)$code[$i] * ($weightflag ? 3 : 1);
            $weightflag = !$weightflag;
        }
        $code .= (10 - ($sum % 10)) % 10;
        return $code;
    }

    public function userVoucherListing(Request $request)
    {

        $user_id = $request->user_id;
        $venue_id = $request->venue_id;
        $current = Carbon::now();

        $products_listing = DB::table('user_vouchers as uv')
            ->leftjoin('product as p', 'uv.product_id', '=', 'p.product_id')
            ->leftjoin('store as s', 'p.store_id', "=", "s.store_id")
            ->leftjoin('product_images as pi', 'p.product_id', "=", "pi.product_id")
            ->where('uv.venue_id', '=', $venue_id)
            ->where('uv.user_id', '=', $user_id)
            ->orderBy('uv.id', 'DESE')
            ->get(array('p.product_id', 'p.product_name', 'p.short_description as term', 'uv.id as voucher_id', 'uv.barcode_image as b_image', 's.store_name', 'uv.expiry_date', 'uv.status as voucher_status', 'pi.image_path as p_image'))->toArray();

        $temp_arry = array();
        foreach ($products_listing as $listing) {
            if (empty($listing->p_image)) {
                $listing->product_image = "";
            } else {
                $listing->product_image = $listing->p_image;
            }
            $listing->term = (string)$listing->term;
            $listing->product_image;
            $status = 0;
            if ($listing->voucher_status == 0) {
                $status = "pending";
            } else {
                $status = "Redeemed";
            }
            $listing->status = $status;
            $listing->barcode_image = config('constant.FileUrl') . '/barcode_images/' . $listing->b_image;
            array_push($temp_arry, $listing);
        }
        if (!empty($temp_arry)) {
            return response()->json(['status' => true, "message" => 'Voucher Listing', "data" => $temp_arry]);
        } else {
            return response()->json(['status' => false, "message" => 'No Voucher', "data" => '']);
        }
    }

    protected function getResponse($data, $msg = "", $status = true)
    {
        return response()->json(['status' => $status, "message" => $msg, "data" => $data]);
    }

    public function voucher_verification()
    {

        $data = getallheaders();
        $voucher_id = $data['voucher_id'];
        $venue_id = $data['venue_id'];
        if ($voucher_id == 0 || $voucher_id < 0 || empty($voucher_id)) {
            return response()->json(['status' => 'failure', "message" => 'Voucher id is missing']);
        }

        if ($venue_id == 0 || empty($venue_id)) {
            return response()->json(['status' => 'failure', "message" => 'Venue id is missing']);
        }

        $voucher_ = DB::table('user_vouchers')
            ->where('voucher_id', $voucher_id)
            ->where('venue_id', $venue_id)
            ->where('status', 0)
            ->get()->first();

        if ($voucher_) {
            return response()->json(['status' => 'success', "product_id" => $voucher_->product_id, "message" => 'Voucher is valid']);
        } else {
            return response()->json(['status' => 'failure', 'product_id' => '', "message" => 'Voucher is not valid']);
        }
    }

    public function voucher_redeem(Request $request)
    {
        $data = $request->all();

        $voucher_id = $data['voucher_id'];
        $redemption_date = $data['redemption_date'];

        if ($voucher_id == 0 || $voucher_id < 0 || empty($voucher_id)) {
            return response()->json(['status' => 'failure', "message" => 'Voucher id is missing']);
        }
        if (empty($redemption_date)) {
            return response()->json(['status' => 'failure', "message" => 'Redemption Date is missing']);
        }
        $response = DB::table('user_vouchers')->where('voucher_id', $voucher_id)->update(['redemption_date' => $redemption_date, 'status' => '1']);

        if ($response) {
            return response()->json(['status' => 'success', "message" => 'Voucher Redeemed Successfully']);
        } else {
            return response()->json(['status' => 'failure', "message" => 'Voucher Not Found']);
        }
    }

    public function rating_points_history(Request $request)
    {
        $data = $request->all();
        extract($data);
        if (empty($data["venueId"])) {
            $arr['status'] = false;
            $arr['error'] = 'Venue id not found';
            return json_encode($arr);
        }
        if (empty($data["patron_id"])) {
            $arr['status'] = false;
            $arr['error'] = 'patron id not found';
            return json_encode($arr);
        }
        $amplify_URL = config('constant.amplify_URL');
        $fetch_amplify_key = DB::table('settings')->where('company_id', 2)->select('amplify_api_key')->first();
        if ($fetch_amplify_key && !empty($fetch_amplify_key->amplify_api_key)) {
            $client = new Client([
                'headers' => [
                    'X-API-KEY' => $fetch_amplify_key->amplify_api_key
                ]
            ]);
            $sendData = [
                'venueId' => $venueId ?? 0,
                'patron_id' => $patron_id ?? 0,
            ];
            try {
                $response = $client->request('POST', $amplify_URL . 'reporting/ratingPointsHistory', [
                    'form_params' => $sendData
                ]);

                $response_data = $response->getBody()->getContents();
                $decode_data = json_decode($response_data);
                if ($decode_data->status) {

                    return $response_data;
                } else {

                    $arr['status'] = false;
                    $arr['error'] = 'No data Found';
                    return json_encode($arr);
                }
            } catch (RequestException $e) {
                $arr['status'] = false;
                $arr['error'] = 'Internal Server Error';
                return json_encode($arr);
            }
        } else {

            $arr['status'] = false;
            $arr['error'] = 'Amplify api Key not found in table';
            return json_encode($arr);
        }
    }

    function upload_image_into_directory(Request $request)
    {

        $data = $request->all();
        if ($data['type'] == 'image') {
            $ext = $data['file_type'];
            $video_name = time() . '.' . $data['file_type'];
            if ($ext == 'jpg' || $ext == 'png' || $ext == 'gif') {
                file_put_contents(base_path() . "/public/ImageLibraryImages/" . $video_name, base64_decode($request->file));

                if (is_file(base_path() . "/public/ImageLibraryImages/" . $video_name) == true) {

                    return response()->json(['status' => 'success', "message" => 'Image Successfully Uploaded Into Directory', 'image_path' => asset('/') . 'public/ImageLibraryImages/' . $video_name]);
                } else {

                    return response()->json(['status' => 'false', "message" => 'Sorry! image not uploaded']);
                }
            } else {

                return response()->json(['status' => 'false', "message" => 'Upload jpg/png/gif only']);
            }
        } else if ($data['type'] == 'video') {
            $video_name = time() . '.' . $data['file_type'];
            $ext = $data['file_type'];
            if ($ext == 'mp4' || $ext == '3gp' || $ext == '3gpp' || $ext == 'webm' || $ext == 'MOV') {

                file_put_contents(base_path() . "/public/ImageLibraryImages/videos/" . $video_name, base64_decode($request->file));
                if (is_file(base_path() . "/public/ImageLibraryImages/videos/" . $video_name) == true) {

                    return response()->json(['status' => 'success', "message" => 'Video Successfully Uploaded Into Directory', 'image_path' => asset('/') . 'public/ImageLibraryImages/videos/' . $video_name]);
                } else {

                    return response()->json(['status' => 'false', "message" => 'Sorry! video not uploaded']);
                }
            } else {

                return response()->json(['status' => 'false', "message" => 'Upload mp4/3gp/3gpp/webm/MOV only']);
            }
        }
    }

    /**
     * @param Request $request
     * @return array
     * Get specific user's vouchers list.
     */
    public function userVouchersListing(Request $request)
    {
        try {

            $curr_time = date('Y-m-d H:i');
            $vouchers = VoucherUser::where('user_id',$request->user_id)->whereDate('voucher_start_date','<=',$curr_time)->whereDate('voucher_end_date','>=',$curr_time)->get();

            $new_array =[];
            foreach ($vouchers as $voucher) {
                $delete_status = false;
                if (!empty($voucher['punch_id'])) {
                    if(PunchCard::whereId($voucher['punch_id'])->first()){
                        $delete_status = true;
                    }

                } else if(!empty($voucher['campaign_id'])) {
                    if(Campaign::where('id', $voucher['campaign_id'])->first()){
                        $delete_status = true;
                    }
                }else{
                    $delete_status =true;
                }
                if ($delete_status) {
                    if (($voucher['uses_remaining']) > 0) {
                        $getVoucher = Voucher::where('id', $voucher['voucher_id'])->first();
                        if ($getVoucher) {
                            $image = $getVoucher['image'];
                            $data = [
                                'date' => strtotime($voucher['voucher_end_date']),
                                "voucher_name" => $getVoucher['name'] ?? '',
                                "voucher_amount" => (string)$getVoucher['amount'] ?? '',
                                "voucher_type" => $getVoucher['discount_type'] ?? '',
                                "promotion_text" => $getVoucher['promotion_text'] ?? '',
                                "voucher_status" => 1,
                                "businesses" => (count([json_decode($getVoucher['business'], true)]) > 0) ? [json_decode($getVoucher['business'], true)] : [],
                                "dateadded" => strtotime($voucher['created_at']),
                                "pos_ibs" => (string)$getVoucher['pos_ibs'],
                                "basket_level" => ($getVoucher['basket_level'] == 1) ? true : false,
                                "voucher_avial_data" => json_decode($getVoucher['voucher_avial_data'], true),
                                "persona_id" => $request->user_id,
                                "from_punch_card" => (string)$voucher['punch_id'] ?? '',
                                "campaign_id" => (string)$voucher['campaign_id'] ?? '',
                                "attachment_url" => url("/") . '/' . $image,
                                "venue_id" => (string)23333,
                                "no_of_uses" => (string)$voucher['no_of_uses'],
                                "uses_remaining" => $voucher['uses_remaining'],
                                "type" => 'voucher',
                                "user_id" => (string)$request->user_id,
                                "company_id" => (string)$voucher['company_id'],
                                "id" => (string)$voucher['id'],
                                "voucher_code" => (string)$voucher['voucher_code'],
                                "custom_doc_type" => 'user_integrated_voucher',
                                "voucher_start_date" => (string)$voucher['voucher_start_date'],
                                "voucher_end_date" => (string)strtotime(Carbon::parse($voucher['voucher_end_date'])->format('Y-m-d h:i:s a')),
                                "redemption_rule" => $getVoucher['redemption_rule'],
                            ];
                            $new_array[] = $data;
                        }
                    }

                }
            }


            return (count($new_array) > 0)
                ? ["status" => true, "message" => 'Successfully fetching data', "data" => $new_array]
                : ["status" => false, "message" => "No Voucher Found", "data" => []];
        } catch (\Exception $e) {

           // Log::channel('custom')->info('vouchers_error' . $e->getTrace().$e->getMessage());

            return ["status" => false, "message" => "Error occurred while fetching user vouchers.Please try again letter".$e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of userVoucherListing() ......//

    /**
     * @param Request $request
     * @return array
     * Get User Badges List.
     */
    public function userBadgeListing(Request $request)
    {
        try {
            $response = (new Client())->post(config('contant.JAVA_URL') . 'userBadgeListing', [
                'headers' => array(),
                'json' => ['user_id' => $request->user_id, 'venue_id' => $request->venue_id, "company_id" => $request->company_id],
            ]);

            $dd = json_decode($response->getBody());
            return $dd->status
                ? ["status" => true, "message" => $dd->message, "data" => $dd->body]
                : ["status" => false, "message" => "Error occurred while getting Badges"];
        } catch (\Exception $e) {

            return ["status" => false, "message" => "Error occurred while getting Badges. Please try again letter"];
        }//..... end of try-catch() .....//
    }//..... end of userBadgeListing() ......//


    public function listActiveCampaignVouchers()
    {

        $list_vouchers = Voucher::select('id','name as label','name as voucher_name','discount_type','amount as discount','promotion_text')->get();
        foreach ($list_vouchers as $key=>$value){
            $list_vouchers[$key]['value']=false;
        }

        return ["status" => true, "data" => $list_vouchers];
    }

    public function getVoucherQuery($request)
    {
        return array(
            'query' =>
                array(
                    'bool' =>
                        array(
                            'must' =>
                                array(
                                    0 =>
                                        array(
                                            'term' =>
                                                array(
                                                    'persona_id' =>
                                                        array(
                                                            'value' => "$request->user_id",
                                                        ),
                                                ),
                                        ),
                                    1 =>
                                        array(
                                            'bool' =>
                                                array(
                                                    'should' =>
                                                        array(
                                                            0 =>
                                                                array(
                                                                    'term' =>
                                                                        array(
                                                                            'custom_doc_type' =>
                                                                                array(
                                                                                    'value' => 'user_voucher',
                                                                                ),
                                                                        ),
                                                                ),
                                                            1 =>
                                                                array(
                                                                    'term' =>
                                                                        array(
                                                                            'custom_doc_type' =>
                                                                                array(
                                                                                    'value' => 'user_integrated_voucher',
                                                                                ),
                                                                        ),
                                                                ),
                                                        ),
                                                ),
                                        ),
                                ),
                        ),
                ),
        );
    }

}//..... end of class.