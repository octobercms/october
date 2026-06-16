/*
 * List Widget
 *
 * Dependencies:
 * - Row Link Plugin (backend/assets/foundation/scripts/rowlink/rowlink.js)
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype;

    var ListWidget = function (element, options) {
        this.$el = $(element);
        this.options = options || {};

        this.$head = $('thead:first', this.$el);
        this.$body = $('tbody:first', this.$el);

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);

        this.init();
    }

    ListWidget.prototype = Object.create(BaseProto);
    ListWidget.prototype.constructor = ListWidget;

    ListWidget.DEFAULTS = {
        checkboxSelector: '.list-checkbox input[type="checkbox"]'
    }

    ListWidget.prototype.init = function() {
        this.bindScrollableContent();

        this.$el.on('ajaxSetup', this.proxy(this.beforeAjaxRequest));
        this.$body.on('click', '.list-checkbox > input[type=checkbox]', this.proxy(this.onClickCheckbox));
        this.$body.on('change', this.options.checkboxSelector, this.proxy(this.toggleBodyCheckbox));
        this.$head.on('change', this.options.checkboxSelector, this.proxy(this.toggleHeadCheckbox));

        this.$el.one('dispose-control', this.proxy(this.dispose));

        this.updateUi();
    }

    ListWidget.prototype.dispose = function() {
        this.$el.off('ajaxSetup', this.proxy(this.beforeAjaxRequest));
        this.$body.off('click', '.list-checkbox > input[type=checkbox]', this.proxy(this.onClickCheckbox));
        this.$body.off('change', this.options.checkboxSelector, this.proxy(this.toggleBodyCheckbox));
        this.$head.off('change', this.options.checkboxSelector, this.proxy(this.toggleHeadCheckbox));

        this.$el.off('dispose-control', this.proxy(this.dispose));
        this.$el.removeData('oc.listwidget');

        this.$el = null;

        // In some cases options could contain callbacks,
        // so it's better to clean them up too.
        this.options = null;

        BaseProto.dispose.call(this);
    }

    ListWidget.prototype.bindScrollableContent = function() {
        var $content = $('.list-content:first', this.$el);
        var scrollClassContainer = this.options.scrollClassContainer !== undefined
            ? this.options.scrollClassContainer
            : this.$el;

        $content.dragScroll({
            scrollClassContainer: scrollClassContainer,
            scrollSelector: 'thead',
            dragSelector: 'thead'
        });
    }

    ListWidget.prototype.updateUi = function() {
        $(this.options.checkboxSelector, this.$body).each(function(){
            var $el = $(this);
            if ($el.is(':checked')) {
                $el.closest('tr').addClass('active');
            }
        });

        this.checkIndeterminate();
    }

    ListWidget.prototype.checkIndeterminate = function() {
        var $all = $(this.options.checkboxSelector, this.$body),
            $headCb = $(this.options.checkboxSelector, this.$head),
            checkedCount = $all.filter(':checked').length;

        if (checkedCount && $all.length !== checkedCount) {
            $headCb.prop('indeterminate', true);
        }
        else {
            $headCb.prop('indeterminate', false);
        }

        $headCb.prop('checked', !!checkedCount);
    }

    ListWidget.prototype.toggleHeadCheckbox = function(ev) {
        var $el = $(ev.target),
            checked = $el.is(':checked');

        $(this.options.checkboxSelector, this.$body)
            .prop('checked', checked)
            .first()
            .trigger('change');

        if (checked) {
            $('tr', this.$body).addClass('active');
        }
        else {
            $('tr', this.$body).removeClass('active');
        }
    }

    ListWidget.prototype.toggleBodyCheckbox = function(ev) {
        var $el = $(ev.target),
            checked = $el.is(':checked');

        if (checked) {
            $el.closest('tr').addClass('active');
        }
        else {
            $(this.options.checkboxSelector, this.$head).prop('checked', false);
            $el.closest('tr').removeClass('active');
        }

        this.checkIndeterminate();
    }

    ListWidget.prototype.onClickCheckbox = function(ev) {
        oc.checkboxRangeRegisterClick(ev, 'tr', this.options.checkboxSelector);
    }

    ListWidget.prototype.getAllChecked = function() {
        return this.getChecked().concat(this.getCheckedFromLocker());
    }

    ListWidget.prototype.getChecked = function() {
        return $(this.options.checkboxSelector, this.$body)
            .map(function(){
                var $el = $(this)
                if ($el.is(':checked')) {
                    return $el.val();
                }
            })
            .get();
    }

    ListWidget.prototype.getUnchecked = function() {
        return $(this.options.checkboxSelector, this.$body)
            .map(function(){
                var $el = $(this)
                if (!$el.is(':checked')) {
                    return $el.val();
                }
            })
            .get();
    }

    ListWidget.prototype.getCheckedFromLocker = function() {
        try {
            var locker = JSON.parse($('[data-list-datalocker-checked]', this.$el).val());

            $.each(this.getUnchecked(), function(k, value) {
                var index = locker.indexOf(value);
                if (index > -1) {
                    locker.splice(index, 1);
                }
            });

            return locker;
        }
        catch(err) {
            return [];
        }
    }

    ListWidget.prototype.toggleChecked = function(el) {
        var $checkbox = $(this.options.checkboxSelector, $(el).closest('tr'));

        $checkbox
            .prop('checked', !$checkbox.is(':checked'))
            .trigger('change');
    }

    ListWidget.prototype.beforeAjaxRequest = function(ev, context) {
        context.options.data.allChecked = this.getAllChecked();
    }

    // LIST WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.listWidget

    $.fn.listWidget = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.listwidget')
            var options = $.extend({}, ListWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.listwidget', (data = new ListWidget(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        });

        return result ? result : this;
      }

    $.fn.listWidget.Constructor = ListWidget

    // LIST WIDGET NO CONFLICT
    // =================

    $.fn.listWidget.noConflict = function () {
        $.fn.listWidget = old;
        return this;
    }

    // LIST WIDGET HELPERS
    // =================

    if ($.oc === undefined) {
        $.oc = {};
    }

    $.oc.listToggleChecked = function(el) {
        $(el).closest('.control-list').listWidget('toggleChecked', el);
    }

    $.oc.listGetChecked = function(el) {
        return $(el).closest('.control-list').listWidget('getChecked');
    }

    // LIST WIDGET DATA-API
    // ==============

    $(document).render(function(){
        $('[data-control="listwidget"]').listWidget();
    });

    // LIST HELPER DATA-API
    // ==============

    oc.listOnLoadForm = function(recordId, context) {
        $('<a />').popup({
            handler: 'onLoadPopupForm',
            extraData: {
                form_record_id: recordId,
                form_context: context || null
            }
        });
    }

    $.fn.listCheckedTriggerOn = function() {
        this.each(function() {
            var $buttonEl = $(this),
                listId = $buttonEl.closest('[data-list-linkage]').data('list-linkage');

            // No list or already bound
            if (!listId || $buttonEl.data('oc.listCheckedTriggerOn')) {
                $buttonEl.trigger('oc.triggerOn.update');
                return;
            }

            var triggerCallback = null,
                $counter = $('[data-list-checked-counter]', $buttonEl);

            if ($counter.length) {
                $buttonEl.get(0).addEventListener('trigger:after-update', () => {
                    var checked = $.oc.listGetChecked('#' + listId + ' > .control-list:first');

                    if (checked.length) {
                        $counter.text('(' + checked.length + ')');
                    }
                    else {
                        $counter.text('');
                    }
                });
            }

            $buttonEl.triggerOn({
                triggerCallback: triggerCallback,
                triggerAction: 'enable',
                triggerCondition: 'checked',
                trigger: '#' + listId + ' > .control-list:first tbody .list-checkbox input[type=checkbox]'
            });

            $buttonEl.data('oc.listCheckedTriggerOn', true);
        });

        return this;
    }

    $.fn.listCheckedRequest = function() {
        this.each(function() {
            var $buttonEl = $(this),
                listId = $buttonEl.closest('[data-list-linkage]').data('list-linkage');

            // No list or already bound
            if (!listId || $buttonEl.data('oc.listCheckedRequest')) {
                return;
            }

            $buttonEl.on('ajaxSetup', function (ev, context) {
                var checked = $.oc.listGetChecked('#' + listId + ' > .control-list:first');
                if (checked.length) {
                    context.options.data.checked = checked;
                }
            });

            $buttonEl.data('oc.listCheckedRequest', true);
        });

        return this;
    }

    $(document).render(function(){
        $('[data-list-checked-trigger]').listCheckedTriggerOn();
        $('[data-list-checked-request]').listCheckedRequest();
    });

    // Global page chooser
    $(document).on('submit', 'form[data-list-page-chooser]', function(ev) {
        ev.preventDefault();
        oc.dispatch('close.oc.popover', { target: ev.target });

        var $chooser = document.getElementById(ev.target.dataset.chooserId),
            $input = ev.target.querySelector('input[data-chooser-input]'),
            handler = ev.target.dataset.handler,
            pageName = $input.name,
            pageNumber = $input.value,
            transportMethod = pageName === '_page' ? 'data' : 'query';

        oc.request($chooser, handler, {
            [transportMethod]: { [pageName]: pageNumber }
        });
    });

}(window.jQuery);
