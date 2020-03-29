<?php

namespace App\Console\Commands;

use App\Models\UserCharityCoins;
use Illuminate\Console\Command;

class ResetJars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:jars';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset Jars';

    protected $userCharityCoins;

    /**
     * ResetJars constructor.
     * @param UserCharityCoins $userCharityCoins
     */
    public function __construct(UserCharityCoins $userCharityCoins)
    {
        parent::__construct();
        $this->userCharityCoins = $userCharityCoins;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->userCharityCoins->whereStatus('organization')->update(['status' => 'redeemed']);
    }
}
