<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        DB::listen(function ($query) {

            $log_info = sprintf("\n%-8s: %s\n\n", "sql", $query->sql);

            $bc = 0;
            foreach ($query->bindings as $binding) {
                $log_info .= sprintf("%-8s: ", "bind ".++$bc);
                if (is_object($binding)) {
                    $log_info .= print_r($binding, true);
                }
                else {
                    $log_info .= $binding . "\n";
                }
            }

            $log_info .= sprintf("%-8s: %s\n", "time", $query->time) .
                "-------------------------------------------------------------------------------";

            Log::channel('sql')->debug($log_info);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
