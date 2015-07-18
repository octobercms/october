<?php namespace Backend\Behaviors;

use Backend\Classes\ControllerBehavior;
use League\Csv\Writer;

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

        $this->addJs('js/october.importexport.js', 'core');
        $this->addCss('css/importexport.css', 'core');

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
    // Importing
    //

    /**
     * Prepares the view data.
     * @return void
     */
    public function prepareVars()
    {
        $this->vars['importUploadFormWidget'] = $this->importUploadFormWidget;
        $this->vars['importColumns'] = $this->getImportDbColumns();

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

    }

    protected function makeImportUploadFormWidget()
    {
        // first_row_titles FALSE is generic columns (1,2,3,4,5..)

        $widgetConfig = $this->makeConfig('~/modules/backend/behaviors/importexportcontroller/partials/fields_import.yaml');
        $widgetConfig->model = $this->importGetModel();
        $widgetConfig->alias = 'importUploadForm';

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);

        $widget->bindEvent('form.beforeRefresh', function($holder) {
            $holder->data = [];
        });

        return $widget;
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