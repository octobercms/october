import { VueControlBase } from '../../../../assets/js/vueapp/vue-control-base.js';

/**
 * elementFromButton converts a rendered Ui::ajaxButton / Ui::button HTML element
 * into a toolbar element config consumed by backend-document-toolbar.
 *
 * Read attributes that the Ui components emit:
 *   data-request            → command: 'form:' + value
 *   href                    → href (for plain link buttons)
 *   data-hotkey             → hotkey
 *   data-tooltip-hotkey     → tooltipHotkey (already humanized server-side)
 *   data-request-confirm    → customData.confirm
 *   data-request-data       → customData.request.data (parsed string)
 *   data-browser-redirect-back → customData.request.browserRedirectBack
 *   class contains 'pull-right' → fixedRight: true
 *   child <i class="icon-*"> → icon
 */
function elementFromButton($button) {
    const element = { type: 'button' };

    const label = $button.text().trim();
    if (label) {
        element.label = label;
        element.tooltip = label;
    }

    const $icon = $button.find('i').first();
    if ($icon.length) {
        element.icon = $icon.attr('class');
    }

    const handler = $button.attr('data-request');
    if (handler) {
        element.command = 'form:' + handler;
    }

    const href = $button.attr('href');
    if (href && href !== 'javascript:;') {
        element.href = href;
        const target = $button.attr('target');
        if (target) {
            element.target = target;
        }
    }

    const hotkey = $button.attr('data-hotkey');
    if (hotkey) {
        element.hotkey = hotkey;
    }

    const tooltipHotkey = $button.attr('data-tooltip-hotkey');
    if (tooltipHotkey) {
        element.tooltipHotkey = tooltipHotkey;
    }

    if ($button.hasClass('pull-right')) {
        element.fixedRight = true;
    }

    const customData = {};
    const requestConfig = {};

    const requestData = $button.attr('data-request-data');
    if (requestData) {
        const parsed = parseRequestDataString(requestData);
        if (parsed) {
            requestConfig.data = parsed;
        }
    }

    if ($button.attr('data-browser-redirect-back') !== undefined) {
        requestConfig.browserRedirectBack = true;
    }

    if (Object.keys(requestConfig).length) {
        customData.request = requestConfig;
    }

    const confirm = $button.attr('data-request-confirm');
    if (confirm) {
        customData.confirm = confirm;
    }

    if (Object.keys(customData).length) {
        element.customData = customData;
    }

    return element;
}

/**
 * elementFromDropdown converts an Ui::dropdownButton wrapper into a
 * toolbar dropdown element. The wrapper is a `.dropdown` div containing
 * the trigger button and a `<ul class="dropdown-menu">` of `<li><a>` items.
 *
 * Read attributes that the Ui::dropdownItem components emit:
 *   data-request  → menuitem command: 'form:' + value
 *   href          → menuitem href (for plain link items)
 *   child <i>     → menuitem icon
 */
function elementFromDropdown($wrapper, $triggerButton) {
    const element = {
        type: 'dropdown',
        menuitems: []
    };

    const label = $triggerButton.clone().children('i').remove().end().text().trim();
    if (label) {
        element.label = label;
        element.tooltip = label;
    }

    const $triggerIcon = $triggerButton.find('i').first();
    if ($triggerIcon.length) {
        element.icon = $triggerIcon.attr('class');
    }

    $wrapper.find('.dropdown-menu li a').each(function () {
        const $item = $(this);

        const itemHandler = $item.attr('data-request');
        const itemHref = $item.attr('href');
        if (!itemHandler && (!itemHref || itemHref === 'javascript:;')) {
            return;
        }

        const itemElement = {};
        const itemLabel = $item.clone().children('i').remove().end().text().trim();
        if (itemLabel) {
            itemElement.label = itemLabel;
        }

        const $itemIcon = $item.find('i').first();
        if ($itemIcon.length) {
            itemElement.icon = $itemIcon.attr('class');
        }

        if (itemHandler) {
            itemElement.command = 'form:' + itemHandler;
        }

        if (itemHref && itemHref !== 'javascript:;') {
            itemElement.href = itemHref;
            const target = $item.attr('target');
            if (target) {
                itemElement.target = target;
            }
        }

        element.menuitems.push(itemElement);
    });

    return element.menuitems.length ? element : null;
}

/**
 * parseRequestDataString parses the framework's "key: value, key: value" syntax
 * (as emitted by Ui::ajaxButton's dataRequestData) into a plain object.
 * Falls back to JSON parse if the string looks like JSON.
 */
function parseRequestDataString(str) {
    str = str.trim();
    if (!str) {
        return null;
    }

    if (str.charAt(0) === '{') {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return null;
        }
    }

    const result = {};
    str.split(',').forEach((pair) => {
        const colonIdx = pair.indexOf(':');
        if (colonIdx === -1) {
            return;
        }
        const key = pair.substring(0, colonIdx).trim();
        let value = pair.substring(colonIdx + 1).trim();

        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value === 'null') value = null;
        else if (/^-?\d+$/.test(value)) value = parseInt(value, 10);
        else if (/^-?\d*\.\d+$/.test(value)) value = parseFloat(value);
        else if ((value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
                 (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'")) {
            value = value.substring(1, value.length - 1);
        }

        result[key] = value;
    });

    return result;
}

class VueDocumentForm extends VueControlBase {
    init() {
        this.registerState({
            toolbarDisabled: false,
            toolbarExtensionPoint: [],
            toolbarElements: []
        });

        this.registerMethod('onCommand', this.onCommand);
    }

    connect() {
        this.formElement = this.element.closest('form');
        this.initToolbar();
        this.initListeners();

        // Defer until Vue container is mounted
        oc.pageReady().then(() => {
            setTimeout(() => this.initSecondaryTabs(), 0);
        });
    }

    disconnect() {
        this.destroyListeners();
        this.destroySecondaryTabs();
        this.formElement = null;
    }

    initListeners() {
        $(window).on('oc.updateUi', this.proxy(this.refreshToolbars));
        $(window).one('shown.bs.tab', this.proxy(this.refreshToolbars));
        setTimeout(() => this.refreshToolbars(), 0);

        this.state.eventBus.on('documentloadingstart', () => {
            this.state.processing = true;
        });

        this.state.eventBus.on('documentloadingend', () => {
            this.state.processing = false;
        });
    }

    destroyListeners() {
        $(window).off('oc.updateUi', this.proxy(this.refreshToolbars));
        $(window).off('shown.bs.tab', this.proxy(this.refreshToolbars));
    }

    initSecondaryTabs() {
        const layout = this.element.closest('.form-document-layout');
        if (!layout) {
            return;
        }

        this.secondaryToggle = layout.querySelector('[data-document-secondary-toggle]');
        this.secondaryTabs = this.element.querySelector('[data-document-secondary-tabs]');

        if (this.secondaryToggle && this.secondaryTabs) {
            this.secondaryToggle.addEventListener('click', this.proxy(this.onSecondaryToggleClick));

            // Relocate secondary tabs into the popover content
            const vm = this.containers.vueDocumentForm;
            if (vm && vm.$refs.secondaryContent) {
                vm.$refs.secondaryContent.appendChild(this.secondaryTabs);
                this.secondaryTabs.style.display = '';
            }
        }
    }

    destroySecondaryTabs() {
        if (this.secondaryToggle) {
            this.secondaryToggle.removeEventListener('click', this.proxy(this.onSecondaryToggleClick));
        }
        this.secondaryToggle = null;
        this.secondaryTabs = null;
    }

    onSecondaryToggleClick(ev) {
        this.containers.vueDocumentForm.$refs.secondaryPopover.show(ev.currentTarget);
    }

    refreshToolbars() {
        this.state.toolbarExtensionPoint.splice(0);
        this.state.eventBus.emit('extendapptoolbar');
    }

    initToolbar() {
        this.state.toolbarElements = this.buildToolbarFromButtons();
        this.state.toolbarElements.push(this.state.toolbarExtensionPoint);
    }

    buildToolbarFromButtons() {
        const elements = [];
        const $container = $(this.element).closest('.form-document-layout').find('[data-document-form-buttons]');

        if (!$container.length) {
            return elements;
        }

        // Walk descendants so wrapper <div>s emitted by partials don't hide
        // sibling buttons. Order is document order, so toolbar layout follows
        // the partial's source order regardless of nesting.
        const $nodes = $container.find('button, a, .toolbar-divider, .button-separator');

        $nodes.each(function () {
            const $node = $(this);

            // Skip nodes nested inside a dropdown menu — handled below when
            // the dropdown trigger button is processed.
            if ($node.closest('.dropdown-menu').length) {
                return;
            }

            if ($node.is('.toolbar-divider, .button-separator')) {
                if (elements.length && elements[elements.length - 1].type !== 'separator') {
                    elements.push({ type: 'separator' });
                }
                return;
            }

            // Detect an Ui::dropdownButton trigger and assemble its menuitems.
            const $dropdownWrapper = $node.closest('.dropdown');
            if ($dropdownWrapper.length && $node.attr('data-toggle') === 'dropdown') {
                const dropdownElement = elementFromDropdown($dropdownWrapper, $node);
                if (dropdownElement) {
                    if ($node.hasClass('pull-right')) {
                        dropdownElement.fixedRight = true;
                    }
                    elements.push(dropdownElement);
                }
                return;
            }

            // Cancel-style buttons have no handler and no href (or href="javascript:;") — skip.
            const handler = $node.attr('data-request');
            const href = $node.attr('href');
            if (!handler && (!href || href === 'javascript:;')) {
                return;
            }

            const element = elementFromButton($node);
            if (element) {
                elements.push(element);
            }
        });

        return elements;
    }

    handleFormSaved(data) {
        if (this.formElement) {
            $(this.formElement).trigger('unchange.oc.changeMonitor');
        }
    }

    async onCommand(command, isHotkey, ev, targetElement, customData, throwOnError) {
        if (!this.app.isFormCommand(command)) {
            return;
        }

        this.state.toolbarDisabled = true;
        if (this.formElement) {
            $(this.formElement).trigger('pauseUnloadListener');
        }

        try {
            let data = await this.app.onCommand(command, isHotkey, ev, targetElement, customData);
            this.state.toolbarDisabled = false;

            if (command === 'form:onSave') {
                this.handleFormSaved(data);
            }

            if (this.formElement) {
                $(this.formElement).trigger('resumeUnloadListener');
            }
        }
        catch (error) {
            if (this.formElement) {
                $(this.formElement).trigger('resumeUnloadListener');
            }
            this.state.toolbarDisabled = false;
            if (throwOnError) {
                throw error;
            }
        }
    }
}

oc.registerControl('vue-document-form', VueDocumentForm);

export { VueDocumentForm };
export default VueDocumentForm;
