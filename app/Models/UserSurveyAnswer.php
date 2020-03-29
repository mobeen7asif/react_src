<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSurveyAnswer extends Model
{
    protected $table = 'user_survey_answers';

    protected $fillable = ['user_id','survey_id','question_id','answer_id'];

}
