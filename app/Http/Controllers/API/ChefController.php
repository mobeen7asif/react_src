<?php

namespace App\Http\Controllers\API;

use App\Models\Chef;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ChefController extends Controller
{
    public function getChef(Request $request)
    {
        $search = $request->searchValue;
        $result = Chef::orderBy('id', 'DESC')->when($search, function ($query, $search) {
            return $query->where('first_name', 'like', '%' . $search . '%');
        });
        $data['data'] = $result->skip($request->offset)->take($request->limit)->get();
        $data['total'] = $result->count();
        return $data;
    }

    public function saveChef(Request $request, FilesController $filesController)
    {
        $data = ["first_name" => $request->first_name, "last_name" => $request->last_name, "descriptions" => $request->descriptions];
        $image = time() * rand() . ".png";
        if ($filesController->uploadBase64Image(request()->image, 'uploads/' . $image)) {
            $data['image'] = $image;
        }
        else if ($request->is_edit == 0) {
            $data['image'] = "default.jpg";
        }

        if ($request->is_edit == 0) {
            Chef::create($data);
        }
        else {
            Chef::where("id", $request->is_edit)->update($data);
        }

        return ["status" => true, "message" => "Chef information added successfully"];
    }

    public function deleteChef($id)
    {
        Chef::where(["id" => $id])->delete();
        return ["status" => true, "message" => "Record Deleted successfully "];
    }
}
