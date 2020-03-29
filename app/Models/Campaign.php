<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use SoftDeletes;

    protected $table        = 'campaigns';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
    protected $dates        = ['deleted_at'];

    /**
     * @param $type
     * @return string
     */
    public function getTypeAttribute($type)
    {
        return ($type === 1) ? 'Set & Forget': ($type === 2 ? 'Proximity' : ($type == 3 ? 'Dynamic' : ($type === 4 ? 'Gamification' : ($type === 5 ? 'Virtual Voucher':''))));
    }//..... end of getTypeAttribute() .....//

    /**
     * @param $date
     * @return string
     */
    public function getCreatedAtAttribute($date)
    {
        return Carbon::parse($date)->format('d/m/Y');
    }//..... end of getCreatedDateAttribute() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tags()
    {
        return $this->belongsToMany(Tags::class, 'campaign_tags','campaign_id', 'tag_id');
    }//..... end of tags() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function games()
    {
        return $this->hasMany(Games::class, 'campaign_id', 'id');
    }//..... end of games() ......//
}//..... end of Campaign.
