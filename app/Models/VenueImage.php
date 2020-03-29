<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenueImage extends Model
{
    protected $table        =   'venue_image';
    protected $primaryKey   =   "venue_image_id";
    protected $guarded      =   ['venue_image_id'];
}
