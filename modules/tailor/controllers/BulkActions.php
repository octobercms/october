<?php namespace Tailor\Controllers;

use Backend;
use BackendMenu;
use Tailor\Classes\Blueprint;
use Tailor\Classes\BlueprintIndexer;
use Backend\Classes\WildcardController;
use ApplicationException;
use ForbiddenException;
use NotFoundException;

/**
 * BulkActions controller
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class BulkActions extends WildcardController
{
    /**
     * @var array implement extensions
     */
    public $implement = [
        \Backend\Behaviors\ImportExportController::class,
    ];

    /**
     * @var string importExportConfig is `ImportExportController` configuration.
     */
    public $importExportConfig = 'config_import_export.yaml';

    /**
     * @var Blueprint activeSource
     */
    protected $activeSource;

    /**
     * @var string actionMethod is the action method to call
     */
    protected $actionMethod;

    /**
     * beforeDisplay
     */
    public function beforeDisplay()
    {
        // Pop off first parameter as source handle
        $sourceHandle = array_shift($this->params);
        $this->makeBlueprintSource($sourceHandle);

        $validMethods = ['export', 'import', 'download'];
        $slug = $this->params[0] ?? null;

        if (in_array($slug, $validMethods)) {
            // Pop second parameter as action method
            $actionMethod = array_shift($this->params);

            $this->actionMethod = $this->actionView = $actionMethod;
        }

        if (!$this->activeSource) {
            throw new NotFoundException;
        }

        $this->checkSourcePermission();

        $this->setNavigationContext();

        if ($this->actionMethod === 'import') {
            $this->beforeDisplayImport();
        }
        elseif ($this->actionMethod === 'export') {
            $this->beforeDisplayExport();
        }
    }

    /**
     * index action
     */
    public function index()
    {
        if ($this->hasFatalError()) {
            return;
        }

        if ($this->actionMethod) {
            return $this->{$this->actionMethod}(...$this->params);
        }

        return Backend::redirect('tailor/entries/'.$this->activeSource->handleSlug);
    }

    /**
     * actionUrl returns a URL for this controller and supplied action.
     */
    public function actionUrl($action = null, $path = null)
    {
        $url = $action === 'download'
            ? 'tailor/bulkactions/'.$this->activeSource->handleSlug.'/'.$action
            : 'tailor/entries/'.$this->activeSource->handleSlug;

        if ($path) {
            $url .= '/'.$path;
        }

        return Backend::url($url);
    }

    /**
     * importExportExtendModel
     */
    public function importExportExtendModel($model)
    {
        $model->setBlueprintUuid($this->activeSource->uuid);

        $model->extendWithBlueprint();

        return $model;
    }

    /**
     * onImport enforces update and publish sub-permissions before delegating to the behavior.
     */
    public function onImport()
    {
        if (post('ImportOptions.update_existing') && !$this->hasSourcePermission()) {
            throw new ApplicationException(__("You do not have permission to update existing records."));
        }

        if (!$this->hasSourcePermission('publish')) {
            $matches = post('column_match', []);
            $publishColumns = ['is_enabled', 'published_at', 'expired_at'];
            foreach ($matches as $columnIndex => $dbNames) {
                foreach ((array) $dbNames as $dbName) {
                    if (in_array($dbName, $publishColumns, true)) {
                        throw new ApplicationException(__("You do not have permission to publish records."));
                    }
                }
            }
        }

        return $this->asExtension('ImportExportController')->onImport();
    }

    /**
     * hasSourcePermission is a convenience wrapper checking a sub-permission on the active source.
     */
    protected function hasSourcePermission($name = null): bool
    {
        return $this->user->hasAccess($this->activeSource->getPermissionCodeName($name));
    }

    /**
     * importExportGetFileName
     */
    public function importExportGetFileName()
    {
        return $this->activeSource->handleSlug;
    }

    /**
     * makeBlueprintSource
     */
    protected function makeBlueprintSource($activeSource = null): void
    {
        $this->activeSource = $activeSource
            ? BlueprintIndexer::instance()->findByHandle($activeSource)
            : null;
    }

    /**
     * checkSourcePermission
     */
    protected function checkSourcePermission()
    {
        $code = $this->activeSource->getPermissionCodeName(
            $this->actionMethod === 'import' ? 'create' : null
        );

        if (!$this->user->hasAccess($code)) {
            throw new ForbiddenException;
        }
    }

    /**
     * setNavigationContext
     */
    protected function setNavigationContext()
    {
        $item = BlueprintIndexer::instance()->findSecondaryNavigation($this->activeSource->uuid);
        if ($item) {
            $item->setBackendControllerContext();
        }
        else {
            BackendMenu::setContext('October.Tailor', 'tailor');
        }
    }
}
