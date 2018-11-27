<?php namespace Cms\Widgets;

use App;
use Str;
use Lang;
use Input;
use System\Classes\PluginManager;
use Cms\Classes\ComponentHelpers;
use Backend\Classes\WidgetBase;

/**
 * Component list widget.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentList extends WidgetBase
{
    use \Backend\Traits\CollapsableWidget;

    protected $searchTerm = false;

    protected $pluginComponentList;

    public function __construct($controller, $alias)
    {
        $this->alias = $alias;

        parent::__construct($controller, []);
        $this->bindToController();
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

    /*
     * Event handlers
     */

    public function onSearch()
    {
        $this->setSearchTerm(Input::get('search'));

        return $this->updateList();
    }

    /*
     * Methods for th internal use
     */

    protected function getData()
    {
        $searchTerm = Str::lower($this->getSearchTerm());
        $searchWords = [];
        if (strlen($searchTerm)) {
            $searchWords = explode(' ', $searchTerm);
        }

        $pluginManager = PluginManager::instance();
        $plugins = $pluginManager->getPlugins();

        $this->prepareComponentList();

        $items = [];
        foreach ($plugins as $plugin) {
            $components = $this->getPluginComponents($plugin);
            if (!is_array($components)) {
                continue;
            }

            $pluginDetails = $plugin->pluginDetails();

            $pluginName = $pluginDetails['name'] ?? Lang::get('system::lang.plugin.unnamed');
            $pluginIcon = $pluginDetails['icon'] ?? 'icon-puzzle-piece';
            $pluginDescription = $pluginDetails['description'] ?? null;

            $pluginClass = get_class($plugin);

            $pluginItems = [];
            foreach ($components as $componentInfo) {
                $className = $componentInfo->className;
                $alias = $componentInfo->alias;
                $component = App::make($className);

                if ($component->isHidden) {
                    continue;
                }

                $componentDetails = $component->componentDetails();
                $component->alias = '--alias--';

                $item = (object)[
                    'title'          => ComponentHelpers::getComponentName($component),
                    'description'    => ComponentHelpers::getComponentDescription($component),
                    'plugin'         => $pluginName,
                    'propertyConfig' => ComponentHelpers::getComponentsPropertyConfig($component),
                    'propertyValues' => ComponentHelpers::getComponentPropertyValues($component, $alias),
                    'className'      => get_class($component),
                    'pluginIcon'     => $pluginIcon,
                    'alias'          => $alias,
                    'name'           => $componentInfo->duplicateAlias
                        ? $componentInfo->className
                        : $componentInfo->alias
                ];

                if ($searchWords && !$this->itemMatchesSearch($searchWords, $item)) {
                    continue;
                }

                if (!array_key_exists($pluginClass, $items)) {
                    $group = (object)[
                        'title'       => $pluginName,
                        'description' => $pluginDescription,
                        'pluginClass' => $pluginClass,
                        'icon'        => $pluginIcon,
                        'items'       => []
                    ];

                    $items[$pluginClass] = $group;
                }

                $pluginItems[] = $item;
            }

            usort($pluginItems, function ($a, $b) {
                return strcmp($a->title, $b->title);
            });

            if (isset($items[$pluginClass])) {
                $items[$pluginClass]->items = $pluginItems;
            }
        }

        uasort($items, function ($a, $b) {
            return strcmp($a->title, $b->title);
        });

        return $items;
    }

    protected function prepareComponentList()
    {
        $pluginManager = PluginManager::instance();
        $plugins = $pluginManager->getPlugins();

        $componentList = [];
        foreach ($plugins as $plugin) {
            $components = $plugin->registerComponents();
            if (!is_array($components)) {
                continue;
            }

            foreach ($components as $className => $alias) {
                $duplicateAlias = false;
                foreach ($componentList as $componentInfo) {
                    if ($componentInfo->alias == $alias) {
                        $componentInfo->duplicateAlias = true;
                        $duplicateAlias = true;
                    }
                }

                $componentList[] = (object)[
                    'className'      => $className,
                    'alias'          => $alias,
                    'duplicateAlias' => $duplicateAlias,
                    'pluginClass'    => get_class($plugin)
                ];
            }
        }

        $this->pluginComponentList = $componentList;
    }

    protected function getPluginComponents($plugin)
    {
        $result = [];
        $pluginClass = get_class($plugin);
        foreach ($this->pluginComponentList as $componentInfo) {
            if ($componentInfo->pluginClass == $pluginClass) {
                $result[] = $componentInfo;
            }
        }

        return $result;
    }

    protected function getSearchTerm()
    {
        return $this->searchTerm !== false ? $this->searchTerm : $this->getSession('search');
    }

    protected function setSearchTerm($term)
    {
        $this->searchTerm = trim($term);
        $this->putSession('search', $this->searchTerm);
    }

    protected function updateList()
    {
        return ['#'.$this->getId('component-list') => $this->makePartial('items', [
            'items' => $this->getData()]
        )];
    }

    protected function itemMatchesSearch(&$words, $item)
    {
        foreach ($words as $word) {
            $word = trim($word);
            if (!strlen($word)) {
                continue;
            }

            if (!$this->itemContainsWord($word, $item)) {
                return false;
            }
        }

        return true;
    }

    protected function itemContainsWord($word, $item)
    {
        if (Str::contains(Str::lower($item->title), $word)) {
            return true;
        }

        if (Str::contains(Str::lower($item->description), $word) && strlen($item->description)) {
            return true;
        }

        if (Str::contains(Str::lower($item->plugin), $word) && strlen($item->plugin)) {
            return true;
        }

        return false;
    }
}
