<?php

use Database\Tester\Models\NullablePost;

class NullableModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testNullifyingFields()
    {
        // The nullable field should be unset and use sql default
        $post = NullablePost::create(['author_nickname' => '']);
        $this->assertEquals('October', NullablePost::find($post->id)->author_nickname);

        // Once saved, fields will be set to null
        $post->author_nickname = '';
        $post->save();
        $this->assertNull($post->author_nickname);
    }

    public function testNonEmptyValuesAreIgnored()
    {
        $post = NullablePost::create(['author_nickname' => 'Joe']);
        $this->assertEquals('Joe', $post->author_nickname);
    }
}
