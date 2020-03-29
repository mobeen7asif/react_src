<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User_Card extends Model
{
    protected $table = "user_cards";
    protected $guarded = ['card_id'];
    protected $primaryKey = 'card_id';
    protected $fillable = ['user_id','card_no','last_digit','card_name','expiry_month','expiry_year','cvv','is_default','card_type','transactionid','expiry'];
}
