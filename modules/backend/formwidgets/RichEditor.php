<?php namespace Backend\FormWidgets;

use App;
use File;
use Lang;
use Event;
use Config;
use Request;
use Backend;
use BackendAuth;
use Backend\Models\EditorSetting;
use Backend\Classes\FormWidgetBase;

/**
 * Rich Editor
 * Renders a rich content editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditor extends FormWidgetBase
{
    use \Backend\Traits\UploadableWidget;

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
    public $toolbarButtons;

    /**
     * @var boolean If true, the editor is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var string|null Path in the Media Library where uploaded files should be stored. If null it will be pulled from Request::input('path');
     */
    public $uploadPath = '/uploaded-files';

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
        ]);
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
        $this->vars['useMediaManager'] = BackendAuth::getUser()->hasAccess('media.manage_media');

        $this->vars['globalToolbarButtons'] = EditorSetting::getConfigured('html_toolbar_buttons');
        $this->vars['allowEmptyTags'] = EditorSetting::getConfigured('html_allow_empty_tags');
        $this->vars['allowTags'] = EditorSetting::getConfigured('html_allow_tags');
        $this->vars['noWrapTags'] = EditorSetting::getConfigured('html_no_wrap_tags');
        $this->vars['removeTags'] = EditorSetting::getConfigured('html_remove_tags');
        $this->vars['lineBreakerTags'] = EditorSetting::getConfigured('html_line_breaker_tags');

        $this->vars['imageStyles'] = EditorSetting::getConfiguredStyles('html_style_image');
        $this->vars['linkStyles'] = EditorSetting::getConfiguredStyles('html_style_link');
        $this->vars['paragraphStyles'] = EditorSetting::getConfiguredStyles('html_style_paragraph');
        $this->vars['tableStyles'] = EditorSetting::getConfiguredStyles('html_style_table');
        $this->vars['tableCellStyles'] = EditorSetting::getConfiguredStyles('html_style_table_cell');
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

        if (Config::get('develop.decompileBackendAssets', false)) {
            $scripts = Backend::decompileAsset($this->getAssetPath('js/build-plugins.js'));
            foreach ($scripts as $script) {
                $this->addJs($script, 'core');
            }
        } else {
            $this->addJs('js/build-plugins-min.js', 'core');
        }

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

                /*
                 * Root page fallback.
                 */
                if (strlen($linkUrl) === 0) {
                    $linkUrl = '/';
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
