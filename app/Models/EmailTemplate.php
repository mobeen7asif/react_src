<?php

namespace App\Models;

use http\Env\Request;
use Illuminate\Database\Eloquent\Model;


class EmailTemplate extends Model
{
    protected $table = "email_builder";
    protected $guarded = [];
    public $timestamps = true;


    /*public function getCreatedAtAttribute($value)
    {
        return date("d-m-Y",strtotime($value));
    }*/

    /*public function getDateAttribute($value)
    {
        return date("d-m-Y", strtotime($value));
    }*/

}
