<?php namespace Backend\FormWidgets;

use Db;
use Input;
use Request;
use Response;
use Validator;
use Backend\Widgets\Form;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use ApplicationException;
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
    use \Backend\Traits\FormModelSaver;
    use \Backend\Traits\FormModelWidget;

    //
    // Configurable properties
    //

    /**
     * @var string Prompt text to display for the upload button.
     */
    public $prompt;

    /**
     * @var int Preview image width
     */
    public $imageWidth;

    /**
     * @var int Preview image height
     */
    public $imageHeight;

    /**
     * @var mixed Collection of acceptable file types.
     */
    public $fileTypes = false;

    /**
     * @var mixed Collection of acceptable mime types.
     */
    public $mimeTypes = false;

    /**
     * @var mixed Max file size.
     */
    public $maxFilesize;

    /**
     * @var array Options used for generating thumbnails.
     */
    public $thumbOptions = [
        'mode'      => 'crop',
        'extension' => 'auto'
    ];

    /**
     * @var boolean Allow the user to set a caption.
     */
    public $useCaption = true;

    /**
     * @var boolean Automatically attaches the uploaded file on upload if the parent record exists instead of using deferred binding to attach on save of the parent record. Defaults to false.
     */
    public $attachOnUpload = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'fileupload';

    /**
     * @var Backend\Widgets\Form The embedded form for modifying the properties of the selected file
     */
    protected $configFormWidget;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->maxFilesize = $this->getUploadMaxFilesize();

        $this->fillFromConfig([
            'prompt',
            'imageWidth',
            'imageHeight',
            'fileTypes',
            'maxFilesize',
            'mimeTypes',
            'thumbOptions',
            'useCaption',
            'attachOnUpload',
        ]);

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $this->getConfigFormWidget();
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('fileupload');
    }

    /**
     * Prepares the view data
     */
    protected function prepareVars()
    {
        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        if ($this->previewMode) {
            $this->useCaption = false;
        }

        if ($this->maxFilesize > $this->getUploadMaxFilesize()) {
            throw new ApplicationException('Maximum allowed size for uploaded files: ' . $this->getUploadMaxFilesize());
        }

        $this->vars['fileList'] = $fileList = $this->getFileList();
        $this->vars['singleFile'] = $fileList->first();
        $this->vars['displayMode'] = $this->getDisplayMode();
        $this->vars['emptyIcon'] = $this->getConfig('emptyIcon', 'icon-upload');
        $this->vars['imageHeight'] = $this->imageHeight;
        $this->vars['imageWidth'] = $this->imageWidth;
        $this->vars['acceptedFileTypes'] = $this->getAcceptedFileTypes(true);
        $this->vars['maxFilesize'] = $this->maxFilesize;
        $this->vars['cssDimensions'] = $this->getCssDimensions();
        $this->vars['cssBlockDimensions'] = $this->getCssDimensions('block');
        $this->vars['useCaption'] = $this->useCaption;
        $this->vars['prompt'] = $this->getPromptText();
    }

    /**
     * Get the file record for this request, returns false if none available
     *
     * @return System\Models\File|false
     */
    protected function getFileRecord()
    {
        $record = false;

        if (!empty(post('file_id'))) {
            $record = $this->getRelationModel()::find(post('file_id')) ?: false;
        }

        return $record;
    }

    /**
     * Get the instantiated config Form widget
     *
     * @return void
     */
    public function getConfigFormWidget()
    {
        if ($this->configFormWidget) {
            return $this->configFormWidget;
        }

        $config = $this->makeConfig('~/modules/system/models/file/fields.yaml');
        $config->model = $this->getFileRecord() ?: $this->getRelationModel();
        $config->alias = $this->alias . $this->defaultAlias;
        $config->arrayName = $this->getFieldName();

        $widget = $this->makeWidget(Form::class, $config);
        $widget->bindToController();

        return $this->configFormWidget = $widget;
    }

    protected function getFileList()
    {
        $list = $this
            ->getRelationObject()
            ->withDeferred($this->sessionKey)
            ->orderBy('sort_order')
            ->get()
        ;

        /*
         * Decorate each file with thumb and custom download path
         */
        $list->each(function ($file) {
            $this->decorateFileAttributes($file);
        });

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
     * Returns the escaped and translated prompt text to display according to the type.
     * @return string
     */
    protected function getPromptText()
    {
        if ($this->prompt === null) {
            $isMulti = ends_with($this->getDisplayMode(), 'multi');
            $this->prompt = $isMulti
                ? 'backend::lang.fileupload.upload_file'
                : 'backend::lang.fileupload.default_prompt';
        }

        return str_replace('%s', '<i class="icon-upload"></i>', e(trans($this->prompt)));
    }

    /**
     * Returns the CSS dimensions for the uploaded image,
     * uses auto where no dimension is provided.
     * @param string $mode
     * @return string
     */
    protected function getCssDimensions($mode = null)
    {
        if (!$this->imageWidth && !$this->imageHeight) {
            return '';
        }

        $cssDimensions = '';

        if ($mode == 'block') {
            $cssDimensions .= $this->imageWidth
                ? 'width: '.$this->imageWidth.'px;'
                : 'width: '.$this->imageHeight.'px;';

            $cssDimensions .= ($this->imageHeight)
                ? 'max-height: '.$this->imageHeight.'px;'
                : 'height: auto;';
        }
        else {
            $cssDimensions .= $this->imageWidth
                ? 'width: '.$this->imageWidth.'px;'
                : 'width: auto;';

            $cssDimensions .= ($this->imageHeight)
                ? 'max-height: '.$this->imageHeight.'px;'
                : 'height: auto;';
        }

        return $cssDimensions;
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

        if ($types === false) {
            $isImage = starts_with($this->getDisplayMode(), 'image');
            $types = implode(',', FileDefinitions::get($isImage ? 'imageExtensions' : 'defaultExtensions'));
        }

        if (!$types || $types == '*') {
            return null;
        }

        if (!is_array($types)) {
            $types = explode(',', $types);
        }

        $types = array_map(function ($value) use ($includeDot) {
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
     * Removes a file attachment.
     */
    public function onRemoveAttachment()
    {
        $fileModel = $this->getRelationModel();
        if (($fileId = post('file_id')) && ($file = $fileModel::find($fileId))) {
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

            $fileModel = $this->getRelationModel();
            $fileModel->setSortableOrder($ids, $orders);
        }
    }

    /**
     * Loads the configuration form for an attachment, allowing title and description to be set.
     */
    public function onLoadAttachmentConfig()
    {
        $fileModel = $this->getRelationModel();
        if ($file = $this->getFileRecord()) {
            $file = $this->decorateFileAttributes($file);

            $this->vars['file'] = $file;
            $this->vars['displayMode'] = $this->getDisplayMode();
            $this->vars['cssDimensions'] = $this->getCssDimensions();
            $this->vars['relationManageId'] = post('manage_id');
            $this->vars['relationField'] = post('_relation_field');

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
            $formWidget = $this->getConfigFormWidget();
            if ($file = $formWidget->model) {
                $modelsToSave = $this->prepareModelsToSave($file, $formWidget->getSaveData());
                Db::transaction(function () use ($modelsToSave, $formWidget) {
                    foreach ($modelsToSave as $modelToSave) {
                        $modelToSave->save(null, $formWidget->getSessionKey());
                    }
                });

                return ['displayName' => $file->title ?: $file->file_name];
            }

            throw new ApplicationException('Unable to find file, it may no longer exist');
        }
        catch (Exception $ex) {
            return json_encode(['error' => $ex->getMessage()]);
        }
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/fileupload.css', 'core');
        $this->addJs('js/fileupload.js', 'core');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return FormField::NO_SAVE_DATA;
    }

    /**
     * Upload handler for the server-side processing of uploaded files
     */
    public function onUpload()
    {
        try {
            if (!Input::hasFile('file_data')) {
                throw new ApplicationException('File missing from request');
            }

            $fileModel = $this->getRelationModel();
            $uploadedFile = Input::file('file_data');

            $validationRules = ['max:'.$fileModel::getMaxFilesize()];
            if ($fileTypes = $this->getAcceptedFileTypes()) {
                $validationRules[] = 'extensions:'.$fileTypes;
            }

            if ($this->mimeTypes) {
                $validationRules[] = 'mimes:'.$this->mimeTypes;
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

            $file = $fileModel;
            $file->data = $uploadedFile;
            $file->is_public = $fileRelation->isPublic();
            $file->save();

            /**
             * Attach directly to the parent model if it exists and attachOnUpload has been set to true
             * else attach via deferred binding
             */
            $parent = $fileRelation->getParent();
            if ($this->attachOnUpload && $parent && $parent->exists) {
                $fileRelation->add($file);
            }
            else {
                $fileRelation->add($file, $this->sessionKey);
            }

            $file = $this->decorateFileAttributes($file);

            $result = [
                'id' => $file->id,
                'thumb' => $file->thumbUrl,
                'path' => $file->pathUrl
            ];

            $response = Response::make($result, 200);
        }
        catch (Exception $ex) {
            $response = Response::make($ex->getMessage(), 400);
        }

        return $response;
    }

    /**
     * Adds the bespoke attributes used internally by this widget.
     * - thumbUrl
     * - pathUrl
     * @return System\Models\File
     */
    protected function decorateFileAttributes($file)
    {
        $path = $thumb = $file->getPath();

        if ($this->imageWidth || $this->imageHeight) {
            $thumb = $file->getThumb($this->imageWidth, $this->imageHeight, $this->thumbOptions);
        }

        $file->pathUrl = $path;
        $file->thumbUrl = $thumb;

        return $file;
    }

    /**
     * Return max upload filesize in Mb
     * @return integer
     */
    protected function getUploadMaxFilesize()
    {
        $size = ini_get('upload_max_filesize');
        if (preg_match('/^([\d\.]+)([KMG])$/i', $size, $match)) {
            $pos = array_search($match[2], ['K', 'M', 'G']);
            if ($pos !== false) {
                $size = $match[1] * pow(1024, $pos + 1);
            }
        }
        return floor($size / 1024 / 1024);
    }
}
