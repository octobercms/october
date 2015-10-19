<?php namespace Backend\FormWidgets;

use Str;
use Lang;
use Input;
use Request;
use Response;
use Validator;
use System\Models\File;
use ApplicationException;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use Backend\Controllers\Files as FilesController;
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
     * @var string Prompt text to display for the upload button.
     */
    public $prompt = null;

    /**
     * @var int Preview image width
     */
    public $imageWidth = null;

    /**
     * @var int Preview image height
     */
    public $imageHeight = null;

    /**
     * @var mixed Collection of acceptable file types.
     */
    public $fileTypes = false;

    /**
     * @var mixed Collection of acceptable mime types.
     */
    public $mimeTypes = false;

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
            'prompt',
            'imageWidth',
            'imageHeight',
            'fileTypes',
            'mimeTypes',
            'thumbOptions',
            'useCaption'
        ]);

        $this->checkUploadPostback();
    }

    /**
     * {@inheritDoc}
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
        if ($this->previewMode) {
            $this->useCaption = false;
        }

        $this->vars['fileList'] = $fileList = $this->getFileList();
        $this->vars['singleFile'] = $fileList->first();
        $this->vars['displayMode'] = $this->getDisplayMode();
        $this->vars['emptyIcon'] = $this->getConfig('emptyIcon', 'icon-plus');
        $this->vars['imageHeight'] = $this->imageHeight;
        $this->vars['imageWidth'] = $this->imageWidth;
        $this->vars['acceptedFileTypes'] = $this->getAcceptedFileTypes(true);
        $this->vars['cssDimensions'] = $this->getCssDimensions();
        $this->vars['cssBlockDimensions'] = $this->getCssDimensions('block');
        $this->vars['useCaption'] = $this->useCaption;
        $this->vars['prompt'] = $this->getPromptText();
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
        $list->each(function($file) {
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
            $cssDimensions .= ($this->imageWidth)
                ? 'width: '.$this->imageWidth.'px;'
                : 'width: '.$this->imageHeight.'px;';

            $cssDimensions .= ($this->imageHeight)
                ? 'height: '.$this->imageHeight.'px;'
                : 'height: auto;';
        }
        else {
            $cssDimensions .= ($this->imageWidth)
                ? 'width: '.$this->imageWidth.'px;'
                : 'width: auto;';

            $cssDimensions .= ($this->imageHeight)
                ? 'height: '.$this->imageHeight.'px;'
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
            $types = implode(',', File::getDefaultFileTypes($isImage));
        }

        if (!$types || $types == '*') {
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
            $file = $this->decorateFileAttributes($file);

            $this->vars['file'] = $file;
            $this->vars['displayMode'] = $this->getDisplayMode();
            $this->vars['cssDimensions'] = $this->getCssDimensions();

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

                return ['displayName' => $file->title ?: $file->file_name];
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
    protected function loadAssets()
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
        if (!($uniqueId = Request::header('X-OCTOBER-FILEUPLOAD')) || $uniqueId != $this->getId()) {
            return;
        }

        try {
            if (!Input::hasFile('file_data')) {
                throw new ApplicationException('File missing from request');
            }

            $uploadedFile = Input::file('file_data');

            $validationRules = ['max:'.File::getMaxFilesize()];
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

            $file = new File();
            $file->data = $uploadedFile;
            $file->is_public = $fileRelation->isPublic();
            $file->save();

            $fileRelation->add($file, $this->sessionKey);

            $file = $this->decorateFileAttributes($file);

            $result = [
                'id' => $file->id,
                'thumb' => $file->thumbUrl,
                'path' => $file->pathUrl
            ];

            Response::json($result, 200)->send();

        }
        catch (Exception $ex) {
            Response::json($ex->getMessage(), 400)->send();
        }

        exit;
    }

    /**
     * Adds the bespoke attributes used internally by this widget.
     * - thumbUrl
     * - pathUrl
     * @return System\Models\File
     */
    protected function decorateFileAttributes($file)
    {
        /*
         * File is protected, create a secure public path
         */
        if (!$file->isPublic()) {
            $path = $thumb = FilesController::getDownloadUrl($file);

            if ($this->imageWidth || $this->imageHeight) {
                $thumb = FilesController::getThumbUrl($file, $this->imageWidth, $this->imageHeight, $this->thumbOptions);
            }
        }
        /*
         * Otherwise use public paths
         */
        else {
            $path = $thumb = $file->getPath();

            if ($this->imageWidth || $this->imageHeight) {
                $thumb = $file->getThumb($this->imageWidth, $this->imageHeight, $this->thumbOptions);
            }
        }

        $file->pathUrl = $path;
        $file->thumbUrl = $thumb;

        return $file;
    }
}
