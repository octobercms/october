<?php namespace Tailor\Behaviors;

use Flash;
use Backend\Classes\FormField;
use Backend\Classes\ControllerBehavior;
use Exception;

/**
 * VersionController is a modifier to FormController to enable version records
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class VersionController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;

    /**
     * @var Model model used by the form
     */
    protected $primaryModel;

    /**
     * @var Model model used by the form
     */
    protected $model;

    /**
     * @var string versionId
     */
    protected $versionId;

    /**
     * initVersion
     */
    public function initVersion($model)
    {
        $this->primaryModel = $model;

        if ($this->isVersionMode()) {
            $versionModel = $this->controller->formFindModelObject($this->getVersionId());

            $this->controller->initForm($versionModel, FormField::CONTEXT_PREVIEW);

            $this->model = $versionModel;

            $this->versionId = $versionModel->getKey();
        }
        else {
            $this->controller->initForm($model);

            $this->model = $model;
        }
    }

    /**
     * Controller "update" action used for updating existing model records.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return void
     */
    public function update($recordId = null)
    {
        try {
            $this->controller->formSetContext(FormField::CONTEXT_PREVIEW);
            $this->controller->formApplyDesign();

            $model = $this->controller->formFindModelObject($recordId);

            $this->initVersion($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * onRestoreVersion restores a version to the primary model
     */
    public function onRestoreVersion($recordId = null)
    {
        $model = $this->controller->formFindModelObject($recordId);

        $this->initVersion($model);

        $versionModel = $this->versionGetVersionModel();

        $versionModel->restoreVersionSnapshot($model);

        Flash::success('Version restored');

        return $this->controller->makeRedirect(FormField::CONTEXT_UPDATE, $model);
    }

    /**
     * versionBeforeSave
     */
    public function versionBeforeSave($model)
    {
        $model->saveVersionSnapshot((array) post('Version'));
    }

    /**
     * versionGetPrimaryModel
     */
    public function versionGetPrimaryModel()
    {
        return $this->primaryModel;
    }

    /**
     * versionGetVersionModel
     */
    public function versionGetVersionModel()
    {
        return $this->model;
    }

    /**
     * getVersionId
     */
    public function getVersionId(): string
    {
        if ($this->versionId) {
            return $this->versionId;
        }

        return (string) get('version');
    }

    /**
     * isVersionMode
     */
    public function isVersionMode(): bool
    {
        return (bool) $this->getVersionId();
    }
}
