<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLoyaltyPoints extends Model
{
    protected $table    = 'user_loyalty_points';
    protected $guarded  = ['id'];
    protected $primaryKey   = 'id';
}
