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


class MemberExportWithDetails implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $membersCollection;

    public function __construct($members, $campaigns)
    {
        dd($campaigns);
        $this->campaigns = $campaigns;
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
        $header     = [
            'Member Number',
            'First Name',
            'Last Name',
            'Email',
            'Mobile',
            'Member Type',
            'DOB',
            'Nationality',
            'Profession',
            'Industry',
            'Locality',
            'Job Title',
            'Employer Name',
            'Expiry',
            'Status',
        ];

        $finalHeader = array_merge($header, $this->campaigns);

        return $finalHeader;
    }
}