<?php

use Database\Tester\Models\Post;
use Database\Tester\Models\Author;
use Database\Tester\Models\EventLog;

class MorphToModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Post.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/EventLog.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $post1 = Post::create(['title' => "First post", 'description' => "Yay!!"]);
        $post2 = Post::make(['title' => "Second post", 'description' => "Woohoo!!"]);
        $event = EventLog::create(['action' => "user-created"]);
        Model::reguard();

        // Set by Model object
        $event->related = $author;
        $event->save();
        $this->assertEquals($author->id, $event->related_id);
        $this->assertEquals('Stevie', $event->related->name);

        // Set by primary key
        $event->related = [$post1->id, get_class($post1)];
        $this->assertEquals($post1->id, $event->related_id);
        $this->assertEquals('First post', $event->related->title);

        // Nullify
        $event->related = null;
        $this->assertNull($event->related_id);
        $this->assertNull($event->related);

        // Deferred in memory
        $event->related = $post2;
        $this->assertEquals('Second post', $event->related->title);
        $this->assertNull($event->related_id);
        $event->save();
        $this->assertEquals($post2->id, $event->related_id);
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $event = EventLog::make(['action' => "user-created", 'related_id' => $author->id, 'related_type' => get_class($author)]);
        Model::reguard();

        $this->assertEquals([$author->id, get_class($author)], $event->getRelationValue('related'));
    }
}
