<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserStamp extends Model
{
    use SoftDeletes;
    protected $table ='user_stamps';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
    protected $dates        = ['deleted_at'];
    public $timestamps = false;

}
