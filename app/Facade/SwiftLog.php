<?php

namespace App\Facade;
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 6/21/2017
 * Time: 11:23 AM
 */
class SwiftLog extends \Illuminate\Support\Facades\Facade{

    protected static function getFacadeAccessor()
    {
        return "SwiftLogger";
    }
}