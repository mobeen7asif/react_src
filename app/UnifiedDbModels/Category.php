<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table        =   'category';
    protected $guarded      =   ['category_id'];
    protected $primaryKey   =   "category_id";
}
