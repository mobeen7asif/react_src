<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeReviews extends Model
{
    protected $table = 'recipe_reviews';
    protected $guarded = ['id'];
    protected $hidden  = ['deleted_at', 'updated_at'];
}
