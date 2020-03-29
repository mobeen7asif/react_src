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

class CampUsersSheet implements FromCollection,ShouldAutoSize, WithHeadings, WithEvents,WithTitle
{
    private $csvCollection;

    public function __construct($data, $key)
    {
        $this->csvCollection = collect($data);
        $this->csvKey = substr($key, 0, 28);
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
            'Status'
        ];
    }

    public function title():string
    {
        return $this->csvKey;
    }

    /**
     * @return array
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $cellRange = 'A1:W1'; // All headers
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setSize(12);
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setBold(true);
            },
        ];
    }

}
