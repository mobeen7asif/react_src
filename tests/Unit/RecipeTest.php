<?php

namespace Tests\Unit;

use App\Http\Controllers\API\FilesController;
use App\Http\Controllers\API\RecipeController;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Tests\TestCase;

class RecipeTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * @test
     */
    public function recipe_should_be_created()
    {
        $recipe = $this->getRecipePayload();
        $this->app->extend(\Illuminate\Http\Request::class, function ($request) use($recipe) {
            return $request->replace($recipe);
        });

        $recipeController = new RecipeController();
        $response = $recipeController->saveRecipe(new FilesController());
        $this->assertEquals(true, $response['status']);
        $this->assertEquals("Recipe saved successfully.", $response['message']);
    }

    /** @test */
    public function recipe_list_should_be_loaded()
    {
        $this->createRecipe();

        $this->app->extend(\Illuminate\Http\Request::class, function ($request) {
            return $request->replace([
                'limit'     => 10,
                'offset'    => 0,
                'orderBy'   => "title",
                'orderType' => "asc",
                'search'    => "",
            ]);
        });

        $recipeController = new RecipeController();
        $response = $recipeController->getRecipesLists(resolve(Request::class));
        $this->assertEquals(true, $response['status']);
        $this->assertEquals(1, $response['total']);
        $this->assertEquals(1, count($response['data']));
    }

    /** @test */
    public function recipe_should_be_updated()
    {
        $this->createRecipe();
        $recipe = Recipe::first();
        $updatedData = $this->getRecipePayload();
        $updatedData['description'] = "Here is some test updated Description.";
        $updatedData['cook_time']   = "50 Minutes";
        $updatedData['editId']      = $recipe->id;
        $updatedData['method']      = "Difficult";
        $updatedData['prep_time']   = "10 Minutes";
        $updatedData['title']       = "Test Recipe updated";

        $this->app->extend(\Illuminate\Http\Request::class, function ($request) use($updatedData) {
            return $request->replace($updatedData);
        });

        $recipeController = new RecipeController();
        $response = $recipeController->saveRecipe(new FilesController());
        $this->assertEquals(true, $response['status']);
        $this->assertEquals("Recipe saved successfully.", $response['message']);
    }

    /** @test */
    public function recipe_should_be_deleted()
    {
        $this->createRecipe();
        $recipe = Recipe::first();
        $this->app->extend(\Illuminate\Http\Request::class, function ($request) use($recipe) {
            return $request->replace(['id' => $recipe->id]);
        });

        $recipeController = new RecipeController();
        $response = $recipeController->deleteRecipe();
        $this->assertEquals(true, $response['status']);
        $this->assertEquals("Recipe deleted successfully.", $response['message']);
    }

    private function getRecipePayload()
    {
        return [
            'category'      => ['id'=> 1, 'title'=> "Test Cat"],
            'cook_time'     => "5 Minutes",
            'description'   => "Here is some test Description.",
            'editId'        => 0,
            'end_date'      => "2019-01-17",
            'image'         => "",
            'ingredients'   => [['description' => "Test Ingredients One"], ['description' => "Test Ingredients Two"]],
            'is_featured'   => false,
            'method'        => "Normal",
            'prep_time'     => "5 Minutes",
            'preparations'  => [['description'=> "Test Preparation Time One."], ['description' => "Test Preparation Time Two"]],
            'serving'       => 4,
            'start_date'    => "2019-01-17",
            'tags'          => ["TestTag1", "TestTag2"],
            'title'         => "Test Recipe",
        ];
    }//..... end of getRecipePayload() .....//

    private function createRecipe()
    {
        $this->app->extend(\Illuminate\Http\Request::class, function ($request) {
            return $request->replace($this->getRecipePayload());
        });

        (new RecipeController())->saveRecipe(new FilesController());
    }//..... end of createRecipe() .....//
}
