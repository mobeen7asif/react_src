<?php

namespace Tests\Unit;

use App\Http\Controllers\Auth\WebLoginController;
use App\Models\Venue;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class WebUserTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * @test
     */
    public function web_user_should_login()
    {
        $this->createVenue();

        $this->app->extend(\Illuminate\Http\Request::class, function ($request) {
            return $request->replace([
                'email'     => "admin@wimpy.co",
                'password'  => "Plutus123"
            ]);
        });
        $webLoginController = new WebLoginController();
        $response = $webLoginController->login();
        $this->assertEquals(true, $response['status']);
        $this->assertEquals("Successfully Login", $response['message']);
        $this->assertArrayHasKey("venue_name", $response);
    }

    /** @test */
    public function web_user_should_not_logged_in()
    {
        $this->createVenue();

        $this->app->extend(\Illuminate\Http\Request::class, function ($request) {
            return $request->replace([
                'email'     => "admin@wimpy.co",
                'password'  => "Plutus1"
            ]);
        });
        $webLoginController = new WebLoginController();
        $response = $webLoginController->login();
        $this->assertEquals(false, $response['status']);
        $this->assertArrayHasKey('message', $response);
        $this->assertEquals("Email Address and/or Password incorrect. Please try again", $response['message']);
    }

    /**
     * Create Venue for testing purpose.
     */
    private function createVenue()
    {
        Venue::create([
            'company_id' => 100,
            'venue_id'  => rand(111111,999999),
            'venue_name' => 'Test Venue'
        ]);
    }//..... end of createVenue() .....//
}//..... end of class.