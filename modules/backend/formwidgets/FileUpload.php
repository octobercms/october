<?php namespace Backend\FormWidgets;

use Str;
use Input;
use Validator;
use System\Models\File;
use ApplicationException;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use ValidationException;
use Exception;

/**
 * File upload field
 * Renders a form file uploader field.
 *
 * Supported options:
 * - mode: image-single, image-multi, file-single, file-multi
 * - upload-label: Add file
 * - empty-label: No file uploaded
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FileUpload extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var int Preview image width
     */
    public $imageWidth = 100;

    /**
     * @var int Preview image height
     */
    public $imageHeight = 100;

    /**
     * @var string Text to display when no file is associated
     */
    public $previewNoFilesMessage = 'backend::lang.form.preview_no_files_message';

    /**
     * @var mixed Collection of acceptable file types.
     */
    public $fileTypes = false;

    /**
     * @var array Options used for generating thumbnails.
     */
    public $thumbOptions = [
        'mode'      => 'crop',
        'extension' => 'auto'
    ];

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'fileupload';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'imageWidth',
            'imageHeight',
            'previewNoFilesMessage',
            'fileTypes',
            'thumbOptions'
        ]);

        $this->checkUploadPostback();
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['fileList'] = $this->getFileList();
        $this->vars['singleFile'] = array_get($this->vars['fileList'], 0, null);
        $this->vars['displayMode'] = $this->getDisplayMode();
        $this->vars['emptyIcon'] = $this->getConfig('emptyIcon', 'icon-plus');
        $this->vars['imageHeight'] = $this->imageHeight;
        $this->vars['imageWidth'] = $this->imageWidth;
        $this->vars['acceptedFileTypes'] = $this->getAcceptedFileTypes(true);
    }

    protected function getFileList()
    {
        $list = $this->getRelationObject()->withDeferred($this->sessionKey)->orderBy('sort_order')->get();

        /*
         * Set the thumb for each file
         */
        foreach ($list as $file) {
            $file->thumb = $file->getThumb($this->imageWidth, $this->imageHeight, $this->thumbOptions);
        }

        return $list;
    }

    /**
     * Returns the display mode for the file upload. Eg: file-multi, image-single, etc.
     * @return string
     */
    protected function getDisplayMode()
    {
        $mode = $this->getConfig('mode', 'image');

        if (str_contains($mode, '-')) {
            return $mode;
        }

        $relationType = $this->getRelationType();
        $mode .= ($relationType == 'attachMany' || $relationType == 'morphMany') ? '-multi' : '-single';

        return $mode;
    }

    /**
     * Returns the specified accepted file types, or the default
     * based on the mode. Image mode will return:
     * - jpg,jpeg,bmp,png,gif,svg
     * @return string
     */
    public function getAcceptedFileTypes($includeDot = false)
    {
        $types = $this->fileTypes;
        if ($types === false && starts_with($this->getDisplayMode(), 'image')) {
            $types = 'jpg,jpeg,bmp,png,gif,svg';
        }

        if (!$types) {
            return null;
        }

        if (!is_array($types)) {
            $types = explode(',', $types);
        }

        $types = array_map(function($value) use ($includeDot) {
            $value = trim($value);

            if (substr($value, 0, 1) == '.') {
                $value = substr($value, 1);
            }

            if ($includeDot) {
                $value = '.'.$value;
            }

            return $value;
        }, $types);

        return implode(',', $types);
    }

    /**
     * Returns the value as a relation object from the model,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationObject()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);

        if (!$model->hasRelation($attribute)) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($model),
                'relation' => $attribute
            ]));
        }

        return $model->{$attribute}();
    }

    /**
     * Returns the value as a relation type from the model,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationType()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
        return $model->getRelationType($attribute);
    }

    /**
     * Removes a file attachment.
     */
    public function onRemoveAttachment()
    {
        if (($file_id = post('file_id')) && ($file = File::find($file_id))) {
            $this->getRelationObject()->remove($file, $this->sessionKey);
        }
    }

    /**
     * Sorts file attachments.
     */
    public function onSortAttachments()
    {
        if ($sortData = post('sortOrder')) {
            $ids = array_keys($sortData);
            $orders = array_values($sortData);

            $file = new File;
            $file->setSortableOrder($ids, $orders);
        }
    }

    /**
     * Loads the configuration form for an attachment, allowing title and description to be set.
     */
    public function onLoadAttachmentConfig()
    {
        if (($file_id = post('file_id')) && ($file = File::find($file_id))) {
            $this->vars['file'] = $file;
            return $this->makePartial('config_form');
        }

        throw new ApplicationException('Unable to find file, it may no longer exist');
    }

    /**
     * Commit the changes of the attachment configuration form.
     */
    public function onSaveAttachmentConfig()
    {
        try {
            if (($file_id = post('file_id')) && ($file = File::find($file_id))) {
                $file->title = post('title');
                $file->description = post('description');
                $file->save();

                $file->thumb = $file->getThumb($this->imageWidth, $this->imageHeight, $this->thumbOptions);
                return ['item' => $file->toArray()];
            }

            throw new ApplicationException('Unable to find file, it may no longer exist');
        }
        catch (Exception $ex) {
            return json_encode(['error' => $ex->getMessage()]);
        }
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/fileupload.css', 'core');
        $this->addJs('js/fileupload.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return FormField::NO_SAVE_DATA;
    }

    /**
     * Checks the current request to see if it is a postback containing a file upload
     * for this particular widget.
     */
    protected function checkUploadPostback()
    {
        if (!($uniqueId = post('X_OCTOBER_FILEUPLOAD')) || $uniqueId != $this->getId()) {
            return;
        }

        try {
            $uploadedFile = Input::file('file_data');

            $validationRules = ['max:'.File::getMaxFilesize()];
            if ($fileTypes = $this->getAcceptedFileTypes()) {
                $validationRules[] = 'mimes:'.$fileTypes;
            }

            $validation = Validator::make(
                ['file_data' => $uploadedFile],
                ['file_data' => $validationRules]
            );

            if ($validation->fails()) {
                throw new ValidationException($validation);
            }

            if (!$uploadedFile->isValid()) {
                throw new ApplicationException('File is not valid');
            }

            $fileRelation = $this->getRelationObject();

            $file = new File();
            $file->data = $uploadedFile;
            $file->is_public = $fileRelation->isPublic();
            $file->save();

            $fileRelation->add($file, $this->sessionKey);

            $file->thumb = $file->getThumb($this->imageWidth, $this->imageHeight, $this->thumbOptions);
            $result = $file;

        }
        catch (Exception $ex) {
            $result = json_encode(['error' => $ex->getMessage()]);
        }

        header('Content-Type: application/json');
        die($result);
    }
}
