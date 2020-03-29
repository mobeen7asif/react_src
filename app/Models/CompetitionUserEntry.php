<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompetitionUserEntry extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
    protected $table = 'competition_user_entries';
}
