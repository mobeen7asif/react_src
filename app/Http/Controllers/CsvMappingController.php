<?php

namespace App\Http\Controllers;

use App\Contact;
use App\CsvData;
use App\Http\Requests\CsvImportRequest;
use App\Models\UserCustomField;
use App\Models\UserCustomFieldData;
use App\Models\Venue;
use App\User;
use App\Utility\ElasticsearchUtility;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use mysql_xdevapi\Collection;

class CsvMappingController extends Controller
{
    public $usersData = [];
    public $csvFields = [];
    public $mappingFields = [];
    public $globalCount = 0;
    public $numberOfChunk = 1;
    public $customFields=[];
    public $custom_drop_dwon = [];
    public $is_update_venue_custom_fields = false;
    public $last_insert_id = 1;

    public function __construct()
    {
        ini_set('memory_limit', '-1');
        set_time_limit(0);
    }



    public function custom_csv(Request $request)
    {
       // $allCustomFields = Venue::select("custom_fields")->where("venue_id",request()->venue_id)->first();

        /*if($allCustomFields)
            $this->customFields = collect(json_decode($allCustomFields->custom_fields));*/
        $fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();
        $fields = json_encode($fields);
        if ($fields)
            $this->customFields = collect(json_decode($fields));


        $this->setConfig("continue",0);
        /*$file = request()->file('file');
        if($file->getClientOriginalExtension() !="csv")
            return ["status"=>false,"message"=>"Please upload csv file"];*/

        //$filename = "member_csv_".time().".".$file->getClientOriginalExtension();
        $filename = "member_csv_1583902089.csv";
        //$file->move(public_path("members"), $filename);

        return $this->importDataFromCsv($filename);

    }

    public function importDataFromCsv($fileName){

        $file_name = public_path()."/members/$fileName";

        if(!file_exists($file_name))
            return "File not exist $file_name";

        $allData = $this->get_file_data($file_name);
        return $allData;
    }



    //    read file
    public function get_file_data($p_Filepath="")
    {
        try{
            $mappingFields = (json_decode(request()->mappingFields,true));
            $this->mappingFields = $mappingFields;
            foreach ($mappingFields as $key => $value){
                array_push($this->csvFields,$key);
            }

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

                            $temp[$head_array[$k]] = $data["{$k}"] ?? "key :$k and value :$head_array[$k]";
                        }
                        $data_array[] = $temp;
                    }

                    if($i == $this->numberOfChunk){ ///counter value
                        $this->processData($data_array);

                        $data_array = array();
                        $i = 0;
                    }

                }
                $i++;
                $count++;

            }

            $status = $this->processData($data_array);
            if($status['status'])
                $this->setConfig("done",$this->globalCount);

            return ["status"=>true,"count"=>$this->globalCount];
        }catch (\Exception $e){
            return ["method"=>"get_file_data","message"=>$e->getMessage()];
        }
    }




    public function processData($allData)
    {
        try{
            $id = DB::table('users')->orderBy('user_id', 'DESC')->first();
            if(!empty($id))
                $this->last_insert_id = $id->user_id;

            //============= create public variables dynamicaly for dropdown    ==========//
            foreach ($this->mappingFields as $mapKey => $mapValue) {
                $mapValue = explode("__", $mapValue);
                if(count($mapValue) > 1){
                    $mapValue = $mapValue[0];
                    $field_type = $this->getFieldType($mapValue);
                    if($field_type == "dropdown"){
                        $init_data = $this->customFields->where("field_name",$mapValue)->first();
                        // this is dynamic global variable for dropdowns to keep all csv values  //
                        $$mapValue = [];

                        if(!empty($init_data)){
                            //====== set initials value of dropdown ======//
                            $$mapValue = json_decode($init_data->drop_down_values,true);


                        }
                    }

                }
            }
            //============ end of dynamic custom drop down variables  ==================//

            $allDatas = collect($allData);

            $subset = $allDatas->map(function ($data) {
                return collect($data)
                    ->only($this->csvFields)  //['No', 'Name',"Email","phone","Pet Name","Segment"]
                    ->all();
            });

            $dataCount = 0;
            $userCollection = collect([]);
            foreach ($subset as $key => $value){
                $this->globalCount++;
                $datas = [
                    'user_first_name' => "",
                    'user_family_name' => "",
                    'company_id' => 1,
                    'email' => "",
                    'password' => null,
                    'user_mobile' => "",
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
                ];

                $custom_fields = collect([]);
                foreach ($this->mappingFields as $mapKey => $mapValue){

                    $mapValue = explode("__",$mapValue);
                    //it will be custom field if count is greater then 1 else table field
                    if(count($mapValue) > 1)
                    {

                        $mapValue = $mapValue[0];
                        $v = $datas[$mapValue] ?? "";
                        $field_type = $this->getFieldType($mapValue);
                        if( $field_type == "datetime" )
                        {
                            $date = str_replace("/","-",$value[$mapKey]);
                            if($date == "")
                                $date = date("d-m-Y H:i:s");

                            $d = date("d-m-Y H:i:s",strtotime($date));
                            $date_time = strtotime($d)*1000;
                            $custom_fields[$mapValue] = $date_time;
                        }
                        else if( $field_type == "date" )
                        {
                            $date = str_replace("/","-",$value[$mapKey]);
                            if($date == "")
                                $date = date("Y-m-d");

                            $c_date = date("Y-m-d",strtotime($date));
                            $custom_fields[$mapValue] = $c_date;
                        }
                        else if( $field_type == "bollean" )
                        {
                            $bool_value = (strtolower($value[$mapKey]) == "true" || $value[$mapKey] == 1) ? true : false;
                            $custom_fields[$mapValue] = $bool_value;
                        }
                        else if($field_type == "dropdown")
                        {

                            $d = explode(",",$value[$mapKey]);

                            $val = [];

                            foreach ($d as $key33=>$value33){
                                array_push($val,$value33);
                                array_push($$mapValue,["id"=>$value33,"label"=>$value33,"value"=>false]);
                            }

                            $custom_fields[$mapValue] = $val;
                            //===== keep unique value of drop down to manage memory exaustion  ====//
                            $unique = collect($$mapValue)->unique("id");
                            $uniqueValue = $unique->values()->all();
                            $$mapValue = $uniqueValue;
                            //=========== end of process    =============//
                        }
                        else
                        {
                            $custom_fields[$mapValue] = trim($v." ".$this->normalizeString($value[$mapKey]));
                        }

                    }//...... end of if which is processing custom fields  .....//
                    else
                    {
                        $mapValue = $mapValue[0];
                        $v = $datas[$mapValue] ?? "";
                        if($mapValue =="email"){
                            $datas[$mapValue] = trim($v." ".$value[$mapKey]);
                        }else{
                            $datas[$mapValue] = trim($v." ".$this->normalizeString($value[$mapKey]));
                        }

                        if($mapValue =="created_at" || $mapValue =="updated_at" || $mapValue =="deleted_at" || $mapValue =="dob")
                        {
                            $final_value = $this->checkDate($datas[$mapValue]);
                            $datas[$mapValue] = $final_value;
                        }
                    }//......... else part is used for processing of table fields and if part is used for custom fields processing   ......//
                }//..... end of foreach  ......//



                if(!empty($custom_fields)){
                    $this->updateMemberCustomFields($custom_fields);
                    //$datas['custom_fields'] = $custom_fields;

                }









                $dataCount ++;
                array_push($this->usersData,$datas);
                $userCollection [] = (object) $datas;
                $datas = [];

                if($dataCount == $this->numberOfChunk){ // counter value
                    //DB::table("users")->insert($this->usersData);
                    $id = DB::table('users')->orderBy('user_id', 'DESC')->first();
                    $last_id=1;
                    if(!empty($id))
                        $last_id = $id->user_id;

                    //$this->addUserToES($last_id);

                    $this->usersData = [];
                    $userCollection = collect([]);
                    $dataCount = 0;

                    $this->setConfig("continue",$this->globalCount);
                }

            }//..... end of foreach


            if($this->usersData){
                //DB::table("users")->insert($this->usersData);
                $id = DB::table('users')->orderBy('user_id', 'DESC')->first();
                $last_id=1;
                if(!empty($id))
                    $last_id = $id->user_id;

                //$this->addUserToES($last_id);

                $this->usersData = [];

            }

            //..... set custom field drop down values dynamicaly fromm csv    ......//
            foreach ($this->mappingFields as $mapKey => $mapValue) {
                $mapValue = explode("__", $mapValue);
                if(count($mapValue) > 1){
                    $mapValue = $mapValue[0];

                    $field_type = $this->getFieldType($mapValue);

                    if($field_type == "dropdown"){
                        $unique = collect($$mapValue)->unique("id");
                        $uniqueValue = $unique->values()->all();



                        foreach ($this->customFields as $customKey=> $customFieldvalue){
                            if($customFieldvalue->field_name == $mapValue){
                                $customFieldvalue->drop_down_values = $uniqueValue;
                                $this->is_update_venue_custom_fields = true;

                            }
                        }

                    }

                }
            }


            if($this->is_update_venue_custom_fields){
                //DB::table("venues")->where(["venue_id"=>request()->venue_id])->update(["custom_fields"=>json_encode($this->customFields)]);
                $this->updateCustomFields($this->customFields);
            }

            //============ end of dynamic custom drop down variables  ==================//
            return array(
                'status' => true,
                'count' => $this->globalCount,
                'total_drop_downs'=>$this->custom_drop_dwon
            );
        }catch (\Exception $e){
                return ["method"=>"processData","message"=>$e->getMessage()];
        }
    }

    public function checkDate($value_filter)
    {

        $value_filter = $date = str_replace("/","-",$value_filter);
        if(strlen($value_filter) <=5)
            return NULL;

        if (false === strtotime($value_filter)) {
            return NULL;
        }
        else {
            $d = date("Y-m-d H:i:s",strtotime($value_filter));
            return $d;
        }
    }

    public function normalizeString($str) {
        $str = str_replace(".","",$str);
        $str = str_replace("~","",$str);
        $str = str_replace("-","",$str);
        return trim($str);
    }

    public function getTableColumns()
    {
        $tableColumns = DB::getSchemaBuilder()->getColumnListing("users");
        sort($tableColumns);

        return ["tableColumns" => $tableColumns];
    }


    public function setConfig($status,$count)
    {
        $counter = DB::table("settings")->where(["type"=>"csv_counter"])->first();
        if(!empty($counter)){
            DB::table("settings")->where(["type"=>"csv_counter"])->update(["type"=>"csv_counter","field2"=>json_encode(["status"=>$status,"count"=>$count])]);
        }else{
            DB::table("settings")->insert(["type"=>"csv_counter","field2"=>json_encode(["status"=>$status,"count"=>$count])]);
        }


    }

    public function getFieldType($key)
    {
        $field = $this->customFields->where("field_name",$key)->first();
        if(isset($field->field_type))
            return $field->field_type;
        else
            return "not_found";
    }



    public function addUserToES($last_id)
    {
        $users = DB::table('users')->where(["user_type"=>"app"])->whereBetween('user_id', [$this->last_insert_id,($last_id)])->get();
        $res = (new ElasticsearchUtility())->bulkUserDataInsertNew($users);
        $this->last_insert_id = $last_id;
        return 'count : ' . $users->count();
    }


    public function updateMemberCustomFields($userCustomFields)
    {
        $tableUserCustomFields = [];

        foreach ($userCustomFields as $key => $value) {
            $signle_data = [];
            $field_type = $this->getFieldType($key);
            $field_id = $this->getFieldId($key);
            if($field_id !="not_found"){
                $signle_data['custom_field_id'] = $field_id;
                $signle_data['user_id'] = 2;
                $signle_data['created_at'] = date("Y-m-d H:i:s");
                $signle_data['updated_at'] = date("Y-m-d H:i:s");


                if ($field_type == "datetime") {
                    //$userCustomFields[$key] = strtotime($userCustomFields[$key]) * 1000;
                    $signle_data["value"] = strtotime($userCustomFields[$key]) * 1000;

                }else if($field_type == "dropdown"){
                    $signle_data["value"] = json_encode($value);

                }else{
                    $signle_data['value'] = $value;
                }


                array_push($tableUserCustomFields,$signle_data);
            }

        }


        /*foreach ($tableUserCustomFields as $key => $value){
            UserCustomFieldData::updateOrCreate(
                ["user_id" => $request->input('user_id'),"custom_field_id"=>$value["custom_field_id"]],
                ["user_id"=>$value["user_id"],"custom_field_id"=>$value["custom_field_id"],"value"=>$value["value"]]
            );
        }*/





        return ['status' => true, 'message' => 'Member updated successfully.'];

    }//--- End of updateMember() ---//

    public function getFieldId($key)
    {

        $field = $this->customFields->where("field_name", $key)->first();


        if (!empty($field))
            return $field->id;
        else
            return "not_found";
    }

    public function updateCustomFields($fields)
    {

        $data = [];

        foreach ($fields as $key => $value){
            $value = (array) $value;

            UserCustomField::updateOrCreate(
                ["field_unique_id"=>$value["field_unique_id"]],
                [
                    "company_id"=>request()->company_id,
                    "venue_id"=>request()->venue_id,
                    "field_name"=>$value["field_name"],
                    "field_label"=>$value["field_label"],
                    "field_type"=>$value["field_type"],
                    "segment_name"=>$value["segment_name"],
                    "search_name"=>$value["search_name"],
                    "field_unique_id"=>$value["field_unique_id"],
                    "drop_down_values"=> isset($value["drop_down_values"]) ? json_encode($value["drop_down_values"]) : NULL,
                    "is_multi_select"=> isset($value["is_multi_select"]) ? json_encode($value["is_multi_select"]) : NULL,
                    "created_at"=>date("Y-m-d H:i:s"),
                    "updated_at"=>date("Y-m-d H:i:s"),
                ]
            );
        }


    }







}//.... end of class  .....//
