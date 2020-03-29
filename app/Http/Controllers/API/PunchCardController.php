<?php

namespace App\Http\Controllers\API;

use App\Models\PunchCard;
use App\Utility\ElasticsearchUtility;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PunchCardController extends Controller
{
    /**
     * @param FilesController $filesController
     * @return array
     * Save Punch Card data.
     */
    public function savePunchCard(FilesController $filesController)
    {
        if (!request()->business_id) {
            request()->merge(['business_id' => 0]);
        }
        $image = 'uploads/' . time() * rand() . ".png";

        $punchCard = PunchCard::updateOrCreate(['id' => request()->editId], $filesController->uploadBase64Image(request()->image, $image)
            ? array_merge(request()->except(['editId', 'image']), ['image' => $image])
            : request()->except(['editId', 'image']));


        if (request()->editId)
            $this->updatePunchCardVoucher($punchCard);//Update Punchcard voucher

        return ['status' => true, 'message' => 'Punch card saved successfully.'];
    }//..... end of savePunchCard() ......//

    /**
     * @param Request $request
     * @return array
     */
    public function listPunchCards(Request $request)
    {
        $punchCard = PunchCard::orderBy($request->orderBy, $request->orderType);

        if ($request->has('search') && $request->search)
            $punchCard->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });

        return [
            'status' => true,
            'total' => $punchCard->count(),
            'data' => $punchCard->skip($request->offset)->take($request->limit)->get()
        ];
    }//..... end of listPunchCards() ......//

    /**
     * @return array
     */
    public function deletePunchCard()
    {
        $punchcard = PunchCard::find(request()->id);

        if ($punchcard) {
            $response = (new ElasticSearchController)->deletePunchCard(request()->id);
            if ($response['status'] === true)
                $punchcard->delete();
            return $response;
        } else
            return ['status' => false, 'message' => 'Punch card could not be deleted.'];
    }//..... end of deletePunchCard() .....//

    /**
     * @param Request $request
     * @return array
     */
    public function getPunchCards(Request $request)
    {
        $punchCard = PunchCard::where("venue_id", $request->venue_id)->get(["id", "name"]);

        return [
            'status' => true,
            'data' => $punchCard
        ];
    }//----- End of getPunchCards() ------//

    /**
     * @return array
     */
    public function getAllStampCard($company_id = '')
    {
        $punchCard = PunchCard::where('company_id', $company_id)->get(["id", "name as label"]);
        foreach ($punchCard as $value)
            $value['value'] = false;

        return ['status' => true, 'data' => $punchCard];
    }//------ End of getAllStampCard() ------//

    private function updatePunchCardVoucher($all)
    {

        $data = [
            'voucher_amount'        => $all->voucher_amount??0,
            "voucher_name"          => '',
            'voucher_type'          => $all->discount_type,
            'promotion_text'        => $all->description,
            'no_of_uses'            => '1',
            'uses_remaining'        => 1,
            'voucher_start_date'    => date('d-m-Y H:i', strtotime('-1 days')),
            'voucher_end_date'      => date('d-m-Y H:i', strtotime('+6 months')),
            'redemption_interval'   => $all->redemption_interval ?? 0,
            'basket_level'          => (bool)$all->basket_level,
            'voucher_avail_type'    => $all->voucher_avail_type,
            'voucher_status'        => 1,
            "businesses"            => $all->business,
            'dateadded'             => strtotime(date('Y-m-d H:i:s')),
            'custom_doc_type'       => config('constant.user_integrated_voucher'),
            'voucher_avial_data'    => json_decode($all->punch_card_data,true) ?? [],
            'campaign_id'           => 0,
            'attachment_url'        =>  url('/'.$all->image),
            "voucher_redeem_date"   => 0,
            "max_redemption"        => 0,
            "pos_ibs"               =>  $all->pos_ibs,
            "from_punch_card"       => $all->id,
            "venue_id"              =>"262751"
        ];


        $query = [
            "query" => ["bool" => [
                "must" => [["exists" => ["field" => "from_punch_card"]],
                    ["match" => ["custom_doc_type" => "user_integrated_voucher"]],
                    ["match" => ["from_punch_card" => $all->id]],
                    ["range"=> ["uses_remaining"=>["gt" => 0]]]
                    ]
                ]
            ]
        ];
        $comapignData = (new ElasticsearchUtility())->getAllData($query,config('constant.ES_INDEX_BASENAME'));//ElasticsearchUtility::getSource(config('constant.ES_INDEX_BASENAME'),$query);
        if(count($comapignData)>0) {
            return ElasticsearchUtility::bulkUserDataUpdateVoucher($comapignData, $data);
        }else{
            return ['status'=>true];
        }
    }
}
