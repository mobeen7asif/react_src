<?php

namespace App\Http\Controllers\API;

use App\Models\EmailTemplate;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EmailBuilderController extends Controller
{
    /**
     * @return array|string
     */
    public function getTemplateList()
    {
        try {
            $postData = [
                'user_id' => request()->user()->knox_user_id,
                'company_id' => config('constant.COMPANY_ID'),
            ];
            if (request()->has('page') && request()->has('perPage')) {
                $postData['page'] = request('page');
                $postData['perPage'] = request('perPage');
            }

            $client = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => config('constant.DECEDRA_API_KEY'),
                    'SECRET' => config('constant.DECEDRA_SECRET')
                ]
            ]);

            $response = $client->request('POST', config('constant.DECEDRA_URL') . 'getAllTemplates', [
                'json' => $postData
            ]);
            return $response->getBody()->getContents();

        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage() . 'Error occurred while fetching data'];
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }

    }//..... end of getTemplateList() .....//

    public function getTemplateContent(Request $request)
    {

        try {
            $postData = $request->all();
            if (request()->has('page') && request()->has('perPage')) {
                $postData['page'] = request('page');
                $postData['perPage'] = request('perPage');
            }

            $client = new Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => config('constant.DECEDRA_API_KEY'),
                    'SECRET' => config('constant.DECEDRA_SECRET')
                ]
            ]);

            $response = $client->request('POST', config('constant.DECEDRA_URL') . 'getTemplate', [
                'json' => $postData
            ]);
            return json_decode($response->getBody()->getContents());

        } catch (\Exception $e) {
            return ['status' => false, 'message' => $e->getMessage() . 'Error occurred while fetching data'];
        } catch (GuzzleException $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }

    }//---- End of getTemplateContent() ----//
}
