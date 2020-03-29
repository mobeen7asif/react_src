<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PunchCard extends Model
{
    use SoftDeletes;
    protected $table = 'punch_cards';
    protected $guarded = ['id'];
}
