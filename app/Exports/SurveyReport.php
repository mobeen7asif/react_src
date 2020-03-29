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
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithTitle;


class SurveyReport implements FromCollection, ShouldAutoSize,WithEvents,WithTitle
{
    private $csvCollection;
    private $headers_collection;

    public function __construct($reportData,$headers)
    {
        $this->csvCollection = collect($reportData);
        $this->headers_collection = $headers;
    }
    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->csvCollection;
    }

    public function title():string
    {
        return 'Satisfaction Survey Report';
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