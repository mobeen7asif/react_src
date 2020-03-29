<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table        =   'store';
    protected $guarded      =   ['store_id'];
    protected $primaryKey   =   "store_id";
}
