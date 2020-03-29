<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\API\ElasticSearchController;
use App\Models\Gym;
use App\Models\GymExcludedBusiness;
use App\Models\MemberTransaction;
use App\Models\UserTempPayment;
use App\UnifiedDbModels\Store;
use App\User;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use App\ApiCalls\SoldiPosApiCall;
use App\UnifiedSchemaCall\SoldiPosUnifiedSchema;
use Illuminate\Http\Request;
use App\Models\User_Card;
use DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Image;
use App\classes\CommonLibrary;
use App\Models\FavoriteProduct;
use App\Models\Setting;
use Illuminate\Support\Facades\URL;
use App\Models\StoreInformation;
use App\Models\Rating;
use App\Models\VenueSubscription;
use App\Http\Controllers\API\PaymentController;



class DashboardController extends BaseRestController
{

    private $apiCall;

    public $soldiUrl = '';
    public $business_filter = '';
    const STATUS = 'status';

    const USER_ID = 'user_id';

    const IMAGE = 'image';

    const TERMS = 'terms';

    const EMAIL = 'email';
    const VENUE_ID = 'venue_id';

    const VALUE = 'value';
    const MONTH = 'month';

    const MESSAGE = 'message';

    const PERSONA_ID = 'persona_id';

    const COMPANY_ID = 'company_id';

    const CUSTOM = 'custom';

    const COUNT = 'count';

    const MATCH = 'match';
    const ADDRESS = 'address';
    const AMOUNT = 'amount';


    /**
     * StoresApiController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->common_library = new CommonLibrary();
        $this->apiCall = new SoldiPosApiCall();
        $this->soldiUnifiedPosoldiOverallStatsDatasHandler = new SoldiPosUnifiedSchema();

        $str_trim = trim(config('constant.SOLDI_DEFAULT_PATH'),'/api');
        $this->soldiUrl = $str_trim.'/web/';
        Log::channel('custom')->info('Soldi Dashboard URL', ['Soldi Dashboard URL' => $this->soldiUrl]);

        $this->business_filter = \request()->business_name == 'All' ?  'All' : '';

    }//..... end of __constructor() .......//

    /**
     * @param Request $request
     * @return array
     * return soldiTransactionsData.
     */
    public function soldiTransactionsData(Request $request)
    {
        $filterby = $request->filterby;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $url = $this->soldiUrl;


//        for live
        $business_id = $request->business_id;

        try {
            $res = (new Client())->request('POST', $url . 'dashboard/dashboard_graph', [
                'headers' => [
                    'X-API-KEY' => $request->api_key,
                    'SECRET' => $request->secret_key
                ],
                'form_params' => [
                    'filterby' => $filterby,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'business_id' => $business_id,
                    'business_filter' => $this->business_filter
                ]
            ]);
            $data = $res->getBody()->getContents();
            $data = json_decode($data,true);
            $data['data']['interval'] = [];
            if($filterby == "week"){
                $days = [];
                foreach ($data['data']['intervals'] as $key => $value){
                    $days[] = date('l', strtotime($value));
                }

                $data['data']['interval'] = $days;
            } else if($filterby == "month"){
                $days = [];
                foreach ($data['data']['intervals'] as $key => $value){
                    $days[] = date('d M Y', strtotime($value));
                }

                $data['data']['interval'] = $days;
            }else{

                $data['data']['interval'] = $data['data']['intervals'];
            }
            return ($data);
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of cardList() .....//

    /**
     * @param Request $request
     * @return array
     * return soldiStaffSalesData.
     */
    public function soldiStaffSalesData(Request $request)
    {
        $filterby = $request->filterby;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $top_people = $request->top_people;

        $url = $this->soldiUrl;
//        for live
        $business_id = $request->business_id;


        try {
            $res = (new Client())->request('POST', $url . 'dashboard/top_staffs', [
                'headers' => [
                    'X-API-KEY' => $request->api_key,
                    'SECRET' => $request->secret_key
                ],
                'form_params' => [
                    'filterby' => $filterby,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'business_id' => $business_id,
                    'top_people' => $top_people,
                    'business_filter' => $this->business_filter
                ]
            ]);
            return ($res->getBody()->getContents());
        } catch (GuzzleException $e) {
            return [self::STATUS => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of cardList() .....//

    /**
     * @param Request $request
     * @return array
     * return soldiProductsData.
     */
    public function soldiProductsData(Request $request)
    {
        $filterby = $request->filterby;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $top_items = $request->top_items;
        $sort_type = $request->sort_type;
        $sort_by = $request->sort_by;

        $url = $this->soldiUrl;
//        for live
        $business_id = $request->business_id;


        try {
            $res = (new Client())->request('POST', $url . 'dashboard/top_products', [
                'headers' => [
                    'X-API-KEY' => $request->api_key,
                    'SECRET' => $request->secret_key
                ],
                'form_params' => [
                    'filterby' => $filterby,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'business_id' => $business_id,
                    'top_items' => $top_items,
                    'sort_type' => $sort_type,
                    'sort_by' => $sort_by,
                    'business_filter' => $this->business_filter
                ]
            ]);
            return ($res->getBody()->getContents());
        } catch (\Exception $e) {
            return [self::STATUS => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of cardList() .....//

    /**
     * @param Request $request
     * @return array
     * return soldiOverallStatsData.
     */
    public function soldiOverallStatsData(Request $request)
    {
        $filterby = $request->filterby;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $url = $this->soldiUrl;
//        for live
        $business_id = $request->business_id;


        try {
            $res = (new Client())->request('POST', $url . 'dashboard/statistics_graph', [
                'headers' => [
                    'X-API-KEY' => $request->api_key,
                    'SECRET' => $request->secret_key
                ],
                'form_params' => [
                    'filterby' => $filterby,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'business_id' => $business_id,
                    'business_filter' => $this->business_filter
                ]
            ]);
            $data = $res->getBody()->getContents();
            $data = json_decode($data,true);
            $data['data']['interval'] = [];
            if($filterby == "week"){
                $days = [];
                foreach ($data['data']['intervals'] as $key => $value){
                    $days[] = date('l', strtotime($value));
                }

                $data['data']['intervals'] = $days;
            }
            if($filterby == "month"){
                $days = [];
                foreach ($data['data']['intervals'] as $key => $value){
                    $days[] = date('d M Y', strtotime($value));
                }

                $data['data']['intervals'] = $days;
            }
            return ($data);
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of cardList() .....//

    /**
     * @param Request $request
     * @return array
     * return soldiTransactionsData.
     */
    public function soldiOverallStatsCount(Request $request)
    {

        $filterby = $request->filterby;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $url = $this->soldiUrl;
//        for live
        $business_id = $request->business_id;


        try {
            $res = (new Client())->request('POST', $url . 'dashboard/dashboard_graph_trends', [
                'headers' => [
                    'X-API-KEY' => $request->api_key,
                    'SECRET' => $request->secret_key
                ],
                'form_params' => [
                    'filterby' => $filterby,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'business_id' => $business_id,
                    'business_filter' => $this->business_filter
                ]
            ]);
            $soldi_res = json_decode($res->getBody()->getContents());
            $query = ['query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ]
                ]
            ]];






            //$member_stats = ElasticsearchUtility::memberCountStats('',$request,config('constant.ES_INDEX_BASENAME'));
            $member_stats = $this->memberCountForChart('',$request,config('constant.ES_INDEX_BASENAME'));
            if($filterby == "week"){
                $days = [];
                foreach ($member_stats['intervals'] as $key => $value){
                    $days[] = date('l', strtotime($value));
                }

                $member_stats['intervals'] = $days;
            }

            $soldi_res->data->member_stats = $member_stats;
            return json_encode($soldi_res);
        } catch (GuzzleException $e) {
            return [self::STATUS => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of cardList() .....//


    public function memberCountForChart()
    {
        $elsticSearchController = new ElasticSearchController();

        if(request()->filterby=="week"){
            $start_date = date('Y-m-d', strtotime('-1 week'));
            $dates = $elsticSearchController->getDatesBetweenTwoDates($start_date,date("Y-m-d"));

        }
        else if(request()->filterby=="day"){
            $dates = $elsticSearchController->getDatesBetweenTwoDates(date("Y-m-d"),date("Y-m-d"));
        }
        else if(request()->filterby == "month"){
            $start_date = date('Y-m-d', strtotime('-1 months'));
            $dates = $elsticSearchController->getDatesBetweenTwoDates($start_date,date("Y-m-d"));
        }
        else if(request()->filterby == "year"){
            $dates = $elsticSearchController->getMonths(12);
        }
        else{
            $dates = $elsticSearchController->getDatesBetweenTwoDates(request()->start_date,request()->end_date);
        }


        $dateRange = [];
        //$redeemedVoucher = ElasticsearchUtility::redeemedVouchersCount($dates);
        $member_stats = ElasticsearchUtility::memberCountCharts($dates);



        $member_stats_final = [
            'total' => $member_stats['aggregations']['total_members_aggs']['doc_count'],
            'active' => $member_stats['aggregations']['active_member_aggs']['doc_count'],
            'inactive' => $member_stats['aggregations']['inactive_member_aggs']['doc_count']
        ];



        if(request()->filterby=="day"){
            $dates = $elsticSearchController->getHours12();
        }
        if((count($dates) == 1 && request()->filterby =="")){

            $dates = $elsticSearchController->getHours12();
        }

        foreach ($dates as $key => $value){
            $dateRange[$value] = 0;
        }


        $intervels = [];
        $intervelsData = [];
        $member_charts_intervals_and_data = collect($member_stats['aggregations']['member_add']['buckets']);
        $totalDates = count($elsticSearchController->getDatesBetweenTwoDates(request()->start_date,request()->end_date));

        foreach ($member_charts_intervals_and_data as $key => $value){

            if(request()->filterby == "day" || ($totalDates == 1 && request()->filterby =="")){

                $dateRange[date("H:i A",strtotime($value["key_as_string"]))] = $value["doc_count"];
            }else{

                $dateRange[date("Y-m-d",strtotime($value["key_as_string"]))] = $value["doc_count"];
            }
        }



        foreach ($dateRange as $key => $value){
            if(request()->filterby=="year"){
                array_push($intervels,date('M Y', strtotime($key)));

            }else if(request()->filterby=="day"){
                array_push($intervels,$key);
            }else if((request()->filterby =="" && $totalDates == 1)){

                array_push($intervels,$key);
            }else{
                array_push($intervels,date('d M Y', strtotime($key)));
            }

            array_push($intervelsData,$value);
        }


        //$count = $redeemedVoucher->sum('doc_count') ?? 0;
        $member_stats_final["intervals"] = $intervels;
        $member_stats_final["data"] = $intervelsData;
        return $member_stats_final;
        //return ["status" => true, "count" => $count,"intervals"=>$intervels,"interval_data"=>$intervelsData];

    }




    /**
     * @param Request $request
     * @return array|string
     */
    public function memberTransactionGraph(Request $request)
    {
        try {
            $user = User::where('user_id', $request->input('persona_id'))->first();
            if ($user) {
                //$card_amount = MemberTransaction::where(['soldi_id' => $user->soldi_id, 'type' => 'card'])->sum(self::AMOUNT);
                $card_transaction_count = MemberTransaction::where(['soldi_id' => $user->soldi_id, 'type' => 'card'])->count();
                //$cash_amount = MemberTransaction::where(['soldi_id' => $user->soldi_id, 'type' => 'cash'])->sum(self::AMOUNT);
                $cash_transaction_count = MemberTransaction::where(['soldi_id' => $user->soldi_id, 'type' => 'cash'])->count();
                $card_p = $user->number_of_transactions > 0 ? round($card_transaction_count / $user->number_of_transactions * 100) : 0;
                $cash_p = $user->number_of_transactions > 0 ? round($cash_transaction_count / $user->number_of_transactions * 100) : 0;
                $res['card_P'] = $card_p;
                $res['cash_p'] = $cash_p;
                $res['cash_transactions'] = $cash_transaction_count;
                $res['card_transactions'] = $card_transaction_count;
                $res['basket_size'] = $user->avg_basket_size;
                $res['basket_value'] = $user->avg_basket_value;
                $res['transactions_total'] = $user->number_of_transactions;

                $graph_data = $this->graphData($request, $user);
                $res['data_intervals'] = $graph_data['data_intervals'];
                $res['data'] = $graph_data['data'];
                return [self::STATUS => true, 'data' => $res];

            }

        } catch (GuzzleException $e) {
            return [self::STATUS => false, 'message' => 'Server error' . $e->getMessage()];
        }//..... end of try-catch( )......//
    }//..... end of memberTransactionGraph() .....//

    /**
     * @param Request $request
     * @return array
     */
    public function memberTransactions(Request $request)
    {
        try {
            $user = User::where('user_id', $request->input('persona_id'))->first();
            if ($user) {
                $transactions = MemberTransaction::where('soldi_id', $user->soldi_id)->orderBy($request->sorting, $request->sortingOrder);
                if ($request->has('card_filter') && $request->card_filter) {
                    $transactions->where('type', 'like', '%' . $request->card_filter . '%');
                }
                if ($request->start_date && $request->end_date) {
                    $transactions->whereDate('date', '>=', $request->start_date)->whereDate('date', '<=', $request->end_date);
                }
                $total_records = $transactions->count();
                $transactions = $transactions->skip($request->offSet)->take($request->pageSize)->get();

                return ['status' => true, 'total' => $total_records, 'data' => $transactions];
            }

        } catch (GuzzleException $e) {
            return [self::STATUS => false, 'message' => 'Server error' . $e->getMessage()];
        }
        //..... end of try-catch( )......//
    }//..... end of memberTransactions() .....//


    public function graphData($request, $user)
    {
        $filter = $request->filter;
        switch ($filter) :
            case 'week':
                $dates = $this->generateDateRange(Carbon::now()->subDays(6), Carbon::now());
                break;
            case 'month':
                $dates = $this->generateDateRange(Carbon::now()->subDays(30), Carbon::now());
                break;
            case 'year':
                $dates = [];
                $years = [];
                $transaction_count_arr = [];
                for ($i = 0; $i <= 11; $i++) {
                    $date = date("Y-m-d", strtotime(date('Y-m-01') . " -$i months"));
                    $dates[] = [
                        'start_date' => $date,
                        'end_date' => $this->lastday(explode('-', $date)[1], explode('-', $date)[0])
                    ];
                    $years[] = Carbon::parse($date)->format('M') . ' ' . Carbon::parse($date)->year;
                    $transaction_count_arr[] = MemberTransaction::where('soldi_id', $user->soldi_id)->whereDate('date', '>=', $dates[$i]['start_date'])->whereDate('date', '<=', $dates[$i]['end_date'])->sum(self::AMOUNT);
                }
                return ['data_intervals' => $years, 'data' => $transaction_count_arr];
                break;
            default:
                break;
        endswitch;

        $transaction_count_arr = [];
        foreach ($dates as $date) {
            $transaction_count_arr[] = MemberTransaction::where('soldi_id', $user->soldi_id)->whereDate('date', '<=', $date)->whereDate('date', '>=', $date)->count();
        }
        return ['data_intervals' => $dates, 'data' => $transaction_count_arr];

    }

    private function generateDateRange(Carbon $start_date, Carbon $end_date)
    {
        $dates = [];

        for ($date = $start_date->copy(); $date->lte($end_date); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }

        return $dates;
    }

    function firstDay($month = '', $year = '')
    {
        if (empty($month)) {
            $month = date('m');
        }
        if (empty($year)) {
            $year = date('Y');
        }
        $result = strtotime("{$year}-{$month}-01");
        return date('Y-m-d', $result);
    }

    private function lastday($month = '', $year = '')
    {
        if (empty($month)) {
            $month = date('m');
        }
        if (empty($year)) {
            $year = date('Y');
        }
        $result = strtotime("{$year}-{$month}-01");
        $result = strtotime('-1 second', strtotime('+1 month', $result));
        return date('Y-m-d', $result);
    }

    public function saveTransaction(Request $request)
    {
        try {
            Log::channel('custom')->info('Transction data from soldi', ['data' => $request->all()]);
            $validator = Validator::make($request->all(), [
                'soldi_id' => 'required',
                'transaction_id' => 'required',
                'date' => 'required',
                self::AMOUNT => 'required',
                'type' => 'required',
                self::STATUS => 'required',
                'staff_name' => 'required',
                'tax' => 'required',
                'number_of_items' => 'required',
                'business_name' => 'required'

            ]);


            if ($validator->fails()) {
                return response($validator->errors()->all(), 400);
            }

            $soldi_user = User::where('soldi_id', $request->soldi_id)->first();
            if (!$soldi_user) {
                return response()->json(['User not exists'], 404);
            }
            $paymentController = (new PaymentController());
            $voucherCodes = $paymentController->getVouhcerCodes($request->all());
            Log::channel('custom')->info('saveTransaction()',['voucher_codes'],$voucherCodes);
            if (count($voucherCodes) > 0) {
                $paymentController->updateVoucherStatus($voucherCodes, $soldi_user->user_id);
            }
            $transaction = new MemberTransaction();
            $transaction->soldi_id = $request->soldi_id;
            $transaction->transaction_id = $request->prefix.'-'.$request->transaction_id.'/'.$request->invoice_no;
            $transaction->date = Carbon::createFromTimestamp($request->date)->toDateTimeString();
            $transaction->amount = $request->amount;
            $transaction->type = $request->type == 'cash' ? 'cash' : 'card';
            $transaction->tax = $request->tax;
            $transaction->discount = $request->discount;
            $transaction->number_of_items = $request->number_of_items;
            $transaction->status = $request->status;
            $transaction->business_name = $request->business_name;
            $transaction->staff_member = $request->staff_name;
            $transaction->user_id = User::where('soldi_id', $request->soldi_id)->first() ? User::where('soldi_id', $request->soldi_id)->first()->user_id : 0;
            $transaction->business_id = $request->business_id;
            $transaction->currency = $request->region == 'ireland' ? '€' : '£';
            $transaction->order_detail =  $request->order_items??json_encode([]);
            $transaction->save();

            $resp = (new ElasticSearchController())->updateUserVenueSubscription($soldi_user->user_id, $request->business_id,date('Y-m-d H:i:s'));
            Log::channel('custom')->info("user venue subscription $soldi_user->user_id, $request->business_id", ['RedemetionResponse' => $resp]);

            Log::channel('custom')->info('Transaction saved', ['data' => $request->all()]);
            if ($transaction) {
                $soldi_user = User::where('soldi_id', $request->soldi_id)->first();
                $resp = (new ElasticSearchController())->updateUserVenueSubscription($soldi_user->user_id, $request->business_id,date('Y-m-d H:i:s'));
                Log::channel('custom')->info("user venue subscription $soldi_user->user_id, $request->business_id", ['RedemetionResponse' => $resp]);


                if ($soldi_user) {
                    $soldi_user->number_of_transactions = MemberTransaction::where('soldi_id', $request->soldi_id)->count();
                    $soldi_user->basket_value = MemberTransaction::where('soldi_id', $request->soldi_id)->sum(self::AMOUNT);
                    $soldi_user->basket_size = MemberTransaction::where('soldi_id', $request->soldi_id)->sum('number_of_items');
                    $soldi_user->avg_basket_size = $soldi_user->number_of_transactions > 0 ? round($soldi_user->basket_size / $soldi_user->number_of_transactions, 2) : 0;
                    $soldi_user->avg_basket_value = $soldi_user->number_of_transactions > 0 ? round($soldi_user->basket_value / $soldi_user->number_of_transactions, 2) : 0;
                    $soldi_user->save();
                }
                $user = User::where('soldi_id', $request->soldi_id)->first();
                if($user->number_of_transactions ==1){
                     $this->checkReferralMission($user);
                }


                (new ElasticSearchController())->updateElasticsearchData('transaction_data', $soldi_user);
                return response()->json(['Transaction saved successfully']);
            } else {
                return response()->json(['Something went wrong'], 500);
            }

        } catch (\Exception $e) {
            Log::channel('custom')->info('Transction error', ['data' => $e->getTrace()]);
            return response()->json([$e->getMessage()], 500);
        }

    }

    /**
     * @param Request $request
     * @return array
     */
    public function allPayments(Request $request)
    {
        try {
            $kill_final_ids = [];
            $payment_query = UserTempPayment::query();
            if($request->has('search') and !empty($request->search)) {
                $search = $request->search;
                if(is_numeric($search)) {
                    if(strlen($search) >= 5) {
                        $kill_bill_ids = User::where('client_customer_id', 'like', '%' . $search . '%')
                            ->select('kill_bill_id','kilbill_ire_id')->get()->toArray();
                        foreach ($kill_bill_ids as $kill_bill_id){
                            if(!empty($kill_bill_id['kill_bill_id']))
                                $kill_final_ids[] = $kill_bill_id['kill_bill_id'];
                            if(!empty($kill_bill_id['kilbill_ire_id']))
                                $kill_final_ids[] = $kill_bill_id['kilbill_ire_id'];
                        }
                        $payment_query->whereIn('user_id',$kill_final_ids);
                    } else {
                        $str = '{"amount_due":"'.$search.'"}';
                        $str = "'". $str. "'";
                        $payment_query->whereRaw('json_contains(finale_payment, '.$str.')');
                    }

                }
                else {
                    $kill_bill_ids = User::where('email', 'like', '%' . $search . '%')
                        ->orWhere('user_first_name', 'like', '%' . $search . '%')
                        ->orWhere('user_family_name', 'like', '%' . $search . '%')
                        ->orWhere('client_customer_id', 'like', '%' . $search . '%')
                        ->select('kill_bill_id','kilbill_ire_id')->get()->toArray();
                    foreach ($kill_bill_ids as $kill_bill_id){
                        if(!empty($kill_bill_id['kill_bill_id']))
                            $kill_final_ids[] = $kill_bill_id['kill_bill_id'];
                        if(!empty($kill_bill_id['kilbill_ire_id']))
                            $kill_final_ids[] = $kill_bill_id['kilbill_ire_id'];
                    }
                    $payment_query->whereIn('user_id',$kill_final_ids);
                }
            }
            if ($request->start_date && $request->end_date) {
                $payment_query->whereDate('created_at', '>=', $request->start_date)->whereDate('created_at', '<=', $request->end_date);
            }
            $total_query = $payment_query;
            $total_records = $total_query->whereHas('uk_user')->orWhereHas('ire_user')->count();
            $payments = $payment_query->whereHas('uk_user')->orWhereHas('ire_user')->skip($request->offSet)->take($request->pageSize)->orderBy('created_at', 'DESC')->get();
            $updated_result = [];
            $i = 0;
            foreach ($payments as $payment) {
                $user = User::where('kill_bill_id',$payment->user_id)->orWhere('kilbill_ire_id',$payment->user_id)->first();
                if($user) {
                    $temp['user_name'] = $user->user_first_name.' '.$user->user_family_name;
                    $order = json_decode($payment->finale_payment);
                    $temp['ord_amount'] = $order->amount_due;
                    $temp['items_count'] = count(json_decode($order->order_items));
                    $temp['ord_time'] = date('d/m/Y H:i:s',strtotime($payment->created_at));
                    $temp['user_email'] = $user->email;
                    $temp['client_id'] = $user->client_customer_id;
                    $temp['ord_items'] = json_decode($order->order_items);
                    $temp['payment_id'] = $payment->payment_id;
                    $temp['country'] = $order->region == 'uk' ? 'uk': 'ireland';
                    $temp['items_discount'] = $order->items_discount;
                    $temp['active'] = false;
                    $temp['id'] = $i;
                    $temp['user_id'] = $user->user_id;
                    $temp['kill'] = $payment->user_id;

                    //get payment detail from kill bill
                    $request->headers->set('Country', $temp['country']);
                    $killbill_payment_status = (new PaymentController())->paymentDetailByPaymentId($payment->payment_id);
                    if($killbill_payment_status == 'SUCCESS') {
                        $temp['payment_status'] = 'complete';
                    } else {
                        $temp['payment_status'] = 'pending';
                    }
                    $updated_result[] = $temp;
                    $i++;
                }
            }
            return ['status' => true, 'total' => $total_records, 'data' => $updated_result];
        } catch (\Exception $e) {
            return ['status' => false, 'message' => 'Server error' . $e->getMessage()];
        }
        //..... end of try-catch( )......//
    }//..... end of allPayments() .....//

    private function checkReferralMission($user)
    {
        if(!$user->referal_by ?? !$user['referal_by']){
            return ['status' => false];
        }else{
            $userReffered = User::where('referral_code',$user->referal_by ?? $user['referal_by'])->first();
            $userReffered->referalType = 'refered';
            (new GamificationController())->userRefferalAssignReward($userReffered);
        }

    }


}//..... end of class.



