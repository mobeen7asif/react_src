<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table        =   'users';
    protected $primaryKey   =   'user_id';
    protected $guarded      =   ['user_id'];
}
