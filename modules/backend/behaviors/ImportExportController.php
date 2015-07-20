<?php namespace Backend\Behaviors;

use Str;
use Backend\Classes\ControllerBehavior;
use League\Csv\Writer as CsvWrtier;
use League\Csv\Reader as CsvReader;
use ApplicationException;
use Exception;

/**
 * Import/Export Controller Behavior
 * Adds features for importing and exporting data.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ImportExportController extends ControllerBehavior
{

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['importExportConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     */
    protected $requiredConfig = [];

    /**
     * @var Model Import model
     */
    public $importModel;

    /**
     * @var array Import column configuration.
     */
    public $importColumns;

    /**
     * @var Backend\Classes\WidgetBase Reference to the widget used for uploading import file.
     */
    protected $importUploadFormWidget;

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        $this->addJs('js/october.import.js', 'core');
        $this->addCss('css/import.css', 'core');

        /*
         * Build configuration
         */
        $this->config = $this->makeConfig($controller->importExportConfig, $this->requiredConfig);

        /*
         * Import form widget
         */
        if ($this->importUploadFormWidget = $this->makeImportUploadFormWidget()) {
            $this->importUploadFormWidget->bindToController();
        }
    }

    //
    // Controller actions
    //

    public function import()
    {
        $this->prepareVars();
    }

    public function export()
    {
        // TBA
    }

    //
    // Importing AJAX
    //

    public function onImport()
    {
        // traceLog(post());
    }

    public function onImportLoadForm()
    {
        try {
            $this->checkRequiredImportColumns();
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }

        return $this->importExportMakePartial('import_form');
    }

    public function onImportLoadColumnSampleForm()
    {
        if (($columnId = post('file_column_id', false)) === false) {
            throw new ApplicationException('Missing column identifier');
        }

        $columns = $this->getImportFileColumns();
        if (!array_key_exists($columnId, $columns)) {
            throw new ApplicationException('Unknown column');
        }

        $path = $this->getImportFilePath();
        $reader = CsvReader::createFromPath($path);

        if (post('first_row_titles')) {
            $reader->setOffset(1);
        }

        $data = $reader->setLimit(20)->fetchColumn((int) $columnId);

        /*
         * Clean up data
         */
        foreach ($data as $index => $sample) {
            $data[$index] = Str::limit($sample, 100);
            if (!strlen($data[$index])) {
                unset($data[$index]);
            }
        }

        $this->vars['columnName'] = array_get($columns, $columnId);
        $this->vars['columnData'] = $data;

        return $this->importExportMakePartial('column_sample_form');
    }

    //
    // Importing
    //

    /**
     * Prepares the view data.
     * @return void
     */
    public function prepareVars()
    {
        $this->vars['importUploadFormWidget'] = $this->importUploadFormWidget;
        $this->vars['importDbColumns'] = $this->getImportDbColumns();
        $this->vars['importFileColumns'] = $this->getImportFileColumns();

        // Make these variables to widgets
        $this->controller->vars += $this->vars;
    }

    public function importRender()
    {
        return $this->importExportMakePartial('import');
    }

    public function importGetModel()
    {
        if ($this->importModel !== null) {
            return $this->importModel;
        }

        $modelClass = $this->getConfig('import[modelClass]');
        return $this->importModel = new $modelClass;
    }

    protected function getImportDbColumns()
    {
        if ($this->importColumns !== null) {
            return $this->importColumns;
        }
        $columnConfig = $this->getConfig('import[list]');
        return $this->importColumns = $this->makeListColumns($columnConfig);
    }

    protected function getImportFileColumns()
    {
        if (!$path = $this->getImportFilePath()) {
            return null;
        }

        $reader = CsvReader::createFromPath($path);
        $firstRow = $reader->fetchOne(0);

        if (!post('first_row_titles')) {
            array_walk($firstRow, function(&$value, $key) {
                $value = 'Column #'.($key + 1);
            });
        }

        return $firstRow;
    }

    protected function makeImportUploadFormWidget()
    {
        $widgetConfig = $this->makeConfig('~/modules/backend/behaviors/importexportcontroller/partials/fields_import.yaml');
        $widgetConfig->model = $this->importGetModel();
        $widgetConfig->alias = 'importUploadForm';

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);

        $widget->bindEvent('form.beforeRefresh', function($holder) {
            $holder->data = [];
        });

        return $widget;
    }

    protected function getImportFilePath()
    {
        $model = $this->importGetModel();
        $file = $model
            ->import_file()
            ->withDeferred($this->importUploadFormWidget->getSessionKey())
            ->first();

        if (!$file) {
            return null;
        }

        return $file->getLocalPath();
    }

    public function importIsColumnRequired($columnName)
    {
        $model = $this->importGetModel();
        return $model->isAttributeRequired($columnName);
    }

    protected function checkRequiredImportColumns()
    {
        if (!$matches = post('column_match', [])) {
            throw new ApplicationException('Please match some columns first.');
        }

        $dbColumns = $this->getImportDbColumns();
        foreach ($dbColumns as $column => $label) {
            if (!$this->importIsColumnRequired($column)) continue;

            $found = false;
            foreach ($matches as $matchedColumns) {
                if (in_array($column, $matchedColumns)) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                throw new ApplicationException('Please specify a match for the required field '.$label.'.');
            }
        }
    }

    //
    // Exporting
    //


    //
    // Helpers
    //

    /**
     * Controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function importExportMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('import_export_'.$partial, $params + $this->vars, false);
        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }

    protected function makeListColumns($config)
    {
        $config = $this->makeConfig($config);

        if (!isset($config->columns) || !is_array($config->columns)) {
            return null;
        }

        $result = [];
        foreach ($config->columns as $attribute => $column) {
            $result[$attribute] = array_get($column, 'label', $attribute);
        }

        return $result;
    }
}