<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class ProductOptionSet extends Model
{
    protected $table        =   'product_option_set';
    protected $guarded      =   ['product_option_id'];
    protected $primaryKey   =   "product_option_id";
}
