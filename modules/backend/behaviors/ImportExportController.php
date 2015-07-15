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
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        $this->addJs('js/october.importexport.js', 'core');
        $this->addCss('css/importexport.css', 'core');
    }

    public function import()
    {

    }

    public function importRender()
    {
        return $this->importExportMakePartial('container');
    }

    public function importRenderUpload()
    {
        return $this->importExportMakePartial('import_upload');
    }

    public function importRenderFields()
    {
        return $this->importExportMakePartial('import_fields');
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

}