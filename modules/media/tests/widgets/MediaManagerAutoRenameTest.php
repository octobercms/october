<?php

use Media\Widgets\MediaManager;
use Media\Classes\MediaLibraryItem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';

/**
 * MediaManagerAutoRenameTest covers the media.auto_rename slug mode and the name checks on renames, moves and uploads.
 */
class MediaManagerAutoRenameTest extends PluginTestCase
{
    /**
     * setUp signs in a super user and points the media library at a fake disk.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->actingAs((new BackendUserFixture)->asSuperUser());

        Storage::fake('media');
        App::forgetInstance('media.library');
    }

    /**
     * tearDown clears the postback data and uploaded files between tests.
     */
    public function tearDown(): void
    {
        request()->request->replace();
        request()->files->replace();

        parent::tearDown();
    }

    /**
     * testCreateFolderSlugsName ensures a new folder name is slugged when auto rename is enabled.
     */
    public function testCreateFolderSlugsName()
    {
        Config::set('media.auto_rename', 'slug');

        $this->mergePostback(['name' => 'Dossier Photos 2026!', 'path' => '/']);
        $this->callHandler('onCreateFolder');

        $this->assertEquals(['dossier-photos-2026'], Storage::disk('media')->directories('/'));
    }

    /**
     * testCreateFolderKeepsNameWithoutAutoRename ensures a new folder name is untouched when auto rename is disabled.
     */
    public function testCreateFolderKeepsNameWithoutAutoRename()
    {
        Config::set('media.auto_rename', null);

        $this->mergePostback(['name' => 'Dossier Photos 2026!', 'path' => '/']);
        $this->callHandler('onCreateFolder');

        $this->assertEquals(['Dossier Photos 2026!'], Storage::disk('media')->directories('/'));
    }

    /**
     * testCreateFolderRejectsNameThatSlugsToEmpty ensures a name with no sluggable characters is rejected.
     */
    public function testCreateFolderRejectsNameThatSlugsToEmpty()
    {
        Config::set('media.auto_rename', 'slug');

        $this->mergePostback(['name' => '!!!', 'path' => '/']);

        $this->expectException(ApplicationException::class);
        $this->callHandler('onCreateFolder');
    }

    /**
     * testRenameFolderSlugsName ensures a renamed folder is slugged when auto rename is enabled.
     */
    public function testRenameFolderSlugsName()
    {
        Config::set('media.auto_rename', 'slug');
        Storage::disk('media')->makeDirectory('old-folder');

        $this->mergePostback([
            'name' => "Mes Vacances d'Été",
            'originalPath' => '/old-folder',
            'type' => MediaLibraryItem::TYPE_FOLDER,
        ]);
        $this->callHandler('onApplyName');

        $this->assertEquals(['mes-vacances-dete'], Storage::disk('media')->directories('/'));
    }

    /**
     * testRenameFileSlugsNameAndKeepsExtension ensures a renamed file is slugged with its extension preserved.
     */
    public function testRenameFileSlugsNameAndKeepsExtension()
    {
        Config::set('media.auto_rename', 'slug');
        Storage::disk('media')->put('old-photo.jpg', 'image');

        $this->mergePostback([
            'name' => 'My Holiday Photo.JPG',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);
        $this->callHandler('onApplyName');

        $this->assertEquals(['my-holiday-photo.jpg'], Storage::disk('media')->files('/'));
    }

    /**
     * testRenameFileKeepsNameWithoutAutoRename ensures a renamed file is untouched when auto rename is disabled.
     */
    public function testRenameFileKeepsNameWithoutAutoRename()
    {
        Config::set('media.auto_rename', null);
        Storage::disk('media')->put('old-photo.jpg', 'image');

        $this->mergePostback([
            'name' => 'My Holiday Photo.jpg',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);
        $this->callHandler('onApplyName');

        $this->assertEquals(['My Holiday Photo.jpg'], Storage::disk('media')->files('/'));
    }

    /**
     * testRenameFileRejectsNameThatSlugsToEmpty ensures a name with no sluggable characters does not become a hidden file.
     */
    public function testRenameFileRejectsNameThatSlugsToEmpty()
    {
        Config::set('media.auto_rename', 'slug');
        Storage::disk('media')->put('old-photo.jpg', 'image');

        $this->mergePostback([
            'name' => '!!!.jpg',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);

        try {
            $this->callHandler('onApplyName');
            $this->fail('Expected the rename to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEquals(['old-photo.jpg'], Storage::disk('media')->files('/'));
        }
    }

    /**
     * testRenameFileDoesNotReplaceExistingFile ensures a rename onto an existing file is rejected.
     */
    public function testRenameFileDoesNotReplaceExistingFile()
    {
        Config::set('media.auto_rename', 'slug');
        Storage::disk('media')->put('old-photo.jpg', 'old');
        Storage::disk('media')->put('my-file.jpg', 'existing');

        $this->mergePostback([
            'name' => 'My File.jpg',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);

        try {
            $this->callHandler('onApplyName');
            $this->fail('Expected the rename to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEquals('existing', Storage::disk('media')->get('my-file.jpg'));
            $this->assertEquals('old', Storage::disk('media')->get('old-photo.jpg'));
        }
    }

    /**
     * testRenameFolderDoesNotMergeIntoExistingFolder ensures a rename onto an existing folder is rejected.
     */
    public function testRenameFolderDoesNotMergeIntoExistingFolder()
    {
        Config::set('media.auto_rename', null);
        Storage::disk('media')->makeDirectory('old-folder');
        Storage::disk('media')->makeDirectory('photos');

        $this->mergePostback([
            'name' => 'photos',
            'originalPath' => '/old-folder',
            'type' => MediaLibraryItem::TYPE_FOLDER,
        ]);

        try {
            $this->callHandler('onApplyName');
            $this->fail('Expected the rename to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEqualsCanonicalizing(['old-folder', 'photos'], Storage::disk('media')->directories('/'));
        }
    }

    /**
     * testRenameFileChangesLetterCase ensures changing only the letter case of a name is still a rename.
     */
    public function testRenameFileChangesLetterCase()
    {
        Config::set('media.auto_rename', null);
        Storage::disk('media')->put('Photo.jpg', 'image');

        $this->mergePostback([
            'name' => 'photo.jpg',
            'originalPath' => '/Photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);
        $this->callHandler('onApplyName');

        $this->assertEquals(['photo.jpg'], Storage::disk('media')->files('/'));
    }

    /**
     * testRenameFileDoesNotReplaceNameInOtherCase ensures a rename onto an existing name in another letter case is rejected.
     */
    public function testRenameFileDoesNotReplaceNameInOtherCase()
    {
        Config::set('media.auto_rename', null);
        Storage::disk('media')->put('old-photo.jpg', 'old');
        Storage::disk('media')->put('my-file.jpg', 'existing');

        $this->mergePostback([
            'name' => 'My-File.jpg',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);

        try {
            $this->callHandler('onApplyName');
            $this->fail('Expected the rename to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEquals('existing', Storage::disk('media')->get('my-file.jpg'));
            $this->assertEquals('old', Storage::disk('media')->get('old-photo.jpg'));
        }
    }

    /**
     * testRenameFileRejectsHiddenName ensures a name the library hides is rejected without auto rename too.
     */
    public function testRenameFileRejectsHiddenName()
    {
        Config::set('media.auto_rename', null);
        Storage::disk('media')->put('old-photo.jpg', 'image');

        $this->mergePostback([
            'name' => '.secret.jpg',
            'originalPath' => '/old-photo.jpg',
            'type' => MediaLibraryItem::TYPE_FILE,
        ]);

        try {
            $this->callHandler('onApplyName');
            $this->fail('Expected the rename to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEquals(['old-photo.jpg'], Storage::disk('media')->files('/'));
        }
    }

    /**
     * testMoveItemsMovesIntoFolder ensures a move without a name conflict still goes ahead.
     */
    public function testMoveItemsMovesIntoFolder()
    {
        Storage::disk('media')->put('a/photo.jpg', 'image');
        Storage::disk('media')->makeDirectory('b');

        $this->mergePostback([
            'dest' => '/b',
            'originalPath' => '/a',
            'files' => ['/a/photo.jpg'],
        ]);
        $this->callHandler('onMoveItems');

        $this->assertEquals(['b/photo.jpg'], Storage::disk('media')->allFiles());
    }

    /**
     * testMoveItemsDoesNotReplaceExistingFile ensures a move is rejected before anything moves when a name is taken.
     */
    public function testMoveItemsDoesNotReplaceExistingFile()
    {
        Storage::disk('media')->put('a/other.jpg', 'other');
        Storage::disk('media')->put('a/photo.jpg', 'moving');
        Storage::disk('media')->put('b/Photo.jpg', 'existing');

        $this->mergePostback([
            'dest' => '/b',
            'originalPath' => '/a',
            'files' => ['/a/other.jpg', '/a/photo.jpg'],
        ]);

        try {
            $this->callHandler('onMoveItems');
            $this->fail('Expected the move to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertEqualsCanonicalizing(['a/other.jpg', 'a/photo.jpg', 'b/Photo.jpg'], Storage::disk('media')->allFiles());
            $this->assertEquals('existing', Storage::disk('media')->get('b/Photo.jpg'));
        }
    }

    /**
     * testCheckFilesExistUsesStoredName ensures the overwrite warning checks the slugged name an upload is stored under.
     */
    public function testCheckFilesExistUsesStoredName()
    {
        Config::set('media.auto_rename', 'slug');
        Storage::disk('media')->put('my-file.jpg', 'existing');

        $this->mergePostback([
            'file_names' => ['My File.jpg', 'Other File.jpg'],
            'path' => '/',
        ]);

        $this->assertEquals(['existing' => ['My File.jpg']], $this->callHandler('onCheckFilesExist'));
    }

    /**
     * testUploadRejectsNameThatSlugsToEmpty ensures an upload with no sluggable characters does not become a hidden file.
     */
    public function testUploadRejectsNameThatSlugsToEmpty()
    {
        Config::set('media.auto_rename', 'slug');

        $this->assertSame(400, $this->uploadFile('!!!.jpg')->getStatusCode());
        $this->assertEquals([], Storage::disk('media')->allFiles());
    }

    /**
     * testUploadRejectsHiddenName ensures an upload the library would hide is refused without auto rename too.
     */
    public function testUploadRejectsHiddenName()
    {
        Config::set('media.auto_rename', null);

        $this->assertSame(400, $this->uploadFile('.secret.jpg')->getStatusCode());
        $this->assertEquals([], Storage::disk('media')->allFiles());
    }

    /**
     * uploadFile sends a quick mode upload through a fresh media manager widget and returns its response.
     */
    protected function uploadFile(string $fileName)
    {
        $this->mergePostback(['X_OCTOBER_MEDIA_MANAGER_QUICK_UPLOAD' => 1]);
        request()->files->set('file_data', UploadedFile::fake()->createWithContent($fileName, 'image'));

        $controller = new class extends \Backend\Classes\Controller {
            public function getResponseOverride()
            {
                return $this->responseOverride;
            }
        };

        new MediaManager($controller, 'ocmediamanager');

        return $controller->getResponseOverride();
    }

    /**
     * callHandler runs an AJAX handler on a fresh media manager widget.
     */
    protected function callHandler(string $handler)
    {
        $widget = new MediaManager(new \Backend\Classes\Controller, 'ocmediamanager');

        return $widget->$handler();
    }

    /**
     * mergePostback adds the given data to the current request as POST input.
     */
    protected function mergePostback(array $data): void
    {
        request()->setMethod('POST');
        request()->request->add($data);
    }
}
