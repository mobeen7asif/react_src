<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Competition extends Model
{
    use SoftDeletes;

    protected $table = 'competitions';
    protected $guarded = ['id'];
}
