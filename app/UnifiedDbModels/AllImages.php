<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class AllImages extends Model
{
    protected $table      = 'all_images';
    protected $guarded    = ['image_id'];
    protected $primaryKey = "image_id";
}
