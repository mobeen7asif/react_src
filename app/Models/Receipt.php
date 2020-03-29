<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receipt extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];
    public $timestamps=false;
}
