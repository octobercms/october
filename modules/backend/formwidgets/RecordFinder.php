<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Classes\FormWidgetBase;
use System\Classes\SystemException;

/**
 * Record Finder
 * Renders a record finder field.
 *
 *    user:
 *        label: User
 *        type: recordfinder
 *        list: @/plugins/rainlab/user/models/user/columns.yaml
 *        prompt: Click the Find button to find a user
 *        nameColumn: name
 *        descriptionColumn: email
 * 
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RecordFinder extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'recordfinder';

    /**
     * @var string Relationship type
     */
    public $relationType;

    /**
     * @var string Relationship name
     */
    public $relationName;

    /**
     * @var Model Relationship model
     */
    public $relationModel;

    /**
     * @var string Field name to use for key.
     */
    public $keyField = 'id';

    /**
     * @var string Relation column to display for the name
     */
    public $nameColumn;

    /**
     * @var string Relation column to display for the description
     */
    public $descriptionColumn;

    /**
     * @var string Prompt to display if no record is selected.
     */
    public $prompt;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for viewing (list or form).
     */
    protected $listWidget;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for searching.
     */
    protected $searchWidget;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->relationName = $this->formField->columnName;
        $this->relationType = $this->model->getRelationType($this->relationName);

        $this->prompt = $this->getConfig('prompt', 'Click the %s button to find a record');
        $this->keyField = $this->getConfig('keyField', $this->keyField);
        $this->nameColumn = $this->getConfig('nameColumn', $this->nameColumn);
        $this->descriptionColumn = $this->getConfig('descriptionColumn', $this->descriptionColumn);

        if (!$this->model->hasRelation($this->relationName))
            throw new SystemException(Lang::get('backend::lang.model.missing_relation', ['class'=>get_class($this->controller), 'relation'=>$this->relationName]));

        if (post('recordfinder_flag')) {
            $this->listWidget = $this->makeListWidget();
            $this->listWidget->bindToController();

            $this->searchWidget = $this->makeSearchWidget();
            $this->searchWidget->bindToController();

            /*
             * Link the Search Widget to the List Widget
             */
            $this->searchWidget->bindEvent('search.submit', function() {
                $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());
                return $this->listWidget->onRefresh();
            });

            $this->searchWidget->setActiveTerm(null);
        }
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    public function onRefresh()
    {
        $this->model->{$this->columnName} = post($this->formField->getName());
        $this->prepareVars();
        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->relationModel = $this->model->{$this->columnName};
        $this->vars['value'] = $this->getKeyValue();
        $this->vars['field'] = $this->formField;
        $this->vars['nameValue'] = $this->getNameValue();
        $this->vars['descriptionValue'] = $this->getDescriptionValue();
        $this->vars['listWidget'] = $this->listWidget;
        $this->vars['searchWidget'] = $this->searchWidget;
        $this->vars['prompt'] = str_replace('%s', '<i class="icon-th-list"></i>', $this->prompt);
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addJs('js/recordfinder.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        return strlen($value) ? $value : null;
    }

    public function getKeyValue()
    {
        if (!$this->relationModel)
            return null;

        return $this->relationModel->{$this->keyField};
    }

    public function getNameValue()
    {
        if (!$this->relationModel || !$this->nameColumn)
            return null;

        return $this->relationModel->{$this->nameColumn};
    }

    public function getDescriptionValue()
    {
        if (!$this->relationModel || !$this->descriptionColumn)
            return null;

        return $this->relationModel->{$this->descriptionColumn};
    }

    public function onFindRecord()
    {
        $this->prepareVars();
        return $this->makePartial('recordfinder_form');
    }

    protected function makeListWidget()
    {
        $config = $this->makeConfig($this->getConfig('list'));
        $config->model = $this->model->makeRelation($this->relationName);
        $config->alias = $this->alias . 'List';
        $config->showSetup = false;
        $config->showCheckboxes = false;
        $config->recordsPerPage = 20;
        $config->recordOnClick = sprintf("$('#%s').recordFinder('updateRecord', this, ':id')", $this->getId());
        $widget = $this->makeWidget('Backend\Widgets\Lists', $config);

        // $widget->bindEvent('list.extendQueryBefore', function($query) {

        //     /*
        //      * Where not in the current list of related records
        //      */
        //     $existingIds = $this->findExistingRelationIds();
        //     if (count($existingIds)) {
        //         $query->whereNotIn('id', $existingIds);
        //     }

        // });

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