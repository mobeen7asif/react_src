<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignTags extends Model
{
    protected $table = 'campaign_tags';
    public $timestamps = false;
    protected $fillable = ['campaign_id', 'tag_id'];
}
