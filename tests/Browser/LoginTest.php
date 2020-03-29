<?php

namespace Tests\Browser;

use Tests\DuskTestCase;
use Laravel\Dusk\Browser;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class LoginTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     * @throws \Throwable
     */
    public function Login()
    {
        $this->browse(function (Browser $browser) {
            $browser->maximize()->visit('/')
                ->type('#email', 'dev@plutus.co')
                ->type('#password', '12345678')
                ->press('#submit')
                ->waitForText('Night cliff')
                ->assertSee('VENUE BY LOCATION');
        });
    }
}
