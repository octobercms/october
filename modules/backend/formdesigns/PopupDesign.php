<?php namespace Backend\FormDesigns;

use Lang;
use Backend\Classes\FormDesignBase;
use ApplicationException;

/**
 * PopupDesign displays a form inside a modal popup dialog, typically used
 * from a list page. Provides AJAX handlers for loading, saving, deleting,
 * and canceling the popup form.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PopupDesign extends FormDesignBase
{
    /**
     * init emulates the form action for popup forms
     */
    public function init(): void
    {
        $updateId = $this->getPopupFormRecordId();

        // Emulate the form action
        if (post('form_popup_flag')) {
            if ($updateId) {
                $this->controller->update($updateId);
            }
            else {
                $this->controller->create();
            }
            return;
        }

        // Initialize the model for relation AJAX requests inside popup forms
        // this is needed since bindToPopups doesn't propagate far enough, so
        // this could be removed if that ability was improved to go further.
        if ($this->controller->isClassExtendedWith(\Backend\Behaviors\RelationController::class)) {
            $this->controller->initRelation($this->controller->formCreateModelObject());
        }
    }

    /**
     * formRenderDesignButtons renders popup-specific buttons
     */
    public function formRenderDesignButtons(): string
    {
        return $this->makePartial('buttons');
    }

    /**
     * formRenderDesignError renders popup-specific error display
     */
    public function formRenderDesignError(string $fatalError): string
    {
        return $this->makePartial('error', ['fatalError' => $fatalError]);
    }

    /**
     * index_onLoadPopupForm
     */
    public function index_onLoadPopupForm()
    {
        $fc = $this->getFormController();

        if ($id = $this->getPopupFormRecordId()) {
            $this->controller->update($id);
            $this->vars['popupTitle'] = $this->getPopupLang('update[title]', 'backend::lang.form.update_title');
            $this->vars['recordId'] = $id;
        }
        else {
            $this->controller->create();
            $this->vars['popupTitle'] = $this->getPopupLang('create[title]', 'backend::lang.form.create_title');
        }

        $this->vars['popupSize'] = $this->controller->pageSize;

        return $this->controller->formRenderDesign();
    }

    /**
     * index_onPopupSave
     */
    public function index_onPopupSave()
    {
        if ($id = $this->getPopupFormRecordId()) {
            $this->controller->update_onSave($id);
        }
        else {
            $this->controller->create_onSave();
        }

        return $this->controller->listRefresh();
    }

    /**
     * index_onPopupCancel
     */
    public function index_onPopupCancel()
    {
        if ($id = $this->getPopupFormRecordId()) {
            $this->controller->update_onCancel($id);
        }
        else {
            $this->controller->create_onCancel();
        }
    }

    /**
     * index_onPopupDelete
     */
    public function index_onPopupDelete()
    {
        if ($id = $this->getPopupFormRecordId()) {
            $this->controller->update_onDelete($id);
        }

        return $this->controller->listRefresh();
    }

    /**
     * getPopupFormRecordId returns the target identifier for the record,
     * contained within the `form_record_id` postback value. The value is
     * decoded since HTML attributes are escaped and it may be a string.
     */
    protected function getPopupFormRecordId(): string
    {
        return urldecode((string) post('form_record_id'));
    }

    /**
     * getPopupLang returns a language string from the form config
     */
    protected function getPopupLang(string $name, ?string $default = null): string
    {
        $fc = $this->getFormController();
        $configName = $fc->getConfig($name, $default);

        return Lang::get($configName, [
            'name' => Lang::get($fc->getConfig('name', 'backend::lang.model.name'))
        ]);
    }
}
