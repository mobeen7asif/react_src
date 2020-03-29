<?php

namespace App\Http\Controllers\API;

use App\Exports\CSVExport;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Redis;
use Maatwebsite\Excel\Facades\Excel;


class CSVReadController extends Controller
{
    public function __construct()
    {
        set_time_limit(0);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function readCsvFile(Request $request)
    {
        foreach ($request->file('myFile') as $file) {
            $data = $this->csvToArray($file);
            for ($i = 0; $i < count($data); $i++) {
                $barcode = $data[$i]['sku'];
                if (!$barcode || $barcode == 'NULL')
                    continue;

                Redis::SADD('barcode_' . $barcode, json_encode([
                    'SKU' => (strlen($data[$i]['sku']) < 13) ? $data[$i]['sku'] : 0,
                    'Product_Name' => $data[$i]['name'],
                    'BarCode' => (strlen($data[$i]['sku']) >= 13) ? $data[$i]['sku'] : 0
                ]));

            }
        }
        $keys = Redis::KEYS('barcode_*');
        $data = collect(Redis::SUNION($keys))->map(function ($row) {
            return json_decode($row, true);
        });

        Redis::DEL($keys);

        return Excel::download(new CSVExport($data), 'amplify_members.xlsx');


    }


}
