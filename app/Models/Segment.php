<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Segment extends Model
{
    use SoftDeletes;
    protected $table        = 'segment';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
    protected $dates        = ['deleted_at'];
}
