<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutoOrderPlacement extends Model
{
   protected $table ='auto_order_placement';
   protected $guarded = ['id'];
  public $timestamps = false;
}
