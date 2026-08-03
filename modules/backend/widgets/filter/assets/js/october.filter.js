/*
 * Filter Widget
 *
 * Data attributes:
 * - data-behavior="filter" - enables the filter plugin
 *
 * Dependencies:
 * - October Popover (october.popover.js)
 *
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype;

    var FilterWidget = function (element, options) {
        this.$el = $(element);
        this.options = options || {};
        this.popoverContent = {};
        this.$activeScope = null;

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);
        this.init();
    }

    FilterWidget.prototype = Object.create(BaseProto);
    FilterWidget.prototype.constructor = FilterWidget;

    FilterWidget.prototype.init = function() {
        oc.Events.on(this.$el.get(0), 'change', '.filter-scope select', this.proxy(this.onToggleDropdown));
        this.$el.on('change', '.filter-scope input[type="checkbox"]', this.proxy(this.onToggleCheckbox));
        this.$el.on('click', 'a.filter-scope', this.proxy(this.onClickScopePopover));
        this.$el.on('hide.oc.popover', 'a.filter-scope', this.proxy(this.onHideScopePopover));
        this.$el.on('click', '.filter-scope [data-filter-action="apply"]', this.proxy(this.onClickInlineScopeApply));
        this.$el.on('click', '.filter-scope [data-filter-action="clear"]', this.proxy(this.onClickInlineScopeClear));

        this.bindCheckboxes();
        this.preloadContent();
    }

    FilterWidget.prototype.dispose = function() {
        oc.Events.off(this.$el.get(0), 'change', '.filter-scope select', this.proxy(this.onToggleDropdown));
        this.$el.off('change', '.filter-scope input[type="checkbox"]', this.proxy(this.onToggleCheckbox));
        this.$el.off('click', 'a.filter-scope', this.proxy(this.onClickScopePopover));
        this.$el.off('hide.oc.popover', 'a.filter-scope', this.proxy(this.onHideScopePopover));
        this.$el.off('click', '.filter-scope [data-filter-action="apply"]', this.proxy(this.onClickInlineScopeApply));
        this.$el.off('click', '.filter-scope [data-filter-action="clear"]', this.proxy(this.onClickInlineScopeClear));

        this.$el.off('dispose-control', this.proxy(this.dispose));
        this.$el.removeData('oc.filterwidget');

        this.$el = null;
        this.options = null;

        BaseProto.dispose.call(this);
    }

    FilterWidget.prototype.preloadContent = function() {
        try {
            var self = this;
            this.$el.request(this.options.updateHandler, {
                data: {
                    preload: true
                },
                success: function(data) {
                    self.popoverContent = data.popoverContent;
                },
                error: function() {}
            })
        }
        catch (e) {}
    }

    //
    // Popover Scope
    //

    FilterWidget.prototype.initContainer = function(el) {
        $(el).on('click', '[data-filter-action="apply"]', this.proxy(this.onClickScopeApply));
        $(el).on('click', '[data-filter-action="clear"]', this.proxy(this.onClickScopeClear));
    }

    FilterWidget.prototype.disposeContainer = function(el) {
        $(el).off('click', '[data-filter-action="apply"]', this.proxy(this.onClickScopeApply));
        $(el).off('click', '[data-filter-action="clear"]', this.proxy(this.onClickScopeClear));
    }

    FilterWidget.prototype.onClickScopePopover = function(ev) {
        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        // Second click closes the filter scope
        if ($scope.hasClass('filter-scope-open')) {
            return;
        }

        $scope.addClass('filter-scope-open');

        // Hide any old scopes
        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }

        this.$activeScope = $scope;

        this.showPopover($scope);
    }

    FilterWidget.prototype.onClickScopeApply = function(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $form = $el.closest('form');

        this.submitUpdate($form, this.$activeScope);

        this.hidePopover(this.$activeScope);
    }

    FilterWidget.prototype.onClickScopeClear = function(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $form = $el.closest('form');

        this.submitUpdate($form, this.$activeScope, {
            clearScope: true
        });

        this.hidePopover(this.$activeScope);
    }

    FilterWidget.prototype.onHideScopePopover = function(ev) {
        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        this.$activeScope = null;

        setTimeout(function() {
            $scope.removeClass('filter-scope-open');
        }, 200);
    }

    FilterWidget.prototype.hidePopover = function($scope) {
        var scopeName = $scope.data('scope-name');
        this.popoverContent[scopeName] = null;

        $scope.ocPopover('hide');
    }

    FilterWidget.prototype.showPopover = function($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            container = false;

        // If the filter is running in a modal, popovers should be
        // attached to the modal container. This prevents z-index issues.
        var modalParent = $scope.closest('.modal');
        if (modalParent.length > 0) {
            container = modalParent[0];
        }

        var data = {
            scopeName: scopeName
        };

        $scope.data('oc.popover', null);

        $scope.ocPopover({
            content: Mustache.render(self.getPopoverTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
            container: container,
            onCheckDocumentClickTarget: function (target) {
                return self.onCheckDocumentClickTargetDatePicker(target)
            }
        });

        var $container = $scope.ocPopover('getContainer'),
            $form = $('form:first', $container);

        if (!this.popoverContent) {
            this.popoverContent = {};
        }

        if (this.popoverContent[scopeName]) {
            self.setPopoverContent($container, this.popoverContent[scopeName]);
            oc.Events.dispatch('render');
        }
        else {
            $form.request(this.options.loadHandler, {
                success: function(data) {
                    this.success(data);
                    self.setPopoverContent($container, data.result);
                    self.popoverContent[scopeName] = data.result;
                }
            });
        }

        // Bind events
        this.initContainer($container);
    }

    FilterWidget.prototype.setPopoverContent = function($container, html) {
        $('.control-filter-popover', $container).html(html);
    }

    //
    // Inline Scope
    //

    FilterWidget.prototype.onClickInlineScopeApply = function(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, oc.serializeJSON($scope.get(0)));

        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }
    }

    FilterWidget.prototype.onClickInlineScopeClear = function(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, {
            clearScope: true
        });

        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }
    }

    //
    // Dropdowns
    //

    FilterWidget.prototype.onToggleDropdown = function(ev) {
        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        // Hide any old scopes
        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }

        this.submitUpdate(this.$el, $scope, {
            value: $el.val()
        });
    }

    //
    // Checkboxes
    //

    FilterWidget.prototype.bindCheckboxes = function() {
        $('.filter-scope input[type="checkbox"]', this.$el).each(function() {
            $(this).closest('.filter-scope').toggleClass('active', $(this).is(':checked'));
        });
    }

    FilterWidget.prototype.onToggleCheckbox = function(ev) {
        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        // Hide any old scopes
        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }

        if ($scope.hasClass('is-indeterminate')) {
            this.switchToggle($el);
        }
        else {
            this.checkboxToggle($el);
        }
    }

    FilterWidget.prototype.checkboxToggle = function($el) {
        var isChecked = $el.is(':checked'),
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, {
            value: isChecked
        });

        $scope.toggleClass('active', isChecked);
    }

    FilterWidget.prototype.switchToggle = function($el) {
        var switchValue = parseInt($el.attr('data-checked')) || 0,
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, {
            value: switchValue
        });

        $scope.toggleClass('active', !!switchValue);
    }

    //
    // AJAX
    //

    FilterWidget.prototype.submitUpdate = function($el, $scope, data) {
        if (!this.options.updateHandler) {
            return;
        }

        var scopeName = $scope.data('scope-name');
        this.$el.addClass('is-loading');

        // Prepare data with known values
        if (!data) {
            data = {};
        }
        data.scopeName = scopeName;

        // Submit data
        var submitData = {
            data: data,
        };

        if (this.options.pageName) {
            submitData.query = {
                [this.options.pageName]: null
            };
        }

        // Submit request
        $el.request(this.options.updateHandler, submitData)
            .always(() => {
                this.$el.removeClass('is-loading');
            })
            .done((data) => {
                // Trigger dependsOn updates on successful requests
                this.$el
                    .find('[data-scope-name="'+scopeName+'"]')
                    .trigger('change.oc.filterScope');
            });
    }

    FilterWidget.prototype.updatePopoverContent = function(content) {
        var self = this;
        $.each(content, function(key, val) {
            self.popoverContent[key] = val;
        });
    }

    FilterWidget.prototype.getPopoverTemplate = function() {
        return $(this.options.popoverTemplate).html();
    }

    FilterWidget.prototype.onCheckDocumentClickTargetDatePicker = function (target) {
        var $target = $(target);

        // If the click happens on a pikaday element, do not close the popover
        return $target.hasClass('pika-next') ||
            $target.hasClass('pika-prev') ||
            $target.hasClass('pika-select') ||
            $target.hasClass('pika-button') ||
            $target.parents('.pika-table').length ||
            $target.parents('.pika-title').length;
    }

    FilterWidget.DEFAULTS = {
        popoverTemplate: null,
        optionsHandler: null,
        updateHandler: null,
        loadHandler: null,
        pageName: null
    }

    // FILTER WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.filterWidget

    $.fn.filterWidget = function (option) {
        var args = arguments,
            result;

        this.each(function () {
            var $this   = $(this);
            var data    = $this.data('oc.filterwidget');
            var options = $.extend({}, FilterWidget.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data) $this.data('oc.filterwidget', (data = new FilterWidget(this, options)));
            if (typeof option == 'string') result = data[option].call($this);
            if (typeof result != 'undefined') return false;
        })

        return result ? result : this;
    }

    $.fn.filterWidget.Constructor = FilterWidget;

    // FILTER WIDGET NO CONFLICT
    // =================

    $.fn.filterWidget.noConflict = function () {
        $.fn.filterWidget = old;
        return this;
    }

    // FILTER WIDGET DATA-API
    // ==============

    $(document).render(function(){
        $('[data-control="filterwidget"]').filterWidget();
    });

}(window.jQuery);
