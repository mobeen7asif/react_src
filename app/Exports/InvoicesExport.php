<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 5/31/2018
 * Time: 3:10 PM
 */

namespace App\Exports;

use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class InvoicesExport implements WithMultipleSheets
{
    use Exportable;

   protected $users_data;
    protected $transaction_data;
    protected $sheets = [];

    public function __construct($users_data,$transaction_data)
    {
        $this->users_data = $users_data;
        $this->transaction_data = $transaction_data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        try {

            return [
                'transactions' => new TransactionSheet($this->transaction_data),
                'users' => new UsersSheet($this->users_data),
            ];

//            $this->sheets[] = ;
//            $this->sheets[] = new UsersSheet($this->users_data,'Users Data');
//            Log::channel('custom')->info(['VoucherData'=>$this->sheets]);
//            return $this->sheets;
        }
        catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }

    }
}