<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lt_Transaction extends Model
{
    protected $table = "lt_transations";

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */


    function business()
    {
        return $this->hasOne(VenueShopCategory::class, 'shop_id', 'store_id');
    }
}
