<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Character extends Model
{
    use SoftDeletes;
    protected $table = 'characters';
    protected $guarded = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function missions()
    {
        return $this->belongsToMany(Mission::class, 'mission_characters', 'character_id', 'mission_id', 'id','id')
            ->withPivot('start_date', 'end_date', 'is_executed');
    }//..... end of missions() .....//
}
