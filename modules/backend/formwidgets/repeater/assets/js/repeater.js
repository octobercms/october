/*
 * Repeater Form Widget base class
 */
import { ControlBase } from 'larajax';

export class RepeaterFormWidgetBase extends ControlBase {
    init() {
        this.itemCount = 0;
        this.canAdd = true;
        this.canRemove = true;
        this.toolbarBusy = false;
        this.repeaterId = $.oc.domIdManager.generate('repeater');
        this.initDefaults();
    }

    initDefaults() {
        const defaults = {
            useReorder: true,
            sortableHandle: '.repeater-item-handle',
            removeHandler: 'onRemoveItem',
            useDuplicate: true,
            duplicateHandler: 'onDuplicateItem',
            removeConfirm: 'Are you sure?',
            itemsExpanded: true,
            titleFrom: null,
            minItems: null,
            maxItems: null
        };

        for (const key in defaults) {
            if (this.config[key] === undefined) {
                this.config[key] = defaults[key];
            }
        }
    }

    connect() {
        if (this.config.useReorder) {
            this.bindSorting();
        }

        // Init elements
        this.$el = $(this.element);
        this.$itemContainer = $('> .field-repeater-items', this.$el);

        // Items
        var headSelect = this.selectorHeader;
        this.$el.on('change', headSelect + ' input[type=checkbox]', this.proxy(this.clickItemCheckbox));
        this.$el.on('click', headSelect + ' [data-repeater-move-up]', this.proxy(this.clickMoveItemUp));
        this.$el.on('click', headSelect + ' [data-repeater-move-down]', this.proxy(this.clickMoveItemDown));
        this.$el.on('click', headSelect + ' [data-repeater-remove]', this.proxy(this.clickRemoveItem));
        this.$el.on('click', headSelect + ' [data-repeater-duplicate]', this.proxy(this.clickDuplicateItem));
        this.$el.on('show.bs.dropdown', headSelect + ' .repeater-item-dropdown', this.proxy(this.showItemMenu));

        // Toolbar
        this.$toolbar = $(this.selectorToolbar, this.$el);
        this.$toolbar.on('click', '> [data-repeater-cmd=add-group]', this.proxy(this.clickAddGroupButton));
        this.$toolbar.on('click', '> [data-repeater-cmd=add]', this.proxy(this.onAddItemButton));
        this.$toolbar.on('ajaxDone', '> [data-repeater-cmd=add]', this.proxy(this.onAddItemSuccess));

        this.countItems();
        this.togglePrompt();

        // External toolbar
        setTimeout(() => {
            this.initToolbarExtensionPoint();
            this.mountExternalToolbarEventBusEvents();
            this.extendExternalToolbar();
        }, 0);
    }

    disconnect() {
        if (this.config.useReorder) {
            this.sortable.destroy();
        }

        // Items
        var headSelect = this.selectorHeader;
        this.$el.off('change', headSelect + ' input[type=checkbox]', this.proxy(this.clickItemCheckbox));
        this.$el.off('click', headSelect + ' [data-repeater-move-up]', this.proxy(this.clickMoveItemUp));
        this.$el.off('click', headSelect + ' [data-repeater-move-down]', this.proxy(this.clickMoveItemDown));
        this.$el.off('click', headSelect + ' [data-repeater-remove]', this.proxy(this.clickRemoveItem));
        this.$el.off('click', headSelect + ' [data-repeater-duplicate]', this.proxy(this.clickDuplicateItem));
        this.$el.off('show.bs.dropdown', headSelect + ' .repeater-item-dropdown', this.proxy(this.showItemMenu));

        // Toolbar
        this.$toolbar.off('click', '> [data-repeater-cmd=add-group]', this.proxy(this.clickAddGroupButton));
        this.$toolbar.off('click', '> [data-repeater-cmd=add]', this.proxy(this.onAddItemButton));
        this.$toolbar.off('ajaxDone', '> [data-repeater-cmd=add]', this.proxy(this.onAddItemSuccess));

        this.$el.removeData('oc.repeater');
        this.unmountExternalToolbarEventBusEvents();

        this.$el = null;
        this.$toolbar = null;
        this.$sortableBody = null;
        this.sortable = null;
    }

    bindSorting() {
        this.$sortableBody = $(this.selectorSortable, this.$el);

        this.sortable = Sortable.create(this.$sortableBody.get(0), {
            // forceFallback: true,
            animation: 150,
            multiDrag: true,
            avoidImplicitDeselect: true,
            handle: this.config.sortableHandle,
            onEnd: this.proxy(this.onSortableEnd),

            // Auto scroll plugin
            forceAutoScrollFallback: true,
            scrollSensitivity: 60,
            scrollSpeed: 20
        });
    }

    onSortableEnd(ev) {
        this.eventSortableOnEnd();
    }

    clickItemCheckbox(ev) {
        var $target = $(ev.target),
            $item = $target.closest('li'),
            checked = $target.is(':checked');

        $item.toggleClass('is-checked', checked);

        if (checked) {
            Sortable.utils.select($item.get(0));
        }
        else {
            Sortable.utils.deselect($item.get(0));
        }
    }

    showItemMenu(ev) {
        var templateHtml = $('> [data-item-menu-template]', this.$el).html(),
            $target = $(ev.target),
            $item = $target.closest('li'),
            $dropdownList = $('.dropdown-menu:first', $target.closest('.dropdown'));

        $dropdownList.html(templateHtml);

        this.eventMenuFilter($item, $dropdownList);

        if (this.toolbarBusy) {
            $('li', $dropdownList).addClass('disabled');
        }
    }

    clickRemoveItem(ev) {
        // Button is disabled
        if ($(ev.target).closest('li').hasClass('disabled')) {
            return;
        }

        this.onRemoveItem(this.findItemFromTarget(ev.target));
    }

    onRemoveItem($item) {
        var self = this,
            $items = this.getCheckedItemsOrItem($item);

        var itemData = [];
        $.each($items, function(k, item) {
            itemData.push({
                repeater_index: $(item).data('repeater-index'),
                repeater_group: $(item).data('repeater-group')
            })
        });

        $item.request(this.config.removeHandler, {
            data: {
                _repeater_items: itemData
            },
            confirm: this.config.removeConfirm,
            afterUpdate: function() {
                self.onRemoveItemSuccess($items);
            }
        });
    }

    onRemoveItemSuccess($items) {
        var self = this;

        $.each($items, function(k, item) {
            var $item = $(item);
            self.disposeItem($item);
            $item.remove();

            self.eventOnRemoveItem($item);

            self.countItems();
            self.triggerChange();
        });
    }

    clickDuplicateItem(ev) {
        // Button is disabled
        if ($(ev.target).closest('li').hasClass('disabled')) {
            return;
        }

        this.toolbarBusy = true;

        var $item = this.findItemFromTarget(ev.target);
        this.eventOnDuplicateItem($item);
        this.onDuplicateItem($item);
    }

    onDuplicateItem($item) {
        var self = this;

        var itemData = {
            _repeater_index: $item.data('repeater-index'),
            _repeater_group: $item.data('repeater-group')
        };

        $item.request(this.config.duplicateHandler, {
            data: itemData,
            afterUpdate: function(data) {
                self.toolbarBusy = false;
                if (data.result) {
                    self.onDuplicateItemSuccess($item, data.result.duplicateIndex);
                }
                else {
                    self.eventOnErrorAddItem();
                }
            }
        });
    }

    onDuplicateItemSuccess($item, duplicateIndex) {
        var itemIndex = $item.data('repeater-index'),
            $duplicateItem = $('> li[data-repeater-index='+duplicateIndex+']', this.$itemContainer);

        this.findItemFromIndex(itemIndex).after($duplicateItem);

        this.countItems();
        this.triggerChange();
        this.eventDuplicateOnEnd();
    }

    clickMoveItemUp(ev) {
        var $item = this.findItemFromTarget(ev.target),
            $prevItem = $item.prev();

        $prevItem.before($item);

        this.onSortableEnd();
    }

    clickMoveItemDown(ev) {
        var $item = this.findItemFromTarget(ev.target),
            $nextItem = $item.next();

        $nextItem.after($item);

        this.onSortableEnd();
    }

    onAddItemButton(ev) {
        this.eventOnAddItem();
    }

    clickAddGroupButton(ev) {
        var self = this,
            templateHtml = $('> [data-group-palette-template]', this.$el).html(),
            $target = $(ev.target),
            $form = this.$el.closest('form');

        // Prevent adding new items until last one is finished
        if ($target.hasClass('oc-loading')) {
            return;
        }

        $target.ocPopover({
            content: templateHtml
        });

        var $container = $target.data('oc.popover').$container;

        // Initialize the scrollpad control in the popup
        oc.Events.dispatch('render');

        $container
            .on('click', 'a', function (ev) {
                // Defer 2 ticks for framework which is deferred 1 tick
                setTimeout(function() {
                    $(ev.target).trigger('close.oc.popover');
                }, 2);
            })
            .on('ajaxSetup', '[data-repeater-add]', function(ev, context) {
                context.options.form = $form.get(0);

                $target.addClass('oc-loading');

                $form.one('ajaxComplete', function() {
                    $target.removeClass('oc-loading');
                    self.itemCount++;
                    self.triggerChange();
                });

                // Event
                self.eventOnAddItem();
            });
    }

    onAddItemSuccess(ev) {
        this.itemCount++;
        this.triggerChange();
    }

    triggerChange() {
        this.togglePrompt();

        // Trigger change event for compatibility with october.form.js
        this.$el.closest('[data-field-name]').trigger('change.oc.formwidget');

        // Event
        this.eventOnChange();
    }

    togglePrompt() {
        if (this.config.minItems && this.config.minItems > 0) {
            this.canRemove = this.itemCount > this.config.minItems;
        }

        if (this.config.maxItems && this.config.maxItems > 0) {
            this.canAdd = this.itemCount < this.config.maxItems;
        }

        this.$toolbar.toggle(this.canAdd);

        $('> [data-repeater-pointer-input]:first', this.$el).attr('disabled', !!this.itemCount);
    }

    getCollapseTitle($item) {
        var $target = $item,
            titleFromAttr = this.getTitleFromAttribute($item),
            defaultText = this.$el.data('default-title'),
            explicitText = $item.data('item-title'),
            foundTitleFrom = false;

        // Group mode supplies explicit text
        if (explicitText && !titleFromAttr) {
            return explicitText;
        }

        // A specific title from attribute was provided
        if (titleFromAttr) {
            var $titleFrom = $('[data-field-name="' + titleFromAttr + '"]', $item);
            if ($titleFrom.length) {
                $target = $titleFrom;
                foundTitleFrom = true;
            }
        }

        // The title from attribute was not found
        if (explicitText && !foundTitleFrom) {
            return explicitText;
        }

        // Find anything within the target
        var result = '',
            $textInput = $('input[type=text]:first, select:first, textarea:first', $target).first();

        if ($textInput.length) {
            if ($textInput.is('select')) {
                result = $textInput.find('option:selected').text();
            } else if ($textInput.is('textarea')) {
                result = $('<div />').html($textInput.val()).text().substring(0, 255);
            } else {
                result = $textInput.val();
            }
        } else {
            // Look for a span with class 'form-control'
            var $spanTextInput = $('.form-control:first', $target);
            if ($spanTextInput.length) {
                result = $spanTextInput.text();
            } else {
                var $disabledTextInput = $('.text-field:first > .form-control', $target);
                if ($disabledTextInput.length) {
                    result = $disabledTextInput.text();
                }
            }
        }

        return result ? result : defaultText;
    }

    getTitleFromAttribute($item) {
        if (this.config.titleFrom) {
            return this.config.titleFrom;
        }

        var itemTitleFrom = $item.data('title-from');
        if (itemTitleFrom) {
            return itemTitleFrom;
        }

        return null;
    }

    findItemFromIndex(itemIndex) {
        return $('> li[data-repeater-index='+itemIndex+']:first', this.$itemContainer);
    }

    findItemFromTarget(target) {
        return $(target).closest('.repeater-header').closest('li');
    }

    disposeItem($item) {
        $('[data-disposable]', $item).each(function() {
            var $el = $(this),
                control = $el.data('control'),
                widget = $el.data('oc.' + control);

            if (widget && typeof widget['dispose'] === 'function') {
                widget.dispose();
            }
        });
    }

    getCheckedItemsOrItem($item) {
        var $items = this.getCheckedItems();

        if (!$items.length) {
            $items = [$item];
        }

        return $items;
    }

    getCheckedItems() {
        var $checkboxes = $(this.selectorChecked, this.$el),
            result = [];

        $.each($checkboxes, function(k, $checkbox) {
            result.push($checkbox.closest('li'));
        });

        return result;
    }

    countItems() {
        this.itemCount = $('> .field-repeater-item', this.$itemContainer).length;
        this.$el.toggleClass('repeater-empty', this.itemCount === 0);
    }

    //
    // External toolbar
    //

    initToolbarExtensionPoint() {
        if (!this.config.externalToolbarAppState) {
            return;
        }

        const point = $.oc.vueUtils.getToolbarExtensionPoint(
            this.config.externalToolbarAppState,
            this.$el.get(0)
        );

        if (point) {
            this.toolbarExtensionPoint = point.state;
            this.externalToolbarEventBusObj = point.bus;
        }
    }

    mountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.on('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.on('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    unmountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.off('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.off('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    onToolbarExternalCommand(ev) {
        var cmdPrefix = 'repeater-toolbar-';

        if (ev.command.substring(0, cmdPrefix.length) != cmdPrefix) {
            return;
        }

        if (/^repeater-toolbar-add,/.test(ev.command)) {
            return this.onAddItemClick(ev.command);
        }

        var cmd = ev.command.substring(cmdPrefix.length),
            $toolbar = this.$el.find('> .field-repeater-builder > .field-repeater-toolbar, > .field-repeater-toolbar'),
            $button = $toolbar.find('[data-repeater-cmd='+cmd+']');

        $button.get(0).click(ev.ev);
    }

    onAddItemClick(cmd) {
        var parts = cmd.split(',');

        if (parts[1] != this.repeaterId) {
            return;
        }

        var requestData = oc.parseJSON('{' + parts[3] + '}'),
            that = this;

        this.externalToolbarEventBusObj.emit('documentloadingstart');
        this.$el.request(
            parts[2],
            {
                data: requestData
            }
        ).always(function () {
            that.externalToolbarEventBusObj.emit('documentloadingend');
            that.countItems();
        });
    }

    buildAddMenuItems() {
        if (this.addMenuItems) {
            return this.addMenuItems;
        }

        var templateHtml = $('> [data-group-palette-template]', this.$el).html(),
            templateContainer = $(templateHtml),
            that = this;

        this.addMenuItems = [];

        templateContainer.find('ul > li > a').each(function () {
            var $link = $(this),
                $icon = $link.find('i.list-icon');

            that.addMenuItems.push({
                type: 'text',
                label: $link.find('.title').text(),
                icon: $icon.attr('class'),
                command: 'repeater-toolbar-add,' + that.repeaterId + ',' + $link.data('request') + ',' + $link.data('requestData')
            });
        });

        return this.addMenuItems;
    }

    extendExternalToolbar() {
        if (!this.$el || !this.$el.is(":visible") || !this.toolbarExtensionPoint) {
            return;
        }

        this.toolbarExtensionPoint.splice(0, this.toolbarExtensionPoint.length);

        this.toolbarExtensionPoint.push({
            type: 'separator'
        });

        var that = this,
            $buttons = this.$el.find('> .field-repeater-builder > .field-repeater-toolbar > button, > .field-repeater-toolbar > button');

        $buttons.each(function () {
            var $button = $(this),
                $icon = $button.find('i[class*=icon]'),
                menuitems = [],
                isAddButton = $button.data('repeaterCmd') == 'add-group';

            if (isAddButton) {
                menuitems = that.buildAddMenuItems();
            }
            else {
                menuitems = false;
            }

            that.toolbarExtensionPoint.push(
                {
                    type: isAddButton ? 'dropdown' : 'button',
                    icon: $icon.attr('class'),
                    label: $button.text(),
                    command: 'repeater-toolbar-' + $button.attr('data-repeater-cmd'),
                    disabled: $button.attr('disabled') !== undefined,
                    menuitems: menuitems
                }
            );
        });
    }

    //
    // Event Overrides
    //

    eventSortableOnEnd() {
    }

    eventOnChange() {
    }

    eventOnAddItem() {
    }

    eventOnRemoveItem() {
    }

    eventOnErrorAddItem() {
    }

    eventOnDuplicateItem($fromItem) {
    }

    eventDuplicateOnEnd() {
    }

    eventMenuFilter() {
    }
}

export default RepeaterFormWidgetBase;
