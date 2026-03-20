/*
 * Repeater Form Widget plugin (Accordion mode)
 *
 * Data attributes:
 * - data-control="repeateraccordion" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 */
import { registerControl } from 'larajax';
import { RepeaterFormWidgetBase } from './repeater.js';

class RepeaterFormWidgetAccordion extends RepeaterFormWidgetBase {
    init() {
        // Overrides
        this.selectorToolbar = '> .field-repeater-toolbar:first';
        this.selectorHeader = '> .field-repeater-items > .field-repeater-item > .repeater-header';
        this.selectorSortable = '> .field-repeater-items';
        this.selectorChecked = '> .field-repeater-items > .field-repeater-item > .repeater-header input[type=checkbox]:checked';
        super.init();
    }

    connect() {
        // Items
        var headSelect = this.selectorHeader;
        this.$el = $(this.element);
        this.$el.on('click', headSelect, this.proxy(this.clickItemHeader));
        this.$el.on('click', headSelect + ' [data-repeater-expand]', this.proxy(this.toggleCollapse));
        this.$el.on('click', headSelect + ' [data-repeater-collapse]', this.proxy(this.toggleCollapse));

        // Next tick to let other controls initialize
        setTimeout(() => {
            this.applyExpandedItems();
        }, 0);

        super.connect();
    }

    disconnect() {
        // Items
        var headSelect = this.selectorHeader;
        this.$el.off('click', headSelect, this.proxy(this.clickItemHeader));
        this.$el.off('click', headSelect + ' [data-repeater-expand]', this.proxy(this.toggleCollapse));
        this.$el.off('click', headSelect + ' [data-repeater-collapse]', this.proxy(this.toggleCollapse));

        super.disconnect();
    }

    clickItemHeader(ev) {
        var $target = $(ev.target);
        if (
            !$target.hasClass('repeater-header') &&
            !$target.hasClass('repeater-item-title') &&
            !$target.hasClass('repeater-item-checkbox')
        ) {
            return;
        }

        var $item = $target.closest('.field-repeater-item'),
            isCollapsed = $item.hasClass('collapsed');

        if (!this.config.itemsExpanded) {
            this.collapseAll();
        }

        isCollapsed ? this.expand($item) : this.collapse($item);
    }

    applyExpandedItems() {
        if (this.config.itemsExpanded) {
            return;
        }

        var items = $(this.$el).children('.field-repeater-items').children('.field-repeater-item'),
            self = this;

        $.each(items, function(key, item) {
            self.collapse($(item));
        });
    }

    toggleCollapse(ev) {
        var self = this,
            $item = $(ev.target).closest('.field-repeater-item'),
            isCollapsed = $item.hasClass('collapsed');

        ev.preventDefault();

        var $items = this.getCheckedItemsOrItem($item);
        $.each($items, function(k, item) {
            isCollapsed ? self.expand($(item)) : self.collapse($(item));
        });
    }

    collapseAll() {
        var self = this,
            $items = $('> .field-repeater-item', this.$itemContainer);

        $.each($items, function(key, item){
            self.collapse($(item));
        });
    }

    expandAll() {
        var self = this,
            $items = $('> .field-repeater-item', this.$itemContainer);

        $.each($items, function(key, item){
            self.expand($(item));
        });
    }

    collapse($item) {
        $item.addClass('collapsed');

        $('> .repeater-header > .repeater-item-title', $item).text(this.getCollapseTitle($item));
    }

    expand($item) {
        $item.removeClass('collapsed');

        $(window).trigger('oc.updateUi');
    }

    //
    // Event Overrides
    //

    eventOnAddItem() {
        if (!this.config.itemsExpanded) {
            this.collapseAll();
        }
    }

    eventOnDuplicateItem($fromItem) {
        this.eventOnAddItem();
    }

    eventMenuFilter($item, $list) {
        // Hide/show duplicate button
        $('[data-repeater-duplicate]', $list).closest('li').toggleClass('disabled', !this.canAdd);

        // Hide/show remove button
        $('[data-repeater-remove]', $list).closest('li').toggleClass('disabled', !this.canRemove);

        // Hide/show up/down
        $('[data-repeater-move-up]', $list).closest('li').toggle(!!$item.prev().length);
        $('[data-repeater-move-down]', $list).closest('li').toggle(!!$item.next().length);

        // Hide/show expand/collapse
        $('[data-repeater-expand]', $list).closest('li').toggle($item.hasClass('collapsed'));
        $('[data-repeater-collapse]', $list).closest('li').toggle(!$item.hasClass('collapsed'));
    }
}

registerControl('repeateraccordion', RepeaterFormWidgetAccordion);
