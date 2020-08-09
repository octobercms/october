<?php

use Database\Tester\Models\Author;
use Database\Tester\Models\Phone;

class HasOneModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Phone.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $phone1 = Phone::create(['number' => '0404040404']);
        $phone2 = Phone::create(['number' => '0505050505']);
        $phone3 = Phone::make(['number' => '0606060606']);
        Model::reguard();

        // Set by Model object
        $author->phone = $phone1;
        $author->save();
        $this->assertEquals($author->id, $phone1->author_id);
        $this->assertEquals('0404040404', $author->phone->number);

        // Double check
        $phone1 = Phone::find($phone1->id);
        $this->assertEquals($author->id, $phone1->author_id);

        // Set by primary key
        $phoneId = $phone2->id;
        $author->phone = $phoneId;
        $author->save();
        $phone2 = Phone::find($phoneId);
        $this->assertEquals($author->id, $phone2->author_id);
        $this->assertEquals('0505050505', $author->phone->number);

        // Ensure relationship is "stolen" from first model
        $phone1 = Phone::find($phone1->id);
        $this->assertNotEquals($author->id, $phone1->author_id);

        // Nullify
        $author->phone = null;
        $author->save();
        $phone2 = Phone::find($phoneId);
        $this->assertNull($phone2->author_id);
        $this->assertNull($phone2->author);

        // Deferred in memory
        $author->phone = $phone3;
        $this->assertEquals('0606060606', $author->phone->number);
        $this->assertEquals($author->id, $phone3->author_id);
    }

    public function testSetRelationValueTwice()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $phone = Phone::create(['number' => '0505050505']);
        Model::reguard();

        $phoneId = $phone->id;
        $author->phone = $phoneId;
        $author->save();

        $author->phone = $phoneId;
        $author->save();

        $phone = Phone::find($phoneId);
        $this->assertEquals($author->id, $phone->author_id);
        $this->assertEquals('0505050505', $author->phone->number);
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $phone = Phone::create(['number' => '0404040404', 'author_id' => $author->id]);
        Model::reguard();

        $this->assertEquals($phone->id, $author->getRelationValue('phone'));
    }

    public function testDeferredBinding()
    {
        $sessionKey = uniqid('session_key', true);

        Model::unguard();
        $author = Author::create(['name' => 'Stevie']);
        $phone = Phone::create(['number' => '0404040404']);
        Model::reguard();

        $phoneId = $phone->id;

        // Deferred add
        $author->phone()->add($phone, $sessionKey);
        $this->assertNull($phone->author_id);
        $this->assertNull($author->phone);

        $this->assertEquals(0, $author->phone()->count());
        $this->assertEquals(1, $author->phone()->withDeferred($sessionKey)->count());

        // Commit deferred
        $author->save(null, $sessionKey);
        $phone = Phone::find($phoneId);
        $this->assertEquals(1, $author->phone()->count());
        $this->assertEquals($author->id, $phone->author_id);
        $this->assertEquals('0404040404', $author->phone->number);

        // New session
        $sessionKey = uniqid('session_key', true);

        // Deferred remove
        $author->phone()->remove($phone, $sessionKey);
        $this->assertEquals(1, $author->phone()->count());
        $this->assertEquals(0, $author->phone()->withDeferred($sessionKey)->count());
        $this->assertEquals($author->id, $phone->author_id);
        $this->assertEquals('0404040404', $author->phone->number);

        // Commit deferred
        $author->save(null, $sessionKey);
        $phone = Phone::find($phoneId);
        $this->assertEquals(0, $author->phone()->count());
        $this->assertNull($phone->author_id);
        $this->assertNull($author->phone);
    }
}
