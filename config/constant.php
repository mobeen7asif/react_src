<?php
return [
    //---------- APP SETTINGS ----------//
    'APP_ENV'                   => env('APP_ENV'),
    'APP_NAME'                  => env('APP_NAME'),
    'APP_SMS_NAME'              => env('APP_SMS_NAME'),

    'IS_EWAY_PAYMENT_ENABLED'   => true,
    'REFER_FRIEND_TITLE'        => 'Refer Friend',
    'REFER_FRIEND_BODY'         => 'Your Friend successfully Signup to GBK App.',
    'Colors'                    => (new \App\Utility\Utility())->getColors(),

    // ES doctype
    'demographic'               => 'demographic',
    'sale'                      => 'sale',
    'punch_card'                => 'punch_card',
    'campaign_logs'             => 'campaign_logs',
    'persona_devices'           => 'persona_devices',
    'user_voucher'              => 'user_voucher',
    'user_badges'               => 'user_badges',
    'venue'                     => 'venue',
    'game_logs'                 => 'game_logs',
    'mission_logs'              => 'mission_logs',
    'user_integrated_voucher'   => 'user_integrated_voucher',
    'redeemed_voucher'          => 'redeemed_voucher',
    'completed_punch'          => 'completed_punch',
    'isLogging'                 => true,

     //---------------------  Elasticsearch Configurations -----------------------//
    'ES_URL'                    => env('ES_URL'),
    'ES_INDEX_BASENAME'         => env('ES_INDEX_BASENAME'),

    //---------------------------- KILLBILL Configurations -----------------------//
    'KILL_BILL_URL'             => env('KILL_BILL_URL'),

    //---------- KILLBILL UK Credentials ----------//
    "KILL_BILL_APIKEY"          => env('KILL_BILL_APIKEY'),
    "KILL_BILL_SECRET"          =>  env('KILL_BILL_SECRET'),
    "KILL_BILL_USER_NAME"       => env('KILL_BILL_USER_NAME'),
    "KILL_BILL_PASSWORD"        => env('KILL_BILL_PASSWORD'),

    //-------- KILLBILL IRELAND Credentials --------//

    "KILL_BILL_IRE_APIKEY"      => env('KILL_BILL_IRE_APIKEY'),
    "KILL_BILL_IRE_SECRET"      => env('KILL_BILL_IRE_SECRET'),
    "KILL_BILL_IRE_USER_NAME"   => env('KILL_BILL_IRE_USER_NAME'),
    "KILL_BILL_IRE_PASSWORD"    => env('KILL_BILL_IRE_PASSWORD'),

    //------------------- Soldi POS Configurations ----------------------//
    'SOLDI_DEFAULT_PATH'        => env('SOLDI_DEFAULT_PATH'),

    //---------- SOLDI POS IRELAND APIKEY AND SECRET ---------------//
    "SOLDI_IRE_APIKEY"          => env('SOLDI_IRE_APIKEY'),
    "SOLDI_IRE_SECRET"          => env('SOLDI_IRE_SECRET'),

    //--------- SOLDI POS UK APIKEY AND SECRET ---------------------//
    "SOLDI_API_KEY"             => env('SOLDI_API_KEY'),
    "SOLDI_SECRET"              => env('SOLDI_SECRET'),

    //knox variables
    'Knox_X_API_KEY'            => env('Knox_X_API_KEY'),
    'Knox_Authorization'            => env('Knox_Authorization'),
    'Knox_Secret'               => env('Knox_Secret'),
    'Knox_Url'                  => env('Knox_Url'),

    //-------------------  JAVA URL --------------------//
    'JAVA_URL'                  => env('JAVA_URL'),
    'JAVA_CAMPAIGN_TEST_URL'    => env('JAVA_CAMPAIGN_TEST_URL'),
    'JAVA_ACTIVEMQ_URL'         => env('JAVA_ACTIVEMQ_URL'),

    //---------- COMPANY IDS ----------//
    'COMPANY_ID'                => env('COMPANY_ID'),
    'COMPANY_IRE_ID'            => env('COMPANY_IRE_ID'),

    // ------------------- Code for IBS -----------------------------------//
    'IBS_VERIFICATION'          => env('IBS_VERIFICATION'),
    'LOG_PATH'                  => env('LOG_PATH'),

    'URL_FACEBOOK'                        => env('URL_FACEBOOK'),
    'URL_FACEBOOK_IRELAND'                    =>  env('URL_FACEBOOK_IRELAND'),
    'URL_INSTAGRAM'                     =>  env('URL_INSTAGRAM'),
    'URL_INSTAGRAM_IRELAND'                 =>  env('URL_INSTAGRAM_IRELAND'),

    'EMAIL_FEEDBACK'             => env('EMAIL_FEEDBACK'),
    'EMAIL_FEEDBACK_IRELAND'            =>  env('EMAIL_FEEDBACK_IRELAND'),
    'SYSTEM_USERID'              => '7943843',
    "GIFTCARD_ENABLED"          => env('GIFTCARD_ENABLED')

];
