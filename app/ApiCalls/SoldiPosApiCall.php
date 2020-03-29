<?php

namespace App\ApiCalls;

use App\Models\AutoCheckout;
use App\Models\AutoOrderPlacement;
use App\models\User;
use App\Models\VenueShops;
use App\UnifiedDbModels\Order;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use App\Models\Venue;
use App\Models\StoreInformation;
use DB;
use App\Models\FavoriteProduct;
use App\classes\CommonLibrary;
use App\Models\News;
use App\Models\FuelStation;
use App\Models\FavouriteNews;
use App\Facade\SoldiLog;
use App\Hooks\OrderHook;
use Carbon\Carbon;
use App\UnifiedDbModels\Store;
use App\User as Users;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class SoldiPosApiCall extends BasePosApiCall
{
    /*sonar constants*/
    const COMPANY_ID                = 'company_id';
    const VENUE_ID                = 'venue_id';
    const STORE_NEWS_ID                = 'store_news_id';
    const STORE_BUSINESS_URL                = '/business/store?business_id=';
    const STATUS                = 'status';
    const BUSINESS_ID                = 'business_id';
    const BUSINESS_NAME                = 'business_name';
    const BUSINESS_EMAIL                = 'business_email';
    const BUSINESS_ACCOUNT_TYPE                = 'business_account_type';
    const BUSINESS_MOBILE                = 'business_mobile';
    const BUSINESS_LOCATION                = 'business_location';
    const BUSINESS_DETAIL                = 'BUSINESS_DETAIL';
    const USER_ID                = 'user_id';
    const BUSINESS_DETAIL_INFO                = 'business_detail_info';
    const STORE_POINTS                = 'store_points';
    const BG_IMG                = 'http://superportal.darkwing.io/public/news/gif_images/5afeb26ebd1a2.jpeg';
    const BG_IMGS                = 'bg_images';
    const BUSINESS_IMAGE                = 'business_image';
    const IMAGES                = 'images';
    const STORE_SETTINGS_URL                = '/business/store_settings?business_id=';
    const BUSINESS_SETTINGS                = 'business_settings';
    const POS_CATEGORY_URL                = '/pos/category?business_id=';
    const CAT_ID                = 'cate_id';
    const CAT_NAME                = 'cate_name';
    const CAT_IMAGE                = 'cate_image';
    const CAT_COLOR                = 'cate_color';
    const CAT_TYPE                = 'cate_type';
    const CAT_DETAIL                = 'cate_detail';
    const DISPLAY_PRIORITY                = 'displaypriority';
    const CAT_POINTS                = 'cat_points';
    const CATEGORIES                = 'categories';
    const MESSAGE                = 'message';
    const INVALID_API_SECRET                = 'invalid Api key and secret.';
    const DATA_FOUND                = 'data found.';
    const IS_VENUE                = 'is_venue';
    const SHOP_ID                = 'shop_id';
    const DELIVERY_COST                = 'delivery_cost';
    const COUNTRY                = 'country';
    const STORE_ID                = 'store_id';
    const STALL                = 'stall';
    const NO_DATA_FOUND                = 'No data found';
    const SERVER_ERROR                = 'Server error!';
    const ADDRESS                = 'address';
    const NEWS_ID                = 'news_id';
    const CREATED_AT                = 'created_at';
    const PAYMENT                = 'payment';
    const CARD_DETAIL                = 'card_detail';
    const IS_REDEEM                = 'is_redeem';
    const CUSTOMER_ID                = 'customer_id';
    const ORDER_REAL_AMOUNT                = 'order_real_amount';
    const REDEEM_POINTS                = 'redeem_points';
    const PAYMENT_BY                = 'payment_by';
    const SOLDI_ID                = 'soldi_id';
    const ORDER_ID                = 'order_id';
    const TRANSACTION_ID                = 'transaction_id';
    const TOTAL_AMOUNT                = 'total_amount';
    const ORDER_ITEMS                = 'order_items';
    const PRODUCT_ID                = 'product_id';
    const ORD_DATE                = 'ord_date';
    const VALUE                = 'value';
    const ORD_TYPE                = 'ord_type';
    const DEVICE_MODEL                = 'device_model';
    const VENUE_IMAGE                = 'venue_image';
    const DEVICE_NAME                = 'device_name';
    const IS_ACKNOWLEDGE                = 'is_acknowledge';
    const VAT_LABEL                = 'vat_label';
    const VAT_AMOUNT                = 'vat_amount';
    const COUNTRY_ID                = 'country_id';
    const VALUE_POINTS                = 'value_points';
    const AMOUNT_DUE                = 'amount_due';
    const VOUCHER_CODE                = 'voucher_code';
    const TRANS_SUCCESSFUL                = 'Transaction Successful';
    const STATUS_POINTS                = 'status_points';
    const POINTS_VALUE                = 'points_value';
    const ORDER_PIN_LOCATION                = 'order_pin_location';
    const PAY_WITH_POINTS                = 'pay_with_points';

    private $common_library;

    public function __construct()
    {
        parent::__construct();
        $this->common_library = new CommonLibrary();
    }

    protected $fileName = 'SoldiPosApiCall.php';


    public function getVenuesFromSoldi($options = array())
    {
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        $arr = array();
        $client = new Client();
        $company_id = $options[self::COMPANY_ID];
        $venue_id = $options[self::VENUE_ID];
        $beacon_Api_key = $options['beacon_Api_key'];
        $SOLDI_API_KEY = $options['SOLDI_API_KEY'];
        $SOLDI_SECRET = $options['SOLDI_SECRET'];
        $SOLDI_DEFAULT_PATH = $options['SOLDI_DEFAULT_PATH'];

        $venue_id;
        $store_venues = Venue::where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->get()->toArray();
        if ($store_venues) {
            $da_array = array();
            $client1 = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $SOLDI_API_KEY,
                    'SECRET' => $SOLDI_SECRET
                ]
            ]);
            foreach ($store_venues as $store) {
                $image_arr = array();
                $business_id = $store[self::STORE_NEWS_ID];
                $venue_id = $store[self::VENUE_ID];
                try {

                    $response = $client1->get($SOLDI_DEFAULT_PATH . self::STORE_BUSINESS_URL . $business_id);
                    $result = $response->getBody();
                    $store_array = json_decode($result);
                    $store_data = $store_array->data;
                    $business_api_key = $store_data[0]->business_api_key;
                    $business_secret = $store_data[0]->business_secret;

                    $business_id = $store_data[0]->business_id;
                    $business_name = $store_data[0]->business_name;
                    $business_email = $store_data[0]->business_email;
                    $business_account_type = $store_data[0]->business_account_type;
                    $business_mobile = $store_data[0]->business_mobile;
                    $location = $store_data[0]->business_location;
                    $business_detail = $store_data[0]->business_detail;
                    $business_detail_info = $store_data[0]->business_detail_info;
                    $user_id = $store_data[0]->user_id;
                    if ($location != '0') {
                        $business_location = $location;
                    } else {
                        $business_location = 'N/A';
                    }
                    $rule_for_store = 3;
                    $rules_array_store = BasePosApiCall::get_allRules($business_id, $rule_for_store, $company_id, $venue_id);
                    if ($rules_array_store[self::STATUS] == 1) {
                        $rules_store_data = $rules_array_store['data'];
                    } else {
                        $rules_store_data = '';
                    }

                    $bus_array[self::BUSINESS_ID] = $business_id;
                    $bus_array[self::BUSINESS_NAME] = $business_name;
                    $bus_array[self::BUSINESS_EMAIL] = $business_email;
                    $bus_array[self::BUSINESS_ACCOUNT_TYPE] = $business_account_type;
                    $bus_array[self::BUSINESS_MOBILE] = $business_mobile;
                    $bus_array[self::BUSINESS_LOCATION] = $business_location;
                    $bus_array[self::USER_ID] = $user_id;
                    $bus_array[self::BUSINESS_DETAIL] = $business_detail;
                    $bus_array[self::BUSINESS_DETAIL_INFO] = $business_detail_info;
                    $points_array = BasePosApiCall::searchstore($business_id, $rules_store_data);
                    $bus_array[self::STORE_POINTS] = $points_array;
                    if ($store_data[0]->business_bg) {
                        $timage = $store_data[0]->business_bg;
                        $bg_image = $timage->thumb1;
                    } else {
                        $bg_image = self::BG_IMG;
                    }
                    $bus_array[self::BG_IMGS] = $bg_image;
                    if ($store_data[0]->business_image) {
                        $timage = $store_data[0]->business_image;
                        $bus_image = $timage->thumb1;
                    } else {
                        $bus_image = self::BG_IMG;
                    }
                    $business_image = self::BG_IMG;
                    $bus_image1 = $business_image;
                    $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image);
                    $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
                    $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
                    $bus_array[self::IMAGES] = $image_arr;

                    $res_setting = $client->request('GET', $SOLDI_DEFAULT_PATH . self::STORE_SETTINGS_URL . $business_id, [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'X-API-KEY' => $business_api_key,
                            'SECRET' => $business_secret
                        ]
                    ]);
                    $sittings_array = $res_setting->getBody();
                    $sitting_data = json_decode($sittings_array);
                    $settings_arr = $sitting_data->data;
                    $bus_array[self::BUSINESS_SETTINGS] = $settings_arr;

                    $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . self::POS_CATEGORY_URL . $business_id, [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'X-API-KEY' => $business_api_key,
                            'SECRET' => $business_secret
                        ]
                    ]);
                    $cat_array = $res_cat->getBody();
                    $cat_data = json_decode($cat_array);
                    $category_arr = $cat_data->data;
                    $cate_array = array();
                    $rule_for = 1;
                    $rules_array = BasePosApiCall::get_allRules($business_id, $rule_for, $company_id, $venue_id);
                    if ($rules_array[self::STATUS] == 1) {
                        $rules_data = $rules_array['data'];
                    } else {
                        $rules_data = '';
                    }

                    foreach ($category_arr as $cat_row) {

                        $cate_id = $cat_row->cate_id;
                        $cate_name = $cat_row->cate_name;
                        $cate_image = $cat_row->cate_image;
                        $cate_color = $cat_row->cate_color;
                        $cate_detail = $cat_row->cate_detail;
                        $displaypriority = $cat_row->displaypriority;

                        $cat_arr[self::CAT_ID] = $cate_id;
                        $cat_arr[self::CAT_NAME] = $cate_name;
                        if ($cate_image) {
                            $cat_arr[self::CAT_IMAGE] = $cate_image->image;
                        } else {
                            $cat_arr[self::CAT_IMAGE] = '';
                        }
                        $cat_arr[self::CAT_COLOR] = $cate_color;
                        $cat_arr[self::CAT_TYPE] = $cat_row->cate_type;
                        $cat_arr[self::CAT_DETAIL] = $cate_detail;
                        $cat_arr[self::DISPLAY_PRIORITY] = $displaypriority;
                        $points_array = BasePosApiCall::searchcategory($cate_id, $rules_data);
                        $cat_arr[self::CAT_POINTS] = $points_array;
                        $cate_array[] = $cat_arr;
                    }
                    $bus_array[self::CATEGORIES] = $cate_array;
                    $da_array[] = $bus_array;

                } catch (RequestException $e) {

                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = self::INVALID_API_SECRET;
                    return json_encode($arr);
                }

            }
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = self::DATA_FOUND;
            $arr[self::IS_VENUE] = false;
            $arr['data'] = $da_array;
            $arr[self::VENUE_ID] = $venue_id;
            return json_encode($arr);
        } else {
            $res = $client->request('GET', $Beacons_AP1_URL . '/venues', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $beacon_Api_key,
                ]
            ]);
            $result = $res->getBody();
            $venue_arr = json_decode($result);
            $arr[self::STATUS] = true;
            $arr[self::MESSAGE] = 'Venues are found.';
            $arr[self::IS_VENUE] = true;
            $arr['data'] = $venue_arr->data;
            return json_encode($arr);
        }

    }

    public function getAllStoreFromSoldi($params = [])
    {
        extract($params);

        $client = new Client();
        // Soldi Api's and Url
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $store_venues = VenueShops::where(self::VENUE_ID, '=', $params[self::VENUE_ID])->get()->toArray();

        $SOLDI_API_KEY = config('constant.SOLDI_API_KEY');
        $SOLDI_SECRET = config('constant.SOLDI_SECRET');
        $da_array = array();
        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        $image_arr = array();
        try {
            foreach ($store_venues as $value) {
                $response = $client1->get($SOLDI_DEFAULT_PATH . self::STORE_BUSINESS_URL . $value[self::SHOP_ID]);

                $result = $response->getBody();
                $store_array = json_decode($result);
                $store_data = $store_array->data;
                $business_api_key = $store_data[0]->business_api_key;
                $business_secret = $store_data[0]->business_secret;
                $business_id = $store_data[0]->business_id;
                $business_name = $store_data[0]->business_name;
                $business_email = $store_data[0]->business_email;
                $business_account_type = $store_data[0]->business_account_type;
                $business_mobile = $store_data[0]->business_mobile;
                $location = $store_data[0]->business_location;
                $business_detail = $store_data[0]->business_detail;
                $business_detail_info = $store_data[0]->business_detail_info;
                $user_id = $store_data[0]->user_id;

                $street_1 = $store_data[0]->street_1;
                $street_2 = $store_data[0]->street_2;
                $city = $store_data[0]->city;
                $region = $store_data[0]->region;
                $country = $store_data[0]->country;
                $code = $store_data[0]->code;
                $business_location = $store_data[0]->business_location;
                $business_owner = $store_data[0]->business_owner;
                $primary_contact_name = $store_data[0]->primary_contact_name;
                $business_image = $store_data[0]->business_image;
                $bus_array[self::DELIVERY_COST] = $store_data[0]->delivery_cost ?? "Could not get From Soldi";
                $bus_array["multi_buy"] = $store_data[0]->multibuys ?? "Could not get From Soldi";

                if ($location != '0') {
                    $business_location = $location;
                } else {
                    $business_location = 'N/A';
                }
                $rule_for_store = 3;
                $rules_array_store = BasePosApiCall::get_allRules($business_id, $rule_for_store, $company_id, 'test');

                if ($rules_array_store[self::STATUS] == 1) {
                    $rules_store_data = $rules_array_store['data'];
                } else {
                    $rules_store_data = '';
                }

                $bus_array[self::BUSINESS_ID] = $business_id;
                $bus_array[self::BUSINESS_NAME] = $business_name;
                $bus_array[self::BUSINESS_EMAIL] = $business_email;
                $bus_array[self::BUSINESS_ACCOUNT_TYPE] = $business_account_type;
                $bus_array[self::BUSINESS_MOBILE] = $business_mobile;
                $bus_array[self::BUSINESS_LOCATION] = $business_location;
                $bus_array[self::USER_ID] = $user_id;
                $bus_array[self::BUSINESS_DETAIL] = $business_detail;
                $bus_array[self::BUSINESS_DETAIL_INFO] = $business_detail_info;
                $bus_array["street_1"] = $street_1;
                $bus_array["street_2"] = $street_2;
                $bus_array["city"] = $city;
                $bus_array["region"] = $region;
                $bus_array[self::COUNTRY] = $country;
                $bus_array["code"] = $code;
                $bus_array[self::BUSINESS_LOCATION] = $business_location;
                $bus_array["business_owner"] = $business_owner;
                $bus_array["primary_contact_name"] = $primary_contact_name;
                $bus_array[self::BUSINESS_IMAGE] = $business_image;


                $store_info = StoreInformation::where(self::STORE_ID, $business_id)->first();

                $store_map = '';
                if ($store_info) {
                    $store_map = config('constant.base_path_img') . '/public/maps/' . $store_info->store_map;
                }

                $bus_array["store_map"] = $store_map;
                $store_stall = StoreInformation::where(self::STORE_ID, $business_id)->first();
                $bus_array[self::STALL] = '';
                if ($store_stall) {
                    $bus_array[self::STALL] = $store_stall->stall_no;
                }
                $points_array = BasePosApiCall::searchstore($business_id, $rules_store_data);
                $bus_array[self::STORE_POINTS] = $points_array;
                if ($store_data[0]->business_bg) {
                    $timage = $store_data[0]->business_bg;
                    $bg_image = $timage->image;
                } else {
                    $bg_image = self::BG_IMG;
                }
                $bus_array[self::BG_IMGS] = $bg_image;
                if ($store_data[0]->business_image) {
                    $timage = $store_data[0]->business_image;
                    $bus_image = $timage->thumb1;
                } else {
                    $bus_image = self::BG_IMG;
                }
                $business_image = self::BG_IMG;
                $bus_image1 = $business_image;
                $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image);
                $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
                $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
                $bus_array[self::IMAGES] = $image_arr;

                $res_setting = $client->request('GET', $SOLDI_DEFAULT_PATH . self::STORE_SETTINGS_URL . $business_id, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $business_api_key,
                        'SECRET' => $business_secret
                    ]
                ]);

                $sittings_array = $res_setting->getBody();
                $sitting_data = json_decode($sittings_array);
                $settings_arr = $sitting_data->data;
                $bus_array[self::BUSINESS_SETTINGS] = $settings_arr;

                $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . self::POS_CATEGORY_URL . $business_id, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $business_api_key,
                        'SECRET' => $business_secret
                    ]
                ]);
                $cat_array = $res_cat->getBody();
                $cat_data = json_decode($cat_array);
                $category_arr = $cat_data->data;
                $cate_array = array();
                $rule_for = 1;


                $rules_array = BasePosApiCall::get_allRules($business_id, $rule_for, $company_id, $venue_id);
                if ($rules_array[self::STATUS] == 1) {
                    $rules_data = $rules_array['data'];
                } else {
                    $rules_data = '';
                }

                foreach ($category_arr as $cat_row) {

                    $cate_id = $cat_row->cate_id;
                    $cate_name = $cat_row->cate_name;
                    $cate_image = $cat_row->cate_image;
                    $cate_color = $cat_row->cate_color;
                    $cate_detail = $cat_row->cate_detail;
                    $displaypriority = $cat_row->displaypriority;

                    $cat_arr[self::CAT_ID] = $cate_id;
                    $cat_arr[self::CAT_NAME] = $cate_name;
                    if ($cate_image) {
                        $cat_arr[self::CAT_IMAGE] = $cate_image->image;
                    } else {
                        $cat_arr[self::CAT_IMAGE] = '';
                    }
                    $cat_arr[self::CAT_COLOR] = $cate_color;
                    $cat_arr[self::CAT_TYPE] = $cat_row->cate_type;
                    $cat_arr[self::CAT_DETAIL] = $cate_detail;
                    $cat_arr[self::DISPLAY_PRIORITY] = $displaypriority;
                    $points_array = $this->searchcategory($cate_id, $rules_data);
                    $cat_arr[self::CAT_POINTS] = $points_array;
                    $cate_array[] = $cat_arr;
                }
                $bus_array[self::CATEGORIES] = $cate_array;
                $da_array[] = $bus_array;
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr[self::IS_VENUE] = true;

                $arr['data'] = $da_array;

            }
            return $da_array;

        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::INVALID_API_SECRET;

            return $arr;

        }

    }

    /**
     * @param array $options
     * Get All products of specific business.
     */

    public function getAllProducts($cate_id, $company_id)
    {
        // Soldi Api's and Url
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $SOLDI_API_KEY = config('constant.SOLDI_API_KEY');
        $SOLDI_SECRET = config('constant.SOLDI_API_KEY');
        $client = new Client();

        try {
            $res_pro = $client->request('GET', $SOLDI_DEFAULT_PATH . '/inventory/list?cate_id=' . $cate_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $SOLDI_API_KEY,
                    'SECRET' => $SOLDI_SECRET
                ]
            ]);
            $pro_result = $res_pro->getBody();

            $products_array = json_decode($pro_result);
            if ($products_array->status) {
                $product_data = $products_array->data;
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $product_data;
                return $arr;
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                return $arr;
            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::INVALID_API_SECRET;
            return $arr;
        }
    }


    public function searchProductsFromSoldi($params)
    {
        extract($params);
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');

        $responce_set = $this->common_library->getCompanySittings($company_id);
        $bussness_id = $responce_set->business_id;
        $SOLDI_API_KEY = $responce_set->soldi_api_key;
        $SOLDI_SECRET = $responce_set->soldi_api_secret;


        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);

        try {

            $response = $client1->get($SOLDI_DEFAULT_PATH . '/inventory/search?searchkey=' . $searchKey . '&id=' . $bussness_id . '&type=' . $type);
            $product_array = $response->getBody();
            $pro_data = json_decode($product_array);
            $product_data = $pro_data->data;
            $status = $pro_data->status;
            if ($status) {
                foreach ($product_data as $p_data) {

                    $pro_responce = BasePosApiCall::getSingleStoreInfo($p_data->business_id, $company_id);
                    $store_data = $pro_responce['data'];
                    $p_data->store_data = $store_data;
                    $final_array[] = $p_data;
                }

                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $final_array;
                return json_encode($arr);

            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                return json_encode($arr);
            }


        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;
            return json_encode($arr);
        }

    }

    public function getStoreCategoryFromSoldi($params)
    {

        $client = new Client();
        extract($params);

        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $SOLDI_API_KEY = config('constant.SOLDI_API_KEY');
        $SOLDI_SECRET = config('constant.SOLDI_SECRET');

        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {
            $business_id = 518;
            $response = $client1->get($SOLDI_DEFAULT_PATH . self::STORE_BUSINESS_URL . $business_id);
            $result = $response->getBody();
            $store_array = json_decode($result);
            $store_data = $store_array->data;
            $business_api_key = $store_data[0]->business_api_key;
            $business_secret = $store_data[0]->business_secret;

            $business_id = $store_data[0]->business_id;
            $business_name = $store_data[0]->business_name;
            $business_email = $store_data[0]->business_email;
            $business_account_type = $store_data[0]->business_account_type;
            $business_mobile = $store_data[0]->business_mobile;
            $location = $store_data[0]->business_location;
            $business_detail = $store_data[0]->business_detail;
            $business_detail_info = $store_data[0]->business_detail_info;
            $user_id = $store_data[0]->user_id;
            if ($location != '0') {
                $business_location = $location;
            } else {
                $business_location = 'N/A';
            }
            $rule_for_store = 3;
            $rules_array_store = BasePosApiCall::get_allRules($business_id, $rule_for_store, $company_id, $venue_id);
            if ($rules_array_store[self::STATUS] == 1) {
                $rules_store_data = $rules_array_store['data'];
            } else {
                $rules_store_data = '';
            }

            $bus_array[self::BUSINESS_ID] = $business_id;
            $bus_array[self::BUSINESS_NAME] = $business_name;
            $bus_array[self::BUSINESS_EMAIL] = $business_email;
            $bus_array[self::BUSINESS_ACCOUNT_TYPE] = $business_account_type;
            $bus_array[self::BUSINESS_MOBILE] = $business_mobile;
            $bus_array[self::BUSINESS_LOCATION] = $business_location;
            $bus_array[self::USER_ID] = $user_id;
            $bus_array[self::BUSINESS_DETAIL] = $business_detail;
            $bus_array[self::BUSINESS_DETAIL_INFO] = $business_detail_info;
            $points_array = BasePosApiCall::searchstore($business_id, $rules_store_data);
            $bus_array[self::STORE_POINTS] = $points_array;
            if ($store_data[0]->business_bg) {
                $timage = $store_data[0]->business_bg;
                $bg_image = $timage->thumb1;
            } else {
                $bg_image = self::BG_IMG;
            }
            $bus_array[self::BG_IMGS] = $bg_image;
            if ($store_data[0]->business_image) {
                $timage = $store_data[0]->business_image;
                $bus_image = $timage->thumb1;
            } else {
                $bus_image = self::BG_IMG;
            }
            $business_image = self::BG_IMG;
            $bus_image1 = $business_image;
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $bus_array[self::IMAGES] = $image_arr;

            $res_setting = $client->request('GET', $SOLDI_DEFAULT_PATH . self::STORE_SETTINGS_URL . $business_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $business_api_key,
                    'SECRET' => $business_secret
                ]
            ]);
            $sittings_array = $res_setting->getBody();
            $sitting_data = json_decode($sittings_array);
            $settings_arr = $sitting_data->data;
            $bus_array[self::BUSINESS_SETTINGS] = $settings_arr;

            $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . self::POS_CATEGORY_URL . $business_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $business_api_key,
                    'SECRET' => $business_secret
                ]
            ]);
            $cat_array = $res_cat->getBody();
            $cat_data = json_decode($cat_array);
            $category_arr = $cat_data->data;
            $cate_array = array();
            $rule_for = 1;
            $rules_array = BasePosApiCall::get_allRules($business_id, $rule_for, $company_id, $venue_id);
            if ($rules_array[self::STATUS] == 1) {
                $rules_data = $rules_array['data'];
            } else {
                $rules_data = '';
            }

            foreach ($category_arr as $cat_row) {

                $cate_id = $cat_row->cate_id;
                $cate_name = $cat_row->cate_name;
                $cate_image = $cat_row->cate_image;
                $cate_color = $cat_row->cate_color;
                $cate_detail = $cat_row->cate_detail;
                $displaypriority = $cat_row->displaypriority;

                $cat_arr[self::CAT_ID] = $cate_id;
                $cat_arr[self::CAT_NAME] = $cate_name;
                if ($cate_image) {
                    $cat_arr[self::CAT_IMAGE] = $cate_image->image;
                } else {
                    $cat_arr[self::CAT_IMAGE] = '';
                }
                $cat_arr[self::CAT_COLOR] = $cate_color;
                $cat_arr[self::CAT_TYPE] = $cat_row->cate_type;
                $cat_arr[self::CAT_DETAIL] = $cate_detail;
                $cat_arr[self::DISPLAY_PRIORITY] = $displaypriority;
                $points_array = BasePosApiCall::searchcategory($cate_id, $rules_data);
                $cat_arr[self::CAT_POINTS] = $points_array;
                $cate_array[] = $cat_arr;
            }
            $bus_array[self::CATEGORIES] = $cate_array;

            $da_array[] = $bus_array;
            if (!empty($da_array)) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $da_array;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
                return json_encode($arr);
            }
        } catch (RequestException $e) {

            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::INVALID_API_SECRET;
            return json_encode($arr);
        }

    }

    public function sliderDataFromSoldi($options = array())
    {

        $company_id = $options[self::COMPANY_ID];
        $SOLDI_API_KEY = $options['SOLDI_API_KEY'];
        $SOLDI_SECRET = $options['SOLDI_SECRET'];
        $SOLDI_DEFAULT_PATH = $options['SOLDI_DEFAULT_PATH'];
        $user_id = $options[self::USER_ID];

        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {

            $response = $client1->get($SOLDI_DEFAULT_PATH . '/business/store');
            $result = $response->getBody();
            $soldi_arr = json_decode($result);
            $soldi_data = $soldi_arr->data;
            $da_array = array();
            if ($soldi_data) {
                foreach ($soldi_data as $row) {
                    $business_id = $row->business_id;

                    $store_venues = Venue::where(self::STORE_NEWS_ID, '=', $business_id)->where(self::COMPANY_ID, '=', $company_id)->first();

                    if ($store_venues) {
                        $venue_id = $store_venues->venue_id;
                        $venue_name = $store_venues->venue_name;

                        $venues_img = DB::table(self::VENUE_IMAGE)->where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->where(self::STATUS, '=', 1)->first();

                        if ($venues_img) {
                            $venue_image = $venues_img->image;
                        } else {
                            $venue_image = '';
                        }
                        $pumps = FuelStation::where(self::COMPANY_ID, $company_id)->where(self::VENUE_ID, $venue_id)->first();
                        if ($pumps) {
                            $address = $pumps->fuel_station_address;
                        } else {
                            $address = '';
                        }

                        $bus_array[self::VENUE_ID] = $venue_id;
                        $bus_array["venue_name"] = $venue_name;
                        $bus_array[self::ADDRESS] = $address;
                        $bus_array[self::BUSINESS_ID] = $business_id;
                        $bus_array[self::BUSINESS_NAME] = $row->business_name;
                        $bus_array[self::BUSINESS_DETAIL] = $row->business_detail;
                        $bus_array["venue_image"] = url("public/venues/thumbs/thumb_$venue_image");

                        if ($row->business_bg) {
                            $timage = $row->business_bg;
                            $bg_image = $timage->thumb1;
                        } else {
                            $bg_image = self::BG_IMG;
                        }
                        $bus_array[self::BG_IMGS] = $bg_image;
                        $bus_array['type'] = 'store';
                        $bus_array['content'] = (object)array();
                        $da_array[] = $bus_array;
                    }

                }
                $Slider_news = News::select('news.news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url')
                    ->where(self::COMPANY_ID, '=', $company_id)
                    ->orderBy(self::NEWS_ID, 'desc')
                    ->limit(2)
                    ->get();
                $newsArray = [];
                foreach ($Slider_news as $news) {
                    $store_venues = Venue::where(self::STORE_NEWS_ID, '=', $business_id)->where(self::COMPANY_ID, '=', $company_id)->first();
                    $venue_id = $news->venue_id;
                    if (!empty($store_venues)) {
                        $venue_name = $store_venues->venue_name;
                    } else {
                        $venue_name = '';
                    }
                    $venues_img = DB::table(self::VENUE_IMAGE)->where(self::VENUE_ID, '=', $venue_id)->where(self::COMPANY_ID, '=', $company_id)->where(self::STATUS, '=', 1)->first();
                    if ($venues_img) {
                        $venue_image = $venues_img->image;
                    } else {
                        $venue_image = '';
                    }

                    $pumps = FuelStation::where(self::COMPANY_ID, $company_id)->where(self::VENUE_ID, $venue_id)->first();
                    if ($pumps) {
                        $address = $pumps->fuel_station_address;
                    } else {
                        $address = '';
                    }

                    $clear = strip_tags($news->news_desc);
                    $clear = html_entity_decode($clear);
                    // Strip out any url-encoded stuff
                    $clear = urldecode($clear);
                    // Replace non-AlNum characters with space
                    $clear = preg_replace('/[^A-Za-z0-9]/', ' ', $clear);
                    // Replace Multiple spaces with single space
                    $clear = preg_replace('/ +/', ' ', $clear);
                    // Trim the string of leading/trailing space
                    $clear = trim($clear);
                    $trimstring = substr($clear, 0, 100);

                    $originalDate = $news->created_at;

                    $newsarr[self::VENUE_ID] = 0;
                    $newsarr["venue_name"] = $venue_name;
                    $newsarr[self::ADDRESS] = $address;
                    $newsarr[self::BUSINESS_ID] = 0;
                    $newsarr[self::BUSINESS_NAME] = $news->news_subject;
                    $newsarr[self::BUSINESS_DETAIL] = $trimstring;
                    if ($venue_image != '') {
                        $newsarr[self::VENUE_IMAGE] = url("public/venues/thumbs/thumb_$venue_image");
                    } else {
                        $newsarr[self::VENUE_IMAGE] = '';
                    }
                    $newsarr[self::BG_IMGS] = url("public/news/$news->news_image");
                    $newsarr['type'] = 'news';

                    $contentArr[self::NEWS_ID] = $news->news_id;
                    $contentArr['news_subject'] = $news->news_subject;
                    $contentArr['news_desc'] = $trimstring;
                    $contentArr['news_image'] = $news->news_image;
                    $contentArr['news_tag'] = $news->news_tag;
                    $contentArr['news_web_detail'] = $news->news_desc;
                    $contentArr['news_url'] = $news->news_url;
                    $contentArr[self::CREATED_AT] = $news->created_at;
                    $contentArr['is_public'] = $news->is_public;
                    $contentArr[self::VENUE_ID] = $news->venue_id;
                    $news_is_favourite = 0;
                    $favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $news->news_id)->where(self::USER_ID, '=', $user_id)->where(self::COMPANY_ID, $company_id)->first();
                    if (!empty($favourite_news)) {
                        $news_is_favourite = $favourite_news->status;
                    }
                    $contentArr['news_is_favourite'] = $news_is_favourite;
                    $contentArr['news_date'] = date("d F Y", strtotime($originalDate));

                    $newsarr['content'] = $contentArr;
                    $newsArray[] = $newsarr;
                }
                $fa_array = array_merge($da_array, $newsArray);

                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = count($fa_array) . ' Stores are found.';
                $arr['data'] = $fa_array;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'no store found.';
                return json_encode($arr);
            }
        } catch (RequestException $e) {
            if ($e->getResponse()->getStatusCode() == '403') {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::INVALID_API_SECRET;
                return json_encode($arr);
            }
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }
        exit;
    }

    public function payment_processSoldi($options = [])
    {
        Log::channel(self::PAYMENT)->info('Order payload modified for soldi : ', ['data' => $options]);

        $request = $options['request'];
        $voucher_info = json_decode($request[self::CARD_DETAIL]);
        $voucher_code = $voucher_info[0]->voucher_code ?? '';
        $discount_amt = $voucher_info[0]->discount_amt ?? '';
        $items_discount = $voucher_info[0]->items_discount ?? '';
        $voucher_id = $voucher_info[0]->voucher_id ?? '';
        $is_split = 0;
        $total_points = 0;
        $points_amount = 0;
        $transaction_id = null;
        $split_array = [];
        $venue = Venue::where(self::COMPANY_ID, Config::get('constant.COMPANY_ID'))->first();
        if ($options[self::IS_REDEEM] == 1) {
            $res_array = BasePosApiCall::redeem_points($options[self::COMPANY_ID], $options[self::VENUE_ID], $request[self::CUSTOMER_ID], $request[self::ORDER_REAL_AMOUNT], $options[self::REDEEM_POINTS], $options['amplify_id']);

            Log::channel(self::PAYMENT)->info('Response Received from loyalty : ', ['data' => $res_array]);

            if ($res_array[self::STATUS]) {
                $tran_data_arr = $res_array['data'];
                $transaction_id = $tran_data_arr->transaction_id;
                $points_amount = $request[self::ORDER_REAL_AMOUNT];
                $is_split = 1;
                $total_points = $options[self::REDEEM_POINTS];
                $split_array[] = array('ordamount' => $points_amount, self::BUSINESS_ID => $request[self::BUSINESS_ID], self::PAYMENT_BY => 'eway');
                $split_array[] = array('ordamount' => $tran_data_arr->redeem_amount, self::BUSINESS_ID => $request[self::BUSINESS_ID], self::PAYMENT_BY => 'points');
                $earnedPoints = intval($points_amount / 50) * 10;
                Log::channel(self::PAYMENT)->info('Earned point in split case : ', ['data' => $earnedPoints]);

            } else {
                return [self::STATUS => false, self::MESSAGE => 'You have no enough points to continue'];
            }//..... end if() .....//
        }//..... end if() .....//

        if ($request[self::IS_REDEEM] == 0) {
            $earnedPoints = $this->loyaltyWithTransaction($request);
            Log::channel(self::PAYMENT)->info('Response Returned from loyalty for earned points calculations : ', ['data' => $earnedPoints]);

            $earnedPoints = json_decode($earnedPoints);
            $earnedPoints = $earnedPoints->total_value_points_earned ?? '';
        }

        try {
            Log::channel(self::PAYMENT)->info('Forwarding payment request to SOLDI started with final data ********************************** :) ');

            $res = $this->forwardPaymentRequestToSoldi($request, $options, $total_points, $points_amount, $is_split, $split_array, $voucher_code, $discount_amt, $items_discount, $earnedPoints ?? 0);
            if ($res->getBody()) {
                $order_arr = json_decode($res->getBody());

                Log::channel(self::PAYMENT)->info('Receive after soldi payment data ********************************** :) ', ['response' => $order_arr]);
                $pointsArray = [];
                if ($order_arr->status == 200) {
                    $this->dataForPunchCard($request);
                    if ($voucher_code != "") {
                        $this->updateUserVoucher($options, $request, $voucher_code, $voucher_id);
                    }//..... end if() .....//

                    $string_array = $order_arr->data->order_str;

                    $pointsArray[self::STORE_ID] = $request[self::BUSINESS_ID];
                    $pointsArray[self::SOLDI_ID] = $request[self::CUSTOMER_ID];
                    $pointsArray[self::USER_ID] = $request[self::CUSTOMER_ID];
                    $pointsArray[self::VENUE_ID] = $options[self::VENUE_ID] ?? $venue->venue_id;
                    $pointsArray[self::ORDER_ID] = $string_array->order_id;
                    $pointsArray[self::TRANSACTION_ID] = $string_array->transaction_id;
                    $pointsArray[self::COMPANY_ID] = $options[self::COMPANY_ID];
                    $pointsArray['transaction_date'] = $string_array->ord_date;
                    $pointsArray[self::TOTAL_AMOUNT] = ($points_amount > 0) ? $points_amount : $string_array->ord_amount;

                    $item_array = json_decode(stripslashes($request[self::ORDER_ITEMS]));

                    $pro_items_array = [];
                    foreach ($item_array as $items){
                        $pro_items_array[] = [
                            self::PRODUCT_ID => $items->prd_id,
                            'category_id' => $items->cate_id,
                            'product_qty' => $items->prd_qty,
                            'product_unit_price' => $items->prd_unitprice
                        ];
                    }

                    DB::table('sp_transations')->insertGetId([self::COMPANY_ID => $options[self::COMPANY_ID], 'ord_id' => $string_array->order_id, self::VENUE_ID => $options[self::VENUE_ID] ?? $venue->venue_id, self::BUSINESS_ID => $request[self::BUSINESS_ID], self::ORD_DATE => date('Y-m-d', $string_array->ord_date), 'ord_amount' => $string_array->ord_amount]);
                    Log::channel(self::PAYMENT)->info('Transaction data saved to sp_transactions table ******************************** ');

                    $pointsArray['items_array'] = $pro_items_array;
                    $pointsArray['lt_transaction_id'] = $options[self::IS_REDEEM] == 1 ? $transaction_id : 0;
                    $pointsArray[self::IS_REDEEM] = $options[self::IS_REDEEM] == 1 ? $options[self::IS_REDEEM] : 0;

                    $callApi = true;

                    if ($request[self::REDEEM_POINTS]) {
                        $points_redeem_value = DB::table('lt_points')->leftJoin('lt_redeem_values', 'lt_points.lt_point_id', '=', 'lt_redeem_values.lt_point_id')
                            ->where(['lt_points.venue_id' => $options[self::VENUE_ID] ?? $venue->venue_id, 'lt_points.lt_point_type' => self::VALUE])->first();
                        if ($points_redeem_value) {
                            $pointsNeeded = $points_redeem_value->red_point_velue / $points_redeem_value->red_price_velue * $request[self::ORDER_REAL_AMOUNT];
                            if ($request[self::REDEEM_POINTS] >= $pointsNeeded) {
                                $callApi = false;
                            }
                        }
                    }
                    //..... prepare order data to save .....//
                    $soldi_results_detail = $order_arr->data->order_str;

                    $orderData = [
                        self::CUSTOMER_ID => $request[self::CUSTOMER_ID],
                        'payment_method_id' => $request[self::PAYMENT_BY],
                        'order_status' => $order_arr->status,
                        'order_note' => '',
                        'order_type' => $request[self::ORD_TYPE],
                        self::VENUE_ID => $options[self::VENUE_ID] ?? $venue->venue_id,
                        'order_amount' => $request[self::ORDER_REAL_AMOUNT],
                        self::ORDER_PIN_LOCATION => $request[self::ORDER_PIN_LOCATION],
                        self::DEVICE_NAME => $request[self::DEVICE_NAME],
                        self::DEVICE_MODEL => $request[self::DEVICE_MODEL],
                        self::IS_ACKNOWLEDGE => $request[self::IS_ACKNOWLEDGE],
                        'pos_code' => 1,
                        'tax_label' => $request[self::VAT_LABEL],
                        'total_points' => $request[self::REDEEM_POINTS],
                        'points_amount' => $request[self::PAY_WITH_POINTS],
                        self::VAT_AMOUNT => $request[self::VAT_AMOUNT],
                        self::TRANSACTION_ID => $request[self::TRANSACTION_ID],
                        self::COUNTRY_ID => $request[self::COUNTRY_ID],
                        self::BUSINESS_ID => $request[self::BUSINESS_ID],
                        self::USER_ID => $request[self::USER_ID],
                        'customer_name' => (json_decode($request[self::CARD_DETAIL]))[0]->card_name ?? ''
                    ];
                    if ($pointsArray[self::TOTAL_AMOUNT] > 0) {
                        if (!$request[self::PAY_WITH_POINTS] || $callApi) {
                            $res_rules = BasePosApiCall::appay_rule($pointsArray);
                            if ($res_rules[self::STATUS]) {
                                $order = Order::create($orderData);
                                Log::channel(self::PAYMENT)->info('Order Saved to unified database : ', ['data' => $orderData]);
                                $prdDetails = [];
                                foreach ($item_array as $order_items_detail) {
                                    $prdDetails[] = [
                                        self::PRODUCT_ID => $order_items_detail->prd_id,
                                        'unit_price' => $order_items_detail->prd_unitprice,
                                        'quantity' => $order_items_detail->prd_qty,
                                        self::ORDER_ID => $order->order_id,
                                        self::TRANSACTION_ID => $soldi_results_detail->transaction_id,
                                        self::CREATED_AT => Carbon::now(),
                                        'updated_at' => Carbon::now()
                                    ];
                                }//..... end foreach() .....//

                                if (!empty($prdDetails)) {
                                    DB::table('order_detail')->insert($prdDetails);
                                }

                                Log::channel(self::PAYMENT)->info('Order details saved to unified database : ', ['data' => $prdDetails]);
                                //.... Call Order Placed Hook for soldi pos.
                                return [self::STATUS => true, self::MESSAGE => self::TRANS_SUCCESSFUL, 'data' => $order_arr->data];
                            } else {
                                return [self::STATUS => false, self::MESSAGE => 'Error occurred while applying rules.'];
                            }

                        } else {
                            return [self::STATUS => true, self::MESSAGE => self::TRANS_SUCCESSFUL, 'data' => $order_arr->data];
                        }

                    } else {
                        $order = Order::create($orderData);
                        Log::channel(self::PAYMENT)->info('Order Saved to unified database : ', ['data' => $orderData]);
                        $prdDetails = [];
                        foreach ($item_array as $order_items_detail) {
                            $prdDetails[] = [
                                self::PRODUCT_ID => $order_items_detail->prd_id,
                                'unit_price' => $order_items_detail->prd_unitprice,
                                'quantity' => $order_items_detail->prd_qty,
                                self::ORDER_ID => $order->order_id,
                                self::TRANSACTION_ID => $soldi_results_detail->transaction_id,
                                self::CREATED_AT => Carbon::now(),
                                'updated_at' => Carbon::now()
                            ];
                        }//..... end foreach() .....//

                        if (!empty($prdDetails)) {
                            DB::table('order_detail')->insert($prdDetails);
                            Log::channel(self::PAYMENT)->info('Order details saved to unified database : ', ['data' => $prdDetails]);
                        }//..... end if() .....//
                        //.... Call Order Placed Hook for soldi pos.

                        return [self::STATUS => true, self::MESSAGE => self::TRANS_SUCCESSFUL, 'data' => $order_arr->data];
                    }//..... end if-else() .....//
                } else if ($order_arr->status == 404) {
                    if (isset($transaction_id)) {
                        BasePosApiCall::delete_transaction($transaction_id);
                    }

                    return [self::STATUS => false, self::MESSAGE => $order_arr->message];
                } else {
                    if (isset($transaction_id)) {
                        BasePosApiCall::delete_transaction($transaction_id);
                    }

                    return [self::STATUS => false, self::MESSAGE => 'Transaction Unsuccessful'];
                }
            } else {
                return [self::STATUS => false, self::MESSAGE => self::NO_DATA_FOUND];
            }//..... end if-else() .....//
        } catch (\Exception $e) {
            if (isset($transaction_id)) {
                BasePosApiCall::delete_transaction($transaction_id);
            }
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR, 'Error' => $e->getMessage()];
        }//..... end of try-catch() .....//
    }//..... payment_process() .....//


    public function customerOrdersFromSoldi($options = array())
    {

        $customer_id = $options[self::CUSTOMER_ID];
        $company_id = $options[self::COMPANY_ID];
        $amplify_id = $options['amplify_id'];

        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $SOLDI_API_KEY = $responce_set->soldi_api_key;
        $SOLDI_SECRET = $responce_set->soldi_api_secret;


        $client1 = new Client([
            'headers' => [
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {
            $response = $client1->request('GET', $SOLDI_DEFAULT_PATH . '/orders/customer_orders?customer_id=' . $customer_id);
            $order_res = $response->getBody();
            $order_arr = json_decode($order_res);
            $order_message = $order_arr->message;
            $order_data = $order_arr->data;

            if ($order_data) {
                $order_data_array = BasePosApiCall::get_allOrder($amplify_id);
                $order_data_array->status;
                if ($order_data_array->status == 1) {
                    $or_data_arr = $order_data_array->data;
                } else {
                    $or_data_arr = '';
                }
                $order_array = [];
                foreach ($order_data as $ord_row) {
                    $ord_id = $ord_row->ord_id;
                    $business_id = $ord_row->business_id;

                    $points_array = BasePosApiCall::searchOrders($ord_id, $or_data_arr);
                    $ord_row->earn_points = $points_array;
                    $store_info = StoreInformation::where(self::STORE_ID, $business_id)->first();
                    $store_map = '';
                    if ($store_info) {
                        $store_map = config('constant.base_path_img') . '/public/maps/' . $store_info->store_map;
                    }
                    $ord_row->store_map = $store_map;
                    $order_array[] = $ord_row;
                }
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = $order_message;
                $arr['data'] = $order_array;

                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = $order_message;
                return json_encode($arr);

            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;

            return json_encode($arr);

        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }
    }

    public function StoreInfoFromSoldi($params)
    {

        $client = new Client();
        extract($params);

        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $responce_set = $this->common_library->getCompanySittings($company_id);

        if ($company_id == $responce_set->company_id) {
            $SOLDI_API_KEY = $responce_set->soldi_api_key;
            $SOLDI_SECRET = $responce_set->soldi_api_secret;
        }//.... end if() .....//

        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {
            $response = $client1->get($SOLDI_DEFAULT_PATH . self::STORE_BUSINESS_URL . $business_id);
            $result = $response->getBody();
            $soldi_arr = json_decode($result);
            $soldi_data = $soldi_arr->data;

            if ($soldi_data) {
                $bus_array[self::BUSINESS_NAME] = $soldi_data[0]->business_name;
                $bus_array[self::BUSINESS_MOBILE] = $soldi_data[0]->business_mobile;
                $bus_array["owner_name"] = $soldi_data[0]->business_owner;
                $bus_array[self::BUSINESS_DETAIL] = $soldi_data[0]->business_detail_info;
                if ($soldi_data[0]->business_bg) {
                    $timage = $soldi_data[0]->business_bg;
                    $bg_image = $timage->thumb1;
                } else {
                    $bg_image = self::BG_IMG;
                }
                $bus_array[self::BG_IMGS] = $bg_image;
                foreach ($soldi_data as $row) {
                    $business_api_key = $row->business_api_key;
                    $business_secret = $row->business_secret;
                    $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . self::POS_CATEGORY_URL . $business_id, [
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'X-API-KEY' => $business_api_key,
                            'SECRET' => $business_secret
                        ]
                    ]);
                    $cat_array = $res_cat->getBody();
                    $cat_data = json_decode($cat_array);
                    $category_arr = $cat_data->data;

                }
                $product_items = array();
                foreach ($category_arr as $cat_item) {
                    $cate_id = $cat_item->cate_id;
                    $product_data = $this->getAllProducts($cate_id, $company_id);

                    if ($product_data[self::STATUS]) {
                        foreach ($product_data['data'] as $pro_data) {
                            $pro_arr['prd_name'] = $pro_data->prd_name;
                            $product_items[] = $pro_arr;
                        }
                    }
                }
                $pro_array = array();
                $store_stall = StoreInformation::where(self::STORE_ID, $business_id)->first();
                $stall_no = '';
                if ($store_stall) {
                    $stall_no = $store_stall->stall_no;
                }
                $bus_array[self::STALL] = $stall_no;
                foreach ($product_items as $pro_row) {
                    $pro_array[] = $pro_row['prd_name'];
                }
                $prod_data = implode(', ', $pro_array);
                $bus_array["products"] = $prod_data;
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = self::DATA_FOUND;
                $arr['data'] = $bus_array;
                return json_encode($arr);
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'no store found.';
                return json_encode($arr);
            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::INVALID_API_SECRET;
            return json_encode($arr);
        }
    }

    public function appay_rule($pointsArray)
    {
        try {
            $response = (new Client(['headers' => ['Content-Type' => 'application/json']]))
                ->request('POST', config('constant.LOYALTY_DEFAULT_PATH') . 'apply_rules', [
                    'json' => $pointsArray
                ]);

            $aply_rule = json_decode($response->getBody()->getContents());

            if ($aply_rule->status) {
                return [self::STATUS => true, self::MESSAGE => 'Apply rule successfully.'];
            }
            else {
                return [self::STATUS => false, self::MESSAGE => self::NO_DATA_FOUND];
            }
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }//..... end of try-catch( ).....//
    }//..... end of function() .....//

    public function searchOrders($ord_id, $or_data_arr)
    {
        if (!empty($or_data_arr)) {
            $pointsarray = '0';
            foreach ($or_data_arr as $val) {
                if ($ord_id == $val->order_id) {
                    $pointsarray = $val->points_total;
                }
            }
            $points = $pointsarray;
        } else {
            $points = '0';
        }
        return $points;
    }

    public function get_allOrder($amplify_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'get_all_orders', [
                'form_params' => [
                    self::CUSTOMER_ID => $amplify_id
                ]
            ]);
            $result = $res->getBody();
            $order_array = json_decode($result);
            if ($order_array) {
                return $order_array;
            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;

        }
        return $arr;
    }

    public function delete_transaction($transaction_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'delete_transaction', [
                'form_params' => [
                    self::TRANSACTION_ID => $transaction_id
                ]
            ]);
            return $res->getBody();
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;
            return json_encode($arr);
        }
    }

    public function redeem_points($company_id, $venue_id, $soldi_id, $total_amount, $points, $amplify_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . self::REDEEM_POINTS, [
                'form_params' => [
                    self::COMPANY_ID => $company_id,
                    self::VENUE_ID => $venue_id,
                    self::SOLDI_ID => $soldi_id,
                    self::TOTAL_AMOUNT => $total_amount,
                    'points' => $points,
                    self::USER_ID => $amplify_id,
                    self::ORDER_ID => '0'
                ]
            ]);
            $result = $res->getBody();
            $redeem_points = json_decode($result);

            $status = $redeem_points->status;
            if ($status) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = 'You have successfully used your points.';
                $arr['data'] = $status = $redeem_points->data;
            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'You have no enough points to continue.';
            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;
        }
        return $arr;
    }

    public function getSingleStoreInfo($business_id, $company_id)
    {
        $client = new Client();
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
        $responce_set = $this->common_library->getCompanySittings($company_id);
        $SOLDI_API_KEY = $responce_set->soldi_api_key;
        $SOLDI_SECRET = $responce_set->soldi_api_secret;

        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $SOLDI_API_KEY,
                'SECRET' => $SOLDI_SECRET
            ]
        ]);
        try {
            $response = $client1->get($SOLDI_DEFAULT_PATH . self::STORE_BUSINESS_URL . $business_id);
            $result = $response->getBody();
            $store_array = json_decode($result);
            $store_data = $store_array->data;
            $business_api_key = $store_data[0]->business_api_key;
            $business_secret = $store_data[0]->business_secret;

            $business_id = $store_data[0]->business_id;
            $business_name = $store_data[0]->business_name;
            $business_email = $store_data[0]->business_email;
            $business_account_type = $store_data[0]->business_account_type;
            $business_mobile = $store_data[0]->business_mobile;
            $location = $store_data[0]->business_location;
            $business_detail = $store_data[0]->business_detail;
            $business_detail_info = $store_data[0]->business_detail_info;
            $user_id = $store_data[0]->user_id;

            if ($location != '0') {
                $business_location = $location;
            } else {
                $business_location = 'N/A';
            }

            $bus_array[self::BUSINESS_ID] = $business_id;
            $bus_array[self::BUSINESS_NAME] = $business_name;
            $bus_array[self::BUSINESS_EMAIL] = $business_email;
            $bus_array[self::BUSINESS_ACCOUNT_TYPE] = $business_account_type;
            $bus_array[self::BUSINESS_MOBILE] = $business_mobile;
            $bus_array[self::BUSINESS_LOCATION] = $business_location;
            $bus_array[self::USER_ID] = $user_id;
            $bus_array[self::BUSINESS_DETAIL] = $business_detail;
            $bus_array[self::BUSINESS_DETAIL_INFO] = $business_detail_info;

            if ($store_data[0]->business_image) {
                $timage = $store_data[0]->business_image;
                $bus_image = $timage->thumb1;
            } else {
                $bus_image = self::BG_IMG;
            }
            $business_image = self::BG_IMG;
            $bus_image1 = $business_image;
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $bus_array[self::IMAGES] = $image_arr;

            $res_setting = $client->request('GET', $SOLDI_DEFAULT_PATH . self::STORE_SETTINGS_URL . $business_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $business_api_key,
                    'SECRET' => $business_secret
                ]
            ]);
            $sittings_array = $res_setting->getBody();
            $sitting_data = json_decode($sittings_array);
            $settings_arr = $sitting_data->data;
            $bus_array[self::BUSINESS_SETTINGS] = $settings_arr;

            $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . self::POS_CATEGORY_URL . $business_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $business_api_key,
                    'SECRET' => $business_secret
                ]
            ]);
            $cat_array = $res_cat->getBody();
            $cat_data = json_decode($cat_array);
            $category_arr = $cat_data->data;

            $cate_array = array();
            foreach ($category_arr as $cat_row) {

                $cate_id = $cat_row->cate_id;
                $cate_name = $cat_row->cate_name;
                $cate_image = $cat_row->cate_image;
                $cate_color = $cat_row->cate_color;
                $cate_detail = $cat_row->cate_detail;
                $displaypriority = $cat_row->displaypriority;

                $cat_arr[self::CAT_ID] = $cate_id;
                $cat_arr[self::CAT_NAME] = $cate_name;
                if ($cate_image) {
                    $cat_arr[self::CAT_IMAGE] = $cate_image->image;
                } else {
                    $cat_arr[self::CAT_IMAGE] = '';
                }
                $cat_arr[self::CAT_COLOR] = $cate_color;
                $cat_arr[self::CAT_TYPE] = $cat_row->cate_type;
                $cat_arr[self::CAT_DETAIL] = $cate_detail;
                $cat_arr[self::DISPLAY_PRIORITY] = $displaypriority;
                $cate_array[] = $cat_arr;
            }

            $bus_array[self::CATEGORIES] = $cate_array;
            $arr[self::STATUS] = true;
            $arr['data'] = (object)$bus_array;
            return $arr;

        } catch (RequestException $e) {

            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;
            $arr['data'] = '';
            return $arr;

        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }
    }

    public function searchProduct($product_id, $rules_data, $prd_price)
    {
        if (!empty($rules_data)) {
            $redeem_point = $rules_data->redeem_point;
            $redeem_price = $rules_data->redeem_price;
            $rules_data = $rules_data->rules;


            $pointsarray = [];
            foreach ($rules_data as $key => $val) {
                if (in_array($product_id, explode(',', $val->rule_product_id)) && ($val->rule_is_exclusive == 1)) {
                    $pointsarray[] = $rules_data[$key];
                }
            }


            $max_val = array_reduce($rules_data, function ($a, $b) {
                return @$a->rule_preference > $b->rule_preference ? $a : $b;
            });

            if (count($pointsarray) == 0) {

                foreach ($rules_data as $key => $val) {
                    if (in_array($product_id, explode(',', $val->rule_product_id)) && ($val->rule_preference == $max_val->rule_preference)) {
                        $pointsarray[] = $val;
                    }
                }
            }

            $points_value = 0;
            $value_points = 0;
            $status_points = 0;
            if ($pointsarray) {
                foreach ($pointsarray as $point) {

                    if ($point->lt_point_type == self::VALUE) {
                        $value_points += $point->rule_point_qty;

                    } else {
                        $status_points += $point->rule_point_qty;
                    }

                }

                if ($redeem_price > 0 && $redeem_point > 0) {
                    $points_value = $redeem_point / $redeem_price * $prd_price;
                }
                $product_point[self::VALUE_POINTS] = $value_points;
                $product_point[self::STATUS_POINTS] = $status_points;
                $product_point[self::POINTS_VALUE] = $points_value;
                $points = $product_point;

            } else {
                if ($redeem_price > 0 && $redeem_point > 0) {
                    $points_value = $redeem_point / $redeem_price * $prd_price;
                }
                $product_point[self::VALUE_POINTS] = $value_points;
                $product_point[self::STATUS_POINTS] = $status_points;
                $product_point[self::POINTS_VALUE] = $points_value;
                $points = $product_point;
            }
        } else {
            $product_point['points_array'] = array();
            $product_point[self::POINTS_VALUE] = 0;
            $points = $product_point;
            if (!empty($rules_data)) {
                $points_value = 0;
                $redeem_point = $rules_data->redeem_point;
                $redeem_price = $rules_data->redeem_price;

                if ($redeem_price > 0 && $redeem_point > 0) {
                    $points_value = $redeem_point / $redeem_price * $prd_price;
                }
                $product_point['points_array'] = array();
                $product_point[self::POINTS_VALUE] = $points_value;
                $points = $product_point;
            }
        }
        return $points;
    }

    public function get_allRules($store_id, $rule_for, $company_id, $venue_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {

            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'get_stores', [

                'form_params' => [
                    self::STORE_ID => $store_id,
                    'rule_for' => $rule_for,
                    self::COMPANY_ID => $company_id,
                    self::VENUE_ID => $venue_id
                ]

            ]);
            $result = $res->getBody();
            $rules_array = json_decode($result);

            $status = $rules_array->status;
            if ($status) {
                $arr[self::STATUS] = true;
                $arr[self::MESSAGE] = $rules_array->message;
                $arr['data'] = $rules_array->data;

            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::NO_DATA_FOUND;
            }
        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;

        }
        return $arr;
    }

    public function searchstore($bussiness_id, $rules_data)
    {
        if (!empty($rules_data)) {
            $rules_data = $rules_data->rules;
            $pointsarray = [];
            foreach ($rules_data as $key => $val) {
                if (in_array($bussiness_id, explode(',', $val->store_id)) && ($val->rule_is_exclusive == 1)) {
                    $pointsarray[] = $rules_data[$key];
                }
            }


            $max_val = array_reduce($rules_data, function ($a, $b) {
                return @$a->rule_preference > $b->rule_preference ? $a : $b;
            });
            if (count($pointsarray) == 0) {

                foreach ($rules_data as $key => $val) {
                    if (in_array($bussiness_id, explode(',', $val->store_id)) && ($val->rule_preference == $max_val->rule_preference)) {
                        $pointsarray[] = $val;
                    }
                }
            }
            $value_points = 0;
            $status_points = 0;
            if ($pointsarray) {
                foreach ($pointsarray as $point) {
                    if ($point->lt_point_type == self::VALUE) {
                        $value_points += $point->rule_point_qty;
                    } else {
                        $status_points += $point->rule_point_qty;
                    }
                }
                $product_point[self::VALUE_POINTS] = $value_points;
                $product_point[self::STATUS_POINTS] = $status_points;
                $points = $product_point;
            } else {
                $points = '';
            }
        } else {
            $points = new \stdClass();
        }
        return $points;
    }

    public function searchcategory($product_id, $rules_data)
    {
        if (!empty($rules_data)) {
            $rules_data = $rules_data->rules;
            $pointsarray = [];
            foreach ($rules_data as $key => $val) {
                if (in_array($product_id, explode(',', $val->category_id)) && ($val->rule_is_exclusive == 1)) {
                    $pointsarray[] = $rules_data[$key];
                }
            }

            $max_val = array_reduce($rules_data, function ($a, $b) {
                return @$a->rule_preference > $b->rule_preference ? $a : $b;
            });

            if (count($pointsarray) == 0) {

                foreach ($rules_data as $key => $val) {
                    if (in_array($product_id, explode(',', $val->category_id)) && ($val->rule_preference == $max_val->rule_preference)) {
                        $pointsarray[] = $val;
                    }
                }
            }
            $value_points = 0;
            $status_points = 0;
            if ($pointsarray) {
                foreach ($pointsarray as $point) {
                    if ($point->lt_point_type == self::VALUE) {
                        $value_points += $point->rule_point_qty;
                    } else {
                        $status_points += $point->rule_point_qty;
                    }
                }
                $product_point[self::VALUE_POINTS] = $value_points;
                $product_point[self::STATUS_POINTS] = $status_points;
                $points = $product_point;
            } else {
                $points = '';
            }
        } else {
            $points = '';
        }
        return $points;
    }

    public function getDistance($oregin_late, $oregin_long, $venue_latitude, $venue_longitude)
    {
        $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" . $oregin_late . "," . $oregin_long . "&destinations=" . $venue_latitude . "," . $venue_longitude . "&mode=driving&language=pl-PL";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    public function getEarnValues($store_id, $company_id, $venue_id)
    {
        if ($store_id != '' && $company_id != '' && $venue_id != '') {
            $client = new Client();
            $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
            try {
                $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'earnValue', [

                    'form_params' => [
                        self::STORE_ID => $store_id,
                        self::COMPANY_ID => $company_id,
                        self::VENUE_ID => $venue_id
                    ]
                ]);
                return $res->getBody();
            } catch (RequestException $e) {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::SERVER_ERROR;
                return json_encode($arr);
            }
        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Requested Parameaters are missing.';
            return json_encode($arr);
        }


    }

    /**
     * @param $url
     * @param $header
     * @param $body
     * @return string
     * Send products that are created through Super Portal UI.
     */
    public function sendProductToSoldi($url, $header, $body)
    {
        return $this->postJsonThroughGuzzle($url, $header, $body);
    }

    /**
     * @param $app_user_id
     * @param $vanue_id
     * @param $amount_due
     * @return bool
     */
    private function forwardPaymentRequestToSoldi($request, $options, $total_points, $points_amount, $is_split, $split_array, $voucher_code, $discount_amt, $items_discount, $earnedPoints)
    {

        $address = $request['street_number'] ?? '' . ' ' . $request['street_name'] ?? '' . ' ' . $request['city'] ?? '' . ' ' . $request[self::ADDRESS] ?? '';
        $Address_array = [
            'ecom_billing_fname' => $request['first_name'] ?? '',
            'ecom_billing_lname' => $request['last_name'] ?? '',
            'ecom_billing_email' => $request['email_address'] ?? '',
            'ecom_billing_phone' => $request['phone_number'] ?? '',
            'ecom_billing_add_1' => $address ?? '',
            'ecom_billing_add_2' => $address ?? '',
            'ecom_billing_country' => $request[self::COUNTRY] ?? '8',
            'ecom_billing_state' => $request['state'] ?? '8',
            'ecom_billing_zip_code' => $request['postal_code'] ?? '',
            'ecom_billing_city' => $request['city'] ?? '',
            'ecom_shipping_fname' => $request['first_name'] ?? '',
            'ecom_shipping_lname' => $request['last_name'] ?? '',
            'ecom_shipping_email' => $request['email_address'] ?? '',
            'ecom_shipping_phone' => $request['phone_number'] ?? '',
            'ecom_shipping_add_1' => $address ?? '',
            'ecom_shipping_add_2' => $address ?? '',
            'ecom_shipping_country' => $request[self::COUNTRY] ?? '8',
            'ecom_shipping_state' => $request['state'] ?? '8',
            'ecom_shipping_zip_code' => $request['postal_code'] ?? '',
            'ecom_shipping_city' => $request['city'] ?? ''
        ];

        $data = [
            self::BUSINESS_ID => $request[self::BUSINESS_ID],
            self::USER_ID => $request[self::USER_ID],
            self::AMOUNT_DUE => $request[self::AMOUNT_DUE],
            self::COUNTRY_ID => $request[self::COUNTRY_ID],
            self::CUSTOMER_ID => $request[self::CUSTOMER_ID],
            self::IS_ACKNOWLEDGE => $request[self::IS_ACKNOWLEDGE],
            self::ORD_DATE => $request[self::ORD_DATE],
            self::ORD_TYPE => $request[self::ORD_TYPE],
            self::ORDER_PIN_LOCATION => $request[self::ORDER_PIN_LOCATION],
            self::ORDER_REAL_AMOUNT => $request[self::ORDER_REAL_AMOUNT],
            self::PAYMENT_BY => $request[self::PAYMENT_BY],
            'register_id' => $request['register_id'],
            self::VAT_AMOUNT => $request[self::VAT_AMOUNT],
            self::VAT_LABEL => $request[self::VAT_LABEL],
            'employee_id' => $options[self::USER_ID],
            'ord_status' => $request['ord_status'],
            self::TRANSACTION_ID => $request[self::TRANSACTION_ID],
            'tip' => $request['tip'] ?? 0,
            self::ORDER_ITEMS => stripslashes($request[self::ORDER_ITEMS]),
            self::CARD_DETAIL => stripslashes($request[self::CARD_DETAIL]),
            'total_points' => $total_points,
            'points_amount' => $points_amount,
            'is_split' => $is_split,
            'split_data' => json_encode($split_array),
            self::PAY_WITH_POINTS => $request[self::PAY_WITH_POINTS],
            self::DEVICE_NAME => $request[self::DEVICE_NAME],
            self::DEVICE_MODEL => $request[self::DEVICE_MODEL],
            self::VOUCHER_CODE => $request[self::VOUCHER_CODE] ?? 0,
            'voucher_amt' => $request['voucher_amt'] ?? 0,
            'items_discount' => $items_discount ? $items_discount : 0,
            'app_name' => $request['app_name'],
            'is_eway_payment_enable' => $request['is_eway_payment_enable'],
            'earned_points' => $earnedPoints,
            'customer_token_id' => $request['customer_token_id'],
            'shipping_address' => json_encode($Address_array) ?? '',
            self::DELIVERY_COST => $request[self::DELIVERY_COST],
            'giftcard_data' => $request['giftcard_data'],

        ];

        try {

            Log::channel(self::PAYMENT)->info('Finalized Order Data for Soldi before sending : ', ['data' => $data]);

            return (new Client())->request('POST', config('constant.SOLDI_DEFAULT_PATH') . '/orders/makepayment', [
                'headers' => [
                    'X-API-KEY' => config('constant.SOLDI_API_KEY'),
                    'SECRET' => config('constant.SOLDI_SECRET')
                ],
                'form_params' => $data
            ]);
        } catch (GuzzleException $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }
    }//..... end of forwardPaymentRequestToSoldi() .....//

    private function updateUserVoucher($options, $request, $voucher_code, $voucher_id)
    {
        $data = [self::USER_ID => $options['app_user_id'], self::VENUE_ID => $request[self::VENUE_ID], self::VOUCHER_CODE => $voucher_code, 'voucher_id' => $voucher_id, self::COMPANY_ID => $options[self::COMPANY_ID]];

        Log::channel(self::PAYMENT)->info('Updating user voucher and forwarding data to java :', ['data' => $data]);

        return (new Client())->post(config('contant.JAVA_URL') . 'updateUserVoucher', [
            'headers' => array(),
            'json' => $data,
        ]);
    }//..... end of updateUserVoucher() .....//

    /**
     * @param $defaultPoints
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function loyaltyWithTransaction($defaultPoints)
    {

        $pointsArray[self::STORE_ID] = $defaultPoints[self::BUSINESS_ID];
        $pointsArray[self::SOLDI_ID] = $defaultPoints[self::CUSTOMER_ID];
        $pointsArray[self::USER_ID] = $defaultPoints[self::CUSTOMER_ID];
        $pointsArray[self::VENUE_ID] = $defaultPoints[self::VENUE_ID];
        $pointsArray[self::ORDER_ID] = 0;
        $pointsArray[self::TRANSACTION_ID] = 0;
        $pointsArray[self::COMPANY_ID] = $defaultPoints[self::COMPANY_ID];
        $pointsArray['transaction_date'] = $defaultPoints[self::ORD_DATE];
        $pointsArray[self::TOTAL_AMOUNT] = $defaultPoints[self::AMOUNT_DUE];


        if (!$defaultPoints[self::AMOUNT_DUE]) {
            return [self::STATUS => false, self::MESSAGE => 'Please provide amount due'];
        }

        if (!$defaultPoints[self::ORDER_ITEMS]) {
            return [self::STATUS => false, self::MESSAGE => 'Please provide line items'];
        }


        $item_array = json_decode(stripslashes($defaultPoints[self::ORDER_ITEMS]));


        $pro_items_array = [];
        foreach ($item_array as $items) {
            $pro_items_array[] = [
                self::PRODUCT_ID => $items->prd_id,
                'category_id' => $items->cate_id,
                'product_qty' => $items->prd_qty,
                'product_unit_price' => $items->prd_unitprice
            ];
        }

        $pointsArray['items_array'] = $pro_items_array;
        $pointsArray['lt_transaction_id'] = 0;
        $pointsArray[self::IS_REDEEM] = 0;

        Log::channel(self::PAYMENT)->info('Forwarding Request to loyalty to calculate Earned Points : ', ['data' => $pointsArray]);

        return (new Client())->request('POST', config('constant.LOYALTY_DEFAULT_PATH') . 'calculateEarnedPoints', [
            'headers' => [],
            'json' => $pointsArray
        ])->getBody()->getContents();
    }//..... end of sendProductToSoldi() ......//


    public function getAllProductsFromSoldi($params)
    {
        $arr = array();

        extract($params);
        $rule_for = 2;
        $store_venues = Venue::where(self::COMPANY_ID, '=', $company_id)
            ->where(self::STORE_NEWS_ID, '=', $business_id)
            ->first();
        if ($store_venues) {
            $venue_id = $store_venues->venue_id;
        } else {
            $venue_id = 0;
        }


        // Soldi Api's and Url
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');

        $client1 = new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => config('constant.SOLDI_API_KEY'),//$SOLDI_API_KEY,
                'SECRET' => config('constant.SOLDI_SECRET')//$SOLDI_SECRET
            ]
        ]);
        try {
            $response = $client1->get($SOLDI_DEFAULT_PATH . '/inventory/list?cate_id=' . $category_id);
            echo $result = $response->getBody();
            exit;
            $products_array = json_decode($response->getBody());
            $product_data = $products_array->data;
            if (!empty($product_data)) {
                $rules_array = BasePosApiCall::get_allRules($business_id, $rule_for, $company_id, $venue_id);
                $points_val_array = BasePosApiCall::getEarnValues($business_id, $company_id, $venue_id);

                $points_data123 = json_decode($points_val_array);
                if ($rules_array[self::STATUS] == 1) {
                    $rules_data = $rules_array['data'];

                } else {
                    $rules_data = '';
                }


                $product_array = [];
                foreach ($product_data as $pro_row) {
                    $product_id = $pro_row->prd_id;

                    $points_array = BasePosApiCall::searchProduct($product_id, $rules_data, $pro_row->prd_price);

                    $productPriceInPoint = 0;


                    if ($points_data123->status) {
                        $point_obj = $points_data123->data;
                        $earn_price = $point_obj->earn_price;
                        $earn_point = $point_obj->earn_point;
                        if ($earn_price != 0 && $earn_point != 0) {
                            $productPriceInPoint = $pro_row->prd_price / $earn_price * $earn_point;
                        } else {
                            $productPriceInPoint = 0;
                        }
                    }

                    $points_array[self::POINTS_VALUE] = $productPriceInPoint;


                    $favoriteProduct = FavoriteProduct::where(self::PRODUCT_ID, $product_id)->where(self::USER_ID, $user_id)->first();


                    if ($favoriteProduct) {
                        $pro_row->is_favorite = $favoriteProduct->status;
                    } else {
                        $pro_row->is_favorite = 0;
                    }
                    $pro_row->pro_points = $points_array;
                    $product_array[] = $pro_row;
                }

                if ($product_array) {
                    $arr[self::STATUS] = true;
                    $arr[self::MESSAGE] = self::DATA_FOUND;
                    $arr['data'] = $product_array;
                    $result = json_encode($arr);
                    SoldiLog::info("  " . basename(__FILE__) . " F: getAllProductsFromSoldi, msg: Products data found.");
                    return $result;

                } else {
                    $arr[self::STATUS] = false;
                    $arr[self::MESSAGE] = 'Data not found.';
                    $result = json_encode($arr);
                    SoldiLog::info("  " . basename(__FILE__) . " F: getAllProductsFromSoldi, msg: Products data not found.");
                    return $result;
                }

            } else {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = 'Data not found.';
                $result = json_encode($arr);
                SoldiLog::info("  " . basename(__FILE__) . " F: getAllProductsFromSoldi, msg: Products data not found.");
                return $result;
            }

        } catch (RequestException $e) {
            if ($e->getResponse()->getStatusCode() == '403') {
                $arr[self::STATUS] = false;
                $arr[self::MESSAGE] = self::INVALID_API_SECRET;
                $result = json_encode($arr);
                SoldiLog::error("  " . basename(__FILE__) . " F: getAllProductsFromSoldi, msg: invalid Api key and secret.");
                return $result;
            }
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }

    }

    private function dataForPunchCard($request)
    {
        Log::channel(self::PAYMENT)->info('Forwarding order data to java for punch card started **************************************** :) ');

        $mainPayload = [
            self::COMPANY_ID => $request[self::COMPANY_ID],
            self::VENUE_ID => $request[self::VENUE_ID],
            self::BUSINESS_ID => $request[self::BUSINESS_ID],
            self::USER_ID => $request[self::USER_ID],
            self::CATEGORIES => [],
        ];
        $categories = [];
        $du_arr = [];
        foreach (json_decode($request[self::ORDER_ITEMS], true) as $items) {
                $du_arr[$items[self::CAT_ID]][] = ['prd_id' => $items['prd_id'], 'prd_qty' => $items['prd_qty'], 'prd_price' => $items['prd_cost']];
        }
        foreach ($du_arr as $key => $val) {
            $categories[] = ['cat_id' => $key, 'products' => $val];
        }

        $mainPayload[self::CATEGORIES] = $categories;

        Log::channel(self::PAYMENT)->info('Finalized data that going to forward to java for punch card: ', ['data' => $mainPayload]);

        return (new Client())->post(config('contant.JAVA_URL') . 'assignPunchCard', [
            'headers' => array(),
            'json' => $mainPayload,
        ]);

    }//..... end of dataForPunchCard() .....//

    /**
     * @param $venue_id
     * @param $company_id
     * @return array
     */
    public function getBusineesDataFromSoldi($params = [])
    {

        try {
            extract($params);

            $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');
            $store_venues = VenueShops::where(self::VENUE_ID, '=', $params[self::VENUE_ID])->get()->toArray();
            $da_array = array();
            foreach ($store_venues as $value) {
                $appKey = Store::Where(['pos_store_id' => $value[self::SHOP_ID]])->get()->toArray();
                $client = new Client([
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $appKey[0]['soldi_api_key'],
                        'SECRET' => $appKey[0]['soldi_secret']
                    ]
                ]);
                $response = $client->get($SOLDI_DEFAULT_PATH . '/venue?business_id=' . $value[self::SHOP_ID]);
                $result = $response->getBody();
                $store_array = json_decode($result);
                $da_array[] = $store_array->data[0] ?? "";
            }
            return $da_array;

        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::INVALID_API_SECRET;
            return $arr;

        }

    }//--- End of getBusineesDataFromSoldi() ---//


}

