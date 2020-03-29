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


class PublicVoucher implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $membersCollection;

    public function __construct($members)
    {
        $this->membersCollection = collect($members);
    }
    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->membersCollection;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Member ID',
            'Email',
            'Voucher Code',
            'No Of Uses',
            'Uses Remaining',
            'Voucher Start Date',
            'Voucher End Date',


        ];
    }
}