<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

/**
 * FileUploadPreviewModeModel is a plain model with a file attachment relation.
 */
class FileUploadPreviewModeModel extends Model
{
    public $attachMany = [
        'files' => \System\Models\File::class,
    ];
}

/**
 * FileUploadPreviewModeTest covers the write handlers of the file upload widget in preview mode.
 */
class FileUploadPreviewModeTest extends PluginTestCase
{
    /**
     * makeFileUpload returns the file upload widget from a form in preview mode.
     */
    protected function makeFileUpload(): \Backend\FormWidgets\FileUpload
    {
        $form = new Form(new \Backend\Classes\Controller, [
            'model' => new FileUploadPreviewModeModel,
            'arrayName' => 'FileUploadPreviewModeModel',
            'previewMode' => true,
            'fields' => [
                'files' => ['type' => 'fileupload'],
            ],
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return $form->getFormWidget('files');
    }

    /**
     * @dataProvider writeHandlerProvider
     */
    public function testWriteHandlersAreForbiddenInPreviewMode(string $handler)
    {
        $fileUpload = $this->makeFileUpload();

        $this->assertTrue($fileUpload->previewMode);

        $this->expectException(ForbiddenException::class);
        $fileUpload->$handler();
    }

    public static function writeHandlerProvider(): array
    {
        return [
            ['onUpload'],
            ['onRemoveAttachment'],
            ['onSortAttachments'],
            ['onSaveAttachmentConfig'],
        ];
    }
}
