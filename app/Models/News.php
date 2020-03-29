<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $table   = "news";
    protected $guarded = ['id'];

    /**
     * @param $date
     * @return false|string
     */
    public function getStartDateAttribute($date)
    {
        return $date != null ? date("d-m-Y H:i",strtotime($date)) : "";

    }//..... end of getStartDateAttribute() .....//

    /**
     * @param $date
     * @return false|string
     */
    public function getEndDateAttribute($date)
    {
        return $date != null ? date("d-m-Y H:i",strtotime($date)) : "";

    }//..... end of getEndDateAttribute() .....//

    /**
     * @param $query
     * @return mixed
     */
    public function scopeActivenews($query)
    {
        return $query->whereDate("news.end_date",">=",date("Y-m-d"));
    }//..... end of scopeActivenews() .....//
}