<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 6/21/2017
 * Time: 11:25 AM
 */

namespace App\Facade;


use Illuminate\Support\Facades\Facade;

class KountaLog extends Facade
{
    protected static function getFacadeAccessor()
    {
        return "KountaLogger";
    }
}