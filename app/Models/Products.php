<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table    = 'product';
    protected $guarded  = ['product_id'];
}
