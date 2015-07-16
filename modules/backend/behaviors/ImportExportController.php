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
         * Import
         */
        $modelClass = $this->getConfig('import[modelClass]');
        $this->importModel = new $modelClass;

        $this->importUploadFormWidget = $this->makeImportUploadFormWidget();
        $this->importUploadFormWidget->bindToController();
    }

    /**
     * Prepares the view data.
     * @return void
     */
    public function prepareVars()
    {
        $this->vars['importUploadFormWidget'] = $this->importUploadFormWidget;
    }

    public function import()
    {
        $this->prepareVars();
    }

    public function importRender()
    {
        return $this->importExportMakePartial('container');
    }

    public function importRenderUpload()
    {
        return $this->importExportMakePartial('import_upload');
    }

    public function importRenderColumns()
    {
        return $this->importExportMakePartial('import_columns');
    }

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

    protected function makeImportUploadFormWidget()
    {
        $fields = [
            'import_file' => [
                'label' => 'Import file',
                'type' => 'fileupload',
                'mode' => 'file'
            ],
            'first_row_titles' => [
                'label' => 'First row contains column titles',
                'comment' => 'Leave this checked if the first row in the CSV is used as the column titles.',
                'type' => 'checkbox',
                'default' => true
            ]
        ];

        // first_row_titles FALSE is generic columns (1,2,3,4,5..)

        $widgetConfig = $this->makeConfig();
        $widgetConfig->model = $this->importModel;
        $widgetConfig->alias = 'importUploadForm';
        $widgetConfig->fields = $fields;

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
        return $widget;
    }

}