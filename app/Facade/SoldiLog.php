<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 6/21/2017
 * Time: 10:53 AM
 */

namespace App\Facade;


use Illuminate\Support\Facades\Facade;

class SoldiLog extends Facade
{
    protected static function getFacadeAccessor()
    {
        return "SoldiLogger";
    }
}