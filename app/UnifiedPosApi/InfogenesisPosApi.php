<?php
/**
 * Created by PhpStorm.
 * User: elementary1
 * Date: 7/18/2017
 * Time: 10:52 AM
 */

namespace App\UnifiedPosApi;


use App\interfaces\PosApiInterface;
use Illuminate\Http\Request;

class InfogenesisPosApi implements PosApiInterface
{

    public function getStoreCategories($params = [])
    {
        // TODO: Implement getStoreCategories() method.
    }

    public function getStoreInfo($params = [])
    {
        // TODO: Implement getStoreInfo() method.
    }

    public function getAllProducts($params = [])
    {
        // TODO: Implement getAllProducts() method.
    }

    public function searchProducts($params = [])
    {
        // TODO: Implement searchProducts() method.
    }

    public function placeOrder(Request $request)
    {
        // TODO: Implement placeOrder() method.
    }
}