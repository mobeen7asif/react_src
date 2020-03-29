<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Options extends Model
{
    protected $table        =   'options';
    protected $guarded      =   ['option_id'];
    protected $primaryKey   =   "option_id";
}
