<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 3/8/19
 * Time: 11:47 AM
 */

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;


class GameMissionExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $membersCollection;

    public function __construct($members)
    {
        $this->membersCollection =$members;
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
            'Date',
            'First Name',
            'Last Name',
            'Mobile Number',
            'Email',
            'Venue Name'
        ];
    }
}