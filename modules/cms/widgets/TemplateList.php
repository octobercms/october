<?php namespace Cms\Widgets;

use Str;
use File;
use Input;
use Request;
use Response;
use Cms\Classes\Theme;
use Backend\Classes\WidgetBase;

/**
 * Template list widget.
 * This widget displays templates of different types.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class TemplateList extends WidgetBase
{
    const SORTING_FILENAME = 'fileName';

    use \Backend\Traits\SelectableWidget;

    protected $searchTerm = false;

    protected $dataSource;

    protected $theme;

    protected $groupStatusCache = false;

    /**
     * @var string object property to use as a title.
     */
    public $titleProperty;

    /**
     * @var array a list of object properties to use in the description area.
     * The array should include the property names and corresponding titles:
     * ['url'=>'URL']
     */
    public $descriptionProperties = [];

    /**
     * @var string object property to use as a description.
     */
    public $descriptionProperty;

    /**
     * @var string Message to display when there are no records in the list.
     */
    public $noRecordsMessage = 'cms::lang.template.no_list_records';

    /**
     * @var string Message to display when the Delete button is clicked.
     */
    public $deleteConfirmation = 'cms::lang.template.delete_confirm';

    /**
     * @var string Specifies the item type.
     */
    public $itemType;

    /**
     * @var string Extra CSS class name to apply to the control.
     */
    public $controlClass = null;

    /**
     * @var string A list of file name patterns to suppress / hide.
     */
    public $ignoreDirectories = [];

    /**
     * @var boolean Defines sorting properties. 
     * The sorting feature is disabled if there are no sorting properties defined.
     */
    public $sortingProperties = [];

    /*
     * Public methods
     */

    public function __construct($controller, $alias, callable $dataSource)
    {
        $this->alias = $alias;
        $this->dataSource = $dataSource;
        $this->theme = Theme::getEditTheme();
        $this->selectionInputName = 'template';

        parent::__construct($controller, []);

        if (!Request::isXmlHttpRequest()) {
            $this->resetSelection();
        }

        $configFile = 'config_' . snake_case($alias) .'.yaml';
        $config = $this->makeConfig($configFile);

        foreach ($config as $field => $value) {
            if (property_exists($this, $field)) {
                $this->$field = $value;
            }
        }

        $this->bindToController();
    }

    /**
     * Renders the widget.
     * @return string
     */
    public function render()
    {
        $toolbarClass = Str::contains($this->controlClass, 'hero') ? 'separator' : null;

        $this->vars['toolbarClass'] = $toolbarClass;

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
        $this->extendSelection();

        return $this->updateList();
    }

    public function onGroupStatusUpdate()
    {
        $this->setGroupStatus(Input::get('group'), Input::get('status'));
    }

    public function onUpdate()
    {
        $this->extendSelection();

        return $this->updateList();
    }

    public function onApplySorting()
    {
        $this->setSortingProperty(Input::get('sortProperty'));

        $result = $this->updateList();
        $result['#'.$this->getId('sorting-options')] = $this->makePartial('sorting-options');

        return $result;
    }

    //
    // Methods for the internal use
    //

    protected function getData()
    {
        /*
         * Load the data
         */
        $items = call_user_func($this->dataSource);

        if ($items instanceof \October\Rain\Support\Collection) {
            $items = $items->all();
        }

        $items = $this->removeIgnoredDirectories($items);

        $items = array_map([$this, 'normalizeItem'], $items);

        $this->sortItems($items);

        /*
         * Apply the search
         */
        $filteredItems = [];
        $searchTerm = Str::lower($this->getSearchTerm());

        if (strlen($searchTerm)) {
            /*
             * Exact
             */
            foreach ($items as $index => $item) {
                if ($this->itemContainsWord($searchTerm, $item, true)) {
                    $filteredItems[] = $item;
                    unset($items[$index]);
                }
            }

            /*
             * Fuzzy
             */
            $words = explode(' ', $searchTerm);
            foreach ($items as $item) {
                if ($this->itemMatchesSearch($words, $item)) {
                    $filteredItems[] = $item;
                }
            }
        }
        else {
            $filteredItems = $items;
        }

        /*
         * Group the items
         */
        $result = [];
        $foundGroups = [];
        foreach ($filteredItems as $itemData) {
            $pos = strpos($itemData->fileName, '/');

            if ($pos !== false) {
                $group = substr($itemData->fileName, 0, $pos);
                if (!array_key_exists($group, $foundGroups)) {
                    $newGroup = (object)[
                        'title' => $group,
                        'items' => []
                    ];

                    $foundGroups[$group] = $newGroup;
                }

                $foundGroups[$group]->items[] = $itemData;
            }
            else {
                $result[] = $itemData;
            }
        }

        // Sort folders by name regardless of the 
        // selected sorting options.
        ksort($foundGroups);

        foreach ($foundGroups as $group) {
            $result[] = $group;
        }

        return $result;
    }

    protected function sortItems(&$items)
    {
        $sortingProperty = $this->getSortingProperty();

        usort($items, function ($a, $b) use ($sortingProperty) {
            return strcmp($a->$sortingProperty, $b->$sortingProperty);
        });
    }

    protected function removeIgnoredDirectories($items)
    {
        if (!$this->ignoreDirectories) {
            return $items;
        }

        $ignoreCache = [];

        $items = array_filter($items, function($item) use (&$ignoreCache) {
            $fileName = $item->getBaseFileName();
            $dirName = dirname($fileName);

            if (isset($ignoreCache[$dirName])) {
                return false;
            }

            foreach ($this->ignoreDirectories as $ignoreDir) {
                if (File::fileNameMatch($dirName, $ignoreDir)) {
                    $ignoreCache[$dirName] = true;
                    return false;
                }
            }

            return true;
        });

        return $items;
    }

    protected function normalizeItem($item)
    {
        $description = null;
        if ($descriptionProperty = $this->descriptionProperty) {
            $description = $item->$descriptionProperty;
        }

        $descriptions = [];
        foreach ($this->descriptionProperties as $property => $title) {
            if ($item->$property) {
                $descriptions[$title] = $item->$property;
            }
        }

        $result = [
            'title'        => $this->getItemTitle($item),
            'fileName'     => $item->getFileName(),
            'description'  => $description,
            'descriptions' => $descriptions
        ];

        foreach ($this->sortingProperties as $property=>$name) {
            $result[$property] = $item->$property;
        }

        return (object) $result;
    }

    protected function getItemTitle($item)
    {
        $titleProperty = $this->titleProperty;

        if ($titleProperty) {
            return $item->$titleProperty ?: basename($item->getFileName());
        }

        return basename($item->getFileName());
    }

    protected function setSearchTerm($term)
    {
        $this->searchTerm = trim($term);
        $this->putSession('search', $this->searchTerm);
    }

    protected function getSearchTerm()
    {
        return $this->searchTerm !== false ? $this->searchTerm : $this->getSession('search');
    }

    protected function updateList()
    {
        return [
            '#'.$this->getId('template-list') => $this->makePartial('items', ['items' => $this->getData()])
        ];
    }

    protected function itemMatchesSearch($words, $item)
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

    protected function itemContainsWord($word, $item, $exact = false)
    {
        $operator = $exact ? 'is' : 'contains';

        if (strlen($item->title)) {
            if (Str::$operator(Str::lower($item->title), $word)) {
                return true;
            }
        }

        if (Str::$operator(Str::lower($item->fileName), $word)) {
            return true;
        }

        if (Str::$operator(Str::lower($item->description), $word) && strlen($item->description)) {
            return true;
        }

        foreach ($item->descriptions as $value) {
            if (Str::$operator(Str::lower($value), $word) && strlen($value)) {
                return true;
            }
        }

        return false;
    }

    protected function getGroupStatus($group)
    {
        $statuses = $this->getGroupStatuses();
        if (array_key_exists($group, $statuses)) {
            return $statuses[$group];
        }

        return false;
    }

    protected function getThemeSessionKey($prefix)
    {
        return $prefix.$this->theme->getDirName();
    }

    protected function getGroupStatuses()
    {
        if ($this->groupStatusCache !== false) {
            return $this->groupStatusCache;
        }

        $groups = $this->getSession($this->getThemeSessionKey('groups'), []);
        if (!is_array($groups)) {
            return $this->groupStatusCache = [];
        }

        return $this->groupStatusCache = $groups;
    }

    protected function setGroupStatus($group, $status)
    {
        $statuses = $this->getGroupStatuses();
        $statuses[$group] = $status;
        $this->groupStatusCache = $statuses;
        $this->putSession($this->getThemeSessionKey('groups'), $statuses);
    }

    protected function getSortingProperty()
    {
        $property = $this->getSession($this->getThemeSessionKey('sorting_property'), self::SORTING_FILENAME);

        if (!array_key_exists($property, $this->sortingProperties)) {
            return self::SORTING_FILENAME;
        }

        return $property;
    }

    protected function setSortingProperty($property)
    {
        $this->putSession($this->getThemeSessionKey('sorting_property'), $property);
    }
}
