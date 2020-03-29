<?php

namespace App\Http\Controllers\API;

use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class HelpController extends Controller
{
    /*sonar constants*/
    const FAQ_CAT_ID                 = 'faq_category_id';
    const DESCRIPTION                 = 'description';
    const MESSAGE                 = 'message';
    const USER_MANUAL                 = 'user_manual';
    const TERMS_AND_CONDITIONS                 = 'term_and_conditions';
    const TITLE                 = 'title';
    const ORDER_ID                 = 'order_id';
    const STATUS                 = 'status';


    /**
     * @param Request $request
     * @return array
     */
    public function faqs(Request $request)
    {
        $faq = DB::table('pages')->select('*')->where('type', '=', 'faqs')->where(self::FAQ_CAT_ID, $request->faq_category_id);
        if ($request->search != '') {
            $faq = $faq->where(self::TITLE, 'like', '%' . $request->search . '%');
        }
        $data = $faq->orderBy(self::ORDER_ID, "asc")->get();
        foreach ($data as $value){
            $value->descriptions = $value->description;
        }
        return [self::STATUS => true, 'faq_page' => $data];
    }//---- End of faqs() ----//

    public function saveUpdatedFaqs(Request $request)
    {
        DB::table('pages')->where([self::FAQ_CAT_ID => $request->cat_id, 'type' => 'faqs'])->delete();
        $update_faqs = $request->updated_faqs;
        $iterator = 0;
        foreach ($update_faqs as $faq) {
            DB::table('pages')->insert([
                self::TITLE => $faq[self::TITLE],
                self::DESCRIPTION => $faq[self::DESCRIPTION],
                'type' => $faq['type'],
                self::FAQ_CAT_ID => $request->cat_id,
                self::ORDER_ID => $iterator
            ]);
            $iterator++;
        }
        return [self::STATUS => true, 'updated_faqs' => DB::table('pages')->select('*')->where('type', '=', 'faqs')->where(self::FAQ_CAT_ID, $request->faq_category_id)->orderBy(self::ORDER_ID, 'asc')->get()];
    }

    public function saveFaqs()
    {

        if (request()->is_edit == 0) {
            $max_order_id = DB::table('pages')->where([self::FAQ_CAT_ID => request()->faq_category_id, 'type' => 'faqs'])->max(self::ORDER_ID);
            $max_order_id = isset($max_order_id) ? $max_order_id + 1 : 0;
            DB::table('pages')->insert([
                self::TITLE => request()->title,
                self::DESCRIPTION => request()->description,
                'type' => request()->type,
                self::FAQ_CAT_ID => request()->faq_category_id,
                self::ORDER_ID => $max_order_id
            ]);
        } else {
            DB::table('pages')->where("id", request()->is_edit)->update(request()->only(self::TITLE, self::DESCRIPTION, "type", self::FAQ_CAT_ID));
        }
        return [self::STATUS => true, self::MESSAGE => "Information saved successfully"];
    }

    public function userManual(Request $request)
    {
        $data['userManual_page'] = DB::table('pages')->select('*')->where('type', '=', self::USER_MANUAL)->first();
        return $data;
    }

    public function getContacts(Request $request)
    {
        $data = DB::table('pages')->where("type", $request->type)->first();
        if (!$data) {
            $data = (object)[self::TITLE => $request->type, "id" => 0, self::DESCRIPTION => ""];
        }

        return [self::STATUS => true, "data" => $data];
    }

    public function helpDataForMobile(Request $request)
    {
        $type = $request->has("type") ? $request->type : "faqs";
        $data = DB::table('pages')->where("type", $type);
        if ($type == self::TERMS_AND_CONDITIONS) {
            $country = request()->header('Country');
            $data = $data->where("tags", "like", "%" . $country . "%");
        }

        return [self::STATUS => true, "type" => $type, "data" => $data->get()];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function saveAboutLoyalty(Request $request)
    {
        Setting::updateOrCreate(['id' => request()->editId], request()->except(['editId']));
        return [self::STATUS => true, self::MESSAGE => 'Loyalty Settings is added successfully'];
    }//---- End of saveAboutLoyalty() ----//

    /**
     * @param Request $request
     * @return array
     */
    public function getAboutLoyalty(Request $request)
    {
        $aboutLoyalty = Setting::where(['type' => 'about_loyalty']);

        return [
            self::STATUS => true,
            'total' => $aboutLoyalty->count(),
            'data' => $aboutLoyalty->skip($request->offset)->take($request->limit)->get()
        ];
    }//---- End of getAboutLoyalty() ----//

    /**
     * @return array
     */
    public function getListAboutLoyalty()
    {
        $aboutLoyalty = Setting::where(['type' => 'about_loyalty'])->get(['field2 as voucher', 'field3 as stampcard']);

        if ($aboutLoyalty->isNotEmpty()) {
            return [self::STATUS => true, 'data' => $aboutLoyalty[0], self::MESSAGE => 'Loyalty Settings Found'];
        }
        else {
            return [self::STATUS => false, 'data' => [], self::MESSAGE => 'Loyalty Settings Not Found'];
        }
    }//---- End of getListAboutLoyalty() ----//

    public function uploadUserGuide(FilesController $filesController)
    {
        DB::table('pages')->where("type", self::USER_MANUAL)->delete();
        $data = [
            self::TITLE => "User Guide",
            "type" => self::USER_MANUAL,
            self::DESCRIPTION => "User Guide"
        ];
        $res = Storage::disk('local')->put('uploads', request()->file('file'));
        $base_url = URL::to('/') . "/" . $res;
        $data['link'] = $base_url;
        DB::table('pages')->insert($data);
        return [self::STATUS => true, self::MESSAGE => 'User Guide Uploaded Successfully'];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function deleteFaqs(Request $request)
    {
        return (DB::table('pages')->where("id", $request->faq_id)->delete()) ? [self::STATUS => true, self::MESSAGE => 'Successfully deleted'] : [self::STATUS => false, self::MESSAGE => 'Error Occurred while delete faq'];
    }//---- End of deleteFaqs() ----//


    public function faqsCategories(Request $request)
    {
        $faq = DB::table('faq_categories')->select('*');
        if ($request->nameSearch != '') {
            $faq = $faq->where('name', 'like', '%' . $request->nameSearch . '%');
        }
        return [self::STATUS => true, 'data' => $faq->orderBy("id", "desc")->get()];
    }//---- End of faqs() ----//

    public function saveFaqCategories(Request $request)
    {
        if ($request->is_edit == 0) {
            DB::table("faq_categories")->insert(["name" => $request->name]);
        }
        else {
            DB::table("faq_categories")->where(["id" => $request->is_edit, "is_permanent" => 0])->update(["name" => $request->name]);
        }

        return [self::STATUS => true, self::MESSAGE => "Faq Saved successfully"];
    }

    public function deleteFaqsCategories($id)
    {
        DB::table('pages')->where([self::FAQ_CAT_ID => $id, "type" => "faqs"])->delete();
        return (DB::table('faq_categories')->where(["id" => $id, "is_permanent" => 0])->delete()) ? [self::STATUS => true, self::MESSAGE => 'Successfully deleted'] : [self::STATUS => false, self::MESSAGE => 'Error Occurred while delete faq category'];
    }//---- End of deleteFaqs() ----//

    public function listFaqs()
    {
        $category = DB::table("faq_categories")->get()->each(function ($value) {
            $faqs =DB::table('pages')->where([self::FAQ_CAT_ID => $value->id, "type" => "faqs"])->orderBy(self::ORDER_ID, 'asc')->get();
            foreach ($faqs as $val) {
                $val->descriptions = $val->description;
            }

            $value->faqs =$faqs ;
        });
        return [self::STATUS => true, "data" => $category];
    }

    public function termAndCondition()
    {

        $faq = DB::table('pages')->where("type", "=", self::TERMS_AND_CONDITIONS)->first();

        return view("term-and-conditions", ["faq" => $faq]);
    }

    public function privacyPolicy()
    {
        $faq = DB::table('pages')->where("type", "=", "privacy_policy")->first();
        return view("privacy-policy", ["faq" => $faq]);
    }

    public function termAndConditions(Request $request)
    {
        $termAndCondtions = DB::table('pages')->where("type", "=", self::TERMS_AND_CONDITIONS);

        return [
            self::STATUS => true,
            'total' => $termAndCondtions->count(),
            'data' => $termAndCondtions->skip($request->offset)->take($request->limit)->get()
        ];
    }//---- End of getAboutLoyalty() ----//

    public function saveTermAndConditions(Request $request)
    {
        $data = [
            "tags" => implode(", ", array_column(request()->tags, 'text')),
            "type" => self::TERMS_AND_CONDITIONS,
            self::TITLE => "Terms and condtions",
            self::DESCRIPTION => $request->description,
        ];
        Page::updateOrCreate(['id' => request()->editId], $data);
        return [self::STATUS => true, self::MESSAGE => 'Term and condition is added successfully'];
    }
}
