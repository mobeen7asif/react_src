<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVenues extends Model
{

    protected $table        = 'user_venues';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
}
