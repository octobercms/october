<?php namespace Backend\VueComponents;

use Url;
use Event;
use Backend\Classes\VueComponentBase;
use Backend\Models\Preference as BackendPreference;

/**
 * MonacoEditor Vue component
 *
 * Dev notes:
 * - Automatic tag closing is not implemented. See https://github.com/microsoft/monaco-editor/issues/221
 *
 * @link https://github.com/microsoft/monaco-editor
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class MonacoEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-monacoeditor';

    /**
     * @var array require other components
     */
    protected $require = [
        \Backend\VueComponents\Tabs::class
    ];

    /**
     * @var array yamlDefinitions can only be defined once
     */
    protected static $yamlDefinitions;

    /**
     * loadDependencyAssets required for the component.
     * This method is called before the component's default resources are loaded.
     * Use $this->addJs() and $this->addCss() to register new assets to include
     * on the page.
     * @return void
     */
    protected function loadDependencyAssets()
    {
        $this->addJs('vendor/monaco-yaml/monaco-yaml.min.js');
        $this->addJs('vendor/emmet-monaco-es/emmet-monaco.min.js');
        $this->addJs('vendor/monaco/vs/loader.js');
    }

    /**
     * prepareVars
     */
    protected function prepareVars()
    {
        $preferences = BackendPreference::instance();

        $configuration = [
            'vendorPath' => Url::asset('/modules/backend/vuecomponents/monacoeditor/assets/vendor/monaco'),
            'fontSize' => $preferences->editor_font_size.'px',
            'tabSize' => $preferences->editor_tab_size,
            'useEmmet' => !!$preferences->editor_use_emmet,
            'yamlSchemas' => $this->getYamlSchemaDefinitions(),
            'renderLineHighlight' => $preferences->editor_highlight_active_line ? 'all' : 'none',
            'useTabStops' => !!$preferences->editor_use_hard_tabs,
            'renderIndentGuides' => !!$preferences->editor_display_indent_guides,
            'renderWhitespace' => $preferences->editor_show_invisibles ? 'all' : 'none',
            'autoClosingBrackets' => $preferences->editor_auto_closing ? 'languageDefined' : 'never',
            'autoClosingQuotes' => $preferences->editor_auto_closing ? 'languageDefined' : 'never',
            'hover' => ['delay' => 750]
        ];

        if (!$preferences->editor_show_gutter) {
            $configuration['lineDecorationsWidth'] = 0;
            $configuration['lineNumbersMinChars'] = 0;
            $configuration['lineNumbers'] = false;
        }

        $wordWrap = $preferences->editor_word_wrap;
        if ($wordWrap === 'off') {
            $configuration['wordWrap'] = $wordWrap;
        }
        elseif ($wordWrap === 'fluid') {
            $configuration['wordWrap'] = 'on';
        }
        else {
            $configuration['wordWrap'] = 'wordWrapColumn';
            $configuration['wordWrapColumn'] = $wordWrap;
        }

        $theme = $preferences->editor_theme;
        if ($theme === 'sqlserver') {
            $configuration['theme'] = 'vs';
        }
        elseif ($theme === 'merbivore') {
            $configuration['theme'] = 'hc-black';
        }
        else {
            $configuration['theme'] = 'vs-dark';
        }

        $this->vars['configuration'] = json_encode($configuration);
    }

    /**
     * getYamlSchemaDefinitions
     */
    protected function getYamlSchemaDefinitions()
    {

        /**
         * @event editor.extension.defineYamlSchemas
         * @link https://github.com/domsew/monaco-yaml
         * Injects YAML schema definitions for the Monaco Editor based on the monaco-yaml package
         *
         * Example usage:
         *
         *     Event::listen('editor.extension.defineYamlSchemas', function () {
         *         return [
         *             [
         *                 'uri' => Url::asset('modules/tailor/assets/js/blueprint-yaml-definition.json'),
         *                 'fileMatch' => ['*-blueprint.yaml']
         *             ]
         *         ];
         *     });
         *
         */
        if (!self::$yamlDefinitions) {
            self::$yamlDefinitions = array_collapse(Event::fire('editor.extension.defineYamlSchemas'));
        }

        return self::$yamlDefinitions ?: null;
    }
}
