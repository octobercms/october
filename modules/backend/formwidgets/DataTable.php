<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Classes\FormWidgetBase;

/**
 * Data Table
 * Renders a table field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DataTable extends FormWidgetBase
{
    use \Backend\FormWidgets\DataTable\LegacyDataTable;

    //
    // Configurable Properties
    //

    /**
     * @var string Table size
     */
    public $size = 'large';

    /**
     * @var bool Allow rows to be sorted
     * @todo Not implemented...
     */
    public $rowSorting = false;

    /**
     * @var bool useLegacy uses legacy Table widget instead of Handsontable
     */
    public $useLegacy = false;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'datatable';

    /**
     * @var array Processed columns
     */
    protected $processedColumns = [];

    /**
     * @var array Columns requiring AJAX options
     */
    protected $ajaxColumns = [];

    /**
     * @var array Column dependencies
     */
    protected $columnDependencies = [];

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        if ($this->useLegacy) {
            return;
        }

        $this->addCss('css/datatable-handsontable.css');
        $this->addJs('js/datatable-handsontable.js', ['type' => 'module']);
    }

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'size',
            'rowSorting',
            'useLegacy',
        ]);

        if ($this->useLegacy) {
            $this->table = $this->makeLegacyTableWidget();
            $this->table->bindToController();
        }
        else {
            $this->processColumns();
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();

        if ($this->useLegacy) {
            return $this->makePartial('datatable');
        }

        return $this->makePartial('datatable_handsontable');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        if ($this->useLegacy) {
            $this->prepareLegacyVars();
        }
        else {
            $this->vars['name'] = $this->getFieldName();
            $this->vars['value'] = $this->getLoadValue() ?: [];
            $this->vars['columns'] = $this->processedColumns;
            $this->vars['colHeaders'] = array_column($this->processedColumns, 'title');
            $this->vars['ajaxColumns'] = $this->ajaxColumns;
            $this->vars['columnDependencies'] = $this->columnDependencies;
            $this->vars['hotOptions'] = $this->buildOptions();
            $this->vars['adding'] = $this->formField->getConfig('adding', true);
            $this->vars['deleting'] = $this->formField->getConfig('deleting', true);
            $this->vars['toolbar'] = $this->formField->getConfig('toolbar', true);
            $this->vars['searching'] = $this->formField->getConfig('searching', false);
            $this->vars['csvExport'] = $this->formField->getConfig('csvExport', false);
            $this->vars['csvImport'] = $this->formField->getConfig('csvImport', false);
        }
    }

    //
    // Column Processing
    //

    /**
     * processColumns processes column definitions into Handsontable format
     */
    protected function processColumns()
    {
        $columns = $this->formField->getConfig('columns', []);

        foreach ($columns as $columnName => $config) {
            $config = (array) $config;
            $column = $this->buildColumn($columnName, $config);
            $this->processedColumns[] = $column;

            if ($this->columnNeedsAjax($config)) {
                $this->ajaxColumns[] = $columnName;
            }

            if (isset($config['dependsOn'])) {
                $this->columnDependencies[$columnName] = $config['dependsOn'];
            }
        }
    }

    /**
     * buildColumn builds a single column config for Handsontable
     */
    protected function buildColumn(string $name, array $config): array
    {
        $column = [
            'data' => $name,
            'title' => isset($config['title']) ? Lang::get($config['title']) : $name,
            'readOnly' => $config['readOnly'] ?? false,
        ];

        if (isset($config['width'])) {
            $column['width'] = (int) str_replace('px', '', $config['width']);
        }

        $type = $config['type'] ?? 'string';
        $column = array_merge($column, $this->getTypeConfig($type, $config));

        if (isset($config['validation'])) {
            $column['_validation'] = $config['validation'];
        }

        return $column;
    }

    /**
     * getTypeConfig maps DataTable column types to Handsontable types
     */
    protected function getTypeConfig(string $type, array $config): array
    {
        switch ($type) {
            case 'checkbox':
                return ['type' => 'checkbox'];

            case 'dropdown':
                $strict = ($config['strict'] ?? true) !== false;
                $typeConfig = [
                    'type' => $strict ? 'dropdown' : 'autocomplete',
                    'strict' => $strict,
                    'filter' => !$strict,
                ];
                if (isset($config['options']) && is_array($config['options'])) {
                    $typeConfig['source'] = array_values($config['options']);
                    $typeConfig['_optionMap'] = $config['options'];
                }
                return $typeConfig;

            case 'autocomplete':
                return ['type' => 'autocomplete', 'strict' => false, 'filter' => true];

            case 'date':
                return [
                    'type' => 'date',
                    'dateFormat' => $config['dateFormat'] ?? 'YYYY-MM-DD',
                    'correctFormat' => true,
                ];

            case 'time':
                return [
                    'type' => 'time',
                    'timeFormat' => $config['timeFormat'] ?? 'HH:mm',
                    'correctFormat' => true,
                ];

            case 'numeric':
                return ['type' => 'numeric'];

            default:
                return ['type' => 'text'];
        }
    }

    /**
     * columnNeedsAjax determines if a column needs AJAX-loaded options
     */
    protected function columnNeedsAjax(array $config): bool
    {
        $type = $config['type'] ?? 'string';
        if (!in_array($type, ['dropdown', 'autocomplete'])) {
            return false;
        }

        return !isset($config['options']) || is_string($config['options']);
    }

    /**
     * buildOptions builds the global Handsontable configuration
     */
    protected function buildOptions(): array
    {
        $sorting = $this->formField->getConfig('sorting', false);
        $searching = $this->formField->getConfig('searching', false);
        $height = $this->formField->getConfig('height', false);

        $options = [
            'licenseKey' => 'non-commercial-and-evaluation',
            'rowHeaders' => false,
            'manualColumnResize' => true,
            'manualRowMove' => $sorting,
            'stretchH' => 'all',
            'preventOverflow' => 'horizontal',
            'autoWrapRow' => true,
            'autoWrapCol' => true,
            'undo' => true,
            'minRows' => 1,
            'rowHeights' => 30,
            'height' => $height ?: 'auto',
            'search' => $searching,
        ];

        return $options;
    }

    //
    // AJAX Handlers
    //

    /**
     * onGetDropdownOptions handles AJAX requests for dropdown/autocomplete options
     */
    public function onGetDropdownOptions()
    {
        $column = post('column');
        $rowData = post('rowData', []);

        $methodName = 'get' . studly_case($this->fieldName) . 'DataTableOptions';

        if ($this->model->methodExists($methodName)) {
            return ['options' => $this->model->$methodName($column, $rowData)];
        }

        if ($this->model->methodExists('getDataTableOptions')) {
            return ['options' => $this->model->getDataTableOptions($this->fieldName, $column, $rowData)];
        }

        return ['options' => []];
    }

    //
    // Data Handling
    //

    /**
     * @inheritDoc
     */
    public function getLoadValue()
    {
        if ($this->useLegacy) {
            return $this->getLegacyLoadValue();
        }

        return (array) parent::getLoadValue();
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->useLegacy) {
            return $this->getLegacySaveValue($value);
        }

        return json_decode($value, true) ?: [];
    }
}
