<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMission extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('venue_id')->nullable();
            $table->unsignedInteger('company_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('prize')->default(0);
            $table->string('image')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->integer('entry_interval')->nullable();
            $table->tinyInteger('is_unique_entry')->default(0);
            $table->tinyInteger('max_entry')->default(1);
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
        Schema::dropIfExists('missions');
    }
}
