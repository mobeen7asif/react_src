<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Gym;
use App\Models\GymExcludedBusiness;

class GymController extends Controller
{
    /*sonar constants*/
    const STATUS                 = 'status';
    const MESSAGE                 = 'message';

    
    /**
     * @return array
     */
    public function loadGyms()
    {
        $gyms = Gym::orderBy(request()->orderBy, request()->orderType)->with('excludedBusiness');

        if (request()->has('search') && request()->search) {
            $gyms->where(function ($query) {
                $query->where('name', 'like', '%' . request()->search . '%')
                    ->orWhere('state', 'like', '%' . request()->search . '%');
            });
        }

        return [
            self::STATUS => true,
            'total' => $gyms->count(),
            'data' => $gyms->skip(request()->offset)->take(request()->limit)->get()
        ];
    }//..... end of loadGyms() .....//

    /**
     * @return array
     */
    public function deleteGyms()
    {
        $gym = Gym::find(request()->id);
        $gym->excludedBusiness()->delete();
        if ($gym->delete()) {
            return [self::STATUS => true, self::MESSAGE => 'Gym deleted successfully.'];
        }
        else {
            return [self::STATUS => false, self::MESSAGE => 'Gym could not be deleted.'];
        }
    }//..... end of deleteGyms() .....//

    /**
     * Save gym.
     */
    public function saveGyms()
    {
        $gym = Gym::updateOrCreate(['id' => request()->editId], request()->except(['editId', 'exBusiness', 'CompanyID']));
        if (request()->editId !== 0 && is_array(request()->exBusiness)) {
            $this->setExcludedBusinesses($gym);
        }
        return [self::STATUS => true, self::MESSAGE => 'Gym saved successfully.'];
    }//..... end of saveGyms() .....//exBusiness

    /**
     * @param $gym
     * Save excluded businesses for gym.
     */
    private function setExcludedBusinesses($gym)
    {
        $excludedBusinesses = array_map(function ($b) {
            return new GymExcludedBusiness(['business_id' => $b['business_id'], 'business_name' => $b['business_name'], 'company_id' => request()->CompanyID]);
        }, request()->exBusiness);

        $gym->excludedBusiness()->delete();
        $gym->excludedBusiness()->saveMany($excludedBusinesses);
    }//..... end of setExcludedBusinesses() .....//
}//..... end of class.
