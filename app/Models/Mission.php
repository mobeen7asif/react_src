<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mission extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    /*public function missionCharacters()
    {
        return $this->hasMany(MissionCharacter::class, 'mission_id');
    }*/
}
