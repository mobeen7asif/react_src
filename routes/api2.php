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

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/


//Route::get('php',function() {
//    try {
//        \Illuminate\Support\Facades\Redis::flushdb();
//    } catch (Exception $e) {
//        return 'There is no logs......................';
//    }//..... end of try-catch() .....//
//});

Route::get('php', 'TestController@php');
Route::get('es/{id}', 'GamificationController@es');
Route::get('db', 'GamificationController@db');
Route::get('redis', 'GamificationController@redis');




