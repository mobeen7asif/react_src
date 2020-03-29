<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLogs extends Model
{
    protected $table = "user_logs";
    protected $guarded = ['id'];
    protected $primaryKey = 'id';
}
