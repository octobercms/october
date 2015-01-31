<?php namespace Cms\Widgets;

use Str;
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
    protected $searchTerm = false;

    protected $dataSource;

    protected $theme;

    protected $groupStatusCache = false;

    protected $selectedTemplatesCache = false;

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
    public $noRecordsMessage = 'No records found';

    /**
     * @var string Message to display when the Delete button is clicked.
     */
    public $deleteConfirmation = 'Do you really want to delete selected templates?';

    /**
     * @var string Specifies the item type.
     */
    public $itemType;

    /**
     * @var string Extra CSS class name to apply to the control.
     */
    public $controlClass = null;

    /**
     * @var string A list of directories to suppress / hide.
     */
    public $suppressDirectories = [];

    /*
     * Public methods
     */

    public function __construct($controller, $alias, callable $dataSource)
    {
        $this->alias = $alias;
        $this->dataSource = $dataSource;
        $this->theme = Theme::getEditTheme();

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
        return $this->makePartial('body', [
            'data'=>$this->getData()
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

    public function onSelect()
    {
        $this->extendSelection();
    }

    public function onUpdate()
    {
        $this->extendSelection();

        return $this->updateList();
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

        $normalizedItems = [];
        foreach ($items as $item) {
            if ($this->suppressDirectories) {
                $fileName = $item->getBaseFileName();
                $dir = dirname($fileName);

                if (in_array($dir, $this->suppressDirectories)) {
                    continue;
                }
            }

            $normalizedItems[] = $this->normalizeItem($item);
        }

        usort($normalizedItems, function ($a, $b) {
            return strcmp($a->fileName, $b->fileName);
        });

        /*
         * Apply the search
         */
        $filteredItems = [];
        $searchTerm = Str::lower($this->getSearchTerm());

        if (strlen($searchTerm)) {
            /*
             * Exact
             */
            foreach ($normalizedItems as $index => $item) {
                if ($this->itemContainsWord($searchTerm, $item, true)) {
                    $filteredItems[] = $item;
                    unset($normalizedItems[$index]);
                }
            }

            /*
             * Fuzzy
             */
            $words = explode(' ', $searchTerm);
            foreach ($normalizedItems as $item) {
                if ($this->itemMatchesSearch($words, $item)) {
                    $filteredItems[] = $item;
                }
            }
        }
        else {
            $filteredItems = $normalizedItems;
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

        foreach ($foundGroups as $group) {
            $result[] = $group;
        }

        return $result;
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
        return ['#'.$this->getId('template-list') => $this->makePartial('items', ['items'=>$this->getData()])];
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

    protected function itemContainsWord($word, $item , $exact = false)
    {
        $operator = $exact ? 'is' : 'contains';

        if (strlen($item->title)) {
            if (Str::$operator(Str::lower($item->title), $word)) {
                return true;
            }
        }
        elseif (Str::$operator(Str::lower($item->fileName), $word)) {
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

    protected function getSelectedTemplates()
    {
        if ($this->selectedTemplatesCache !== false) {
            return $this->selectedTemplatesCache;
        }

        $templates = $this->getSession($this->getThemeSessionKey('selected'), []);
        if (!is_array($templates)) {
            return $this->selectedTemplatesCache = [];
        }

        return $this->selectedTemplatesCache = $templates;
    }

    protected function extendSelection()
    {
        $items = Input::get('template', []);
        $currentSelection = $this->getSelectedTemplates();

        $this->putSession($this->getThemeSessionKey('selected'), array_merge($currentSelection, $items));
    }

    protected function resetSelection()
    {
        $this->putSession($this->getThemeSessionKey('selected'), []);
    }

    protected function isTemplateSelected($item)
    {
        $selectedTemplates = $this->getSelectedTemplates();
        if (!is_array($selectedTemplates) || !isset($selectedTemplates[$item->fileName])) {
            return false;
        }

        return $selectedTemplates[$item->fileName];
    }
}
