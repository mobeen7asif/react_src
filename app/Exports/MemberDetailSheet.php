<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 5/31/2018
 * Time: 3:10 PM
 */


namespace App\Exports;

use App\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;

use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class MemberDetailSheet implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $csvCollection;

    public function __construct($data)
    {
        $this->csvCollection = collect($data);
    }

    /**
     * @return Builder
     */
    public function collection()
    {
        return $this->csvCollection;
    }

    public function headings(): array
    {
        return [
            'MemberId',
            'Email',
            'Vouchers Count',
            'Active Vouchers ',
            'Expired Vouchers',
            'Redeemed Vouchers',
            'Stamps Count',
            'Transaction Count',
            'Transaction Amount Count'
        ];
    }
}
