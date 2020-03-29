
<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


use App\Models\AppSetting;
use App\User;
use App\Utility\ElasticsearchUtility;
use Illuminate\Support\Facades\Storage;

Route::middleware('auth:api')->group(function() {

    Route::get('get-data','ElasticSearchController@getDataCheck');
    Route::get('point-dashboard-charts/{venue_id}','HostDashboardController@getPointmeUsers');
    Route::get('segment-list/{company_id}/{venue_id}', 'SegmentController@getSegmentList');
    Route::post('saved-segments-details', 'SegmentController@getSegmentsUsers');
    Route::post('delete-segment', 'SegmentController@deleteSegments');

    Route::post('upload-file', 'FilesController@uploadFile');
    Route::get('remove-file', 'FilesController@deleteFile');
    Route::post('create-user','ElasticSearchController@createUser');
    Route::post('venue-configuration', 'VenueController@configurations_id');
    Route::post('segment-detail-list', 'SegmentController@getDetailSegmentList');
    Route::post('list-venues/{venue_id}', 'VenueController@listVenues');
    Route::post('add-venue-configuration', 'VenueController@venueConfigurationsAdd');
    Route::post('get-venue-data', 'VenueController@getVenueData');
    Route::post('add-loyalty-config', 'VenueController@addloyaltyConfigurations');
    Route::post('get-loyalty-data', 'VenueController@getVenueLoyaltyData');
    Route::post('add-campaign-test-alert', 'VenueController@addCompaignTestAlerts');
    Route::post('get-venue-config-test-alerts', 'VenueController@getVenueConfigurationsTestAlerts');
    Route::post('get-charts-data', 'VenueController@getVenueConfigChartsData');
    Route::post('venue-total-campaign', 'VenueController@venueTotalCampaign');
    Route::post('get-venue-stores', 'VenueController@getStores');
    Route::post('venue-onboard', 'VenueController@updateStoreVenue');
    Route::post('venue-users', 'VenueController@getUsers');
    Route::post('save-campaign_saturation', 'VenueController@addCompaignSaturations');
    Route::post('create-venue-user', 'UsersController@usercreate');
    Route::post('get-venue-images', 'MediaController@getMediaImages');
    Route::post('campaign-list', 'CampaignController@getCampaignList');

    Route::get('email-templates-list', 'EmailBuilderController@getTemplateList');
    Route::get('products-list', 'ProductController@getProductsForDropDownList');
    Route::get('point-type-list', 'ProductController@getPointTypesForDropDownList');

    Route::post('save-media-image', 'MediaController@saveimage');
    Route::post('edit-venue-image', 'MediaController@edit_venues_image');
    Route::post('delete-venue-image', 'MediaController@delete_image');
    Route::post('get-image-categories', 'MediaController@getImageCategories');
    Route::post('save-image-categories', 'MediaController@saveCategory');
    Route::post('save-venue-level', 'VenueController@addVenueLevel');
    Route::post('get-venue-levels', 'VenueController@getVenueLevels');
    Route::post('get-patron-detail', 'ElasticSearchController@getPatronData');
    Route::post('get-auto-suggest_data', 'ElasticSearchController@getAutSuggestData');
    Route::post('save-campaign', 'CampaignController@saveCampaign');
    Route::post('delete-venue-level', 'VenueController@deleteLevelData');
    Route::post('add-beacon-in-venue', 'VenueController@addBeconInVenue');
    Route::post('get-floor-beacons', 'VenueController@getFloorBeacons');
    Route::post('update-floor-beacons', 'VenueController@updateBeconInVenue');
    Route::post('delete-beacon', 'VenueController@deleteBeaconData');
    Route::post('get-floor-beacon', 'VenueController@getFloorBeacon');

    Route::get('beacons-list/{venue_id}', 'BeaconController@getBeaconsShortList');
    Route::post('build-segment-query', 'SegmentController@buildSegmentQuery');
    Route::get('membership-type-list/{company_id}/{venue_id}', 'SegmentController@getMembershipTypeList');
    Route::get('rating-grade-list/{company_id}/{venue_id}', 'SegmentController@getRatingGradeList');
    Route::get('pos-sale-items-list/{company_id}/{venue_id}', 'SegmentController@getPosSaleItemsList');
    Route::post('segment-member-list', 'SegmentController@getSegmentMemberList');

    Route::post('save-segment', 'SegmentController@saveSegment');
    Route::post('send-test', 'CampaignController@sendTestCampaign');
    Route::get('campaign-detail/{id}', 'CampaignController@getCampaignById');
    Route::post('delete-campaign/{id}', 'CampaignController@deleteCampaign');

    Route::post('check-voucher-campaign/{id}', 'CampaignController@checkVoucherCampaign');

    Route::get('duplicate-campaign/{id}', 'CampaignController@duplicateCampaign');
    Route::get('floor-list/{id}', 'CampaignController@floorList');
    Route::get('floor-beacons/{venueID}/{levelID}', 'CampaignController@floorBeaconsList');

    Route::get('tags-list', 'CampaignController@tagsList');
    Route::post('faqs', 'HelpController@faqs');
    Route::post('save-updated-faqs', 'HelpController@saveUpdatedFaqs');
    Route::get('user-manual', 'HelpController@userManual');
    Route::get('segment-detail/{id}', 'SegmentController@getSegment');

    Route::post('member-sale-details', 'ElasticSearchController@getMemberSaleDetails');
    Route::post('all_member-stats', 'ElasticSearchController@allMemberStats');
    Route::post('member-details', 'ElasticSearchController@getMemberDetail');
    Route::post('get-demographic-data', 'ElasticSearchController@getDemographicData');

    Route::post('member-vouchers', 'ElasticSearchController@getMemberVouchers');
    Route::post('sent-campaigns-graph', 'ElasticSearchController@campaignGraphsData');

    Route::post('member-points', 'ElasticSearchController@getMemberPoints');
    Route::post('points-graph', 'ElasticSearchController@pointsGraphData');
//    wasim
//    Route::post('member-stamp-cards', 'ElasticSearchController@getMemberStampCards');
    Route::post('dashboard-voucher-stats', 'ElasticSearchController@getDashboardVoucherStats');
    Route::post('dashboard-distinct-vouchers', 'ElasticSearchController@getDashboardDistinctVouchers');
    Route::post('all-gender-stats', 'ElasticSearchController@getGenderStats');



    Route::post('voucher-stats', 'ElasticSearchController@getVoucherStats');
    Route::post('voucher-detail', 'ElasticSearchController@getVoucherDetail');
    Route::post('badges-stats', 'ElasticSearchController@getBadgesStats');
    Route::post('member-badges', 'ElasticSearchController@getMemberBadges');
    Route::post('update-member-profile', 'ElasticSearchController@updateMember');
    Route::post('upload-user-image', 'ElasticSearchController@úploadUserImage');


    Route::post('member-campaigns', 'ElasticSearchController@getMemberCampaigns');
    Route::post('dashboard-campaigns', 'ElasticSearchController@getDashboardCampaigns');

    Route::post('member-stamp-cards', 'ElasticSearchController@getMemberStampCards');
    Route::post('stamp_card_stats', 'ElasticSearchController@getMemberStampCardsStas');

    Route::post('venue-dashboard-data', 'HostDashboardController@getVenueDashboardData');
    Route::post('campaign-dashboard-data', 'HostDashboardController@getCampaignDashboardData');
    Route::get('member-dashboard-data/{venue_id}', 'HostDashboardController@getMemberDashboardData');
    Route::get('get-soldi-business','VenueController@getSoldiBusiness');
    Route::post('check-products','VenueController@getSoldiBussinessProducts');
    Route::post('save-venues','VenueController@saveVenue');
    Route::post('get-company-venues','VenueController@getCompanyVenues');
    Route::post('save-venue-category', 'VenueController@addVenueCategories');
    Route::post('get-venue-category', 'VenueController@getVenueCategories');
    Route::delete('delete-venue-category/{vneueCatID}', 'VenueController@deleteVenueCategories');
    Route::post('get-news-category', 'NewsController@getNewsCategories');
    Route::post('save-news-category', 'NewsController@saveNewsCategories');
    Route::delete('delete-news-category/{news_category_id}', 'NewsController@deleteNewsCategories');
    Route::post('get-venue-news', 'NewsController@getVenueNews');
    Route::post('save-venue-news', 'NewsController@saveVenueNews');
    Route::delete('delete-venue-news/{news_id}', 'NewsController@deleteNews');
    Route::post('get-users-roles', 'VenueController@getUserRoles');
    Route::post('save-users-roles', 'VenueController@saveUserRoles');
    Route::delete('delete-user-role/{role_id}', 'VenueController@deleteRole');
    Route::post('get-user-role', 'UsersController@getRole');
    Route::get('business-list/{company_id?}', 'CampaignController@getBusiness');
    Route::post('list-venue-data', 'VenueController@getVenueInfo');
    Route::post('save-auto-checkout', 'VenueController@saveAutoCheckOut');
    Route::post('save-app-color', 'VenueController@saveAppColor');
    Route::post('get-payment-gateway', 'VenueController@getPaymentGatwayStatus');
    Route::post('get-business-category', 'CampaignController@getBusinessCategory');
    Route::post('get-category-products', 'CampaignController@getCategoryProducts');
    Route::post('save-punch-card', 'PunchCardController@savePunchCard');
    Route::post('punch-card-list', 'PunchCardController@listPunchCards');
    Route::post('delete-punch-card', 'PunchCardController@deletePunchCard');

    Route::post('gym-list', 'GymController@loadGyms');
    Route::post('delete-dym', 'GymController@deleteGyms');
    Route::post('save-gym', 'GymController@saveGyms');
    Route::post('get-venue-videos', 'NewsController@getVenueVideos');
    Route::post('save-venue-videos', 'NewsController@saveVenueVideos');
    Route::delete('delete-venue-videos/{video_id}', 'NewsController@deleteVenues');
    Route::post('get-list-charity', 'CharityController@getCharities');
    Route::post('save-charity', 'CharityController@saveCharity');
    Route::delete('delete-charity/{charity_id}', 'CharityController@deleteCharity');
    Route::post('get-venue-charities', 'CharityController@getVenueCharities');
    Route::post('save-charity-bankinfo', 'CharityController@saveCharityBankInfo');
    Route::post('get-charity-bankinfo', 'CharityController@getCharitiesBankInfo');
    Route::delete('delete-charityBankInfo/{charityBankid}', 'CharityController@deleteCharityBankInfo');
    Route::post('save-quickboard-orders', 'NewsController@saveQuickBoardOrder');

    Route::post('recipes-lists', 'RecipeController@getRecipesLists');
    Route::post('delete-recipe', 'RecipeController@deleteRecipe');
    Route::post('save-recipe', 'RecipeController@saveRecipe');
    Route::get('recipe-category-list/{id?}', 'RecipeController@getCategoryList');
    Route::post('get-offers-list', 'RecipeController@getOfferList');
    Route::get('get-saved-locations','RecipeController@getSavedLocations');
    Route::post('delete-recipe-offer', 'RecipeController@deleteOffer');
    Route::post('save-recipe-offer', 'RecipeController@saveOffer');
    Route::post('get-recipe-category-list', 'RecipeController@recipeCategoryList');
    Route::post('save-recipe-category', 'RecipeController@saveCategory');
    Route::post('delete-recipe-category', 'RecipeController@deleteCategory');
    Route::post('get-all-category', 'VenueController@getAllCategories');
    Route::get('get-company-level','VenueController@getComapanyLevel');
    Route::get('list-recipes-for-dropdown', 'RecipeController@getRecipeListForDropdownList');
    Route::get('venue-dropdown-list/{id?}', 'VenueController@getVenueDropDownList');
    Route::post('get-venue-shops', 'VenueController@getVenvueDetail');
    Route::post('adjust-member-channel', 'SegmentController@setMemberChannel');
    Route::post('saveTemplate','EmailBuilder@saveTemplate');
    Route::post('saveTemplate2','EmailBuilder@saveTemplate2');
    Route::delete('delete-template/{video_id}', 'EmailBuilder@deleteTemplate');
    Route::post('upgrade-to-merchant', 'SegmentController@upgradeMemberAccount');
    Route::post('member-business-list', 'SegmentController@getMemberAssignedBusinesses');
    Route::post('qb-types', 'NewsController@quickBoardTypes');
    Route::post('get-quick-board-levels', 'QuickBoard@getQuickBoardLevels');
    Route::post('save-quick-board-level', 'QuickBoard@saveQuickBoardLevel');
    Route::delete('delete-qb-level/{id}', 'QuickBoard@deleteQuickBoardLevel');
    Route::post('list-tiers', 'CharityTierController@getListTiers');
    Route::post('save-charity-tiers', 'CharityTierController@saveTiers');
    Route::delete('delete-tier/{id}', 'CharityTierController@deleteTier');

    Route::post('save-referral-coins', 'ReferralFriendController@addReferralFriend');
    Route::post('referral-list', 'ReferralFriendController@getReferralFriend');
    Route::post('save-faqs', 'HelpController@saveFaqs');
    Route::post('contacts', 'HelpController@getContacts');

    Route::post('list-characters', 'CharacterController@loadCharacters');
    Route::post('save-character', 'CharacterController@saveCharacter');
    Route::post('delete-character', 'CharacterController@deleteCharacter');

    Route::post('competitions-list', 'CompetitionController@listCompetitions');
    Route::post('save-competition', 'CompetitionController@saveCompetition');
    Route::post('delete-competition', 'CompetitionController@deleteCompetition');
    /*  Route::post('list-mission-characters', 'CompetitionController@listMissionCharacters');
      Route::post('execute-draw', 'CompetitionController@executeDraw');
      Route::post('list-mission-characters-winners', 'CompetitionController@listWinners');*/
    Route::post('surveys-list', 'GamificationController@listSurveys');
    Route::post('save-survey', 'GamificationController@saveSurvey');
    Route::post('save-question-answers', 'GamificationController@saveQuestionAnswer');
    Route::post('update-question-answers', 'GamificationController@updateQuestionAnswer');
    Route::post('delete-survey/{id}', 'GamificationController@deleteSurvey');


    Route::post('save-about-loyalty', 'HelpController@saveAboutLoyalty');
    Route::post('list-loyalty-about', 'HelpController@getAboutLoyalty');
    Route::post('get-chef', 'ChefController@getChef');
    Route::post('save-chef', 'ChefController@saveChef');

    Route::post('upload-user-guide', 'HelpController@uploadUserGuide');

    Route::delete('delete-chef/{id}', 'ChefController@deleteChef');
    Route::get('list-email-templates', 'EmailBuilder@getCampaignTemplate');

    Route::post('gamification-campaign-statistics', 'GamificationController@loadCampaignStatistics');

    Route::post('get-groups', 'VenueController@getGroups');
    Route::post('save-group', 'VenueController@saveGroup');
    Route::delete('delete-group/{groupID}', 'VenueController@deleteGroup');

    Route::post('delete-faq', 'HelpController@deleteFaqs');

    Route::post('faqs-categories', 'HelpController@faqsCategories');
    Route::post('save-faq-categories', 'HelpController@saveFaqCategories');
    Route::delete('delete-faq-category/{faq_cat_id}', 'HelpController@deleteFaqsCategories');

    Route::get('competitions-dropdown-list', 'CompetitionController@getCompetitionsListForDropdownList');
    Route::any('scanned-characters-list', 'CompetitionController@getUserScannedCharacteresList');
    Route::get('petpack-animation-dropdown-list', 'CompetitionController@getPetPacksListForDropdownList');
    Route::post('upload-file-recipe', 'FilesController@uploadFileRecipe');

    Route::post('list-punch-cards','PunchCardController@getPunchCards');
    Route::post('get-all-charities', 'CharityController@listCharities');





    Route::post('get-all-charities', 'CharityController@listCharities');
    Route::post('list-punch-cards','PunchCardController@getPunchCards');
    Route::post('delete-member', 'UsersController@deleteMember');
    Route::post('activate-campaign', 'CampaignController@activateCampaign');
    Route::post('play-stop-campaign', 'CampaignController@playStopCampaign');

    Route::post('add-pos-venues', 'VenueController@addPosVenues');
    Route::get('getsegment-type/{company_id}/{id}', 'SegmentController@getsegmentType');
    Route::post('getTemplate','EmailBuilder@getTemplate');
    Route::get('get-all-stampcard/{company_id}','PunchCardController@getAllStampCard');
    Route::get('transaction-check','UserApiController@checkingStamp');
    Route::post('list-term-conditions', 'HelpController@termAndConditions');
    Route::post('save-term-condition', 'HelpController@saveTermAndConditions');

    //Route::post('update-custom-fields', 'VenueController@updateCustomFields');


    Route::post('save-voucher',        'VoucherController@saveVoucher');
    Route::post('list-all-vouchers',   'VoucherController@listAllVouchers');
    Route::post('delete-voucher',      'VoucherController@deleteVoucher');
    Route::post('get-vouchers',   'VoucherController@getAllVouchers');
    Route::post('get-vouchers-group',   'VoucherController@getVoucherForGroup');

    Route::post('updatecustom-fields', 'VenueController@updateCustomFields');
    Route::post('update-custom-fields', 'ElasticSearchController@updateMemberCustomFields');
    Route::post('user-custom-form-data', 'ElasticSearchController@userCustomFormData');


    Route::post('get-all-groups', 'VenueController@getAllGroups');
    Route::post('save-groups', 'VenueController@saveGroups');
    Route::post('totalRedeemVouchers', 'ElasticSearchController@totalRedeemVoucher');
    Route::post('adjust-member-subscription', 'SegmentController@adjustMemberSubscription');
    Route::post('user-linked-to-store', 'UserApiController@userStores');
    Route::post('list-stores','UserApiController@getUserStores');
    ROUTE::POST('assign-stamp-card','ElasticSearchController@stampCardAssign');
});
Route::get('transaction-check','UserApiController@checkingStamp');
Route::post('save-survey-answers', 'GamificationController@saveSurveyAnswers');


Route::post('update-payment-gatway', 'VenueController@updatePaymentGateway');
Route::get('get-company-levels-roles/{company_id}', 'VenueController@getCompanyLevelForRoles');
Route::get('export-segment', 'SegmentController@exportSegment');
Route::post('create-index','ElasticSearchController@createIndex');
Route::post('insert-data','ElasticSearchController@insertDataElasticSearch');


Route::post('get-quick-board','QuickBoard@getQuickBoards');
Route::get('get-venues-multiselect','VenueController@getAllVenues');
Route::get('get-saved-locations','RecipeController@getSavedLocations');
Route::get('get-venue-stores','VenueController@getVenueStore');
Route::post('csv-file','CSVReadController@readCsvFile');
Route::post('web-login', '\App\Http\Controllers\Auth\WebLoginController@login');

Route::post('sendTestEmail','TestEmailController@sendEmail');
Route::post('sendSms','TestEmailController@sendSms');
Route::get('print-charity-report/{id}','CharityController@printCharityReport');
Route::post('all-venue-charity-report','CharityController@allCharityReport');
Route::get('printPdf','CharityController@printPdfReport');

Route::get("export-csv",'ElasticSearchController@exportUserData');

Route::get('export-game-mission-members', 'GamificationController@exportGameMissionMembers')->name('export.game.mission.members');
Route::get('export-competition-members', 'GamificationController@exportCompetitionMembers');
Route::get('get-template/{id}','EmailBuilder@getSingleTemplate');

Route::get('testReferral','UserApiController@getAllUserToES');

Route::get('elasticsearch-entry/{id}','ElasticSearchController@getUserData');



//Route::get('voucher-reports/{date?}','ElasticSearchController@getVoucherReport');
Route::get('voucher-reporting','ElasticSearchController@getVoucherReportDummt');


Route::get('voucher-reports/{date?}','ElasticSearchController@getSheetsData');

Route::post('add_user_code','UserApiController@test');




Route::get('survey-report','UserApiController@getSurveyData');

//soldi api calls
Route::post('soldi-transactions-data','DashboardController@soldiTransactionsData');
Route::post('soldi-staff-sales-data','DashboardController@soldiStaffSalesData');
Route::post('soldi-products-data','DashboardController@soldiProductsData');
Route::post('soldi-overall-stats-data','DashboardController@soldiOverallStatsData');


Route::post('transaction-graph','DashboardController@memberTransactionGraph');
Route::post('member-transactions','DashboardController@memberTransactions');
Route::post('get-all-payments','DashboardController@allPayments');

Route::post('soldi-overall-stats-count','DashboardController@soldiOverallStatsCount');
Route::get('test-voucher','ElasticSearchController@testVoucher');



Route::get('export-offer-stats', 'RecipeController@exportOfferStats');
Route::get('export-survey-stats', 'GamificationController@exportSurveyStats');

Route::post('delete-members-crone', 'UsersController@deleteUsersCrone');
Route::post('qr-code','GamificationController@getQrCode');

Route::post('uploadCsv', 'DashboardController@uploadCsv');

Route::post('survey-list','GamificationController@surveyList');
Route::post('get-all-videos', 'RecipeController@getAllVideos');
Route::post('get-active-campaigns', 'CampaignController@getActiveCampaignList');


Route::get('php', 'GamificationController@php');
Route::get('es/{id}', 'GamificationController@es');
Route::get('db', 'GamificationController@db');
Route::get('redis', 'GamificationController@redis');
Route::get('dumpusers/{company_id}','GamificationController@dumpUserInGroup');

Route::post('update-pos-configuration', 'VenueController@updatePosConfiguration');


Route::get('export-all-users', 'SegmentController@exportAllUsers');
Route::get('testEmail', 'CampaignController@sendEmails');

Route::get('get-env', 'CampaignController@getEnv');
Route::get('getGamificationReport', 'CampaignController@getGamificationReport');
Route::get('getcampaignVoucherReport', 'CampaignController@getcampaignVoucherReport');
Route::get('getcampaignVoucherReport2/{venue_id}', 'CampaignController@getcampaignVoucherReport2');

Route::post('surveyJson', 'GamificationController@getSurveyJson');
Route::post('refund-payment', 'PaymentController@refundDataToKB');

Route::GET('getdata', 'UserApiController@testData');
Route::POST('update-wicode-status', 'StoresApiController@updateUserWicodeStatus');
Route::post('group-list','GamificationController@groupList');
Route::get('dumpusers/{company_id}','GamificationController@dumpUserInGroup');
Route::post('survey-list','GamificationController@surveyList');
Route::post('get-all-videos', 'RecipeController@getAllVideos');
Route::post('get-active-campaigns', 'CampaignController@getActiveCampaignList');
// For Cron to delete user point for inactive
Route::post('cron-inactive-user-points','UserApiController@deleteInactiveUser');
Route::post('update-pos-configuration', 'VenueController@updatePosConfiguration');

Route::get('update-user-status', 'CronController@getAllUserStatus');
Route::get('getcheck', 'UserApiController@testCheck');
Route::POST('assign-points-survey','UserApiController@assignPointToUser');

Route::post('insert-user-es', 'UserApiController@addUserToES');


Route::GET('getdata', 'UserApiController@testData');

Route::get('export-offer-stats', 'RecipeController@exportOfferStats');
//=========== server testing api  ====================//
Route::get('php', 'GamificationController@php');
Route::get('es/{id}', 'GamificationController@es');
Route::get('db', 'GamificationController@db');
Route::get('redis', 'GamificationController@redis');
//=========== end of testing  ====================//

Route::post('list-vouchers','UserVouchersController@listActiveCampaignVouchers');
Route::post('survey-list','GamificationController@surveyList');
Route::post('get-all-videos', 'RecipeController@getAllVideos');
Route::post('get-active-campaigns', 'CampaignController@getActiveCampaignList');


Route::GET('get-killbill','UserApiController@registerToKillBill');


Route::post('update-pos-configuration', 'VenueController@updatePosConfiguration');
Route::post('refund-payments', 'PaymentController@assignPunchCardUser');




Route::POST('get-response-webview', function (){
   \Illuminate\Support\Facades\Log::channel('custom')->info('response from killbill',['Response'=>request()->all()]);
});
Route::get('clear-cache', function() {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('config:cache');
    return "Cache is cleared";
});

Route::post('save-transaction','DashboardController@saveTransaction');


Route::get('update-company-ids', function() {
    ini_set('max_execution_time', 0);
    try
    {
        User::where('region_type','uk')->update(['company_id' => 2]);
        User::where('region_type','ireland')->update(['company_id' => 1]);

        AppSetting::where('key','welcome_message')->update(['company_id' => 1]);
        AppSetting::where('key','refer_friend_title')->update(['company_id' => 1]);
        AppSetting::where('key','refer_friend_body')->update(['company_id' => 1]);

        //update is ES

        $users = User::where('user_type','app')->get();
        foreach($users as $user) {
            $userData = [
                'region_type' => $user->region_type,
                'company_id' => $user->company_id,
            ];
            $source = "";
            foreach ($userData as $key => $value) {
                $source .= "ctx._source['$key'] = '$value';";
            }

            $query = [
                'script' => [
                    'source' => $source
                ],
                'query' => [
                    'bool' => [
                        'must' => [
                            ['match' => ['custom_doc_type' => config('constant.demographic')]],
                            ['match' => ['persona_id' => $user->user_id]]
                        ]
                    ]
                ]
            ];
            ElasticsearchUtility::updateByQuery('',$query);

        }
        return "keys updated";
    } catch (Exception $e)
    {
        return $e->getMessage();
    }
});

/*Route::GET('update-ibs-code',function (){
    $envFile = app()->environmentFilePath();
    $str = file_get_contents($envFile);

    $str .= "\n"; // In case the searched variable is in the last line without \n
    $keyPosition = strpos($str, "IBS_VERIFICATION=");

    $endOfLinePosition = strpos($str, PHP_EOL, $keyPosition);
    $oldLine = substr($str, $keyPosition, $endOfLinePosition - $keyPosition);
    $str = str_replace($oldLine, "IBS_VERIFICATION=".\Illuminate\Support\Str::random(40), $str);
    $str = substr($str, 0, -1);

    $fp = fopen($envFile, 'w');
    fwrite($fp, $str);
    fclose($fp);


});*/

ROUTE::post('validate-vouchers','PaymentController@valideteIbsVouchers');
ROUTE::post('testOldNewUser','UserApiController@testOldNewUser');
ROUTE::post('get-all-segments','SegmentController@getAllDetailSegments');
ROUTE::post('user-status-update','UserApiController@updateUserStatus');
ROUTE::get('user-delete','UserApiController@deleteUsers');
ROUTE::get('user-check','UserApiController@checkPost');

/*ROUTE::post('validate-vouchers','PaymentController@updateVoucherStatusCheck');*/
Route::post('dummy', 'ElasticSearchController@insertDummyPunchCards');

ROUTE::POST('get-all-vouchers','ElasticSearchController@getAllVouchers');
ROUTE::POST('get-all-stamps','ElasticSearchController@getAllStamps');
ROUTE::POST('delete-user-vouchers','ElasticSearchController@redeemVoucher');
ROUTE::POST('get-user-data','ElasticSearchController@getUserByMultipleSearch');

ROUTE::POST('redeemption-status','ElasticSearchController@redeemVoucherStatus');
Route::post('getVenue', 'VenueController@getVenue');
Route::post('getFormCustomFields', 'VenueController@getFormCustomFields');
Route::post('countTotalRecord', 'UserApiController@countTotalRecord');
Route::post('resetCsvCounter', 'UserApiController@resetCsvCounter');
Route::post('getMembershipType','SegmentController@getMembershipType');

ROUTE::POST('assign-voucher','VoucherController@assignVoucher');

ROUTE::any('get-java-data/{url?}/{id?}','VoucherController@getJavaData');

// Configure number configurations (numeric,alphanumeric)
ROUTE::POST('add-number-configurations','VoucherController@configureNumber');
//---- CSV report Download -----//
ROUTE::GET('download-voucher','VoucherController@downloadVoucher');

ROUTE::POST('assign-stamp-card-user','ElasticSearchController@stampCardAssign');

ROUTE::POST('get-billing-settings','VenueController@getSettings');
ROUTE::POST('testEmailsSmsApp','VenueController@testEmailsSmsApp');

ROUTE::GET('test-api','VenueController@test');
ROUTE::match(['get', 'post'],'email-track-events','UsersController@emailTrackEvents');

Route::GET('user-unsubscribe/{id}', 'ElasticSearchController@unsubscriptionUser');
Route::match(['get', 'post'],'sms-status/{any?}', 'ElasticSearchController@smsStatus');

ROUTE::POST('campaign-report','CampaignController@campaignReport');
ROUTE::POST('campaign-report-unsubscription','CampaignController@campaignUnsubscriptionReport');

ROUTE::GET('import-data','UsersController@getAllCampaignData');
ROUTE::GET('import-data-game','UsersController@importGamificationData');
ROUTE::GET('import-data-punch','UsersController@importPunchCard');
ROUTE::GET('import-redeem-vouchers','ElasticSearchController@getallRedeemVoucher');

ROUTE::POST('import-redeem-stamps','ElasticSearchController@getallAssignedStamps');
ROUTE::GET('import-user-venues','ElasticSearchController@getVenueDetails');
ROUTE::GET('import-stamp-converted','ElasticSearchController@stampConverted');
ROUTE::GET('testData','VoucherController@testData');
ROUTE::GET('get-segment-data','VoucherController@getSegmentData');
ROUTE::POST('save-segment-criteria','VoucherController@saveSegmentCriteria');

ROUTE::match(['get', 'post'],'view-voucher/{any?}','VoucherController@voucherView');
ROUTE::POST('update-user-password','UserApiController@updateUserPassword');

ROUTE::POST('user-unsubscribe-system','ElasticSearchController@userUnsubscribeEmail');
ROUTE::POST('get-member-stats','ElasticSearchController@getMemberStampCardsStas');
ROUTE::GET('get-members-report','VoucherController@membersDetailReport');
ROUTE::GET('reffered-count','VoucherController@reportOfReferedFriend');
ROUTE::POST('user-forgot-password-email','UserApiController@forgotPasswordByEmail');
ROUTE::GET('update-user/{id}','UserApiController@passwordUpdateByEmail');
ROUTE::GET('user-es-report','VoucherController@userReportForProd');

