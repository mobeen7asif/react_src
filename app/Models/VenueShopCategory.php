<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VenueShopCategory extends Model
{
    protected $table = "venue_category_shops";

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
}
