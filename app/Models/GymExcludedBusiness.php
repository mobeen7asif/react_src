<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GymExcludedBusiness extends Model
{
    protected $table    = 'gym_excluded_business';
    public $timestamps  = false;
    protected $fillable = ['gym_id', 'business_id', 'business_name', 'company_id'];
}
