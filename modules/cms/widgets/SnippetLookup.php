<?php namespace Cms\Widgets;

use Str;
use Input;
use Cms\Classes\Theme;
use Cms\Classes\SnippetManager;
use Backend\Classes\WidgetBase;
use ApplicationException;

/**
 * SnippetLookup widget
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class SnippetLookup extends WidgetBase
{
    use \Backend\Traits\SearchableWidget;
    use \Backend\Traits\InspectableContainer;

    //
    // Configurable Properties
    //

    /**
     * @var string title text to display for the title of the popup list form
     */
    public $title = 'Insert Snippet';

    /**
     * @var string defaultAlias to identify this widget.
     */
    protected $defaultAlias = 'ocsnippetlookup';

    /**
     * @var string noRecordsMessage
     */
    public $noRecordsMessage = "No snippets found";

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'title',
        ]);
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/snippetlookup.css');
        $this->addJs('js/snippetlookup.js', ['type' => 'module']);
        $this->addJs('js/snippetlookup-control.js', ['type' => 'module']);
        $this->addJs('js/snippet-control.js', ['type' => 'module']);
    }

    /**
     * Renders the widget.
     * @return string
     */
    public function render()
    {
        return $this->makePartial('body', [
            'data' => $this->getData()
        ]);
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['title'] = $this->title;
    }

    /**
     * onLoadPopup AJAX handler
     */
    public function onLoadPopup()
    {
        // Disable asset broadcasting
        $this->controller->flushAssets();

        $this->prepareVars();

        return $this->makePartial('lookup_form');
    }

    /**
     * onSearch
     */
    public function onSearch()
    {
        $this->setSearchTerm(Input::get('search'));

        return $this->updateList();
    }

    /**
     * onGetInspectorConfiguration
     */
    public function onGetInspectorConfiguration()
    {
        $configuration = [];
        $snippetCode = post('snippet');
        $componentClass = post('component');

        if ($componentClass && !class_exists($componentClass)) {
            throw new ApplicationException(__("Snippet with the requested code :code was not found in the theme.", ['code' => $componentClass]));
        }

        if (strlen($snippetCode)) {
            $snippet = SnippetManager::instance()->findByCodeOrComponent($this->getTheme(), $snippetCode, $componentClass);
            if (!$snippet) {
                throw new ApplicationException(__("Snippet with the requested code :code was not found in the theme.", ['code' => $snippetCode]));
            }

            $configuration = $snippet->getProperties();
        }

        return [
            'configuration' => [
                'properties' => $configuration,
                'title' => $snippet->getName(),
                'description' => $snippet->getDescription()
            ]
        ];
    }

    /**
     * onLoadSnippetDetails
     */
    public function onLoadSnippetDetails()
    {
        $this->controller->flushAssets();

        $codes = array_unique((array) post('codes'));
        $result = [];

        foreach ($codes as $snippetCode) {
            $parts = explode('|', $snippetCode);
            $componentClass = null;

            if (count($parts) > 1) {
                $snippetCode = $parts[0];
                $componentClass = $parts[1];
            }

            $snippet = SnippetManager::instance()->findByCodeOrComponent($this->getTheme(), $snippetCode, $componentClass);
            if (!$snippet) {
                $result[$snippetCode] = [
                    'name' => __("Snippet with the requested code :code was not found in the theme.", ['code' => $snippetCode]),
                    'error' => true
                ];
            }
            else {
                $result[$snippetCode] = [
                    'name' => $snippet->getName()
                ];
            }
        }

        return [
            'details' => $result
        ];
    }

    /**
     * getData
     */
    protected function getData()
    {
        $manager = SnippetManager::instance();
        $snippets = $manager->listSnippets($this->getTheme());

        $searchTerm = Str::lower($this->getSearchTerm());

        if (strlen($searchTerm)) {
            $words = explode(' ', $searchTerm);
            $filteredSnippets = [];

            foreach ($snippets as $snippet) {
                if ($this->textMatchesSearch($words, $snippet->getName().' '.$snippet->code.' '.$snippet->getDescription())) {
                    $filteredSnippets[] = $snippet;
                }
            }

            $snippets = $filteredSnippets;
        }

        usort($snippets, function($a, $b) {
            return strcmp($a->getName(), $b->getName());
        });

        return $snippets;
    }

    /**
     * updateList
     */
    protected function updateList()
    {
        return ['#'.$this->getId('snippet-list') => $this->makePartial('items', ['items' => $this->getData()])];
    }

    /**
     * getTheme returns the theme to source snippets
     */
    protected function getTheme()
    {
        return Theme::getEditTheme() ?: Theme::getActiveTheme();
    }

    /**
     * getThemeSessionKey
     */
    protected function getThemeSessionKey($prefix)
    {
        $theme = $this->getTheme();
        if (!$theme) {
            return $prefix . 'unknown';
        }

        return $prefix . $theme->getDirName();
    }

    /**
     * getSession
     */
    protected function getSession($key = null, $default = null)
    {
        $key = strlen($key) ? $this->getThemeSessionKey($key) : $key;

        return parent::getSession($key, $default);
    }

    /**
     * putSession
     */
    protected function putSession($key, $value)
    {
        return parent::putSession($this->getThemeSessionKey($key), $value);
    }
}
