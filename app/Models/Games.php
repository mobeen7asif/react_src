<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Games extends Model
{
    use SoftDeletes;
    protected $table = 'games';
    protected $guarded = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function missions()
    {
        return $this->hasMany(Mission::class, 'game_id', 'id');
    }//..... end of missions() .....//
}
