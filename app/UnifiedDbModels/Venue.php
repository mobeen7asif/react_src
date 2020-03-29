<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $table        =   'venues';
    protected $guarded      =   ['id'];
    protected $primaryKey   =   "id";
}
