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
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;


class SurveyStatsExport implements FromCollection, ShouldAutoSize, WithHeadings,WithEvents,WithTitle
{
    private $surveyStats;

    public function __construct($stats)
    {
        $this->surveyStats =$stats;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->surveyStats;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'User Name',
            'Complete',
        ];
    }

    public function title():string
    {
        return 'Survey Report';
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