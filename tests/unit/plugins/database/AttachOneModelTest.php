<?php

use System\Models\File as FileModel;
use Database\Tester\Models\User;
use Database\Tester\Models\SoftDeleteUser;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
        $user2 = User::create(['name' => 'Joe', 'email' => 'joe@email.tld']);
        Model::reguard();

        // Set by string
        $user->avatar = base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png';

        // @todo $user->avatar currently sits as a string, not good for validation
        // this should really assert as an UploadedFile instead.

        // Commit the file and it should snap to a File model
        $user->save();

        $this->assertNotNull($user->avatar);
        $this->assertEquals('avatar.png', $user->avatar->file_name);

        // Set by Uploaded file
        $sample = $user->avatar;
        $upload = new UploadedFile(
            base_path().'/tests/fixtures/plugins/database/tester/assets/images/avatar.png',
            $sample->file_name,
            $sample->content_type,
            $sample->file_size,
            null,
            true
        );

        $user2->avatar = $upload;

        // The file is prepped but not yet commited, this is for validation
        $this->assertNotNull($user2->avatar);
        $this->assertEquals($upload, $user2->avatar);

        // Commit the file and it should snap to a File model
        $user2->save();

        $this->assertNotNull($user2->avatar);
        $this->assertEquals('avatar.png', $user2->avatar->file_name);
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
