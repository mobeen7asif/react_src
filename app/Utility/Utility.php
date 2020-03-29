<?php

namespace App\Utility;
/**
 * Created by PhpStorm.
 * User: Muhammad Waqas
 * Date: 7/18/2017
 * Time: 2:49 PM
 */
class Utility
{

    /**
     * introducing the array when parameter large.
     * Return Kafka Wrapper.
     */
    public function getKafkaWrapper($source, $type, $url, $data)
    {

        $wrapper =  [
            "id" => uniqid(),
            "metaData"=> [
                'source' => $source,
                "type"   => $type,
                "URL"    => $url,
            ],
            "body" => [
                'value' => $data
            ]
        ];
        return json_encode($wrapper);
    }//..... end of getKafkaWrapper() ......//

    /**
     * It return Transaction wrapper to forward it to watchTower.
     */
    public function getTransactionWrapper($source, $type, $url, $data)
    {
        $wrapper =  [
            "id" => uniqid(),
            "metaData"=> [
                'source' => $source,
                "type"   => $type,
                "url"    => $url,
                "date"   => strtotime(date("Y-m-d H:i:s"))
            ],
            "body" => [
                'value' => $data
            ]
        ];
        return json_encode($wrapper);
    }//..... end of getTransactionWrapper() .....//

    public function getColors()
    {
        return [
            0 => "d47421",
            1 => "4c6d06",
            2 => "330ca1",
            3 => "4af18c",
            4 => "4bf586",
            5 => "8bb9b6",
            6 => "75d3cf",
            7 => "c7b4b0",
            8 => "46712b",
            9 => "b8adad",
            10 => "20575b",
            11 => "fea78e",
            12 => "25cc7d",
            13 => "819fe1",
            14 => "416e5c",
            15 => "65937c",
            16 => "0b9bd7",
            17 => "b35ab1",
            18 => "0455dc",
            19 => "e3b331",
            20 => "c99bdb",
            21 => "5ab7ad",
            22 => "710f8a",
            23 => "421c2a",
            24 => "2c8f4e",
            25 => "f7477d",
            26 => "b98727",
            27 => "9c2de4",
            28 => "bb8f93",
            29 => "771307",
            30 => "b7d83f",
            31 => "392576",
            32 => "70d1a5",
            33 => "f0baeb",
            34 => "5d1f19",
            35 => "1c094a",
            36 => "fd0edd",
            37 => "3d86df",
            38 => "5519c8",
            39 => "0e4b37",
            40 => "999d48",
            41 => "a4e3f1",
            42 => "c3227d",
            43 => "740261",
            44 => "4caae2",
            45 => "110861",
            46 => "580c3b",
            47 => "3658bc",
            48 => "153c7a",
            49 => "5c94af",
        ];
    }//..... end of getColors() .....//
}