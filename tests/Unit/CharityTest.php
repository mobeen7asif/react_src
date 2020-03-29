<?php

namespace Tests\Unit;
use App\Http\Controllers\API\CharityController;
use App\Http\Controllers\API\FilesController;
use App\Models\Charity;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CharityTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function get_charity_list()
    {
        $this->createCharity();
        $request = new \Illuminate\Http\Request();
        $request->replace([
            'company_id'    => 100,
            'limit'         => 20,
            'nameSearch'    => "",
            'offset'        => 0,
            'orderData'     => "desc",
            'venue_id'      => 295255
        ]);

        $charityController = new CharityController();
        $this->assertInstanceOf(CharityController::class, $charityController);
        $response = $charityController->getCharities($request);
        $this->assertEquals(true, $response['status']);
    }

    /** @test */
    public function should_return_error_on_creating_new_charity()
    {
        $request = new \Illuminate\Http\Request();
        $charityController = new CharityController();
        $this->assertInstanceOf(CharityController::class, $charityController);
        $this->expectException(QueryException::class);
        $charityController->getCharities($request);
    }
    
    /**
     * @test
     */
    public function create_new_charity()
    {
        $request = new \Illuminate\Http\Request();
        $request->replace(array_merge( $this->getData(), [ 'company_id'        => 100 ]));

        $charityController = new CharityController();
        $response = $charityController->saveCharity($request, new FilesController());
        $this->assertEquals(true, $response['status']);
    }

    /** @test */
    public function update_charity()
    {
        $charity = $this->createCharity();

        $request = new \Illuminate\Http\Request();
        $request->replace(array_merge($this->getData(), [
            'company_id'        => 100,
            'is_edit'           => $charity->id
        ]));

        $charityController = new CharityController();
        $response = $charityController->saveCharity($request, new FilesController());
        $this->assertEquals(true, $response['status']);
    }

    /** @test */
    public function delete_specific_charity()
    {
       $charity = $this->createCharity();
        $charityController = new CharityController();
        $response = $charityController->deleteCharity($charity->id);
        $this->assertEquals(true, $response['status']);
    }

    /**
     * @return mixed
     * Create new charity.
     */
    private function createCharity()
    {
        return Charity::create($this->getData());
    }//..... end of createCharity() .....//

    private function getData()
    {
        return [
            'charity_address'   => "test charity address.",
            'charity_desc'      => "test charity description.",
            'charity_email'     => "test@test.com",
            'charity_intro'     => "test charity introduction.",
            'charity_name'      => "test charity",
            'contact_number'    => "0334875894",
            'venue_id'          => 295255
        ];

    }
}
