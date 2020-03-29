<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;

class Sms extends Model
{
    protected $url;

    public function __construct()
    {
        parent::__construct();

        $notification_engine_url = Config::get('constant.JAVA_URL');
        #$notification_engine_url = config('constant.JAVA_URL');

        if (filter_var($notification_engine_url, FILTER_VALIDATE_URL) === FALSE) {
            throw new Exception('Unable to determine Notification Engine URL (JAVA_URL missing)');
        }

        $this->url = rtrim($notification_engine_url, '/') . '/sendSMS';
    }

    public function send($phoneNumber, $message, $route = null)
    {
        try {
            if (empty($route)) {
                $route = 'default';
            }

            Log::channel('custom')->info('sendSms()', [
                'phoneNumber' => $phoneNumber,
                'message' => $message,
                'route' => $route
            ]);

            $http = new \GuzzleHttp\Client();
            $response = $http->post($this->url, [
                'headers' => array(),
                'json' => [
                    'mobile' => $phoneNumber,
                    "route" => $route,
                    'message_txt' => $message,
                ]
            ]);

            $smsResponse = json_decode($response->getBody(), true);

            Log::channel('custom')->info('SMS Response', [
                'smsStatus' => $smsResponse['status'],
                'smsMessage' => $smsResponse['message'],
            ]);

            if ($smsResponse['status']) {
                return true;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
