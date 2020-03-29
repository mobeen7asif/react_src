<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyFront extends Model
{
    protected $table = 'surveys_front';



    protected $fillable = ['title', 'description', 'json'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class,'survey_id','id');
    }

    protected static function boot ()
    {
        parent::boot();

        static::deleting(function($survey) {
            $survey->questions()->get()->each->delete();
        });
    }
    protected $hidden = ['created_at','updated_at'];
}
