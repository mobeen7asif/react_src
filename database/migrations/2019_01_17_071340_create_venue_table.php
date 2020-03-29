<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVenueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('company_id')->nullable();
            $table->unsignedInteger('venue_id')->nullable();
            $table->text('venue_shops')->nullable();
            //$table->integer('store_news_id')->nullable();
            //$table->bigInteger('user_id')->nullable();
            //$table->string('store_name',191)->nullable();
            $table->string('venue_name')->nullable();
           // $table->integer('licenceNumber')->nullable();
            //$table->integer('premises')->nullable();
            $table->string('address')->nullable();
          //  $table->string('locality')->nullable();
            $table->string('stateProvince')->nullable();
            //$table->string('country')->nullable();
           // $table->string('postalCode')->nullable();
           // $table->string('contactName')->nullable();
            //$table->string('telephone')->nullable();
            //$table->string('facsimile')->nullable();
            //$table->string('website')->nullable();
           // $table->text('additional_information')->nullable();
           // $table->string('pager')->nullable();
           // $table->string('mobile')->nullable();
           // $table->string('email')->nullable();
          //  $table->string('system')->nullable();
          //  $table->string('facebook_id')->nullable();
         //   $table->string('twitter_id')->nullable();
          //  $table->string('instagram_id')->nullable();
          //  $table->string('snapchat_id')->nullable();
         //   $table->string('sms_sender_id')->nullable();
         //   $table->string('pointme_sender_id')->nullable();
           // $table->string('email_sender_id')->nullable();
            $table->text('venue_description')->nullable();
          //  $table->string('venue_latitude')->nullable();
           // $table->string('venue_longitude')->nullable();
           // $table->string('venue_url')->nullable();
           // $table->string('is_onBoard')->nullable();
            $table->string('app_color')->nullable();
            $table->tinyInteger('auto_checkout')->nullable();
        //    $table->tinyInteger('beacon_condition')->nullable();
        //    $table->tinyInteger('minutes_condition')->nullable();
          //  $table->string('beacon_area')->nullable();
           // $table->tinyInteger('beacon_listining')->nullable();
            $table->string('image')->nullable();
           // $table->string('beacon_minutes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('venues');
    }
}
