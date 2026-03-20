<?php namespace System\Classes\UiFactory\Migrate;

/**
 * PopupButton
 *
 * @method PopupButton ajaxHandler(string $ajaxHandler) ajaxHandler
 * @method PopupButton ajaxData(array $ajaxData) ajaxData
 * @method PopupButton size(string $size) size of the popup
 * @method PopupButton keyboard(bool $keyboard) keyboard can close the popup
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PopupButton extends AjaxButton
{
    /**
     * buildAttributes
     */
    protected function buildAttributes(array $attr = []): array
    {
        $attr = parent::buildAttributes($attr);

        $attr['data-control'] = 'popup';

        // Popup uses data-handler
        unset($attr['data-request']);
        $attr['data-handler'] = $this->ajaxHandler;

        if ($this->size !== null) {
            $attr['data-size'] = $this->size;
        }

        if ($this->keyboard === false) {
            $attr['data-keyboard'] = 'false';
        }

        return $attr;
    }
}
