<?php

namespace App\Http\Controllers;

use App\Contact;
use App\CsvData;
use App\Http\Requests\CsvImportRequest;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
    public $usersData = [];
    public function __construct()
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);
    }

    public function getImportAjax()
    {
        return view('csv_upload');
    }

    public function getImport()
    {
        return view('csv_upload');
        //return view('import');
    }

    public function ajax_import_pre_agents(request $request)
    {
        $fileName = "user_data.csv";//$request->fileName;
        $file_name = public_path()."/$fileName";

        if(!file_exists(public_path()."/$fileName"))
            return "File not exist $file_name";


        $allData = $this->get_file_data($file_name);
        $allDatas = collect($allData);
        $subset = $allDatas->map(function ($data) {
            return collect($data)
                ->only(['storeName', 'Address',"Status","email","First Name","Last Name","phone"])
                ->all();
        });
        //$subset = array_reverse($subset->toArray());

        $dataCount = 0;
        foreach ($subset as $key => $value){
            if($value['Address'] !="")
                $address = explode(",",$value['Address']);
            else
                $address = [];

            $count = count($address);
            $storeName = $value['storeName'];
            $country = $address[$count - 1] ?? "";
            $state   = $address[$count -2] ?? "";
            $postcode   = $address[$count - 3] ?? "";
            $f_address = "";

            for($i=0; $i<($count - 3); $i++)
                $f_address = $f_address.$address[$i]." ";

            $activity = $this->normalizeString($value['Status']);
            $firstName = $this->normalizeString($value['First Name']);
            $lastName = Str::before($value['Last Name'], '-');
            $phone = $this->normalizeString($value['phone']);
            $email = $this->normalizeString($value['email'] ) ?? "";
            $datas = [
                "address"           => $f_address,
                "company_id"        => 129, //swimmart company id
                "is_active"         => 1,
                "user_is_active"    => 1,
                "created_at"        => date("Y-m-d H:i:s"),
                "email"             => $email,
                "activity"          => trim($activity),
                "postal_code"       => trim($postcode),
                "store_name"        => trim($storeName),
                "state"             => trim($state),
                "country"           => trim($country),
                "user_first_name"   => trim($firstName),
                "user_family_name"  => trim($lastName),
                "contact_no"        => trim($phone)
            ];
            $dataCount ++;
            array_push($this->usersData,$datas);
            if($dataCount == 1000){
                DB::table("users")->insert($this->usersData);
                $this->usersData = [];
                $dataCount = 0;
            }

        }
        DB::table("users")->insert($this->usersData);
        return array(
            'status' => true,
            'total' => count($allData)
        );
    }


    public function normalizeString($str) {
        $str = str_replace(".","",$str);
        $str = str_replace("~","",$str);
        $str = str_replace("-","",$str);
        return trim($str);
    }

    public function saveFile(request $request){
        $arr = array('status' => true, 'data' => ["file_name"=>"user_data.csv","total_records"=>0,"records_added"=>0]);
        return json_encode($arr);

        /*$fname = time() . '_' . basename($_FILES['csv_file']['name']);
        $fname = str_replace(" ", "_", $fname);
        $fname = str_replace("%", "_", $fname);

        $tmp = explode('.', $_FILES['csv_file']['name']);
        $name_ext = end($tmp);

        $name = str_replace('.' . $name_ext, '', basename($_FILES['csv_file']['name']));

        $uploaddir =  url('/users/');

        $uploadfile = $uploaddir . $fname;

        $ext = $request->file('csv_file')->getClientOriginalExtension();
        $fileUpload = $this->uploadFile($request->file('csv_file'),'users/','csv','csv_'.str_random(10).'.'.$ext);

        if ($fileUpload) {

            $file_path = $uploaddir.$fileUpload;
            $remote_path = url('/users/'.$fileUpload);
            $file_data = $this->get_file_data($remote_path);

            $input['file_name'] = $fileUpload;
            $input['total_records'] = count($file_data);
            $input['records_added'] = 0;

            $arr = array('status' => true, 'data' => $input);
            return json_encode($arr);

        }else{
            $arr = array('status' => false, 'data' => '');
            return json_encode($arr);
        }*/
    }

    //    read file
    public function get_file_data($p_Filepath="")
    {
        $file = fopen($p_Filepath,"r");

        $i = 0;
        $head_array = array();
        $data_array = array();
        while(! feof($file))
        {
            if($i == 0){
                $head_array = fgetcsv($file);
            }else{
                $temp = array();
                $data = fgetcsv($file);
                if($data !=''){
                    for($k = 0; $k <count($head_array); $k++){
                        $temp[$head_array[$k]] = $data[$k];
                    }
                    $data_array[] = $temp;
                }
            }
            $i++;
        }
        return $data_array;
    }

    //    upload file on server
    public function uploadFile($input_file,$destinationPath,$file_type = 'image',$fileName){
        if($file_type == 'image'){
            $img = Image::make($input_file->getRealPath());
            $img->resize(100, 100, function ($constraint) {
                $constraint->aspectRatio();
            })->save($destinationPath.'/thumbs/'.$fileName);
        }
        chmod($destinationPath, 0777);  //changed to add the zero
        $input_file->move($destinationPath, $fileName); // uploading file to given path
        return $fileName;
    }





}//.... end of class  .....//
