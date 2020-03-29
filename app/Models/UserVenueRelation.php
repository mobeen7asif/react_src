<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVenueRelation extends Model
{
    protected $table = "user_venue_relation";
    protected $primaryKey = "id";
    protected $guarded = ["id"];
    public $timestamps = false;
}
