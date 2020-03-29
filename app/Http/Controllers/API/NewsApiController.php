<?php

namespace App\Http\Controllers\Api;

use App\Models\QuickBoard;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsCategories as NewsCategory;
use League\Flysystem\Exception;
use App\Models\FavouriteNews;
use App\Models\Setting;
use DB;
use GuzzleHttp\Client;

class NewsApiController extends Controller
{
    /*sonar constants*/
    const NEWS_ID                 = 'news_id';
    const USER_ID                 = 'user_id';
    const NEWS_SUBJECT                 = 'news_subject';
    const NEWS_DESC                 = 'news_desc';
    const NEWS_IMAGE                 = 'news_image';
    const NEWS_TAG                 = 'news_tag';
    const NEWS_WEB_DETAIL                 = 'news_web_detail';
    const NEWS_URL                 = 'news_url';


    const X_API_KEY = "2bfb2eb207f94c53ccc12df8540d144e";
    const DEFAULT_PATH = 'www.mywatchtower.co/api_v1';

    /**
     * @return mixed
     */
    public function index()
    {
        $news = News::get();
        $favourite_news = FavouriteNews::select(self::NEWS_ID, self::USER_ID)->get();
        foreach ($favourite_news as $favourite) {
            $top_contents = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL, self::NEWS_URL)->limit(2)->get();
            $category = NewsCategory::get();
            foreach ($category as $cat_row) {
                $news_single = array();
                $news_single["id"] = $cat_row->news_category_id;
                $news_single["name"] = $cat_row->news_category_name;
                $news_array = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL, self::NEWS_URL)
                    ->where('news_category_id', '=', $cat_row->news_category_id)
                    ->get();
                $news_single["contents"] = $news_array;
                $array[] = $news_single;
            }
            $final_array["content_list"] = $array;
            $final_array["top_contents"] = $top_contents;
            if ($final_array) {
                $final_array['status'] = true;
                $final_array['message'] = "Data Found";
                return $final_array;
            }
        }
    }


    public function news_OLD(Request $request)
    {
        $user_id = $request->user_id;
        $latitude = $request->latitude;
        $longitude = $request->longitude;
        $company_id = $request->company_id;
        $Setting = Setting::select('pagination_limit')->first();
        $limit = $Setting->pagination_limit;
        if ($request->has(self::USER_ID) AND $request->has('latitude') AND $request->has('longitude') AND $request->has('company_id')) {
            $rangeVenueArr = $this->venueList($latitude, $longitude, $company_id);
            $category = NewsCategory::where('company_id', $company_id)->get();
            $news_top_array = array();
            if (count($category) > 0) {
                foreach ($category as $cat_row) {
                    $news_single = array();
                    $news_single["id"] = $cat_row->news_category_id;
                    $news_single["name"] = $cat_row->news_category_name;
                    $news_single["category_image"] = $cat_row->news_category_image;

                    News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->get()->toArray();

                    $levels_news = News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url', 'news.created_at', 'news.is_public', 'news.venue_id')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->limit($limit)
                        ->orderBy('news.id', 'desc')
                        ->get()->toArray();
                    $newsFilterArray = [];
                    foreach ($levels_news as $l_news) {
                        $venue_id = $l_news['venue_id'];
                        if (!empty($rangeVenueArr)) {
                            if (in_array($venue_id, $rangeVenueArr)) {
                                $newsFilterArray[] = $l_news;
                                continue;
                            }
                        }
                        if ($l_news['is_public'] == 1) {
                            $newsFilterArray[] = $l_news;
                        }
                    }

                    $news_sub_array = array();
                    $total_rows = count($newsFilterArray);
                    $news_single["total_rows"] = $total_rows;
                    if (count($newsFilterArray) != 0) {
                        foreach ($newsFilterArray as $p_news) {
                            $favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $p_news[self::NEWS_ID])->where(self::USER_ID, '=', $user_id)->first();
                            if ($favourite_news == null) {
                                $p_news['news_is_favourite'] = '0';
                            } else {
                                $p_news['news_is_favourite'] = '1';
                            }
                            $clear = strip_tags($p_news[self::NEWS_DESC]);
                            // Clean up things like &amp;
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

                            $p_news[self::NEWS_DESC] = $trimstring;
                            $originalDate = $p_news['created_at'];
                            $p_news['news_date'] = date("d F Y", strtotime($originalDate));
                            $news_sub_array[] = $p_news;
                        }
                    } else {
                        $news_sub_array = [];
                    }
                    $top_contents = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL, self::NEWS_URL)->where('news.news_is_featured', '=', 1)->where('news_category_id', $news_single)->get();
                    foreach ($top_contents as $top_row) {

                        $top_favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $top_row->news_id)->where(self::USER_ID, '=', $user_id)->first();
                        if ($top_favourite_news == null) {
                            $top_row->news_is_favourite = 0;
                        } else {
                            $top_row->news_is_favourite = 1;
                        }
                        $clear = strip_tags($top_row->news_desc);
                        // Clean up things like &amp;
                        $clear = html_entity_decode($clear);
                        // Strip out any url-encoded stuff
                        $clear = urldecode($clear);
                        // Replace non-AlNum characters with space
                        $clear = preg_replace('/[^A-Za-z0-9]/', ' ', $clear);
                        // Replace Multiple spaces with single space
                        $clear = preg_replace('/ +/', ' ', $clear);
                        // Trim the string of leading/trailing space
                        $clear = trim($clear);
                        $trimstring = substr($clear, 0, 120);

                        $top_row->news_desc = $trimstring;
                        $originalDate = date($top_row->created_at);
                        $date = date_create($originalDate);
                        $top_row->news_date = date_format($date, "d F Y");
                        $news_top_array[] = $top_row;
                    }

                    $news_single["contents"] = $news_sub_array;
                    $array[] = $news_single;
                }
                $final_array["content_list"] = $array;
                $final_array["top_contents"] = $news_top_array;
                $final_array['status'] = true;
                $final_array['message'] = "Data Found";
                return $final_array;

            } else {
                $arr['status'] = false;
                $arr['message'] = 'No data found';
                return json_encode($arr);
            }
        } else {
            $arr['status'] = false;
            $arr['message'] = 'No data found';
            return json_encode($arr);
        }
    }

    public function news(Request $request)
    {
        $user_id = $request->user_id;
        $company_id = $request->company_id;
        $venue_id = $request->venue_id;
        $Setting = Setting::select('pagination_limit')->first();
        $limit = $Setting->pagination_limit;;
        if ($request->has(self::USER_ID) AND $request->has('latitude') AND $request->has('longitude') AND $request->has('company_id')) {

            $category = NewsCategory::where('company_id', $company_id)->where('venue_id', $venue_id)->get();
            $news_top_array = array();
            if (count($category) > 0) {
                foreach ($category as $cat_row) {
                    $news_single = array();
                    $news_single["id"] = $cat_row->news_category_id;
                    $news_single["name"] = $cat_row->news_category_name;
                    $news_single["category_image"] = url('public/news_category') . '/' . $cat_row->news_category_image;
                    News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->get()->toArray();

                    $levels_news = News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url', 'news.created_at', 'news.is_public', 'news.venue_id')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->limit($limit)
                        ->orderBy('news.id', 'desc')
                        ->get()->toArray();
                    $newsFilterArray = [];
                    foreach ($levels_news as $l_news) {
                        $news_venue_id = $l_news['venue_id'];
                        if ($venue_id == $news_venue_id) {
                            $newsFilterArray[] = $l_news;
                            continue;
                        }
                        if ($l_news['is_public'] == 1) {
                            $newsFilterArray[] = $l_news;
                        }
                    }
                    $news_sub_array = array();
                    $total_rows = count($newsFilterArray);
                    $news_single["total_rows"] = $total_rows;
                    if (count($newsFilterArray) != 0) {
                        foreach ($newsFilterArray as $p_news) {


                            $favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $p_news[self::NEWS_ID])->where(self::USER_ID, '=', $user_id)->first();
                            if ($favourite_news == null) {
                                $p_news['news_is_favourite'] = '0';
                            } else {
                                $p_news['news_is_favourite'] = '1';
                            }
                            $clear = strip_tags($p_news[self::NEWS_DESC]);
                            // Clean up things like &amp;
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

                            $p_news[self::NEWS_DESC] = $trimstring;
                            $originalDate = $p_news['created_at'];
                            $p_news['news_date'] = date("d F Y", strtotime($originalDate));
                            $news_sub_array[] = $p_news;
                        }
                    } else {
                        $news_sub_array = [];
                    }
                    $top_contents = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL, self::NEWS_URL, 'created_at')->where('news.news_is_featured', '=', 1)->where('news.venue_id', '=', $venue_id)->where('news_category_id', $news_single)->get();
                    foreach ($top_contents as $top_row) {

                        $top_favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $top_row->news_id)->where(self::USER_ID, '=', $user_id)->first();
                        if ($top_favourite_news == null) {
                            $top_row->news_is_favourite = 0;
                        } else {
                            $top_row->news_is_favourite = 1;
                        }
                        $clear = strip_tags($top_row->news_desc);
                        // Clean up things like &amp;
                        $clear = html_entity_decode($clear);
                        // Strip out any url-encoded stuff
                        $clear = urldecode($clear);
                        // Replace non-AlNum characters with space
                        $clear = preg_replace('/[^A-Za-z0-9]/', ' ', $clear);
                        // Replace Multiple spaces with single space
                        $clear = preg_replace('/ +/', ' ', $clear);
                        // Trim the string of leading/trailing space
                        $clear = trim($clear);
                        $trimstring = substr($clear, 0, 120);

                        $top_row->news_desc = $trimstring;
                        $originalDate = date($top_row->created_at);
                        $date = date_create($originalDate);
                        $top_row->news_date = date_format($date, "d F Y");
                        $news_top_array[] = $top_row;
                    }

                    $news_single["contents"] = $news_sub_array;
                    $array[] = $news_single;
                }
                $final_array["content_list"] = $array;
                $final_array["top_contents"] = $news_top_array;
                $final_array['status'] = true;
                $final_array['message'] = "Data Found";
                return $final_array;

            } else {
                $arr['status'] = false;
                $arr['message'] = 'No data found';
                return json_encode($arr);
            }


        } else {
            $arr['status'] = false;
            $arr['message'] = 'No data found';
            return json_encode($arr);
        }
    }


    public function newsPagination(Request $request)
    {
        $user_id = $request->user_id;
        $company_id = $request->company_id;
        $news_range = $request->news_range;
        $venue_id = $request->venue_id;
        $Setting = Setting::select('pagination_limit')->first();
        $limit = $Setting->pagination_limit;;
        if ($request->has(self::USER_ID) AND $request->has('latitude') AND $request->has('longitude') AND $request->has('company_id') AND $request->has('category_id') AND $request->has('news_range')) {
            $category = NewsCategory::where('company_id', $company_id)->get();
            $news_top_array = array();
            if (count($category) > 0) {
                foreach ($category as $cat_row) {
                    $news_single = array();
                    $news_single["id"] = $cat_row->news_category_id;
                    $news_single["name"] = $cat_row->news_category_name;

                    News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->offset($news_range)
                        ->limit($limit)
                        ->get()->toArray();

                    $levels_news = News::select('news.id as news_id', 'news.news_subject', 'news.news_desc', 'news.news_image', 'news.news_tag', 'news.news_web_detail', 'news.news_url', 'news.created_at', 'news.is_public', 'news.venue_id')
                        ->whereRaw('FIND_IN_SET(' . $news_single["id"] . ',news.news_category_id)')
                        ->where('news.company_id', $company_id)
                        ->offset($news_range)
                        ->limit($limit)
                        ->orderBy('news.id', 'desc')
                        ->get()->toArray();
                    $newsFilterArray = [];
                    foreach ($levels_news as $l_news) {
                        $news_venue_id = $l_news['venue_id'];
                        if ($venue_id == $news_venue_id) {
                            $newsFilterArray[] = $l_news;
                            continue;
                        }
                        if ($l_news['is_public'] == 1) {
                            $newsFilterArray[] = $l_news;
                        }
                    }
                    $news_sub_array = array();
                    $total_rows = count($newsFilterArray);
                    $news_single["total_rows"] = $total_rows;
                    if (count($newsFilterArray) != 0) {
                        foreach ($newsFilterArray as $p_news) {


                            $favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $p_news[self::NEWS_ID])->where(self::USER_ID, '=', $user_id)->first();
                            if ($favourite_news == null) {
                                $p_news['news_is_favourite'] = '0';
                            } else {
                                $p_news['news_is_favourite'] = '1';
                            }
                            $clear = strip_tags($p_news[self::NEWS_DESC]);
                            // Clean up things like &amp;
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

                            $p_news[self::NEWS_DESC] = $trimstring;
                            $originalDate = $p_news['created_at'];
                            $p_news['news_date'] = date("d F Y", strtotime($originalDate));
                            $news_sub_array[] = $p_news;
                        }
                    } else {
                        $news_sub_array = [];
                    }
                    $top_contents = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL, self::NEWS_URL)->where('news.news_is_featured', '=', 1)->where('news_category_id', $news_single)->get();
                    foreach ($top_contents as $top_row) {

                        $top_favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $top_row->news_id)->where(self::USER_ID, '=', $user_id)->first();
                        if ($top_favourite_news == null) {
                            $top_row->news_is_favourite = 0;
                        } else {
                            $top_row->news_is_favourite = 1;
                        }
                        $clear = strip_tags($top_row->news_desc);
                        // Clean up things like &amp;
                        $clear = html_entity_decode($clear);
                        // Strip out any url-encoded stuff
                        $clear = urldecode($clear);
                        // Replace non-AlNum characters with space
                        $clear = preg_replace('/[^A-Za-z0-9]/', ' ', $clear);
                        // Replace Multiple spaces with single space
                        $clear = preg_replace('/ +/', ' ', $clear);
                        // Trim the string of leading/trailing space
                        $clear = trim($clear);
                        $trimstring = substr($clear, 0, 120);

                        $top_row->news_desc = $trimstring;
                        $originalDate = date($top_row->created_at);
                        $date = date_create($originalDate);
                        $top_row->news_date = date_format($date, "d F Y");
                        $news_top_array[] = $top_row;
                    }

                    $news_single["contents"] = $news_sub_array;
                    $array[] = $news_single;
                }
                $final_array["content_list"] = $array;
                $final_array["top_contents"] = $news_top_array;
                $final_array['status'] = true;
                $final_array['message'] = "Data Found";
                return $final_array;

            } else {
                $arr['status'] = false;
                $arr['message'] = 'No data found';
                return json_encode($arr);
            }


        } else {
            $arr['status'] = false;
            $arr['message'] = 'No data found';
            return json_encode($arr);
        }
    }

    /**
     *
     */
    public function venueList($late = "", $long = "", $company_id = "")
    {

        $client = new Client();
        $Beacons_AP1_URL = config('constant.Beacons_AP1_URL');
        if ($company_id == 2) {
            $beacon_Api_key = config('constant.Max_Beacons_AP1_key');
        } else {
            $beacon_Api_key = config('constant.Puma_Beacons_AP1_key');
        }

        $res = $client->request('GET', $Beacons_AP1_URL . '/venues', [
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-KEY' => $beacon_Api_key,
            ]
        ]);
        $venues_list = $res->getBody();
        $venue_data = json_decode($venues_list);
        $venue_arr = $venue_data->data;
        $ven_array = array();
        foreach ($venue_arr as $venue) {

            $venue_latitude = $venue->venue_latitude;
            $venue_longitude = $venue->venue_longitude;
            $des_arr = $this->getDistance($late, $long, $venue_latitude, $venue_longitude);
            $dis_status = $des_arr['status'];
            if ($dis_status == 'OK') {

                $dist = @$des_arr['rows'][0]['elements'][0]['distance']['value'];
                if ($dist == '') {
                    $distance = 0;
                } else {
                    $distance = $dist;
                }
                if ($distance != 0 && $distance <= 5000) {
                    $venue_id = $venue->venue_id;
                    $ven_array[] = $venue_id;
                }
            }
        }
        return $ven_array;
    }

    //
    function getDistance($oregin_late, $oregin_long, $venue_latitude, $venue_longitude)
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
        //return $response;
        return $response_a = json_decode($response, true);

    }

    /**
     * @param Request $request
     * @return array|string
     */

    public function storeFavouriteNews(Request $request)
    {
        $news_id = $request->news_id;
        $user_id = $request->user_id;
        $company_id = $request->company_id;
        if (!empty($news_id) AND !empty($user_id)) {
            $favourite_news = FavouriteNews::where(self::NEWS_ID, '=', $news_id)->where(self::USER_ID, '=', $user_id)->where('company_id', $company_id)->first();
            if ($favourite_news == null) {
                $favourite = new  FavouriteNews();
                $favourite->news_id = $news_id;
                $favourite->user_id = $user_id;
                $favourite->company_id = $company_id;
                $favourite->save();
                $news = [];
                $news['message'] = "your news has been favourite";
                $news['like_status'] = "like";
                $news['status'] = true;
                return $news;

            } else {
                try {

                    DB::table('favourite_news')->where('company_id', $company_id)->where(self::NEWS_ID, '=', $news_id)->where(self::USER_ID, '=', $user_id)->delete();
                } catch (Exception $e) {
                    //return "1";
                }
                $news = [];
                $news['message'] = "you successfully unfavourite news";
                $news['like_status'] = "unlike";
                $news['status'] = true;
                return $news;
            }
        } else {
            $msg = [];
            $msg['message'] = "your request has been failed";
            $msg['status'] = false;
            return $msg;
        }
    }


    public function getVenueNews(Request $request)
    {

        $venue_id = $request->has("venue_id") ? $request->venue_id : 0;
        if ($request->has('company_id') and $request->company_id == "")
            return ["status" => false, "message" => "Please select company."];

        $dateTime = now();
        $date = $dateTime->format('Y-m-d');
        $time = $dateTime->format('H:i:s');
        if (strtolower($request->news_type) == "news") {
            $level_venues = NewsCategory::select('news_category_id as id', 'news_category_name as name', 'news_category_image as image')
                ->where(["company_id" => $request->company_id])->get()
                ->each(function ($venue_level) use ($venue_id, $date, $time) {
                    $venue_level->contents = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL
                        , self::NEWS_URL, 'created_at', 'is_public', 'venue_id', 'news_is_featured as news_is_favourite', 'news_type')
                        ->where('news_type', "=", "News")
                        ->whereDate('news.start_date', '<=', $date)
                        //->whereTime('news.start_date', '<=', $time)
                        ->whereDate('news.end_date', '>=', $date)
                        //->whereTime('news.end_date', '>=', $time)
                        ->where('news_category_id', $venue_level->id);
                    if ($venue_id != 0) {
                        $venue_level->contents = $venue_level->contents
                            ->where(function ($query) use ($venue_id) {
                                $query->where(['news.venue_id' => $venue_id])
                                    ->orWhere(['news.venue_id' => 0]);
                            });
                    }
                    $venue_level->contents = $venue_level->contents->orderBy('news.created_at', 'DESC')
                        ->get()
                        ->each(function ($news) {
                            $news->news_image = url('/') . '/news/' . $news->news_image;
                            $news->news_is_favourite = $news->news_is_favourite ?? 0;
                            $news->news_url = $news->news_url ?? '';
                            $news->news_tag = $news->news_tag ?? 0;
                            $news->created_at = $news->created_at ?? '';

                            $news->news_image = url('/') . '/news/' . $news->news_image;
                        });
                });
            return $level_venues->isNotEmpty()
                ? ['status' => true, 'content_list' => $level_venues, 'url' => url('/') . '/news/', 'message' => 'Record Found']
                : ['status' => false, 'message' => 'No data found'];
        } else {
            $limit = ($request->has('limit') && $request->limit != "") ? $request->limit : 5;
            $data = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL
                , self::NEWS_URL, 'created_at', 'is_public', 'venue_id', 'news_is_featured as news_is_favourite', 'news_type', 'video_link')
                ->where(["news_type" => $request->news_type])
                ->paginate($limit);
            foreach ($data as $key => $news) {
                $news->news_image = url('/') . '/news/' . $news->news_image;
                $news->video_link = $news->video_link . "?rel=0";
            }
            return ["status" => true, "message" => "Data Found", "data" => $data->toArray()['data']];
        }

    }//..... end of getVenueNews() ......//

    //......   Api for community news  .....//
    public function getCommunityNews(Request $request)
    {
        $data = News::where(["news_type" => "community_news", "venue_id" => $request->venue_id])->get();
        return ['status' => true, "message" => "Data found", "data" => $data];
    }

    public function getVideos(Request $request)
    {
        $data = QuickBoard::where(["id" => $request->venue_id])->orderBy('display_order', 'ASC')->get();
        return ['status' => true, "message" => "Data found", "data" => $data];
    }

    public function getEvents(Request $request)
    {
        $data = News::select('id as news_id', self::NEWS_SUBJECT, self::NEWS_DESC, self::NEWS_IMAGE, self::NEWS_TAG, self::NEWS_WEB_DETAIL
            , self::NEWS_URL, 'created_at', 'is_public', 'venue_id', 'news_is_featured as news_is_favourite')
            ->get()->each(function ($news) {
                $news->news_image = url('/') . '/news/' . $news->news_image;
            });
        return ["status" => true, "message" => "Data Found", "data" => $data];
    }

    public function getAllNews(Request $request)
    {
        $news_type = $request->news_type;
        $venue_id = $request->venue_id;
        $result = News::orderBy('id', 'DESC')->leftJoin("news_categories", "news_categories.news_category_id", "=", "news.news_category_id")
            ->where(["news.company_id" => $request->company_id])
            ->when($news_type, function ($query, $news_type) {
                return $query->where(["news_type" => $news_type]);
            })
            ->when($venue_id, function ($query, $venue_id) {
                return $query->where(["news.venue_id" => $venue_id])->orWhere(['news.venue_id' => 0,]);
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
        $data['data'] = $result->get();
        $data['total'] = $result->count();

        foreach ($data['data'] as $key => $value) {
            $value->news_image = url('/') . '/news/' . $value->news_image;
            $value->news_is_featured = $value->news_is_featured ?? 0;
            $value->video_link = $value->video_link ?? 0;
            $value->news_url = $value->news_url ?? '';
            $value->news_tag = $value->news_tag ?? 0;
            $value->start_date = $value->start_date ?? '';
            $value->end_date = $value->end_date ?? '';
            if ($value->venue_id === 0)
                $value->news_category_name = ($value->news_category_name) . "/<b style='font-weight: bold;'>Global News</b>";

            if ($value->news_category_name === null)
                $value->news_category_name = "Community News";

            $value->selected_board_news = DB::table("quick_board_news")->select(["board_id", self::NEWS_ID, "board_title"])
                ->leftJoin("quick_boards", "quick_boards.id", "=", "quick_board_news.board_id")->where("quick_board_news.news_id", $value->id)->get();
            foreach ($value->selected_board_news as $key2 => $value2) {
                $value->listBoards = $value->listBoards . "<strong class='news_owner'>" . $value2->board_title . "</strong>";
            }

        }/* end of foreach 1 */
        $data['status'] = true;

        return $data;
    }

    public function getNews(Request $request)
    {
        $venue_id = $request->venue_id;
        $limit = $request->has('limit') ? $request->limit : 1000;
        $data = DB::table("news")->select([
            "news.*", "news_categories.news_category_name"])
            ->leftJoin("news_categories", "news.news_category_id", "=", "news_categories.news_category_id")
            ->when($venue_id, function ($query, $venue_id) {
                return $query->where(["news.venue_id" => $venue_id]);
            })
            ->where(function ($query) {
                return $query->whereDate("news.end_date", ">=", date("Y-m-d"))
                    ->orWhereNull('news.end_date');
            })->paginate($limit);

        foreach ($data as $key => $value) {
            $value->news_image = url('/') . '/news/' . $value->news_image;
            $value->image = url('/') . '/news/' . $value->news_image;
            if ($value->video_link == "null" || $value->video_link === null) {
                $value->video_link = "";
            }
        }
        return ['status' => true, "message" => "data found", 'data' => $data->toArray()['data']];
    }
}//..... end of class.