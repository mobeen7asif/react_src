<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMissionWinners extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mission_winners', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mission_id')->nullable();
            $table->unsignedInteger('mission_character_id')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->enum('draw_type', ['small', 'big'])->default('small');
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
        Schema::dropIfExists('mission_winners');
    }
}
