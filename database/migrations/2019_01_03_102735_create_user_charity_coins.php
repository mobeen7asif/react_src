<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserCharityCoins extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_charity_coins', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id')->nullable();
            $table->unsignedInteger('store_id')->nullable();
            $table->unsignedInteger('company_id')->nullable();
            $table->unsignedInteger('charity_id')->nullable();
            $table->unsignedInteger('venue_id')->nullable();
            $table->unsignedInteger('coins')->nullable();
            $table->enum('status', ['user', 'redeemed', 'organization'])->default('user');
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
        Schema::dropIfExists('user_charity_coins');
    }
}
