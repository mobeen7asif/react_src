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
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;


class TransactionSheet implements FromCollection,ShouldAutoSize, WithHeadings,WithEvents,WithTitle
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
        return  $this->csvCollection;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Transaction Date',
            'Name',
            'Retailers',
            'Center',
            'Type',
            'Qty',
            'Amount'
        ];
    }

    public function title():string
    {
        return 'Transactions';
    }

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
