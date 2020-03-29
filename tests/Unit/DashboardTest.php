<?php

namespace Tests\Unit;

use App\Http\Controllers\API\HostDashboardController;
use App\Http\Controllers\API\VenueController;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardTest extends TestCase
{
    public $company_id = 100;
    public $venue_id = 23020;

    /** @test */
    public function getPointmeUsers()
    {
        $dashboard = new HostDashboardController();
        $res = $dashboard->getPointmeUsers($this->venue_id);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function venueTotalCampaign()
    {
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'    => $this->venue_id,
        ]);
        $dashboard = new VenueController();
        $res = $dashboard->venueTotalCampaign($req);
        $this->assertEquals("true", $res['status']);
    }


}
