<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreInformation extends Model
{
    //
    protected $table = "store_information";
    protected $primaryKey = "id";
    public $timestamps = false;
    protected $fillable = ['company_id' , 'store_id' , 'store_name' , 'store_type' , 'stall_no' , 'products' , 'created_at' , 'updated_at' , 'status'];
}
