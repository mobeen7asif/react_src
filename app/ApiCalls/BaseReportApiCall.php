<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace App\ApiCalls; 
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request;
use App\Facade\SuperPortalLog;

class BaseReportApiCall
{

    /*sonar constants*/
    const HEADERS                = 'headers';
    
    public function __construct() {
        ini_set("set_max_exec_time", 90000000);
    }
    
    public function get($url,$header=[])
    {
        try{
        $client = new Client();
        $res = $client->request('GET', $url, [
                'headers' => $header,
            ]);
        
        return $res->getBody()->getContents();
        } catch (\Exception $e)
        {
            SuperPortalLog::info("Dashboard api calls exception ".$e->getMessage().", hitting end point ".$url);
            return false;
        }
    }
    
    public function getMulti($requestData)
    {
        $requests = [];
        $client = new Client();
        
        foreach ($requestData as $reqData):
            $requests[] = new Request('GET',$reqData['url'],$reqData['header']);
        endforeach;
        
       $responses = Pool::batch($client, $requests, ['concurrency' => 60]);
       $response = [];
      foreach ($responses as $res) {
       $response[] =  $res->getBody()->getContents();
        }
       
        return $response;
    }
    
    
    public function post($url,$header,$data)
    {
        try {
            $client = new Client();
            $res = $client->request('POST', $url, [
                self::HEADERS => $header,
                'form_params' => $data,
            ]);
            return $res->getBody()->getContents();
        }catch (\Exception $e){
            SuperPortalLog::info("Dashboard api calls exception ".$e->getMessage().", hitting end point ".$url);
            return false;
        }
    }
    
     public function rawPost($url,$header,$data,$resType=0) //0 means get response inner content else complete response
    {
        try{
       
            $client = new Client();
            $res = $client->post($url, [
                self::HEADERS => $header,
                    'json' => $data,
            ]);
          
         if($resType==0):
             return $res->getBody()->getContents();
         else:
             return $res;
         endif;    
        } catch (\Exception $e)
        {
            return false;
        }
    }
}
?>