<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OfferStats extends Model
{
    use SoftDeletes;
    protected $table = 'offer_stats';
    protected $guarded = ['id'];
}

