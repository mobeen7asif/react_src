<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id');
            $table->integer('company_id')->nullable();
            $table->integer('soldi_id')->nullable();
            $table->string('user_first_name')->nullable();
            $table->string('user_family_name')->nullable();
            $table->string('user_mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('user_avatar')->nullable();
            $table->string('remember_token')->nullable();
            $table->tinyInteger('is_active')->nullable();
            $table->tinyInteger('user_is_active')->nullable();
            $table->string('activation_token')->nullable();
            $table->string('expiry_time')->nullable();
            $table->enum('user_type', ['mobile', 'web'])->default('web');
            $table->integer('knox_user_id')->nullable();
            $table->string('company_name')->nullable();
            $table->string('debug_mod')->nullable();
            $table->text('device_token')->nullable();
            $table->string('device_type')->nullable();
            $table->text('subscribed_venues')->nullable();
            $table->tinyInteger('is_merchant')->default(0);
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
        Schema::dropIfExists('users');
    }
}
