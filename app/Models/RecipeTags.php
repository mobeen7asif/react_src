<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecipeTags extends Model
{
    protected $table = 'recipe_tags';
    protected $guarded = ['id'];
    protected $hidden  = ['created_at', 'updated_at', 'deleted_at'];
}
