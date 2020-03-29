<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SurveyQuestionAnswers extends Model
{
    protected $table = 'survey_question_answers';

    protected $fillable = ['user_id', 'edit_id','json'];

    public function user_details()
    {
        return $this->belongsTo("App\User",'user_id');
    }

//    protected $hidden = ['created_at','updated_at'];
}
