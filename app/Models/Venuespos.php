<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Venuespos extends Model
{
    
    protected $table = "venues";
    protected $primaryKey = "id";
    protected $fillable = ['id','licenceNumber','venue_name','premises','address','locality','stateProvince','country','postalCode','contactName','telephone','facsimile','pager','mobile','email','system','created_at','updated_at','is_onBoard'];
    public $timestamps = false;
}
