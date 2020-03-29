<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id"                    => $this->id,
            "recipe_category_id"    => $this->recipe_category_id,
            "title"                 => $this->title,
            "description"           => $this->description,
            "prep_time"             => $this->prep_time,
            "cook_time"             => $this->cook_time,
            "method"                => $this->method,
            "serving"               => $this->serving,
            "image"                 => $this->image ? asset('/'.$this->image) : '',
            "created_at"            => $this->created_at,
            "tags"                  => RecipeTagsResource::collection($this->tags),
            "reviews"               => RecipeReviewsResource::collection($this->reviews),
            "preparations"          => RecipePreparationsResource::collection($this->preparations),
            "ingredients"           => RecipeIngredientsResource::collection($this->ingredients),
            'offers'                => RecipeOfferResource::collection($this->offers)
        ];
    }
}
