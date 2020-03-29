<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageCategory extends Model
{
    protected $table = "image_category";

    protected $fillable = ['id','title'];
    public $timestamps = false;
}
