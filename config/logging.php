<?php

use Monolog\Handler\StreamHandler;

if (is_dir(env('LOG_PATH'))) {
    $log_path = env('LOG_PATH');
}
else {
    $log_path = storage_path('logs');
}

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, Laravel uses the Monolog PHP logging library. This gives
    | you a variety of powerful log handlers / formatters to utilize.
    |
    | Available Drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog",
    |                    "custom", "stack"
    |
    */

    'channels' => [
        'stack' => [
            'driver' => 'stack',
            'channels' => ['daily'],
        ],

        'custom' => [
            'driver' => 'daily',
            'path' => $log_path . '/custom.log',
            'level' => env('LOG_LEVEL_CUSTOM') != '' ? env('LOG_LEVEL_CUSTOM') : env("LOG_LEVEL"),
            'days' => 30,
        ],
        'sql' => [
            'driver' => 'daily',
            'path' => $log_path . '/sql.log',
            'level' => env('LOG_LEVEL_SQL') != '' ? env('LOG_LEVEL_SQL') : env("LOG_LEVEL"),
            'days' => 30,
        ],
        'proximity' => [
            'driver' => 'daily',
            'path' => $log_path . '/proximity.log',
            'level' => env('LOG_LEVEL_PROXIMITY') != '' ? env('LOG_LEVEL_PROXIMITY') : env("LOG_LEVEL"),
            'days' => 1,
        ],


        'daily' => [
            'driver' => 'daily',
            'path' => $log_path . '/laravel.log',
            'level' => env('LOG_LEVEL_DAILY') != '' ? env('LOG_LEVEL_DAILY') : env("LOG_LEVEL"),
            'days' => 30,
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => 'Laravel Log',
            'emoji' => ':boom:',
            'level' => 'critical',
        ],

        'stderr' => [
            'driver' => 'monolog',
            'handler' => StreamHandler::class,
            'with' => [
                'stream' => 'php://stderr',
            ],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_LEVEL_SYSLOG') != '' ? env('LOG_LEVEL_SYSLOG') : env("LOG_LEVEL"),
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_LEVEL_ERRORLOG') != '' ? env('LOG_LEVEL_ERRORLOG') : env("LOG_LEVEL"),
        ],
        'user' => [
            'driver' => 'daily',
            'path' => $log_path . '/user.log',
            'level' => env('LOG_LEVEL_USER') != '' ? env('LOG_LEVEL_USER') : env("LOG_LEVEL"),
            'days' => 30,
        ],

        'payment' => [
            'driver' => 'daily',
            'path' => $log_path . '/payment.log',
            'level' => env('LOG_LEVEL_PAYMENT') != '' ? env('LOG_LEVEL_PAYMENT') : env("LOG_LEVEL"),
            'days' => 30,
        ],

            'gameLog' => [
            'driver' => 'daily',
            'path' => $log_path . '/gameLog.log',
            'level' => env('LOG_LEVEL_PAYMENT') != '' ? env('LOG_LEVEL_PAYMENT') : env("LOG_LEVEL"),
            'days' => 30,
        ],
    ],

];
