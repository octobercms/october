<?php namespace Backend\Behaviors;

use Lang;
use Backend;
use ApplicationException;
use Backend\Classes\ControllerBehavior;

/**
 * Used for reordering and sorting records.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         'Backend.Behaviors.ReorderController',
 *     ];
 *
 *     public $reorderConfig = 'config_reorder.yaml';
 *
 * The `$reorderConfig` property makes reference to the configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ReorderController extends ControllerBehavior
{
    /**
     * @inheritDoc
     */
    protected $requiredProperties = ['reorderConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     */
    protected $requiredConfig = ['modelClass'];

    /**
     * @var Model Import model
     */
    public $model;

    /**
     * @var string Model attribute to use for the display name
     */
    public $nameFrom = 'name';

    /**
     * @var bool Display parent/child relationships in the list.
     */
    protected $showTree = false;

    /**
     * @var string Reordering mode:
     * - simple: October\Rain\Database\Traits\Sortable
     * - nested: October\Rain\Database\Traits\NestedTree
     */
    protected $sortMode = null;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for the toolbar.
     */
    protected $toolbarWidget;

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        /*
         * Build configuration
         */
        $this->config = $this->makeConfig($controller->reorderConfig, $this->requiredConfig);

        /*
         * Widgets
         */
        if ($this->toolbarWidget = $this->makeToolbarWidget()) {
            $this->toolbarWidget->bindToController();
        }

        /*
         * Populate from config
         */
        $this->nameFrom = $this->getConfig('nameFrom', $this->nameFrom);
    }

    //
    // Controller actions
    //

    public function reorder()
    {
        $this->addJs('js/october.reorder.js', 'core');

        $this->controller->pageTitle = $this->controller->pageTitle
            ?: Lang::get($this->getConfig('title', 'backend::lang.reorder.default_title'));

        $this->validateModel();
        $this->prepareVars();
    }

    //
    // AJAX
    //

    public function onReorder()
    {
        $model = $this->validateModel();

        /*
         * Simple
         */
        if ($this->sortMode == 'simple') {
            if (
                (!$ids = post('record_ids')) ||
                (!$orders = post('sort_orders'))
            ) {
                return;
            }

            $model->setSortableOrder($ids, $orders);
        }
        /*
         * Nested set
         */
        elseif ($this->sortMode == 'nested') {
            $sourceNode = $model->find(post('sourceNode'));
            $targetNode = post('targetNode') ? $model->find(post('targetNode')) : null;

            if ($sourceNode == $targetNode) {
                return;
            }

            switch (post('position')) {
                case 'before':
                    $sourceNode->moveBefore($targetNode);
                    break;

                case 'after':
                    $sourceNode->moveAfter($targetNode);
                    break;

                case 'child':
                    $sourceNode->makeChildOf($targetNode);
                    break;

                default:
                    $sourceNode->makeRoot();
                    break;
            }
        }
    }

    //
    // Reordering
    //

    /**
     * Prepares common form data
     */
    protected function prepareVars()
    {
        $this->vars['reorderRecords'] = $this->getRecords();
        $this->vars['reorderModel'] = $this->model;
        $this->vars['reorderSortMode'] = $this->sortMode;
        $this->vars['reorderShowTree'] = $this->showTree;
        $this->vars['reorderToolbarWidget'] = $this->toolbarWidget;
    }

    public function reorderRender()
    {
        return $this->reorderMakePartial('container');
    }

    public function reorderGetModel()
    {
        if ($this->model !== null) {
            return $this->model;
        }

        $modelClass = $this->getConfig('modelClass');

        if (!$modelClass) {
            throw new ApplicationException('Please specify the modelClass property for reordering');
        }

        return $this->model = new $modelClass;
    }

    /**
     * Returns the display name for a record.
     * @return string
     */
    public function reorderGetRecordName($record)
    {
        return $record->{$this->nameFrom};
    }

    /**
     * Validate the supplied form model.
     * @return void
     */
    protected function validateModel()
    {
        $model = $this->controller->reorderGetModel();
        $modelTraits = class_uses($model);

        if (isset($modelTraits[\October\Rain\Database\Traits\Sortable::class])) {
            $this->sortMode = 'simple';
        }
        elseif (isset($modelTraits[\October\Rain\Database\Traits\NestedTree::class])) {
            $this->sortMode = 'nested';
            $this->showTree = true;
        }
        else {
            throw new ApplicationException('The model must implement the NestedTree or Sortable traits.');
        }

        return $model;
    }

    /**
     * Returns all the records from the supplied model.
     * @return Collection
     */
    protected function getRecords()
    {
        $records = null;
        $model = $this->controller->reorderGetModel();
        $query = $model->newQuery();

        $this->controller->reorderExtendQuery($query);

        if ($this->sortMode == 'simple') {
            $records = $query
                ->orderBy($model->getSortOrderColumn())
                ->get()
            ;
        }
        elseif ($this->sortMode == 'nested') {
            $records = $query->getNested();
        }

        return $records;
    }

    /**
     * Extend the query used for finding reorder records. Extra conditions
     * can be applied to the query, for example, $query->withTrashed();
     * @param October\Rain\Database\Builder $query
     * @return void
     */
    public function reorderExtendQuery($query)
    {
    }

    //
    // Widgets
    //

    protected function makeToolbarWidget()
    {
        if ($toolbarConfig = $this->getConfig('toolbar')) {
            $toolbarConfig = $this->makeConfig($toolbarConfig);
            $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        }
        else {
            $toolbarWidget = null;
        }

        return $toolbarWidget;
    }

    //
    // Helpers
    //

    /**
     * Controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function reorderMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial(
            'reorder_' . $partial,
            $params + $this->vars,
            false
        );

        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }
}
