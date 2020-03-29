<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Utility\ElasticsearchUtility;

class remapES extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engage:remapES {--index= : ElasticSearch index name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create/Reindex/Rename an ElasticSearch index while preserving data';

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
        $es = new ElasticsearchUtility();

        $opts = $this->options();

        if (isset($opts['index'])) {
            $origIndex = $this->option('index');
        }
        else {
            $origIndex = \Config::get('constant.ES_INDEX_BASENAME');
            if (strlen($origIndex) < 3) {
                print "ERROR: Unable to determine ES index name from config/environment\n";
                exit;
            }
        }

        # Preflight check
        #
        $response = $this->cliPrompt("Proceed with re-index operation for index $origIndex?");
        if ($response != 'Y') {
            print "INFO: Re-index operation aborted\n";
            exit;
        }

        # Generate some index names
        #
        $tempIndex = sprintf("%s_temp_%s_%s", 
            $origIndex, strftime('%Y%m%d', time()), getmypid()
        );
        $backupIndex = sprintf("%s_bak_%s_%s", 
            $origIndex, strftime('%Y%m%d', time()), getmypid()
        );

        # Re-index the original index to a backup
        #
        printf("INFO: createIndex(%s)\n", $backupIndex);
        $result = $es->createIndex($backupIndex);
        printf("INFO: reindexIndex(%s, %s)\n", $origIndex, $backupIndex);
        $result = $es->reindexIndex($origIndex, $backupIndex);
        if (!is_array($result) || intval($result['total']) <= 0) {
            printf("ERROR: reindexIndex(%s, %s) failed with %s\n",
                $origIndex, $tempIndex, print_r($result, true));
            exit(1);
        }

        # Create a new index with new mapping
        #
        printf("INFO: createIndex(%s)\n", $tempIndex);
        $result = $es->createIndex($tempIndex);
        if (!is_array($result) || $result['acknowledged'] != 1) {
            printf("ERROR: createIndex(%s) failed with %s\n", $tempIndex, print_r($result, true));
            exit(1);
        }

        # Reindex original to temp
        #
        printf("INFO: reindexIndex(%s, %s)\n", $origIndex, $tempIndex);
        $result = $es->reindexIndex($origIndex, $tempIndex);
        if (!is_array($result) || intval($result['total']) <= 0) {
            printf("ERROR: reindexIndex(%s, %s) failed with %s\n", 
                $origIndex, $tempIndex, print_r($result, true));
            exit(1);
        }

        # Drop & recreate the original index
        #
        printf("INFO: dropIndex(%s)\n", $origIndex);
        $result = $es->dropIndex($origIndex);
        $result = $es->createIndex($origIndex);
        if (!is_array($result) || $result['acknowledged'] != 1) {
            printf("ERROR: createIndex(%s) failed with %s\n", $origIndex, print_r($result, true));
            exit(1);
        }

        # Re-index the temp index back to the original index name
        #
        printf("INFO: reindexIndex(%s, %s)\n", $tempIndex, $origIndex);
        $result = $es->reindexIndex($tempIndex, $origIndex);
        if (!is_array($result) || intval($result['total']) <= 0) {
            printf("ERROR: reindexIndex(%s, %s) failed with %s\n", 
                $tempIndex, $origIndex, print_r($result, true));
            exit(1);
        }

        # Delete the temp index
        #
        printf("INFO: dropIndex(%s)\n", $tempIndex);
        $result = $es->dropIndex($tempIndex);

        return;
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
            printf("%s? [%s] %s", 
                rtrim($prompt, '?'), 
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
