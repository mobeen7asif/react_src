<?php

namespace App\Utility;

use Faker\Factory as Faker;
use function Symfony\Component\Debug\Tests\testHeader;

class DataProducer
{
    private $faker;
    private $system;
    private $status;
    public function __construct()
    {
        $this->faker  = Faker::create();
        $this->system = ['Retail','Details','Restaurants'];
        $this->status=["ACT", "CAN", "DEC", "EXG", "EXF", "EXN", "EXP", "SUS"];
    }

    /**
     * @param $venueid
     * @return array
     */
    public function generatePatron($i)
    {
        $source                 = ['soldi','watchtower'];
        $disable                = ['yes','no'];
        $gender                 = ["M", "F"];
        $sourceData             = $this->faker->randomElements($source);
        $statusArray            = $this->faker->randomElements($this->status);
        $disableArray           = $this->faker->randomElements($disable);
        $genderArray            = $this->faker->randomElements($gender);
        $languages              = ['Urdu','English','Persian','Hebrew','Hindi','Polish','Bulgarian','Bangla','Uzbek','Korean','Italian','urkish'];
        $languageData           =  $this->faker->randomElements($languages);
        $marital                = ['Single','Married','Divorced'];
        $maritalData            =  $this->faker->randomElements($marital);
        $pointType              = ['Gold','Silver','Diamond','bronze'];
        $pointTypeArray         = $this->faker->randomElements($pointType);
        $state                  = ['New South Wales','Victoria','Queensland','Tasmania','South Australia','Western Australia','Northern Territory','Australian Capital Territory'];
        $stateData              = $this->faker->randomElements($state);
        $postCode               = ['200','221','800','801','804','810','811','812','813','814','815','820','821','822','828','829'];
        $postCodeData           = $this->faker->randomElements($postCode);
        $locale                 = ['Barton', 'Darwin', 'Parap', 'Alawa', 'Brinkin','Casuarina','Jingili','Muirhead','Nightcliff','Rapid Creek','Wagaman'];
        $localeData             = $this->faker->randomElements($locale);
        $location               = ['Cafe','Club','Shops','Resturants'];
        $memberShipData         = ['Gold','Silver','Platinum','Bronze'];
        $mermberStatus          = ['Active', 'Cancelled', 'Deceased', 'Excluded Gaming', 'Excluded Full Exclusion', 'Excluded Non-gaming', 'Expired', 'Suspended'];
        $memberShipDataArray    = $this->faker->randomElements($memberShipData);
        $mermberStatusArray    = $this->faker->randomElements($mermberStatus);
        $locationData           = $this->faker->randomElements($location);
        $systemData             = $this->faker->randomElements($this->system);
        return [
            'custom_doc_type'                            =>  config('constant.demographic'),
            'name_title'                                  => $this->faker->title,
            'persona_fname'                               => $this->faker->firstName,
            'middle_initial'                              => $this->faker->title,
            'middle_name'                                 => $this->faker->lastName,
            'persona_lname'                               => $this->faker->lastName,
            'other_name'                                  => $this->faker->firstName,
            'gender'                                      => $genderArray[0],
            'date_of_birth'                               => $this->faker->date('Y-m-d H:i:s'),
            'disabilities'                                => 'No',
            'nationality'                                 => $this->faker->country,
            'no_of_children'                              => mt_rand(1, 3),
            "profession"                                  => $this->faker->jobTitle,
            "industry"                                    => $this->faker->company,
            'locality'                                    => $this->faker->city,
            'residential_address'                         =>  ['address_1' => $this->faker->streetAddress, 'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0], 'state' => $stateData[0], 'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20, 50), 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2, 20)],
            'postal_address'                              => ['address_1' => $this->faker->streetAddress, 'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0], 'state' => $stateData[0], 'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20, 50), 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2, 20)],
            'work_address'                                =>   ['address_1' => $this->faker->streetAddress, 'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0], 'state' => $stateData[0], 'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20, 50), 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2, 20)],
            'shipping_address'                            =>  ['address_1' => $this->faker->streetAddress, 'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0], 'state' => $stateData[0], 'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20, 50), 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2, 20)],
            'job_title'                                   => $this->faker->jobTitle,
            'employer_name'                               => $this->faker->firstName().' '. $this->faker->lastName,
            'phone_numbers'                               => ['home_phone' => $this->faker->phoneNumber, 'mobile' => $this->faker->numberBetween(), 'work_phone' => $this->faker->numberBetween()],
            'emails'                                      => ["work_emails" => $this->faker->companyEmail, "personal_emails" => $this->faker->email],
            'languages'                                   => 'English',
            'date_added'                                  => date("Y-m-d H:i:s"),
            'excluded'                                    => true,
            'expiry_datetime'                             => date("Y-m-d H:i:s"),
            'membership_id'                               => $i,
            'membership_type_id'                          => $i,
            'membership_type_name'                        => $memberShipDataArray[0],
            'membership_type_description'                 => $this->faker->text(300),
            'card_id'                                     => mt_rand(1234, 567823),
            'cashless_user'                               => mt_rand(0, 1),
            'rating_grade_id'                             => mt_rand(1, 10),
            'rating_grade_name'                           =>  mt_rand(1234, 567823),
            'rating_grade_description'                    => $this->faker->text(300),
            'status'                                      => $mermberStatusArray[0],
            'creation_datetime'                           => date("Y-m-d H:i:s"),
            'last_modified_datetime'                      => date("Y-m-d H:i:s"),
            'suspend_start_datetime'                      => date("Y-m-d H:i:s"),
            'suspend_end_datetime'                        => date("Y-m-d H:i:s"),
            'persona_email'                               => $this->faker->email,
            'persona_status'                              => $mermberStatusArray[0],
            'venue_id'                                    => mt_rand(0, 100),
            'is_gamer'                                    => true,
            'is_mycash_user'                              => true,
            'mycash_balance'                              => mt_rand(0, 100),
            'date_added'                                  => date("Y-m-d H:i:s"),
            "is_pointme_user"                             => true,
            "is_pointme_user_club"                        => true,
            "last_pointme_used"                           => date("Y-m-d H:i:s"),
            "last_pointme_voucher_used"                   => date("Y-m-d H:i:s"),
            'email_subscribed_flag'                       => true,
            'mail_subscribed_flag'                        => true,
            'sms_subscribed_flag'                         => true,
            'is_pointme_links'                            => true,
            'is_pointme_notifications'                    => true,
            'persona_id'                                  => $i
        ];
    }//--- End of generatPatron() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generatePosData($id,$venueId)
    {
        $location      = ['Cafe','Club','Shops','Resturants'];
        $systemArray   = $this->faker->randomElements($this->system );
        $locationArray = $this->faker->randomElements($location);
        return [
                    'id'               => $this->faker->numberBetween(1000,20000),
                    'locationId'       => (string)$this->faker->numberBetween(1,100),
                    'locationName'     => $locationArray[0],
                    //'patronId'         => $this->faker->numberBetween(1000,20000),
                    'patronId'         => $id,
                    'saleDatetime'     => $this->faker->iso8601($max = 'now'),
                    'saleId'           => (string)$this->faker->numberBetween(1,20),
                    'saleTotal'        => $this->faker->numberBetween(1000,20000),
                    'system'           => $systemArray[0],
                    'venueId'          => $venueId,

        ];
    }//--- End of generatePosData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generatePointTypeData($id,$venueId)
    {

        $systemArray = $this->faker->randomElements($this->system );
        return [
                        //'patronId'                  => $this->faker->numberBetween(1, 1000),
                        'patronId'                  => $id,
                        'period'                    => $this->faker->numberBetween(1, 1000),
                        'periodStartDatetime'       => $this->faker->iso8601($max = 'now'),
                        'amount'                    => $this->faker->numberBetween(1,1000),
                        'system'                    => $systemArray[0],
                        'pointTypeId'               => $this->faker->numberBetween(1,1000),
                        'venueId'                   => $venueId,
        ];
    }//--- End Of generatePointTypeData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generatePointData($id,$venueId)
    {
        $pointType = ['Gold','Silver','Diamond','bronze'];
        $pointTypeArray = $this->faker->randomElements($pointType);
        $systemArray = $this->faker->randomElements($this->system );
        return [
                        'description'        => $pointTypeArray[0],
                        'firstPeriod'        => $this->faker->iso8601($max = 'now'),
                        //'id'                 => $this->faker->numberBetween(1, 1000),
                        'id'                 => $id,
                        'oneMonetaryUnit'    => $this->faker->numberBetween(1, 1000),
                        'periodType'         => $this->faker->numberBetween(1, 1000),
                        'agingPeriods'       => $this->faker->numberBetween(1, 1000),
                        'system'             => $systemArray[0],
                        'venueId'            => $venueId,
            ];
    }//--- End of generatePointData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateAccountBalance($id,$venueId)
    {

        $systemArray = $this->faker->randomElements($this->system );
        return [
                        //'patronId'       => $this->faker->numberBetween(1, 1000),
                        'patronId'       => $id,
                        'pointTypeId'    => $this->faker->numberBetween(1, 1000),
                        'balance'        => $this->faker->numberBetween(1, 1000),
                        'system'         => $systemArray[0],
                        'type'           => 'account_balance',
                        'venueId'       => $venueId,
        ];
    }//--- End of generateAccountBalance() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateCardSessionSummary($id,$venueId)
    {
        $systemArray = $this->faker->randomElements($this->system );
        return[
                    //'patronId'      => $this->faker->numberBetween(1, 1000),
                    'patronId'      => $id,
                    'spend'         => $this->faker->numberBetween(1, 1000),
                    'startDatetime' => $this->faker->iso8601($max = 'now'),
                    'system'        => $systemArray[0],
                    'turnover'      => $this->faker->numberBetween(1, 1000),
                    'type'          => 'card_session_summary',
                    'venueId'       => $venueId,
                    'egm'           => $this->faker->numberBetween(0,10),
                    'cardId'        => $this->faker->numberBetween(1, 1000),
                    'jackpotWins'   => $this->faker->numberBetween(1, 1000),
                    'wins'          => $this->faker->numberBetween(1, 1000),
        ];

    }//--- End of generateCardSessionSummary() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateBarrelDraw($id,$venueId)
    {
        $systemArray = $this->faker->randomElements($this->system );
        return [
                    //'id'            => $this->faker->numberBetween(1, 1000),
                    'id'            => $id,
                    'startTime'     => $this->faker->iso8601($max = 'now'),
                    'stateFlag'     => $systemArray[0],
                    'stopTime'      => $this->faker->iso8601($max = 'now'),
                    'system'        => $systemArray[0],
                    'venueId'       => $venueId
        ];
    }//--- End of  generateBarrelDraw() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateEgmTransaction($id,$venueId)
    {
        $systemArray = $this->faker->randomElements($this->system );
        $tran=['Credit','Debit'];
        $transaction=$this->faker->randomElements($tran);
        return [
                    //'patronId'              => $this->faker->numberBetween(1, 1000),
                    'patronId'              => $id,
                    'system'                => $systemArray[0],
                    'ticketNumber'          => $this->faker->numberBetween(1,100),
                    'transactionDatetime'   => $this->faker->iso8601($max = 'now'),
                    'transactionType'       => $transaction[0],
                    'type'                  => 'member_egm_transaction',
                    'venueId'               => $venueId,
                    'amount'                => $this->faker->numberBetween(1, 1000),
        ];

    }//--- End of generateEgmTransaction() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateMemberShipType($venueId)
    {
        $membership=['Strategic Members','Enterprise Members','Solutions Members','Associate Members','Committer Members'];
        $membershipDescription=$this->faker->randomElements($membership);
        $systemArray = $this->faker->randomElements($this->system );
        return[
                        'description'  => $membershipDescription[0],
                        'expiryDate'   => $this->faker->iso8601($max = 'now'),
                        'id'           => $this->faker->numberBetween(1, 1000),
                        'system'       => $systemArray[0],
                        'venueId'      => $venueId,
        ];

    }//--- End of generateMemberShipType() ---//

    /**
     * @return array
     */
    public function generatePosTransactionalType($id,$venueid)
    {
        $items=['books','cell phone','camera','handicamp'];
        $systemArray = $this->faker->randomElements($this->system);
        $itemArray   =  $this->faker->randomElements($items);
        return [
                        //'patronId'          => $this->faker->numberBetween(1, 1000),
                        'patronId'          => $id,
                        'pos_location'      => $systemArray[0],
                        'itemCode'          => (string)$this->faker->numberBetween(1, 1000),
                        'itemDescription'   => $itemArray[0],
                        'saleId'            => (string)$this->faker->numberBetween(1, 1000),
                        'system'            => $systemArray[0],
                        'venueId'           => $venueid,
        ];
    }//--- End of generatePosTransactionalType() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateTransactional($venueId)
    {
        $items          = ['books','cell phone','camera','handicamp'];
        $itemArray      =  $this->faker->randomElements($items);
        $systemArray    = $this->faker->randomElements($this->system);
        $tax            = ['Income tax','Payroll tax','Property tax','Consumption tax','GST'];
        $taxArray       = $this->faker->randomElements($tax);
        return [
                        'amount'              => $this->faker->numberBetween(1, 1000),
                        'category'            => $itemArray[0],
                        'currency'            => $this->faker->currencyCode,
                        'data_source'         => $systemArray[0],
                        'date_added'          => $this->faker->iso8601($max = 'now'),
                        'discount'            => $this->faker->numberBetween(1, 1000),
                        'payment_by'          => $this->faker->company,
                        'points'              => $this->faker->numberBetween(1,1000),
                        'product_color'       => $this->faker->colorName,
                        'product_des'         => $this->faker->words($nb = 3, $asText = false)[0],
                        'product_name'        => $this->faker->words($nb = 3, $asText = false)[0],
                        'product_qty'         => $this->faker->numberBetween(1,1000),
                        'product_type'        => $this->faker->words($nb = 3, $asText = false)[0],
                        'product_unit_price'  => $this->faker->numberBetween(1,1000),
                        'product_weight'      => $this->faker->numberBetween(1,1000),
                        'sub_product_name'    => $this->faker->words($nb = 3, $asText = false)[0],
                        'tax_type'            => $taxArray[0],
                        'tax_value'           => $this->faker->numberBetween(1,1000),
                        'tran_date'           => $this->faker->iso8601($max = 'now'),
                        'venue'               => $venueId,
                        'voucher'             => $this->faker->words($nb = 3, $asText = false)[0],
                        'voucher_value'       => $this->faker->numberBetween(1,1000),
        ];
    }//--- End of generateTransactional() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateBarrelWinnerData($id,$venueId)
    {
        $systemArray    = $this->faker->randomElements($this->system);
        return [
                        'barrelDrawId'    =>  $this->faker->numberBetween(1, 1000),
                        'claimed'         =>  $this->faker->words($nb = 3, $asText = false)[0],
                        'drawnDatetime'   =>  $this->faker->iso8601($max = 'now'),
                        'id'              =>  $this->faker->uuid,
                        //'patronId'        =>  $this->faker->numberBetween(1, 1000),
                        'patronId'        =>  $id,
                        'system'          =>  $systemArray[0],
                        'ticketNumber'    =>  $this->faker->numberBetween(1,1000),
                        'venueId'         =>  $venueId,
        ];

    }//--- End of generateBarrelWinnerData() ---//

    public function generateCashBalanceData($id,$venueId)
    {

        $statusArray    = $this->faker->randomElements($this->status);
        $systemArray    = $this->faker->randomElements($this->system);
        return [
                        'balance'                           => $this->faker->numberBetween(1, 1000),
                        'id'                                => $this->faker->uuid,
                        'latestTransactionDatetime'         => $this->faker->iso8601($max = 'now'),
                        //'patronId'                          => $this->faker->numberBetween(1, 1000),
                        'patronId'                          => $id,
                        'status'                            => $statusArray [0],
                        'system'                            => $systemArray[0],
                        'venueId'                           => $venueId,
        ];
    }

    /**
     * @param $venueId
     * @return array
     */
    public function generateRatingGradeData($id,$venueId)
    {
        $systemArray    = $this->faker->randomElements($this->system);
        return [
                    //'id'              =>   $this->faker->numberBetween(1, 1000),
                    'id'              =>   $id,
                    'maximumLevel'    =>   $this->faker->numberBetween(1,100),
                    'minimumLevel'    =>   $this->faker->numberBetween(1,100),
                    'system'          =>   $systemArray[0],
                    'description'     =>   $systemArray[0],
                    'venueId'         =>   $venueId,
        ];
    }//---- End of generateRatingGradeData() ----//

    /**
     * @param $venueId
     * @return array
     */
    public function generateDemographicData($venueId)
    {
        $source         = ['soldi','watchtower'];
        $disable        = ['yes','no'];
        $gender         = ["M", "F"];
        $sourceData     = $this->faker->randomElements($source);
        $statusArray    = $this->faker->randomElements($this->status);
        $disableArray   = $this->faker->randomElements($disable);
        $genderArray    = $this->faker->randomElements($gender);
        $languages      = ['Urdu','English','Persian','Hebrew','Hindi','Polish','Bulgarian','Bangla','Uzbek','Korean','Italian','urkish'];
        $languageData   =  $this->faker->randomElements($languages);
        $marital        = ['Single','Married','Divorced'];
        $maritalData    =  $this->faker->randomElements($marital);
        $pointType      = ['Gold','Silver','Diamond','bronze'];
        $pointTypeArray = $this->faker->randomElements($pointType);
        $state          = ['New South Wales','Victoria','Queensland','Tasmania','South Australia','Western Australia','Northern Territory','Australian Capital Territory'];
        $stateData      = $this->faker->randomElements($state);
        $postCode       = ['200','221','800','801','804','810','811','812','813','814','815','820','821','822','828','829'];
        $postCodeData   = $this->faker->randomElements($postCode);
        $locale         = ['Barton', 'Darwin', 'Parap', 'Alawa', 'Brinkin','Casuarina','Jingili','Muirhead','Nightcliff','Rapid Creek','Wagaman'];
        $localeData     = $this->faker->randomElements($locale);
        $location       = ['Cafe','Club','Shops','Resturants'];
        $locationData   = $this->faker->randomElements($location);
        return [
                   'venueId'                     => $this->faker->creditCardNumber(),
                   'card_id'                     => $this->faker->creditCardNumber(),
                   'cashless_user'               => $this->faker->creditCardNumber(),
                   'creation_css_site_id'        => $this->faker->creditCardNumber(),
                   'creation_datetime'           => $this->faker->iso8601($max = 'now'),
                   'data_source'                 => $sourceData[0],
                   'date_added'                  => $this->faker->iso8601($max = 'now'),
                   'date_of_birth'               => date('Y-m-d H:i:s', strtotime( '-'.mt_rand(1000,40000).' days')),
                   'disabilities'                => $disableArray[0],
                   'driving_licence_no'          => $this->faker->swiftBicNumber,
                   'emails'                      => ['personal_emails' => $this->faker->email ,'work_emails' => $this->faker->companyEmail],
                   'employer_name'               => $this->faker->company,
                   'excluded'                    => $this->faker->boolean(50),
                   'expiry_datetime'             => $this->faker->iso8601($max = 'now'),
                   'gender'                      => $genderArray[0],
                   'height'                      => $this->faker->randomDigit,
                   'id'                          => $this->faker->numberBetween(1, 1000),
                   'id_no'                       => $this->faker->numberBetween(1, 1000),
                   'industry'                    => $this->faker->company,
                   'job_title'                   => $this->faker->jobTitle,
                   'languages'                   => $languageData[0],
                   'last_modified_datetime'      => $this->faker->iso8601($max = 'now'),
                   'life_cycle'                  => $this->faker->languageCode,
                   'locality'                    => $this->faker->locale,
                   'marital_status'              => $maritalData[0],
                   'measurement'                 => ['waist' => $this->faker->numberBetween(1, 1000)],
                   'medicare_no'                 => $this->faker->swiftBicNumber,
                   'membership_id'               => $this->faker->uuid,
                   'membership_type_description' => $this->faker->uuid,
                   'membership_type_id'          => $this->faker->uuid,
                   'membership_type_name'        => $pointTypeArray[0],
                   'middle_initial'              => $this->faker->lastName,
                   'middle_name'                 => $this->faker->lastName,
                   'name_title'                  => $this->faker->title(),
                   'nationality'                 => $this->faker->country,
                   'no_of_children'              => $this->faker->numberBetween(1,4),
                   'no_of_grand_children'        => $this->faker->numberBetween(1,4),
                   'other_name'                  => $this->faker->lastName,
                   'passport_no'                 => $this->faker->creditCardNumber,
                   'persona_fname'               => $this->faker->firstName(),
                   'persona_lname'               => $this->faker->lastName,
                   'phone_numbers'               => [ 'home_phone' => $this->faker->phoneNumber ,'mobile' => $this->faker->numberBetween(), 'work_phone' => $this->faker->numberBetween() ],
                   'postal_address'              => [ 'address_1' => $this->faker->streetAddress ,'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0] , 'state' => $stateData[0],'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20,50) , 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2,20)],
                   'source'                      => $locationData[0],
                   'status'                      => $statusArray[0],
                   'suspend_end_datetime'        => $this->faker->iso8601($max = 'now'),
                   'suspend_start_datetime'      => $this->faker->iso8601($max = 'now'),
                   'work_address'                => [ 'address_1' => $this->faker->streetAddress ,'address_2' => $this->faker->address, 'country' => 'Australia', 'postal_code' => $postCodeData[0], 'residential_locality' => $localeData[0] , 'state' => $stateData[0],'street_name' => $this->faker->streetAddress, 'street_no' => $this->faker->numberBetween(20,50) , 'suburb' => $localeData[0], 'unit_no' => $this->faker->numberBetween(2,20)],
        ];
    }//--- End Of generateDemographicData() ---//

    /**
     * @return array
     */
    public function generateMeberData()
    {
        $statusArray    = $this->faker->randomElements($this->status);
        $pointType      = ['Gold','Silver','Diamond','bronze'];
        $pointTypeArray = $this->faker->randomElements($pointType);
        return [
                    'creation_datetime'  => $this->faker->iso8601($max = 'now'),
                    'expiry_datetime'    => $this->faker->iso8601($max = 'now'),
                    'membership_id'      => $this->faker->numberBetween(1, 1000),
                    'membership_number'  => $this->faker->numberBetween(1, 1000),
                    'membership_status'  => $statusArray[0],
                    'membership_title'   => $pointTypeArray[0],
                    'point_balance'      => $this->faker->numberBetween(1, 1000),
        ];

    }//--- End of generateMeberData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateVisitationData($venueId)
    {
        $source         = ['soldi','watchtower'];
        $sourceData     = $this->faker->randomElements($source);
        return [
            'date_added'         => $this->faker->iso8601($max = 'now'),
            'expiry_datetime'    => $this->faker->iso8601($max = 'now'),
            'id'                 => $this->faker->uuid,
            'patron_id'          => $this->faker->uuid,
            'source'             => $sourceData[0],
            'type'               => 'Visitation',
            'venue_id'           => $venueId,
            'visit'              => $this->faker->numberBetween(1, 1000),
        ];
    }//--- End of generateVisitationData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateBarrelTicketsData($id,$venueId)
    {
        $source         = ['soldi','watchtower'];
        $sourceData     = $this->faker->randomElements($source);
        return [
                        'barrelDrawId'            => $this->faker->numberBetween(1, 1000),
                        //'patronId'                => $this->faker->numberBetween(1, 1000),
                        'patronId'                => $id,
                        'lastUpdatedDatetime'     => $this->faker->iso8601($max = 'now'),
                        'system'                  => $sourceData[0],
                        'ticketCount'             => $this->faker->numberBetween(1,100),
                        'type'                    => 'barreldraw_ticket_summary',
                        'venueId'                => $venueId,
        ];
    }//--- End Of generateBarrelTicketsData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generatePosItemsData($id,$venueId)
    {
        $source         = ['soldi','watchtower'];
        $sourceData     = $this->faker->randomElements($source);
        return [
                        'id'                => $this->faker->numberBetween(1, 1000),
                        //'patronId'          => $$this->faker->numberBetween(1, 1000),
                        'patronId'          => $id,
                        'itemCode'          => (string)$this->faker->numberBetween(1, 1000),
                        'itemDescription'   => $sourceData[0],
                        'saleId'            => (string)$this->faker->numberBetween(1, 1000),
                        'system'            => $sourceData[0],
                        'venueId'           =>  $venueId,
        ];

    }//--- End Of generatePosItemsData() ---//

    /**
     * @param $venueId
     * @return array
     */
    public function generateAccountTransData($id,$venueId)
    {
        return [
                        'amount'                => $this->faker->numberBetween(1, 1000),
                        'cardId'                => $this->faker->numberBetween(1, 1000),
                        //'patronId'              => $this->faker->numberBetween(1, 1000),
                        'patronId'              => $id,
                        'pointTypeId'           => $this->faker->numberBetween(1, 1000),
                        'startDateTime'         => $this->faker->iso8601($max = 'now'),
                        'transactionTypeId'     => $this->faker->numberBetween(1, 1000),
                        'venueId'               => $venueId,
        ];
    }//---- End Of generateAccountTransData() ----//

    /**
     * @param int $patronID
     * @return array
     * Generate Fake Sale Item.
     */
    public function generateSaleItem($patronID = 0)
    {
        return [
            'sale_id'           => rand(111111, 999999),
            'sale_item'         => $this->faker->word,
            'persona_id'        => $patronID,
            'custom_doc_type'   => config('constant.sale'),
            'sale_datetime'     => now()->subDays(rand(1,20))->format("Y-m-d H:i:s"),
            'sale_total'        => rand(111111, 999999)
        ];
    }//..... end of generateSaleItem() .....//

    /**
     * @param int $i
     * @return array
     */
    public function generatePersonaDevices( $i = 0 )
    {
        $deviceType             = [ 'ios', 'android' ];
        $deviceArray            = $this->faker->randomElements($deviceType);
        return [
            "persona_device_token"     => $this->faker->sha256,
            "persona_device_type"      =>  $deviceArray[0],
            "custom_doc_type"          =>  "persona_devices",
            "debug_mod"                =>  0,
            "persona_id"               =>  $i
        ];
    }//--- End of generatePersonaDevices() ---//


    public function generateWifiPatron($request, $i)
    {
        return [
            'custom_doc_type'                            =>  config('constant.demographic'),
            'name_title'                                  => $request->username,
            'persona_fname'                               => $request->firstname,
            'persona_lname'                               => $request->lastname,
            'persona_email'                               => $request->email,
            'gender'                                      => 'M',
            'date_of_birth'                               => $request->dob,
            'postal_address'                              => ['postal_code' => $request->post_code],
            'phone_numbers'                               => ['mobile' => $request->mobile],
            'date_added'                                  => date("Y-m-d H:i:s"),
            'excluded'                                    => true,
            'expiry_datetime'                             => date("Y-m-d H:i:s"),
            'membership_id'                               => $i,
            'membership_type_id'                          => $i,
            'creation_datetime'                           => date("Y-m-d H:i:s"),
            'last_modified_datetime'                      => date("Y-m-d H:i:s"),
            'suspend_start_datetime'                      => date("Y-m-d H:i:s"),
            'suspend_end_datetime'                        => date("Y-m-d H:i:s"),
            'date_added'                                  => date("Y-m-d H:i:s"),
            "is_pointme_user"                             => true,
            "is_pointme_user_club"                        => true,
            "last_pointme_used"                           => date("Y-m-d H:i:s"),
            "last_pointme_voucher_used"                   => date("Y-m-d H:i:s"),
            'email_subscribed_flag'                       => true,
            'mail_subscribed_flag'                        => true,
            'sms_subscribed_flag'                         => true,
            'is_pointme_links'                            => true,
            'is_pointme_notifications'                    => true,
            'persona_id'                                  => $i
        ];
    }//--- End of generatPatron() ---//
}