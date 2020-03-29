<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $table        =   'variant';
    protected $guarded      =   ['variant_id'];
    protected $primaryKey   =   "variant_id";
}
