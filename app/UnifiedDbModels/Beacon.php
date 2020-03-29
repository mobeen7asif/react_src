<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Beacon extends Model
{
    protected $table = "beacon_configurations";
    protected $guarded = ['id'];
}
