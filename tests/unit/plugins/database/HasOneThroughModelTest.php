<?php

use Database\Tester\Models\Author;
use Database\Tester\Models\Phone;
use Database\Tester\Models\User;

class HasOneThroughModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/User.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Author.php';
        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Phone.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testGet()
    {
        Model::unguard();
        $phone = Phone::create(['number' => '08 1234 5678']);
        $author = Author::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        // Set data
        $author->phone = $phone;
        $author->user = $user;
        $author->save();

        $user = User::with([
            'phone'
        ])->find($user->id);

        $this->assertEquals($phone->id, $user->phone->id);
    }
}
