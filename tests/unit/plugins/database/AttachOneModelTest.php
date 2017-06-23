<?php

use System\Models\File as FileModel;
use Database\Tester\Models\User;
use Database\Tester\Models\SoftDeleteUser;

class AttachOneModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/User.php';

        $this->runPluginRefreshCommand('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        // Set by string
        $user->avatar = base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png';
        $user->save();
        $this->assertNotNull($user->avatar);
        $this->assertEquals('avatar.png', $user->avatar->file_name);
    }

    public function testDeleteFlagDestroyRelationship()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $this->assertNull($user->avatar);
        $user->avatar()->create(['data' => base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png']);
        $user->reloadRelations();
        $this->assertNotNull($user->avatar);

        $avatar = $user->avatar;
        $avatarId = $avatar->id;

        $user->avatar()->remove($avatar);
        $this->assertNull(FileModel::find($avatarId));
    }

    public function testDeleteFlagDeleteModel()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $this->assertNull($user->avatar);
        $user->avatar()->create(['data' => base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png']);
        $user->reloadRelations();
        $this->assertNotNull($user->avatar);

        $avatarId = $user->avatar->id;
        $user->delete();
        $this->assertNull(FileModel::find($avatarId));
    }

    public function testDeleteFlagSoftDeleteModel()
    {
        Model::unguard();
        $user = SoftDeleteUser::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $user->avatar()->create(['data' => base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png']);
        $this->assertNotNull($user->avatar);

        $avatarId = $user->avatar->id;
        $user->delete();
        $this->assertNotNull(FileModel::find($avatarId));
    }
}
