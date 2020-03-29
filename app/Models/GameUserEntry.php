<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GameUserEntry extends Model
{
    use SoftDeletes;

    protected $table    = 'game_user_entries';
    protected $guarded  = ['id'];
}
