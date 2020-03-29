<?php

namespace App\UnifiedDbModels;

use Illuminate\Database\Eloquent\Model;

class OrderDetails extends Model
{
    protected $table        =   'order_detail';
    protected $guarded      =   ['order_detail_id'];
    protected $primaryKey   =   "order_detail_id";
}
