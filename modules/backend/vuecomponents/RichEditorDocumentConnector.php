<?php namespace Backend\VueComponents;

use Url;
use Backend\Classes\VueComponentBase;

/**
 * Rich Editor Document connector Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditorDocumentConnector extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-richeditor-document-connector';

    /**
     * @var array require
     */
    protected $require = [
        \Backend\VueComponents\Document::class,
        \Backend\VueComponents\RichEditor::class,
        \Backend\VueComponents\Uploader::class,
        \Backend\VueComponents\Modal::class,
        \Backend\VueComponents\Inspector::class,
        \Backend\VueComponents\MonacoEditor::class
    ];

    /**
     * Adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addJs('js/formwidget.js', ['type' => 'module']);
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
                'add_video_title' => trans('backend::lang.richeditor.add_video'),
                'add_audio_title' => trans('backend::lang.richeditor.add_audio'),
                'add_file_title' => trans('backend::lang.richeditor.add_file'),
                'embedding_code' => trans('backend::lang.richeditor.embedding_code'),
                'embedding_code_required' => trans('backend::lang.richeditor.embedding_code_required'),
                'invalid_embedding_code_title' => trans('backend::lang.richeditor.embedding_code_invalid_title'),
                'invalid_embedding_code_message' => trans('backend::lang.richeditor.embedding_code_invalid'),
            ],
            'vendorPath' => Url::asset('/modules/backend/vuecomponents/richeditordocumentconnector/assets/vendor/'),
        ];

        $this->vars['configuration'] = json_encode($configuration);
    }

    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('formwidgetconnector');
    }
}
