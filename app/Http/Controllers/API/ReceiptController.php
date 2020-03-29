<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\ReceiptResource;
use App\Http\Resources\ReceiptsResource;
use App\Models\CharityTier;
use App\Models\Receipt;
use App\Models\ShopCategory;
use App\Models\ShopCategoryDetail;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Receipt $receipt
     * @return ReceiptsResource|array
     */
    public function index(Receipt $receipt)
    {
        if (!request()->company_id)
            return ['status' => false, 'message' => 'Please provide company id.'];

        if (request()->has('search') and request()->search)
            $receipt = $receipt->where('description', 'like', "%" . request('search') . "%");

        if (request()->has('limit') and request()->limit >= 0)
            $receipt = $receipt->take(request()->limit);

        if (request()->has('page') and request()->page and request()->page >= 0)
            $receipt = $receipt->skip(request()->page);

        if (request()->has('venue_id') and request()->venue_id)
            $receipt = $receipt->where('venue_id', request('venue_id'));

        if (request()->has('business_id') and request()->business_id)
            $receipt = $receipt->where('business_id', request('business_id'));

        return new ReceiptsResource($receipt->where([
            'company_id' => request('company_id'),
            'user_id' => request()->user()->user_id
        ])->get());
    }//..... end of index() ......//

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_id' => 'required',
            'company_id' => 'required',
            'user_id' => 'required',
            /*'description'    => 'required',
            'status'         => 'required',
            'file'           => 'required|filled|file|mimes:jpeg,png,jpg,pdf|max:2048',*/
        ]);

        if ($validator->fails()) {
            return ['status' => false, 'message' => implode(' ', $validator->errors()->all())];
        }//..... end if() .....//

        $file = "";
        if (request()->hasFile('file'))
            $file = (new FilesController)->uploadFile();

        $status = Receipt::create(array_merge(
            $request->only(['business_id', 'venue_id', 'company_id', 'description', 'status', 'price', 'business_name', 'title']),
            ['receipt' => $file, 'user_id' => request()->user()->user_id, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
        ));

        return ['status' => $status ? true : false, 'message' => $status ? 'Receipt added successfully.'
            : 'Error occurred, while creating receipt.'];
    }//..... end of store() .....//

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Receipt $receipt
     * @return array
     */
    public function show($id)
    {
        return ['status' => true, 'data' => new ReceiptResource(Receipt::where(['id' => $id, 'user_id' => request()->user()->user_id])->first())];
    }//..... end of show() .....//

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param $id
     * @return array
     */
    public function update(Request $request)
    {
        if (!$request->id)
            return ['status' => false, 'message' => 'Please provide all the required fields.'];

        $receipt = Receipt::where(['id' => $request->id, 'user_id' => request()->user()->user_id])->first();

        if (!$receipt)
            return ['status' => false, 'message' => 'Could not find any receipt against provided information.'];

        if ($request->has('description') and $request->description)
            $receipt->description = $request->description;

        if ($request->has('venue_id') and $request->venue_id)
            $receipt->venue_id = $request->venue_id;

        /*  if ($request->has('user_id') and $request->user_id)
              $receipt->user_id = $request->user_id;*/

        if ($request->has('company_id') and $request->company_id)
            $receipt->company_id = $request->company_id;

        if ($request->has('business_id') and $request->business_id)
            $receipt->business_id = $request->business_id;

        if ($request->has('business_name') and $request->business_name)
            $receipt->business_name = $request->business_name;

        if ($request->has('status') and $request->status >= 0)
            $receipt->status = $request->status;

        if ($request->has('price') and $request->price)
            $receipt->price = $request->price;

        if ($request->has('receipt_number') and $request->receipt_number)
            $receipt->receipt_number = $request->receipt_number;


        if ($request->has('title') and $request->title)
            $receipt->title = $request->title;

        if ($request->hasFile('file') AND !Validator::make($request->all(),
                ['file' => 'required|filled|file|mimes:jpeg,png,jpg,pdf|max:2048'])->fails()) {
            $receipt->receipt = (new FilesController)->uploadFile();
        }//..... end if() .....//
        $receipt->updated_at = Carbon::now();
        $status = $receipt->save() ? true : false;

        return ['status' => $status, 'message' => $status ? 'Receipt updated successfully.' : 'Error occurred, while updating.'];
    }//..... end of update() .....//

    /**
     * Remove the specified resource from storage.
     *
     * @return array
     */
    public function destroy($id)
    {
        $status = Receipt::where(['id' => $id, 'user_id' => request()->user()->user_id])->delete();
        return ['status' => !!$status, 'message' => $status ? 'Receipt deleted successfully.' : 'Error occurred while deleting receipt.'];
    }//...... end of destroy() .....//

    /**
     * @param Request $request
     * @return array
     */
    public function getUserReciept(Request $request)
    {

        $totalReciepts = Receipt::whereUserId($request->user_id)->groupBy('business_id')->get(['business_id', 'business_name', 'venue_id', 'company_id']);
        if ($request->has('venue_id') && $request->venue_id) {
            $getvenueCategory = DB::table('venue_category')->where('venue_id', $request->venue_id)->first(['category_id']);
            $storeInfo = ShopCategory::where('id', $getvenueCategory->category_id)->first(['category_shops']);
            $storeInfo = collect(json_decode($storeInfo->category_shops ?? $storeInfo['category_shops']));
            $storeData = $storeInfo->map(function ($item) {
                return ['business_id' => $item->business_id, 'business_name' => $item->business_name];
            });

        } else {
            $storeInfo = (new VenueController())->getSoldiBusiness();
            $storeInfo = collect($storeInfo['data']);
            $storeData = $storeInfo->map(function ($item) {
                return ['business_id' => $item->business_id, 'business_name' => $item->business_name];
            });
        }


        foreach ($totalReciepts as $key => $value) {
            $value->number_of_receipts = $this->getRecieptsCount($value->business_id, $request->user_id);
            $value->images = $this->getBusinessImages($storeInfo, $value->business_id);
            $value->user_receipts = $this->getUserRecieptData($value->business_id, $request->user_id);
        }
        return ['status' => true, 'message' => 'Data Found', 'store_reciepts' => $totalReciepts ?? [], 'stores' => $storeData ?? []];
    }//---- End of getUserReciept() ----//

    /**
     * @param $buiness_id
     * @param $user_id
     * @return mixed
     */
    private function getRecieptsCount($buiness_id, $user_id)
    {
        return Receipt::whereUserIdAndBusinessId($user_id, $buiness_id)->count();
    }//---- End of getRecieptsCount() ----//

    /**
     * @param $collections
     * @param $business_id
     * @return array
     */
    private function getBusinessImages($collections, $business_id)
    {
        $businessData = $collections->where("business_id", $business_id);
        if ($businessData) {
            foreach ($businessData as $key => $value)
                return ['business_image' => $value->business_image ?? [], 'bg_images' => $value->bg_images ?? ''];
        }

        return (object)[];
    }


    /**
     * @param $business_id
     * @param $user_id
     * @return mixed
     */
    private function getUserRecieptData($business_id, $user_id)
    {
        return Receipt::whereUserIdAndBusinessId($user_id, $business_id)->get();
    }//---- End of getUserRecieptData() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function getAllTiers(Request $request)
    {
        return ['status' => true, 'data' => CharityTier::get() ?? []];
    }//---- End of getAllTiers() ----//
}//..... end of class.
