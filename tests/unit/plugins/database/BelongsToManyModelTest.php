<?php

use Database\Tester\Models\Role;
use Database\Tester\Models\Author;

class BelongsToManyModelTest extends PluginTestCase
{
    public function setUp()
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

        // Add to collection
        $this->assertFalse($author->roles->contains($role1));
        $author->roles()->add($role1);

        // TODO: Should this occur as part of add() above?
        $author->roles->push($role1);

        $this->assertTrue($author->roles->contains($role1));
    }
}
