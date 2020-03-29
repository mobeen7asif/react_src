<?php

namespace App\Http\Controllers\API;

use App\Models\FileRepository;
use App\Models\ImageCategory;
use App\Models\ImageLibrary;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class MediaController extends Controller
{
    /*sonar constants*/
    const VENUE_ID                  = 'venue_id';
    const TITLE                     = 'title';
    const IMAGE_TITLE               = 'image_title';
    const IMAGE_ID                  = 'image_id';
    const CATEGORY_ID               = 'category_id';
    const FAILED                    = 'failed';
    const SUCCESS                   = 'success';
    const IMAGE                     = 'image';

    
    public function getMediaImages(Request $request)
    {
        $data[self::TITLE] = "Image Library";
        if ($request->search == "") {
            $data['venue_images'] = ImageLibrary::where(self::VENUE_ID, '=', $request->venue_id)->orderBy('id', 'DESC')->get();
        } else {
            $data['venue_images'] = ImageLibrary::where(self::VENUE_ID, '=', $request->venue_id)->where(self::TITLE, 'like', '%' . $request->search . '%')->orderBy(self::TITLE, 'ASC')->get();
        }

        return $data;

    }

    function saveimage(Request $request)
    {
        if ($request->image_id != 0) {
            $data = $request->all();
            $image_title = $data[self::IMAGE_TITLE];
            $image_id = $data[self::IMAGE_ID];
            $category_id = $data[self::CATEGORY_ID];
            $tags = str_replace(' ', '', $data['tags']);
            $id = ImageLibrary::where('id', $image_id)->update([self::TITLE => $image_title, 'description' => $image_title, self::CATEGORY_ID => $category_id, 'tag' => $tags]);
            $id ? self::SUCCESS : self::FAILED;

        } else {

            if ($request->hasFile(self::IMAGE)) {
                /** resize image  */
                $file = request()->file(self::IMAGE);
                $imageName = 'SP_' . time() . "." . $file->getClientOriginalExtension();

                Storage::put('generalstoragemax/thumbs/' . $imageName, Image::make($file)->resize(100, 100)->stream()->detach());
                //---- end of resize image saving  ---//
                /** original image saving  */

                $request->file(self::IMAGE)->storeAs(
                    'generalstoragemax', $imageName
                );
                /** end of original image saving  */
            }

            $data = $request->all();
            $venue = $data['select_venue'];
            if ($venue == 'Alveo') {
                $venue = 0;
            }

            $FileRepository = new FileRepository;
            $FileRepository->title = $data[self::IMAGE_TITLE];
            $FileRepository->description = $data[self::IMAGE_TITLE];
            $FileRepository->path = $imageName;
            $FileRepository->type = self::IMAGE;
            $FileRepository->venue_id = $venue;
            $FileRepository->category_id = $data[self::CATEGORY_ID];
            $FileRepository->tag = str_replace(' ', '', $data['tags']);
            $FileRepository->created_by = 2;
            $FileRepository->company_id = 2;
            $FileRepository->user_id = 2;
            $FileRepository->save();
            $last_inserted_id = $FileRepository->id;
            $last_inserted_id ? self::SUCCESS : self::FAILED;


        }


    }

    function edit_venues_image(Request $request)
    {
        $data = $request->all();
        $image_id = $data[self::IMAGE_ID];
        $image_detail = ImageLibrary::leftJoin("image_category", "file_repositories.category_id", "=", "image_category.id")
            ->where('file_repositories.id', '=', $image_id)->orderBy('file_repositories.id', 'DESC')->first();

        $tags = explode(',', $image_detail->tag);

        $data_2[self::IMAGE_TITLE] = $image_detail->title;
        $data_2['tag'] = $tags;
        $data_2['path'] = $image_detail->path;
        $data_2[self::TITLE] = $image_detail->title;
        $data_2[self::CATEGORY_ID] = $image_detail->category_id;

        return $data_2;

    }

    function delete_image(Request $request)
    {
        $data = $request->all();
        $image_id = $data[self::IMAGE_ID];
        $image = ImageLibrary::findOrFail($image_id);
        $image->delete();
        echo "true";
    }

    function getImageCategories(Request $request)
    {

        if ($request->search == "") {
            $r = ImageCategory::select("*")->get();
        } else {
            $r = ImageCategory::select("*")->where(self::TITLE, 'like', '%' . $request->search . '%')->get();

        }
        foreach ($r as $value) {
            $value->total_categories = $this->countCategoriesImages($value->id);
            $value->path = $this->getCategoryImage($value->id);
        }
        return $r;

    }

    function countCategoriesImages($category_id)
    {
        return ImageLibrary::where(self::CATEGORY_ID, "=", $category_id)->count();
    }

    function getCategoryImage($category_id)
    {
        $r = ImageLibrary::select("path")->where(self::CATEGORY_ID, "=", $category_id)->orderBy('id', 'DESC')->first();
        return $r['path'];
    }

    function saveCategory(Request $request)
    {
        if ($request->id == 0) {
            $cateogry = new ImageCategory;
            $cateogry->title = $request->title;
            $cateogry->save();
            return self::SUCCESS;
        } else {
            $id = ImageCategory::where('id', $request->id)->update([self::TITLE => $request->title]);
            return $id ? self::SUCCESS : self::FAILED;

        }
    }

}
