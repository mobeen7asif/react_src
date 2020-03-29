<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;


class UsersExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private $userCollection;

    public function __construct($users)
    {
        $this->userCollection = $users;
    }

    /**
     * @return Collection
     */
    public function collection()
    {
        return $this->userCollection;
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
            'Email',
            'Default Venue',
        ];
    }
}
