<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    //
    protected $table = "ratings";
    protected $primaryKey = "id";
    //public $timestamps = false;
    protected $fillable = ['company_id' , 'user_id', 'store_id' , 'venue_id', 'rate_value' ,'created_at' , 'updated_at'];
}
