<?php

namespace App\UnifiedSchemaCall;

use App\Http\Controllers\Api\BaseRestController;
use App\Models\StoreInformation;
use App\Models\VenueSubscription;
use App\UnifiedDbModels\AllImages;
use App\UnifiedDbModels\Category;
use App\UnifiedDbModels\Options;
use App\UnifiedDbModels\Product;
use App\UnifiedDbModels\ProductOptionSet;
use App\UnifiedDbModels\Store;
use App\UnifiedDbModels\StoreSettings;
use App\UnifiedDbModels\Variant;
use App\Models\Venue;
use App\Models\VenueImage;
use DB;

class BasePosUnifiedSchemaCall {

    /**
     * BasePosApiCall constructor.
     */
    public function __construct()
    {
        set_time_limit(0);
    }//..... end of __construct() ......//

    /**
     * @param $imageTypeId
     * @param $imageSourceType
     * @param $displayType
     * @return mixed
     * Get All images according to params.
     */
    protected function getImages($imageTypeId, $imageSourceType, $displayType)
    {
        return AllImages::select("image_path")->whereImageTypeId($imageTypeId)->whereImageSourceType($imageSourceType)->whereImageDisplayType($displayType)->first();
    }//..... end of getImages() ......//

    /**
     * Get List of Products According to criteria.
     */
    protected function getProductsFromUD($params)
    {
        extract($params);
        $productsArray = [];
        $search = false;

        $pds = Product::where($where);
        if (isset($params['search']) and $params['search']) {
            $pds = $pds->where("product_name", "like", "%" . $searchKey . "%");
            $search = true;
        }//.... end if() .....//

        $pds->join("store", "store.id", "=", "product.store_id")
                ->join("category", "category.category_id", "=", "product.category_id")
                ->get(['product.*', "store.id as store_id"])
                ->each(function ($product) use(&$productsArray, $search) {

                    $store_id = $product->store_id;
                    $prdArray = [
                        "displaypriority"           => ($product->display_priority)     ? $product->display_priority    : 0,
                        "prd_id"                    => $product->product_id,
                        "prd_name"                  => $product->product_name,
                        "prd_price"                 => $product->product_price,
                        "prd_sku"                   => ($product->product_sku)          ? $product->product_sku         : "",
                        "parent_id"                 => ($product->parent_id)            ? $product->parent_id           : 0,
                        "columns"                   => ($product->product_columns)      ? $product->product_columns     : "",
                        "variants"                  => ($product->product_variants)     ? $product->product_variants    : 0,
                        "prd_trigger"               => ($product->product_trigger)      ? $product->product_trigger     : "",
                        "recom_order"               => $product->recom_order,
                        "discountable"              => ($product->discountable)         ? $product->discountable        : "",
                        "max_discount_amount"       => $product->max_discount_amount,
                        "max_discount_percentage"   => $product->max_discount_percentage,
                        "taxable"                   => ($product->taxable)              ? $product->taxable             : "",
                        "qty_onhand"                => ($product->product_stock)        ? "{$product->product_stock}"   : "0",
                        "prd_color"                 => ($product->product_color)        ? $product->product_color       : "",
                        "prd_description"           => ($product->product_description)  ? $product->product_description : "",
                        "term"                      => ($product->short_description)    ? $product->short_description   : "",
                        "upc_code"                  => ($product->product_code)         ? $product->product_code        : "",
                        "prd_cost"                  => $product->product_cost,
                        "board_cate_id"             => $product->board_cate_id,
                        "business_id"               => $product->store_id,
                        "cate_id"                   => $product->category_id,
                        "variants_array"            => [],
                        "modifiers_array"           => [],
                        "prd_image"                 => "",
                        "multiple_price_names"      => [],
                        "multiple_price_value"      => [],
                        "is_favorite"               => 0,
                        "pro_points"                => [
                                    "points_array"  => [],
                                    "points_value"  => ""
                                                    ],
                        "point_type"                => $product->point_type             ? $product->point_type          : "",
                        "point_value"               => $product->point_value            ? $product->point_value         : 0,
                    ];

                    // $images = $this->getImages($product->product_id, "product","front");
                    $product_image = DB::table('product_images')->select('image_path')->where('product_id', '=', $product->product_id)->first();
                    if ($product_image)
                        $prdArray["prd_image"] = $product_image->image_path;

                    $modifiersArray = [];
                    ProductOptionSet::where(["product_option_set.product_id" => $product->product_id, "option_sets.store_id" => $product->store_id])
                    ->join("option_sets", "product_option_set.option_set_id", "=", "option_sets.option_set_id")
                    ->join("product", "product_option_set.product_id", "=", "product.product_id")
                    ->get()
                    ->each(function($opSet)use(&$modifiersArray, $store_id) {
                        $options = [];
                        Options::where(["option_set_id" => $opSet->option_set_id])->get()
                        ->each(function($opt)use(&$options, $opSet) {
                            $options[] = [
                                "modi_opt_id"   => (string) $opt->option_set_id     ?? "",
                                "modi_id"       => (string) $opt->option_set_id     ?? "",
                                "modi_opt_name" => $opt->option_name                ?? "",
                                "modi_opt_cost" => $opt->option_cost                ?? "",
                                "modi_opt_sale" => $opt->option_price               ?? "",
                                "modi_opt_sku"  => $opt->option_sku                 ?? ""
                            ];
                        });

                        $mdArray = [
                            "modi_id"           => (string) $opSet->option_set_id,
                            "business_id"       => $store_id,
                            "modi_name"         => $opSet->option_set_name          ?? "",
                            "modi_max_selected" => $opSet->max_selection            ?? "",
                            "modi_status"       => ($opSet->option_set_status)      ? $opSet->option_set_status : "",
                            "choose_opt_label"  => ($opSet->choose_opt_label)       ? $opSet->choose_opt_label : "",
                            "options"           => $options
                        ];

                        $modifiersArray[] = $mdArray;
                    });

                    $variantsArray = [];
                    Variant::where(["product_variant.product_id" => $product->product_id])->join("product_variant", "variant.variant_id", "=", "product_variant.variant_id")->get()
                    ->each(function($vt) use(&$variantsArray, $product) {
                        $variantsArray [] = [
                            "displaypriority"           => ($vt->display_priority)      ? $vt->display_priority : 0,
                            "prd_id"                    => $product->product_id,
                            "prd_name"                  => $vt->variant_name            ?? "",
                            "prd_price"                 => $vt->variant_price           ?? "",
                            "prd_sku"                   => ($vt->variant_sku)           ? $vt->variant_sku : "",
                            "parent_id"                 => $product->product_id,
                            "columns"                   => ($vt->variant_columns)       ? $vt->variant_columns : "",
                            "variants"                  => ($vt->variant_variants)      ? $vt->variant_variants : "",
                            "prd_trigger"               => ($vt->variant_trigger)       ? $vt->variant_trigger : "",
                            "recom_order"               => ($vt->recom_order)           ? $vt->recom_order : 0,
                            "discountable"              => ($vt->discountable)          ? $vt->discountable : "",
                            "max_discount_amount"       => $vt->max_discount_amount,
                            "max_discount_percentage"   => $vt->max_discount_percentage,
                            "taxable"                   => ($vt->taxable)               ?? "",
                            "qty_onhand"                => ($vt->qty_onhand)            ? "{$vt->qty_onhand}" : "0",
                            "prd_image"                 => ($vt->variant_img)           ? $vt->variant_img : "",
                            "prd_color"                 => ($vt->variant_color)         ? $vt->variant_color : "",
                            "prd_description"           => ($vt->variant_description)   ? $vt->variant_description : "",
                            "upc_code"                  => ($vt->variant_code)          ? $vt->variant_code : "",
                            "prd_cost"                  => ($vt->variant_cost)          ? $vt->variant_cost : "",
                            "board_cate_id"             => ($vt->board_cate_id)         ? $vt->board_cate_id : "",
                            "pro_points"                => new \stdClass()
                        ];
                    });
                    $prdArray["modifiers_array"] = $modifiersArray;
                    $prdArray["variants_array"] = $variantsArray;

                    //...... populate extra data for search result.
                    if ($search) {
                        //..... get store details.
                        $images = $this->getImages($product->store_id, 'store', 'front');

                        $settings = StoreSettings::whereStoreId($product->store_id)->first();
                        if ($settings) {
                            $settings = $settings->toArray();
                            unset($settings["created_at"]);
                            unset($settings["updated_at"]);
                            unset($settings["store_setting_id"]);
                            unset($settings["store_id"]);
                        } else {
                            $settings = config('constant.business_settings');
                        }

                        $categoryies = [];
                        Category::where("store_id", $product->store_id)->get()
                        ->each(function($cat) use(&$categoryies, $product, $settings) {
                            $category_images = AllImages::select("image_path")->whereImageTypeId($product->store_id)->whereImageSourceType('category')->whereImageDisplayType('front')->first();
                            $categoryies [] = [
                                "cate_id"           => $cat->category_id,
                                "cate_name"         => $cat->category_title         ?? "",
                                "cate_image"        => ($category_images)           ? unserialize($category_images->image_path) : "",
                                "cate_color"        => ($cat->category_color)       ? $cat->category_color                      : "",
                                "cate_type"         => ($cat->category_type)        ? $cat->category_type                       : 0,
                                "cate_detail"       => ($cat->category_description) ? $cat->category_description                : "",
                                "displaypriority"   => ($cat->display_priority)     ? $cat->display_priority                    : 0
                            ];
                        });

                        $prdArray['store_data'] = [
                            "business_id"           => $product->store_id           ?? "",
                            "business_name"         => $product->store_name         ?? "",
                            "business_email"        => $product->store_email        ?? "",
                            "business_account_type" => $product->store_account_type ?? "",
                            "business_mobile"       => $product->store_phone        ?? "",
                            "business_location"     => $product->store_address      ?? "",
                            "user_id"               => $product->pos_user_id        ?? "",
                            "business_detail"       => $product->store_detail       ?? "",
                            "business_detail_info"  => $product->store_detail_info  ?? "",
                            "images"                => ($images)    ? unserialize($images->image_path) : "",
                            "business_settings"     => ($settings)  ? $settings : "",
                            "categories"            => $categoryies
                        ];
                    }//..... end of if() .....//
                    $productsArray[] = $prdArray;
                }); //..... end of each() ......//

        return $productsArray;
    }//..... end of getProductsFromUD() .....//

    /**
     * @param array $params
     * @return array
     * Get List of Categories from Unified Database.
     */
    protected function getCategoriesFromUD($params = [])
    {
        extract($params);
        $store = Store::where("store_id", $business_id)->first();
        $data = [];

        if ($store) {
            $bgImages = $this->getImages($store->store_id, 'store', 'bg');
            $images = $this->getImages($store->store_id, 'store', 'front');
            $categoriesArray = [];
            Category::where("store_id", $business_id)->get()->each(function($cat) use( &$categoriesArray ) {
                $categoryImages = $this->getImages($cat->category_id, 'category', 'front');
                $categoriesArray[] = [
                    "cate_id"           => $cat->category_id,
                    "cate_name"         => $cat->category_title,
                    "cate_image"        => ($categoryImages)            ? unserialize($categoryImages->image_path) : "",
                    "cate_color"        => $cat->category_color         ? $cat->category_color          : "",
                    "cate_type"         => $cat->category_type          ? $cat->category_type           : "",
                    "cate_detail"       => $cat->category_description   ? $cat->category_description    : "",
                    "displaypriority"   => $cat->display_priority       ? $cat->display_priority        : "",
                    "cat_points"        => ""
                ];
            }); //..... end each() .....//
            //..... get business settings ......//
            $business_settings = StoreSettings::select(['licence_fee', 'card_price', 'language', 'currency', 'date_format', 'number_format', 'tax_type', 'payment_type', 'tip_enable', 'tax_value', 'country_id', 'currency_multiple', 'ticket_time', 'near_ticket_time', 'surcharge_value', 'surcharge_type', 'minimum_spend', 'is_ewallet'])->where("store_id", $business_id)->first();

            if (!$business_settings) {
                $business_settings = config('constant.business_settings');
            } else {
                $business_settings['number_format'] = (string) $business_settings->number_format;
            }//..... end of if-else() ......//

            $data = [
                "business_id"           => $store->store_id,
                "business_name"         => $store->store_name,
                "business_email"        => $store->store_email          ? $store->store_email                   : "",
                "business_account_type" => $store->store_account_type   ? $store->store_account_type            : "",
                "business_mobile"       => $store->store_phone          ? $store->store_phone                   : "",
                "business_location"     => $store->store_address        ? $store->store_address                 : "",
                "user_id"               => $store->pos_user_id,
                "owner_name"            => ($store->store_owner)        ? $store->store_owner                   : "",
                "business_detail"       => $store->store_detail         ? $store->store_detail                  : "",
                "business_detail_info"  => $store->store_detail_info    ? $store->store_detail_info             : "",
                "store_points"          => "",
                "bg_images"             => ($bgImages)                  ? unserialize($bgImages->image_path)    : "",
                "images"                => ($images)                    ? unserialize($images->image_path)      : "",
                "business_settings"     => $business_settings,
                "categories"            => $categoriesArray
            ];
        }//..... end if() ......//

        return $data;
    }//..... end of getCategoriesFromUD() ......//

    /**
     * @param array $params
     * @return array
     * Get Single Store Details By Id.
     */
    protected function getSingleStoreFromUD( $params = [] )
    {
        extract($params);
        $data = [];
        $store = Store::where("store_id", $business_id)->first();

        if ($store) {
            $bgImages = $this->getImages($store->store_id, 'store', 'bg');
            $products = Product::whereStoreId($store->store_id)->pluck('product_name')->toArray();
            $stall = StoreInformation::where('store_id', $business_id)->first();

            $data = [
                "business_name"     => $store->store_name   ?? "",
                "business_mobile"   => $store->store_phone  ?? "",
                "owner_name"        => $store->store_owner  ?? "",
                "business_detail"   => $store->store_detail ?? "",
                "bg_images"         => ($bgImages)          ? unserialize($bgImages->image_path)    : "",
                "stall"             => ($stall)             ? $stall->stall_no                      : "",
                "products"          => (!empty($products))  ? implode(',', $products)           : ""
            ];
        }//..... end if() ......//

        return $data;
    }//..... end of getSingleStoreFromUD() ......//

    /**
     * @param array $params
     * @return array
     * Get All Stores of a company.
     */
    protected function getAllStoresFromUD($params = [])
    {
        extract($params);
        $data = [];
        Venue::where('company_id', '=', $company_id)->get()->each(function($venue) use(&$data, $company_id) {
            $data[] = $this->getStoreById($venue->store_news_id, $company_id);
        }); //..... end of each() .....//

        return $data;
    }//..... end of getAllStoresFromUD() .....//

    /**
     * @param $venue_id
     * @param $company_id
     * @return array
     * Get Stores of a single venue.
     */
    protected function getVenueStoresDetails($venue_id, $company_id)
    {
        $data = [];
        Store::whereVenueId($venue_id)->get(['id'])->each(function($store) use(&$data, $company_id) {
            $data[] = $this->getStoreById($store->id, $company_id);
        });

        return $data;
    }//..... end of getVenueStoresDetails() .....//

    /**
     * Get Store By Id
     */
    private function getStoreById($store_id, $company_id)
    {
        $store = Store::whereId($store_id)->first();
        $data = [];
        if ($store) {
            $settings = StoreSettings::select('licence_fee', 'card_price', 'language', 'currency', 'date_format', 'number_format', 'tax_type', 'payment_type', 'tip_enable', 'tax_value', 'country_id', 'currency_multiple', 'ticket_time', 'near_ticket_time', 'surcharge_value', 'surcharge_type', 'minimum_spend', 'is_ewallet')->where(['store_id' => $store->store_id])->first();

            if ($settings)
                $settings['number_formate'] = (string) $settings->number_format;

            $images     = $this->getImages($store->id, 'store', 'front');
            $bg_images  = $this->getImages($store->id, 'store', 'bg');

            $categories = $this->getStoreCategories($store->id, $rules_array = "");
            $imgArray   = [];
            if ($images) {
                $img    = unserialize($images->image_path);
                foreach ($img as $image)
                    $imgArray[] = ['business_image' => $image];
            } else {
                $imgArray[] = ["business_image" =>
                    $store->pos_code == 1 ? "https://www.mysoldi.co/img/soldi-light-logo.png":
                        ($store->pos_code == 2 ? "https://starrtec.com.au/wp-content/uploads/2014/11/Starrtecptyltd-web.png"  :
                            ($store->pos_code == 3 ? "http://www.swiftpos.com.au/wp-content/uploads/Swiftpostouchlogo-250x75.png":""))
                ];
            }//..... end if-else.

            if ($bg_images)
                $bg_image = unserialize($bg_images->image_path)["image"];
            else
                $bg_image = 'http://superportal.darkwing.io/public/news/ALS-Food-Hero.jpg';

            $stall = StoreInformation::where('store_id', $store->id)->first();

            $data = [
                "business_id"           => $store->id,
                "business_name"         => ($store->store_name)         ? $store->store_name : "",
                "business_email"        => ($store->store_email)        ? $store->store_email : "",
                "business_account_type" => ($store->store_account_type) ? $store->store_account_type : "retailer",
                "business_mobile"       => ($store->store_phone)        ? $store->store_phone : "",
                "business_location"     => $store->store_address        ? $store->store_address : "N/A",
                "user_id"               => $store->pos_user_id,
                "business_detail"       => ($store->store_detail)       ? $store->store_detail : "",
                "business_detail_info"  => ($store->store_detail_info)  ? $store->store_detail_info : "",
                "store_points"          => new \stdClass(), //BasePosUnifiedSchemaCall::searchstore($store->store_id,$rules_store_data),
                "images"                => $imgArray,
                'bg_images'             => $bg_image,
                "stall"                 => ($stall)     ? $stall->stall_no : "",
                "store_map"             => ($stall)     ? config('constant.base_path_img') . '/public/maps/' . $stall->store_map : "",
                "business_settings"     => $settings    ? $settings : config('constant.business_settings'),
                "categories"            => $categories,
                'pos_code'              => $store->pos_code ? $store->pos_code : ""
            ];
        }// end if() .....//

        return $data;
    }//..... end of getStoreById() .......//

    /**
     * @param $store_id
     * @return array
     * Get specific store's category.
     */
    private function getStoreCategories($store_id, $rules_array = [])
    {
        $categories = [];
        $rules_data = ""; //(isset($rules_array['status']) and $rules_array['status'] == 1) ? $rules_array['data'] : "";

        Category::whereStoreId($store_id)->get()->each(function ($category) use(&$categories, $rules_data) {
            $images = $this->getImages($category->category_id, 'category', 'front');
            $image = ($images) ? unserialize($images->image_path)->image : '';
            $points = ""; //BasePosUnifiedSchemaCall::searchcategory($category->category_id, $rules_data);
            $categories[] = [
                'cate_id'           => $category->category_id,
                'cate_name'         => ($category->category_title)          ? $category->category_title         : "",
                'cate_image'        => $image,
                'cate_color'        => ($category->category_color)          ? $category->category_color         : "",
                'cate_type'         => ($category->category_type)           ? $category->category_type          : "",
                'cate_detail'       => ($category->category_description)    ? $category->category_description   : "",
                'displaypriority'   => ($category->display_priority)        ? $category->display_priority       : "",
                'cat_points'        => ($points)                            ? $points                           : new \stdClass()
            ];
        }); //...... end of category each() ......//

        return $categories;
    }//..... end of getStoreCategories() ......//

    /**
     * @param $company_id
     * @param $user_id
     * @return mixed
     * Get List of company's Venues,
     * user_id is optional, just for subscription purpose.
     */
    public function getVenuesList($company_id, $user_id)
    {
        $base_path_img = url('/') . '/venues/';
        $venues = Venue::select("id", "venue_id", "venue_name", "venue_description", "address as venue_location", "venue_latitude", "venue_longitude", "venue_url", "company_id", "created_at", "user_id", "locality")->where('company_id', $company_id)->get();
        $data_venues = array();
        foreach ($venues as $venue) {
            $sub = VenueSubscription::where(["user_id" => $user_id, "venue_id" => $venue->venue_id, "company_id" => $company_id])->first();
            $vi = VenueImage::select(["image", "pay_with_points"])->where(['venue_id' => $venue->venue_id, "company_id" => $company_id])->first();
            $data['venue_id']           = $venue->venue_id;
            $data['venue_name']         = $venue->venue_name;
            $data['venue_description']  = ($venue->venue_description) ? $venue->venue_description : "";
            $data['venue_location']     = ($venue->venue_location) ? $venue->venue_location : "";
            $data['venue_latitude']     = ($venue->venue_latitude) ? $venue->venue_latitude : "";
            $data['venue_longitude']    = ($venue->venue_longitude) ? $venue->venue_longitude : "";
            $data['venue_url']          = ($venue->venue_url)       ? $venue->venue_url : "";
            $data['locality']           = ($venue->locality)        ? $venue->locality : "";
            $data['company_id']         = $company_id;
            $data['created_at']         = $venue->created_at;
            $data['user_id']            = $user_id;
            $data['image']              = ($vi)     ? $base_path_img . $vi->image : "";
            $data['pay_with_points']    = ($vi)     ? $vi->pay_with_points : 0;
            $data['subscrition']        = ($sub)    ? 1 : 0;
            $data['store']              = (new BaseRestController())->getVenueAllStores($venue->venue_id,$venue->company_id);
            // operating hours
            $operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue->venue_id)->get();
            $final_array = array();
            if ($operating_hours) {
                $hours = array();
                foreach ($operating_hours as $ope_hours) {
                    $hours['day'] = $ope_hours->days;
                    $hours['is_open'] = $ope_hours->is_open;
                    $hours['start_hours'] = date("g:i a", strtotime($ope_hours->start_time));
                    $hours['end_hours'] = date("g:i a", strtotime($ope_hours->end_time));
                    array_push($final_array, $hours);
                }
            }
            $data['operating_hours'] = $final_array;
            $venue_details_flag = DB::table('venue_details_flag')->where('venue_id', $venue->venue_id)->get();
            $data['venue_details_flag'] = $venue_details_flag;
            $app_skinning = DB::table('app_skinning')->where('venue_id', $venue->venue_id)->first();

            if($app_skinning){
                $skin = (object) [];
                $venue_skinArr = json_decode($app_skinning->json);

                $bg_color_exp       = explode('#' , $venue_skinArr->bg_color);
                $txt_color_exp      = explode('#' , $venue_skinArr->txt_color);
                $btn_color_exp      = explode('#' , $venue_skinArr->btn_color);
                $hl_color_exp       = explode('#' , $venue_skinArr->hl_color);
                $low_color_exp      = explode('#' , $venue_skinArr->low_color);
                $line_color_exp     = explode('#' , $venue_skinArr->line_color);

                $skin->venue_logo   = $venue_skinArr->venue_logo;
                $skin->bg_color     = $bg_color_exp[1];
                $skin->txt_color    = $txt_color_exp[1];
                $skin->btn_color    = $btn_color_exp[1];
                $skin->hl_color     = $hl_color_exp[1];
                $skin->low_color    = $low_color_exp[1];
                $skin->line_color   = $line_color_exp[1];
                $data['venue_skin'] = $skin;

            }else{
                $data['venue_skin'] = array('venue_logo' => $data['image'] , 'bg_color' => '000000' , 'txt_color' => 'FFFFFF' , 'btn_color' => '5c5c5c' , 'hl_color' => '5c5c5c' , 'low_color' => 'FFFFFF' , 'line_color' => 'FFFFFF' );
            }
            $data_venues[] = $data;
        }

        return $data_venues;
    }//..... end of getVenuesList() ......//

    /**
     * @param $venue_id
     * @param $company_id
     * @param $user_id
     * @return mixed
     * venue_id and company_id are mandatory.
     * user_id used just for showing user's subscription.
     */
    public function getVenueById($venue_id, $company_id, $user_id)
    {
        $base_path_img = url('/') . '/venues/';
        $venue = Venue::where(['company_id' => $company_id, "venue_id" => $venue_id])->select(["id", "venue_id", "venue_name", "venue_description", "address as venue_location", "venue_latitude", "venue_longitude", "venue_url", "company_id", "created_at", "user_id", "mobile", "address", "website", "additional_information", "locality"])->first();

        if ($venue) {
            if (empty($venue->venue_description))
                $venue->venue_description = "";

            if (empty($venue->mobile))
                $venue->mobile = "";

            if (empty($venue->address))
                $venue->address = "";

            if (empty($venue->website))
                $venue->website = "";

            if (empty($venue->additional_information))
                $venue->additional_information = "";

            if (empty($venue->locality))
                $venue->locality = "";

            if (empty($venue->venue_url))
                $venue->venue_url = "";

            $vi = VenueImage::select(["image", "pay_with_points"])->where(['venue_id' => $venue->venue_id, "company_id" => $company_id])->first();
            $venue->image               = ($vi) ? $base_path_img . $vi->image : "";
            $venue->pay_with_points     = ($vi) ? $vi->pay_with_points : 0;
            $sub = VenueSubscription::select('persona_id')->where(["user_id" => $user_id, "venue_id" => $venue->venue_id, "company_id" => $company_id])->first();
            $venue->subscrition         = ($sub) ? 1 : 0;
			$venue->persona_id          =  ($sub) ? $sub->persona_id : 0;
            $venue->venue_description   = ($venue->venue_description) ? $venue->venue_description : "";
            $venue->venue_location      = ($venue->venue_location) ? $venue->venue_location : "";
            $venue->venue_url           = ($venue->venue_url) ? $venue->venue_url : "";
            $venue->user_id             = $user_id;
            $operating_hours            = DB::table('venue_operating_hours')->where('venue_id', $venue_id)->get();
            $final_array                = array();

            if ($operating_hours) {
                $hours = array();
                foreach ($operating_hours as $ope_hours) {
                    $hours['day']           = $ope_hours->days;
                    $hours['is_open']       = $ope_hours->is_open;
                    $hours['start_hours']   = date("g:i a", strtotime($ope_hours->start_time));
                    $hours['end_hours']     = date("g:i a", strtotime($ope_hours->end_time));
                    array_push($final_array, $hours);
                }
            }//.... end if() .....//

            $venue->operating_hours = $final_array;
            $venue_details_flag = DB::table('venue_details_flag')->where('venue_id', $venue_id)->get();
            $venue->venue_details_flag = $venue_details_flag;
            $app_skinning = DB::table('app_skinning')->where('venue_id', $venue_id)->first();

            if($app_skinning){
                $skin = (object) [];
                $venue_skinArr = json_decode($app_skinning->json);

                $bg_color_exp       = explode('#' , $venue_skinArr->bg_color);
                $txt_color_exp      = explode('#' , $venue_skinArr->txt_color);
                $btn_color_exp      = explode('#' , $venue_skinArr->btn_color);
                $hl_color_exp       = explode('#' , $venue_skinArr->hl_color);
                $low_color_exp      = explode('#' , $venue_skinArr->low_color);
                $line_color_exp     = explode('#' , $venue_skinArr->line_color);

                $skin->venue_logo   = $venue_skinArr->venue_logo;
                $skin->bg_color     = $bg_color_exp[1];
                $skin->txt_color    = $txt_color_exp[1];
                $skin->btn_color    = $btn_color_exp[1];
                $skin->hl_color     = $hl_color_exp[1];
                $skin->low_color    = $low_color_exp[1];
                $skin->line_color   = $line_color_exp[1];
                $venue->venue_skin  = $skin;

            }else{
                $venue->venue_skin  = array('venue_logo' => $venue->image , 'bg_color' => '000000' , 'txt_color' => 'FFFFFF' , 'btn_color' => '5c5c5c' , 'hl_color' => '5c5c5c' , 'low_color' => 'FFFFFF' , 'line_color' => 'FFFFFF' );
            }//..... end if-else() .....//

        }//..... end if() .....//
        return $venue;
    }//..... end of getVenueById() .....//

    /**
     * @param $data
     * @param string $msg
     * @param bool $status
     * @return \Illuminate\Http\JsonResponse
     * Get Response json.
     */
    protected function getResponse($data, $msg = "", $status = true)
    {
        return response()->json(['status' => $status, "message" => $msg, "data" => $data]);
    }//..... end of getResponse() .....//



    public function getVenuesListByID($company_id, $user_id,$venueID)
    {
        $base_path_img = config('constant.base_path_img') . '/public/venues/';
        $venues = DB::table('venues')->select("id as venue_id", "venue_name", "venue_description", "address as venue_location", "venue_latitude", "venue_longitude", "venue_url", "company_id", "created_at", "user_id", "locality")->where('company_id', $company_id)->get();
        $data_venues = array();
        foreach ($venues as $venue) {
            $sub = VenueSubscription::where(["user_id" => $user_id, "venue_id" => $venue->venue_id, "company_id" => $company_id])->first();

            //if (count($sub) == 0) {
            if(empty($sub)){
                $vi = VenueImage::select(["image", "pay_with_points"])->where(['venue_id' => $venue->venue_id, "company_id" => $company_id])->first();
                $data['venue_id']           = $venue->venue_id;
                $data['venue_name']         = $venue->venue_name;
                $data['venue_description']  = ($venue->venue_description) ? $venue->venue_description : "";
                $data['venue_location']     = ($venue->venue_location) ? $venue->venue_location : "";
                $data['venue_latitude']     = ($venue->venue_latitude) ? $venue->venue_latitude : "";
                $data['venue_longitude']    = ($venue->venue_longitude) ? $venue->venue_longitude : "";
                $data['venue_url']          = ($venue->venue_url)       ? $venue->venue_url : "";
                $data['locality']           = ($venue->locality)        ? $venue->locality : "";
                $data['company_id']         = $company_id;
                $data['created_at']         = $venue->created_at;
                $data['user_id']            = $user_id;
                $data['image']              = ($vi)     ? $base_path_img . $vi->image : "";
                $data['pay_with_points']    = ($vi)     ? $vi->pay_with_points : 0;
                $data['subscrition']        = ($sub)    ? 1 : 0;
                $data['store'] = $stores = (new BaseRestController())->getVenueAllStores($venue->venue_id,$venue->company_id);
                // operating hours
                $operating_hours = DB::table('venue_operating_hours')->where('venue_id', $venue->venue_id)->get();
                $final_array = array();
                if ($operating_hours) {
                    $hours = array();
                    foreach ($operating_hours as $ope_hours) {
                        $hours['day'] = $ope_hours->days;
                        $hours['is_open'] = $ope_hours->is_open;
                        $hours['start_hours'] = date("g:i a", strtotime($ope_hours->start_time));
                        $hours['end_hours'] = date("g:i a", strtotime($ope_hours->end_time));
                        array_push($final_array, $hours);
                    }
                }
                $data['operating_hours'] = $final_array;
                $venue_details_flag = DB::table('venue_details_flag')->where('venue_id', $venue->venue_id)->get();
                $data['venue_details_flag'] = $venue_details_flag;
                $app_skinning = DB::table('app_skinning')->where('venue_id', $venue->venue_id)->first();

                if($app_skinning){
                    $skin = (object) [];
                    $venue_skinArr = json_decode($app_skinning->json);

                    $bg_color_exp       = explode('#' , $venue_skinArr->bg_color);
                    $txt_color_exp      = explode('#' , $venue_skinArr->txt_color);
                    $btn_color_exp      = explode('#' , $venue_skinArr->btn_color);
                    $hl_color_exp       = explode('#' , $venue_skinArr->hl_color);
                    $low_color_exp      = explode('#' , $venue_skinArr->low_color);
                    $line_color_exp     = explode('#' , $venue_skinArr->line_color);

                    $skin->venue_logo   = $venue_skinArr->venue_logo;
                    $skin->bg_color     = $bg_color_exp[1];
                    $skin->txt_color    = $txt_color_exp[1];
                    $skin->btn_color    = $btn_color_exp[1];
                    $skin->hl_color     = $hl_color_exp[1];
                    $skin->low_color    = $low_color_exp[1];
                    $skin->line_color   = $line_color_exp[1];
                    $data['venue_skin'] = $skin;

                }else{
                    $data['venue_skin'] = array('venue_logo' => $data['image'] , 'bg_color' => '000000' , 'txt_color' => 'FFFFFF' , 'btn_color' => '5c5c5c' , 'hl_color' => '5c5c5c' , 'low_color' => 'FFFFFF' , 'line_color' => 'FFFFFF' );
                }
                $data_venues[] = $data;
            }
        }

        return $data_venues;
    }//..... end of getVenuesList() ......//



}//..... end of class.