<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileRepository extends Model
{
    //
    protected $table = "file_repositories";

    protected $fillable = ['title','description','path','type','venue_id','tag','created_by','company_id'];
}
