<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecipesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('recipe_category_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('prep_time')->nullable();
            $table->string('cook_time')->nullable();
            $table->string('method')->nullable();
            $table->string('serving')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            $table->softDeletes();
//            $table->foreign('recipe_category_id')->references('id')->on('recipe_category')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
//        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('recipes');
    }
}
