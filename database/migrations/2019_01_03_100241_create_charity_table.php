<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCharityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('charity', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('venue_id')->nullable();
            $table->string('charity_name')->nullable();
            $table->text('charity_intro')->nullable();
            $table->text('charity_desc')->nullable();
            $table->string('contact_number',191)->nullable();
            $table->string('charity_email',191)->nullable();
            $table->string('charity_address',191)->nullable();
            $table->string('image',191)->nullable();
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
        Schema::dropIfExists('charity');
    }
}
