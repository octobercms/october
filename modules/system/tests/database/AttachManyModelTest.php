<?php

use System\Models\File as FileModel;
use Database\Tester\Models\User;
use Database\Tester\Models\UserWithPhotosValidation;
use October\Rain\Database\ModelException;
use Illuminate\Http\UploadedFile;

class AttachManyModelTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        include_once base_path() . '/modules/system/tests/fixtures/plugins/database/tester/models/User.php';

        $this->migratePlugin('Database.Tester');
    }

    public function testDeleteFlagDestroyRelationship()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $this->assertEmpty($user->photos);

        $user->photos()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->unsetRelations();
        $this->assertNotEmpty($user->photos);

        $photo = $user->photos->first();
        $photoId = $photo->id;

        $user->photos()->remove($photo);
        $this->assertNull(FileModel::find($photoId));
    }

    public function testDeleteFlagDeleteModel()
    {
        Model::unguard();
        $user = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        Model::reguard();

        $this->assertEmpty($user->photos);
        $user->photos()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user->unsetRelations();
        $this->assertNotEmpty($user->photos);

        $photo = $user->photos->first();
        $this->assertNotNull($photo);
        $photoId = $photo->id;

        $user->delete();
        $this->assertNull(FileModel::find($photoId));
    }

    public function testRequiredValidationWithNewUpload()
    {
        $user = new UserWithPhotosValidation(['name' => 'Stevie', 'email' => 'stevie@email.tld']);

        // Saving without photos fails the required rule
        try {
            $user->save();
            $this->fail('Expected validation to fail without photos');
        }
        catch (ModelException $ex) {
            $this->assertArrayHasKey('photos', $ex->getErrors()->messages());
        }

        // A pending upload satisfies the required rule before the file exists
        $user->photos = $this->makeUploadedFile();
        $user->save();

        $user->unsetRelations();
        $this->assertCount(1, $user->photos);
    }

    public function testRequiredValidationAppendsToExistingFiles()
    {
        Model::unguard();
        $user = UserWithPhotosValidation::make(['name' => 'Jerry', 'email' => 'jerry@email.tld']);
        Model::reguard();

        $user->photos = $this->makeUploadedFile();
        $user->save();

        // Append a standalone File model to the saved record
        $file = new FileModel;
        $file->fromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $file->save();

        $user = UserWithPhotosValidation::find($user->id);
        $user->photos = $file;

        // Validation data now holds an existing Attach\File plus the appended model
        $user->save();

        $user->unsetRelations();
        $this->assertCount(2, $user->photos);
    }

    public function testRemovalProtection()
    {
        Model::unguard();
        $user1 = User::create(['name' => 'Stevie', 'email' => 'stevie@email.tld']);
        $user2 = User::create(['name' => 'Jerry', 'email' => 'jerry@email.tld']);
        Model::reguard();

        $user1->photos()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $user2->photos()->createFromFile(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'));

        $user1Photo = $user1->photos->first();
        $user1PhotoId = $user1Photo->id;

        // Attempt to remove user 1's photo from user 2
        $user2->photos()->remove($user1Photo);
        $this->assertNotNull(FileModel::find($user1PhotoId));

        $user2Photo = $user2->photos->first();
        $this->assertNotNull($user2Photo);
    }

    /**
     * makeUploadedFile builds a test upload from a copied fixture image
     */
    protected function makeUploadedFile(): UploadedFile
    {
        $path = temp_path('attach-many-test.png');
        copy(base_path('modules/system/tests/fixtures/plugins/database/tester/assets/images/avatar.png'), $path);

        return new UploadedFile($path, 'avatar.png', 'image/png', null, true);
    }
}
