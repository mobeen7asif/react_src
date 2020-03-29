<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipePreparations extends Model
{
    protected $table = 'recipe_preparation';
    protected $guarded = ['id'];
    protected $hidden  = ['created_at', 'updated_at', 'deleted_at'];
}
