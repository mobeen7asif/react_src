<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTempPayment extends Model
{
   protected $table = 'user_temp_payments';

    public function uk_user()
    {
        return $this->belongsTo(\App\User::class,'user_id','kill_bill_id');
    }//..... end of uk_user() .....//

    public function ire_user()
    {
        return $this->belongsTo(\App\User::class,'user_id','kilbill_ire_id');
    }//..... end of ire_user() .....//
}
