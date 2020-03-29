<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beacon extends Model
{
    protected $table        = 'beacon_configurations';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function floor()
    {
        return $this->belongsTo('App\Models\LevelConfiguration','level_id','id');
    }//..... end of floor() .....//

    public function venue()
    {
        return $this->belongsTo(Venue::class,'venue_id','venue_id');
    }
}
