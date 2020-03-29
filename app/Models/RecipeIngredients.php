<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeIngredients extends Model
{
    protected $table = 'recipe_ingredients';
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
}
