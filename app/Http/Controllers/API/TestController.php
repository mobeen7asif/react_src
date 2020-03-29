<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;


class TestController extends Controller
{
    private $gObj;
    private $games;
    private $userMissions;
    private $segmentation;
    public $missionsFound;
    public $qrCodeIsCompetition;

    public function __construct()
    {


    }//..... end of __construct() .....//

    public function php()
    {
        dd("php testingasdasd....");
    }


}