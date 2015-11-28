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

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'recordfinder';

    /**
     * @var Model Relationship model
     */
    public $relationModel;

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
        $this->fillFromConfig([
            'title',
            'prompt',
            'keyFrom',
            'nameFrom',
            'descriptionFrom',
        ]);

        if (post('recordfinder_flag')) {
            $this->listWidget = $this->makeListWidget();
            $this->listWidget->bindToController();

            $this->searchWidget = $this->makeSearchWidget();
            $this->searchWidget->bindToController();

            /*
             * Link the Search Widget to the List Widget
             */
            $this->searchWidget->bindEvent('search.submit', function () {
                $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());
                return $this->listWidget->onRefresh();
            });

            $this->searchWidget->setActiveTerm(null);
        }
    }

    /**
     * Returns the model of a relation type,
     * supports nesting via HTML array.
     * @return Relation
     */
    protected function getRelationModel()
    {
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);

        if (!$model->hasRelation($attribute)) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_relation', [
                'class' => get_class($model),
                'relation' => $attribute
            ]));
        }

        return $model->makeRelation($attribute);
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
        list($model, $attribute) = $this->resolveModelAttribute($this->valueFrom);
        $model->{$attribute} = post($this->formField->getName());

        $this->prepareVars();
        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->relationModel = $this->getLoadValue();

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
     * {@inheritDoc}
     */
    protected function loadAssets()
    {
        $this->addJs('js/recordfinder.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return strlen($value) ? $value : null;
    }

    /**
     * {@inheritDoc}
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
        return $this->makePartial('recordfinder_form');
    }

    protected function makeListWidget()
    {
        $config = $this->makeConfig($this->getConfig('list'));
        $config->model = $this->getRelationModel();
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
