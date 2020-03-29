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


class OfferStatsExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $offerStats;

    public function __construct($stats)
    {
        $this->offerStats =$stats;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->offerStats;
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
            'Type',
            'Video Seen'

        ];
    }
}