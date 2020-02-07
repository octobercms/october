<?php

use Database\Tester\Models\Author;
use Database\Tester\Models\EventLog;
use October\Rain\Database\Collection;

class MorphManyModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/EventLog.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $event1 = EventLog::create(['action' => "user-created"]);
        $event2 = EventLog::create(['action' => "user-updated"]);
        $event3 = EventLog::create(['action' => "user-deleted"]);
        $event4 = EventLog::make(['action' => "user-restored"]);
        Model::reguard();

        // Set by Model object
        $author->event_log = new Collection([$event1, $event2]);
        $author->save();
        $this->assertEquals($author->id, $event1->related_id);
        $this->assertEquals($author->id, $event2->related_id);
        $this->assertEquals('Database\Tester\Models\Author', $event1->related_type);
        $this->assertEquals('Database\Tester\Models\Author', $event2->related_type);
        $this->assertEquals([
            'user-created',
            'user-updated'
        ], $author->event_log->lists('action'));

        // Set by primary key
        $eventId = $event3->id;
        $author->event_log = $eventId;
        $author->save();
        $event3 = EventLog::find($eventId);
        $this->assertEquals($author->id, $event3->related_id);
        $this->assertEquals('Database\Tester\Models\Author', $event3->related_type);
        $this->assertEquals([
            'user-deleted'
        ], $author->event_log->lists('action'));

        // Nullify
        $author->event_log = null;
        $author->save();
        $event3 = EventLog::find($eventId);
        $this->assertNull($event3->related_type);
        $this->assertNull($event3->related_id);
        $this->assertNull($event3->related);

        // Deferred in memory
        $author->event_log = $event4;
        $this->assertEquals($author->id, $event4->related_id);
        $this->assertEquals('Database\Tester\Models\Author', $event4->related_type);
        $this->assertEquals([
            'user-restored'
        ], $author->event_log->lists('action'));
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $event1 = EventLog::create(['action' => "user-created", 'related_id' => $author->id, 'related_type' => 'Database\Tester\Models\Author']);
        $event2 = EventLog::create(['action' => "user-updated", 'related_id' => $author->id, 'related_type' => 'Database\Tester\Models\Author']);
        Model::reguard();

        $this->assertEquals([$event1->id, $event2->id], $author->getRelationValue('event_log'));
    }

    public function testDeferredBinding()
    {
        $sessionKey = uniqid('session_key', true);

        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $event = EventLog::create(['action' => "user-created"]);
        Model::reguard();

        $eventId = $event->id;

        // Deferred add
        $author->event_log()->add($event, $sessionKey);
        $this->assertNull($event->related_id);
        $this->assertEmpty($author->event_log);

        $this->assertEquals(0, $author->event_log()->count());
        $this->assertEquals(1, $author->event_log()->withDeferred($sessionKey)->count());

        // Commit deferred
        $author->save(null, $sessionKey);
        $event = EventLog::find($eventId);
        $this->assertEquals(1, $author->event_log()->count());
        $this->assertEquals($author->id, $event->related_id);
        $this->assertEquals([
            'user-created'
        ], $author->event_log->lists('action'));

        // New session
        $sessionKey = uniqid('session_key', true);

        // Deferred remove
        $author->event_log()->remove($event, $sessionKey);
        $this->assertEquals(1, $author->event_log()->count());
        $this->assertEquals(0, $author->event_log()->withDeferred($sessionKey)->count());
        $this->assertEquals($author->id, $event->related_id);
        $this->assertEquals([
            'user-created'
        ], $author->event_log->lists('action'));

        // Commit deferred (model is deleted as per definition)
        $author->save(null, $sessionKey);
        $event = EventLog::find($eventId);
        $this->assertEquals(0, $author->event_log()->count());
        $this->assertNull($event);
        $this->assertEmpty($author->event_log);
    }
}
