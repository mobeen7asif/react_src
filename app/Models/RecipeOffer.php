<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecipeOffer extends Model
{
    use SoftDeletes;
    protected $table = 'recipe_offers';
    protected $guarded = ['id'];
}
