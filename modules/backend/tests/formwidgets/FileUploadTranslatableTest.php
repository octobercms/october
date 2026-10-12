<?php

use Backend\Widgets\Form;
use Backend\Classes\Controller;
use System\Models\File;
use System\Models\TranslatableFile;
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
        'image' => File::class,
        'document' => TranslatableFile::class
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
        Db::table('system_translate_attributes')->where('model_type', TranslatableFile::class)->delete();
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
     * testAttachmentConfigBindsFileToPopups confirms popups opened from the attachment config form post the file
     */
    public function testAttachmentConfigBindsFileToPopups()
    {
        $site = $this->makeSite('fr');
        $model = $this->makeModel();
        $file = $this->addDocument($model);

        $this->swapRequest($this->getCaptionPostData($file, $site), 'formDocument::onLoadAttachmentConfig');
        $controller = new Controller;
        $form = $this->makeForm(FileUploadTranslatableModel::find($model->id), $controller);
        $configForm = $controller->widget->formDocumentfileupload;

        $this->assertTrue($configForm->getField('title')->translatable);
        $this->assertTrue($configForm->getField('description')->translatable);

        $markup = $form->getFormWidget('document')->onLoadAttachmentConfig();
        $this->assertStringContainsString('oc.popup.bindToPopups(', $markup);
        $this->assertStringContainsString('file_id: ' . $file->id . ',', $markup);
    }

    /**
     * testCaptionTranslationSavesToSiteLocale confirms a caption saved from the translate popup only changes that locale
     */
    public function testCaptionTranslationSavesToSiteLocale()
    {
        $site = $this->makeSite('fr');
        $model = $this->makeModel();
        $file = $this->addDocument($model);

        $postData = $this->getCaptionPostData($file, $site) + ['TranslateField' => ['title' => 'Guide']];
        $this->swapRequest($postData, 'formDocumentfileupload::onSaveTranslateField');
        $this->makeCaptionConfigForm($model)->onSaveTranslateField();

        $this->assertSame('Manual', TranslatableFile::find($file->id)->title);

        Site::withContext($site->id, function () use ($file) {
            $this->assertSame('Guide', TranslatableFile::find($file->id)->title);
        });
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
     * addDocument attaches a captioned document to the model
     */
    protected function addDocument($model)
    {
        $file = new TranslatableFile;
        $file->file_name = 'popup-test-manual.pdf';
        $file->disk_name = uniqid() . '.pdf';
        $file->file_size = 0;
        $file->content_type = 'application/pdf';
        $file->title = 'Manual';
        $model->document()->add($file);

        return $file;
    }

    /**
     * getCaptionPostData returns the request data posted by the caption translate popup of a site
     */
    protected function getCaptionPostData($file, $site): array
    {
        return [
            'file_id' => $file->id,
            'fileupload_flag' => 1,
            'field_name' => 'title',
            'site_id' => $site->id,
            '_session_key' => 'mainkey'
        ];
    }

    /**
     * makeCaptionConfigForm builds the form for the current request and returns the attachment config form
     */
    protected function makeCaptionConfigForm($model)
    {
        $controller = new Controller;
        $this->makeForm(FileUploadTranslatableModel::find($model->id), $controller);

        $configForm = $controller->widget->formDocumentfileupload ?? null;
        $this->assertInstanceOf(Form::class, $configForm);

        return $configForm;
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
                'image' => ['type' => 'fileupload', 'mode' => 'image'],
                'document' => ['type' => 'fileupload', 'mode' => 'file']
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
