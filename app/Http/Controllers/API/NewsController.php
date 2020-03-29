<?php

namespace App\Http\Controllers\API;

use App\Models\News;
use App\Models\NewsCategories;
use App\Models\QuickBoard;
use App\Models\Venue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use File;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class NewsController extends Controller
{

    public function getNewsCategories(Request $request)
    {
        $search = $request->nameSearch;
        $res = NewsCategories::select('*')->where('company_id', $request->company_id)->when($search, function ($query, $search) {
            return $query->where('news_category_name', 'like', '%' . $search . '%');
        });
        $data['data'] = $res->orderby('news_category_id', 'desc')->skip($request->offset)->take($request->limit)->get();
        $data['total'] = $res->count();
        $data['status'] = true;
        return $data;
    }//.....  end of function getNewsCategories  .....//

    public function saveNewsCategories(Request $request)
    {
        NewsCategories::updateOrCreate(
            ['news_category_id' => $request->is_edit],
            ['news_category_name' => $request->category_name, "company_id" => $request->company_id, "user_id" => 1, "news_category_image" => "abc.jpg"]
        );
        return ["status" => true, "message" => "News Category Created Successfully"];
    }//.....  end of function saveNewsCategories  .....//

    public function deleteNewsCategories($id)
    {
        NewsCategories::where(["news_category_id" => $id])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    }//......  end of deleteNewsCategories  .....//


    public function getVenueNews(Request $request)
    {
        $result = News::orderBy('id', 'DESC')->leftJoin("news_categories", "news_categories.news_category_id", "=", "news.news_category_id")
            ->where(["news.company_id" => $request->company_id])
            ->where(function ($query) use ($request) {
                $query->where(["news.venue_id" => $request->venue_id]);
            })
            ->where(function ($query) use ($request) {
                $query->whereDate("news.end_date", ">=", date("Y-m-d"))
                    ->orWhereNull('news.end_date');
            });
        /** query filtration will take place here */
        if ($request->nameSearch != "")
            $result = $result->where('news.news_subject', 'like', '%' . $request->nameSearch . '%');
        if ($request->newsCategoryFilter != 0)
            $result = $result->where(["news.news_category_id" => $request->newsCategoryFilter]);
        /** end of query filtration */
        $data['data'] = $result->skip($request->offset)->take($request->limit)->get();
        $data['total'] = $result->count();
        foreach ($data['data'] as $key => $value) {
            $value->title = (strlen($value->news_subject) > 30) ? substr($value->news_subject, 0, 30) . "...." : $value->news_subject;
            $value->is_global = $value->is_global ? true : false;
            $value->isGlobal = $value->is_global ? "Global News" : "";
            if ($value->is_featured == 1)
                $value->is_featured = true;
            if (!$value->start_date) {
                $value->start_date = date("Y-m-d H:i");
                $value->end_date = date("Y-m-d H:i");
            }
            if ($value->venue_id === 0)
                $value->news_category_name = ($value->news_category_name) . "/<b style='font-weight: bold;'>Global News</b>";
            if ($value->news_category_name === null)
                $value->news_category_name = "Community News";
            $value->selected_venues = DB::table("venue_resources")->select(["venue_id", "resource_id", "type"])->whereType("news")->where("venue_resources.resource_id", $value->id)->get();
            $value->selected_board_news = DB::table("quick_board_news")->select(["board_id", "resource_id", "board_title", "board_level"])
                ->leftJoin("quick_boards", "quick_boards.id", "=", "quick_board_news.board_id")->where("quick_board_news.type", "news")->where("quick_board_news.resource_id", $value->id)->get();
            foreach ($value->selected_board_news as $key2 => $value2) {
                $value->listBoards = $value->listBoards . "<strong class='news_owner'>" . $value2->board_title . " (" . $this->getLevelName($value2->board_level) . ")" . "</strong>";
            }
        }/* end of foreach 1 */
        $newsCategory = NewsCategories::orderBy('news_category_id', 'DESC')->where(["company_id" => $request->company_id])->get();
        $data['status'] = true;
        $data['newsCat'] = $newsCategory;
        return $data;
    }//.....  end of getVenueNews   .....//

    /**
     * @param Request $request
     * @param FilesController $filesController
     * @return array
     * Save News.
     */
    public function saveVenueNews(Request $request, FilesController $filesController)
    {
        if ($request->is_featured) {
            News::where(["is_featured" => 1, "venue_id" => $request->venue_id])->update(["is_featured" => 0]);
        }
        $is_global = $request->is_global ? 1 : 0;

        $news_data = [
            "news_category_id" => $request->category_id,
            "news_subject" => $request->news_title,
            "news_desc" => $request->news_text,
            "news_web_detail" => $request->news_intro,
            "news_type" => $request->selected_news_type,
            "video_link" => $request->selected_news_type == "Videos" ? $request->video_link : NULL,
            "start_date" => ($request->selected_news_type == "News" || $request->selected_news_type == "Events") ? $request->startDate : NULL,
            "end_date" => ($request->selected_news_type == "News" || $request->selected_news_type == "Events") ? $request->endDate : NULL,
            "venue_id" => $request->venue_id,
            "company_id" => $request->company_id,
            "is_featured" => $request->is_featured ? 1 : 0,
            "is_global" => $is_global
        ];

        $image = time() * rand() . ".png";

        if ($filesController->uploadBase64Image(request()->image, 'news/' . $image))
            $news_data['news_image'] = $image;
        else if ($request->is_edit == 0)
            $news_data['news_image'] = "default.jpg";

        if ($request->is_edit == 0) {
            $news = News::create($news_data);
            if ($is_global == 0) {
                if ($request->list_selected_board)
                    foreach ($request->list_selected_board as $value)
                        DB::table("quick_board_news")->insert(["resource_id" => $news->id, "board_id" => $value, "type" => "news"]);
            }

            return ['status' => true, "message" => "News Added Successfully"];
        } else {
            if ($request->selected_news_type == "News" || $request->selected_news_type == "Events")
                $news_data['venue_id'] = ($request->is_global === "true") ? 0 : $request->venue_id;

            News::where(["id" => $request->is_edit])->update($news_data);

            //........  updated selected quickboard against news
            DB::table("quick_board_news")->where(["resource_id" => $request->is_edit, "type" => "news"])->delete();
            if ($is_global == 0) {
                if ($request->list_selected_board)
                    foreach ($request->list_selected_board as $value)
                        DB::table("quick_board_news")->insert(["resource_id" => $request->is_edit, "board_id" => $value, "type" => "news"]);
            }
            //...... end of operation on quick_boards_news table  .....//

            //........  updated selected quickboard against news
            DB::table("venue_resources")->where(["resource_id" => $request->is_edit, "type" => "news"])->delete();
            if ($is_global == 0) {
                if ($request->list_selected_venues)
                    foreach ($request->list_selected_venues as $value)
                        DB::table("venue_resources")->insert(["venue_id" => $value, "resource_id" => $request->is_edit, "type" => "news"]);
            }
            //...... end of operation on quick_boards_news table  .....//


            return ['status' => true, "message" => "News updated Successfully"];
        }//..... end of if-else() .....//
    }//..... end of saveVenueNews() .....//


    public function deleteNews($id)
    {
        News::where(["id" => $id])->delete();
        DB::table("quick_board_news")->where(["resource_id" => $id, "type" => "news"])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    }//..... end of deleteNews .....//

    public function getVenueVideos(Request $request)
    {
        if ($request->has("quickBoardFilter") && $request->quickBoardFilter != "") {
            $data['data'] = QuickBoard::orderBy("board_level", "ASC")
                ->where('board_level', '=', $request->quickBoardFilter)->orderBy('display_order', 'ASC')
                ->leftJoin("quick_board_level", "quick_board_level.level_order", "=", "quick_boards.board_level")
                ->get(["quick_boards.*", "quick_board_level.level_name", "quick_board_level.level_order"]);
        } else {
            $data['data'] = QuickBoard::orderBy("board_level", "ASC")->orderBy('display_order', 'ASC')
                ->leftJoin("quick_board_level", "quick_board_level.level_order", "=", "quick_boards.board_level")
                ->get(["quick_boards.*", "quick_board_level.level_name", "quick_board_level.level_order"]);
        }
        $data['total'] = 1000;
        $data["qb_types"] = Config::get('constant.QUICK_BOARD_TYPES');
        $data["qb_levels"] = DB::table("quick_board_level")->get();
        $data['status'] = true;
        return $data;
    }//..... end of function getVenueVideos .....//

    public function saveVenueVideos(Request $request, FilesController $filesController)
    {
        $dataToSave = [
            'board_title' => $request->board_title,
            "color1" => ($request->color1 != "") ? $request->color1 : "#ffffff",
            "color2" => ($request->color2 != "") ? $request->color2 : "#ffffff",
            "color3" => ($request->color3 != "") ? $request->color3 : "#ffffff",
            'display_order' => $request->display_order,
            'board_level' => $request->qb_level_id,
            'qb_type' => $request->selected_qb_type,
        ];

        $image = time() * rand(1, 8) . ".png";

        if ($filesController->uploadBase64Image(request()->background_image, 'news/' . $image))
            $dataToSave['background_image'] = $image;
        else if ($request->is_edit == 0)
            $dataToSave['background_image'] = "default.jpg";

        $image = time() * rand(1, 8) . ".png";

        if ($filesController->uploadBase64Image(request()->icon_image, 'news/' . $image))
            $dataToSave['icon_image'] = $image;
        else if ($request->is_edit == 0)
            $dataToSave['icon_image'] = "default.jpg";

        if ($request->is_edit == 0) {
            $qb_id = (QuickBoard::create($dataToSave))->id;
        } else {
            QuickBoard::where("id", $request->is_edit)->update($dataToSave);
        }
        $data['message'] = "Board Updated Successfully";
        $data['status'] = "true";
        return $data;
    }//..... end of function saveVenueVideos .....//


    public function deleteVenues($id)
    {
        QuickBoard::where(["id" => $id])->delete();
        DB::table('quickboard_venue_shop')->where(["qb_id" => $id])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    } //..... end of function deleteVenues  .....//

    public function OrderReplacement($display_order, $selectedBoardType, $bypassDisplayOrder = false)
    {
        $boards = QuickBoard::whereBoardType($selectedBoardType);
        if (!$bypassDisplayOrder)
            $boards = $boards->where('display_order', '>=', $display_order);
        $boards->orderBy('display_order')->get()->each(function ($quickboard, $key) use ($display_order, $bypassDisplayOrder) {
            if ($bypassDisplayOrder)
                $quickboard->display_order = $key + 1;
            else
                $quickboard->display_order = $key + 1 + $display_order;

            $quickboard->save();
        });
    }//..... end of function OrderReplacement  .....//


    public function selectedVenues($id)
    {
        return DB::table("quickboard_venue_shop")->select("venue_id")->where(["qb_id" => $id])->get();
    }//..... end of function selectedVenues .....//

    public function selectedVenueShops($id)
    {
        $res = DB::table("quickboard_venue_shop")->select("shop_id as id", "shop_name as label")->where("qb_id", $id)
            ->whereNotNull("shop_id")
            ->get();
        if ($res)
            foreach ($res as $key => $value)
                $value->value = true;
        return $res;

    }//...... end of function selectedVenueShops .....//

    public function getVenueStore($venue_id, $selected_shops)
    {
        $board = Venue::select(["venue_shops"])->where("venue_id", $venue_id)->first();
        $shops = json_decode($board->venue_shops);
        $list = [];
        foreach ($shops as $key => $value) {
            $a = ["id" => (int)$value->business_id, "label" => $value->business_name, "value" => false];
            array_push($list, $a);
        }/* end of foreach */

        /* change the value to true if  shop is selected for that venue */
        foreach ($list as $key => $value) {
            foreach ($selected_shops as $key2 => $value2) {
                if ($value['id'] == $value2->id) {
                    $list[$key]['value'] = true;
                }
            }
        }
        return $list;
    }//..... end of function getVenueStore .....//

    public function listAssignVenues($board_id)
    {
        $res = DB::table("quickboard_venue_shop")
            ->leftJoin("venues", "venues.venue_id", "=", "quickboard_venue_shop.venue_id")
            ->where(["quickboard_venue_shop.qb_id" => $board_id])->get();
        $names = "";
        if ($res)
            foreach ($res as $key => $value)
                $names = $names . $value->venue_name . " | ";
        return $names;
    }//..... end of function listAssignVenues  .....//

    public function listAssignShops($board_id)
    {
        $res = DB::table("quickboard_venue_shop")->where(["quickboard_venue_shop.qb_id" => $board_id])->get();
        $names = "";
        if ($res) {
            foreach ($res as $key => $value) {
                if ($value->shop_name != NULL)
                    $names = $names . $value->shop_name . " | ";
            }
        }
        return $names;
    }//......  end of function listAssignShops  .....//


    public function saveQuickBoardOrder(Request $request)
    {
        foreach ($request->order as $key => $value) {
            QuickBoard::where("id", $value)->update(["display_order" => ($key + 1)]);
        }
        return ["status" => true, "message" => "Orders saved successfully"];
    }//.....  end of function saveQuickBoardOrder .....//


    public function quickBoardTypes()
    {
        $data["qb_types"] = Config::get('constant.QUICK_BOARD_TYPES');
        $data["qb_levels"] = DB::table("quick_board_level")->get();
        $data['status'] = true;
        return $data;
    }//..... end of function quickBoardTypes and quick board levels .....//


    private function getLevelName($order)
    {
        $res = DB::table("quick_board_level")->where(["level_order" => $order])->first();
        return $res->level_name ?? "";
    }


}/* End of class */
