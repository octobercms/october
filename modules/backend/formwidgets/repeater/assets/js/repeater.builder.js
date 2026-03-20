/*
 * Repeater Form Widget plugin (Builder mode)
 *
 * Data attributes:
 * - data-control="repeaterbuilder" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * RepeaterFormWidgetBuilder.getOrCreateInstance(el);
 */
import { registerControl } from 'larajax';
import { RepeaterFormWidgetBase } from './repeater.js';

class RepeaterFormWidgetBuilder extends RepeaterFormWidgetBase {
    init() {
        // Overrides
        this.selectorToolbar = '> .field-repeater-builder > .field-repeater-toolbar:first';
        this.selectorHeader = '> .field-repeater-builder > .field-repeater-groups > .field-repeater-group > .repeater-header';
        this.selectorSortable = '> .field-repeater-builder > .field-repeater-groups';
        this.selectorChecked = '> .field-repeater-builder > .field-repeater-groups > .field-repeater-group > .repeater-header input[type=checkbox]:checked';

        super.init();
    }

    connect() {
        // Locals
        this.$el = $(this.element);
        this.$itemContainer = $('> .field-repeater-items', this.$el);
        this.$sidebar = $('> .field-repeater-builder > .field-repeater-groups:first', this.$el);
        this.$sidebar.on('click', '> li:not(.is-placeholder)', this.proxy(this.clickBuilderItem));

        // Core logic
        $(document).on('render', this.proxy(this.builderOnRender));
        this.transferBuilderItemHeaders();

        this.selectBuilderItem();
        super.connect();
    }

    disconnect() {
        // Locals
        this.$sidebar.off('click', '> li:not(.is-placeholder)', this.proxy(this.clickBuilderItem));

        // Core logic
        $(document).off('render', this.proxy(this.builderOnRender));

        this.$sidebar = null;

        super.disconnect();
    }

    builderOnRender() {
        this.transferBuilderItemHeaders();
    }

    clickBuilderItem(ev) {
        var $item = $(ev.target).closest('.field-repeater-group'),
            inControlArea = $(ev.target).closest('.group-controls').length;

        if (inControlArea) {
            return;
        }

        this.selectBuilderItem($item.data('repeater-index'));

        $(window).trigger('oc.updateUi');
    }

    selectBuilderItem(itemIndex) {
        if (itemIndex === undefined) {
            itemIndex = $('> li:first', this.$sidebar).data('repeater-index');
        }

        $('> li.is-selected', this.$sidebar).removeClass('is-selected');
        $('> li[data-repeater-index='+itemIndex+']', this.$sidebar).addClass('is-selected');

        $('> li.is-selected', this.$itemContainer).removeClass('is-selected');
        $('> li[data-repeater-index='+itemIndex+']', this.$itemContainer).addClass('is-selected');

        this.setCollapsedTitles();
    }

    setCollapsedTitles() {
        var self = this;

        $('> .field-repeater-item', this.$itemContainer).each(function() {
            var $item = $(this),
                itemIndex = $item.data('repeater-index'),
                $groupItem = $('> li[data-repeater-index='+itemIndex+']', self.$sidebar);

            $('[data-group-title]:first', $groupItem).html(self.getCollapseTitle($item));
        });
    }

    transferBuilderItemHeaders() {
        var self = this,
            templateHtml = $('> [data-group-template]', this.$el).html();

        $('> .field-repeater-item > .repeater-header', this.$itemContainer).each(function() {
            var $groupItem = $(templateHtml),
                $item = $(this).closest('li');

            self.$sidebar.append($groupItem);
            $('[data-group-controls]:first', $groupItem).replaceWith($(this).addClass('group-controls'));
            $('[data-group-image]:first > i', $groupItem).addClass($item.data('item-icon'));
            $('[data-group-title]:first', $groupItem).html($item.data('item-title'));
            $('[data-group-description]:first', $groupItem).html($item.data('item-description'));

            $groupItem.attr('data-repeater-index', $item.data('repeater-index'));
            $groupItem.attr('data-repeater-group', $item.data('repeater-group'));

            // Remove last loader if there is one
            $('li.is-placeholder:first', self.$sidebar).remove();

            // Select this item
            self.selectBuilderItem($item.data('repeater-index'));
        });
    }

    sortItemsToSidebar() {
        $('> li', this.$sidebar).each((index, sbItem) => {
            var itemIndex = $(sbItem).data('repeater-index'),
                $item = this.findItemFromIndex(itemIndex);

            this.$itemContainer.append($item);
        });
    }

    sortSidebarToItems() {
        $('> .field-repeater-item', this.$itemContainer).each((index, rItem) => {
            var $item = $(rItem).closest('li'),
                itemIndex = $item.attr('data-repeater-index'),
                $sidebarItem = $('> li[data-repeater-index='+itemIndex+']:first', this.$sidebar);

            this.$sidebar.append($sidebarItem);
        });
    }

    appendLoadingItem($afterItem) {
        var templateHtml = $('> [data-group-loading-template]', this.$el).html(),
            $loadingItem = $(templateHtml);

        if ($afterItem) {
            $afterItem.after($loadingItem);
        }
        else {
            this.$sidebar.append($loadingItem);
        }
    }

    //
    // Event Overrides
    //

    eventMenuFilter($item, $list) {
        // Hide/show duplicate button
        $('[data-repeater-duplicate]', $list).closest('li').toggleClass('disabled', !this.canAdd);

        // Hide/show remove button
        $('[data-repeater-remove]', $list).closest('li').toggleClass('disabled', !this.canRemove);

        // Hide/show up/down
        $('[data-repeater-move-up]', $list).closest('li').toggle(!!$item.prev().length);
        $('[data-repeater-move-down]', $list).closest('li').toggle(!!$item.next().length);

        // Hide/show expand/collapse
        $('[data-repeater-expand]', $list).closest('li').hide();
        $('[data-repeater-collapse]', $list).closest('li').hide();
    }

    eventSortableOnEnd() {
        this.sortable.option('disabled', true);
        this.sortItemsToSidebar();
        this.sortable.option('disabled', false);
    }

    eventOnAddItem() {
        this.appendLoadingItem();
    }

    eventOnDuplicateItem($fromItem) {
        this.appendLoadingItem($fromItem);
    }

    eventDuplicateOnEnd() {
        this.sortSidebarToItems();
    }

    eventOnErrorAddItem() {
        $('li.is-placeholder:first', this.$sidebar).remove();
    }

    eventOnRemoveItem($item) {
        var itemIndex = $item.data('repeater-index'),
            $containerItem = this.findItemFromIndex(itemIndex);

        this.disposeItem($containerItem);
        $containerItem.remove();
    }
}

registerControl('repeaterbuilder', RepeaterFormWidgetBuilder);
