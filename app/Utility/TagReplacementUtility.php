<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 2/27/19
 * Time: 9:59 AM
 */

namespace App\Utility;


use App\Models\EmailTemplate;
use App\models\User;
use App\Models\Venue;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TagReplacementUtility
{
    private $demographicData = [];
    private $refferedUser = [];

    private $userData = [];
    private $VenueId;
    private $UserID;
    private $selected_venue;
    private $custom_fields;
    private $custom_fields_values;
    private $template_tags;




    public function generateTagText($message,$venue_id,$user_id,$template_id=0)
    {

        $this->VenueId = $venue_id;
        $this->UserID = $user_id;
        $fields = DB::table("user_custom_field")->where('venue_id', request()->venue_id)->get();



        if ($fields)
            $this->customFields = $fields;


        $this->userData = DB::table("users")->where(["user_id"=>$user_id])->get();


        $this->refferedUser = DB::table("users")->where(["referal_by" => $this->userData[0]->referal_by ?? 0])->get();

        $selected_venue =$this->selected_venue= Venue::whereVenueId($this->VenueId)->get()->toArray();
        $this->custom_fields = $this->customFields;


        $this->custom_fields_values = DB::table("user_custom_field_data")->where(["user_id"=>$user_id])->get();

        $template = EmailTemplate::whereId($template_id)->first();

        if(!empty($template)){
            $this->template_tags = (!empty($template->tag_values)) ? json_decode($template->tag_values,true) : [];
        }




        $str = $message;



        try {
            $re = '/\|(.*?)\|/';

            preg_match_all($re, $str, $matches, PREG_SET_ORDER, 0);
            $indexName = Config::get('constant.ES_INDEX_BASENAME');




            if (is_array($matches) && count($matches) > 0) {
                foreach ($matches as $key => $rs) {
                    if (is_array($rs) && isset($rs[0])) {
                        // to Check if Tag is POS OR Barrel with POS:POSID
                        $chk = explode(":", $rs[0]);

                        $field_name = str_replace("|" , "",$rs[0] );


                        $is_template_tag = $this->template_tags[$field_name] ?? false;
                        if($is_template_tag){
                            $str = str_replace($chk[0], $is_template_tag ?? "", $str);
                            continue;
                        }


                        $getESType = $this->getESTypeByTagName($chk[0]);

                        $getFieldDetail = $this->getFieldNameByTag(str_replace('|', "", $chk[0]));


                        if (empty($getFieldDetail)) continue;

                        if (empty($getFieldDetail)) continue;

                        if ($getESType == 'venue') {

                            if ($selected_venue) {

                                $str = str_replace($chk[0], $selected_venue[0][$getFieldDetail["field"]] ?? "", $str);

                            }

                            continue;
                        }


                        if($getESType == "custom_fields"){
                            $field_type = $this->getFieldType($getFieldDetail["field"]);
                            $field_id = $this->getFieldId($getFieldDetail["field"]);




                            $replace_value = "";
                            if($field_type == "bollean"){
                                $replace_value = ($this->getUserCustomFieldValue($this->UserID,$field_id) == true) ? "true" : "false";
                            }else if($field_type == "date"){

                                $replace_value = $this->getUserCustomFieldValue($this->UserID,$field_id);


                                //$replace_value = $this->custom_fields[$getFieldDetail["field"]];
                                $replace_value = date("d M Y",strtotime($replace_value));
                            }
                            else if($field_type == "datetime"){
                                $replace_value = $this->getUserCustomFieldValue($this->UserID,$field_id);

                                //$replace_value = $this->custom_fields[$getFieldDetail["field"]];
                                $seconds = $replace_value / 1000;

                                $replace_value = date("d M Y H:i:s",($seconds));

                            }
                            else if($field_type == "dropdown"){
                                $value_data = $this->getUserCustomFieldValue($this->UserID,$field_id);
                                if(!empty($value_data)){
                                    $value_data = json_decode($value_data,true);
                                }

                                //$value_data = ($this->custom_fields[$getFieldDetail["field"]]);

                                foreach ($value_data as $key33 => $value33 ){

                                    $replace_value = $replace_value .$value33.", ";
                                }


                            }else{
                                $replace_value = $this->getUserCustomFieldValue($this->UserID,$field_id);
                            }

                            if(!empty($replace_value))
                                $str = str_replace($chk[0], $replace_value ?? "", $str);
                        }

                        $this->getESDataByQuery($indexName, $getESType);

                        $getData = $this->getReplaceTagValue($getFieldDetail,$getESType);



                        if ($getData) {
                            $str = str_replace($chk[0], $getData, $str);
                        }else{
                            $str = str_replace($chk[0], "", $str);
                        }

                    }
                }

                return $str;
            } else {
                return $str;
            }
        } catch (\Exception $e) {
            dd($e->getMessage());
            return $str;
        }
    }

    function getESTypeByTagName($tag)
    {

        if ($tag == '|NameTitle|' || $tag == '|FirstName|' || $tag == '|MiddleInitial|' || $tag == '|OtherName|' ||
            $tag == '|MembershipId|' || $tag == '|ExpiryDatetime|' || $tag == '|Id|' || $tag == '|MembershipTypeId|'
            || $tag == '|Status|' || $tag == '|RatingGradeId|' || $tag == '|HomeTelephone|'
            || $tag == '|Mobile|' || $tag == '|Country|' || $tag == '|PostalCode|' || $tag == '|Locality|'
            || $tag == '|PostalAddress1|' || $tag == '|ResPostalCode|' || $tag == '|ResLocality|'
            || $tag == '|ResStateProvince|' || $tag == '|LastName|'
            || $tag == '|ResAddress1|' || $tag == '|WorkTelephone|' || $tag == '|CreationDatetime|' || $tag == '|Email|' || $tag == '|ContactOnEmail|' || $tag == '|ContactOnMobile|' || $tag == '|ContactOnMail|' ||$tag =='|Facebook|' || $tag =='|Twitter|' || $tag =='|Instagram|'
            || $tag == '|RefreeName|' || $tag == '|ReferredUser|' || $tag == '|ReferralCode|'|| $tag == '|ActivationCode|'|| $tag == '|date|'|| $tag == '|month|'|| $tag == '|year|'|| $tag == '|VenueNameDesign|'
            || $tag =='|VenueAddressDesign|'|| $tag =='|discount|'|| $tag =='|DiscountPrice|'|| $tag =='|Discount|'

        ) {
            return 'demographic';
        } else if ($tag == '|Balance|') {
            return 'account_balance';
        }else if ($tag == '|ReferralCode|') {
            return 'referral_code';
        }else if ($tag == '|ActivationCode|') {
            return 'activation_code'; // routing query
        }else if ($tag == '|RefreeName|' || $tag == '|ReferredUser|') {
            return 'persona_fname'; // routing query
        } else if ($tag == '|POS|') {
            return 'pos_transaction_item'; // routing query
        } else if ($tag == '|PointTypeId|') {
            return 'point_type_summary'; // routing query
        } else if ($tag == '|BarrelDraw|') {
            return 'barrel_draw'; // routing query
        } else if ($tag == '|TicketCount|') {
            return 'barreldraw_ticket_summary'; // routing query
        } else if ($tag == '|MycashExpiry|' || $tag == '|MycashBalance|') {
            return 'cash_balance'; // routing query
        } else if ($tag == '|LastGamePlay|') {
            return 'member_egm_transaction'; // routing query
        } else if ($tag == '|LastPOSEntry|') {
            return 'pos_sale'; // routing query
        } else if ($tag == '|LastKioskEntry|') {
            return 'kiosk_transaction'; // routing query
        } else if ($tag == '|LastVisit|') {
            return 'visitation'; // routing query
        }/*else if(Str::is('|custom_*', $tag)){
            foreach ($this->custom_fields as $key => $value){
                if ($tag == "|custom_$key|") {

                    return $key; // routing query

                }
            }
        }*/

        if(Str::is('|custom_*', $tag)){
            return "custom_fields";
        }

        return 'venue';
    }//...... end of function getESTypeByTagName() .....//


    //......  get filed name by tag ......//
    function getFieldNameByTag($key)
    {

        $array = [
            'NameTitle'             => ['field' => 'name_title', 'fieldType' => 'string'],
            'FirstName'             => ['field' => 'persona_fname', 'fieldType' => 'string'],
            'LastName'              => ['field' => 'persona_lname', 'fieldType' => 'string'],
            'RefreeName'              => ['field' => 'persona_fname', 'fieldType' => 'string'],
            'ReferredUser'          => ['field' => 'persona_fname', 'fieldType' => 'string'],
            'ReferralCode'          => ['field' => 'referral_code', 'fieldType' => 'string'],
            'ActivationCode'          => ['field' => 'activation_code', 'fieldType' => 'string'],
            'MiddleInitial'         => ['field' => 'middle_initial', 'fieldType' => 'string'],
            'OtherName'             => ['field' => 'other_name', 'fieldType' => 'string'],

            'Balance'               => ['field' => 'balance', 'fieldType' => 'integer'],
            'MembershipId'          => ['field' => 'membership_id', 'fieldType' => 'integer'],
            'year'          => ['field' => 'year', 'fieldType' => 'integer'],
            'month'          => ['field' => 'month', 'fieldType' => 'integer'],
            'date'          => ['field' => 'date', 'fieldType' => 'integer'],
            'ExpiryDatetime'        => ['field' => 'expiry_datetime', 'fieldType' => 'date'],
            'Id'                    => ['field' => '_routing', 'fieldType' => 'integer'],
            'MembershipTypeId'      => ['field' => 'membership_type_id', 'fieldType' => 'integer'],
            'Status'                => ['field' => 'status', 'fieldType' => 'string'],
            'RatingGradeId'         => ['field' => 'rating_grade_id', 'fieldType' => 'integer'],
            'PointTypeId'           => ['field' => 'point_type_id', 'fieldType' => 'integer'],
            'TicketCount'           => ['field' => 'ticket_count', 'fieldType' => 'integer'],

            'Email'                 => ['field' => 'persona_email', 'fieldType' => 'string'],
            'HomeTelephone'         => ['field' => 'phone_numbers', 'fieldType' => 'integer'],
            'Mobile'                => ['field' => 'phone_numbers', 'fieldType' => 'integer'],
            'ContactOnEmail'        => ['field' => 'email_subscribed_flag', 'fieldType' => 'string'],
            'ContactOnMobile'       => ['field' => 'sms_subscribed_flag', 'fieldType' => 'string'],
            'ContactOnMail'         => ['field' => 'mail_subscribed_flag', 'fieldType' => 'string'],
            'Country'               => ['field' => 'residential_address.country', 'fieldType' => 'string'],
            'PostalCode'            => ['field' => 'postal_address.postal_code', 'fieldType' => 'integer'],
            'Locality'              => ['field' => 'residential_address.suburb', 'fieldType' => 'string'],
            'PostalAddress1'        => ['field' => 'postal_address.address_1', 'fieldType' => 'string'],
            'ResPostalCode'         => ['field' => 'residential_address.postal_code', 'fieldType' => 'string'],
            'ResLocality'           => ['field' => 'residential_address.suburb', 'fieldType' => 'string'],
            'ResStateProvince'      => ['field' => 'residential_address.state', 'fieldType' => 'string'],
            'ResAddress1'           => ['field' => 'residential_address.address_1', 'fieldType' => 'string'],
            'WorkTelephone'         => ['field' => 'phone_numbers.work_phone', 'fieldType' => 'integer'],

            'VenueAddress'          => ['field' => 'address', 'fieldType' => 'string'],
            'VenueName'             => ['field' => 'venue_name', 'fieldType' => 'string'],
            'VenuePhoneNo'          => ['field' => 'telephone', 'fieldType' => 'integer'],
            'VenuePhoneNumber'      => ['field' => 'telephone', 'fieldType' => 'integer'],

            'LastVisit'             => ['field' => 'date_added', 'fieldType' => 'date'],
            'LastPOSEntry'          => ['field' => 'sale_datetime', 'fieldType' => 'date'],
            'LastKioskEntry'        => ['field' => 'entry_datetime', 'fieldType' => 'date'],
            'LastGamePlay'          => ['field' => 'transaction_datetime', 'fieldType' => 'date'],
            'CreationDatetime'      => ['field' => 'creation_datetime', 'fieldType' => 'date'],

            'MycashExpiry'          => ['field' => 'latest_transaction_date_time', 'fieldType' => 'string'],
            'MycashBalance'         => ['field' => 'balance', 'fieldType' => 'integer'],

            'POS'                   => ['field' => 'item_description', 'fieldType' => 'string'],
            'BarrelDraw'            => ['field' => 'description', 'fieldType' => 'string'],


            'VenueNameDesign'       => ['field' => 'venue_name', 'fieldType' => 'string'],
            'VenueAddressDesign'    => ['field' => 'address', 'fieldType' => 'string'],
            'discount'              => ['field' => 'discount', 'fieldType' => 'string'],
            'DiscountPrice'         => ['field' => 'DiscountPrice', 'fieldType' => 'string'],
            'Discount'              => ['field' => 'Discount', 'fieldType' => 'string'],

            'facebook'              => ['field' => 'facebook_id', 'fieldType' => 'string'],
            'twitter'               => ['field' => 'twitter_id', 'fieldType' => 'string'],
            'instagram'             => ['field' => 'instagram_id', 'fieldType' => 'string']
        ];

        foreach ($this->custom_fields as $key2 => $value2){
            $array["custom_".$value2->field_name] = ['field' => $value2->field_name, 'fieldType' => 'string'];
        }




        return (array_key_exists($key, $array)) ? $array[$key] : '';
    }//...... End of function getFieldNameByTag()  ......//

    //...... get user information from elastic search ......//
    function getEsDataByQuery($indexName,$getESType){

        if(empty($this->demographicData)){
            $q = [
                "query"=> [
                    "bool"=>[
                        "must"=>[
                            [
                                "term"=>[
                                    "persona_id"=> [
                                        "value"=> $this->UserID
                                    ]
                                ]
                            ],
                            [
                                "term"=>[
                                    "custom_doc_type"=> "demographic"
                                ]
                            ]

                        ]
                    ]
                ]
            ];

            $this->demographicData = ElasticsearchUtility::getSource($indexName,$q);

        }

        return $this->demographicData;
    }//.....  end of function getEsDataByQuery()  ......//

    //..... set different type of user data global to Optimize performance  .....//
    private function getReplaceTagValue($getFieldDetail,$getESType){
        $field = $getFieldDetail["field"];

        if($getESType == "demographic"){
            return  $this->getDemoGraphicData($field);
        }else{
            return "";
        }

    }//......  end of function getReplaceTagValue()  ......//


    //.... return  user demographic data by field name to replace it in message string  .....//
    private function getDemoGraphicData($field){

        switch ($field){

            case "phone_numbers":
                return $this->demographicData[0]['devices']['mobile'] ?? false;

            case "telephone":
                return $this->selected_venue[0]['telephone'] ?? false;
            case "refferedUser":
                return $this->refferedUser[0]->user_first_name ?? "";
            case "activation_code":
                return rand(1111,9999);
            case "date":
                return date('d');
            case "month":
                return date('M');
            case "year":
                return date('Y');
            case "venue_name":
                return $this->selected_venue[0]['venue_name'];
            case "address":
                return $this->selected_venue[0]['address'];
            case "discount":
                return rand(1,100);
            case "DiscountPrice":
                return rand(1,100);
            case "Discount":
                return rand(1,100);
            default:
                return $this->demographicData[0][$field] ?? false;
        }
    }//..... end of function getDemoGraphicData  .....//


    public function getFieldType($key)
    {
        $field = $this->customFields->where("field_name",$key)->first();

        if(isset($field->field_type))
            return $field->field_type;
        else
            return "not_found";
    }

    public function getFieldId($key)
    {
        $field = $this->customFields->where("field_name",$key)->first();

        if(isset($field->field_type))
            return $field->id;
        else
            return "not_found";
    }

    public function getUserCustomFieldValue($user_id,$field_id){

        $value = $this->custom_fields_values
            ->where("user_id",$user_id)
            ->where("custom_field_id",$field_id)->first();


        return !empty($value) ? $value->value : "";
    }

}