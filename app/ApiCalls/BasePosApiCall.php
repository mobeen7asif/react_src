<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\ApiCalls;

use App\Traits\guzzleApiCalls;
use GuzzleHttp\Client;
use App\Facade\SoldiLog;
use Illuminate\Support\Facades\Log;
use App\Classes\CommonLibrary as CommonLibrary;

class BasePosApiCall
{
    use guzzleApiCalls;

    /*sonar constants*/
    const FORM_PARAMS                = 'form_params';
    const COMPANY_ID                 = 'company_id';
    const VENUE_ID                   = 'venue_id';
    const STATUS                     = 'status';
    const MESSAGE                    = 'message';
    const VALUE                      = 'value';
    const VALUE_POINTS               = 'value_points';
    const STATUS_POINTS              = 'status_points';
    const SERVER_ERROR               = 'Server error';
    const POINTS_VALUE               = 'points_value';
    const USER_ID                    = 'user_id';
    const BUSINESS_IMAGE             = 'business_image';
    const CUSTOM                     = 'custom';

    /**
     * BasePosApiCall constructor.
     */
    public function __construct()
    {
        set_time_limit(0);
    }//..... end of __construct() ......//

    public function get_allRules($store_id, $rule_for, $company_id, $venue_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'get_stores', [
            'form_params' => [
                'store_id' => $store_id,
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
            $arr['sssss'] = $rules_array->data;

        } else {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'No data found.';

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
            $points = '';
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

                    self::FORM_PARAMS => [
                        'store_id' => $store_id,
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

    public function getSingleStoreInfo($business_id, $company_id)
    {
        $client = new Client();
        $SOLDI_DEFAULT_PATH = config('constant.SOLDI_DEFAULT_PATH');

        $responce_set = $this->CommonLibrary->getCompanySittings($company_id);
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
            $response = $client1->get($SOLDI_DEFAULT_PATH . '/business/store?business_id=' . $business_id);
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

            $bus_array["business_id"] = $business_id;
            $bus_array["business_name"] = $business_name;
            $bus_array["business_email"] = $business_email;
            $bus_array["business_account_type"] = $business_account_type;
            $bus_array["business_mobile"] = $business_mobile;
            $bus_array["business_location"] = $business_location;
            $bus_array[self::USER_ID] = $user_id;
            $bus_array["business_detail"] = $business_detail;
            $bus_array["business_detail_info"] = $business_detail_info;

            if ($store_data[0]->business_image) {
                $timage = $store_data[0]->business_image;
                $bus_image = $timage->thumb1;
            } else {
                $bus_image = 'http://superportal.darkwing.io/public/news/ALS-Food-Hero.jpg';
            }
            $business_image = 'http://superportal.darkwing.io/public/news/ALS-Food-Hero.jpg';
            $bus_image1 = $business_image;
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $image_arr[] = array(self::BUSINESS_IMAGE => $bus_image1);
            $bus_array['images'] = $image_arr;

            $res_setting = $client->request('GET', $SOLDI_DEFAULT_PATH . '/business/store_settings?business_id=' . $business_id, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $business_api_key,
                    'SECRET' => $business_secret
                ]
            ]);
            $sittings_array = $res_setting->getBody();
            $sitting_data = json_decode($sittings_array);
            $settings_arr = $sitting_data->data;
            $bus_array['business_settings'] = $settings_arr;

            $res_cat = $client->request('GET', $SOLDI_DEFAULT_PATH . '/pos/category?business_id=' . $business_id, [
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

                $cat_arr["cate_id"] = $cate_id;
                $cat_arr["cate_name"] = $cate_name;
                if ($cate_image) {
                    $cat_arr["cate_image"] = $cate_image->image;
                } else {
                    $cat_arr["cate_image"] = '';
                }
                $cat_arr["cate_color"] = $cate_color;
                $cat_arr["cate_type"] = $cat_row->cate_type;
                $cat_arr["cate_detail"] = $cate_detail;
                $cat_arr["displaypriority"] = $displaypriority;
                $cate_array[] = $cat_arr;
            }

            $bus_array['categories'] = $cate_array;
            $arr[self::STATUS] = true;
            $arr['data'] = (object)$bus_array;
            return $arr;


        } catch (RequestException $e) {

            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Server error!';
            $arr['data'] = '';
            return $arr;

        } catch (\Exception $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = 'Server error!';
            $arr['data'] = '';
            return $arr;
        }
    }

    public function redeem_points($company_id, $venue_id, $soldi_id, $total_amount, $points, $amplify_id)
    {

        Log::channel(self::CUSTOM)->info('Forwarding request to loyalty for point redemption : ',
            ['data' => [self::COMPANY_ID => $company_id, self::VENUE_ID => $venue_id, 'soldi_id' => $soldi_id,
                'total_amount' => $total_amount, 'points' => $points, self::USER_ID => $soldi_id, 'order_id' => '0']]);

        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'redeem_points', [
                self::FORM_PARAMS => [
                    self::COMPANY_ID => $company_id,
                    self::VENUE_ID => $venue_id,
                    'soldi_id' => $soldi_id,
                    'total_amount' => $total_amount,
                    'points' => $points,
                    self::USER_ID => $soldi_id,
                    'order_id' => '0'
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

    public function delete_transaction($transaction_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {
            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'delete_transaction', [
                self::FORM_PARAMS => [
                    'transaction_id' => $transaction_id
                ]
            ]);
            return $res->getBody();

        } catch (RequestException $e) {
            $arr[self::STATUS] = false;
            $arr[self::MESSAGE] = self::SERVER_ERROR;
            return json_encode($arr);


        }
    }

    public function get_allOrder($amplify_id)
    {
        $client = new Client();
        $LOYALTY_DEFAULT_PATH = config('constant.LOYALTY_DEFAULT_PATH');
        try {

            $res = $client->request('POST', $LOYALTY_DEFAULT_PATH . 'get_all_orders', [
                self::FORM_PARAMS => [
                    'customer_id' => $amplify_id
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

    public function appay_rule($pointsArray)
    {
        Log::channel(self::CUSTOM)->info('Applying rules and forwarding data to loyalty : ', ['data' => $pointsArray]);

        try {
            $response = (new Client(['headers' => ['Content-Type' => 'application/json']]))
                ->request('POST', config('constant.LOYALTY_DEFAULT_PATH') . 'apply_rules', [
                    'json' => $pointsArray
                ]);

            $aply_rule = json_decode($response->getBody()->getContents());

            Log::channel(self::CUSTOM)->info('Response returned from loyalty while applying rules : ', ['data' => $aply_rule]);

            if ($aply_rule->status) {
                return [self::STATUS => true, self::MESSAGE => 'Apply rule successfully.'];
            }
            else {
                return [self::STATUS => false, self::MESSAGE => 'No data found.'];
            }
        } catch (\Exception $e) {
            return [self::STATUS => false, self::MESSAGE => self::SERVER_ERROR];
        }//..... end of try-catch( ).....//
    }//..... end of function() .....//
}//..... end of class.