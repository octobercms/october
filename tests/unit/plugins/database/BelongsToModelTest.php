<?php

use Database\Tester\Models\Post;
use Database\Tester\Models\Author;

class BelongsToModelTest extends PluginTestCase
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
        $post = Post::create(['title' => "First post", 'description' => "Yay!!"]);
        $author1 = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $author2 = Author::create(['name' => 'Louie', 'email' => 'louie@email.tld']);
        $author3 = Author::make(['name' => 'Charlie', 'email' => 'charlie@email.tld']);
        Model::reguard();

        // Set by Model object
        $post->author = $author1;
        $this->assertEquals($author1->id, $post->author_id);
        $this->assertEquals('Stevie', $post->author->name);

        // Set by primary key
        $post->author = $author2->id;
        $this->assertEquals($author2->id, $post->author_id);
        $this->assertEquals('Louie', $post->author->name);

        // Nullify
        $post->author = null;
        $this->assertNull($post->author_id);
        $this->assertNull($post->author);

        // Deferred in memory
        $post->author = $author3;
        $this->assertEquals('Charlie', $post->author->name);
        $this->assertNull($post->author_id);
        $author3->save();
        $this->assertEquals($author3->id, $post->author_id);
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $post = Post::make(['title' => "First post", 'author_id' => $author->id]);
        Model::reguard();

        $this->assertEquals($author->id, $post->getRelationValue('author'));
    }

    public function testDeferredBinding()
    {
        $sessionKey = uniqid('session_key', true);

        Model::unguard();
        $post = Post::make(['title' => "First post"]);
        $author = Author::create(['name' => 'Stevie']);
        Model::reguard();

        // Deferred add
        $post->author()->add($author, $sessionKey);
        $this->assertNull($post->author_id);
        $this->assertNull($post->author);

        $this->assertEquals(0, $post->author()->count());
        $this->assertEquals(1, $post->author()->withDeferred($sessionKey)->count());

        // Commit deferred
        $post->save(null, $sessionKey);
        $this->assertEquals(1, $post->author()->count());
        $this->assertEquals($author->id, $post->author_id);
        $this->assertEquals('Stevie', $post->author->name);

        // New session
        $sessionKey = uniqid('session_key', true);

        // Deferred remove
        $post->author()->remove($author, $sessionKey);
        $this->assertEquals(1, $post->author()->count());
        $this->assertEquals(0, $post->author()->withDeferred($sessionKey)->count());
        $this->assertEquals($author->id, $post->author_id);
        $this->assertEquals('Stevie', $post->author->name);

        // Commit deferred
        $post->save(null, $sessionKey);
        $this->assertEquals(0, $post->author()->count());
        $this->assertNull($post->author_id);
        $this->assertNull($post->author);
    }
}
