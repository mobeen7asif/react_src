<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VoucherUser extends Model
{
    use SoftDeletes;
    protected $table        = 'voucher_users';
    protected $primaryKey   = 'id';
    protected $guarded      = ['id'];
    protected $dates        = ['deleted_at'];

    public function UserVoucher(){
        return $this->hasMany(Voucher::class, 'id', 'voucher_id');
    }

    public function users()
    {
        return $this->hasMany(\App\User::class,'user_id','user_id');
    }
}
