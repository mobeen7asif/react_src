<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\API\UserApiController;

class sendSms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engage:sendSms ' .
        '{destination} ' .
        '{--route= : route} ' .
        '{--type= : [msg_type:= normal|otp]} ' .
        '{--message= : message_content} ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send an SMS message via the Engage API path';

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
        $opts = $this->options();
        $args = $this->arguments();
        #print_r($opts);
        #print_r($args);

        # Redundant as argument validation handled by Laravel
        #
        if (!isset($args['destination'])) {
            printf("Usage: php artisan %s\n", $this->signature);
            exit(1);
        }

        # Default to normal message type
        #
        if (!isset($opts['type'])) {
            $opts['type'] = 'normal';
        }

        $uac = new UserApiController();

        if ($opts['type'] == 'normal') {
            if (!isset($opts['message'])) {
                printf("Usage: php artisan %s\n\n", $this->signature);
                printf("ERROR: Message must be specified for type 'normal'\n");
                exit(1);
            }
            $result = $uac->sendSms(
                $args['destination'],
                $opts['message'],
                $opts['route']
            );
        }
        else if ($opts['type'] == 'otp') {
            $result = $uac->sendVerificationSms(
                $args['destination'],
                '<code>',
                '<name>',
                $opts['route'],
                '<appName>'
            );
        }

        if ($result === true) {
            printf("INFO: SMS message to %s sent successfully (%s)\n",
                $args['destination'], $opts['type']);
        }
        else {
            printf("INFO: SMS message to %s failed to send (%s)\n", 
                $args['destination'], $opts['type']);
            printf("ERROR: %s\n", $result);
        }

        return;
    }
}
