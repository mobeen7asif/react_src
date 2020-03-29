<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCustomFieldData extends Model
{
    protected $table = "user_custom_field_data";
    protected $primaryKey = "id";
    protected $guarded = ["id"];

}
