<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyQuestion extends Model
{
    protected $table = 'survey_questions';

    protected $fillable = ['survey_id','question'];
    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class,'question_id','id');
    }

    public function survey()
    {
        return $this->belongsTo(SurveyFront::class,'survey_id','id');
    }


    protected static function boot ()
    {
        parent::boot();

        static::deleting(function($question) {
            $question->answers()->delete();
        });
    }
    protected $hidden = ['created_at','updated_at'];
}
