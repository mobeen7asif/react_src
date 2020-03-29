<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Recipe extends Model
{
    use SoftDeletes;
    protected $table = 'recipes';
    protected $guarded = ['id'];
    protected $hidden  = ['deleted_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tags()
    {
        return $this->hasMany(RecipeTags::class, 'recipe_id', 'id');
    }//..... end of tags() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviews()
    {
        return $this->hasMany(RecipeReviews::class, 'recipe_id', 'id');
    }//..... end of reviews() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function preparations()
    {
        return $this->hasMany(RecipePreparations::class, 'recipe_id', 'id');
    }//..... end of preparations() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ingredients()
    {
        return $this->hasMany(RecipeIngredients::class, 'recipe_id', 'id');
    }//..... end of ingredients() .....//

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offers()
    {
        return  $this->hasMany(RecipeOffer::class, 'recipe_id', 'id')->where('type', 'recipe');
    }//..... end of offers() .....//
}
