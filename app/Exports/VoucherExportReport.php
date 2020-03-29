<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 5/31/2018
 * Time: 3:10 PM
 */

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;


class VoucherExportReport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $csvCollection;

    public function __construct($reportData)
    {
        $this->csvCollection = collect($reportData);
    }
    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->csvCollection;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Voucher Code',
            'Voucher Date',
            'No Of Uses Voucher',
            'Remaining Uses',
            'Total Voucher Redeemed',
            'Voucher Promotional Text',
            'Email',
        ];
    }
}