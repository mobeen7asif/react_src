<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Utility\ElasticsearchUtility;

class deleteES extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'engage:deleteES {--index= : ElasticSearch index name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove an ElasticSearch index';

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

        if (!isset($opts['index'])) {
            print "ERROR: Index name must be specified\n";
            exit(1);
        }

        $result = $es->dropIndex($this->option('index'));

        print "RESULT: " . print_r($result, true) . "\n";

        return;
    }
}
