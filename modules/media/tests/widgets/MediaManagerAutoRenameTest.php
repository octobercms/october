<?php

use Media\Widgets\MediaManager;
use Media\Classes\MediaLibraryItem;
use Illuminate\Support\Facades\Storage;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';

/**
 * MediaManagerAutoRenameTest covers the media.auto_rename slug mode on folder creation and item renaming.
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
     * tearDown clears the postback data between tests.
     */
    public function tearDown(): void
    {
        request()->request->replace();

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
