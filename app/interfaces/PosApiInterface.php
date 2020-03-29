<?php

namespace App\interfaces;

use Illuminate\Http\Request;

/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 10:54 AM
 */

interface PosApiInterface{

    public function getStoreCategories( $params = [] );
    public function getStoreInfo( $params = [] );
    public function getAllProducts( $params = [] );
    public function searchProducts( $params = [] );
    public function placeOrder( Request $request );
}