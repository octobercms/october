<?php

use Database\Tester\Models\SluggablePost;

class SluggableModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testFillPost()
    {
        $post = SluggablePost::create(['title' => 'Hello World!']);
        $this->assertEquals('hello-world', $post->slug);
    }

    public function testSetAttributeOnPost()
    {
        $post = new SluggablePost;
        $post->title = "Let's go, rock show!";
        $post->save();

        $this->assertEquals('lets-go-rock-show', $post->slug);
    }

    public function testSetSlugAttributeManually()
    {
        $post = new SluggablePost;
        $post->title = 'We parked in a comfortable spot';
        $post->slug = 'war-is-pain';
        $post->save();

        $this->assertEquals('war-is-pain', $post->slug);
    }

    public function testConcatenatedSlug()
    {
        $post = new SluggablePost;
        $post->title = 'Sweetness and Light';
        $post->description = 'Itchee and Scratchee';
        $post->save();

        $this->assertEquals('sweetness-and-light-itchee-and-scratchee', $post->long_slug);
    }

    public function testDuplicateSlug()
    {
        $post1 = SluggablePost::create(['title' => 'Pace yourself']);
        $post2 = SluggablePost::create(['title' => 'Pace yourself']);
        $post3 = SluggablePost::create(['title' => 'Pace yourself']);

        $this->assertEquals('pace-yourself', $post1->slug);
        $this->assertEquals('pace-yourself-2', $post2->slug);
        $this->assertEquals('pace-yourself-3', $post3->slug);
    }

    public function testCollisionWithSelf()
    {
        $post1 = SluggablePost::create(['title' => 'Watch yourself']);
        $post2 = SluggablePost::create(['title' => 'Watch yourself']);
        $post3 = SluggablePost::create(['title' => 'Watch yourself']);

        $this->assertEquals('watch-yourself', $post1->slug);
        $this->assertEquals('watch-yourself-2', $post2->slug);
        $this->assertEquals('watch-yourself-3', $post3->slug);

        $post3->slugAttributes();
        $post3->save();
        $post2->slugAttributes();
        $post2->save();
        $post1->slugAttributes();
        $post1->save();

        $this->assertEquals('watch-yourself', $post1->slug);
        $this->assertEquals('watch-yourself-2', $post2->slug);
        $this->assertEquals('watch-yourself-3', $post3->slug);
    }

    public function testSuffixCollision()
    {
        $post1 = SluggablePost::create(['title' => 'Type 1']);
        $post2 = SluggablePost::create(['title' => 'Type 2']);
        $post3 = SluggablePost::create(['title' => 'Type 3']);
        $post4 = SluggablePost::create(['title' => 'Type 3']);
        $post5 = SluggablePost::create(['title' => 'Type 3']);

        $this->assertEquals('type-1', $post1->slug);
        $this->assertEquals('type-2', $post2->slug);
        $this->assertEquals('type-3', $post3->slug);
        $this->assertEquals('type-3-2', $post4->slug);
        $this->assertEquals('type-3-3', $post5->slug);
    }
}
