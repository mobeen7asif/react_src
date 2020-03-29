<?php
return [
    'company_id'                => 405,
    'IS_EWAY_PAYMENT_ENABLED'   => true,
    'REFER_FRIEND_TITLE'        => 'Refer Friend',
    'REFER_FRIEND_BODY'         => 'Your Friend successfully Signup to GBK App.',
    'CertificateID'             => '{b7a2e227-c1ed-412d-ba43-0009da088ed9}',
    'ApplicationID'             => '{6f27ec9c-99ed-4401-9dd0-5b759bf30c85}',
    'TWILIOID'                  => env('TWILIO_ID'),
    'TWILIOAPI'                 => env('TWILIO_API'),
    'TWILLIONUMBER'             => env('TWLLIO_NUMBER'),
    'SES-REGION'                => env('TWILIO_SES_REGION'),
    'Colors'                    => (new \App\Utility\Utility())->getColors(),

    //es doctype
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
    'Knox_Secret'               => env('Knox_Secret'),
    'Knox_Url'                  => env('Knox_Url'),

    //-------------------  JAVA URL --------------------//
    'JAVA_URL'                  => env('JAVA_URL'),
    'JAVA_CAMPAIGN_TEST_URL'    => env('JAVA_CAMPAIGN_TEST_URL'),
    'JAVA_ACTIVEMQ_URL'         => env('JAVA_ACTIVEMQ_URL'),

    //---------- COMPANY IDS ----------//
    'COMPANY_ID'                  => env('COMPANY_ID'),
    'COMPANY_IRE_ID'    => env('COMPANY_IRE_ID'),
    'APP_ENV' => env('APP_ENV'),

    //---------- MAIL VARS ----------//
    'mail_from_address'                  => env('mail_from_address')

];



