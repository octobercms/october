<?php

use Database\Tester\Models\Post;
use Database\Tester\Models\Author;
use October\Rain\Database\Models\DeferredBinding;

class DeferredBindingTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testNegatedBinding()
    {
        $sessionKey = uniqid('session_key', true);
        DeferredBinding::truncate();

        Model::unguard();
        $author = Author::make(['name' => 'Stevie']);
        $post = Post::create(['title' => "First post"]);
        $post2 = Post::create(['title' => "Second post"]);
        Model::reguard();

        $author->posts()->add($post, $sessionKey);
        $this->assertEquals(1, DeferredBinding::count());

        // Skip repeat bindings
        $author->posts()->add($post, $sessionKey);
        $this->assertEquals(1, DeferredBinding::count());

        // Remove add-delete pairs
        $author->posts()->remove($post, $sessionKey);
        $this->assertEquals(0, DeferredBinding::count());

        // Multi ball
        $sessionKey = uniqid('session_key', true);
        $author->posts()->add($post, $sessionKey);
        $author->posts()->add($post, $sessionKey);
        $author->posts()->add($post, $sessionKey);
        $author->posts()->add($post, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $this->assertEquals(2, DeferredBinding::count());

        // Clean up add-delete pairs
        $author->posts()->remove($post, $sessionKey);
        $author->posts()->remove($post2, $sessionKey);
        $this->assertEquals(0, DeferredBinding::count());

        // Double negative
        $author->posts()->remove($post, $sessionKey);
        $author->posts()->remove($post2, $sessionKey);
        $this->assertEquals(2, DeferredBinding::count());

        // Skip repeat bindings
        $author->posts()->remove($post, $sessionKey);
        $author->posts()->remove($post2, $sessionKey);
        $this->assertEquals(2, DeferredBinding::count());

        // Clean up add-delete pairs again
        $author->posts()->add($post, $sessionKey);
        $author->posts()->add($post2, $sessionKey);
        $this->assertEquals(0, DeferredBinding::count());
    }

    public function testCancelBinding()
    {
        $sessionKey = uniqid('session_key', true);
        DeferredBinding::truncate();

        Model::unguard();
        $author = Author::make(['name' => 'Stevie']);
        $post = Post::create(['title' => "First post"]);
        Model::reguard();

        $author->posts()->add($post, $sessionKey);
        $this->assertEquals(1, DeferredBinding::count());

        $author->cancelDeferred($sessionKey);
        $this->assertEquals(0, DeferredBinding::count());
    }

    public function testCommitBinding()
    {
        $sessionKey = uniqid('session_key', true);
        DeferredBinding::truncate();

        Model::unguard();
        $author = Author::make(['name' => 'Stevie']);
        $post = Post::create(['title' => "First post"]);
        Model::reguard();

        $author->posts()->add($post, $sessionKey);
        $this->assertEquals(1, DeferredBinding::count());

        $author->commitDeferred($sessionKey);
        $this->assertEquals(0, DeferredBinding::count());
    }
}
