<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 6/21/2017
 * Time: 11:27 AM
 */

namespace App\Facade;


use Illuminate\Support\Facades\Facade;

class InfogenesisLog extends Facade
{
    protected static function getFacadeAccessor()
    {
        return "InfogenesisLogger";
    }
}