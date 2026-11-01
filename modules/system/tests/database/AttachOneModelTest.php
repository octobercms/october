<?php

use System\Models\File as FileModel;
use Database\Tester\Models\User;
use Database\Tester\Models\SoftDeleteUser;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AttachOneModelTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        include_once base_path('modules/system/tests/fixtures/plugins/database/tester/models/User.php');

        $this->migratePlugin('Database.Tester');
    }

    public function testSetRelationValue()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $user2 = User::create(['name' => 'Joe', 'email' => 'joe@email.tld']);
        Model::reguard();

        // Set by model object
        $file = $user->avatar()->make();
        $file->fromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->avatar = $file;
        $user->save();

        $this->assertNotNull($user->avatar);
        $this->assertEquals('avatar.png', $user->avatar->file_name);

        // Set by Uploaded file
        $sample = $user->avatar;
        $upload = new UploadedFile(
            base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'),
            $sample->file_name,
            $sample->content_type,
            null,
            true
        );

        $user2->avatar = $upload;

        // The file is prepped but not yet committed, this is for validation
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
        $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->unsetRelations();
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
        $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->unsetRelations();
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

        $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $this->assertNotNull($user->avatar);

        $avatarId = $user->avatar->id;
        $user->delete();
        $this->assertNotNull(FileModel::find($avatarId));
    }

    public function testReplaceWithAddDeletesPreviousFile()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $first = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $firstPath = $first->getLocalPath();
        $this->assertFileExists($firstPath);

        $second = new FileModel;
        $second->fromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->avatar()->add($second);

        $this->assertNull(FileModel::find($first->id));
        $this->assertFileDoesNotExist($firstPath);
        $this->assertNotNull(FileModel::find($second->id));
        $this->assertFileExists($second->getLocalPath());
    }

    public function testReplaceWithUploadDeletesPreviousFile()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $first = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $firstPath = $first->getLocalPath();
        $this->assertFileExists($firstPath);

        $user->avatar = $this->makeUploadedFile();
        $user->save();

        $this->assertNull(FileModel::find($first->id));
        $this->assertFileDoesNotExist($firstPath);
        $this->assertNotNull($user->avatar);
        $this->assertFileExists($user->avatar->getLocalPath());
    }

    public function testReplaceWithDeferredBindingDeletesPreviousFile()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $first = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $firstPath = $first->getLocalPath();
        $this->assertFileExists($firstPath);

        $sessionKey = uniqid('session_key', true);
        $second = new FileModel;
        $second->fromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $second->is_public = true;
        $second->save();

        $user->avatar()->add($second, $sessionKey);
        $user->save(null, $sessionKey);

        $this->assertNull(FileModel::find($first->id));
        $this->assertFileDoesNotExist($firstPath);
        $this->assertNotNull(FileModel::find($second->id));
        $this->assertFileExists($second->getLocalPath());
    }

    public function testAddingCurrentFileKeepsIt()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $file = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $filePath = $file->getLocalPath();

        $user->avatar()->add($file);

        $this->assertNotNull(FileModel::find($file->id));
        $this->assertFileExists($filePath);
    }

    public function testAddingCurrentFileWithDeferredBindingKeepsIt()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $file = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $filePath = $file->getLocalPath();

        $sessionKey = uniqid('session_key', true);
        $user->avatar()->add($file, $sessionKey);
        $user->save(null, $sessionKey);

        $this->assertNotNull(FileModel::find($file->id));
        $this->assertFileExists($filePath);
    }

    public function testSetNullDeletesFile()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $file = $user->avatar()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $filePath = $file->getLocalPath();
        $this->assertFileExists($filePath);

        $user->avatar = null;
        $user->save();

        $this->assertNull(FileModel::find($file->id));
        $this->assertFileDoesNotExist($filePath);
    }

    /**
     * makeUploadedFile builds a test upload from a copied fixture image
     */
    protected function makeUploadedFile(): UploadedFile
    {
        $path = temp_path('attach-one-test.png');
        copy(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'), $path);

        return new UploadedFile($path, 'avatar.png', 'image/png', null, true);
    }
}
