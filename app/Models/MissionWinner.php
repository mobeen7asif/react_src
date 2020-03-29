<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MissionWinner extends Model
{
    use SoftDeletes;
    protected $table = 'mission_winners';
    protected $guarded = ['id'];
}
