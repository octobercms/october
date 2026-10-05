<?php

use Backend\Widgets\Form;
use Backend\Classes\Controller;
use System\Models\File;
use October\Rain\Database\Model;

/**
 * FileUploadTranslatableModel is a translatable host model with a translated image.
 */
class FileUploadTranslatableModel extends Model
{
    use \October\Rain\Database\Traits\Translatable;
    use \October\Rain\Database\Traits\TranslatableAttachments;

    public static $activeLocale = 'en';

    public $table = 'file_upload_translatables';

    public $translatable = ['name', 'image'];

    public $attachOne = [
        'image' => File::class
    ];

    protected function resolveTranslatableLocale()
    {
        return static::$activeLocale;
    }

    protected function resolveTranslatableDefaultLocale()
    {
        return 'en';
    }
}

/**
 * FileUploadTranslatableTest covers file uploads on translated attachment relations.
 */
class FileUploadTranslatableTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        if (!Schema::hasTable('file_upload_translatables')) {
            Schema::create('file_upload_translatables', function ($table) {
                $table->increments('id');
                $table->string('name')->nullable();
                $table->timestamps();
            });
        }

        FileUploadTranslatableModel::$activeLocale = 'en';
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('file_upload_translatables');
        File::where('attachment_type', FileUploadTranslatableModel::class)->delete();
        File::where('file_name', 'like', 'popup-test-%')->delete();
        FileUploadTranslatableModel::$activeLocale = 'en';
        Site::resetCache();

        parent::tearDown();
    }

    /**
     * testFileUploadOffersTranslatePopup confirms translated uploads show the translate popup
     */
    public function testFileUploadOffersTranslatePopup()
    {
        $form = $this->makeForm($this->makeModel());

        $this->assertTrue($form->getField('name')->translatable);
        $this->assertTrue($form->getField('image')->translatable);
    }

    /**
     * testTranslatePopupUploadCommitsToSiteLocale confirms popup widgets bind on their own requests and save to the site locale
     */
    public function testTranslatePopupUploadCommitsToSiteLocale()
    {
        $site = $this->makeSite('fr');
        $model = $this->makeModel();
        $model->image()->add($this->makeFile('popup-test-base.jpg'));

        // An upload request from the popup targets the popup widget, which must be rebuilt to be found
        $popupAlias = 'formTranslateField' . $site->id . 'Image';
        $postData = ['field_name' => 'image', 'site_id' => $site->id, '_session_key' => 'mainkey'];
        $this->swapRequest($postData, $popupAlias . '::onUpload');

        $controller = new Controller;
        $this->makeForm(FileUploadTranslatableModel::find($model->id), $controller);

        $upload = $controller->widget->{$popupAlias} ?? null;
        $this->assertInstanceOf(\Backend\FormWidgets\FileUpload::class, $upload);
        $this->assertSame('mainkeyTranslateField' . $site->id, $upload->getSessionKey());

        $file = $this->makeFile('popup-test-french.jpg');
        $file->save();
        self::callProtectedMethod($upload, 'getRelationObject')->add($file, $upload->getSessionKey());

        // Saving the main form does not commit the popup upload
        FileUploadTranslatableModel::find($model->id)->save(null, 'mainkey');
        $this->assertNull(File::where('file_name', 'popup-test-french.jpg')->value('field'));

        // Saving the popup commits it to the site locale
        $this->swapRequest($postData, 'form::onSaveTranslateField');
        $this->makeForm(FileUploadTranslatableModel::find($model->id), new Controller)->onSaveTranslateField();

        $this->assertSame('image:fr', File::where('file_name', 'popup-test-french.jpg')->value('field'));
        $this->assertSame('image', File::where('file_name', 'popup-test-base.jpg')->value('field'));
    }

    /**
     * testLocaleListsOnlyItsOwnFiles confirms the inherited default file is not listed as a locale file
     */
    public function testLocaleListsOnlyItsOwnFiles()
    {
        $model = $this->makeModel();
        $model->image()->add($this->makeFile('base.jpg'));

        FileUploadTranslatableModel::$activeLocale = 'fr';
        $french = FileUploadTranslatableModel::find($model->id);
        $form = $this->makeForm($french);

        $this->assertSame('base.jpg', $french->image->file_name);
        $this->assertCount(0, $this->getFileList($form));

        $french->image()->add($this->makeFile('french.jpg'));
        $form = $this->makeForm(FileUploadTranslatableModel::find($model->id));
        $this->assertSame(['french.jpg'], $this->getFileList($form)->pluck('file_name')->all());
    }

    /**
     * testDefaultLocaleListsDefaultFiles confirms the default locale keeps the in-memory listing
     */
    public function testDefaultLocaleListsDefaultFiles()
    {
        $model = $this->makeModel();
        $model->image()->add($this->makeFile('base.jpg'));

        $form = $this->makeForm(FileUploadTranslatableModel::find($model->id));

        $this->assertSame(['base.jpg'], $this->getFileList($form)->pluck('file_name')->all());
    }

    /**
     * makeModel creates a saved model in the default locale
     */
    protected function makeModel()
    {
        $model = new FileUploadTranslatableModel;
        $model->name = 'Product';
        $model->save();

        return $model;
    }

    /**
     * makeFile returns an unsaved file model with a file name
     */
    protected function makeFile($name)
    {
        $file = new File;
        $file->file_name = $name;
        $file->disk_name = uniqid() . '.jpg';
        $file->file_size = 0;
        $file->content_type = 'image/jpeg';

        return $file;
    }

    /**
     * makeSite creates an extra site that can be edited in the backend
     */
    protected function makeSite(string $locale)
    {
        $site = new \System\Models\SiteDefinition;
        $site->name = 'Site ' . $locale;
        $site->code = 'site-' . $locale;
        $site->locale = $locale;
        $site->is_enabled = true;
        $site->is_enabled_edit = true;
        $site->save();

        Site::resetCache();

        return $site;
    }

    /**
     * swapRequest replaces the request with an AJAX post to the given handler
     */
    protected function swapRequest(array $data, string $handler)
    {
        $request = \Illuminate\Http\Request::create('/', 'POST', $data, [], [], [
            'HTTP_X_AJAX_HANDLER' => $handler,
            'HTTP_X_REQUESTED_WITH' => 'XMLHttpRequest'
        ]);
        $this->app->instance('request', $request);
        \Illuminate\Support\Facades\Facade::clearResolvedInstance('request');
    }

    /**
     * makeForm builds a form with a translatable text field and image upload
     */
    protected function makeForm($model, $controller = null)
    {
        $form = new Form($controller ?: new Controller, [
            'model' => $model,
            'arrayName' => 'FileUploadTranslatableModel',
            'fields' => [
                'name' => ['type' => 'text'],
                'image' => ['type' => 'fileupload', 'mode' => 'image']
            ]
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return $form;
    }

    /**
     * getFileList returns the files listed by the image upload widget
     */
    protected function getFileList($form)
    {
        return self::callProtectedMethod($form->getFormWidget('image'), 'getFileList');
    }
}
