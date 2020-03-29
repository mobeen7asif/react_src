<?php

namespace App\Http\Controllers\API;

use App\Models\UserTempPayment;
use App\Models\Voucher;
use App\Models\VoucherLog;
use App\Models\VoucherUser;
use App\User;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use Elasticsearch\Common\Exceptions\ClientErrorResponseException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use mysql_xdevapi\Exception;
use App\Models\PunchCard;
use App\Http\Controllers\API\ElasticSearchController;

class PaymentController extends Controller
{
    public $country;
    public $KB_CLIENT = '';

    public function __construct()
    {
        set_time_limit(0);
        $this->KB_CLIENT = (new Client([
            'auth' => (request()->header('Country') == 'uk') ? [config('constant.KILL_BILL_USER_NAME'), config('constant.KILL_BILL_PASSWORD')] : [config('constant.KILL_BILL_IRE_USER_NAME'), config('constant.KILL_BILL_IRE_PASSWORD')],
            'headers' => [
                'Content-Type' => 'application/json',
                'x-killbill-apikey' => (request()->header('Country') == 'uk') ? config('constant.KILL_BILL_APIKEY') : config('constant.KILL_BILL_IRE_APIKEY'),
                'x-killbill-apisecret' => (request()->header('Country') == 'uk') ? config('constant.KILL_BILL_SECRET') : config('constant.KILL_BILL_IRE_SECRET'),
                "x-killbill-createdby" => 'GBK'
            ]
        ]));
        Log::channel('custom')->info('Country', ['COUNTRY' => request()->header('Country')]);
        Log::channel('custom')->info('KBDETAILS', ['KB' => $this->KB_CLIENT]);

    }

    /**
     * @param string $user
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function registerUserToKB($user = '')
    {

        try {

            $dataPost = ["name" => $user->user_first_name . ' ' . $user->user_family_name, "firstNameLength" => strlen($user->user_first_name), "email" => $user->email, "phone" => $user->user_mobile, "currency" => "GBP", "billCycleDayLocal" => 1, "timeZone" => "UTC", "referenceTime" => Carbon::now()->toIso8601String(), "address2" => "Test Addresss", "postalCode" => "PO 23443"];

            if (!$user->kill_bill_id) {
                $ukClient = (new Client([
                    'auth' => [config('constant.KILL_BILL_USER_NAME'), config('constant.KILL_BILL_PASSWORD')],
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'x-killbill-apikey' => config('constant.KILL_BILL_APIKEY'),
                        'x-killbill-apisecret' => config('constant.KILL_BILL_SECRET'),
                        "x-killbill-createdby" => 'GBK'
                    ]
                ]));

                $response = $ukClient->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/accounts", [
                    'json' => $dataPost
                ])->getHeaders();


                if (array_key_exists('Location', $response)) {

                    $url = $response['Location'][0];

                    User::where('user_id', $user->user_id)->update([
                        'kill_bill_id' => basename($url)
                    ]);
                    $ukClient->request('POST', $url . '/tags', [
                        'json' => ["00000000-0000-0000-0000-000000000001"]
                    ]);


                }
            }

            if (!$user->kilbill_ire_id) {

                $this->resgisterToIRE($dataPost, $user);
            }
            return ['status' => true];
        } catch (\Exception $e) {

            return ['status' => false, 'message' => 'Error occured due' . $e->getMessage()];
        }
    }//----- End of registerUserToKB() -----//

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function addUserCards(Request $request)
    {
        try {
            $status = ($request->is_default) ? 'true' : 'false';
            $cardData = ["pluginName" => "barclay-card", "pluginInfo" => ["externalPaymentMethodId" => "external", "isDefaultPaymentMethod" => (bool)$status,
                "properties" => [["key" => "successRedirectUrl", "value" => url('/api/get-payment-type/' . request()->header('Country')), "isUpdatable" => true]]]];

            $user = $request->user();

            $kilbillI = (request()->header('Country') == 'uk') ? $user->kill_bill_id : $user->kilbill_ire_id;


            $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/accounts/$kilbillI/paymentMethods?isDefault=" . $status . "&payAllUnpaidInvoices=false", [
                'json' => $cardData
            ]);
            $response = $response->getHeaders();

            if (array_key_exists('Location', $response)) {
                $url = $response['Location'][0];

                $recievedLink = $this->cardLinkGeneration($url);
                return ['status' => true, 'link' => $recievedLink['data']];
            }
        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }//----- End of addUserCards() -----//

    /**
     * @param $url
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function cardLinkGeneration($url)
    {
        $response = $this->KB_CLIENT->request('GET', $url . "?includedDeleted=false&withPluginInfo=true&audit=NONE")->getBody();
        return ['data' => json_decode($response)->pluginInfo->properties[0]->value ?? ''];
    }//----- End of cardLinkGeneration() ----//

    /**
     * @return array
     */
    public function getUserCardsKB()
    {
        try {

            $accountId = (request()->header('Country') == 'uk') ? request()->user()->kill_bill_id : request()->user()->kilbill_ire_id;
            // dd($accountId);
            Log::channel('custom')->info('check data', ['CHEKCIDS' => $accountId]);
            $request = $this->KB_CLIENT->get(config('constant.KILL_BILL_URL') . '/1.0/kb/accounts/' . $accountId . '/paymentMethods?withPluginInfo=true', [], [])->getBody()->getContents();
            $data = collect(json_decode($request, true));

            $dataArray = [];
            foreach ($data as $value)
                foreach ($value['pluginInfo']['properties'] as $val) {
                    if ($val['key'] == 'cardInfo' && !empty($val['value'])) {
                        $dataArray[] = $value;
                    }
                }
            return ['status' => ($data->isNotEmpty()) ? true : false, 'data' => $dataArray];
        } catch (\Exception $e) {
            return ['status' => 'false', 'message' => 'error Occured' . $e->getMessage()];
        }
    }//----- End of getUserCardsKB() -----//

    public function killbillPaymentData(Request $request, $region = 'uk')
    {
        $request_arr = $request->all();
        $kbPaymentOrMethodID = isset($request->kbPaymentId) ? $request->kbPaymentId : $request->kbPaymentMethodId;

        $requestKeys = array_keys($request_arr);
        try {
            $response = (new Client([
                'auth' => ($region == 'uk') ? [config('constant.KILL_BILL_USER_NAME'), config('constant.KILL_BILL_PASSWORD')] : [config('constant.KILL_BILL_IRE_USER_NAME'), config('constant.KILL_BILL_IRE_PASSWORD')],
                'headers' => [
                    'Content-Type' => 'application/json',
                    'x-killbill-apikey' => ($region == 'uk') ? config('constant.KILL_BILL_APIKEY') : config('constant.KILL_BILL_IRE_APIKEY'),
                    'x-killbill-apisecret' => ($region == 'uk') ? config('constant.KILL_BILL_SECRET') : config('constant.KILL_BILL_IRE_SECRET'),
                    "x-killbill-createdby" => 'GBK'
                ]
            ]))->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/paymentGateways/notification/barclay-card?" . $requestKeys[0] . "=" . $kbPaymentOrMethodID);
            $httpcode = $response->getStatusCode();

            Log::channel('custom')->info('httpcode of card', ['httpcode' => $httpcode, 'ResponseKILLBILL' => $response]);

            if ($httpcode == 200) {
                if ($request->has('kbPaymentId')) {

                    $soldi_order_id = $this->paymentToSoldi($request->kbPaymentId, $region, '');

                    Log::channel('custom')->info('soldi_id', ['soldiId' => $soldi_order_id]);

                    return view('card_detail', ["soldi_order_id" => $soldi_order_id ?? 0]);
                }
                if ($request->has('kbPaymentMethodId')) {
                    $cardData = $this->getCardDetailsData($request->kbPaymentMethodId, $region)['status'];


                    if (!$cardData)
                        return view('card_detail', ["cardData" => false]);
                }


                return view('card_detail');

            } else {
                return view('payment_failed');
            }
        } catch (ClientException $e) {

            $responseData = json_decode($e->getResponse()->getBody(true), true);
            Log::channel('custom')->info('KillBillPaymentDataException', ['KillBillPaymentDataException' => $responseData]);
            return view('payment_failed', ['status' => false, 'message' => $responseData['causeMessage']]);

        }
    }//------ End of killbillPaymentData() ------//

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function userPaymentKB(Request $request)
    {
        try {
            Log::channel('custom')->info('userPaymentKB', ['userPaymentKB' => $request->all()]);
            $user = $request->user();
            $dataArray = [];
            $order_items = json_decode($request->order_items);
            $request->request->add(['user_id' => $user->user_id]);

            foreach ($order_items as $items) {
                $totalAmount = 0;
                if ($items->discount_amt > ($items->prd_unitprice * $items->prd_qty)) {
                    $totalAmount = round(($items->discount_amt - ($items->prd_unitprice * $items->prd_qty)), 2);
                } else {
                    $totalAmount = round((($items->prd_unitprice * $items->prd_qty) - $items->discount_amt), 2);
                }

                $dataArray[] = ['description' => $items->prd_name, 'amount' => $totalAmount, 'itemType' => 'EXTERNAL_CHARGE'];
            }
            Log::channel('custom')->info('finalDataAmountTOKB', ['finalDataAountTOKB' => $dataArray]);
            $accountId = (request()->header('Country') == 'uk') ? request()->user()->kill_bill_id : request()->user()->kilbill_ire_id;

            if ($request->has('is_quick_pay') and $request->is_quick_pay) {
                $cardData = collect($this->getUserCardsKB()['data']);

                if ($cardData->isNotEmpty()) {
                    $cardData = $cardData->filter(function ($item) {

                        return $item['isDefault'] == true;
                    });
                    $defaultCard = $cardData->values();
                    if ($defaultCard->isNotEmpty()) {
                        $request['card_detail'] = json_encode([['paymentMethodId' => $defaultCard[0]['paymentMethodId']]]);

                    } else {
                        return ['status' => false, 'message' => 'Please add default card first'];
                    }
                } else {
                    return ['status' => false, 'message' => 'Please add default card first.'];
                }
            }
            // Check Voucher is Redeemed or available
            $getUserVouchers = $this->checkVoucherRedemptionStatus($request->all(), $user->user_id);
            if ($getUserVouchers['status']) {
                $request->request->add(['bCommit' => 'false', 'region' => request()->header('Country')]);
                $responseFromSoldi = $this->paymentToSoldi('', request()->header('Country'), $request->all());

                if ($responseFromSoldi->success == 'TRUE') {

                    $carPayment = json_decode($request->card_detail, true);
                    $request['card_id'] = $carPayment[0]['paymentMethodId'];
                    $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/invoices/charges/$accountId?autoCommit=true", [
                        'json' => $dataArray
                    ])->getBody();

                    $recieveResponse = collect(json_decode($response));


                    if ($recieveResponse) {
                        $card_details = json_decode($request->card_detail);

                        $receiveRespose = $this->getInvoiceUrl($recieveResponse, json_decode($request->card_detail), round((($request->amount_due - $request->items_discount)), 2), $accountId);
                        Log::channel('custom')->info('$receiveRespose', ['$receiveRespose' => $receiveRespose]);
                        if ($receiveRespose) {
                            $data = explode('/', ltrim($receiveRespose['data']));
                            $request->request->add(['bCommit' => 'true']);

                            DB::table('user_temp_payments')->insert([
                                ['invoice_id' => $recieveResponse[0]->invoiceId, 'user_id' => $accountId, 'finale_payment' => json_encode($request->all()), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now(), 'payment_id' => $data[6], 'region' => request()->header('Country')]
                            ]);

                            return $this->getPaymentLink($accountId, $data[6], $card_details[0]->paymentMethodId);
                        }
                        return ['status' => false, 'message' => 'Failed to process your payment'];
                    }
                } else {
                    return ['status' => false, 'message' => "Your order was not accepted!"];
                }
            } else {
                return ['status' => false, 'message' => 'Voucher already redeemed'];
            }
        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }

    }//------ End of userPaymentKB() ------//


    /**
     * @param $responseData
     * @param $cardDetail
     * @param $dueAmount
     * @param $user
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getInvoiceUrl($responseData, $cardDetail, $dueAmount, $user)
    {
        try {
            $jsonData = [
                'paymentMethodId' => $cardDetail[0]->paymentMethodId,
                'targetInvoiceId' => $responseData[0]->invoiceId,
                'accountId' => $user,
                'purchasedAmount' => $dueAmount
            ];
            Log::channel('custom')->info('$jsonData', ['$jsonData' => $jsonData]);
            $invoiceId = $responseData[0]->invoiceId;
            $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/invoices/$invoiceId/payments", [
                'json' => $jsonData
            ])->getHeaders();

            if (array_key_exists('Location', $response)) {
                $url = $response['Location'][0];
                Log::channel('custom')->info('invoice url', ['invoice url' => $url]);
                return ['status' => true, 'data' => $url];
            }


        } catch (\Exception $e) {
            Log::channel('custom')->info('check' . $e->getMessage());
            return ['status' => false];
        }
    }//----- End of getInvoiceUrl() -----//
    /**
     * @param $accountID
     * @param $paymentID
     * @param $paymentMethodId
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getPaymentLink($accountID, $paymentID, $paymentMethodId)
    {
        try {
            $jsonData = ["formFields" => [["key" => "operation", "value" => "getPaymentUrl", "isUpdatable" => true], ["key" => "kbPaymentId", "value" => $paymentID, "isUpdatable" => true]]];

            $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/paymentGateways/hosted/form/$accountID?paymentMethodId=$paymentMethodId", [
                'json' => $jsonData
            ])->getBody()->getContents();

            return ['status' => true, 'link' => json_decode($response)->formUrl];

        } catch (\Exception $e) {
            return ['status' => false];
        }
    }//----- End of getPaymentLink() -----//

    /**
     * @param $payment_id
     * @return array
     */
    public function paymentDetailByPaymentId($payment_id)
    {
        try {
            $response = $this->KB_CLIENT->request('GET', config('constant.KILL_BILL_URL') . "/1.0/kb/payments/$payment_id?withPluginInfo=false&withAttempts=false&audit=NONE")->getBody()->getContents();
            $response = json_decode($response);
            return ['status' => true, 'data' => $response->transactions[0]->status];
        } catch (\Exception $e) {
            Log::channel('custom')->info('payment retrieve error', ['payment retrieve error' => $e->getMessage()]);
            return ['status' => false, 'data' => ''];
        }
    }

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function deleteCard(Request $request)
    {
        try {

            $paymentMethodId = $request->payment_method_id;

            $response = $this->KB_CLIENT->request('DELETE', config('constant.KILL_BILL_URL') . "/1.0/kb/paymentMethods/$paymentMethodId?deleteDefaultPmWithAutoPayOff=false&forceDefaultPmDeletion=false")->getBody()->getContents();
            Log::channel('custom')->info('Card Delete', ['CardDelete' => $response]);

            return ['status' => true, 'message' => "Card Deleted Successfully"];
        } catch (\Exception $e) {
            Log::channel('custom')->info('Card Delete', ['CardDelete' => $e->getMessage()]);
        }
    }//----- End of deleteCard() ------//

    /**
     * @param string $kbPaymentId
     * @return array|int
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function paymentToSoldi($kbPaymentId = '', $region, $finaleData = '')
    {
        if (!empty($kbPaymentId)) {
            $paymentDetails = DB::table('user_temp_payments')->where('payment_id', $kbPaymentId)->first();
            $finaleData = json_decode($paymentDetails->finale_payment, true);
            $finaleData['payment_id'] = $kbPaymentId;
            $finaleData['region'] = $region;
            if(isset($finaleData['card_detail'])) {
                $finaleData['card_id'] = json_decode($finaleData['card_detail'], true)[0]['paymentMethodId'];
            }else{
                $finaleData['card_id'] = json_decode($finaleData['payment_data']['card_detail'], true)[0]['paymentMethodId'];
            }
        }
        Log::channel('custom')->info('forwarding Data to soldi', ['dataToSOldi' => $finaleData]);

        try {
            $APIKEY = ($region == 'uk') ? config('constant.SOLDI_API_KEY') : config('constant.SOLDI_IRE_APIKEY');
            $SECRET = ($region == 'uk') ? config('constant.SOLDI_SECRET') : config('constant.SOLDI_IRE_SECRET');
            Log::channel('custom')->info('forwarding Data to soldi', ['$APIKEY' => $APIKEY, '$SECRET' => $SECRET]);

            if(isset($finaleData['template_id']) and isset($finaleData['payment_data'])){
                $url = '/giftcard/purchase';
            }else{
                $url = '/orders/placeorder';
            }
            $response = (new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $APIKEY,
                    'SECRET' => $SECRET
                ]
            ]))->request('POST', config('constant.SOLDI_DEFAULT_PATH') .$url , [
                'json' => $finaleData
            ]);

            $soldi_res = $response->getBody()->getContents();
            $soldi_res = json_decode($soldi_res);
            Log::channel('custom')->info('Response ', ['ResponseSoldi' => $soldi_res,'url',$url]);
            if (!empty($kbPaymentId)) {
                if (isset($soldi_res->data->order_str->order_id) || isset($soldi_res->data->order_id)) {
                    $orderId = '';
                    if(isset($soldi_res->data->order_str->order_id))
                        $orderId= $soldi_res->data->order_str->order_id;


                        if(isset($soldi_res->data->order_id))
                            $orderId= $soldi_res->data->order_id;


                    DB::table('user_temp_payments')->where('payment_id', $kbPaymentId)->delete();
                    if(!isset($finaleData['template_id']) and !isset($finaleData['payment_data'])){
                        $this->assignPunchCardUser($finaleData, $region,$orderId);
                    }

                }
                return $soldi_res->data->order_str->order_id ?? $soldi_res->data->order_id ??0;
            }
            return $soldi_res;
        } catch (Exception $e) {
            Log::channel('custom')->info('Response ', ['ResponseSoldi' => $e->getMessage()]);
            return ["status" => false, "message" => "Error " . $e->getMessage()];
        }
    }//----- End of paymentToSoldi() -----//

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function insertAllUser()
    {
        $users = User::whereNotNull('soldi_id')->where('soldi_id', '!=', '0')->whereNull('kill_bill_id')->get();

        foreach ($users as $user)
            $this->registerUserToKB($user);

        return ['status' => true];
    }//----- End of insertAllUser() -----//

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function refundDataToKB(Request $request)
    {
        try {
            $region = request()->header('Country');
            $jsonData = ['paymentId' => $request->refund_id, 'amount' => round((($request->amount - $request->items_discount)), 2), 'currency' => $region == 'uk' ? 'GBP' : 'EUR'];
            $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/payments/$request->refund_id/refunds/", [
                'json' => $jsonData
            ])->getBody()->getContents();
            if ($request->delete_payment == true) {
                UserTempPayment::where('payment_id', $request->refund_id)->delete();
            }
            return ['status' => true, 'message' => "Payment refunded sussessfully"];
        } catch (\Exception $e) {
            Log::channel('custom')->info('Payment refund error', ['Payment refund error' => $e->getMessage()]);
            return ['status' => false, 'message' => "Payment not refunded"];
        }
    }//---- End of refundDataToKB() -----//

    /**
     * @param $kbPaymentMethodId
     * @return array
     */
    public function getCardDetailsData($kbPaymentMethodId, $region)
    {
        $request = (new Client([
            'auth' => ($region == 'uk') ? [config('constant.KILL_BILL_USER_NAME'), config('constant.KILL_BILL_PASSWORD')] : [config('constant.KILL_BILL_IRE_USER_NAME'), config('constant.KILL_BILL_IRE_PASSWORD')],
            'headers' => [
                'Content-Type' => 'application/json',
                'x-killbill-apikey' => ($region == 'uk') ? config('constant.KILL_BILL_APIKEY') : config('constant.KILL_BILL_IRE_APIKEY'),
                'x-killbill-apisecret' => ($region == 'uk') ? config('constant.KILL_BILL_SECRET') : config('constant.KILL_BILL_IRE_SECRET'),
                "x-killbill-createdby" => 'GBK'
            ]
        ]))->get(config('constant.KILL_BILL_URL') . "/1.0/kb/paymentMethods/$kbPaymentMethodId?includedDeleted=false&withPluginInfo=true&audit=NONE", [], [])->getBody();
        $data = collect(json_decode($request, true));
        if ($data->isNotEmpty()) {
            foreach ($data['pluginInfo']['properties'] as $data) {
                if ($data['key'] == 'cardInfo' && empty($data['value']))
                    return ['status' => false];
            }
            return ['status' => true];
        }
        return ['status' => true];
    }//----- End of getCardDetailsData() -----//

    /**
     * @param $data
     * @param $user
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function resgisterToIRE($data, $user)
    {
        try {
            $data['currency'] = 'EUR';

            $ireClient = (new Client([
                'auth' => [config('constant.KILL_BILL_IRE_USER_NAME'), config('constant.KILL_BILL_IRE_PASSWORD')],
                'headers' => [
                    'Content-Type' => 'application/json',
                    'x-killbill-apikey' => config('constant.KILL_BILL_IRE_APIKEY'),
                    'x-killbill-apisecret' => config('constant.KILL_BILL_IRE_SECRET'),
                    "x-killbill-createdby" => 'GBK'
                ]
            ]));
            $requestForIRE = $ireClient->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/accounts", [
                'json' => $data
            ])->getHeaders();

            if (array_key_exists('Location', $requestForIRE)) {


                $ukUrl = $requestForIRE['Location'][0];

                User::where('user_id', $user->user_id)->update([
                    'kilbill_ire_id' => basename($ukUrl)
                ]);
                $ireClient->request('POST', $ukUrl . '/tags', [
                    'json' => ["00000000-0000-0000-0000-000000000001"]
                ]);
                return ['status' => true];
            }
        } catch (\Exception $e) {
            Log::channel('custom')->error('EROOR Register', ['EROORINIRE' => $e->getMessage()]);
        }
    }//----- End of resgisterToIRE() ------//

    /**
     * @param string $data
     * @return array|\Psr\Http\Message\StreamInterface
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function assignPunchCardUser($data = '', $region = '',$orderId='')
    {
        try {
            Log::channel('custom')->info('assignPunchCardUser()', ['recieveData' => $data]);
            $companyId = ($region == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID');
            $punchCard = PunchCard::where(['redemption_type' => 'transaction_value', 'company_id' => $companyId])->whereNull('deleted_at')->get();

            foreach ($punchCard as $punchData) {
                //if($punchData->business_id == 0) {
                if(isset($data['amount_due'])) {
                    $punch = intval(($data['amount_due'] - $data['items_discount']) / $punchData->transaction_threshold);

                    //----- If punch is greater than zero;
                    if ($punch > 0) {
                        $requestParam = new \Illuminate\Http\Request();
                        $requestParam->setMethod('POST');


                        $user_id =$data['user_id'];
                        $amount = ($data['amount_due'] - $data['items_discount']);
                        $through = "From Transaction: $amount invoice # $orderId";
                        request()->merge(["company_id" => ($data['region'] == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID'), "venue_id" => "295255", "stampid" => $punchData->id, "userID" => $user_id, "mrcht_id" => "0", "stampassign" => $punch, 'addStamps' => false, 'notify' => true, 'assign_through' => $through]);
                        //call
                        $response = (new ElasticSearchController())->stampCardAssign();
                    }
                }

                //}
            }
            return ['status' => true];
        } catch (\Exception $e) {
            Log::channel('custom')->info('Error Occured in punch card assign ' . $e->getMessage() . ' ' . $e->getLine());
            return ['status' => false];
        }
    }//------ End of assignPunchCardUser() -------//

    /**
     * @param $punch_card_data
     * @param $json_decode
     * @return bool
     */
    private function applicablePunchCard($punch_card_data, $json_decode)
    {
        $exists = false;
        $availType = collect($punch_card_data);

        $paymentProducts = collect($json_decode);

        $productIDs = $availType->where('voucher_avail_type', 'product')->pluck('voucher_avail_type_id');
        $categoryIDs = $availType->where('voucher_avail_type', 'category')->pluck('voucher_avail_type_id');
        $find = $paymentProducts->whereIn('prd_id', $productIDs);
        $categoryFind = $paymentProducts->whereIn('cate_id', $categoryIDs);
        //------ For Product Exists
        if ($find->isNotEmpty())
            $exists = true;

        //------ For Category Exists
        if ($categoryFind->isNotEmpty())
            $exists = true;

        return $exists;
    }//------- End of applicablePunchCard() ------//

    /**
     * @return array
     */
    public function valideteIbsVouchers()
    {
        try {
            Log::channel('user')->info('valideteIbsVouchers',['valideteIbsVouchers'=>\request()->all()]);
            $currentDate = date('Y-m-d H:i:00');
            if(request()->has('card_no') and empty(request()->card_no)){
                request()->merge(['card_no'=> \config('constant.SYSTEM_USERID')]);
            }

            if (request()->header('app-key') and (request()->header('app-key') === \config('constant.IBS_VERIFICATION')) and request()->voucher_code and request()->card_no) {
                $user = User::where('client_customer_id', request()->card_no)->first();
                if (!$user)
                    return ['status' => false, 'message' => 'user not exists'];

                $validVoucher = VoucherUser::where(['voucher_code' => request()->voucher_code, 'user_id' => $user->user_id,
                ])->where('uses_remaining', '>', '0')
                    ->whereDate('voucher_end_date', '>=', $currentDate)->first();


                $type = ($user->region_type == 'uk') ? 'uk' : 'ire';

                if (!empty($validVoucher)) {
                    // if voucher is exists and both reverse and redeem case

                    return $this->redeemVoucherValid($validVoucher, $type, $user);

                } else {
                    $validVoucherReverse = VoucherUser::where(['voucher_code' => request()->voucher_code, 'user_id' => $user->user_id,
                    ])->whereDate('voucher_end_date', '>=', $currentDate)->first();
                    // if voucher Exists and valid in reverse case
                    if ($validVoucherReverse) {
                        return $this->voucherNotValidate($validVoucherReverse, $type, $user);
                    } else {
                        $response =$this->publicVoucherCheck(request()->voucher_code,$type, $user, $currentDate);
                        Log::channel('user')->info('publicVoucherCheck',['response'=>$response]);
                        return $response;
                    }

                }
            } else {
                return ['status' => false, 'message' => (!request()->header('app-key') and !request()->voucher_code) ? 'Please enter valid app key and voucher' :
                    ((!request()->voucher_code) ? "Please Provide Voucher Code" : ((request()->header('app-key') !== \config('constant.IBS_VERIFICATION')) ? "Invalid App Key" : ((!request()->card_no) ? "Please provide card no" : "Please provide a valid app key")))];
            }
        } catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }
    }//----- End of valideteIbsVouchers() ------//

    public function updateVoucherStatus($voucherCodes = '', $userId = '')
    {
        Log::channel('custom')->info('updateVoucherStatus()', ['updateVoucherStatus()' => $voucherCodes]);
        try {


            $voucherData = VoucherUser::whereIn('voucher_code', $voucherCodes)->where('user_id', $userId)->get();
            foreach ($voucherData as $key => $voucher) {
                $voucherData[$key]['uses_remaining'] = ($voucher['uses_remaining'] - 1);
                VoucherLog::create([
                    'user_id' => $userId,
                    'voucher_id' => $voucher['voucher_id'],
                    'voucher_code' => $voucher['voucher_code'],

                ]);
                $voucherData[$key]->save();


            }
            return ['status' => true, 'message' => 'Successfully Updated'];
        } catch (QueryException $e) {
            return ['status' => true, 'message' => 'Successfully Updated' . $e->getMessage()];
        }
    }

    public function getVouhcerCodes($finaleData)
    {
        $order_items = json_decode($finaleData['order_items'], true);
        Log::channel('custom')->info('order items', ['order items' => $order_items]);
        $arr = [];
        foreach ($order_items as $item) {
            if (isset($item['voucher_code']) and !empty($item['voucher_code'] and $item['voucher_code'] != 0)) {
                $arr[] = $item['voucher_code'];
            }
        }
        if (count($arr) > 0) {
            $arr = array_unique($arr);
            return $arr;
        } else {
            return [];
        }
    }

    /**
     * @param array $finalData
     * @return array
     */
    private function checkVoucherRedemptionStatus(array $finalData, $userId)
    {
        try {
            $vouchers = $this->getVouhcerCodes($finalData);
            $curr_time = date('Y-m-d H:i');
            if (count($vouchers) > 0) {
                $vouchers = VoucherUser::where('user_id', $userId)->where('uses_remaining', '>', '0')->whereDate('voucher_end_date', '>=', $curr_time)->whereIn('voucher_code', $vouchers)->get();

                if (!empty($vouchers))
                    return ['status' => true];
                else
                    return ['status' => false];
            } else {
                return ['status' => true];
            }
        } catch (\Exception $e) {
            Log::channel('custom')->error('Voucher Redemption Status', ['Error' => $e->getMessage()]);
            return ['status' => false];
        }
    }//----- End of checkVoucherRedemptionStatus() ------//


    /**
     * @param string $voucherCodes
     * @param string $userId
     * @return array
     */
    public function reverseVoucherStatus($voucherCodes = '', $userId = '')
    {
        $voucherData = VoucherUser::whereIn('voucher_code', $voucherCodes)->where('user_id', $userId)->get();
        $voucherLogs = VoucherLog::where('voucher_code', $voucherCodes[0])->where('user_id', $userId)->get();
        $dataArray = $voucherLogs->toArray();
        $removed = [];
        if (count($dataArray) > 0) {
            unset($dataArray[0]);
            $removed = array_values($dataArray);
        }
        VoucherLog::where('voucher_code', $voucherCodes[0])->where('user_id', $userId)->delete();
        if (sizeof($removed) > 0) {
            foreach ($removed as $value) {
                VoucherLog::create([
                    'voucher_id' => $value['voucher_id'],
                    'user_id' => $value['user_id'],
                    'created_at' => $value['created_at'],
                    'updated_at' => $value['updated_at'],
                    'voucher_code' => $value['voucher_code'],
                ]);
            }
        }
        foreach ($voucherData as $key => $voucher) {

            $voucherData[$key]['uses_remaining'] = ($voucher['uses_remaining'] + 1);

            $voucherData[$key]->save();
        }
        return ['status' => true];
    }//----- End of reverseVoucherSatus() -----//

    public function insertDataToES($voucherCodes, $userId)
    {
        $query = [
            'query' => ['bool' => ['must' =>
                [['term' => ['custom_doc_type' => 'user_integrated_voucher']],
                    ['terms' => ['voucher_code' => $voucherCodes]],
                    ['term' => ['persona_id' => $userId]]]
            ]]];
        $validVoucherReverse = ElasticsearchUtility::getSource(config('constant.ES_INDEX_BASENAME'), $query);
        if (count($validVoucherReverse) > 0) {
            $campaignData = [];
            foreach ($validVoucherReverse as $data) {
                $campaignData[] = ['campaign_id' => (isset($data['from_punch_card'])) ? 0 : $data['campaign_id'], 'custom_doc_type' => \config('constant.redeemed_voucher'), 'voucher_avial_data' => [], 'promotion_text' => $data['promotion_text'],
                    'attachment_url' => $data['attachment_url'], 'persona_id' => $data['user_id'], 'voucher_name' => $data['voucher_name'], 'voucher_code' => $data['voucher_code'], 'id' => $data['id'] ?? 0, 'redeemed_datetime' => date('Y-m-d H:i:s'), "from_punch_card" => $data['from_punch_card'] ?? 0, 'voucher_start_date' => $data['voucher_start_date'], 'voucher_end_date' => $data['voucher_end_date'],
                    'no_of_uses' => $data['no_of_uses'], 'uses_remaining' => $data['uses_remaining']];
            }

            ElasticsearchUtility::bulkUserRedeemVoucher($campaignData);
            return ['status' => true];
        } else {
            dd('here');
            return ['status' => true];
        }
    }

    /**
     * @param $voucher_code
     * @param $type
     * @param $user
     * @param $currentDate
     * @return array
     *  Public Voucher Valid Check 
     */
    public function publicVoucherCheck($voucher_code,$type, $user, $currentDate)
    {
        Log::channel('user')->info('publicVoucherCheck',['voucher_code'=>$voucher_code,'type'=>$type,'user'=>$user->user_id,'allRequest'=>\request()->all()]);
        $voucherExists = VoucherUser::where(['voucher_code' => $voucher_code])
            ->whereNull('user_id')
            ->first();
        if ($type == request()->region) {
            if ($voucherExists) {
                $voucherData = Voucher::where('id', $voucherExists['voucher_id'])->first();
                $dateVoucher = ($voucherData['isNumberOfDays']) ? date('Y-m-d H:i', strtotime('+' . $voucherData['isNumberOfDays'] . ' days')) : $voucherData['end_date'];
                $startDate = ($voucherData['isNumberOfDays']) ? date('Y-m-d H:i', strtotime('-1 days')) : $voucherData['start_date'];
                if ($dateVoucher >= $currentDate) {
                    if (request()->action == 'REDEEM') {
                        $voucherExists->user_id = $user->user_id;
                        $voucherExists->voucher_start_date = $startDate;
                        $voucherExists->voucher_end_date = $dateVoucher;
                        $voucherExists->uses_remaining = ($voucherExists->uses_remaining - 1);
                        $voucherExists->created_at = date('Y-m-d H:i:00');
                        $voucherExists->save();
                        return ['status' => true, 'message' => 'Voucher Redeem Successfully', 'voucher_code' => $voucherExists['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucherData['pos_ibs']];

                    }else if(request()->action == 'VALIDATE' ||request()->action =='VALID' ){
                        $voucherExists->user_id = $user->user_id;
                        $voucherExists->voucher_start_date = $startDate;
                        $voucherExists->voucher_end_date = $dateVoucher;
                        $voucherExists->created_at = date('Y-m-d H:i:00');
                        $voucherExists->save();
                        return ['status' => true, 'message' => 'Voucher exists', 'voucher_code' => $voucherExists['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucherData['pos_ibs']];
                    }
                } else {
                    return ['status' => false, 'message' => 'Voucher Not Valid'];
                }
            } else {
                return ['status' => false, 'message' => 'Voucher code is not valid'];
            }
        }else {
            return ['status' => false, 'message' => 'Voucher Not Valid for ' . request()->region . ' Region'];
        }
    }

    /**
     * @param $validVoucherReverse
     * @param $type
     * @param $user
     * @return array
     *  Reverse voucher
     */
    private function voucherNotValidate($validVoucherReverse, $type, $user)
    {

        if ($type == request()->region) {
            if ($validVoucherReverse) {
                $voucher = Voucher::where('id', $validVoucherReverse['voucher_id'])->first();
                if (request()->action == 'REVERSE' and ($validVoucherReverse['no_of_uses'] - ($validVoucherReverse['uses_remaining'])) > 0) {

                    $this->reverseVoucherStatus([request()->voucher_code], $user->user_id);

                    return ['status' => true, 'message' => 'Voucher Reversed Successfully', 'voucher_code' => $validVoucherReverse['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucher['pos_ibs']];
                } else if (request()->action == 'REDEEM') {
                    if (($validVoucherReverse['uses_remaining']) > 0) {
                        $this->updateVoucherStatus([request()->voucher_code], $user->user_id);

                        return ['status' => true, 'message' => 'Voucher Redeem Successfully', 'voucher_code' => $validVoucherReverse['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucher['pos_ibs']];
                    }else{
                        return ['status' => false, 'message' => 'Voucher cannot be Redeemed'];
                    }
                } else {
                    return ['status' => false, 'message' => 'Voucher cannot be reversed'];
                }
            } else {
                $currentDate = date('Y-m-d H:i:00');
                return $this->publicVoucherCheck(request()->voucher_code,$type, $user,$currentDate);
            }
        } else {
            return ['status' => false, 'message' => 'Voucher Not Valid for ' . request()->region . ' Region'];
        }
    }//---- End of voucherNotValidate() ----//

    /**
     * @param $validVoucher
     * @param $type
     * @param $user
     * @return array
     *   Redeem Valid Voucher
     */
    private function redeemVoucherValid($validVoucher, $type, $user)
    {
        if ($type == request()->region) {
            $voucher = Voucher::where('id', $validVoucher['voucher_id'])->first();

            if (request()->action == 'REDEEM') {
                $this->updateVoucherStatus([request()->voucher_code], $user->user_id);
                return ['status' => true, 'message' => 'Voucher Redeem Successfully', 'voucher_code' => $validVoucher['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucher['pos_ibs']];
            } else if (\request()->action == 'REVERSE' and ($validVoucher['no_of_uses'] - ($validVoucher['uses_remaining'])) > 0) {
                $this->reverseVoucherStatus([request()->voucher_code], $user->user_id);
                return ['status' => true, 'message' => 'Voucher Reversed Successfully', 'voucher_code' => $validVoucher['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucher['pos_ibs']];
            } else if (request()->action != 'REDEEM' and request()->action == 'REVERSE') {
                return ['status' => false, 'message' => 'Voucher cannot be reversed'];
            } else {
                return ['status' => true, 'message' => 'Voucher exists', 'voucher_code' => $validVoucher['voucher_code'], 'user_id' => $user->user_id, 'userName' => $user->user_first_name . ' ' . $user->user_family_name, 'adjustmentCode' => $voucher['pos_ibs']];
            }

        } else {

            return ['status' => false, 'message' => 'Voucher Not Valid for ' . request()->region . ' Region'];
        }
    }//----- End of redeemVoucherValid() -----//

    /**
     * @param Request $request
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function userGiftCardPaymentKB(Request $request)
    {
        try {

            $dataArray = [];
            Log::channel('custom')->info('$receiveRespose', ['$receiveRespose' => $request->all()]);
            $dataArray[] = ['description' => 'Gift Card', 'amount' => $request->amount, 'itemType' => 'EXTERNAL_CHARGE'];
            Log::channel('custom')->info('finalDataAmountTOKB', ['finalDataAountTOKB' => $dataArray]);
            $accountId = (request()->header('Country') == 'uk') ? request()->user()->kill_bill_id : request()->user()->kilbill_ire_id;


            $carPayment = json_decode($request->payment_data['card_detail'], true);

            $request['card_id'] = $carPayment[0]['paymentMethodId'];
            $response = $this->KB_CLIENT->request('POST', config('constant.KILL_BILL_URL') . "/1.0/kb/invoices/charges/$accountId?autoCommit=true", [
                'json' => $dataArray
            ])->getBody();

            $recieveResponse = collect(json_decode($response));


            if ($recieveResponse) {
                $card_details = json_decode($request->payment_data['card_detail']);

                $receiveResposeInvouce = $this->getInvoiceUrl($recieveResponse, json_decode($request->payment_data['card_detail']),  $request->amount, $accountId);

                Log::channel('custom')->info('$receiveRespose', ['$receiveRespose' => $receiveResposeInvouce]);
                if ($receiveResposeInvouce) {
                    $data = explode('/', ltrim($receiveResposeInvouce['data']));

                    DB::table('user_temp_payments')->insert([
                        ['invoice_id' => $recieveResponse[0]->invoiceId, 'user_id' => $accountId, 'finale_payment' => json_encode($request->all()), 'created_at' => Carbon::now(), 'updated_at' => Carbon::now(), 'payment_id' => $data[6], 'region' => request()->header('Country')]
                    ]);

                    return $this->getPaymentLink($accountId, $data[6], $card_details[0]->paymentMethodId);
                }
                return ['status' => false, 'message' => 'Failed to process your payment'];
            }
        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }

    }//------ End of userPaymentKB() ------//
}
