<?php

use Database\Tester\Models\Post;

class ModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testCreateFirstPost()
    {
        Post::truncate();
        $post = new Post;
        $post->title = "First post";
        $post->description = "Yay!!";
        $post->save();
        $this->assertEquals(1, $post->id);
    }

    /**
     * @expectedException        \Illuminate\Database\Eloquent\MassAssignmentException
     * @expectedExceptionMessage title
     */
    public function testGuardedAttribute()
    {
        Post::create(['title' => 'Hi!', 'slug' => 'authenticity']);
    }
}