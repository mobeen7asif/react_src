<?php

namespace App\Http\Controllers\API;

use App\Models\PointType;
use App\Models\Products;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    /**
     * @return mixed
     * Get Product list(id,name) for drop down list.
     */
    public function getProductsForDropDownList()
    {
        return Products::pluck('product_name', 'product_id');
    }//..... end  of getProductsForDropDownList() .....//

    /**
     * @return mixed
     * Get Point type list(id,name) for drop down list.
     */
    public function getPointTypesForDropDownList()
    {
        return PointType::pluck('description', 'id');
    }//..... end of getPointTypesForDropDownList() .....//
}//..... end of ProductController.
