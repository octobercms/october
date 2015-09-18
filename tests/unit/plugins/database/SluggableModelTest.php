<?php

use Database\Tester\Models\SluggablePost;

class SluggableModelTest extends PluginTestCase
{
    public function setUp()
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

    public function testDuplicateSlug()
    {
        $post1 = SluggablePost::create(['title' => 'Pace yourself']);
        $post2 = SluggablePost::create(['title' => 'Pace yourself']);
        $post3 = SluggablePost::create(['title' => 'Pace yourself']);

        $this->assertEquals('pace-yourself', $post1->slug);
        $this->assertEquals('pace-yourself-2', $post2->slug);
        $this->assertEquals('pace-yourself-3', $post3->slug);
    }
}