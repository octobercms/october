<?php namespace Backend\FormWidgets;

use App;
use File;
use Event;
use Lang;
use Request;
use Backend\Classes\FormWidgetBase;
use Backend\Models\EditorSetting;
use Input;
use Validator;
use Response;
use Exception;
use ValidationException;
use SystemException;
use Config;
use October\Rain\Filesystem\Definitions as FileDefinitions;

/**
 * Rich Editor
 * Renders a rich content editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditor extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var boolean Determines whether content has HEAD and HTML tags.
     */
    public $fullPage = false;

    /**
     * @var boolean Determines whether content has HEAD and HTML tags.
     */
    public $toolbarButtons = null;

    /**
     * @var boolean If true, the editor is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var array Contains the options used for file upload
     * Supported options:
     * - mode: [relation | medialibrary] (method of storing uploaded images)
     * - relation: Name of relation (relation also needs to be an attachmany relationship where the
     * attached model inherits from October\Rain\Database\Attach\File)
     */
    public $uploadOptions = [
        'mode' => 'medialibrary',
        'relation' => '',
    ];

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'richeditor';

    /**
     * @inheritDoc
     */
    public function init()
    {
        if ($this->formField->disabled) {
            $this->readOnly = true;
        }

        $this->fillFromConfig([
            'fullPage',
            'readOnly',
            'toolbarButtons',
            'uploadOptions',
        ]);

        $this->evalUploadOptions();
        $this->checkUploadPostback();
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('richeditor');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['field'] = $this->formField;
        $this->vars['editorLang'] = $this->getValidEditorLang();
        $this->vars['fullPage'] = $this->fullPage;
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['name'] = $this->getFieldName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['toolbarButtons'] = $this->evalToolbarButtons();
        $this->vars['uploadMode'] = $this->evalUploadOptions();

        $this->vars['globalToolbarButtons'] = EditorSetting::getConfigured('html_toolbar_buttons');
        $this->vars['allowEmptyTags'] = EditorSetting::getConfigured('html_allow_empty_tags');
        $this->vars['allowTags'] = EditorSetting::getConfigured('html_allow_tags');
        $this->vars['noWrapTags'] = EditorSetting::getConfigured('html_no_wrap_tags');
        $this->vars['removeTags'] = EditorSetting::getConfigured('html_remove_tags');

        $this->vars['imageStyles'] = EditorSetting::getConfiguredStyles('html_style_image');
        $this->vars['linkStyles'] = EditorSetting::getConfiguredStyles('html_style_link');
        $this->vars['paragraphStyles'] = EditorSetting::getConfiguredStyles('html_style_paragraph');
        $this->vars['tableStyles'] = EditorSetting::getConfiguredStyles('html_style_table');
        $this->vars['tableCellStyles'] = EditorSetting::getConfiguredStyles('html_style_table_cell');
    }

    /*
    * Determine the uploadMode to use based on config
    *
    */
    protected function evalUploadOptions()
    {
        if($this->uploadOptions['mode']
           && $this->uploadOptions['mode'] == 'relation'
           && $this->uploadOptions['relation']
           && !empty(trim($this->uploadOptions['relation']))) {
            if($this->model->getRelationType($this->uploadOptions['relation']) == 'attachMany'
               &&  $this->model->{$this->uploadOptions['relation']}()->getRelated()
               instanceof \October\Rain\Database\Attach\File) {
                return 'relation';
            }
        }

        return 'medialibrary';
    }

    public function onLoadRelationUploadBrowseForm()
    {
        $this->setRelationUploadValues();
        return $this->makePartial('relation_upload_browse_form');
    }

    public function onDeleteRelationUpload()
    {
        $relationsToDelete = (Input::get('relations') ? Input::get('relations') : null);

        if($relationsToDelete == null || empty($relationsToDelete)){
            return;
        }

        $relationsToDeleteIds = [];
        foreach($relationsToDelete as $relation) {
            $relationsToDeleteIds[] = $relation['id'];
        }

        $relationModelsWithDeferred = $this->model->{$this->uploadOptions['relation']}()
            ->withDeferred($this->sessionKey)->whereIn('id', $relationsToDeleteIds)->get();

        $relationModels = $this->model->{$this->uploadOptions['relation']}()
            ->whereIn('id', $relationsToDeleteIds)->get();

        if($relationModelsWithDeferred && $relationModels) {
            $deferredModels = $relationModelsWithDeferred->diff($relationModels);
        }
        elseif($relationModelsWithDeferred) {
            $deferredModels = $relationModelsWithDeferred;
        }

        foreach($relationModels as $model) {
            $model->delete();
        }

        foreach($deferredModels as $model) {
            $this->model->{$this->uploadOptions['relation']}()->remove($model, $this->sessionKey);
        }

        $this->setRelationUploadValues();
        return [
            '#relation-list' => $this->makePartial('relation_list')
        ];
    }

    protected function setRelationUploadValues()
    {
        $relationUploads = $this->getRelationUploads();
        $this->vars['relationUploadsCount'] = count($relationUploads);
        $this->vars['relationUploads'] = $relationUploads;
    }

    protected function getRelationUploads()
    {
        $relationUploads = $this->model->{$this->uploadOptions['relation']}()
                            ->withDeferred($this->sessionKey)->get();
        $result = [];
        foreach($relationUploads as $file) {
            $result[] = ['id' => $file->id, 'file_name' => $file->file_name,
                         'disk_name' => $file->disk_name, 'path' => $file->getPath(),
                         'file_type' => $this->getFileType($file)];
        }
        return $result;
    }

    public function getFileType($model)
    {
        $imageExtensions = array_map('strtolower', Config::get('cms.storage.media.imageExtensions',
                                                               FileDefinitions::get('imageExtensions')));
        $videoExtensions = array_map('strtolower', Config::get('cms.storage.media.videoExtensions',
                                                               FileDefinitions::get('videoExtensions')));
        $audioExtensions = array_map('strtolower', Config::get('cms.storage.media.audioExtensions',
                                                               FileDefinitions::get('audioExtensions')));

        $extension = $model->getExtension();
        if (!strlen($extension)) {
            return 'document';
        }
        if (in_array($extension, $imageExtensions)) {
            return 'image';
        }
        if (in_array($extension, $videoExtensions)) {
            return 'video';
        }
        if (in_array($extension, $audioExtensions)) {
            return 'audio';
        }
        return 'document';
    }

    protected function checkUploadPostback()
    {
        if (!post('X_OCTOBER_RICHEDITOR_RELATION_UPLOAD')) {
            return;
        }

        $uploadedFileName = null;

        try {
            $uploadedFile = Input::file('file_data');

            if ($uploadedFile)
                $uploadedFileName = $uploadedFile->getClientOriginalName();

            $relationName = $this->uploadOptions['relation'];
            $relationClass = get_class($this->model->{$relationName}()->getRelated());
            $validationRules = ['max:'.$relationClass::getMaxFilesize()];
            $validationRules[] = 'mimes:jpg,jpeg,bmp,png,gif';

            $validation = Validator::make(
                ['file_data' => $uploadedFile],
                ['file_data' => $validationRules]
            );

            if ($validation->fails())
                throw new ValidationException($validation);

            if (!$uploadedFile->isValid())
                throw new SystemException(Lang::get('cms::lang.asset.file_not_valid'));

            $fileRelation = $this->model->{$relationName}();

            $file = new $relationClass();
            $file->data = $uploadedFile;
            $file->is_public = true;
            $file->save();

            $fileRelation->add($file, $this->sessionKey);
            $result = [
                'link' => $file->getPath(),
                'result' => 'success'
            ];

            $response = Response::make()->setContent($result);
            $response->send();

            die();
        }
        catch (Exception $ex) {
            $message = $uploadedFileName
                ? Lang::get('cms::lang.asset.error_uploading_file', ['name' => $uploadedFileName, 'error' => $ex->getMessage()])
                : $ex->getMessage();

            $result = [
                'error' => $message,
                'file' => $uploadedFileName
            ];

            $response = Response::make()->setContent($result);
            $response->send();

            die();
        }
    }

    /**
     * Determine the toolbar buttons to use based on config.
     * @return string
     */
    protected function evalToolbarButtons()
    {
        $buttons = $this->toolbarButtons;

        if (is_string($buttons)) {
            $buttons = array_map(function ($button) {
                return strlen($button) ? $button : '|';
            }, explode('|', $buttons));
        }

        return $buttons;
    }

    public function onLoadPageLinksForm()
    {
        $this->vars['links'] = $this->getPageLinksArray();
        return $this->makePartial('page_links_form');
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/richeditor.css', 'core');
        $this->addJs('js/build-min.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js', 'core');

        if ($lang = $this->getValidEditorLang()) {
            $this->addJs('vendor/froala/js/languages/'.$lang.'.js', 'core');
        }
    }

    /**
     * Returns a valid language code for Redactor.
     * @return string|mixed
     */
    protected function getValidEditorLang()
    {
        $locale = App::getLocale();

        // English is baked in
        if ($locale == 'en') {
            return null;
        }

        $locale = str_replace('-', '_', strtolower($locale));
        $path = base_path('modules/backend/formwidgets/richeditor/assets/vendor/froala/js/languages/'.$locale.'.js');

        return File::exists($path) ? $locale : false;
    }

    /**
     * Returns a list of registered page link types.
     * This is reserved functionality for separating the links by type.
     * @return array Returns an array of registered page link types
     */
    protected function getPageLinkTypes()
    {
        $result = [];

        $apiResult = Event::fire('backend.richeditor.listTypes');
        if (is_array($apiResult)) {
            foreach ($apiResult as $typeList) {
                if (!is_array($typeList)) {
                    continue;
                }

                foreach ($typeList as $typeCode => $typeName) {
                    $result[$typeCode] = $typeName;
                }
            }
        }

        return $result;
    }

    protected function getPageLinks($type)
    {
        $result = [];
        $apiResult = Event::fire('backend.richeditor.getTypeInfo', [$type]);
        if (is_array($apiResult)) {
            foreach ($apiResult as $typeInfo) {
                if (!is_array($typeInfo)) {
                    continue;
                }

                foreach ($typeInfo as $name => $value) {
                    $result[$name] = $value;
                }
            }
        }

        return $result;
    }

    /**
     * Returns a single collection of available page links.
     * This implementation has room to place links under
     * different groups based on the link type.
     * @return array
     */
    protected function getPageLinksArray()
    {
        $links = [];
        $types = $this->getPageLinkTypes();

        $links[] = ['name' => Lang::get('backend::lang.pagelist.select_page'), 'url' => false];

        $iterator = function ($links, $level = 0) use (&$iterator) {
            $result = [];
            foreach ($links as $linkUrl => $link) {

                /*
                 * Remove scheme and host from URL
                 */
                $baseUrl = Request::getSchemeAndHttpHost();
                if (strpos($linkUrl, $baseUrl) === 0) {
                    $linkUrl = substr($linkUrl, strlen($baseUrl));
                }

                $linkName = str_repeat('&nbsp;', $level * 4);
                $linkName .= is_array($link) ? array_get($link, 'title', '') : $link;
                $result[] = ['name' => $linkName, 'url' => $linkUrl];

                if (is_array($link)) {
                    $result = array_merge(
                        $result,
                        $iterator(array_get($link, 'links', []), $level + 1)
                    );
                }
            }

            return $result;
        };

        foreach ($types as $typeCode => $typeName) {
            $links = array_merge($links, $iterator($this->getPageLinks($typeCode)));
        }

        return $links;
    }
}
