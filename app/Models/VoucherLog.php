<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoucherLog extends Model
{
    protected $table        = 'voucher_logs';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
}
