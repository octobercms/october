<?php namespace System\Classes\UiFactory\Migrate;

use Html;
use Backend;
use System\Classes\UiElement;

/**
 * Button
 *
 * @method Button label(string $label) label for the button
 * @method Button icon(string $icon) icon
 * @method Button circleIcon(string $circleIcon) circleIcon button
 * @method Button linkUrl(string $linkUrl) linkUrl will use an anchor button
 * @method Button cssClass(string $cssClass) cssClass for the button
 * @method Button replaceCssClass(string $replaceCssClass) replaceCssClass defaults for the button
 * @method Button type(string $type) type of button
 * @method Button attributes(array $attributes) attributes in HTML
 * @method Button primary(bool $primary) primary button
 * @method Button outline(bool $outline) outline button
 * @method Button redirectBack(bool $redirectBack) redirectBack
 * @method Button dismissPopup(bool $dismissPopup) dismissPopup
 * @method Button loadingPopup(bool $loadingPopup) loadingPopup
 * @method Button listCheckedTrigger(bool $listCheckedTrigger) listCheckedTrigger enables the button when a list checkbox is selected
 * @method Button labelHtml(bool $labelHtml) labelHtml
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Button extends UiElement
{
    /**
     * __construct
     */
    public function __construct($label = 'Button', $linkOrConfig = null, $config = [])
    {
        $this->label($label);

        if (is_array($linkOrConfig)) {
            $config = $linkOrConfig;
        }
        elseif ($linkOrConfig !== null && $linkOrConfig !== '') {
            $this->linkTo($linkOrConfig);
        }

        parent::__construct($config);
    }

    /**
     * initDefaultValues override method
     */
    protected function initDefaultValues()
    {
        $this->type('default');
    }

    /**
     * render the element
     */
    public function render(): callable
    {
        return function() { ?>

            <?php if ($this->linkUrl): ?>

                <a
                    href="<?= $this->linkUrl ?>"
                    <?= Html::attributes($this->buildAttributes()) ?>
                ><?= $this->buildLabel() ?></a>

            <?php else: ?>

                <button
                    <?= Html::attributes($this->buildAttributes()) ?>
                ><?= $this->buildLabel() ?></button>

            <?php endif ?>

        <?php };
    }

    /**
     * buildLabel
     */
    protected function buildLabel()
    {
        $html = '';

        if ($iconName = $this->icon) {
            $html .= '<i class="'.$iconName.'"></i> ';
        }

        if (!$this->circleIcon) {
            $html .= $this->labelHtml ? $this->label : e(__($this->label));
        }

        return $html;
    }

    /**
     * buildAttributes
     */
    protected function buildAttributes(array $attr = []): array
    {
        $attr['type'] = $this->type === 'primary' ? 'submit' : 'button';

        if ($this->hotkey) {
            $attr['data-hotkey'] = implode(',', (array) $this->hotkey);
        }

        if ($this->redirectBack) {
            $attr['data-browser-redirect-back'] = true;
        }

        if ($this->loadingPopup) {
            $attr['data-popup-load-indicator'] = true;
        }

        if ($this->listCheckedTrigger) {
            $attr['data-list-checked-trigger'] = true;
            $attr['disabled'] = true;
        }

        if ($this->circleIcon) {
            $attr['title'] = $this->labelHtml ? $this->label : __($this->label);
        }

        if ($this->dismissPopup) {
            $attr['data-dismiss'] = 'popup';
        }

        $attr['class'] = $this->buildCssClass();

        if (is_array($customAttrs = $this->attributes)) {
            $attr = array_merge($customAttrs, $attr);
        }

        return $attr;
    }

    /**
     * buildCssClass
     */
    protected function buildCssClass(): string
    {
        if ($this->replaceCssClass !== null) {
            return $this->replaceCssClass;
        }

        $css = [];

        $css[] = 'btn';

        if ($this->outline) {
            $css[] = 'btn-outline-'.$this->type;
        }
        else {
            $css[] = 'btn-'.$this->type;
        }

        if ($this->circleIcon) {
            $css[] = 'btn-circle';
        }

        if ($this->internalCssClass) {
            $css[] = $this->internalCssClass;
        }

        $css[] = $this->cssClass;

        return implode(' ', $css);
    }

    /**
     * hotkey sets a hotkey pattern
     */
    public function hotkey(...$hotkeys): static
    {
        $this->config['hotkey'] = $hotkeys;
        return $this;
    }

    /**
     * linkTo
     */
    public function linkTo(string $linkUrl, bool $isRaw = false): static
    {
        $this->linkUrl = $isRaw ? $linkUrl : Backend::url($linkUrl);

        return $this;
    }

    /**
     * circleIcon shows a circle button with an icon inside
     */
    public function circleIcon(string $circleIcon): static
    {
        $this->config['circleIcon'] = true;

        $this->icon($circleIcon);

        return $this;
    }

    /**
     * primary
     */
    public function primary(): static
    {
        $this->type('primary');
        return $this;
    }

    /**
     * secondary
     */
    public function secondary(): static
    {
        $this->type('secondary');
        return $this;
    }

    /**
     * success
     */
    public function success(): static
    {
        $this->type('success');
        return $this;
    }

    /**
     * danger
     */
    public function danger(): static
    {
        $this->type('danger');
        return $this;
    }

    /**
     * warning
     */
    public function warning(): static
    {
        $this->type('warning');
        return $this;
    }

    /**
     * info
     */
    public function info(): static
    {
        $this->type('info');
        return $this;
    }

    /**
     * textLink displays a button just like a text link with no padding
     */
    public function textLink(): static
    {
        if ($this->linkUrl === null) {
            $this->linkUrl('javascript:;');
        }

        $this->type('link');
        $this->internalCssClass('p-0');
        return $this;
    }
}
