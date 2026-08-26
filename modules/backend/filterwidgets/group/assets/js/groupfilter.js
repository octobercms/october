import { ControlBase, registerControl } from 'larajax';

/*
 * GroupFilter control
 *
 * Data attributes:
 * - data-control="groupfilter" - enables the control on an element
 * - data-options-handler="onGetGroupOptions" - AJAX handler to load available options
 * - data-group-template="#template" - Mustache template for the group markup
 *
 * JavaScript API:
 * oc.fetchControl(element, 'groupfilter')
 */
registerControl('groupfilter', class extends ControlBase {
    init() {
        this.config = Object.assign({
            optionsHandler: null,
            groupTemplate: null
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.$dataLocker = $('[data-groupfilter-datalocker]:first', this.$el);

        this.scopeValues = [];
        this.scopeAvailable = [];

        this.listen('click', '.filter-items > ul > li', this.onSelectItem);
        this.listen('click', '.filter-active-items > ul > li', this.onDeselectItem);
        this.listen('ajax:done', 'input.filter-search-input', this.onSearchAjaxDone);

        this.renderFilter();
        this.focusSearch();

        this.scopeValues = this.getDataLockerValue();
    }

    disconnect() {
        this.$el = null;
        this.$dataLocker = null;
    }

    onSearchAjaxDone(ev) {
        this.filterAvailable(ev.detail.data.options.available);
    }

    onSelectItem(ev) {
        var $item = $(ev.target).closest('li');
        this.selectItem($item);
    }

    onDeselectItem(ev) {
        var $item = $(ev.target).closest('li');
        this.selectItem($item, true);
    }

    selectItem($item, isDeselect) {
        var itemId = $item.data('item-id'),
            $otherContainer = isDeselect
            ? $item.closest('.control-filter-popover').find('.filter-items:first > ul')
            : $item.closest('.control-filter-popover').find('.filter-active-items:first > ul');

        if (isDeselect) {
            $(`[data-item-id="${itemId}"]`, $otherContainer).removeClass('oc-hide');
            $item.remove();
        }
        else {
            $item
                .clone()
                .addClass('animate-enter')
                .prependTo($otherContainer)
                .one('animationend', function() {
                    $(this).removeClass('animate-enter');
                });

            $item.addClass('oc-hide');
        }

        var active = this.scopeValues,
            available = this.scopeAvailable,
            fromItems = isDeselect ? active : available,
            testFunc = function(active){ return active.id == itemId },
            item = $.grep(fromItems, testFunc).pop(),
            filtered = $.grep(fromItems, testFunc, true);

        if (!item) {
            item = { 'id': itemId, 'name': $item.text() };
        }

        if (isDeselect) {
            this.scopeValues = filtered;
            this.scopeAvailable.push(item);
        }
        else {
            this.scopeAvailable = filtered;
            this.scopeValues.push(item);
        }

        this.setDataLockerValue();

        this.focusSearch();
    }

    getDataLockerValue() {
        var lockerVal = this.$dataLocker.val();
        return lockerVal ? JSON.parse(lockerVal) : [];
    }

    setDataLockerValue() {
        var ids = [];

        $.each(this.scopeValues, function(key, val) {
            ids.push(val.id);
        });

        this.$dataLocker.val(JSON.stringify(ids));
    }

    focusSearch() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }

        var $input = $('input.filter-search-input', this.$el),
            length = $input.val().length;

        $input.focus();
        $input.get(0).setSelectionRange(length, length);
    }

    renderFilter() {
        var self = this,
            data = {
                loading: true,
                optionsHandler: this.config.optionsHandler
            };

        $('[data-groupfilter-container]', this.$el)
            .html(Mustache.render(this.getGroupTemplate(), data));

        this.$el.request(this.config.optionsHandler, {
            success: function(data) {
                this.success(data);
                self.fillOptions(data.options);
            }
        });
    }

    fillOptions(data) {
        if (!data.active) {
            data.active = [];
        }

        if (!data.available) {
            data.available = [];
        }

        this.scopeValues = data.active;
        this.scopeAvailable = data.available;

        // Inject available
        var $container = $('.filter-items > ul:first', this.$el).empty();
        this.addItemsToListElement($container, data.available, data.active);

        // Inject active
        var $container = $('.filter-active-items > ul:first', this.$el);
        this.addItemsToListElement($container, data.active);
    }

    filterAvailable(available) {
        if (!this.scopeValues) {
            return;
        }

        var $container = $('.filter-items > ul', this.$el).empty();
        this.addItemsToListElement($container, available, this.scopeValues);
    }

    addItemsToListElement($ul, items, selectedItems) {
        $.each(items, function(key, obj) {
            var item = $('<li />')
                .attr('data-item-id', obj.id)
                .append(
                    $('<a />')
                        .attr('href', 'javascript:;')
                        .text(obj.name)
                );

            $ul.append(item);
        });

        if (selectedItems) {
            $.each(selectedItems, function (key, obj) {
                $(`[data-item-id="${obj.id}"]`, $ul).addClass('oc-hide');
            });
        }
    }

    getGroupTemplate() {
        return $(this.config.groupTemplate).html();
    }
});
