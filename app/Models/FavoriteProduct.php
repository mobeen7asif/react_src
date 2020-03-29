<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteProduct extends Model
{
    //
    protected $table = "favorite_products";
    protected $primaryKey = "favorite_product_id";
    public $timestamps = false;
    protected $fillable = ['favorite_product_id' , 'product_id' , 'status' , 'created_at' , 'updated_at'];
}
