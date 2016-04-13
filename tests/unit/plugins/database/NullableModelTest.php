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
        // Save as SQL default
        $post = NullablePost::create(['author_nickname' => ''])->reload();
        $this->assertEquals('October', $post->author_nickname);

        // Save as empty string
        $post->author_nickname = '';
        $post->save();
        $this->assertNull($post->author_nickname);
    }

    public function testNonEmptyValuesAreIgnored()
    {
        // Save as value
        $post = NullablePost::create(['author_nickname' => 'Joe']);
        $this->assertEquals('Joe', $post->author_nickname);

        // Save as "not equal" operator
        $post->author_nickname = 0;
        $post->save();
        $this->assertEquals(0, $post->author_nickname);
    }
}
