<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Survey extends Model
{
    protected $table = 'surveys';


    public function venue()
    {
        return $this->belongsTo(Venue::class,'venue_id','venue_id');
    }

}
