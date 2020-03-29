<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\File;

class FilesController extends Controller
{
    /**
     * Upload file.
     */
    public function uploadFile()
    {
        //return request()->file('file')->store('uploads');
        $extension = request()->file('file')->getClientOriginalExtension();
        if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            $name = 'uploads/' . uniqid() . '.' . $extension;
            Image::make(request()->file('file'))
                ->save(public_path($name));
            return $name;
        } else
            return Storage::disk('local')->put('uploads', request()->file('file'));
        /*return Storage::url( request()->file('file')->storeAs(
            'generalstoragemax', rand(111111,999999).".".request()->file('file')->getClientOriginalExtension()
        ));*/
    }//..... end of uploadFile() .....//


    public function uploadFileRecipe()
    {
        //return request()->file('file')->store('uploads');
        $extension = request()->file('file')->getClientOriginalExtension();
        if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            $name = 'uploads/' . uniqid() . '.' . $extension;
            Image::make(request()->file('file'))
                ->save(public_path($name));
            return $name;
        } else {
            $validator = Validator::make(request()->all(), [

                'file' => 'max:20480',
            ]);
            if ($validator->fails()) {
                return "max_size";
            }
            return Storage::disk('local')->put('uploads', request()->file('file'));
        }


        /*return Storage::url( request()->file('file')->storeAs(
            'generalstoragemax', rand(111111,999999).".".request()->file('file')->getClientOriginalExtension()
        ));*/

    }//..... end of uploadFile() .....//


    /**
     * @return string
     */
    public function deleteFile()
    {
        return \File::delete(public_path(request()->file)) ? "Deleted Successfully!" : "Failed To Delete.";
    }//..... end of deleteFile() .....//

    /**
     * @param $image
     * @param $path
     * @param bool $resize
     * @return bool|int
     * Upload base64 image file.
     */
    public function uploadBase64Image($image, $path, $resize = true)
    {
        if (!$image || $image == 'null') return false;


        $response = file_put_contents(public_path($path), base64_decode(substr($image, strpos($image, ",") + 1)));

        if ($response && $resize)
            Image::make(public_path($path))
                // resize the image to a width of 800 and constrain aspect ratio (auto height)
                ->resize(600, null, function ($constraint) {
                    $constraint->aspectRatio();
                })
                ->save(public_path($path));
        //->fit(200)

        return $response;
    }//..... end of uploadBase64Image() ......//



}//..... end of FilesController.
