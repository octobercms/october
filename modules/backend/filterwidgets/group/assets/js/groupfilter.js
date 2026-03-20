/*
 * GroupFilter plugin
 *
 * Data attributes:
 * - data-control="groupfilter" - enables the plugin on an element
 * - data-data-locker="input#locker" - Input element to store and restore the chosen color
 *
 * JavaScript API:
 * $('div#someElement').groupFilter({ dataLocker: 'input#locker' })
 *
 * Dependencies:
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype;

    var GroupFilter = function(element, options) {
        this.options = options;
        this.$el = $(element);
        this.$dataLocker = $('[data-groupfilter-datalocker]:first', this.$el);

        this.scopeValues = [];
        this.scopeAvailable = [];

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);
        this.init();
    }

    GroupFilter.prototype = Object.create(BaseProto);
    GroupFilter.prototype.constructor = GroupFilter;

    GroupFilter.DEFAULTS = {
        optionsHandler: null,
        groupTemplate: null
    }

    GroupFilter.prototype.init = function() {
        this.$el.on('click', '.filter-items > ul > li', this.proxy(this.onSelectItem));
        this.$el.on('click', '.filter-active-items > ul > li', this.proxy(this.onDeselectItem));
        this.$el.on('ajaxDone', 'input.filter-search-input', this.proxy(this.onSearchAjaxDone));

        this.renderFilter();
        this.focusSearch();

        this.scopeValues = this.getDataLockerValue();
    }

    GroupFilter.prototype.dispose = function() {
        this.$el.off('click', '.filter-items > ul > li', this.proxy(this.onSelectItem));
        this.$el.off('click', '.filter-active-items > ul > li', this.proxy(this.onDeselectItem));
        this.$el.off('ajaxDone', 'input.filter-search-input', this.proxy(this.onSearchAjaxDone));

        this.$el.off('dispose-control', this.proxy(this.dispose));
        this.$el.removeData('oc.groupfilter');

        this.$el = null;
        this.options = null;

        BaseProto.dispose.call(this);
    }

    GroupFilter.prototype.onSearchAjaxDone = function(ev, context, data) {
        this.filterAvailable(data.options.available);
    }

    GroupFilter.prototype.onSelectItem = function(ev) {
        var $item = $(ev.target).closest('li');
        this.selectItem($item);
    }

    GroupFilter.prototype.onDeselectItem = function(ev) {
        var $item = $(ev.target).closest('li');
        this.selectItem($item, true);
    }

    GroupFilter.prototype.selectItem = function($item, isDeselect) {
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

    GroupFilter.prototype.getDataLockerValue = function() {
        var lockerVal = this.$dataLocker.val();
        return lockerVal ? JSON.parse(lockerVal) : [];
    }

    GroupFilter.prototype.setDataLockerValue = function() {
        var ids = [];

        $.each(this.scopeValues, function(key, val) {
            ids.push(val.id);
        });

        this.$dataLocker.val(JSON.stringify(ids));
    }

    GroupFilter.prototype.focusSearch = function() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }

        var $input = $('input.filter-search-input', this.$el),
            length = $input.val().length;

        $input.focus();
        $input.get(0).setSelectionRange(length, length);
    }

    GroupFilter.prototype.renderFilter = function() {
        var self = this,
            data = {
                loading: true,
                optionsHandler: this.options.optionsHandler
            };

        $('[data-groupfilter-container]', this.$el)
            .html(Mustache.render(this.getGroupTemplate(), data));

        this.$el.request(this.options.optionsHandler, {
            success: function(data) {
                this.success(data);
                self.fillOptions(data.options);
            }
        });
    }

    GroupFilter.prototype.fillOptions = function(data) {
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

    GroupFilter.prototype.filterAvailable = function(available) {
        if (!this.scopeValues) {
            return;
        }

        var $container = $('.filter-items > ul', this.$el).empty();
        this.addItemsToListElement($container, available, this.scopeValues);
    }

    GroupFilter.prototype.addItemsToListElement = function($ul, items, selectedItems) {
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

    GroupFilter.prototype.getGroupTemplate = function() {
        return $(this.options.groupTemplate).html();
    }

    // GROUPFILTER PLUGIN DEFINITION
    // ============================

    var old = $.fn.groupFilter

    $.fn.groupFilter = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.groupfilter')
            var options = $.extend({}, GroupFilter.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.groupfilter', (data = new GroupFilter(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.groupFilter.Constructor = GroupFilter

    // GROUPFILTER NO CONFLICT
    // =================

    $.fn.groupFilter.noConflict = function () {
        $.fn.groupFilter = old
        return this
    }

    // GROUPFILTER DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="groupfilter"]').groupFilter()
    })

}(window.jQuery);
