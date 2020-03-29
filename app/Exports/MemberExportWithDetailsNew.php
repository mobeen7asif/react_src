<?php
/**
 * Created by PhpStorm.
 * User: sadiq
 * Date: 5/31/2018
 * Time: 3:10 PM
 */

namespace App\Exports;

use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MemberExportWithDetailsNew implements WithMultipleSheets
{
    use Exportable;

    protected $users_data;
    protected $members_data;
    protected $sheets = [];

    public function __construct($users_data)
    {
        $this->users_data = $users_data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        try {
            $finalData = [];
            foreach($this->users_data as $key => $data){
                $finalData[$key] = new CampUsersSheet($data, $key);
            }
            return $finalData;
        }
        catch (\Exception $e) {
            return ['message' => $e->getMessage()];
        }

    }
}