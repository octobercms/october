<?php

use Database\Tester\Models\Role;
use Database\Tester\Models\Author;

class BelongsToManyModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Role.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $role1 = Role::create(['name' => "Designer", 'description' => "Quality"]);
        $role2 = Role::create(['name' => "Programmer", 'description' => "Speed"]);
        $role3 = Role::create(['name' => "Manager", 'description' => "Budget"]);
        Model::reguard();

        // Add/remove to collection
        $this->assertFalse($author->roles->contains($role1->id));
        $author->roles()->add($role1);
        $author->roles()->add($role2);
        $this->assertTrue($author->roles->contains($role1->id));
        $this->assertTrue($author->roles->contains($role2->id));

        // Set by Model object
        $author->roles = $role1;
        $this->assertEquals(1, $author->roles->count());
        $this->assertEquals('Designer', $author->roles->first()->name);

        $author->roles = [$role1, $role2, $role3];
        $this->assertEquals(3, $author->roles->count());

        // Set by primary key
        $author->roles = $role2->id;
        $this->assertEquals(1, $author->roles->count());
        $this->assertEquals('Programmer', $author->roles->first()->name);

        $author->roles = [$role2->id, $role3->id];
        $this->assertEquals(2, $author->roles->count());

        // Nullify
        $author->roles = null;
        $this->assertEquals(0, $author->roles->count());

        // Extra nullify checks (still exists in DB until saved)
        $author->reloadRelations('roles');
        $this->assertEquals(2, $author->roles->count());
        $author->save();
        $author->reloadRelations('roles');
        $this->assertEquals(0, $author->roles->count());

        // Deferred in memory
        $author->roles = [$role2->id, $role3->id];
        $this->assertEquals(2, $author->roles->count());
        $this->assertEquals('Programmer', $author->roles->first()->name);
    }

    public function testGetRelationValue()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $role1 = Role::create(['name' => "Designer", 'description' => "Quality"]);
        $role2 = Role::create(['name' => "Programmer", 'description' => "Speed"]);
        Model::reguard();

        $author->roles()->add($role1);
        $author->roles()->add($role2);

        $this->assertEquals([$role1->id, $role2->id], $author->getRelationValue('roles'));
    }

    public function testDeferredBinding()
    {
        $sessionKey = uniqid('session_key', true);

        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $role1 = Role::create(['name' => "Designer", 'description' => "Quality"]);
        $role2 = Role::create(['name' => "Programmer", 'description' => "Speed"]);
        Model::reguard();

        // Deferred add
        $author->roles()->add($role1, $sessionKey);
        $author->roles()->add($role2, $sessionKey);
        $this->assertEmpty($author->roles);

        $this->assertEquals(0, $author->roles()->count());
        $this->assertEquals(2, $author->roles()->withDeferred($sessionKey)->count());

        // Get simple value (implicit)
        $author->reloadRelations();
        $author->sessionKey = $sessionKey;
        $this->assertEquals([$role1->id, $role2->id], $author->getRelationValue('roles'));

        // Get simple value (explicit)
        $relatedIds = $author->roles()->allRelatedIds($sessionKey)->all();
        $this->assertEquals([$role1->id, $role2->id], $relatedIds);

        // Commit deferred
        $author->save(null, $sessionKey);
        $this->assertEquals(2, $author->roles()->count());
        $this->assertEquals('Designer', $author->roles->first()->name);

        // New session
        $sessionKey = uniqid('session_key', true);

        // Deferred remove
        $author->roles()->remove($role1, $sessionKey);
        $author->roles()->remove($role2, $sessionKey);
        $this->assertEquals(2, $author->roles()->count());
        $this->assertEquals(0, $author->roles()->withDeferred($sessionKey)->count());
        $this->assertEquals('Designer', $author->roles->first()->name);

        // Commit deferred
        $author->save(null, $sessionKey);
        $this->assertEquals(0, $author->roles()->count());
        $this->assertEquals(0, $author->roles->count());
    }

    public function testDetachAfterDelete()
    {
        // Needed for other "delete" events
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/User.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/EventLog.php';

        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $role1 = Role::create(['name' => "Designer", 'description' => "Quality"]);
        $role2 = Role::create(['name' => "Programmer", 'description' => "Speed"]);
        $role3 = Role::create(['name' => "Manager", 'description' => "Budget"]);
        Model::reguard();

        $author->roles()->add($role1);
        $author->roles()->add($role2);
        $author->roles()->add($role3);
        $this->assertEquals(3, Db::table('database_tester_authors_roles')->where('author_id', $author->id)->count());

        $author->delete();
        $this->assertEquals(0, Db::table('database_tester_authors_roles')->where('author_id', $author->id)->count());
    }

    public function testConditionsWithPivotAttributes()
    {
        Model::unguard();
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $role1 = Role::create(['name' => "Designer", 'description' => "Quality"]);
        $role2 = Role::create(['name' => "Programmer", 'description' => "Speed"]);
        $role3 = Role::create(['name' => "Manager", 'description' => "Budget"]);
        Model::reguard();

        $author->roles()->add($role1, null, ['is_executive' => 1]);
        $author->roles()->add($role2, null, ['is_executive' => 1]);
        $author->roles()->add($role3, null, ['is_executive' => 0]);

        $this->assertEquals([1, 2], $author->executive_authors->lists('id'));
        $this->assertEquals([1, 2], $author->executive_authors()->lists('id'));
        $this->assertEquals([1, 2], $author->executive_authors()->get()->lists('id'));
    }
}
