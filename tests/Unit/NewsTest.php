<?php

namespace Tests\Unit;

use App\Http\Controllers\API\FilesController;
use App\Http\Controllers\Api\NewsApiController;
use App\Http\Controllers\API\NewsController;
use App\Http\Controllers\API\VenueController;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NewsTest extends TestCase
{
    public $company_id = 100;
    public $venue_id = 295255;

    /** @test */
    public function getNewsCategories()
    {
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'company_id'    => $this->company_id,
            'offset'        => 0,
            'limit'         => 10,
        ]);
        $news = new NewsController();
        $res = $news->getNewsCategories($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */

    public function getVenueNewsTest()
    {
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'company_id'        => $this->company_id,
            'user_id'           => 1,
            'venue_id'          => $this->venue_id,
            'news_type'         => 'Videos',
            'offset'            => 0,
            'limit'             => 10,
        ]);
        $news = new NewsController();
        $res = $news->getVenueNews($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */

    public function saveNewsCategoriesTest(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'is_edit'           => 0,
            'category_name'     => "Test Category Name ".rand(111,999),
            'company_id'        => $this->company_id,
        ]);
        $news = new NewsController();
        $res = $news->saveNewsCategories($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function deleteNewsCategories(){
        $news = new NewsController();
        $res = $news->deleteNewsCategories(4);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function saveVenueNews(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'category_id'               => 2,
            'is_global'                 => 0,
            'is_edit'                   => 0,
            'news_title'                => "Test Subject ".rand(111,999),
            'news_text'                 => "news_desc ".rand(111,999),
            'news_intro'                => "news_web_detail ".rand(111,999),
            'selected_news_type'        => "news_type ".rand(111,999),
            'video_link'                => "video_link ".rand(111,999),
            'startDate'                 => "",
            'endDate'                   => "",
            'selected_news_type'        => "News",
            'venue_id'                  => $this->venue_id,
            'company_id'                => $this->company_id,
            'image'                     => '',
            'list_selected_board'       => '',
        ]);
        $news = new NewsController();
        $res = $news->saveVenueNews($req, new FilesController());
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function deleteNews(){
        $news = new NewsController();
        $res = $news->deleteNews(5);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getVenueVideos(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'quickBoardFilter'     => "",
        ]);
        $news = new NewsController();
        $res = $news->getVenueVideos($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function deleteVenues(){
        $news = new NewsController();
        $res = $news->deleteVenues(5);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getCommunityNews(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'     => $this->venue_id,
        ]);
        $news = new NewsApiController();
        $res = $news->getCommunityNews($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getVideos(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'     => $this->venue_id,
        ]);
        $news = new NewsApiController();
        $res = $news->getVideos($req);
        $this->assertEquals(1, $res['status']);
    }

    /** @test */
    public function getEvents(){
        $req = new \Illuminate\Http\Request();
        $req->replace([
            'venue_id'     => $this->venue_id,
        ]);
        $news = new NewsApiController();
        $res = $news->getEvents($req);
        $this->assertEquals(1, $res['status']);
    }


}

