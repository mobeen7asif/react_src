<?php

namespace Tests\Unit;

use App\Http\Controllers\API\BeaconController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\VenueController;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VenueTest extends TestCase
{
    public $company_id = 100;
    public $venue_id = 295255;

    /** @test */
    public function getVenueInfo(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'     => $this->venue_id,
        ]);
        $venue = new VenueController();
        $res = $venue->getVenueInfo($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function saveAutoCheckOut(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'              => $this->venue_id,
            'autoChecked'           => 1,
            'beacon_condition'      => 1,
            'beacon_listining'      => 1,
            'minutes_condition'     => 1,
            'beacon_area'           => 2,
            'minutesData'           => 5,
        ]);
        $venue = new VenueController();
        $res = $venue->saveAutoCheckOut($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function saveAppColor(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'      => $this->venue_id,
            'background'    => "#ffffff",
        ]);
        $venue = new VenueController();
        $res = $venue->saveAppColor($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getCompanyVenues(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'company_id'      => $this->company_id,
        ]);
        $venue = new VenueController();
        $res = $venue->getCompanyVenues($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getFloorBeacons(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'id'      => 1,
        ]);
        $venue = new VenueController();
        $res = $venue->getFloorBeacons($req);
        $this->assertEquals("success", $res['message']);
    }

    /** @test */
    public function floorList(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'id'      => 1,
        ]);
        $campaign = new CampaignController();
        $campaign->floorList($req);
        $this->assertTrue(true);
    }

    /** @test */
    public function getBeaconsShortList(){
        $beacon = new BeaconController();
        $beacon->getBeaconsShortList($this->venue_id);
        $this->assertTrue(true);
    }

    /** @test */
    public function deleteBeaconData(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'id'      => 1,
        ]);
        $venue = new VenueController();
        $res = $venue->deleteBeaconData($req);
        $this->assertEquals("success", $res['message']);
    }

    /** @test */
    public function updateBeconInVenue(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'beacon_id'         => 1,
            'beacon_name'       => "Test Beacon",
            'becon_type'        => "Test Type",
            'uuid'              => "123456",
            'major'             => "5854",
            'minor'             => "85445",
            'x_coordinate'      => "13.0255",
            'y_coordinate'      => "15.000",
        ]);
        $venue = new VenueController();
        $res = $venue->updateBeconInVenue($req);
        $this->assertEquals("success", $res);
    }


    /** @test */
    public function deleteLevelData(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'         => $this->venue_id,
            'del_level_id'     => 1,

        ]);
        $venue = new VenueController();
        $res = $venue->deleteLevelData($req);
        $this->assertEquals("success", $res['status']);
    }

    /** @test */
    public function getVenueLevels(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'          => $this->venue_id,
            'level_id'          => 1,

        ]);
        $venue = new VenueController();
        $res = $venue->getVenueLevels($req);
        $this->assertEquals(1, $res['status']);
    }

    //************** we will take start from save-venue-level api next week  ******************//


}
