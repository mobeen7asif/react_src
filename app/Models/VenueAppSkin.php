<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenueAppSkin extends Model
{
    //
    public $timestamps = false;
    protected $table = "venue_app_skin";
    protected $fillable = ['company_id' , 'venue_id','skin_title','json' , 'status' , 'skin_image' , 'is_active'];
}
