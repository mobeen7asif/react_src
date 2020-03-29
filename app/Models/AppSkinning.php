<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSkinning extends Model
{
    //
    public $timestamps = false;
    protected $table = "app_skinning";
    protected $fillable = ['company_id' , 'venue_id','skin_title','json' , 'status' , 'skin_image' , 'is_active'];
}
