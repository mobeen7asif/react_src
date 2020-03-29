<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyAnswer extends Model
{
    protected $table = 'survey_answers';
    protected $fillable = ['question_id','answer'];

    public function venue()
    {
        return $this->belongsTo(Venue::class,'venue_id','venue_id');
    }
    protected $hidden = ['created_at','updated_at'];
}
