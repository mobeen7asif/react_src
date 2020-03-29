<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\RecipeCollection;
use App\Models\Charity;
use App\Models\Chef;
use App\Models\News;
use App\Models\Recipe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class QuickBoard extends Controller
{
    /* function for getting quick boards */
    public function getQuickBoards(Request $request)
    {
        $board = \App\Models\QuickBoard::select(["quick_boards.id", "quick_boards.board_level", "quick_boards.board_title as label", "quick_board_level.level_name"])->leftJoin("quick_board_level", "quick_board_level.level_order", "=", "quick_boards.board_level")->where(["qb_type" => $request->type])
            ->get()->each(function ($value) {
                $value->label = $value->label . " (" . $value->level_name . ")";
            });
        foreach ($board as $key => $value)
            $value->value = false;

        return ['data' => $board->toArray()];
    }


    public function quickBoardListing(Request $request){
        //---- logging user login time   ...//
        if(request()->user()){
            DB::table("users")->where(["user_id"=>request()->user()->user_id])->update(["login_time"=>date("Y-m-d H:i:s")]);
        }

        $board = \App\Models\QuickBoard::where(["board_level" => $request->board_type])
            ->leftJoin("quick_board_level", "quick_board_level.level_order", "=", "quick_boards.board_level")
            ->get(["quick_boards.*", "quick_board_level.level_name", "quick_board_level.level_order"]);
        foreach ($board as $key => $value) {
            if ($value->background_image != "")
                $value->background_image = url('/') . '/news/' . $value->background_image;

            $value->icon_image = url('/') . '/news/' . $value->icon_image;
        }
        return ["status" => true, "message" => "Data Found", 'data' => $board->toArray()];
    }

    public function boardWiseData(Request $request)
    {
        switch ($this->getType($request->board_id)) {
            case 'NEWS':
                return $this->getNews();
            case 'RECIPE':
                return $this->getRecipe();
            case 'CHARITY':
                return $this->getCharities();
            default:
                return $this->getNews();
        }
    }//.... end of function boardWiseData  ......//

    private function getType($id)
    {
        $res = DB::table("quick_boards")->where(["id" => $id])->first();
        return $res ? $res->qb_type : "";
    }//...... end of function getType  ......//

    private function getNews()
    {
        $venue_id = request()->venue_id;
        $limit = request()->has('limit') ? request()->limit : 100;
        $data = DB::table("quick_board_news")->select([
            "quick_board_news.board_id", "quick_board_news.resource_id", "quick_boards.board_title",
            "news.news_subject", "news.news_desc", "news.news_image", "news.news_web_detail", "news.id as news_id",
            "news.news_type", "news.video_link", "news.created_at", "news.start_date", "news.end_date", "news.is_featured as future_news", "news.venue_id"

        ])
            ->leftJoin("quick_boards", "quick_boards.id", "=", "quick_board_news.board_id")
            ->leftJoin("news", "news.id", "=", "quick_board_news.resource_id")
            ->where("quick_board_news.board_id", request()->board_id)
            ->when($venue_id, function ($query, $venue_id) {
                return $query->where(["news.venue_id" => $venue_id]);
            })
            ->where(function ($query) {
                return $query->whereDate("news.end_date", ">=", date("Y-m-d"))
                    ->orWhereNull('news.end_date');
            })->paginate($limit);


        $globalNews = $this->getGlobalNews();

        $data = $data->merge($globalNews);

        foreach ($data as $key => $value) {
            $value->board_id = request()->board_id;
            $value->future_news = isset($value->is_featured) ? $value->is_featured : $value->future_news;
            $value->news_image = url('/') . '/news/' . $value->news_image;
            $value->image = url('/') . '/news/' . $value->news_image;
            if ($value->video_link == "null" || $value->video_link === null) {
                $value->video_link = "";
            }
        }
        return ['status' => true, "message" => "data found", 'data' => $data->toArray()];
    }

    private function getRecipe()
    {
        $venue_id = request()->venue_id ?? "";
        $feature_recipe = Recipe::where(["is_featured" => 1, "venue_id" => request()->venue_id])->first();
        if ($feature_recipe) {
            if (date("Y-m-d", strtotime($feature_recipe->end_date)) < date("Y-m-d")) {
                Recipe::whereId($feature_recipe->id)->update(["is_featured" => 0]);
            }
        }
        $recipes = Recipe::orderBy("recipes.id", "desc")
            ->leftJoin("quick_board_news", "quick_board_news.resource_id", "=", "recipes.id")
            ->leftJoin("recipe_category", "recipe_category.id", "=", "recipes.recipe_category_id")
            ->where(["quick_board_news.board_id" => request()->board_id])
            //->where(["recipes.venue_id"=>$venue_id])
            ->when($venue_id, function ($query, $venue_id) {
                return $query->where('recipes.venue_id', $venue_id);
            })
            ->get(["recipes.*", "quick_board_news.resource_id", "quick_board_news.board_id", "recipe_category.title as category_title"]);
        foreach ($recipes as $key => $value) {
            $value->prep_time = ($value->prep_time <= 1) ? $value->prep_time . " minute" : $value->prep_time . " minutes";
            $value->cook_time = ($value->cook_time <= 1) ? $value->cook_time . " minute" : $value->cook_time . " minutes";

            $value->tags = $this->recipeTags($value->id);
            $value->recipe_preparation = $this->recipePreparation($value->id);
            $value->recipe_ingredients = $this->recipeIngredients($value->id);
            $value->chef = "";
            if ($value->chef_id) {
                $value->chef = $this->getChef($value->chef_id);
            }
            if ($value->image)
                $value->image = url('/') . '/' . $value->image;

            if ($value->is_featured) {
                $value->start_date = date("d-m-Y", strtotime($value->start_date));
                $value->end_date = date("d-m-Y", strtotime($value->end_date));
            }
        }
        return ['status' => true, "message" => "data found", 'data' => $recipes];
    }

    private function getChef($id)
    {
        $res = Chef::where("id", $id)->get();
        foreach ($res as $key => $value) {
            $value->image = url('/') . '/uploads/' . $value->image;
        }
        return $res->isNotEmpty() ? $res[0] : "";
    }

    private function getCharities()
    {
        $charities = Charity::select('*')
            ->join("quick_board_news", "quick_board_news.resource_id", "=", "charity.id")
            ->where(["quick_board_news.board_id" => request()->board_id])
            ->withCount('coins')->orderby('id', 'desc');
        return ['status' => true, 'data' => $charities->get()->each(function ($charity) {
            if ($charity->image)
                $charity->image = asset('/' . $charity->image);
        })];
    }

    public function getQuickBoardLevels(Request $request)
    {
        $res = DB::table("quick_board_level");
        $data['data'] = $res->orderby('level_order', 'asc')->skip($request->offset)->take($request->limit)->get();
        $data['total'] = $res->count();
        $data['status'] = true;
        return $data;
    }//.....  end of function getQuickBoardLevels  .....//

    public function saveQuickBoardLevel(Request $request)
    {
        if ($request->is_edit) {
            DB::table("quick_board_level")->where(["id" => $request->is_edit])->update(["level_name" => $request->level_name, "level_order" => $request->level_order]);
        } else {
            $res = DB::table("quick_board_level")->where(["level_order" => $request->level_order])->first();
            if ($res)
                return ["status" => "exist", "message" => "Level Order {$request->level_order} is already exist."];
            DB::table("quick_board_level")->insert(["level_name" => $request->level_name, "level_order" => $request->level_order]);
        }
        return ["status" => "true", "message" => "Record Saved successfully"];
    }//.....  end of function saveQuickBoardLevel  .....//

    public function deleteQuickBoardLevel($id)
    {
        DB::table("quick_board_level")->where(["id" => $id])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    }//.....  end of deleteQuickBoardLevel()  .....//

    private function recipeTags($recipe_id)
    {
        return DB::table("recipe_tags")->select("title")->whereRecipeId($recipe_id)->get();
    }

    private function recipePreparation($recipe_id)
    {
        return DB::table("recipe_preparation")->select("description")->whereRecipeId($recipe_id)->get();
    }

    private function recipeIngredients($recipe_id)
    {
        return DB::table("recipe_ingredients")->select("description")->whereRecipeId($recipe_id)->get();
    }

    private function getGlobalNews()
    {
        return DB::table("news")->where("is_global", 1)->get();
    }
}
