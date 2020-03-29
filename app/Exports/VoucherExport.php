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


class VoucherExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $csvCollection;

    public function __construct($members)
    {
        $this->csvCollection = collect($members);
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
            'Dated',
            'Stamps',
            'Total Vouchers Redeemed',
            'Refers',
        ];
    }
}