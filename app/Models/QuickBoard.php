<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuickBoard extends Model
{
    protected $primaryKey = "id";
    protected $table = "quick_boards";
    protected $guarded = ['id'];
    public $timestamps = false;
}
