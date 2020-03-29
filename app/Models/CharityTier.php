<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharityTier extends Model
{
    protected $table = "charity_tiers";

    protected $guarded = ['id'];
    public $timestamps = false;
}
