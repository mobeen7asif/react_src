<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gym extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function excludedBusiness()
    {
        return $this->hasMany('App\Models\GymExcludedBusiness','gym_id','id');
    }//..... end of excludedBusiness() .....//
}
