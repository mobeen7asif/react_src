<?php
/**
 * Created by PhpStorm.
 * User: Rafay
 * Date: 12/21/2017
 * Time: 2:57 PM
 */

namespace App\Utility;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request;

class CurlGuzzle
{

    public function __construct()
    {
        //
    }


    /**
     * Get API Call through Guzzle HTTP Library.
     */
    public function get($url, $header = [], $resource = false)
    {
        $res = (new Client())->request('GET', $url,['headers'=> $header]);

        return $resource ? $res : $res->getBody()->getContents();
    }//.... end of get() .....//

    /**
     * @param array $requestData
     * @return array
     * Multi Api Call Handler.
     */
    public function getMulti($requestData = [])
    {
        ini_set('memory_limit', '255M');
        $requests = [];
        $client = new Client();

        foreach ($requestData as $reqData):
            if( isset($reqData['header']) )
                $requests[] = new Request('GET',$reqData['url'],$reqData['header']);
            else
                $requests[] = new Request('GET',$reqData['url']);
        endforeach;

        $responses = Pool::batch($client, $requests, ['concurrency' => 60]);
        $response = [];
        foreach ($responses as $res) {
            if(method_exists($res, 'getBody'))
                $response[] = $res->getBody()->getContents();
        }

        return $response;
    }//..... end of getMulti() .....//

    /**
     * @param $url
     * @param $header
     * @param $body
     * @return mixed|\Psr\Http\Message\ResponseInterface
     */
    public function post($url, $header, $body)
    {
        $ch     = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 50);
        if(!empty($body)){
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }

        if (!empty($header)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }

        $response = curl_exec($ch);
        if (curl_error($ch)) {
            trigger_error('Curl Error:' . curl_error($ch));
        }

        curl_close($ch);
        return $response;
    }//..... end of post() .....//

    /**
     * @param $url
     * @param $header
     * @param $body
     * @return string
     * Perform Post Request through guzzleHttp client.
     */
    public function postJsonThroughGuzzle($url, $header, $body, $resource = false)
    {
        $client = new Client();
        $res = $client->post($url, [
            'headers' => $header,
            'json' => $body,
        ]);

        if($resource)
            return $res;
        else
            return $res->getBody()->getContents();
    }//..... end of postJsonThroughGuzzle() .......//

    /**
     * @param $url
     * @param $header
     * @param $body
     * @param bool $allResponse
     * @return array|mixed
     * Perform Post Request through Curl
     */
    public function curlThroughPost( $url , $header, $body ,$allResponse = false)
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HTTPHEADER => $header,
        ));

        $res = curl_exec($curl);
        $response = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $err = curl_error($curl);

        curl_close($curl);

        if($allResponse)
            return ['statusCode'=> $response, "message" => $res, 'error'=> $err];
        else
            return $response;
    }//..... end of curlThroughPost() ......//
}