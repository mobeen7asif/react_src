<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class StoreSettings extends Model
{
    protected $table        =   'store_settings';
    protected $guarded      =   ['store_setting_id'];
    protected $primaryKey   =   "store_setting_id";
}
