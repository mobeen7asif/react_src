<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMissionCharacters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mission_characters', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mission_id');
            $table->unsignedInteger('character_id');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->tinyInteger('is_executed')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mission_characters');
    }
}
