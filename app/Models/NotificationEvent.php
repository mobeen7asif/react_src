<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class NotificationEvent extends Model
{

    protected $table = "notification_events";
    protected $primaryKey = "id";
    protected $guarded = ["id"];
    public $timestamps = false;


}
