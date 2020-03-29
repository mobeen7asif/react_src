<?php

namespace App\Http\Controllers;

use App\Contact;
use App\CsvData;
use App\Http\Requests\CsvImportRequest;
use App\User;
use App\Utility\ElasticsearchUtility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use mysql_xdevapi\Collection;

class ImportCsvController extends Controller
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

    public function upload_csv(Request $request)
    {
        $file = request()->file('file');
        if($file->getClientOriginalExtension() !="csv")
            return ["status"=>false,"message"=>"Please upload csv file"];

        $filename = "member_csv_".time().".".$file->getClientOriginalExtension();
        $res = $file->move(public_path(), $filename);

        return $this->importDataFromCsv($filename);

    }

    public function importDataFromCsv($fileName){

        $file_name = public_path()."/$fileName";

        if(!file_exists(public_path()."/$fileName"))
            return "File not exist $file_name";

        $allData = $this->get_file_data($file_name);
        return $allData;
    }

    public function uploadCsv()
    {


    }

    public function importDataFromFile(request $request)
    {
        $fileName = "user_data.csv";//$request->fileName;
        $file_name = public_path()."/$fileName";

        if(!file_exists(public_path()."/$fileName"))
            return "File not exist $file_name";

        $allData = $this->get_file_data($file_name);
        return $allData;

    }


    //    read file
    public function get_file_data($p_Filepath="")
    {
        $file = fopen($p_Filepath,"r");

        $i = 0;
        $count=0;
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

                if($i == 500){
                    $this->processData($data_array);
                    $data_array = array();
                    $i = 0;
                }

            }
            $i++;
            $count++;

        }
        $this->processData($data_array);
        return ["status"=>true,"message"=>"Total $count records are dumped to database"];
    }




    public function processData($allData)
    {

        $allDatas = collect($allData);

        $subset = $allDatas->map(function ($data) {
            return collect($data)
                ->only(['No', 'Name',"Email","phone","Pet Name","Segment"])
                ->all();
        });

        //$subset = array_reverse($subset->toArray());
        $user = User::orderBy("user_id","desc")->first();
        $count = empty($user) ? 1 : ($user->user_id) + 1;

        $dataCount = 0;
        $userCollection = collect([]);
        foreach ($subset as $key => $value){

            $custom_fields = collect([]);
            $firstName = $this->normalizeString($value['Name']);
            $lastName = "";
            $phone = $this->normalizeString($value['phone']);
            $email = $this->normalizeString($value['Email'] ) ?? "";
            $custom_fields["pet_name"] = $this->normalizeString($value['Pet Name'] ) ?? "";

            $datas = [
                'user_id'        =>$count,
                'user_first_name' => trim($firstName),
                'user_family_name' => trim($lastName),
                'company_id' => 1,
                'email' => $email,
                'password' => null,
                'user_mobile' => trim($phone),
                'user_avatar' => "",
                'soldi_id' => 0,
                'is_active' => 1,
                'activation_token' => rand(111111, 999999),
                'expiry_time' => "",
                'debug_mod' => 1,
                'device_token' => uniqid(true),
                'device_type' => 'ios',
                'postal_code' => "",
                'address' => "",
                'street_number' => "",
                'street_name' => "",
                'city' => "",
                'state' => "",
                'country' => "",
                'gender' =>  "",
                'default_venue' => "",
                'company_info' => "",
                'dob' =>  null,
                'user_lat' => "",
                'user_long' => "",
                'custom_fields' => collect($custom_fields),

            ];
            $count ++;
            $dataCount ++;
            array_push($this->usersData,$datas);
            $userCollection [] = (object) $datas;
            if($dataCount == 500){
                DB::table("users")->insert($this->usersData);
                (new ElasticsearchUtility())->bulkCsvUserInsert($userCollection);
                $this->usersData = [];
                $userCollection = collect([]);
                $dataCount = 0;
            }

        }

        DB::table("users")->insert($this->usersData);
        $d = (new ElasticsearchUtility())->bulkCsvUserInsert($userCollection);

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





}//.... end of class  .....//
