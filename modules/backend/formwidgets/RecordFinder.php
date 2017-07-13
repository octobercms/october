<?php namespace Backend\FormWidgets;

use Lang;
use ApplicationException;
use Backend\Classes\FormWidgetBase;

/**
 * Record Finder
 * Renders a record finder field.
 *
 *    user:
 *        label: User
 *        type: recordfinder
 *        list: ~/plugins/rainlab/user/models/user/columns.yaml
 *        title: Find Record
 *        prompt: Click the Find button to find a user
 *        nameFrom: name
 *        descriptionFrom: email
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RecordFinder extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    //
    // Configurable properties
    //

    /**
     * @var string Field name to use for key.
     */
    public $keyFrom = 'id';

    /**
     * @var string Relation column to display for the name
     */
    public $nameFrom;

    /**
     * @var string Relation column to display for the description
     */
    public $descriptionFrom;

    /**
     * @var string Text to display for the title of the popup list form
     */
    public $title = 'backend::lang.recordfinder.find_record';

    /**
     * @var string Prompt to display if no record is selected.
     */
    public $prompt = 'Click the %s button to find a record';

    /**
     * @var int Maximum rows to display for each page.
     */
    public $recordsPerPage = 10;

    /**
     * @var string Use a custom scope method for the list query.
     */
    public $scope;

    /**
     * @var string Filters the relation using a raw where query statement.
     */
    public $conditions;

    /**
     * @var string If searching the records, specifies a policy to use.
     * - all: result must contain all words
     * - any: result can contain any word
     * - exact: result must contain the exact phrase
     */
    public $searchMode;

    /**
     * @var string Use a custom scope method for performing searches.
     */
    public $searchScope;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'recordfinder';

    /**
     * @var Model Relationship model
     */
    public $relationModel;

    /**
     * @var \Backend\Classes\WidgetBase Reference to the widget used for viewing (list or form).
     */
    protected $listWidget;

    /**
     * @var \Backend\Classes\WidgetBase Reference to the widget used for searching.
     */
    protected $searchWidget;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'title',
            'prompt',
            'keyFrom',
            'nameFrom',
            'descriptionFrom',
            'scope',
            'conditions',
            'searchMode',
            'searchScope',
            'recordsPerPage',
        ]);

        if (post('recordfinder_flag')) {
            $this->listWidget = $this->makeListWidget();
            $this->listWidget->bindToController();

            $this->searchWidget = $this->makeSearchWidget();
            $this->searchWidget->bindToController();

            $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());

            /*
             * Link the Search Widget to the List Widget
             */
            $this->searchWidget->bindEvent('search.submit', function () {
                $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());
                return $this->listWidget->onRefresh();
            });
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    public function onRefresh()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
        $model->{$attribute} = post($this->getFieldName());

        $this->prepareVars();
        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    public function onClearRecord()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
        $model->{$attribute} = null;

        $this->prepareVars();
        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->relationModel = $this->getLoadValue();

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $this->vars['value'] = $this->getKeyValue();
        $this->vars['field'] = $this->formField;
        $this->vars['nameValue'] = $this->getNameValue();
        $this->vars['descriptionValue'] = $this->getDescriptionValue();
        $this->vars['listWidget'] = $this->listWidget;
        $this->vars['searchWidget'] = $this->searchWidget;
        $this->vars['title'] = $this->title;
        $this->vars['prompt'] = str_replace('%s', '<i class="icon-th-list"></i>', e(trans($this->prompt)));
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/recordfinder.js', 'core');
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        return strlen($value) ? $value : null;
    }

    /**
     * @inheritDoc
     */
    public function getLoadValue()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);

        if (!is_null($model)) {
            return $model->{$attribute};
        }

        return null;
    }

    public function getKeyValue()
    {
        if (!$this->relationModel) {
            return null;
        }

        return $this->relationModel->{$this->keyFrom};
    }

    public function getNameValue()
    {
        if (!$this->relationModel || !$this->nameFrom) {
            return null;
        }

        return $this->relationModel->{$this->nameFrom};
    }

    public function getDescriptionValue()
    {
        if (!$this->relationModel || !$this->descriptionFrom) {
            return null;
        }

        return $this->relationModel->{$this->descriptionFrom};
    }

    public function onFindRecord()
    {
        $this->prepareVars();

        /*
         * Purge the search term stored in session
         */
        if ($this->searchWidget) {
            $this->listWidget->setSearchTerm(null);
            $this->searchWidget->setActiveTerm(null);
        }

        return $this->makePartial('recordfinder_form');
    }

    protected function makeListWidget()
    {
        $config = $this->makeConfig($this->getConfig('list'));
        $config->model = $this->getRelationModel();
        $config->alias = $this->alias . 'List';
        $config->showSetup = false;
        $config->showCheckboxes = false;
        $config->recordsPerPage = $this->recordsPerPage;
        $config->recordOnClick = sprintf("$('#%s').recordFinder('updateRecord', this, ':" . $this->keyFrom . "')", $this->getId());
        $widget = $this->makeWidget('Backend\Widgets\Lists', $config);

        $widget->setSearchOptions([
            'mode' => $this->searchMode,
            'scope' => $this->searchScope,
        ]);

        if ($sqlConditions = $this->conditions) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                $query->whereRaw($sqlConditions);
            });
        }
        elseif ($scopeMethod = $this->scope) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                $query->$scopeMethod($this->model);
            });
        }
        else {
            $widget->bindEvent('list.extendQueryBefore', function ($query) {
                $this->getRelationObject()->addDefinedConstraintsToQuery($query);
            });
        }

        return $widget;
    }

    protected function makeSearchWidget()
    {
        $config = $this->makeConfig();
        $config->alias = $this->alias . 'Search';
        $config->growable = false;
        $config->prompt = 'backend::lang.list.search_prompt';
        $widget = $this->makeWidget('Backend\Widgets\Search', $config);
        $widget->cssClasses[] = 'recordfinder-search';
        return $widget;
    }
}
