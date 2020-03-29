<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCustomField extends Model
{
    protected $table = "user_custom_field";
    protected $primaryKey = "id";
    protected $guarded = ["id"];


    /*public function getDropDownValuesAttribute()
    {
        if(!empty($this->drop_down_values))
            return json_decode($this->drop_down_values);
    }*/
}
