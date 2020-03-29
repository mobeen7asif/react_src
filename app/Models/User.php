<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $connection = 'mysqlKnox';
    protected $table = "users";
    protected $primaryKey = "id";
    protected $fillable = ['id','username','first_name','last_name','venue_id'];
    public $timestamps = false;


}
