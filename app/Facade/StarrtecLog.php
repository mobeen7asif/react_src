<?php

namespace App\Facade;
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 6/21/2017
 * Time: 10:44 AM
 */
class StarrtecLog extends \Illuminate\Support\Facades\Facade
{

    protected static function getFacadeAccessor()
    {
        return "StarrtecLogger";
    }
}