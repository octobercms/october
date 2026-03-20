<?php namespace System\Classes\UiFactory\Migrate;

/**
 * AjaxButton
 *
 * @method AjaxButton ajaxHandler(string $ajaxHandler) ajaxHandler
 * @method AjaxButton ajaxData(array $ajaxData) ajaxData
 * @method AjaxButton ajaxSuccess(array $ajaxSuccess) ajaxSuccess JS function
 * @method AjaxButton confirmMessage(string $confirmMessage) confirmMessage
 * @method AjaxButton loadingMessage(string $loadingMessage) loadingMessage
 * @method AjaxButton listCheckedRequest(bool $listCheckedRequest) listCheckedRequest includes selected list checkboxes in the AJAX request
 * @method AjaxButton attachLoading(bool $attachLoading) attachLoading attach loading indicator when an AJAX request is running
 * @method AjaxButton attachPopupLoading(bool $attachPopupLoading) attachPopupLoading
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class AjaxButton extends Button
{
    /**
     * __construct
     */
    public function __construct($label = 'Button', $ajaxHandler = 'onAjax', $config = [])
    {
        $this->ajaxHandler($ajaxHandler);

        parent::__construct($label, $config);
    }

    /**
     * buildAttributes
     */
    protected function buildAttributes(array $attr = []): array
    {
        $attr = parent::buildAttributes($attr);

        $attr['data-request'] = $this->ajaxHandler;

        if ($this->ajaxData !== null) {
            $attr['data-request-data'] = $this->ajaxData;
        }

        if ($this->ajaxSuccess !== null) {
            $attr['data-request-success'] = $this->ajaxSuccess;
        }

        if ($this->confirmMessage !== null) {
            $attr['data-request-confirm'] = __($this->confirmMessage);
        }

        if ($this->loadingMessage !== null) {
            $attr['data-request-message'] = __($this->loadingMessage);
        }

        if ($this->attachLoading) {
            $attr['data-attach-loading'] = true;
        }

        if ($this->attachPopupLoading) {
            $attr['data-popup-load-indicator'] = true;
        }

        if ($this->listCheckedRequest) {
            $attr['data-list-checked-request'] = true;
        }

        return $attr;
    }

    /**
     * formDeleteButton
     */
    public function formDeleteButton(): static
    {
        $this->label('');

        $this->replaceCssClass('oc-icon-delete btn-icon danger pull-right');

        return $this;
    }
}
