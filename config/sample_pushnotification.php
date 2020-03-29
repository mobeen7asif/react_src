<?php

return [
    'gcm' => [
        'priority' => 'normal',
        'dry_run' => false,
        'apiKey' => env('GCM_API_KEY'),
    ],
    'fcm' => [
        'priority' => 'normal',
        'dry_run' => false,
        'apiKey' => env('FCM_API_KEY'),
    ],
    'apn' => [
        'certificate' => __DIR__ . '/iosCertificates/ISPTDist.pem',
        'passPhrase' => '1234', //Optional
        'passFile' => __DIR__ . '/iosCertificates/yourKey.pem', //Optional
        'dry_run' => false
    ]
];