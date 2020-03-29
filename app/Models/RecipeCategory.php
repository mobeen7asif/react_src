<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecipeCategory extends Model
{
    use SoftDeletes;
    protected $table = 'recipe_category';
    protected $guarded = ['id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'recipe_category_id', 'id')->limit(15);
    }//..... end of recipes() .....//
}
