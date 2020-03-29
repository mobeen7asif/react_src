<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 7/10/2018
 * Time: 12:58 PM
 */

Route::middleware('auth:api')->group(function() {

    Route::POST('app/status',           'AmplifyApiController@checkAppStatus');
    Route::get('beacon',                'RestController@getAllBeacons');

    Route::POST('venues',               'RestController@getAllVenue');
    Route::POST('venues/stores',        'RestController@getAllVenuesStores');
    Route::POST('user/venues',          'RestController@userVenues');

    Route::POST('card/add',             'StoresApiController@addCard');
    Route::POST('card/update',          'StoresApiController@updateCard');
    Route::POST('card',                 'StoresApiController@cardList');
    Route::POST('card/delete',          'PaymentController@deleteCard');
    Route::POST('venue/points',         'StoresApiController@getUserPoints');
    Route::POST('user/tier',            'StoresApiController@userTier');
    Route::POST('orders/receipt',       'StoresApiController@orderReceipt');
    Route::POST('customer/orders',      'StoresApiController@customerOrders');
    Route::POST('product-search',       'StoresApiController@searchProduct');
    Route::post('product-sku',          'StoresApiController@getSkuProduct');

    Route::POST('user/change_password', 'UserApiController@changePassword');
    Route::POST('user/profile',         'UserApiController@updateProfile');
    Route::any('user-logout',          'UserApiController@userLogout');
    Route::POST('user-badges',          'UserVouchersController@userBadgeListing');



    //Route::post('auto-check-out',       'UserApiController@autoCheckoutCart');
    Route::POST('beacon-auto-payment',  'UserApiController@beaconTriggerData');

    Route::POST('user/loyaltyProgress', 'StoresApiController@getAllUserPoints');
	Route::get('beacon/{id}',          'RestController@getVenueBeaconsData');

    Route::POST('multibuy-products',    'StoresApiController@getBusinessMultiby');

    Route::resource('receipt', 'ReceiptController')->only([ 'store', 'show', 'destroy']);
    Route::post('receipt-update', 'ReceiptController@update');
    Route::post('list-receipts', 'ReceiptController@index');
    Route::post('order-details', 'StoresApiController@customerOrderDetails');

    Route::post('list-charities', 'CharityApiController@listCharities');
    Route::post('add-user-coins', 'CharityApiController@addUserCoins');
    Route::post('list-user-coins','CharityApiController@listUserCoins');
    Route::post('add-charity-coins','CharityApiController@transferUserCoinToCharity');


    Route::post('punch-card-stamp','UserApiController@punchCardStamp');
    Route::post('venue-charity-report','CharityApiController@venueWiseReport');

    Route::post('gamification-qr-code-scanned', 'GamificationController@customerScannedQrCode');

    Route::get('about-loyalty-list', 'HelpController@getListAboutLoyalty');
    Route::get('faq-list', 'HelpController@faqs');

    Route::post('user-feed-backs','UserApiController@userFeedBack');


    Route::post('get-tiers', 'ReceiptController@getAllTiers');



    //----- Wimpy API's ---------//
    Route::POST('update-menue-filters',         'UserApiController@updateMenuFilters');
    Route::POST('update-notifications',         'UserApiController@updateNotifications');


    Route::POST('get-restaurants',              'StoresApiController@getSoldiResturant');

    Route::POST('dashboard-listing',            'UserApiController@dashBoardListing');

    Route::POST('add-user-favourite',               'UserApiController@addUserFavourite');
    Route::POST('get-categories-lists',             'StoresApiController@getCategoryProducts');
    Route::POST('get-bill-details',                 'StoresApiController@scanBillFromSoldi');
    Route::POST('get-points-products',              'StoresApiController@getPointsProducts');
    Route::POST('discount-plus',              'StoresApiController@getDiscountPlus');
    Route::POST('get-bill-type',              'StoresApiController@getSoldiDiscount');

    Route::POST('get-bill-qrcode',                   'StoresApiController@getbillQrcode');
    Route::GET('user-gift-cards',                   'StoresApiController@getUserGiftCards');


    Route::post('user-receipt', 'ReceiptController@getUserReciept');

    Route::POST('user-location', 'GamificationController@userLocationDetection');
    Route::POST('refferal-friend',     'UserApiController@refferalFriend');
    Route::get('list-faqs',      'HelpController@listFaqs');

    Route::POST('get-card-details',      'UserApiController@getUserPunchAndStamp');

    Route::POST('shop-categories',          'RestController@getCategoryVenues2');

    Route::POST('payment',              'StoresApiController@paymentToSoldi');
    Route::POST('user-wicode-statue',              'StoresApiController@customerOrderStatus');

    Route::POST('gift-card-data',              'StoresApiController@customerGiftCardOrder');


    Route::POST('user-food-prefrences', 'UserApiController@userPreferences');


    Route::POST('add-user-cards','PaymentController@addUserCards');

    Route::POST('user-payments','PaymentController@userPaymentKB');
    Route::GET('user-card-list','PaymentController@getUserCardsKB');

    Route::GET('user-checktest','UserApiController@getKDTEST');

    Route::POST('gift-card-send',              'StoresApiController@customerSendGiftCard');

    Route::POST('gift-card-claim',              'StoresApiController@validateCustomerGiftCard');

    Route::POST('update-message-status', 'UserApiController@updateReadMessages');

    Route::POST('user-survey',      'UserApiController@userSurveys');
    Route::POST('list-board','QuickBoard@quickBoardListing');
    Route::POST('save-clicks-impressions','RecipeController@saveClicksImprressions');

    Route::get('surveys','UserApiController@getSurveys');
    Route::get('survey-questions','UserApiController@surveyQuestions');
    Route::post('answer-question','UserApiController@answerQuestion');

    Route::post('user-completed-steps','UserApiController@userCompletedSteps');

//------- Gift Card Purchase
    Route::POST('giftcard-purchase',       'PaymentController@userGiftCardPaymentKB');
    //----- Voucher Code Qr
    Route::post('voucher-validate-qrcode','VoucherController@validateVoucherQrCode');

});//..... end of middleware wrapper ......//
Route::post('user-proximity', 'UserApiController@beaconProximity');




Route::POST('activity-listing',             'UserApiController@userActivityVouchers');
Route::POST('shop-categories',      'RestController@getCategoryVenues2');
Route::POST('save-clicks-impressions','RecipeController@saveClicksImprressions');


Route::POST('store/products',       'RestController@getAllProductData');

Route::post('get_venues_news',      'NewsApiController@getNews');
Route::POST('shop-categories',      'RestController@getCategoryVenues2');


//Route::POST('shop-categories',      'RestController@getCategoryVenues2');

Route::POST('redeem-voucher',       'StoresApiController@redeemVoucher');

Route::POST('customer-transactions', 'StoresApiController@customer_transactions');
Route::post('auto-check-out',       'UserApiController@autoCheckoutCart');
Route::POST('beacon-auto-payment',  'UserApiController@beaconTriggerData');
Route::post('resend-code',          'UserApiController@codeResendUser');
Route::post('activate-user',        'UserApiController@activateUser');
Route::post('user-forgot-password', 'UserApiController@forget_password');
Route::post('user-reset-password',  'UserApiController@reset_password');
Route::POST('user/register',        'UserApiController@register');
Route::post('user-login',           'UserApiController@loginUser');



Route::post('test-sms', 'UserApiController@testData');
Route::post('test-email', 'UserApiController@sendTestEmail');
Route::POST('get_client_id', 'UserApiController@getClientId');
Route::post('get-oauth-token', 'UserApiController@getUserToken');
Route::post("refresh-oauth-token", function(\Illuminate\Http\Request $request) {
    $http = new GuzzleHttp\Client;

    $response = $http->post(url('/').'/oauth/token', [
        'form_params' => [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->refresh_token,
            'client_id' => $request->client_id,
            'client_secret' => $request->client_secret,
            'scope' => '',
        ],
    ]);

    return json_decode((string) $response->getBody(), true);
});


/*Route::get('/venues/detail/{id?}', 'VenueApiController@getAllVenuesList');*/
/*Route::POST('/floorPlanBeacons', 'BeaconsApiController@get_floor_plan_beacons');*/
/*Route::post('upload_s3_image', "Admin\ImageLibraryController@upload_image");*/
/*Route::post('save-venue', "VenueApiController@saveVenue");*/
/*Route::get('list_products', 'VenueApiController@list_products');*/
/*Route::get('list_point_types', 'VenueApiController@get_point_types');*/

Route::post('user-data-es', 'UserApiController@userDataES');
Route::post('test-api', 'UserApiController@testTime');

Route::POST('venues-stores', 'RestController@getVenuesStores');
Route::POST('update-user-address', 'UserApiController@updateUserAddress');
Route::POST('gym-timetable','SitesApiController@getGymTimetable');
Route::POST('get-gyms','SitesApiController@getGyms');
Route::POST('get-filtered-gyms','StoresApiController@getSiteFiteredInventory');
Route::GET('env','UserApiController@check_env');
Route::post('community-news',      'NewsApiController@getCommunityNews');
Route::post('get-videos',      'NewsApiController@getVideos');


Route::POST('quickboard-data','QuickBoard@boardWiseData');

Route::post('recipe-category', 'RecipeController@listCategory');
Route::post('recipes-list', 'RecipeController@getRecipes');
Route::post('save-recipe-review', 'RecipeController@saveReview');
Route::post('get-recipe-offers-list', 'RecipeController@getOffersListing');

Route::POST('shopCategories',      'RestController@getCategoryVenues2');
Route::POST('all-news',      'NewsApiController@getAllNews');
Route::POST('test-notify',      'UserApiController@sendTestPush');
Route::POST('help',      'HelpController@helpDataForMobile');

Route::POST('data-user-dump','ElasticSearchController@insertExistingDataElasticSearch');
Route::POST('bulk-test','UserApiController@testBulkEmails');
Route::POST('test-json','UserApiController@jsoNEEEE');
Route::get('app-settings','VenueController@app_settings');
Route::POST('add-user-es','UserApiController@updateAllUserVenues');
Route::POST('getUserQUery','UserApiController@getQuery');


Route::POST('auto-delete-loyalty','StoresApiController@autoDeleteUsersPointsLog');



Route::match(['get', 'post'], 'get-payment-type/{region?}', 'PaymentController@killbillPaymentData');
Route::POST('soldi-payment','PaymentController@userPaymentKB');
Route::GET('test-checking','PaymentController@insertAllUser');

Route::POST('get-waitron-code',         'UserApiController@getWaitronDetailFromMobile');



Route::POST('auto-update-userpayments',         'StoresApiController@updateUserPayments');

Route::POST('user-vouchers',        'UserVouchersController@userVouchersListing');
Route::POST('delete-user-wicode',        'StoresApiController@deleteUserWicode');
Route::POST('user-referred', 'UserApiController@addRefferdBy');
Route::POST('kill_test', 'UserApiController@checkKillBillStatus');

Route::POST('get-punch-card',       'UserApiController@listPunchCard');
Route::get('redeem-voucher',       'UserApiController@redeemVoucher');

