<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\RecipeCategoryCollection;
use App\Http\Resources\RecipeCollection;
use App\Http\Resources\RecipeOfferResourceCollection;
use App\Models\Campaign;
use App\Models\Chef;
use App\Models\PunchCard;
use App\Models\Recipe;
use App\Models\RecipeCategory;
use App\Http\Controllers\Controller;
use App\Models\RecipeIngredients;
use App\Models\RecipeOffer;
use App\Models\RecipePreparations;
use App\Models\RecipeReviews;
use App\Models\RecipeTags;
use App\Models\OfferStats;
use App\Models\UserStamp;
use App\Models\VoucherUser;
use App\Utility\ElasticsearchUtility;
use GuzzleHttp\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OfferStatsExport;
use Illuminate\Support\Facades\Config;

class RecipeController extends Controller
{
    /**
     * @return RecipeCategoryCollection
     * Get Categories' list with relations.
     */
    public function listCategory()
    {
        return new RecipeCategoryCollection(RecipeCategory::all());
    }//..... end of listCategory .....//

    /**
     * Get Recipes list.
     * this function is used for mobile api.
     */
    public function getRecipes()
    {
        $recipes = new Recipe();

        if (request()->has('limit') and request('limit') > 0)
            $recipes = $recipes->take(request()->limit);

        if (request()->has('page') and request('page') >= 0)
            $recipes = $recipes->skip(request()->page);

        if (request()->has('category_id') and request()->category_id)
            $recipes = $recipes->whereRecipeCategoryId(request()->category_id);

        $res = new RecipeCollection($recipes->get());

        return ($res);
    }//..... end of getRecipes() .....//

    /**
     * This is function is used for frontend.
     * @param Request $request
     * @return array
     */
    public function getRecipesLists(Request $request)
    {
        $recipes = Recipe::orderBy($request->orderBy, $request->orderType);

        if ($request->has('search') && $request->search)
            $recipes->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        $res = $recipes->skip($request->offset)->take($request->limit)->get();
        foreach ($res as $key => $value) {
//            $value->prep_time = ($value->prep_time <= 1) ? $value->prep_time." minute" : $value->prep_time." minutes";
//            $value->cook_time = ($value->cook_time <= 1) ? $value->cook_time." minute" : $value->cook_time." minutes";
            $value->description = (strlen($value->description) > 50) ? substr($value->description, 0, 50) . "...." : $value->description;
            $value->chef_name = $this->getChefName($value->chef_id);
            $value->selected_qb = DB::table("quick_board_news")->select(["board_id", "resource_id", "board_title", "board_level"])
                ->leftJoin("quick_boards", "quick_boards.id", "=", "quick_board_news.board_id")
                ->where(["quick_board_news.resource_id" => $value->id, "quick_board_news.type" => "recipe"])
                ->get();

            foreach ($value->selected_qb as $key2 => $value2) {
                $value->listBoards = $value->listBoards . $value2->board_title . " (" . $this->getLevelName($value2->board_level) . ")";
            }
            if ($value->is_featured) {
                $value->start_date = date("d-m-Y", strtotime($value->start_date));
                $value->end_date = date("d-m-Y", strtotime($value->end_date));
                $value->is_featured = true;
                $value->is_featured = "Yes";
            } else {
                $value->is_featured = false;
                $value->is_featured = "No";
            }
        }
        return [
            'status' => true,
            'total' => $recipes->count(),
            'data' => $res
        ];
    }//..... end of getRecipesLists() ......//

    private function getChefName($id)
    {
        $res = Chef::where("id", $id)->first();
        return $res ? $res['first_name'] . " " . $res['last_name'] : "";
    }

    /**
     * @return array
     * Delete Specific Recipe.
     * This function is used for frontend.
     */
    public function deleteRecipe()
    {
        $recipe = Recipe::find(request()->id);
        if ($recipe) {
            $recipe->tags()->delete();
            $recipe->ingredients()->delete();
            $recipe->preparations()->delete();
            $recipe->delete();
            DB::table("quick_board_news")->where(["resource_id" => request()->id, "type" => "recipe"])->delete();
        }//..... end if() .....//
        return ['status' => true, 'message' => 'Recipe deleted successfully.'];
    }//..... end of deleteRecipe() ......//

    /**
     * Get Recipe's Categories List.
     * this function is used for frontend.
     */
    public function getCategoryList($recipe_id = 0)
    {
        return ['status' => true,
            'data' => RecipeCategory::get(['id', 'title']),
            'config' => $recipe_id > 0 ? $this->getRecipeDetails($recipe_id) : [],
            'chefs' => Chef::get()
        ];
    }//..... end of getCategoryList() ......//

    /**
     * @param FilesController $filesController
     * @return array|string
     * Save Recipe.
     * This function is used for frontend.
     */
    public function saveRecipe(FilesController $filesController)
    {
        $image = 'uploads/' . time() * rand() . ".png";
        $recipeData = ['recipe_category_id' => (request()->category)['id'], 'chef_id' => (request()->chef)['id'], 'title' => request()->title, 'description' => request()->description,
            'prep_time' => request()->prep_time,
            'cook_time' => request()->cook_time,
            'method' => request('method'),
            'serving' => request()->serving,
            'venue_id' => request()->venue_id
        ];

        if ($filesController->uploadBase64Image(request()->image, $image))
            $recipeData['image'] = $image;
        $recipeData['is_featured'] = 0;
        if (request()->is_featured) {
            Recipe::where(["is_featured" => 1, "venue_id" => request()->venue_id])->update(["is_featured" => 0]);
            $recipeData['is_featured'] = 1;
            $recipeData['start_date'] = request()->start_date;
            $recipeData['end_date'] = request()->end_date;
        }//..... end if() .....//

        if (request()->editId == 0) {
            $recipe = Recipe::create($recipeData);
            $this->addRecipeQuickBoard($recipe->id);
        } else {
            $recipe = Recipe::find(request()->editId);
            if (!$recipe)
                return ['status' => false, 'message' => 'Recipe Not found.'];

            $recipe->update($recipeData);
            $recipe->tags()->delete();
            $recipe->ingredients()->delete();
            $recipe->preparations()->delete();
            $this->addRecipeQuickBoard(request()->editId);
        }//..... end if() .....//

        $tags = [];
        foreach (request()->tags as $tag)
            $tags[] = ['title' => $tag];


        $recipe->tags()->createMany($tags);
        $recipe->ingredients()->createMany(request()->ingredients);
        $recipe->preparations()->createMany(request()->preparations);

        return ['status' => true, 'message' => 'Recipe saved successfully.'];
    }//..... end of saveRecipe() ......//

    /**
     * @param $recipe_id
     * @return array
     * Get Specific Recipe Tags, Ingredients and Preparations techniques.
     */
    private function getRecipeDetails($recipe_id)
    {
        return [
            'tags' => RecipeTags::whereRecipeId($recipe_id)->pluck('title'),
            'preparations' => RecipePreparations::whereRecipeId($recipe_id)->get(['description']),
            'ingredients' => RecipeIngredients::whereRecipeId($recipe_id)->get(['description'])
        ];
    }//..... end of getRecipeDetails() .....//

    /**
     * Get List of offers.
     * this function is used to list offers for frontend.
     * @param Request $request
     * @return array
     */
    public function getOfferList(Request $request)
    {
        $recipes = RecipeOffer::orderBy($request->orderBy, $request->orderType);

        if ($request->has('search') && $request->search)
            $recipes->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%')
                    ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        $data = $recipes->skip($request->offset)->take($request->limit)->get();
        foreach ($data as $key => $value) {
            $value->selected_venues = DB::table("venue_resources")->select(["venue_id", "resource_id", "type"])->whereType("offers")->where("venue_resources.resource_id", $value->id)->get();
        }
        $total = $recipes->count();

        return [
            'status' => true,
            'total' => $total,
            'data' => $data
        ];
    }//..... end of getOfferList() ......//

    /**
     * @return array
     * Delete Offer.
     * this is function is only for frontend.
     */
    public function deleteOffer()
    {
        if (RecipeOffer::destroy(request()->id))
            return ['status' => true, 'message' => 'Offer deleted successfully.'];
        else
            return ['status' => false, 'message' => 'Error occurred while deleting offer.'];
    }//..... end of deleteOffer() ......//

    /**
     * @param FilesController $filesController
     * @return array
     * Saved Locations.
     * This function is used to get saved locations.
     */
    public function getSavedLocations()
    {

        $query = RecipeOffer::whereNotNull('location')->pluck('location');
        $location = $query->implode(', ');
        $location = array_unique(explode(', ', $location));

        return [
            'status' => $location ? true : false,
            'data' => $location,
            'message' => $location ? 'Locations Found.' : 'Error occurred.'

        ];
    }

    /**
     * @param FilesController $filesController
     * @return array
     * Save Offer.
     * This function is used to save offer only for frontend.
     */
    public function saveOffer(FilesController $filesController)
    {
        $offerData = [
            'title' => request()->title,
            'url' => request()->url,
            'description' => request()->description,
            'recipe_id' => request()->type === 'recipe' ? request()->recipe_id : NULL,
            'type' => request()->type,
            'priority' => request()->priority,
            'location' => implode(", ", array_column(request()->location, 'text'))
        ];


        if (request()->selected_venues)
            $offerData['display_type'] = "";
        if (request()->video_link)
            $offerData['video_link'] = request()->video_link;

        $image = 'uploads/' . time() * rand() . ".png";

        if ($filesController->uploadBase64Image(request()->image, $image))
            $offerData['image'] = $image;

        if (request()->editId == 0) {
            $recipe = RecipeOffer::create($offerData);
            $offer_id = $recipe->id;
        } else {
            $recipe = RecipeOffer::whereId(request()->editId)->update($offerData);
            $offer_id = request()->editId;
        }

        DB::table("venue_resources")->where(["resource_id" => $offer_id, "type" => "offers"])->delete();
        if (request()->selected_venues)
            foreach (request()->selected_venues as $value)
                DB::table("venue_resources")->insert(["venue_id" => $value, "resource_id" => $offer_id, "type" => "offers"]);

        return ['status' => $recipe ? true : false, 'message' => $recipe ? 'Offer saved successfully.' : 'Error occurred.'];
    }//..... end of saveOffer() ......//

    /**
     * @param Request $request
     * @return array
     * Get Category list.
     * this function is used for frontend only.
     */
    public function recipeCategoryList(Request $request)
    {
        $category = RecipeCategory::orderBy($request->orderBy, $request->orderType);

        if ($request->has('search') && $request->search)
            $category->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            });

        return [
            'status' => true,
            'total' => $category->count(),
            'data' => $category->skip($request->offset)->take($request->limit)->get()
        ];
    }//..... end of recipeCategoryList() .....//

    /**
     * Save Recipe Category.
     * this function is used only for frontend.
     */
    public function saveCategory()
    {
        if (request()->editId == 0)
            $recipe = RecipeCategory::create(request()->only(['title']));
        else
            $recipe = RecipeCategory::whereId(request()->editId)->update(request()->only(['title']));

        return ['status' => $recipe ? true : false, 'message' => $recipe ? 'Category saved successfully.' : 'Error occurred.'];
    }//..... end of saveCategory() .....//

    /**
     * @return array
     * Delete Category.
     */
    public function deleteCategory()
    {
        return (RecipeCategory::destroy(request()->id))
            ? ['status' => true, 'message' => 'Category deleted successfully.']
            : ['status' => false, 'message' => 'Error occurred while deleting category.'];
    }//..... end of deleteCategory() .....//

    /**
     * @param Request $request
     * @return array
     * Save Review.
     */
    public function saveReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'recipe_id' => 'required',
            'rating' => 'required'
        ]);

        if ($validator->fails()) {
            return ['status' => false, 'message' => implode(' ', $validator->errors()->all())];
        }//..... end if() .....//

        $review = RecipeReviews::updateOrCreate($request->only(['user_id', 'recipe_id']), $request->only(['description', 'rating']));
        return $review
            ? ['status' => true, 'message' => 'Review saved successfully.']
            : ['status' => false, 'message' => 'Error occurred while saving review.'];
    }//..... end of saveReview() .....//

    /**
     * @return array
     * Get Recipe List to populate dropdown.
     */
    public function getRecipeListForDropdownList()
    {
        return ['status' => true, 'data' => Recipe::get(['id', 'title'])];
    }//..... end of getRecipeListForDropdownList() .....//

    /**
     * This function is used for mobile api.
     */
    public function getOffersListing()
    {
        try {
            $userID = request()->user_id ?? 0;
          $req = new \Illuminate\Http\Request();
            $req->replace(['user_id' => $userID, 'venue_id' => '2234', 'company_id' => (request()->header('Country') == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID')]);


            $new_array = [];
            $curr_time = date('Y-m-d H:i');

            $vouchers = VoucherUser::whereNotNull('voucher_id')->where('user_id',$userID)->whereDate('voucher_start_date','<=',$curr_time)->whereDate('voucher_end_date','>=',$curr_time)->get();

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
                        $voucher['date'] = strtotime($voucher['voucher_start_date']);
                        $voucher['type'] = 'voucher';

                        $new_array[] = $voucher;
                    }

                }
            }

            $data = [
                'offers' => new RecipeOfferResourceCollection(RecipeOffer::where('type', 'global')->where('location', request()->header('Country'))->get()),
                'vouchers_count' => collect($new_array)->count() ?? 0,
                'stamp_card_count' => $this->getUserStamps()
            ];
            return ['status' => true, 'data' => $data];
        } catch (\Exception $e) {
            return ["status" => false, "message" => $e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... end of getOffersListing() .....//

    public function addRecipeQuickBoard($resource_id)
    {
        DB::table("quick_board_news")->where(["resource_id" => $resource_id, "type" => "recipe"])->delete();
        foreach (request()->selected_board as $key => $value)
            DB::table("quick_board_news")->insert(["resource_id" => $resource_id, "board_id" => $value, "type" => "recipe"]);

    }

    private function getLevelName($order)
    {
        $res = DB::table("quick_board_level")->where(["level_order" => $order])->first();
        return $res ? $res->level_name : "";
    }

    /**
     *
     * Save Clicks and Impressions.
     */
    public function saveClicksImprressions(request $request)
    {
        $login_user_id = $request->user_id ?? 0;

        $location = $request->zone;
        $input = $request->all();

        if ($location) {


            $recipeOffers = RecipeOffer::where('location', 'LIKE', "%" . $location . "%")->get();

            if (count($recipeOffers)) {
                $recipeOffers->map(function ($row) use ($login_user_id) {

                    $input['offer_id'] = $row->id;
                    $input['type'] = 'impression';
                    $input['user_id'] = $login_user_id;

                    $row['image_path'] = $row['image'] ? url("/") . "/" . $row['image'] : "";
                    $row['video_path'] = $row['video_link'] ? url("/") . "/" . $row['video_link'] : "";

                    unset($row['video_link'], $row['image']);

//                    create offer stats
                    $offerStats = OfferStats::create($input);
                });
                return ['status' => true, 'data' => $recipeOffers, 'message' => 'Imressions saved successfully'];

            } else {
                return ['status' => false, 'message' => 'No offers found in this zone'];
            }
        } else {

            $input['user_id'] = $login_user_id;
            $input['type'] = 'click';

//                    create offer stats
            $offerStats = OfferStats::create($input);

            $data = RecipeOffer::find($request->offer_id)->only(['url']);

            $url = $data['url'];
            if ($url) {
                return ['status' => true, 'url' => $url, 'message' => 'Url Found'];
            }
            return ['status' => false, 'url' => '', 'message' => 'No Url Found'];
        }

    }

    public function saveImprressionsVideoSeen(request $request)
    {
        $login_user_id = $request->user_id ?? 0;

        $input = $request->all();
        $input['user_id'] = $login_user_id;
        $input['type'] = 'impression';

        $data = RecipeOffer::find($request->offer_id);
        if ($data) {

            $offerStats = OfferStats::create($input);

            return ['status' => true, 'data' => $offerStats, 'message' => 'Imressions saved successfully'];
        } else {
            return ['status' => false, 'message' => 'Offer id not exists'];
        }
    }


    //..... end of saveClicksImprressions() .....//

    /**
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * Download Offer Stats list.
     */
    public function exportOfferStats()
    {
        /*$recipeOffers = OfferStats::where("offer_id", request()->offer_id)->get();
        dd($recipeOffers);*/

        $offerStats = OfferStats::where('offer_stats.offer_id', request()->offer_id)
            ->join('users', 'users.user_id', '=', 'offer_stats.user_id')
            ->orderBy('offer_stats.created_at', 'ASC')
            ->get(['offer_stats.created_at', 'users.user_first_name', 'users.user_family_name', 'offer_stats.type', 'offer_stats.video_seen']);

        $offerStats->map(function ($row) {
            if ($row->video_seen == 1) {
                return $row->video_seen = 'Yes';
            } else {
                return $row->video_seen = 'No';
            }
        });
        return Excel::download(new OfferStatsExport($offerStats), 'offers_stats.xlsx');
    }//..... end of exportOfferStats() .....//


    public function getAllVideos()
    {
        return [
            "status" => true,
            "data" => DB::table('recipe_offers')->whereNotNull('video_link')->get(['id', 'title'])
        ];
    }

    public function getUserStamps()
    {

        $credit = UserStamp::where(['user_id' => request()->user_id,'company_id' => (request()->header('Country') == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID')])->sum('credit');
        $debit = UserStamp::where(['user_id' => request()->user_id,'company_id' => (request()->header('Country') == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID')])->sum('debit');
        $stamp = PunchCard::where(['company_id' => (request()->header('Country') == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID'),'redemption_type'=>'transaction_value'])->first();
        $initialTotal = $credit - $debit;
        if($initialTotal<0)
            $initialTotal = 0;
        $initial_points = ($initialTotal % (int)$stamp->no_of_use);

        $intial_stamps = (int)(($initialTotal) / (int)$stamp->no_of_use);

       return  [
            [
                "persona_id" =>  request()->user_id,
                "company_id"=> (request()->header('Country') == 'uk') ? config('constant.COMPANY_ID') : config('constant.COMPANY_IRE_ID'),
                "quantity" => $initial_points ?? 0,
                "transaction_threshold" => (int)$stamp->transaction_threshold ?? 0

            ]
        ];

    }


}//..... end of class.