<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsCategories extends Model
{
    protected $table        = "news_categories";
    protected $primaryKey   = "news_category_id";
    protected $guarded      = ['news_categories'];
}
