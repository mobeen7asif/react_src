<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenueEnteredLog extends Model
{
    protected $table = "user_entered_venue_logs";
    protected $guarded = ['id'];
    public $timestamps = false;
}
