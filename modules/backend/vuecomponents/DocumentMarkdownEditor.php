<?php namespace Backend\VueComponents;

use App;
use Backend\Classes\VueComponentBase;

/**
 * Markdown editor for the Document UI Vue component.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DocumentMarkdownEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-document-markdowneditor';

    protected $require = [
        \Backend\VueComponents\Document::class,
        \Backend\VueComponents\Uploader::class,
        \Backend\VueComponents\Modal::class,
        \Backend\VueComponents\Inspector::class
    ];

    /**
     * Adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addJs('/modules/backend/vuecomponents/documentmarkdowneditor/assets/vendor/easymde@2.12.0/easymde.min.js');
        $this->addCss('/modules/backend/vuecomponents/documentmarkdowneditor/assets/vendor/easymde@2.12.0/easymde.min.css');
        $this->addJs('js/formwidget.js', ['type' => 'module']);
    }

    /**
     * Adds dependency assets required for the component.
     * This method is called before the component's default resources are loaded.
     * Use $this->addJs() and $this->addCss() to register new assets to include
     * on the page.
     * @return void
     */
    protected function loadDependencyAssets()
    {
        $this->addJs('vendor/marked@1.2.0/marked.min.js');
        $this->addJs('vendor/dompurify@2.1.1/purify.min.js');
    }

    /**
     * Prepares variables required by the component's partials
     */
    protected function prepareVars()
    {
        $configuration = [
            'lang' => [
                'command_upload_from_computer' => trans('backend::lang.richeditor.upload_from_computer'),
                'browse' => trans('backend::lang.richeditor.browse'),
                'by_url' => trans('backend::lang.richeditor.by_url'),
                'url_required' => trans('backend::lang.richeditor.url_required'),
                'url_validation' => trans('backend::lang.richeditor.url_validation'),
                'add_image_title' => trans('backend::lang.richeditor.add_image'),
                'add_file_title' => trans('backend::lang.richeditor.add_file')
            ]
        ];

        $this->vars['configuration'] = json_encode($configuration);
    }

    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('formwidgetconnector');
    }
}
