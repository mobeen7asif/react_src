<?php /** @noinspection ALL */

/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 1/16/2018
 * Time: 12:16 PM
 */

namespace App\Utility;

use App\Http\Controllers\API\ElasticSearchController;
use App\Models\PunchCard;
use App\Models\UserCustomFieldData;
use App\Models\UserLoyaltyPoints;
use GuzzleHttp\Client;
use App\Models\Segment;
use App\User;
use Carbon\Carbon;
use Elasticsearch\ClientBuilder;
use MongoDB\Driver\Exception\ExecutionTimeoutException;
use function GuzzleHttp\Psr7\str;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Mockery\Exception;
use function Symfony\Component\VarDumper\Dumper\esc;

class ElasticsearchUtility
{

    private $client;
    public $elasticClient;


    /**
     * ElasticsearchUtility constructor.
     */
    public function __construct()
    {
        set_time_limit(0);
        $this->elasticClient = $this->client = ClientBuilder::create()->setHosts([Config::get('constant.ES_URL')])->build();

    }

    /**
     * Create index in elasticsearch.
     */
    public static function createIndex($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = \config('constant.ES_INDEX_BASENAME');
        }

        try {
            $params = [
                'index' => $indexName,
                'body' => [
                    'settings' => [
                        'number_of_shards' => 2,
                        'number_of_replicas' => 1,
                        "analysis" => [
                            "normalizer" => [
                                "my_normalizer" => [
                                    "type" => "custom",
                                    "filter" => ["lowercase"]
                                ]
                            ],
                            "analyzer" => [
                                "my_analyzer" => [
                                    "type" => "custom",
                                    "filter" => ["lowercase"],
                                    "tokenizer" => "whitespace"
                                ]
                            ],
                        ]
                    ],
                    'mappings' => self::defaultMapping()
                ]
            ];

            return (new self())->client->indices()->create($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of createIndex() .....//

    /**
     * Set index settings
     */
    public static function putIndexSettings($indexName = null, $settings = [])
    {
        if (empty($indexName)) {
            $indexName = \config('constant.ES_INDEX_BASENAME');
        }

        try {
            $params = [
                'index' => $indexName,
                'body' => [
                    'settings' => $settings,
                ]
            ];
            return (new self())->client->indices()->putSettings($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of PutIndexSettings() .....//

    /**
     * Reindex an index in elasticsearch.
     */
    public static function reindexIndex($srcIndex, $dstIndex)
    {
        try {
            $params = [
                'body' => [
                    'source' => [
                        'index' => $srcIndex,
                    ],
                    'dest' => [
                        'index' => $dstIndex,
                    ]
                ]
            ];
            return (new self())->client->reindex($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of reindexIndex() .....//

    /**
     * Check if an index exists in elasticsearch.
     */
    public static function indexExists($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        try {
            $params = [
                'index' => $indexName,
            ];
            return (new self())->client->indices()->exists($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of indexExists() .....//

    /**
     * Get index stats from elasticsearch.
     */
    public static function getIndexStats($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        try {
            $params = [
                'index' => $indexName,
            ];
            return (new self())->client->indices()->stats($params);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//..... end of getIndexStats() .....//

    /**
     * Create index name using index+venue
     * @param $company_id
     * @param $venue_id
     * @return string
     */
    public static function generateIndexName($company_id = "", $venue_id = "")
    {
        return Config::get('constant.ES_INDEX_BASENAME');
    }//..... end of generateIndexName() .....//

    /**
     * @return array
     * Elasticsearch default mapping.
     */
    public static function defaultMapping()
    {
        return [
            "dynamic_templates"=> [[
                "strings_as_text"=>[
                    "match_mapping_type"=> "string",
                    "mapping"=>[
                        "type"=> "text",
                        "fields" =>[
                            "normalize" => [
                                "type" => "keyword",
                                "normalizer" => "my_normalizer"
                            ]
                        ],
                        "fielddata" => true
                    ]
                ]
            ]
            ],
            'properties' => Config::get('default_mapping.default_mapping')
        ];

    }//..... end of defaultMapping() .....//

    /**
     * @param $index
     *  Delete Index From ES
     */
    public static function dropIndex($index)
    {
        try {
            return (new self())->client->indices()->delete(['index' => $index]);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }//.... End of dropIndex() ....//

    /**
     * @param $indexParams
     * @return bool
     */
    public static function checkIndexExists($indexParams)
    {
        return (new self())->client->indices()->exists($indexParams);
    }

    /**
     * @param $total
     * @param $indexName
     */
    public function bulkInsertData($total, $indexName)
    {
        $params = ['body' => []];
        $personDevices = ['body' => []];
        $data = new DataProducer();

        for ($i = 1; $i <= $total; $i++) {
            $count = $i + 400;
            $params['body'][] = [
                'index' => [
                    '_index' => $indexName,
                    '_type' => '_doc',
                    '_id' => $count
                ]
            ];
            $personDevices['body'][] = [
                'index' => [
                    '_index' => $indexName,
                    '_type' => '_doc',
                    '_id' => $count . '_persona_devices'
                ]
            ];


            $params['body'][] = $data->generatePatron($count);

            $personDevices['body'][] = $data->generatePersonaDevices($count);


            if ($i % 500 == 0) {
                $responses = (new self())->client->bulk($params);
                $personResponse = (new self())->client->bulk($personDevices);
                // erase the old bulk request
                $params = $personDevices = ['body' => []];
                // unset the bulk response when you are done to save memory
                unset($responses);
                unset($personResponse);
            }
        }

        // Send the last batch if it exists
        if (!empty($params['body'])) {
            $responses = (new self())->client->bulk($params);
            (new self())->client->bulk($personDevices);

            //...... Insert items sold fake data.
            foreach ($responses['items'] as $item) {
                $saleItems['body'][] = [
                    'index' => [
                        '_index' => $indexName,
                        '_type' => '_doc'
                    ]
                ];
                $saleItems['body'][] = $data->generateSaleItem($item['index']['_id']);
            }//..... end foreach() .....//

            if (!empty($saleItems['body']))
                (new self())->client->bulk($saleItems);
        }
    }//--- End of bulkInsertData() ---//

    /**
     * @param $request
     * @param $indexName
     * @return array
     * Get Members List.
     */
    public static function patronData($request, $indexName)
    {
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]]
                ]
            ]
        ];
        $segment_search = $request->segmentSearch;
        if (count($segment_search) > 0) {
            $search_query = (new Segmentation(ElasticsearchUtility::generateIndexName($request->company_id, $request->venue_id)))
                ->prepareMemberSearchQuery($segment_search, []);
            $search_query = $search_query['query'];
        }
        $sorting = $request->sorting == 'persona_email' ? 'emails.personal_emails' : $request->sorting;

        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'sort' => [
                 "{$sorting}" => ['order' => $request->sortingOrder]
             ]
        ];


        if ($request->has('serchName') && $request->serchName) {
            if (is_numeric($request->serchName)) {
                $max_user_id_len = strlen(User::orderBy('user_id', 'desc')->first()->user_id);
                if (strlen($request->serchName) > $max_user_id_len) {
                    $query['query']['bool']['must'][]['bool']['should'] = [
                        //['match_phrase' => ['membership_id' => $request->serchName]],
                        ['wildcard' => ['devices.mobile' => '*' . $request->serchName . '*']]
                    ];
                } else {
                    array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                        ['wildcard' => ['client_customer_id' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['persona_id' => '*' . ($request->serchName . '*')]],
                    ]
                    ]]);
                }
            } else {
                $nameSearch = explode(' ', $request->serchName);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_fname.normalize' => '*' . ($nameSearch[0] . '*')]]);
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_lname.normalize' => '*' . ($nameSearch[1] . '*')]]);
                } else {
                    array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                        ['wildcard' => ['persona_fname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['persona_lname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['emails.personal_emails.normalize' => '*' . ($request->serchName . '*')]]
                    ]
                    ]]);
                }
                //..... end of inner if-else() .....//

            }
            //..... end of if-else() .....//
        }//..... end of outer-if() .....//
        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of patronData() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function vouchersData($request, $indexName)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;


        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
                    ['match' => ['persona_id' => $request->persona_id]],
                ]
            ]
        ];

        if (isset($start_date) && isset($end_date)) {
            $start_date = new Carbon($start_date);
            $start_date = $start_date->addDay(1)->toDateString();

            $end_date = new Carbon($end_date);
            $end_date = $end_date->addDay(1)->toDateString();

            $range = [];
            // -12 hours from start date and +11 to end date
            $range[]['range']['dateadded']['gte'] = strtotime($start_date) - 43200;
            $range[]['range']['dateadded']['lte'] = strtotime($end_date) + 39600;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'sort' => [[
                "{$request->sorting}" => ['order' => $request->sortingOrder, 'unmapped_type' => 'keyword']
            ]]
        ];
//        $sort = [];
//        if(self::fieldExists($indexName,'persona_fname')) {
//            $sort = ;
//            $query['sort'] = $sort;
//
//        }
        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function maleFemaleStats($filter_date, $gender, $request, $indexName)
    {
        $rangeData = $request->rangeData;

        $finalResult = [];

        foreach ($rangeData as $rangeDatum) {
            $search_query = [];
            $search_query = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        ['match' => ['gender' => $gender]],
                    ]
                ]
            ];

            $seperate_date = explode("-", $rangeDatum);


            $first_arg = $seperate_date[0];
            $last_arg = $seperate_date[1];

            $from_date = Carbon::now()->subYears($last_arg)->toDateString();
            $to_date = Carbon::now()->subYears($first_arg)->toDateString();

            $range = [];
            $range[]['range']['date_of_birth']['gte'] = $from_date;
            $range[]['range']['date_of_birth']['lte'] = $to_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];

            /*date filter check*/
            if ($filter_date) {
                $range[]['range']['date_added']['gte'] = $filter_date;
                $search_query['bool']['must'][] = $range[2];
            } else {

                $start_date = $request->start_date . ' 00:00:00';
                $end_date = $request->end_date . ' 23:59:59';

                $range[]['range']['date_added']['gte'] = $start_date;
                $range[]['range']['date_added']['lte'] = $end_date;
                $search_query['bool']['must'][] = $range[2];
                $search_query['bool']['must'][] = $range[3];
            }
            $query = [
                'query' => $search_query,
                'aggs' => [
                    'all_gender' => ['value_count' => ['field' => '_id']],
                ]
            ];



            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);

//            for negative stack chart
//            $value = ($gender == 'M')?-1:1;
            $value = 1;
            $num = $value * abs($myData['aggregations']['all_gender']['value']);


//            //sqlquery
//            $curr_date = date('Y-m-d');
//
//            $mysql_query = User::where('gender',$gender)->whereRaw("TIMESTAMPDIFF(YEAR,dob,'$curr_date') >= $first_arg")
//                ->whereRaw("TIMESTAMPDIFF(YEAR,dob,'$curr_date') <= $last_arg");
//            /*date filter check*/
//            if ($filter_date) {
//                $mysql_query->where('created_at' ,'>=',$filter_date);
//
//            } else {
//                $mysql_query->where('created_at' ,'>=',$request->start_date)->where('created_at','<=',$request->end_date);
//            }
//
//
//            $finalResult[] = $mysql_query->count();
//            $finalResult[$from_date . ' '. $to_date] = json_encode($query);

            $finalResult[] = $num;
        }
        return $finalResult;
    }//..... end of maleStats() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function unknownGenderStats($filter_date, $request, $indexName)
    {


        $rangeData = $request->rangeData;
        $finalResult = [];

        foreach ($rangeData as $rangeDatum) {
            $search_query = [];

            $search_query = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]]
                    ]
                ]
            ];
            array_push($search_query['bool']['must'], ['bool' => ['should' => [
                ['bool' => [
                    'must_not' => ['exists' => ['field' => 'gender']],
                ]],
                ['match' => ['gender' => '']],
            ]
            ]]);
            $seperate_date = explode("-", $rangeDatum);

            $first_arg = $seperate_date[0];
            $last_arg = $seperate_date[1];

            $from_date = Carbon::now()->subYears($last_arg)->toDateString();
            $to_date = Carbon::now()->subYears($first_arg)->toDateString();


            $range = [];
            $range[]['range']['date_of_birth']['gte'] = $from_date;
            $range[]['range']['date_of_birth']['lte'] = $to_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];

            /*date filter check*/
            if ($filter_date) {
                $range[]['range']['date_added']['gte'] = $filter_date;
                $search_query['bool']['must'][] = $range[2];
            } else {

                $start_date = $request->start_date . ' 00:00:00';
                $end_date = $request->end_date . ' 23:59:59';

                $range[]['range']['date_added']['gte'] = $start_date;
                $range[]['range']['date_added']['lte'] = $end_date;
                $search_query['bool']['must'][] = $range[2];
                $search_query['bool']['must'][] = $range[3];
            }

            $query = [
                'query' => $search_query,
                'aggs' => [
                    'all_gender' => ['value_count' => ['field' => '_id']],
                ]
            ];
            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);

            $num = $myData['aggregations']['all_gender']['value'];



            //sqlquery
//            $curr_date = date('Y-m-d');
//
//            $unknown_ids = User::where('gender','')->orWhere('gender',null)->pluck('user_id');
//
//            dd($unknown_ids->toArray());
//            $mysql_query = User::where('gender','')->orWhere('gender',null)
//                ->where(function ($query) use($curr_date,$first_arg,$last_arg) {
//                    $query->whereRaw("TIMESTAMPDIFF(YEAR,dob,'$curr_date') >= $first_arg");
//                    $query->whereRaw("TIMESTAMPDIFF(YEAR,dob,'$curr_date') <= $last_arg");
//                });
//            dd($mysql_query->toSql());
//            /*date filter check*/
//            if ($filter_date) {
//                $mysql_query->where('created_at' ,'>=',$filter_date);
//
//            } else {
//                $mysql_query->where('created_at' ,'>=',$request->start_date)->where('created_at','<=',$request->end_date);
//            }
//
//            $finalResult[] = $mysql_query->count();

              $finalResult[] = $num;
        }
        return $finalResult;
    }//..... end of maleStats() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */


    public static function fieldExists($index, $field_name)
    {
        try {
            $endpoint = Config::get('constant.ES_URL') . '/' . $index . '/_mapping/field/' . $field_name;
            $method_request = "GET";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "$endpoint");
            // SSL important
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, []);
            $output = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);
            $output = json_decode($output, true);
            if (count($output[$index]['mappings']) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }//..... end of fieldExists() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function stampCardsData($request, $indexName)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.punch_card')]],
                    ['match' => ['persona_id' => $request->persona_id]]
                ]
            ]
        ];

        if (isset($start_date) && isset($end_date)) {
            $start_date = $start_date . ' 00:00:00';
            $end_date = $end_date . ' 23:59:00';
            $range = [];
            $range[]['range']['created_at']['gte'] = $start_date;
            $range[]['range']['created_at']['lte'] = $end_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }
        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'sort' => [
                "{$request->sorting}" => ['order' => $request->sortingOrder, 'unmapped_type' => 'keyword']
            ]
        ];
        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $index
     * @param $person_id
     * @return array
     */
    public static function voucherStats($index, $person_id)
    {
        $query = [
            'size' => 1000,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
                        ['match' => ['persona_id' => $person_id]]
                    ]
                ]
            ],
            'aggs' => [
                'total_vouchers' => ['value_count' => ['field' => '_id']],
            ],
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $index
     * @param $person_id
     * @return array
     */
    public static function dashboardVoucherStats($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ["terms" => ["custom_doc_type" => [Config::get('constant.user_integrated_voucher'), Config::get('constant.punch_card')]]],
                ]
            ]
        ];

        $range = [];
        $start_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $end_date = ($filter_date) ? time() : strtotime($end_date);
        // +11 hours from start date and +11 to end date
        $range[]['range']['dateadded']['gte'] = (!$filter_date) ? $start_date + 39600 : $start_date;
        $range[]['range']['dateadded']['lte'] = $end_date + 39600;

        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];

        $aggs = [
            'punch_voucher_aggs' =>
                ['filter' => ['range' =>
                    ['campaign_id' => ['lte' => 0]
                    ]
                ],
                    'aggs' => ['punch_voucher_count' => ['value_count' => ['field' => '_id']]]
                ]


            , 'redeemed_voucher_agg' =>
                ['filter' => ['range' =>
                    ['uses_remaining' => ['lte' => 0]
                    ]
                ],
                    'aggs' => ['redeemed' => ['value_count' => ['field' => '_id']]]
                ]
            , 'punchcard_agg' =>
                ['filter' => ['script' =>
                    ['script' => "doc['custom_doc_type'].value == 'punch_card'"
                    ]
                ],
                    'aggs' => ['punch_card_count' => ['value_count' => ['field' => '_id']]]
                ]
        ];
        $query = [
            'query' => $search_query,
            'aggs' => $aggs,
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//

    public static function memberCountStats($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ["terms" => ["custom_doc_type" => [Config::get('constant.demographic')]]],
                ]
            ]
        ];

/*        $range = [];
        $start_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $end_date = ($filter_date) ? time() : strtotime($end_date);
        // +11 hours from start date and +11 to end date
        $range[]['range']['dateadded']['gte'] = (!$filter_date) ? $start_date + 39600 : $start_date;
        $range[]['range']['dateadded']['lte'] = $end_date + 39600;

        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];*/

        $aggs = [
            'total_members_aggs' =>
                ['filter' => ['range' =>
                    ['persona_id' => ['gt' => 0]
                    ]
                ],
                    'aggs' => ['members_count' => ['value_count' => ['field' => '_id']]]
                ]


            , 'active_member_aggs' =>
                ['filter' => ['term' =>
                    ['status' => 'active']],
                    'aggs' => ['active_count' => ['value_count' => ['field' => '_id']]]
                ]

            , 'inactive_member_aggs' =>
                ['filter' => ['term' =>
                    ['status' => 'inactive']],
                    'aggs' => ['inactive_count' => ['value_count' => ['field' => '_id']]]
                ]
        ];
        $query = [
            'size' => 0,
            'query' => $search_query,
            'aggs' => $aggs,
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//


    public static function voucherScroll($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ["terms" => ["custom_doc_type" => [Config::get('constant.user_integrated_voucher')]]],
                ]
            ]
        ];

        $query = [
            'query' => $search_query,
            'sort' => [
                "dateadded" => ['order' => "asc"],
                "_id" => ['order' => "asc"]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, $response['hits']['hits']);
            //find last document
            $hits_size = count($response['hits']['hits']);
            $query = [
                'query' => $search_query,
                'search_after' => [$response['hits']['hits'][$hits_size - 1]['sort'][0], (string)$response['hits']['hits'][$hits_size - 1]['sort'][1]],
                'sort' => [
                    "dateadded" => ['order' => "asc"],
                    "_id" => ['order' => "asc"]
                ]
            ];

            $response = (new self())->client->search([
                'size' => 1000,
                'index' => $index,
                'body' => $query,
            ]);
//            Log::channel('custom')->info('check', ['qweqwe' => count($data)]);
        }
        return $data;
    }

    public static function stampScroll($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ["terms" => ["custom_doc_type" => [Config::get('constant.punch_card')]]],
                ]
            ]
        ];

        $query = [
            'query' => $search_query,
            'sort' => [
                "dateadded" => ['order' => "asc"],
                "_id" => ['order' => "asc"]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, $response['hits']['hits']);
            //find last document
            $hits_size = count($response['hits']['hits']);
            $query = [
                'query' => $search_query,
                'search_after' => [$response['hits']['hits'][$hits_size - 1]['sort'][0], (string)$response['hits']['hits'][$hits_size - 1]['sort'][1]],
                'sort' => [
                    "dateadded" => ['order' => "asc"],
                    "_id" => ['order' => "asc"]
                ]
            ];

            $response = (new self())->client->search([
                'size' => 1000,
                'index' => $index,
                'body' => $query,
            ]);
//            Log::channel('custom')->info('check', ['qweqwe' => count($data)]);
        }
        return $data;
    }


    public static function stampCardVouchersCount($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
//                    ['match' => ['voucher_type' => '$']]
                ]
            ]
        ];

        $range = [];
        $first_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $second_date = ($filter_date) ? time() : strtotime($end_date) + 86399;
        $range[]['range']['dateadded']['gte'] = $first_date;
        $range[]['range']['dateadded']['lte'] = $second_date;
        $range[]['range']['campaign_id']['lte'] = 0;
        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];
        $search_query['bool']['must'][] = $range[2];

        $query = [
            'query' => $search_query,
            'aggs' => [
                'punchVoucherCount' => ['value_count' => ['field' => '_id']],
            ],
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        dd(json_encode($query));
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $filter_date
     * @param $request , $index
     * @return array
     */
    public static function distinctVoucherStats($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.user_voucher')]],
                    ['match' => ['voucher_type' => '$']]
                ]
            ]
        ];

        $range = [];
        $first_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $second_date = ($filter_date) ? time() : strtotime($end_date) + 86399;
        $range[]['range']['dateadded']['gte'] = $first_date;
        $range[]['range']['dateadded']['lte'] = $second_date;
        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];

        $query = [
            'query' => $search_query,
            'aggs' => [
                'total_amount' => ['sum' => ['field' => 'voucher_amount']],
                'total_vouchers' => ['value_count' => ['field' => '_id']],
            ],
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//


    /**
     * @param $filter_date
     * @param $request , $index
     * @return array
     */
    public static function distinctFirstVoucherRecord($campaign_id, $filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.user_voucher')]],
                    ['match' => ['voucher_type' => '$']],
                    ['match' => ['campaign_id' => $campaign_id]]
                ]
            ]
        ];

        $range = [];
        $first_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $second_date = ($filter_date) ? time() : strtotime($end_date) + 86399;
        $range[]['range']['dateadded']['gte'] = $first_date;
        $range[]['range']['dateadded']['lte'] = $second_date;
        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];

        $query = [

            'size' => 1,

            'query' => $search_query
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $index
     * @param $person_id
     * @return array
     */
    public static function dashboardPunchCardStats($filter_date, $request, $index)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.punch_card')]]
                ]
            ]
        ];

        $range = [];
        $first_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
        $second_date = ($filter_date) ? time() : strtotime($end_date) + 86399;
        $range[]['range']['punch_card_rule.created_at']['gte'] = $first_date;
        $range[]['range']['punch_card_rule.created_at']['lte'] = $second_date;
        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];

        $query = [
            'size' => 200,
            'query' => $search_query,
            'aggs' => [
                'total_punch_cards' => ['value_count' => ['field' => '_id']],
            ],
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of vouchersData() .....//

    /**
     * @param $index
     * @param $person_id
     * @return array
     */

    public static function voucherDetail($index, $voucher_id)
    {
        $query = [
            'size' => 1000,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
                        [
                            "terms" => [
                                "voucher_code" =>$voucher_id
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query])['hits']['hits'];
    }//..... end of voucherDetail() .....//

    /**
     * @param $index
     * @param $person_id
     * @return array
     */
    public static function badgesStats($index, $person_id)
    {
        $query = [
            'size' => 100,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_badges')]],
                        ['match' => ['persona_id' => $person_id]]
                    ]
                ]
            ],
            'aggs' => [
                'total_badges' => ['value_count' => ['field' => '_id']],
            ],
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of badgesStats() .....//


    public static function memberBadges($request, $indexName)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.user_badges')]],
                    ['match' => ['persona_id' => $request->persona_id]]
                ]
            ]
        ];
        if (isset($start_date) && isset($end_date)) {
            $range = [];
            $range[]['range']['dateadded']['gte'] = strtotime($start_date);
            $range[]['range']['dateadded']['lte'] = strtotime($end_date) + 86399;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'sort' => [
                "{$request->sorting}" => ['order' => $request->sortingOrder, 'unmapped_type' => 'keyword']
            ]
        ];
        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of memberBadges() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function dashboardMemberCampaigns($request, $indexName)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]]
                ]
            ]
        ];

        if (isset($start_date) && isset($end_date)) {
            $range = [];
            $range[]['range']['date_added']['gte'] = $start_date . ' 00:00:00';
            $range[]['range']['date_added']['lte'] = $end_date . ' 12:00:00';
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'aggs' => [
                'total_campaigns' => ['value_count' => ['field' => '_id']],
            ]
        ];

        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of dashboardMemberCampaigns() .....//

    public static function dashboardSentCampaignsCount($request, $indexName)
    {
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]],
                    ['match' => ['is_send' => 1]]
                ]
            ]
        ];

        $query = [
            'query' => $search_query
        ];

        return (new self())->client->count(['index' => $indexName, 'body' => $query]);
    }//..... end of dashboardSentCampaignsCount() .....//

    /**
     * @param $request
     * @param $indexName
     * @return array
     */
    public static function memberCampaigns($request, $indexName)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]]
                ]
            ]
        ];
        if ($request->has('persona_id')) {
            $persona_condition = ['match' => ['persona_id' => $request->persona_id]];
            $search_query['bool']['must'][] = $persona_condition;
        }
        if (isset($start_date) && isset($end_date)) {
            $range = [];
            $range[]['range']['date_added']['gte'] = $start_date . ' 00:00:00';
            $range[]['range']['date_added']['lte'] = $end_date . ' 23:00:00';
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'from' => $request->offSet,
            'size' => $request->pageSize,
            'query' => $search_query,
            'aggs' => [
                'total_campaigns' => ['value_count' => ['field' => '_id']],
            ]
        ];

        if ($request->has('persona_id')) {
            $persona_condition = ["{$request->sorting}" => ['order' => $request->sortingOrder, 'unmapped_type' => 'keyword']];
            $query['sort'] = $persona_condition;
        }

        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of memberCampaigns() .....//

    public static function sentCampaignsCount($request, $indexName)
    {
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]],
                    ['match' => ['is_send' => 1]]
                ]
            ]
        ];

        if ($request->has('persona_id')) {
            $persona_condition = ['match' => ['persona_id' => $request->persona_id]];
            $search_query['bool']['must'][] = $persona_condition;
        }


        $query = [
            'query' => $search_query
        ];

        return (new self())->client->count(['index' => $indexName, 'body' => $query]);
    }//..... end of sentCampaignsCount() .....//

    /**
     * @param $index
     * @param $filter_date
     * @param $person_id
     * @return array
     */
    public static function getLatestBadges($index, $filter_date, $person_id)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_badges')]],
                        ['match' => ['persona_id' => $person_id]],
                        [
                            "range" => [
                                "dateadded" => [
                                    "gte" => "$filter_date"
                                ],
                            ],
                        ],
                    ]
                ],
            ],
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of getNewMembers() ......//


    /**
     * @param $request
     * @param $indexName
     * @return array
     * Get Members List.
     */
    public static function autoSuggestData($request, $indexName)
    {
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]]
                ]
            ]
        ];
        $query = [
            'size' => 10,
            'query' => $search_query,
            'sort' => [
                "{$request->sorting}" => ['order' => $request->sortingOrder]
            ]
        ];
        if ($request->has('serchName') && $request->serchName) {
            if (is_numeric($request->serchName)) {
                $max_user_id_len = strlen(User::orderBy('client_customer_id', 'desc')->first()->client_customer_id);
                //if (strlen($request->serchName) > $max_user_id_len) {
                array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                    ['wildcard' => ['client_customer_id' => '*' . ($request->serchName . '*')]],
                    ['wildcard' => ['persona_id' => '*' . ($request->serchName . '*')]],
                    ['wildcard' => ['devices.mobile' => '*' . $request->serchName . '*']]
                ]
                ]]);
//                } else {
//                    array_push($query['query']['bool']['must'], ['bool' => ['should' => [
//                        ['wildcard' => ['client_customer_id' => '*' . ($request->serchName . '*')]],
//                        ['wildcard' => ['persona_id' => '*' . ($request->serchName . '*')]],
//                        ['wildcard' => ['devices.mobile' => '*' . $request->serchName . '*']]
//                    ]
//                    ]]);
//
//                }
            } else {
                $nameSearch = explode(' ', $request->serchName);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_fname.normalize' => '*' . ($nameSearch[0] . '*')]]);
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_lname.normalize' => '*' . ($nameSearch[1] . '*')]]);
                } else {
                    array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                        ['wildcard' => ['persona_fname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['persona_lname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['emails.personal_emails.normalize' => '*' . ($request->serchName . '*')]]
                    ]
                    ]]);
                }
                //..... end of inner if-else() .....//

            }
            //..... end of if-else() .....//
        }//..... end of outer-if() .....//

        // ElasticsearchUtility::log(print_r($query, true));
        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of autoSuggestData() .....//

    /**
     * @param $index
     * @param $query
     * @return array
     * Search data in Elasticsearch.
     */
    public static function search($index, $query)
    {
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of search() .....//

    /**
     * @param $index
     * @param $query
     * @return array
     */
    public static function getSource($index, $query)
    {
        try {

            $query = ['index' => $index, 'body' => $query];

            return array_map(function ($record) {
                return array_merge($record['_source'], ['_id' => $record['_id']]);
            }, ((new self())->client->search($query))['hits']['hits']);
        } catch (\Exception $e) {
            Log::channel('user')->info('check', ['getSource' => $e->getMessage()]);
            return [];
        }
    }//..... end of getSource() .....//



    /**
     * @param $index
     * @param $query
     * @return int
     */
    public static function count($index, $query)
    {
        $query = ['index' => $index, 'body' => $query];
        try {
            return (new self())->client->count($query)['count'];
        } catch (\Exception $e) {
            return 0;
        }//..... end of try() .....//
    }//..... end of count() .....//

    /**
     * @param $query
     * @param $index
     * @return array
     * Get MemberList with customized fields.
     */
    public static function getAllCustomMembersList($query, $index)
    {
        $membersList = [];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
            "scroll" => "50s"
        ]);

        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $membersList = array_merge($membersList, array_map(function ($record) {
                return ['Member Number' => $record['_source']['membership_id'], 'First Name' => $record['_source']['persona_fname'], 'Last Name' => $record['_source']['persona_lname'],
                    'Rating Grade' => $record['_source']['rating_grade_name'] ?? '', 'Member Type' => $record['_source']['membership_type_name'] ?? '', 'Status' => $record['_source']['status'] ?? ''];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }//..... end while() .....//

        return $membersList;
    }//..... end of getAllCustomerMembersList() .....//

    public static function getAllCustomMembersListNew($query, $index)
    {
        $membersList = [];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
            "scroll" => "50s"
        ]);

        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $membersList = array_merge($membersList, array_map(function ($record) {
                return [
                    'MemberId' => $record['_source']['membership_id'],
                    'First Name' => $record['_source']['persona_fname'] ?? "",
                    'Last Name' => $record['_source']['persona_lname'] ?? "",
                    'Email' => $record['_source']['persona_email'] ?? "",
                    'Mobile' => $record['_source']['phone_numbers']['mobile'] ?? '',
                    'Postal code' => $record['_source']['residential_address']['postal_code'] ?? "",
                    'Address' => $record['_source']['residential_address']['residential_address_1'] ?? "",
                    'Lat' => $record['_source']['user_location']['lat'] ?? "",
                    'Lang' => $record['_source']['user_location']['lon'] ?? "",
                    'State' => $record['_source']['residential_address']['state'] ?? "",
                    'Country' => $record['_source']['residential_address']['country'] ?? "",

                ];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }//..... end while() .....//

        return $membersList;
    }//..... end of getAllCustomerMembersList() .....//

    public static function getMemberCampaignLogs($index)
    {
        $query['query']['bool']['must'] = [['term' => ['custom_doc_type' => config('constant.campaign_logs')]]];

        $campaignList = [];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
            "scroll" => "50s"
        ]);

        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $campaignList = array_merge($campaignList, array_map(function ($record) {
                return [

                    'camp_id' => $record['_source']['camp_id'],
                    'member_id' => $record['_source']['member_id'],
                    'is_sent' => $record['_source']['is_send']

                ];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }//..... end while() .....//

        return $campaignList;
    }//..... end of getAllCustomerMembersList() .....//

    /**
     * @param $index
     * @param $person_id
     * @param int $size
     * @return array
     * Get member sale details.
     */
    public static function memberSaleDetails($index, $person_id, $size = 0)
    {
        $query = [
            'size' => $size,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.sale')]],
                        ['match' => ['persona_id' => $person_id]]
                    ]
                ]
            ],
            'aggs' => [
                'total_spend' => ['sum' => ['field' => 'sale_total']],
                'avg_basket_size' => ['avg' => ['field' => 'sale_total']],
                'last_sale_date' => ['max' => ['field' => 'sale_datetime']]
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of memberSaleDetails() ......//

    /**
     * @param $index
     * @param $person_id
     * @return array
     * @description : get member details
     */
    public static function memberDetails($index, $person_id)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        ['match' => ['persona_id' => $person_id]]
                    ]
                ]
            ],
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of memberSaleDetails() ......//

    public static function allMemberStats($index, $filter_date)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.sale')]],
                        [
                            "range" => [
                                "sale_datetime" => [
                                    "gte" => "$filter_date"
                                ]
                            ]
                        ],
                    ]
                ]
            ],
            'aggs' => [
                'total_spend' => ['sum' => ['field' => 'sale_total']],
                'avg_basket_size' => ['avg' => ['field' => 'sale_total']],
                'last_sale_date' => ['max' => ['field' => 'sale_datetime']]
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of allMemberStats() ......//

    /**
     * @param $index
     * @param int $size
     * @return array
     * return all members count
     */
    public static function countMembers($index)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ]
                ]
            ],
            'aggs' => [
                "types_count" => [
                    "value_count" => [
                        "field" => "membership_id"
                    ]
                ],
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of countMembers() ......//

    /**
     * @param $index
     * @param int $size
     * @return array
     * return all members count datewise
     */
    public static function countDateWiseTotalMembers($index, $filter_date, $request)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]]
                ]
            ]
        ];

        /*date filter check*/
        $range = [];
        if ($filter_date) {
            $range[]['range']['date_added']['gte'] = $filter_date;
            $search_query['bool']['must'][] = $range[0];
        } else {

            $start_date = $request->start_date . ' 00:00:00';
            $end_date = $request->end_date . ' 23:59:59';

            $range[]['range']['date_added']['gte'] = $start_date;
            $range[]['range']['date_added']['lte'] = $end_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'query' => $search_query,
            'aggs' => [
                "types_count" => [
                    "value_count" => [
                        "field" => "membership_id"
                    ]
                ],
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of countMembers() ......//

//    wasim
    /**
     * @param $index
     * @param int $size
     * @return array
     * return all members count
     */
    public static function countGenders($index, $filter_date = null, $request, $gender)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ['match' => ['gender' => $gender]]
                ]
            ]
        ];

        /*date filter check*/
        $range = [];
        if ($filter_date) {
            $range[]['range']['date_added']['gte'] = $filter_date;
            $search_query['bool']['must'][] = $range[0];
        } else {

            $start_date = $request->start_date . ' 00:00:00';
            $end_date = $request->end_date . ' 23:59:59';

            $range[]['range']['date_added']['gte'] = $start_date;
            $range[]['range']['date_added']['lte'] = $end_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'query' => $search_query,
            'aggs' => [
                "types_count" => [
                    "value_count" => [
                        "field" => "membership_id"
                    ]
                ],
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of countMembers() ......//

    /**
     * @param $index
     * @param int $size
     * @return array
     * return all members count
     */
    public static function countUnknownGenders($index, $filter_date = null, $request)
    {
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ['bool' => [
                        'must_not' => ['exists' => ['field' => 'gender']],
                    ]
                    ]
                ]
            ]
        ];

        /*date filter check*/
        $range = [];
        if ($filter_date) {
            $range[]['range']['date_added']['gte'] = $filter_date;
            $search_query['bool']['must'][] = $range[0];
        } else {

            $start_date = $request->start_date . ' 00:00:00';
            $end_date = $request->end_date . ' 23:59:59';

            $range[]['range']['date_added']['gte'] = $start_date;
            $range[]['range']['date_added']['lte'] = $end_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
        }

        $query = [
            'query' => $search_query,
            'aggs' => [
                "types_count" => [
                    "value_count" => [
                        "field" => "membership_id"
                    ]
                ],
            ]
        ];

        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of countMembers() ......//

    /**
     * @param $index
     * @param int $size
     * @param $current_date
     * @return array
     */
    public static function getNewMembers($index, $filter_date)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],

                        [
                            "range" => [
                                "creation_datetime" => [
                                    "gte" => "$filter_date"
                                ],
                            ],
                        ],
                    ]
                ],
            ],
        ];

        return (new self())->client->count(['index' => $index, 'body' => $query]);
    }//..... end of getNewMembers() ......//

    /**
     * @param $index
     * @param $person_id
     * @return array
     * @description : get member details
     */
    public static function getMember($index, $person_id)
    {
        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        ['match' => ['persona_id' => $person_id]]
                    ]
                ]
            ]
        ];
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of memberSaleDetails() ......//

    public static function maleStats($request, $indexName = null, $gender, $filter)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $rangeData = $request->rangeData;
        $finalResult = [];

        if ($filter) {
            $filter_query = ['match' => ['gender' => $gender]];
            $filter_search = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        $filter_query,
                    ]
                ]
            ];
        } else {
            $filter_search = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],

                    ]
                ]
            ];
        }

        $male = [];

        foreach ($rangeData as $rangeDatum) {
            $search_query = [];
            $search_query = $filter_search;

            $seperate_date = explode("-", $rangeDatum);

            $first_arg = $seperate_date[0];
            $last_arg = $seperate_date[1];

            $from_date = Carbon::now()->subYears($last_arg)->toDateString();
            $to_date = Carbon::now()->subYears($first_arg)->toDateString();
            $range = [];
            $range[]['range']['date_of_birth']['gte'] = $from_date;
            $range[]['range']['date_of_birth']['lte'] = $to_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
            $query = [
                'query' => $search_query,
                'aggs' => [
                    'total_males' => ['value_count' => ['field' => '_id']],
                ]
            ];
            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);


            $finalResult[] = $myData['aggregations']['total_males']['value'];
        }

        return $finalResult;
    }//..... end of genderStats() .....//


    public static function ageCalc($rangeDatum, $indexName = null, $gender, $filter)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }
        $finalResult = [];

        if ($filter) {
            $filter_query = ['match' => ['gender' => $gender]];
            $filter_search = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        $filter_query,
                    ]
                ]
            ];
        } else {
            $filter_search = [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],

                    ]
                ]
            ];
        }


        $search_query = [];
        $search_query = $filter_search;

        $seperate_date = explode("-", $rangeDatum);

        $first_arg = $seperate_date[0];
        $last_arg = $seperate_date[1];

        $from_date = Carbon::now()->subYears($last_arg)->toDateString();
        $to_date = Carbon::now()->subYears($first_arg)->toDateString();
        $range = [];
        $range[]['range']['date_of_birth']['gte'] = $from_date;
        $range[]['range']['date_of_birth']['lte'] = $to_date;
        $search_query['bool']['must'][] = $range[0];
        $search_query['bool']['must'][] = $range[1];
        $query = [
            'query' => $search_query,
            'aggs' => [
                'total_males' => ['value_count' => ['field' => '_id']],
            ]
        ];
        $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);
        return $myData['aggregations']['total_males']['value'];


//        return $finalResult;
    }//..... end of genderStats() .....//

    public static function unknownStats($request, $indexName)
    {
        $rangeData = $request->rangeData;
        $finalResult = [];

        $filter_search = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]],
                    ['bool' => [
                        'must_not' => ['exists' => ['field' => 'gender']],
                    ]
                    ]
                ]
            ]
        ];


        foreach ($rangeData as $rangeDatum) {
            $search_query = [];
            $search_query = $filter_search;

            $seperate_date = explode("-", $rangeDatum);

            $first_arg = $seperate_date[0];
            $last_arg = $seperate_date[1];

            $from_date = Carbon::now()->subYears($last_arg)->toDateString();
            $to_date = Carbon::now()->subYears($first_arg)->toDateString();

            $range = [];
            $range[]['range']['date_of_birth']['gte'] = $from_date;
            $range[]['range']['date_of_birth']['lte'] = $to_date;
            $search_query['bool']['must'][] = $range[0];
            $search_query['bool']['must'][] = $range[1];
            $query = [
                'query' => $search_query,
                'aggs' => [
                    'total_males' => ['value_count' => ['field' => '_id']],
                ]
            ];
            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);
            $finalResult[] = $myData['aggregations']['total_males']['value'];
        }

        return $finalResult;
    }//..... end of genderStats() .....//

    public static function campaignGraphsData($indexName = null, $dates)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $finalResult = [];

        $filter_search = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]],
                    ['match' => ['is_send' => 1]],
                    ['match' => ['persona_id' => request()->persona_id]]

                ]
            ]
        ];
        foreach ($dates as $date) {
            $search_query = $filter_search;
            $range = [
                'range' => [
                    'date_added' => [
                        'gte' => $date,
                        'lte' => $date,
                        'format' => 'yyyy-M-dd'
                    ]
                ]
            ];

            $search_query['bool']['must'][] = $range;
            $query = [
                'query' => $search_query,
                'aggs' => [
                    'sent_campaign_count' => ['value_count' => ['field' => '_id']],
                ]
            ];
            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);
            $finalResult[] = $myData['aggregations']['sent_campaign_count']['value'];
        }
        return $finalResult;
    }//..... end of genderStats() .....//

    public static function yearCampaignGraphsData($indexName = null, $dates)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $finalResult = [];

        $filter_search = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.campaign_logs')]],
                    ['match' => ['is_send' => 1]],
                    ['match' => ['persona_id' => request()->persona_id]]

                ]
            ]
        ];
        foreach ($dates as $key => $value) {
            $search_query = $filter_search;
            $range = [
                'range' => [
                    'date_added' => [
                        'gte' => $value['start_date'],
                        'lte' => $value['end_date'],
                        'format' => 'yyyy-M-dd'
                    ]
                ]
            ];

            $search_query['bool']['must'][] = $range;
            $query = [
                'query' => $search_query,
                'aggs' => [
                    'sent_campaign_count' => ['value_count' => ['field' => '_id']],
                ]
            ];
            $myData = (new self())->client->search(['index' => $indexName, 'body' => $query]);
            $finalResult[] = $myData['aggregations']['sent_campaign_count']['value'];
        }
        return $finalResult;
    }//..... end of genderStats() .....//

    function generateDateRange(Carbon $start_date, Carbon $end_date)
    {
        $dates = [];

        for ($date = $start_date->copy(); $date->lte($end_date); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }

        return $dates;
    }


    /**
     * @param $index
     * @param $query
     * @return array
     */
    public static function updateByQuery($indexName = null, $query)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }
        $respsone = (new self())->client->updateByQuery(['index' => $indexName, 'conflicts' => 'proceed', 'body' => $query]);
        return ['status' => true];
    }//..... end of updateByQuery() .....//


    /**
     * @param $index
     * @param $query
     * @param $id
     * @return array
     * Update record by id.
     */
    public static function update($indexName = null, $query, $id)
    {

        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        return (new self())->client->update(['index' => $indexName, 'id' => $id, 'body' => $query]);
    }//..... end of update() .....//

    /**
     * @param $index
     * @param $body
     * @return array|bool
     * Index a document.
     */
    public static function insert($indexName = null, $body, $id = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        try {

            $params = [
                'index' => $indexName,
                'body' => (array)$body
            ];
            if ($id) {
                $params['id'] = $id;
            }

            return (new self())->client->index($params);
        } catch (\Exception $e) {
            Log::channel('user')->info('insert() For ES' . $e->getMessage());
        }
    }//..... end of insert() ......//

    /**
     * @param array $params
     * @return array
     * params: pair array of index arrays and data arrays.
     */
    public static function bulkInsert(Array $params)
    {
        return (new self())->client->index($params);
    }//..... end of bulkInsert() ......//

    /**
     * @param $index
     * @param $id
     * @return array
     * Delete a record by id.
     */
    public static function deleteById($indexName = null, $id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $params = [
            'index' => $indexName,
            'id' => $id
        ];

        return (new self())->client->delete($params);
    }//..... end of deleteById() .....//


    /**
     * @param $index
     * @param $field_name
     * @param $field_value
     * @return bool
     */

    public static function deleteByQuery($indexName = null, $field_name, $field_value, $query = '')
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        try {
            $data = [];
            if (empty($query)) {
                $data = [
                    "query" => [
                        "match" => [
                            $field_name => $field_value
                        ]
                    ]
                ];
            } else {
                $data = [
                    'query' =>
                        $query

                ];
            }
            Log::channel('custom')->info('Delete query', ['Delete query' => $data]);
            $endpoint = Config::get('constant.ES_URL') . '/' . $indexName . '/_delete_by_query';
            $ch = curl_init($endpoint);
            $payload = json_encode($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $result = json_decode(curl_exec($ch));
            curl_close($ch);
            Log::channel('custom')->info('DELETEBYQUERY()', ['DELETEBYQUERY()' => $result]);
            return $result->deleted >= 0 ? true : false;
        } catch (\Exception $e) {
            Log::channel('custom')->error('Error while Delte', ['ErrorDelete' => $e->getMessage()]);
            return false;
        }
    }//..... end of deleteByQuery() .....//

    /**
     * @param $index
     * @param $data
     * @param $id
     * @return array
     * Add/Update data in ElasticSearch.
     */
    public static function upsert($indexName = null, $data, $id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        try {
            $params = [
                'query' => [
                    'bool' => [
                        'must' => [
                            [
                                'term' => [
                                    '_id' => [
                                        'value' => $id
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];


            $exist = (new self())->count($indexName, $params);
            if ($exist) {

                $exist = (new self())->search($indexName, $params);
                return (new self())->update($indexName, ['doc' => $data], $exist['hits']['hits'][0]['_id']);
                //return (new self())->update($indexName, ['doc' => $data], $id);
            } else {
                return (new self())->insert($indexName, $data, $id);
            }
        } catch (\Exception $e) {
            Log::channel('custom')->info('upsert exception', ['data' => $e->getMessage()]);
        }

    }
    //..... end of upsert() .....//

    /**
     * @param $index
     * @param $stamp_card_id
     * @return array
     */
    public static function stampCardDetail($indexName = null, $stamp_card_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $query = [
            'size' => 1,
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.punch_card')]],
                        ['match' => ['_id' => $stamp_card_id]]
                    ]
                ]
            ]
        ];

        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of stampCardDetail() .....//

    public static function getVoucherPunchCard($indexName = null, $date, $startDate)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_voucher')]],
                        ['exists' => ['field' => 'from_punch_card']],
                        ['range' => ['dateadded' => ['gte' => $startDate, 'lte' => $date]]],
                    ]
                ]
            ]

        ];

        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);

        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {

            array_push($data, $response['hits']['hits']);

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function getVoucherStateDateWise($indexName = null, int $dateTime, $startDate)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_voucher')]],
                        ['range' => ['dateadded' => ['gte' => $startDate, 'lte' => $dateTime]]],
                    ]
                ]

            ]

        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            array_push($data, $response['hits']['hits']);

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function getVoucherStateWise($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $data = [];
        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_voucher')]]
                    ]
                ]

            ]

        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);

        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return ['voucher_code' => $record['_source']['voucher_code'], 'voucher_date' => date("F j, Y", $record['_source']['voucher_sdate']), 'no_of_uses' => $record['_source']['no_of_uses'], 'uses_remaining' => $record['_source']['uses_remaining'], 'redeemed_vouchers' => ($record['_source']['no_of_uses'] - $record['_source']['uses_remaining'])
                    , 'promotion_text' => $record['_source']['promotion_text'], 'persona_id' => $record['_source']['persona_id']
                ];
            }, $response['hits']['hits']));


            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }

        return $data;
    }


    public static function getVoucherPunchCardData($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $doc_types = ["redeemed_voucher", "assigned_stamp", "completed_punch"];
        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['terms' => ['custom_doc_type' => $doc_types]],
                    ]
                ]
            ],
            'sort' => [
                'date_added' => ['order' => 'desc']
            ]

        ];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record;
            }, $response['hits']['hits']));
            //array_push($data,$response['hits']['hits']);
            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function getName($indexName = null, $query)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        return (new self())->client->search(['index' => $indexName, 'body' => $query]);
    }//..... end of memberSaleDetails() ......//


    public static function search_report_data($indexName = null, $startDate, $doc_type)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $query = [
            "size" => 1,
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => $doc_type
                            ]
                        ], [
                            "range" => [
                                "date_added" => [
                                    "gte" => $startDate,
                                    "lte" => $startDate,
                                    "format" => "yyyy-MM-dd"
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            "aggs" => [
                "my_total" => ["sum" => ["script" => [
                    "source" => "doc['number'].value"
                ]]]
            ]
        ];
        $data = (new self())->client->search(['index' => $indexName, 'body' => $query]);
        if (isset($data["hits"]["hits"]) && count($data["hits"]["hits"]) > 0) {
            return $data["aggregations"]["my_total"]["value"];
        } else {
            return 0;
        }
    }//..... end of search() .....//

    public static function getUserPromotions($indexName = null, $campaign_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => "redeemed_voucher"]],
                        ['terms' => ['campaign_id' => $campaign_id]],
                        ['term' => ['venue_id' => request()->venue_id]]
                    ]
                ]
            ]

        ];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));
            //array_push($data,$response['hits']['hits']);
            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }


    public static function avaliableVouchers($indexName = null, $condition, $campaign_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
                        ['range' => ['voucher_end_date' => $condition]],
                        ['terms' => ['campaign_id' => $campaign_id]],
                        ['term' => ['venue_id' => request()->venue_id]]
                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function completedPunchCard($indexName = null, $punchcard_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => "completed_punch"]],
                        ["wildcard" => ["id" => ["value" => "*$punchcard_id*"]]]]
                ]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function completedPunchCardMultipal($indexName = null, $punchcard_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => "completed_punch"]],
                        ['term' => ['venue_id' => request()->venue_id]],
                        ["query_string" => ["query" => $punchcard_id,
                            "fields" => [
                                "id"
                            ]
                        ]]]
                ]
            ]
        ];

        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }


    public static function getVoucherStatusPerDay($indexName = null, $startDate, $endDate, $campaign_id)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_voucher')]],
                        ['range' => ['voucher_end_date' => ['gte' => $startDate, 'lte' => $endDate]]],
                        ['terms' => ['campaign_id' => $campaign_id]],
                        ['term' => ['venue_id' => request()->venue_id]]
                    ]
                ]

            ]

        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }


    public static function dateOfBirthQuery($indexName = null, $query)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]],
                        ['range' => ['date_of_birth' => $query]],
                    ]
                ]

            ]

        ];

        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);


        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function birthDayByDateAndMonthScript($indexName = null, $month, $day)
    {

        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => "demographic"
                            ]
                        ],
                        [
                            "script" => [
                                "script" => "doc['date_of_birth'].value.monthValue == $month && doc['date_of_birth'].value.dayOfMonth == $day"
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function birthDayByDateAndMonth($indexName = null, $query)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => "demographic"
                            ]
                        ],
                        ['range' => ['date_of_birth' => $query]],

                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    /*public static function birthDayByDateAndMonth($index,$month,$day){

        $search_query = [
            "query" => [
                "bool"=> [
                    "must"=> [
                        [
                            "term"=> [
                                "custom_doc_type"=> "demographic"
                            ]
                        ],
                        [
                            "script"=> [
                                "script"=> "doc.date_of_birth.date.monthOfYear == $month && doc.date_of_birth.date.dayOfMonth == $day"
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $response =(new self())->client->search([
            'size' => 100,
            'index' => $index,
            'body' => $search_query,
            "scroll"=> "50s"
        ]);
        $data=[];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0)
        {
            $data = array_merge($data, array_map(function($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }*/

    public static function campaignTriggers($indexName = null, $campaign_id, $size)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            "size" => $size,

            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "terms" => [
                                "camp_id" => [
                                    $campaign_id
                                ]
                            ]
                        ],
                        [
                            "term" => [
                                "custom_doc_type" => "campaign_logs"
                            ]
                        ],
                        ['term' => ['venue_id' => request()->venue_id]]
                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([
            'size' => $size,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                return $record['_source']['persona_id'];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;

    }//..... end of function   .....//

    public static function esTest($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.demographic')]]

                    ]
                ]

            ]

        ];
        $response = (new self())->client->search([
            'size' => 100,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);

    }

    public static function getCampaignVoucher($indexName = null)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $search_query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_voucher')]]

                    ]
                ]

            ]

        ];
        $response = (new self())->client->search([
            'size' => 10000,
            'index' => $indexName,
            'body' => $search_query,
            "scroll" => "50s"
        ]);

        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, array_map(function ($record) {
                //dd(["member_id"=>$record['_source']]);
                return [
                    "member_id" => $record['_source']['persona_id'],
                    "campaign_id" => $record['_source']['campaign_id'],
                    "is_sent" => 1,
                    "redeemed" => ($record['_source']['no_of_uses'] - $record['_source']['uses_remaining'] > 0) ? "1" : "0",
                    "Voucher" => $record['_source']['voucher_code'],
                    "Sent Date" => date("d-m-Y H:i:s", $record['_source']['dateadded'])
                ];
            }, $response['hits']['hits']));

            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        return $data;
    }

    public static function getVoucherDetails($indexName = null, $stamp_card_id, $request)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $query = [
            'query' => [
                'bool' => [
                    'must' => [
                        ['match' => ['custom_doc_type' => config('constant.user_integrated_voucher')]],
                        ['terms' => ['_id' => $stamp_card_id]],
                        ['range' => ['uses_remaining' => ['gt' => 0]]],
                        ['match' => ['is_reserved' => 0]]
                    ]
                ]
            ]
        ];


        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $indexName,
            'body' => $query,
            "scroll" => "50s"
        ]);
        $voucherId = [];
        $voucherGreaterThanone = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $voucherId = array_merge($voucherId, array_map(function ($record) {
                if ($record['_source']['uses_remaining'] == 1)
                    return $record['_id'];


            }, $response['hits']['hits']));

            $voucherGreaterThanone = array_merge($voucherGreaterThanone, array_map(function ($record) {
                if ($record['_source']['uses_remaining'] > 1)
                    return $record['_id'];


            }, $response['hits']['hits']));
            //array_push($data,$response['hits']['hits']);
            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }
        if (count($voucherId) == count($stamp_card_id) || count($voucherGreaterThanone) == count($stamp_card_id)) {
            if ($voucherId) {
                foreach ($voucherId as $value) {
                    Log::channel('custom')->info('Inserted ids', ['inserid', $value]);
                    UserLoyaltyPoints::create([
                        'user_id' => $request->user_id,
                        'voucher_id' => $value,
                        'device_token' => $request->customer_token_id,
                        'type' => 'vouchers',
                        'status' => 1
                    ]);
                }
                Log::channel('custom')->info('VoucherIDs Before Lockes', ['vocherIDs', $voucherId]);
                (new self())->lockUnlockVoucher($indexName, $voucherId, 1);

            }
            return ['status' => true];
        } else {
            return ['status' => false, 'message' => 'Voucher is already in use'];
        }


    }//..... end of stampCardDetail() .....//

    //----- in case of reserved $key =1, in case of unreserved $key=0  ......//
    public static function lockUnlockVoucher($indexName = null, $voucherID, $key)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        Log::channel('custom')->info('Update Data For Vouchers', ['vocherID', $voucherID]);
        $query = [
            "script" => [
                "inline" => "ctx._source.is_reserved = $key"
            ],
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => "user_integrated_voucher"
                            ]
                        ],
                        [
                            "terms" => [
                                "_id" => $voucherID
                            ]
                        ]
                    ]
                ]
            ]
        ];
        return (new self())->updateByQuery($indexName, $query);
    }

    public static function userReservedData($indexName = null, $voucherID, $key)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        Log::channel('custom')->info('Update Data For Vouchers', ['vocherID', $voucherID]);
        $query = [
            "script" => [
                "inline" => "ctx._source.is_reserved = $key"
            ],
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "term" => [
                                "custom_doc_type" => "user_integrated_voucher"
                            ]
                        ],
                        [
                            "match" => [
                                "persona_id" => $voucherID
                            ]
                        ]
                    ]
                ]
            ]
        ];
        return (new self())->updateByQuery($indexName, $query);
    }

    public function bulkExistingUsersData($users, $indexName = null)
    {
        $this->registerAllUserTOES($users);
    }//--- End of bulkInsertData() ---//

    public function registerAllUserTOES($users)
    {
        $indexName = ElasticsearchUtility::generateIndexName();

        foreach ($users as $user) {
            $userData = [
                'persona_email' => $user->email,
                'persona_id' => $user->user_id,
                'soldi_id' => $user->soldi_id,
                'membership_id' => $user->user_id,
                'persona_fname' => $user->user_first_name,
                'persona_lname' => $user->user_family_name,
                'creation_datetime' => date('Y-m-d H:i:s', strtotime($user->created_at)),
                'date_added' => date('Y-m-d H:i:s'),
                'phone_numbers' => ['mobile' => $user->user_mobile],
                'emails' => ['personal_emails' => $user->email],
                'custom_doc_type' => config('constant.demographic'),
            ];

            $id = $user->user_id;// . "_" . config('constant.demographic');
            $subscribedVenues = (new ElasticSearchController())->getUserSubscribedVenues($user->user_id);
            $venues = \App\Models\Venue::where('company_id', $user->company_id)->get(['id', 'venue_id']);
            foreach ($venues as $venue) :
                $userData['venue_id'] = $venue->venue_id;

                if (!in_array($venue->venue_id, $subscribedVenues)):
                    $userData['is_pointme_user'] = true;
                    $userData['email_subscribed_flag'] = true;
                    $userData['sms_subscribed_flag'] = true;
                    $userData['is_pointme_notifications'] = true;
                    $userData['mail_subscribed_flag'] = true;
                    $userData['is_merchant'] = 0;
                endif;

                if ($this->upsert($indexName, $userData, $id))
                    if (!in_array($venue->venue_id, $subscribedVenues))
                        $subscribedVenues[] = $venue->venue_id;

            endforeach;//..... end foreach() .....//


            echo 'inserting';
        }
    }//..... end of registerUserToElasticSearch() .....//

    public function bulkUserDataInsertNew($users)
    {


        try {
            $params = [
                'index' => ElasticsearchUtility::generateIndexName()
            ];

            foreach ($users as $user) {



                //===== user custom fields  ======//
                $customFields = UserCustomFieldData::where(["user_id"=>$user->user_id])
                    ->leftJoin("user_custom_field","user_custom_field.id","=","user_custom_field_data.custom_field_id")
                    ->get(["user_custom_field_data.*","user_custom_field.field_type","user_custom_field.field_name","user_custom_field.is_multi_select"]);
                $listCustomFields = [];

                foreach ($customFields as $key => $value){
                    if($value->field_type == "bollean"){
                        $listCustomFields[$value->field_name] = $value->value == 1 ? true: false;
                    }else if($value->field_type == "dropdown"){
                        $listCustomFields[$value->field_name] = json_decode($value->value);
                    }else{
                        $listCustomFields[$value->field_name] = $value->value;
                    }


                }




                /*$custom_fields = json_decode($user->custom_fields,true);
                if(empty($custom_fields))
                    $custom_fields = [];
                else
                    $custom_fields = [$custom_fields];*/

                $params['body'][] = [
                    'index' => [
                        '_id' => $user->user_id,
                    ]
                ];

                $params['body'][] = [
                    'membership_id' => $user->user_id,
                    'creation_datetime' => date('Y-m-d H:i:s', strtotime($user->created_at)),
                    'date_added' => date('Y-m-d H:i:s'),
                    'custom_doc_type' => config('constant.demographic'),
                    'status' => (isset($user->is_active) && $user->is_active) ? 'active' : 'inactive',
                    'last_login' => date('Y-m-d H:i:s'),
                    'data_source' => 'Soldi Engage',
                    'gender' => $user->gender ?? "",
                    'persona_id' => $user->user_id ?? 0,
                    'is_pointme_user' => true,
                    'email_subscribed_flag' => true,
                    'sms_subscribed_flag' => true,
                    'is_pointme_notifications' => true,
                    'mail_subscribed_flag' => true,
                    'residential_address' => ['postal_code' => $user->postal_code ?? 0, 'residential_address_1' => $user->address ?? '', 'residential_address_2' => $user->address2 ?? '', 'state' => $user->state ?? '', 'country' => $user->country ?? '',"suburb"=>$user->city],
                    'persona_fname' => $user->user_first_name ?? '',
                    'persona_lname' => $user->user_family_name ?? '',
                    'devices' => ['mobile' => $user->user_mobile ?? ''],
                    'emails' => ['personal_emails' => $user->email ?? ''],
                    'activity' => $user->activity ?? 'Active',
                    'user_location' => ['lat' => $user->lat ?? 0, 'lon' => $user->lang ?? 0],
                    'date_of_birth' => isset($user->dob) ? $user->dob : null,
                    'old_user' => (isset($user->old_user) && $user->old_user == 0) ? false : true,
                    'postal_code' => $user->postal_code??"",
                    'company_id' => $user->company_id ?? "",
                    'region_type' => $user->region_type ?? "",
                    'client_customer_id' => $user->client_customer_id ?? "",
                    'groups' => json_decode($user->groups) ?? "",
                    'custom_fields' => $listCustomFields ??"",
                    'user_forms'    => (new ElasticSearchController())->getUserFormData($user->user_id)??[],
                    'business_name' => $user->store_name

                ];
                /*dd(
                    ['company_id' => $user->company_id ?? "",
                        'region_type' => $user->region_type ?? "",
                        'client_customer_id' => $user->client_customer_id ?? "",
                        'groups' => json_decode($user->groups) ?? "",
                        'custom_fields' => $listCustomFields ??"",
                        'user_forms'    => (new ElasticSearchController())->getUserFormData($user->user_id)??[]

                    ]
                );*/


            }
            $response = (new self())->client->bulk($params);
            return ['status' => true];
        } catch (\Exception $e) {
            Log::channel('custom')->info('RDS TO ES', ['Error' => $e->getMessage()]);
            return ['status' => false,"message"=>$e->getMessage()];
        }
    }

    public function generateData($user)
    {
        $userData = (object)$user;


        $finalData = [
            'membership_id' => $userData->user_id,
            'creation_datetime' => date('Y-m-d H:i:s', strtotime($userData->created_at)),
            'date_added' => date('Y-m-d H:i:s'),
            'custom_doc_type' => config('constant.demographic'),
            'status' => ($userData->is_active) ? 'active' : 'inactive',
            'is_pointme_user' => true,
            'email_subscribed_flag' => true,
            'sms_subscribed_flag' => true,
            'is_pointme_notifications' => true,
            'mail_subscribed_flag' => true,
            'is_merchant' => 0,
            'last_login' => date('Y-m-d H:i:s'),
            'data_source' => 'Soldi Engage',

        ];
        if ($userData->postal_code)
            $finalData['residential_address']['postal_code'] = $userData->postal_code;

        if ($userData->address)
            $finalData['residential_address']['residential_address_1'] = $userData->address?? "";
        if ($userData->address2)
            $finalData['residential_address']['residential_address_2'] = $userData->address2 ?? "";

        if ($userData->lat)
            $finalData['user_location'] = ['lat' => $userData->lat, 'lang' => $userData->lang];

        if ($userData->state)
            $finalData['residential_address']['state'] = $userData->state;
        if ($userData->city)
            $finalData['residential_address']['city'] = $userData->city ?? "";

        if ($userData->country)
            $finalData['residential_address']['country'] = $userData->country;

        if ($userData->activity)
            $finalData['activity'] = $userData->activity;

        return $finalData;
    }

    public static function upsertToken($indexName = null, $data, $id, $params)
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $exist = (new self())->count($indexName, $params);
        if ($exist) {
            $exist = (new self())->search($indexName, $params);
            return (new self())->update($indexName, ['doc' => $data], $exist['hits']['hits'][0]['_id']);
        } else {
            return (new self())->insert($indexName, $data, $id);
        }

    }

    /**
     * @param $param
     * @return array
     */
    public function bulkCustomizeInsert($param)
    {
        try {
            $response = (new self())->client->bulk($param);
            if (isset($response['errors'])) {
                Log::channel('custom')->info('Error Occured in adding elasticsearch', ['Error' => $response]);
            }

            return ['status' => true];
        } catch (\Exception $e) {
            Log::channel('custom')->info('cheeeeeeeeeeeeee', ['Error' => $e->getMessage()]);
        }
    }//----- End of bulkCustomizeInsert() ------//

    public function getStampCardData($userID = null)
    {
        $query = ["query" => ["bool" => ["must" => [["terms" => ["custom_doc_type" => [Config::get('constant.punch_card')]]], ["match" => ["persona_id" => $userID]]]]]];
        return (new self())->count(ElasticsearchUtility::generateIndexName(), $query);
    }

    public static function log($data)
    {
        $filename = "/tmp/ElasticsearchUtility.log";
        if (!$handle = fopen($filename, 'a')) {
            echo "Cannot open file ($filename)";
            return;
        }
        if (fwrite($handle, $data) === FALSE) {
            echo "Cannot write to file ($filename)";
        }
        fclose($handle);
        return;
    }

    public static function bulkUserDataUpdateVoucher($campaignId, $data)
    {
        try {
            $params = [
                'index' => config('constant.ES_INDEX_BASENAME')
            ];

            foreach ($campaignId as $campaign) {
                if ($campaign['uses_remaining'] > 0) {
                    $params['body'][] = [
                        'index' => [
                            '_id' => $campaign['_id'],
                        ]
                    ];

                    $data['persona_id'] = $campaign['user_id'];
                    $data['user_id'] = $campaign['user_id'];
                    $data['voucher_code'] = $campaign['voucher_code'];
                    $params['body'][] = $data;
                }
            }
            Log::channel('custom')->info('bulkUserDataUpdateVoucher', ['bulkUserDataUpdateVoucher' => $params]);

            $response = (new self())->client->bulk($params);
            Log::channel('custom')->info('bulkUserDataUpdateVoucher', ['bulkUserDataUpdateVoucher' => $response]);
            return ['status' => true];
        } catch (\Exception $e) {
            Log::channel('custom')->info('RDS TO ES', ['Error' => $e->getMessage()]);
            return ['status' => true];
        }
    }

    public static function searchVoucherData($index, $query)
    {
        return (new self())->client->search(['index' => $index, 'body' => $query]);
    }//..... end of memberSaleDetails() ......//

    /**
     * @param $query
     * @param $index
     * @return array
     * Get MemberList with customized fields.
     */
    public function getAllData($query, $index)
    {
        $membersList = [];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => $index,
            'body' => $query,
            "scroll" => "50s"
        ]);

        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $membersList = array_merge($membersList, array_map(function ($record) {
                return array_merge($record['_source'], ['_id' => $record['_id']]);

            }, $response['hits']['hits']));


            $response = (new self())->client->scroll([
                    "scroll_id" => $response['_scroll_id'],
                    "scroll" => "30s"
                ]
            );
        }//..... end while() .....//

        return $membersList;
    }//..... end of getAllCustomerMembersList() .....//

    public static function bulkUserRedeemVoucher($data)
    {
        try {
            $params = [
                'index' => config('constant.ES_INDEX_BASENAME')
            ];

            foreach ($data as $campaign) {
                $params['body'][] = [
                    'index' => [
                        '_id' => $campaign['persona_id'] . '' . $campaign['campaign_id'] . '' . rand(234234234234, 234234234234234),
                    ]
                ];
                $params['body'][] = $campaign;

            }
            Log::channel('custom')->info('bulkUserDataUpdateVoucher', ['bulkUserDataUpdateVoucher' => $params]);

            $response = (new self())->client->bulk($params);
            Log::channel('custom')->info('bulkUserDataUpdateVoucher', ['bulkUserDataUpdateVoucher' => $response]);
            return ['status' => true, 'data' => 'insert'];
        } catch (\Exception $e) {
            Log::channel('custom')->info('RDS TO ES', ['Error' => $e->getMessage()]);
            return ['status' => true];
        }
    }

    public static function getFilteredVoucher($indexName = null, $perPage = '', $offset = '', $search_query = '', $search = '', $sorting = '', $sortOrder = '')
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $query = [
            'from' => $offset,
            'size' => $perPage,
            'query' => $search_query,
            'sort' => [
                "assigned_last_date" => ['order' => 'desc']
            ]
        ];


        if (!empty($search)) {
            return ['status' => true, 'data' => (new self())->client->search(['index' => $indexName, 'body' => $query])['hits']['hits'], 'count' => (new self())->count(ElasticsearchUtility::generateIndexName(), ["query" => $search_query]), 'stamps' => PunchCard::where('company_id', request()->company_id)->get()];
        } else {
            return ['status' => true, 'data' => (new self())->client->search(['index' => $indexName, 'body' => $query])['hits']['hits'], 'count' => (new self())->count(ElasticsearchUtility::generateIndexName(), ["query" => $search_query]), 'stamps' => PunchCard::where('company_id', request()->company_id)->get()];
        }

    }

    public static function getPetronDetail($request, $indexName)
    {
        $request = (object)$request;
        $search_query = [
            'bool' => [
                'must' => [
                    ['match' => ['custom_doc_type' => config('constant.demographic')]]
                ]
            ]
        ];

        $query = [
            'query' => $search_query,

        ];

        if ($request->serchName) {
            if (is_numeric($request->serchName)) {
                $max_user_id_len = strlen(User::orderBy('user_id', 'desc')->first()->user_id);

                array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                    ['wildcard' => ['client_customer_id' => '*' . ($request->serchName . '*')]],
                    ['wildcard' => ['persona_id' => '*' . ($request->serchName . '*')]],
                ]
                ]]);

            } else {
                $nameSearch = explode(' ', $request->serchName);
                if (is_array($nameSearch) && isset($nameSearch[0]) && isset($nameSearch[1]) && count($nameSearch) >= 2) {
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_fname.normalize' => '*' . ($nameSearch[0] . '*')]]);
                    array_push($query['query']['bool']['must'], ['wildcard' => ['persona_lname.normalize' => '*' . ($nameSearch[1] . '*')]]);
                } else {
                    array_push($query['query']['bool']['must'], ['bool' => ['should' => [
                        ['wildcard' => ['persona_fname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['persona_lname.normalize' => '*' . ($request->serchName . '*')]],
                        ['wildcard' => ['emails.personal_emails.normalize' => '*' . ($request->serchName . '*')]]
                    ]
                    ]]);
                }
                //..... end of inner if-else() .....//

            }
            //..... end of if-else() .....//
        }//..... end of outer-if() .....//

        $response = (new self())->client->search(['index' => $indexName, 'body' => $query]);
        $personaData = [];
        if (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $personaData = array_merge($personaData, array_map(function ($record) {
                return ["label" => $record['_source']['persona_fname'] . ' ' . $record['_source']['persona_lname'], 'id' => $record['_source']['persona_id']];
            }, $response['hits']['hits']));
        }
        return $personaData;

    }//..... end of patronData() .....//

    public static function searchAfter($queryies)
    {

        $search_query = [
            'bool' => [
                'must' => $queryies
            ]
        ];

        $query = [
            'query' => $search_query,
            'sort' => [
                "date_added" => ['order' => "desc"],
                "_id" => ['order' => "desc"]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 1000,
            'index' => config('constant.ES_INDEX_BASENAME'),
            'body' => $query,

        ]);
        $data = [];
        while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {
            $data = array_merge($data, $response['hits']['hits']);
            //find last document
            $hits_size = count($response['hits']['hits']);
            $query = [
                'query' => $search_query,
                'search_after' => [$response['hits']['hits'][$hits_size - 1]['sort'][0], (string)$response['hits']['hits'][$hits_size - 1]['sort'][1]],
                'sort' => [
                    "date_added" => ['order' => "desc"],
                    "_id" => ['order' => "desc"]
                ]
            ];

            $response = (new self())->client->search([
                'size' => 1000,
                'index' => config('constant.ES_INDEX_BASENAME'),
                'body' => $query,
            ]);
//            Log::channel('custom')->info('check', ['qweqwe' => count($data)]);
        }
        return $data;
    }

    public function aggregateVoucherStamp()
    {
        $query = ["size" => 0,
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "terms" => [
                                "custom_doc_type" => [
                                    "user_integrated_voucher",
                                    "punch_card",
                                    "redeemed_voucher"
                                ]
                            ]
                        ]
                    ]
                ]
            ], "aggs" => [
                "voucher_assign" => [
                    "date_histogram" => [
                        "field" => "voucher_start_date",
                        "interval" => "day",
                        "format" => "dd-MM-yyyy"
                    ],   "aggs" => [
                        "records" => [
                            "terms" => [
                                "field" => "voucher_code"
                            ]

                        ]

                    ]
                ],
                "stamp_assign" => [
                    "date_histogram" => [
                        "field" => "punch_card_rule.created_at",
                        "interval" => "day",
                        "format" => "dd-MM-yyyy"
                    ]
                ],

            ]
        ];
        $response = (new self())->client->search([

            'index' => config('constant.ES_INDEX_BASENAME'),
            'body' => $query,

        ]);
        return $response;
    }
    public static function aggregateRedeemVoucherStamp()
    {
        $query = ["size" => 0,
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "terms" => [
                                "custom_doc_type" => [
                                    "redeemed_voucher"
                                ]
                            ]
                        ]
                    ]
                ]
            ], "aggs" => [
                "redeem_voucher" => [
                    "date_histogram" => [
                        "field" => "redeemed_datetime",
                        "interval" => "day",
                        "format" => "dd-MM-yyyy"
                    ],   "aggs" => [

                        "records" => [
                            "terms" => [
                                "field" => "voucher_code"
                            ]

                        ]

                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([

            'index' => config('constant.ES_INDEX_BASENAME'),
            'body' => $query,

        ]);
        return $response;
    }

    public function stampConverted()
    {
        $query = ["size" => 0,
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "terms" => [
                                "custom_doc_type" => [
                                    "assigned_stamp",
                                ]
                            ]
                        ]
                    ]
                ]
            ], "aggs" => [
                "stamp_converted" => [
                    "date_histogram" => [
                        "field" => "date_added",
                        "interval" => "day",
                        "format" => "dd-MM-yyyy"
                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([

            'index' => config('constant.ES_INDEX_BASENAME'),
            'body' => $query,

        ]);
        return $response;

    }


    public function bulkCsvUserInsert($users)
    {
        try {
            $params = [
                'index' => ElasticsearchUtility::generateIndexName()
            ];

            foreach ($users as $user) {
                $custom_fields = json_decode($user->custom_fields,true);
                if(empty($custom_fields))
                    $custom_fields = [];
                else
                    $custom_fields = [$custom_fields];

                $params['body'][] = [
                    'index' => [
                        '_id' => $user->user_id,
                    ]
                ];

                $params['body'][] = [
                    'membership_id' => $user->user_id,
                    'creation_datetime' => date('Y-m-d H:i:s'),
                    'date_added' => date('Y-m-d H:i:s'),
                    'custom_doc_type' => config('constant.demographic'),
                    'status' => ($user->is_active) ? 'active' : 'inactive',
                    'last_login' => date('Y-m-d H:i:s'),
                    'data_source' => 'Soldi Engage',
                    'persona_id' => $user->user_id,
                    'is_pointme_user' => true,
                    'email_subscribed_flag' => true,
                    'sms_subscribed_flag' => true,
                    'is_pointme_notifications' => true,
                    'mail_subscribed_flag' => true,
                    'residential_address' => ['postal_code' => $user->postal_code ?? 0, 'residential_address_1' => $user->address ?? '', 'state' => $user->state ?? '', 'country' => $user->country ?? ''],
                    'persona_fname' => $user->user_first_name ?? '',
                    'persona_lname' => $user->user_family_name ?? '',
                    'devices' => ['mobile' => $user->user_mobile ?? ''],
                    'emails' => ['personal_emails' => $user->email ?? ''],
                    'activity' => $user->activity ?? 'Active',
                    'user_location' => ['lat' => $user->lat ?? 0, 'lon' => $user->lang ?? 0],
                    'date_of_birth' => $user->dob ? $user->dob : null,
                    'postal_code' => $user->postal_code ?? "",
                    'company_id' => $user->company_id ?? 1,
                    'region_type' => $user->region_type ?? "",
                    'client_customer_id' => $user->client_customer_id ?? "",
                    'gender' => (strtolower($user->gender) == "male") ? "M" : ((strtolower($user->gender) == "female") ? "F" : "O"),
                    'custom_fields' => $custom_fields,


                ];
            }
            $response = (new self())->client->bulk($params);
            return ['status' => true];
        } catch (\Exception $e) {
            Log::channel('custom')->info('RDS TO ES', ['Error' => $e->getMessage()]);
            return ['status' => false];
        }
    }

    public static function searchMembershipType($value)
    {


        //return ['wildcard' => ['membership_type.normalize' => '*' . ($value["status"] . '*')]];
        $query = [
            "query"=> [
                "bool"=> [
                    "should"=> [
                        [
                            "wildcard"=> [
                                "persona_fname.normalize"=> [
                                    "value"=> "*$value*"
                                ]
                            ]
                        ],
                        [
                            "wildcard"=> [
                                "devices.mobile"=> [
                                    "value"=> "*$value*"
                                ]
                            ]
                        ],
                        [
                            "wildcard"=> [
                                "persona_id"=> [
                                    "value"=> "*$value*"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([
            'size' => 10,
            'index' => Config::get('constant.ES_INDEX_BASENAME'),
            'body' => $query,
        ]);


        $personaData = [];
        if(isset($response['hits']['hits']) && count($response['hits']['hits']) > 0){
            $personaData = array_merge($personaData, array_map(function($record) {
                $returnvalue = $record['_source']['persona_fname'];
                if(request()->searchBy == "emails")
                    $returnvalue = $record['_source']['emails']['personal_emails'];
                if(request()->searchBy == "phone")
                    $returnvalue = $record['_source']['persona_fname']." ".$record['_source']['persona_lname']." (".$record['_source']['emails']['personal_emails'].")"." :".$record['_source']['devices']['mobile']."";
                if(request()->searchBy == "app")

                    $returnvalue = $record['_source']['persona_fname']." ".$record['_source']['persona_lname']." (".$record['_source']['emails']['personal_emails'].")"." :".$record['_source']['membership_id']."";


                return ["label"=>$returnvalue,"membership_id"=>$record['_source']['membership_id']];
            }, $response['hits']['hits']));
        }

        return $personaData;

    }

    public static function redeemedVouchersCount($dates)
    {
        $start_date = $dates[0];
        $end_date = $dates[count($dates )-1];
        $filterBy = (request()->filterby == "week" || request()->filterby == "month" || request()->filterby == "day" || request()->filterby == "") ? "day":"month";
        $formate = "dd-MM-yyyy";


        if($filterBy == "month"){
            $start_date = (date("Y")-1)."-".date("m-d");
            $end_date = date("Y-m-d");
        }

        if(request()->filterby == "day" || (count($dates) == 1 && request()->filterby =="")){
            $formate = "HH:mm";
            $filterBy = "hour";
        }




        $query = ["size" => 0,
            "query" => [
                "bool" => [
                    "must" => [
                        [
                            "terms" => [
                                "custom_doc_type" => [
                                    "redeemed_voucher"
                                ]
                            ]
                        ],
                        [
                            'range' => [
                                'redeemed_datetime' => [
                                    'gte' => $start_date,
                                    'lte' => $end_date,
                                    "format" => "yyyy-MM-dd"
                                ]
                            ]
                        ]
                    ]
                ]
            ], "aggs" => [
                "redeem_voucher" => [
                    "date_histogram" => [
                        "field" => "redeemed_datetime",
                        "interval" => $filterBy,
                        "format" => $formate
                    ],   "aggs" => [

                        "records" => [
                            "terms" => [
                                "field" => "voucher_code"
                            ]

                        ]

                    ]
                ]
            ]
        ];
        $response = (new self())->client->search([

            'index' => config('constant.ES_INDEX_BASENAME'),
            'body' => $query,

        ]);
        return $response;
    }


    public static function memberCountCharts($dates)
    {

        $start_date = $dates[0];
        $end_date = $dates[count($dates )-1];
        $filterBy = (request()->filterby == "week" || request()->filterby == "month" || request()->filterby == "day" || request()->filterby == "") ? "day":"month";
        $formate = "dd-MM-yyyy";


        if($filterBy == "month"){
            $start_date = (date("Y")-1)."-".date("m-d");
            $end_date = date("Y-m-d");
        }

        if(request()->filterby == "day" || (count($dates) == 1 && request()->filterby =="")){
            $formate = "HH:mm a";
            $filterBy = "hour";
        }



        $search_query = [
            'bool' => [
                'must' => [
                    ["terms" => ["custom_doc_type" => [Config::get('constant.demographic')]]],
                    ['range' => ['date_added' => ['gte' => $start_date, 'lte' => $end_date, "format" => "yyyy-MM-dd"]]]
                ]
            ]
        ];

        /*        $range = [];
                $start_date = ($filter_date) ? strtotime($filter_date) : strtotime($start_date);
                $end_date = ($filter_date) ? time() : strtotime($end_date);
                // +11 hours from start date and +11 to end date
                $range[]['range']['dateadded']['gte'] = (!$filter_date) ? $start_date + 39600 : $start_date;
                $range[]['range']['dateadded']['lte'] = $end_date + 39600;

                $search_query['bool']['must'][] = $range[0];
                $search_query['bool']['must'][] = $range[1];*/

        $aggs = [
            'total_members_aggs' =>
                ['filter' => ['range' =>
                    ['persona_id' => ['gt' => 0]
                    ]
                ],
                    'aggs' => ['members_count' => ['value_count' => ['field' => '_id']]]
                ]


            , 'active_member_aggs' =>
                ['filter' => ['term' =>
                    ['status' => 'active']],
                    'aggs' => ['active_count' => ['value_count' => ['field' => '_id']]]
                ]

            , 'inactive_member_aggs' =>
                ['filter' => ['term' =>
                    ['status' => 'inactive']],
                    'aggs' => ['inactive_count' => ['value_count' => ['field' => '_id']]]
                ],
            "member_add" => [
                "date_histogram" => [
                    "field" => "date_added",
                    "interval" => $filterBy,
                    "format" => $formate
                ],   "aggs" => [

                    "records" => [
                        "terms" => [
                            "field" => "voucher_code"
                        ]

                    ]

                ]
            ]
        ];
        $query = [
            'size' => 0,
            'query' => $search_query,
            'aggs' => $aggs,
            'sort' => [
                "dateadded" => ['order' => "DESC"]
            ]
        ];
        return (new self())->client->search(['index' => config('constant.ES_INDEX_BASENAME'), 'body' => $query]);
    }//..... end of memberCountCharts() .....//


    public static function getPaginatedata($indexName = null, $perPage = '', $offset = '', $search_query = '', $search = '', $sorting = '', $sortOrder = '')
    {
        if (empty($indexName)) {
            $indexName = ElasticsearchUtility::generateIndexName();
        }

        $query = [
            'from' => $offset,
            'size' => $perPage,
            'query' => $search_query,
        ];


        return (new self())->client->search(['index' => $indexName, 'body' => $query])['hits']['hits'];
    }


}//..... end of class.
