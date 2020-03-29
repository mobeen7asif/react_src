<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StampCompleted extends Model
{
    //stamps_completed

    protected $table        = 'stamps_completed';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
    public $timestamps = false;
}
