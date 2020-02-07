<?php

use Database\Tester\Models\ValidationPost;

class ValidationModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testUniqueTableValidation()
    {
        $this->expectException(\October\Rain\Database\ModelException::class);

        $post = ValidationPost::create([
            'title' => 'This is a new post',
            'slug' => 'post-1',
            'description' => 'Testing...'
        ]);

        $this->assertNotFalse($post);

        $post2 = ValidationPost::create([
            'title' => 'this is another post with the same slug',
            'slug' => 'post-1',
            'description' => 'testing....'
        ]);
    }
}
