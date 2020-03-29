<?php

namespace App\Utility;
use GuzzleHttp\Client;

class PushNotificationCustom
{
    /**
     *
     * @var user
     * @var FCMToken
     */
    protected $user;
    protected $fcmToken;
    /**
     * Constructor
     *
     * @param
     */
    public function __construct()
    {
     /*   $this->user = $user;
        $this->fcmToken = $fcmToken;*/
    }
    /**
     * Functionality to send notification.
     *
     */
    public function sendNotification()
    {
        $url = "https://fcm.googleapis.com/fcm/send";
        $serverKey ='AAAAqzeE2ls:APA91bGhoCtrhHvyxZ7j6ifepAILUA-Q9CEFEYs3zmKk7Odd4RsPNu6SyQDgr01xEjTJM5BgxD8wWCeODkSRqsiE0LVccIMlpuHJecFbEj4plP641G5kwFrNjKwkHiocX5NHy_8QIIcE';
        $title = "Push Notification";
        $body = "This is Testing Push Notifications.";
        $notification = array('title' =>$title , 'text' => $body, 'sound' => 'default', 'badge' =>'1');

        $arrayToSend = array('registration_ids' => ['dop8d_Gtq0M:APA91bG9z0WbNZXvkACO3DMjMZo5F_pjjcgHfhKUxD3-omQf0s4kD0LpXYxLGzVaS9HDtWGYj5_Gg2OeWofkDzkVJ3Bnf8cc8RqKHZI8WwvnczJ8jZjYyXl3yqcATZm2q6HgQGozUeUX'], 'notification'=>$notification,'priority'=>'high');
        $response = (new Client([
            'headers' => [
                'Content-Type' => 'application/json',
                "Authorization" => 'key='. $serverKey
            ]
        ]))->request('POST', $url, [
            'json' => $arrayToSend
        ])->getBody()->getContents();
        return $response;
    }

}