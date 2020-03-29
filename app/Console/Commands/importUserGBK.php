<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class importUserGBK extends Command
{
    protected $db_records = [];
    protected $email_hash = [];
    protected $email_dups = 0;

    # Define CSV file formats
    #
    protected $csv_formats = [
        'member_loyalty' => [
            'User Id','Name','Email',"Date of Birth","Loyalty Campaign","Redeemed","Expires","Expired"
        ],
        'member_trans' => [
            'User Id','Name','Email',"Date of Birth","Number of Successful Transactions"
        ],
        'member' => [
            'Customer Name','Email',"Date of Birth"
        ],
        'staff' => [
            'Status','EmployeeNumber','Firstnames','Surname','Location','PersonalEmail'
        ],
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engage:importUserGBK ' .
        '{--file1= : CSV file to import}' .
        '{--file2= : CSV file to import}' .
        '{--format1= : [member_loyalty|member|staff]}' .
        '{--format2= : [member_loyalty|member|staff]}' .
        '{--limit= : record limit}' .
        '{--debug : print debug}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'CSV file import tool for Engage user data (GBK)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        #print_r($this->arguments()) . "\n";
        #print_r($this->options()) . "\n";

        #$args = $this->arguments();
        $opts = $this->options();
        #$argc = count($args) + count($opts);

        if (!$this->option('file1')) {
            print "Usage: $this->signature\n";
            exit;
        }
        
        $company_id = \Config::get('constant.COMPANY_ID');
        if (!is_numeric($company_id)) {
            print "ERROR: Unable to determine company ID from environment\n";
            exit;
        }

        $file_name = $this->option('file1');
        if(!file_exists($file_name)) {
            print "ERROR: File does not exist: " . $file_name . "\n";
            return(1);
        }

        $format = $this->option('format1');
        if(!in_array($format, array_keys($this->csv_formats))) {
            print "ERROR: Format '$format' is not supported\n";
            return(1);
        }

        if (isset($opts['file2'])) {
            $file_name2 = $this->option('file2');
            if(!file_exists($file_name2)) {
                print "ERROR: File does not exist: $file_name2\n";
                return(1);
            }

            $format2 = $this->option('format2');
            if(!in_array($format2, array_keys($this->csv_formats))) {
                print "ERROR: Format '$format2' is not supported\n";
                return(1);
            }
        }

        $record_limit = -1;
        if ($this->option('limit')) {
            $record_limit = intval($this->option('limit'));
        }

        $this->run_preflight_checks();

        $recordCount = $this->process_file($file_name, $format, $record_limit);
        printf("INFO: File1 Record count = %d\n", $recordCount);
        printf("INFO: File1 Duplicates = %d\n", $this->email_dups);

        if (isset($opts['file2'])) {
            $recordCount2 = $this->process_file($file_name2, $format2, $record_limit);
            printf("INFO: File2 Record count = %d\n", $recordCount2);
        }

        printf("INFO: Overall record count = %d\n", count($this->db_records));
        printf("INFO: Overall duplicates = %d\n", $this->email_dups);

        $import_count = $this->insert_records();
        printf("INFO: Imported %d record(s)\n", $import_count);

        $record_count_post = DB::table('users')->count();
        printf("INFO: Final table record count: %d\n", $record_count_post);
    }

    function run_preflight_checks() {
        $record_count_pre = DB::table('users')->count();
        printf("INFO: Starting table record count: %d\n", $record_count_pre);

        $response = $this->cliPrompt("Proceed with file import operation");
        if ($response != 'Y') {
            print "INFO: Import operation aborted\n";
            exit;
        }

        if ($record_count_pre > 0) {
            $response = $this->cliPrompt("Purge existing records in table");
            if ($response == 'Y') {
                $result = DB::table('users')->delete();
                print "INFO: Records purged: $result\n";
            }
        }
        return;
    }

    function insert_records($batch_size = 250) 
    {
        $import_count = 0;

        foreach (array_chunk($this->db_records, $batch_size) as $batch) {

            $result = DB::table("users")->insert($batch);
            if ($result == 1) {
                $import_count += count($batch);

                printf("INFO: Imported %d record(s)\r", $import_count);
            }

            # Debugging - exit after first batch
            #break;
        }
        return $import_count;
    }

    function process_file($file_name, $format, $record_limit) {

        $file_handle = fopen($file_name,"r");

        $line_count = 0;
        $record_count = 0;
        $import_count = 0;
        $headers = array();

        while(! feof($file_handle))
        {
            $line_array = fgetcsv($file_handle);
            $line_count++;

            if ($line_array === false) {
                break;
            }

            # fgetcsv seems to handle Windows Ctrl-M characters okay
            #$line_array = str_replace("\r", "", $line_array);

            if($line_count == 1){
                $headers = $line_array;

                foreach ($this->csv_formats[$format] as $field) {
                    if (!in_array($field, $headers)) {
                        print "ERROR: Mandatory field '$field' is not present in file header\n";
                        print "File headers present: " . implode($headers, ',') . "\n\n";
                        return(1);
                    }
                }
                continue;
            }

            $csv_record = array();
            if(count($line_array) != count($headers)){
                print "INFO: Skipping line $line_count due to incorrect field count\n";
                continue;
            }

            # Create an associative array for the record using the headers provided in the file
            for($k = 0; $k < count($headers); $k++){
                $csv_record[$headers[$k]] = trim($line_array[$k]);
            }

            if ($this->option('debug')) {
                print "csv_record = " . print_r($csv_record, true) . "\n";
            }

            # Define the base record
            $db_record = [
                "company_id"        => config('constant.COMPANY_ID'),
                "is_active"         => 0,
                "user_is_active"    => 1,
                "created_at"        => date("Y-m-d H:i:s"),
                "email"             => null,
                "user_first_name"   => "",
                "user_family_name"  => "",
                "dob"               => null,
                "groups"            => "",
                "old_user"          => 1,
            ];

            $groups = [];

            if ($format == 'member') {

                # Sample data - email is the only field guaranteed to be present
                #

                $db_record['email'] = $this->normalizeString($csv_record['Email']);

                $groups[] = 'Member';

                # Split Customer name field into it's components
                #
                if (preg_match('/(\S+)( (.+))?/', $csv_record['Customer Name'], $matches)) {
                    $db_record['user_first_name'] = $this->normalizeString($matches[1]);
                    if (array_key_exists(3, $matches)) {
                        $db_record['user_family_name'] = $this->normalizeString($matches[3]);
                    }
                }

                # Handle DOB
                #
                if (preg_match('(\d+/\d+/\d+)', $csv_record['Date of Birth'], $matches)) {
                    $dob_time = strtotime($matches[0]);
                    $db_record["dob"] = date('Y-m-d', $dob_time);
                }
            }
            else if ($format == 'member_loyalty' || $format == 'member_trans') {

                # Sample loyalty data - email is the only field guaranteed to be present
                #
                #User Id,Name,EMAIL,Date of Birth,Loyalty Campaign,Redeemed,Expires,Expired
                #465866,Tanis Jardin,tanisjardin@hotmail.com,,Free Side,,08/02/2017,Expired
                #782707,Tom Callaghan,thomasecallaghan@hotmail.com,1987-07-22,Free Milkshake,,08/02/2017,Expired
                #227050,Dre,bobbyshmurda187@gmail.com,1998-02-07,Free Side,,09/02/2017,Expired

                # Sample trans data - email is the only field guaranteed to be present
                #
                #User Id,Name,Email,Date of Birth,Number of Successful Transactions
                #20,Ashley Sheppard,Ashley@call-systems.com,,2
                #180,Paul Norris,paulnorris@norrisbain.com,,1
                #187,Joao Sousa,joao1227@gmail.com,1987-08-23,1

                $db_record['email'] = $this->normalizeString($csv_record['Email']);

                $groups[] = 'Member';

                # Split Customer name field into it's components
                #
                if (preg_match('/(\S+)( (.+))?/', $csv_record['Name'], $matches)) {
                    $db_record['user_first_name'] = $this->normalizeString($matches[1]);
                    if (array_key_exists(3, $matches)) {
                        $db_record['user_family_name'] = $this->normalizeString($matches[3]);
                    }
                }

                # Handle DOB
                #
                if (preg_match('(\d+/\d+/\d+)', $csv_record['Date of Birth'], $matches)) {
                    $dob_time = strtotime($matches[0]);
                    $db_record["dob"] = date('Y-m-d', $dob_time);
                }
            }
            else if ($format == 'staff') {

                # Sample data
                #
                # Status,EmployeeNumber,Firstnames,Surname,Location,PersonalEmail
                # Current,301323745,Lily,Wilkins,Brighton,lilymaewilkins@hotmail.com
                # Current,308423708,David,Starley,Brighton Marina,davidjamesstarley@gmail.com

                $groups[] = 'Staff';

                #'Status','EmployeeNumber','Firstnames','Surname','Location','PersonalEmail'
                $db_record['client_employee_no'] = $this->normalizeString($csv_record['EmployeeNumber']);
                $db_record['user_first_name'] = $this->normalizeString($csv_record['Firstnames']);
                $db_record['user_family_name'] = $this->normalizeString($csv_record['Surname']);
                $db_record['email'] = $this->normalizeString($csv_record['PersonalEmail']);
            }

            $db_record["groups"] = json_encode($groups);

            # Record validation
            #
            # Skip all records which do not have a valid email
            #
            $email = $this->validateEmail($db_record['email']);
            if (is_null($email)) {
                continue;
            }

            # Check email and skip duplicates
            #
            if (isset($this->email_hash[$email])) {
                $this->email_hash[$email]++;
                $this->email_dups++;
                /*
                printf("INFO: Duplicate email %-20s %d\n",
                    $email,
                    $this->email_hash
                );
                 */
                continue;
            }
            else {
                $this->email_hash[$email] = 1;
            }


            if ($this->option('debug')) {
                print "db_record = " . print_r($db_record, true) . "\n";
            }

            # Queue the record for insertion
            #
            $this->db_records[] = $db_record;
            $record_count++;

            if ($record_limit > 0 && $record_count >= $record_limit) {
                break;
            }
        }

        return $record_count;
    }

    public function normalizeString($str) {
        #$str = str_replace(".","",$str);
        #$str = str_replace("~","",$str);
        #$str = str_replace("-","",$str);
        return trim($str);
    }

    public function validateEmail($email) {
        $email = trim($email);
        $email = strtolower($email);
        $email = preg_replace("/^[\.\-]/", "", $email);
        $email = preg_replace("/^</", "", $email);
        $email = preg_replace("/>$/", "", $email);

        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){ 
            $email = null;
        }

        return($email);
    }

    public function cliPrompt($prompt = null, $permitted_responses = [], $default_response = '') {
        if (is_null($prompt)) {
            $prompt = sprintf("Proceed");
        }
        if (count($permitted_responses) == 0) {
            $permitted_responses = ['Y', 'N'];
        }
        $response = '';
        while(!in_array($response, $permitted_responses)) {
            printf("%s [%s]? %s", 
                $prompt, 
                implode($permitted_responses, ","),
                $default_response
            );
            $response = trim(strtoupper(fgets(STDIN)));
            if ($response == '') {
                $response = $default_response;
            }
        }
        return($response);
    }
}
