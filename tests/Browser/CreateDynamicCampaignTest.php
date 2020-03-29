<?php

namespace Tests\Browser;

use Tests\DuskTestCase;
use Laravel\Dusk\Browser;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class CreateDynamicCampaignTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     * @throws \Throwable
     * @test
     */
    public function createDynamicCampaign()
    {
        $this->browse(function (Browser $browser) {
            $browser->maximize()->visit('/')
                ->type('#email', 'dev@plutus.co')
                ->type('#password', '12345678')
                ->press('#submit')
                ->waitForText('Night cliff')
                ->visit('#/campaigns/builder')
                ->click('.dynamicIcon')
                ->type('#dynamicCampaignName', 'Test Dynamic Campaign')
                ->type('#dynamicCampaignDescription', 'Test Description...')
                ->click('#dynamicCampaignContinueBtn')
                ->assertSee('SEGMENT TYPE')
                ->click('.iconSegmentSave')
                ->waitFor('.savedSegment')
                ->click('.savedSegment')
                ->click('.selecCompaignBttn')
                ->waitFor('#alertChannel')
                ->pause(4000)
                ->click('#alertChannel')
                ->pause(2000)
                ->click('@application')
                ->click('@application')
                ->pause(10000);
        });
    }

}
