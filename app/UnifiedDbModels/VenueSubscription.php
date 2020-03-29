<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class VenueSubscription extends Model
{
    protected $table    = "venue_subscritions";
    protected $guarded  = ['id'];
}
