<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MerchantStore extends Model
{
    public $timestamps = false;
    protected $fillable = ['user_id', 'company_id', 'venue_id', 'business_id', 'business_name'];
}
