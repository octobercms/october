<?php namespace Backend\FormWidgets;

use Lang;
use ApplicationException;
use Backend\Classes\FormWidgetBase;
use Illuminate\Database\Eloquent\Collection;

/**
 * RecordFinder renders a record finder field
 *
 *    user:
 *        label: User
 *        type: recordfinder
 *        list: ~/plugins/rainlab/user/models/user/columns.yaml
 *        recordsPerPage: 10
 *        title: Find Record
 *        keyFrom: id
 *        nameFrom: name
 *        descriptionFrom: email
 *        conditions: email = "bob@example.com"
 *        modelScope: whereActive
 *        searchMode: all
 *        searchScope: searchUsers
 *        useRelation: false
 *        modelClass: RainLab\User\Models\User
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RecordFinder extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    //
    // Configurable Properties
    //

    /**
     * @var string keyFrom is the field name to use for key
     */
    public $keyFrom;

    /**
     * @var string nameFrom is the relation column to display for the name
     */
    public $nameFrom = 'name';

    /**
     * @var string descriptionFrom is the relation column to display for the description
     */
    public $descriptionFrom;

    /**
     * @var string title text to display for the title of the popup list form
     */
    public $title = 'backend::lang.recordfinder.find_record';

    /**
     * @var int recordsPerPage is the maximum rows to display for each page
     */
    public $recordsPerPage = 10;

    /**
     * @var string modelScope uses a custom scope method for the list query.
     */
    public $modelScope;

    /**
     * @var string conditions filters the relation using a raw where query statement.
     */
    public $conditions;

    /**
     * @var mixed defaultSort column to look for.
     */
    public $defaultSort;

    /**
     * @var bool showSetup in the search list.
     */
    public $showSetup = false;

    /**
     * @var bool|array|null structure configuration in the search list.
     */
    public $structure = null;

    /**
     * @var string searchMode if searching the records, specifies a policy to use.
     * - all: result must contain all words
     * - any: result can contain any word
     * - exact: result must contain the exact phrase
     */
    public $searchMode;

    /**
     * @var bool inlineOptions displays the field with buttons alongside the selected record
     * with an assumed amount of horizontal space to accommodate it. Disable this mode
     * if horizontal space is limited.
     */
    public $inlineOptions = true;

    /**
     * @var string searchScope uses a custom scope method for performing searches.
     */
    public $searchScope;

    /**
     * @var boolean useRelation flag for using the name of the field as a relation
     * name to interact with directly on the parent model. Default: true. Disable
     * to return just the selected model's ID
     */
    public $useRelation = true;

    /**
     * @var string modelClass of the model to use for listing records when
     * useRelation = false
     */
    public $modelClass;

    /**
     * @var string popupSize as, either giant, huge, large, small, tiny or adaptive
     */
    public $popupSize = 'huge';

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'recordfinder';

    /**
     * @var Model relationModel
     */
    public $relationModel;

    /**
     * @var string|int relationKeyValue
     */
    protected $relationKeyValue = -1;

    /**
     * @var \Backend\Widgets\Lists listWidget reference to the widget used for viewing (list or form).
     */
    protected $listWidget;

    /**
     * @var \Backend\Widgets\Search searchWidget reference to the widget used for searching
     */
    protected $searchWidget;

    /**
     * @var \Backend\Widgets\Filter filterWidget reference to the widget used for filtering
     */
    protected $filterWidget;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'title',
            'keyFrom',
            'nameFrom',
            'descriptionFrom',
            'modelScope',
            'defaultSort',
            'showSetup',
            'structure',
            'conditions',
            'inlineOptions',
            'searchMode',
            'searchScope',
            'recordsPerPage',
            'useRelation',
            'modelClass',
            'popupSize',
        ]);

        if (isset($this->config->scope)) {
            $this->modelScope = $this->config->scope;
        }

        if (!$this->useRelation && !class_exists($this->modelClass)) {
            throw new ApplicationException(Lang::get('backend::lang.recordfinder.invalid_model_class', ['modelClass' => $this->modelClass]));
        }

        if (!post('recordfinder_flag')) {
            return;
        }

        $this->listWidget = $this->makeListWidget();
        $this->listWidget->bindToController();

        // Search widget
        if ($this->searchWidget = $this->makeSearchWidget()) {
            $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());

            // Link the Search Widget to the List Widget
            $this->searchWidget->bindEvent('search.submit', function () {
                $this->listWidget->setSearchTerm($this->searchWidget->getActiveTerm());
                return $this->listWidget->onRefresh();
            });

            $this->searchWidget->bindToController();
        }

        // Filter widget
        if ($this->filterWidget = $this->makeFilterWidget()) {
            $this->listWidget->addFilter([$this->filterWidget, 'applyAllScopesToQuery']);

            // Filter the list when the scopes are changed
            $this->filterWidget->bindEvent('filter.update', function() {
                return $this->listWidget->onFilter();
            });

            $this->filterWidget->bindToController();
        }
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/recordfinder.css');
        $this->addJs('js/recordfinder.js', ['type' => 'module']);
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->relationModel = $this->getLoadValue();

        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $this->vars['displayMode'] = $this->inlineOptions ? 'single' : 'multi';
        $this->vars['popupSize'] = $this->popupSize;
        $this->vars['value'] = $this->getKeyValue();
        $this->vars['field'] = $this->formField;
        $this->vars['nameValue'] = $this->getNameValue();
        $this->vars['descriptionValue'] = $this->getDescriptionValue();
        $this->vars['listWidget'] = $this->listWidget;
        $this->vars['searchWidget'] = $this->searchWidget;
        $this->vars['filterWidget'] = $this->filterWidget;
        $this->vars['title'] = $this->title;
    }

    /**
     * onRefresh AJAX handler
     */
    public function onRefresh()
    {
        $value = post($this->getFieldName());

        $this->setKeyValue($value);

        $this->prepareVars();

        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    /**
     * onClearRecord AJAX handler
     */
    public function onClearRecord()
    {
        $this->setKeyValue(null);

        $this->prepareVars();

        return ['#'.$this->getId('container') => $this->makePartial('recordfinder')];
    }

    /**
     * onFindRecord AJAX handler
     */
    public function onFindRecord()
    {
        $this->prepareVars();

        // Purge the search term stored in session
        if ($this->searchWidget) {
            $this->listWidget->setSearchTerm(null);
            $this->searchWidget->setActiveTerm(null);
        }

        return $this->makePartial('recordfinder_form');
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
        $value = null;

        if ($this->useRelation) {
            [$model, $attribute] = $this->resolveModelAttribute($this->valueFrom);
            if ($model !== null) {
                $value = $model->{$attribute};
            }

            // Multi support
            if ($value instanceof Collection) {
                $value = $value->first();
            }
        }
        else {
            $value = parent::getLoadValue();
            if ($value) {
                $value = $this->modelClass::where($this->getKeyFromAttributeName(), $value)->first();
            }
        }

        return $value;
    }

    /**
     * setKeyValue
     */
    public function setKeyValue($value)
    {
        $this->relationKeyValue = $value;

        if ($this->useRelation) {
            [$model, $attribute] = $this->resolveModelAttribute($this->valueFrom);
            $model->{$attribute} = $value;
        }
        else {
            $this->formField->value = $value;
        }
    }

    /**
     * getKeyValue
     */
    public function getKeyValue()
    {
        if ($this->relationKeyValue !== -1) {
            return $this->relationKeyValue;
        }

        if (!$this->relationModel) {
            return null;
        }

        return $this->useRelation
            ? $this->relationModel->{$this->getKeyFromAttributeName()}
            : $this->formField->value;
    }

    /**
     * getKeyFromAttributeName
     */
    protected function getKeyFromAttributeName()
    {
        if ($this->keyFrom) {
            return $this->keyFrom;
        }

        if (!$this->useRelation) {
            return 'id';
        }

        $relationType = $this->getRelationType();
        $relationObject = $this->getRelationObject();

        // Relations can specify a custom local or foreign "other" key,
        // which can be detected and implemented here automatically.
        if (in_array($relationType, ['belongsTo'])) {
            $primaryKeyName = $relationObject->getOwnerKeyName();
        }
        elseif (in_array($relationType, ['hasMany', 'hasOne', 'belongsToMany', 'morphedByMany', 'morphToMany'])) {
            $primaryKeyName = $relationObject->getRelatedKeyName();
        }
        else {
            $primaryKeyName = $this->getRelationModel()->getKeyName();
        }

        return $primaryKeyName;
    }

    /**
     * getNameValue
     */
    public function getNameValue()
    {
        if (!$this->relationModel || !$this->nameFrom) {
            return null;
        }

        return $this->relationModel->{$this->nameFrom};
    }

    /**
     * getDescriptionValue
     */
    public function getDescriptionValue()
    {
        if (!$this->relationModel || !$this->descriptionFrom) {
            return null;
        }

        return $this->relationModel->{$this->descriptionFrom};
    }

    /**
     * makeListWidget
     */
    protected function makeListWidget()
    {
        $config = $this->makeConfig($this->getConfig('list'));
        $config->model = $this->useRelation ? $this->getRelationModel() : new $this->modelClass;
        $config->alias = $this->alias . 'List';
        $config->showSetup = $this->showSetup;
        $config->showCheckboxes = false;
        $config->defaultSort = $this->defaultSort;
        $config->recordsPerPage = $this->recordsPerPage;
        $config->recordOnClick = sprintf("oc.fetchControl(document.getElementById('%s'), 'recordfinder').updateRecord(this, ':" . $this->getKeyFromAttributeName() . "')", $this->getId());

        // Structure support
        $structureConfig = $this->makeListStructureConfig($config);
        if ($structureConfig) {
            $widget = $this->makeWidget(\Backend\Widgets\ListStructure::class, $structureConfig);
        }
        else {
            $widget = $this->makeWidget(\Backend\Widgets\Lists::class, $config);
        }

        $widget->setSearchOptions([
            'mode' => $this->searchMode,
            'scope' => $this->searchScope,
        ]);

        if ($sqlConditions = $this->conditions) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($sqlConditions) {
                $query->whereRaw($sqlConditions);
            });
        }
        elseif ($scopeMethod = $this->modelScope) {
            $widget->bindEvent('list.extendQueryBefore', function ($query) use ($scopeMethod) {
                if ($callableMethod = $this->formField->getCallableMethodFromValue($scopeMethod)) {
                    $callableMethod($query, $this->model);
                }
                elseif (is_string($scopeMethod)) {
                    $query->$scopeMethod($this->model);
                }
            });
        }
        else {
            if ($this->useRelation) {
                $widget->bindEvent('list.extendQueryBefore', function ($query) {
                    $this->getRelationObject()->addDefinedConstraintsToQuery($query);
                });
            }
        }

        return $widget;
    }

    /**
     * makeListStructureConfig
     */
    protected function makeListStructureConfig($config)
    {
        if ($this->structure === false) {
            return null;
        }

        $structureConfig = [];
        if (is_array($this->structure)) {
            $structureConfig = $this->structure;
        }
        elseif ($this->structure === true) {
            $structureConfig['showTree'] = true;
        }
        elseif (
            ($model = $config->model) &&
            $model->isClassInstanceOf(\October\Contracts\Database\TreeInterface::class)
        ) {
            $structureConfig['showTree'] = true;
        }

        // Force read-only mode
        if ($structureConfig) {
            $structureConfig = ['showReorder' => false] + $structureConfig;
            return $this->mergeConfig($config, $structureConfig);
        }

        return null;
    }

    /**
     * makeSearchWidget
     */
    protected function makeSearchWidget()
    {
        $config = $this->makeConfig();
        $config->alias = $this->alias . 'Search';
        $config->growable = false;
        $config->prompt = 'backend::lang.list.search_prompt';
        $widget = $this->makeWidget(\Backend\Widgets\Search::class, $config);
        $widget->cssClasses[] = 'recordfinder-search';
        return $widget;
    }

    /**
     * makeFilterWidget
     */
    protected function makeFilterWidget()
    {
        $filterConfig = $this->getConfig('filter');
        if (!$filterConfig) {
            return null;
        }

        $config = $this->makeConfig($filterConfig);
        $config->model = $this->useRelation ? $this->getRelationModel() : new $this->modelClass;
        $config->alias = $this->alias . 'Filter';
        $widget = $this->makeWidget(\Backend\Widgets\Filter::class, $config);
        $widget->cssClasses[] = 'recordfinder-filter';
        return $widget;
    }

    /**
     * resetFormValue from the form field
     */
    public function resetFormValue()
    {
        $this->setKeyValue($this->formField->value);

        // Transfer approved config
        $this->modelScope = $this->formField->modelScope ?: $this->formField->scope;
        $this->conditions = $this->formField->conditions;
        $this->defaultSort = $this->formField->defaultSort;
    }
}
