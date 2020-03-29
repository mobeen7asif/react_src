<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Charity extends Model
{
    use SoftDeletes;
    protected $table = "charity";
    protected $guarded = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function coins()
    {
        return $this->hasMany(UserCharityCoins::class, 'charity_id', 'id')->where('status', 'organization');
    }//..... coins() .....//

}
