<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavouriteNews extends Model
{
    //
    protected $table = "favourite_news";

    protected $fillable = ['news_id','user_id','company_id'];
}
