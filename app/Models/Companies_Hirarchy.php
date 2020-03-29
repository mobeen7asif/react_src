<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Companies_Hirarchy extends Model
{

    protected $table = 'companies_hirarchy';

    public $timestamps = false;

    protected $fillable = [
        'ip_address', 'username', 'first_name', 'last_name', 'email', 'password', 'created_on',
        'active', 'company_id', 'salt'
    ];
}
