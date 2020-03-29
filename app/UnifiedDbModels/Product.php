<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table        =   'product';
    protected $guarded      =   ['product_id'];
    protected $primaryKey   =   "product_id";
}
