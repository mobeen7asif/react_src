<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Utility\ElasticsearchUtility;

class updateES extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engage:updateES {--class= : Class of records to update in ElasticSearch (users|all)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update ElasticSearch index from RDS database';

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
        if ($this->option('class') == "") {
            print "ERROR: Class must be specified\n\n";
            printf("Usage: %s\n", $this->signature);
            exit(1);
        }

        $es = new ElasticsearchUtility();

        # Check the ES index exists
        #
        if (!$es->indexExists()) {
            print "ERROR: Elasticsearch index does not exist\n";
            exit(1);
        }

        # Get initial ES index stats
        #
        if (!$es_index_stats = $es->getIndexStats()) {
            print "ERROR: Unable to retrieve index status\n";
            exit(1);
        }
        $es_doc_count_initial = $es_index_stats['_all']['primaries']['docs']['count'];
        printf("INFO: Initial ES index document count: %d\n", $es_doc_count_initial);

        # Update ElasticSearch index in sensibly sized batches
        #
        if ($this->option('class') == "users" || $this->option('class') == "all") {

            $record_count = DB::table('users')->count();
            printf("INFO: Total records in RDS for class %s: %d\n", $this->option('class'), $record_count);

            $batch_size = 5000;
            $total_batches = intval($record_count / $batch_size) + 1;
            $count = 0;
            $batch_no = 0;
            while ($count < $record_count) {
                $batch_no++;

                $users = DB::table('users')->skip(($batch_no - 1) * $batch_size)->take($batch_size)->get();
                #printf("INFO: Batch %d Record count: %d\n", $batch_no, $users->count());

                $result = $es->bulkUserDataInsertNew($users,'');
                #printf("INFO: Batch %d ElasticSearch status: %s\n", $batch_no, $result['status']);
                if ($result['status'] == 1) {
                    $status_desc = 'success';
                }
                else {
                    $status_desc = 'failure';
                }

                $count += $users->count();

                printf("INFO: Processing batch %d of %d containing %d records: %s (%d)\r",
                    $batch_no, $total_batches, $users->count(), $status_desc, $count);
            }

            printf("\nINFO: Total records processed: %d\n", $count);
        }

        # Refresh ES index stats
        #
        $es_index_stats = $es->getIndexStats();
        $es_doc_count_final = $es_index_stats['_all']['primaries']['docs']['count'];
        printf("INFO: Final ES index document count: %d\n", $es_doc_count_final);
        printf("INFO: ES index document count delta: %d\n", $es_doc_count_final - $es_doc_count_initial);

        return;
    }
}
