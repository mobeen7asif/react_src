<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class LevelVenues extends Model
{
    //
    protected $table = "levels_venues";
    protected $primaryKey = "id";
    protected  $fillable = ['level_id','venue_id','company_id'];
}
