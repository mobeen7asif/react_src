<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

//Route::view('/{path?}', 'index');
Route::view('/', 'index');
Route::GET('csv-file','Api\CSVReadController@readCsvFile');

Route::GET('privacy-policy', 'API\HelpController@privacyPolicy');
Route::GET('term-and-conditions', 'API\HelpController@termAndCondition');
Route::GET('reports/registered-users', 'API\UserApiController@exportRegisteredUsers');
Route::GET('reports/voucher-reports', 'API\ElasticSearchController@getVoucherReport');

Route::get('flush-redis',function() {
    try {
        \Illuminate\Support\Facades\Redis::flushdb();
    } catch (Exception $e) {
        return 'There is no logs......................';
    }//..... end of try-catch() .....//
});
Route::get("web-log/{type}/{date?}", function($type,$date='') {
        try {
            if (is_dir(\config('constant.LOG_PATH'))) {
                $log_path = \config('constant.LOG_PATH');
            }
            else {
                $log_path = storage_path('logs');
            }

                if($date)
                    $fileName = $type.'-' . $date;
                else
                    $fileName = $type.'-' . now()->format('Y-m-d');

            $logFile = file($log_path . '/'. $fileName.'.log');
        $logCollection = '';
        foreach ($logFile as $line_num => $line)
            $logCollection .= htmlspecialchars($line);
        echo nl2br($logCollection);
    } catch (Exception $e) {
        return 'There is no logs......................'.$e->getMessage();
    }//..... end of try-catch() .....//
});


Route::get("log/del/{type}/{date?}", function ($type,$date='') {
    try {
        $log_path='';
        if (is_dir(config('constant.LOG_PATH'))) {
            $log_path = config('constant.LOG_PATH');
        }
        else {
            $log_path = storage_path('logs');
        }

        if($date)
            $fileName = $type.'-' . $date;
        else
            $fileName = $type.'-' . now()->format('Y-m-d');

        if (unlink($log_path . '/'. $fileName .'.log'))
            return 'deleted Successfully.';
        else
            return 'Could not delete file.';
    } catch (Exception $e) {
        return 'No logs file found'.$e->getMessage();
    }
});

Route::get("proximity-log", function() {
    try {
        $logFile = file(storage_path() . '/logs/proximity-' . now()->format('Y-m-d') . '.log');
        $logCollection = '';
        foreach ($logFile as $line_num => $line)
            $logCollection .= htmlspecialchars($line);
        echo nl2br($logCollection);
    } catch (Exception $e) {
        return 'There is no logs......................';
    }//..... end of try-catch() .....//
});

Route::get("check-server",function (){
    if(\Illuminate\Support\Facades\Config::get('constant.COMPANY_ID')){
        return ['status'=>true];
    }else{
        return ['status'=>false];
    }
});



Route::get('users/export', 'UsersController@export');



/*survey iframe routes*/
Route::get('select-survey',function() {
    $latestSurvey = DB::table('surveys_front')->select('id')->latest('created_at')->first();
    if($latestSurvey){
        $latestSurveyId = $latestSurvey->id;
    }else{
        return ['status' => true, "message" => "No Survey Found"];
    }
    $user_id = request()->get('user_id');


// dd(url('survey-form?id='.$latestSurveyId.'&user_id='.$user_id.''));
    return redirect(url('survey-form?id='.$latestSurveyId.'&user_id='.$user_id.''));
});

Route::get('test-survey',function() {
    $id = request()->id;
    return view('survey', compact('id'));
});

Route::get('survey-form',function() {
//    dd(request()->get('user_id'));
    $id = request()->id;
    $user_id = request()->user_id;
//    dd($id);
    return view('surveyForm', compact('id','user_id'));
});

Route::get('/csv', 'ImportController@getImport')->name('import');
Route::post('/import_parse_ajax', 'ImportController@ajax_import_pre_agents')->name('ajax_import_pre_agents');
Route::post('/saveFile', 'ImportController@saveFile')->name('saveFile');
Route::get('/script-import-data', 'ImportCsvController@importDataFromFile');
Route::get('/import-csv', 'ImportCsvController@importDataFromFile');
Route::get('list-emails/{id?}', "UsersController@listEmail");
Route::get('list-email-view/{id?}', "UsersController@listEmailView");

Route::get('custom-form',function() {
    echo json_encode([["field"=>"new","type"=>"text"]]);
});
Route::post('upload_csv', 'ImportCsvController@upload_csv');
Route::post('custom_csv', 'CsvMappingController@custom_csv');
Route::get('getTableColumns', 'CsvMappingController@getTableColumns');




