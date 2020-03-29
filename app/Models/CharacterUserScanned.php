<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CharacterUserScanned extends Model
{
    use SoftDeletes;
    protected $table = 'characters_user_scanned';
    protected $guarded = ['id'];
}
