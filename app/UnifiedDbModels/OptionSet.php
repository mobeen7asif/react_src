<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class OptionSet extends Model
{
    protected $table        =   'option_sets';
    protected $guarded      =   ['option_set_id'];
    protected $primaryKey   =   "option_set_id";
}
