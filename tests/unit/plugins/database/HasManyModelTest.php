<?php

use Database\Tester\Models\Author;
use Database\Tester\Models\Post;
use October\Rain\Database\Collection;

class HasManyModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $post1 = Post::create(['title' => "First post", 'description' => "Yay!!"]);
        $post2 = Post::create(['title' => "Second post", 'description' => "Woohoo!!"]);
        $post3 = Post::create(['title' => "Third post", 'description' => "Yipiee!!"]);
        $post4 = Post::make(['title' => "Fourth post", 'description' => "Hooray!!"]);
        Model::reguard();

        // Set by Model object
        $author->posts = new Collection([$post1, $post2]);
        $author->save();
        $this->assertEquals($author->id, $post1->author_id);
        $this->assertEquals($author->id, $post2->author_id);
        $this->assertEquals([
            'First post',
            'Second post'
        ], $author->posts->lists('title'));

        // Set by primary key
        $postId = $post3->id;
        $author->posts = $postId;
        $author->save();
        $post3 = Post::find($postId);
        $this->assertEquals($author->id, $post3->author_id);
        $this->assertEquals([
            'Third post'
        ], $author->posts->lists('title'));

        // Nullify
        $author->posts = null;
        $author->save();
        $post3 = Post::find($postId);
        $this->assertNull($post3->author_id);
        $this->assertNull($post3->author);

        // Deferred in memory
        $author->posts = $post4;
        $this->assertEquals($author->id, $post4->author_id);
        $this->assertEquals([
            'Fourth post'
        ], $author->posts->lists('title'));
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $post1 = Post::create(['title' => "First post", 'author_id' => $author->id]);
        $post2 = Post::create(['title' => "Second post", 'author_id' => $author->id]);
        Model::reguard();

        $this->assertEquals([$post1->id, $post2->id], $author->getRelationValue('posts'));
    }

    public function testDeferredBinding()
    {
        $sessionKey = uniqid('session_key', true);

        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $post = Post::create(['title' => "First post", 'description' => "Yay!!"]);
        Model::reguard();

        $postId = $post->id;

        // Deferred add
        $author->posts()->add($post, $sessionKey);
        $this->assertNull($post->author_id);
        $this->assertEmpty($author->posts);

        $this->assertEquals(0, $author->posts()->count());
        $this->assertEquals(1, $author->posts()->withDeferred($sessionKey)->count());

        // Commit deferred
        $author->save(null, $sessionKey);
        $post = Post::find($postId);
        $this->assertEquals(1, $author->posts()->count());
        $this->assertEquals($author->id, $post->author_id);
        $this->assertEquals([
            'First post'
        ], $author->posts->lists('title'));

        // New session
        $sessionKey = uniqid('session_key', true);

        // Deferred remove
        $author->posts()->remove($post, $sessionKey);
        $this->assertEquals(1, $author->posts()->count());
        $this->assertEquals(0, $author->posts()->withDeferred($sessionKey)->count());
        $this->assertEquals($author->id, $post->author_id);
        $this->assertEquals([
            'First post'
        ], $author->posts->lists('title'));

        // Commit deferred
        $author->save(null, $sessionKey);
        $post = Post::find($postId);
        $this->assertEquals(0, $author->posts()->count());
        $this->assertNull($post->author_id);
        $this->assertEmpty($author->posts);
    }
}