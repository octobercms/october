import { ControlBase, registerControl } from 'larajax';

/*
 * Filter Widget control
 *
 * Data attributes:
 * - data-control="filterwidget" - enables the control on an element
 *
 * Dependencies:
 * - October Popover (popover-control.js)
 *
 * JavaScript API:
 * oc.fetchControl(element, 'filterwidget')
 */
registerControl('filterwidget', class extends ControlBase {
    init() {
        this.config = Object.assign({
            popoverTemplate: null,
            optionsHandler: null,
            updateHandler: null,
            loadHandler: null,
            pageName: null
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.popoverContent = {};
        this.$activeScope = null;

        this.listen('change', '.filter-scope select', this.onToggleDropdown);
        this.listen('change', '.filter-scope input[type="checkbox"]', this.onToggleCheckbox);
        this.listen('click', 'a.filter-scope', this.onClickScopePopover);
        this.listen('click', '.filter-scope [data-filter-action="apply"]', this.onClickInlineScopeApply);
        this.listen('click', '.filter-scope [data-filter-action="clear"]', this.onClickInlineScopeClear);
        this.listen('ajax:update', this.onContainerUpdate);

        // Popover events are triggered with jQuery
        this.$el.on('hide.oc.popover', 'a.filter-scope', this.proxy(this.onHideScopePopover));

        this.bindScrollable();
        this.bindCheckboxes();
        this.preloadContent();
    }

    disconnect() {
        this.$el.off('hide.oc.popover', 'a.filter-scope', this.proxy(this.onHideScopePopover));

        this.unbindScrollable();

        this.$el = null;
        this.$activeScope = null;
        this.popoverContent = null;
    }

    bindScrollable() {
        this.$scrollable = $('.filter-scopes:first', this.$el);
        if (this.$scrollable.length) {
            this.$scrollable.dragScroll({
                scrollClassContainer: this.$scrollable.parent()
            });
        }
    }

    unbindScrollable() {
        if (this.$scrollable && this.$scrollable.length) {
            this.$scrollable.dragScroll('dispose');
        }

        this.$scrollable = null;
    }

    onContainerUpdate(ev) {
        // Rebind the scrollable area when the entire container is replaced
        if (ev.target === this.element) {
            this.unbindScrollable();
            this.bindScrollable();
        }
    }

    preloadContent() {
        try {
            var self = this;
            this.$el.request(this.config.updateHandler, {
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

    initContainer(el) {
        $(el).on('click', '[data-filter-action="apply"]', this.proxy(this.onClickScopeApply));
        $(el).on('click', '[data-filter-action="clear"]', this.proxy(this.onClickScopeClear));
    }

    disposeContainer(el) {
        $(el).off('click', '[data-filter-action="apply"]', this.proxy(this.onClickScopeApply));
        $(el).off('click', '[data-filter-action="clear"]', this.proxy(this.onClickScopeClear));
    }

    onClickScopePopover(ev) {
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

    onClickScopeApply(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $form = $el.closest('form');

        this.submitUpdate($form, this.$activeScope);

        this.hidePopover(this.$activeScope);
    }

    onClickScopeClear(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $form = $el.closest('form');

        this.submitUpdate($form, this.$activeScope, {
            clearScope: true
        });

        this.hidePopover(this.$activeScope);
    }

    onHideScopePopover(ev) {
        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        this.$activeScope = null;

        setTimeout(function() {
            $scope.removeClass('filter-scope-open');
        }, 200);
    }

    hidePopover($scope) {
        var scopeName = $scope.data('scope-name');
        this.popoverContent[scopeName] = null;

        $scope.ocPopover('hide');
    }

    showPopover($scope) {
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
            $form.request(this.config.loadHandler, {
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

    setPopoverContent($container, html) {
        $('.control-filter-popover', $container).html(html);
    }

    //
    // Inline Scope
    //

    onClickInlineScopeApply(ev) {
        ev.preventDefault();

        var $el = $(ev.target),
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, oc.serializeJSON($scope.get(0)));

        if (this.$activeScope) {
            this.hidePopover(this.$activeScope);
        }
    }

    onClickInlineScopeClear(ev) {
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

    onToggleDropdown(ev) {
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

    bindCheckboxes() {
        $('.filter-scope input[type="checkbox"]', this.$el).each(function() {
            $(this).closest('.filter-scope').toggleClass('active', $(this).is(':checked'));
        });
    }

    onToggleCheckbox(ev) {
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

    checkboxToggle($el) {
        var isChecked = $el.is(':checked'),
            $scope = $el.closest('.filter-scope');

        this.submitUpdate(this.$el, $scope, {
            value: isChecked
        });

        $scope.toggleClass('active', isChecked);
    }

    switchToggle($el) {
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

    submitUpdate($el, $scope, data) {
        if (!this.config.updateHandler) {
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

        if (this.config.pageName) {
            submitData.query = {
                [this.config.pageName]: null
            };
        }

        // Submit request
        $el.request(this.config.updateHandler, submitData)
            .always(() => {
                if (this.$el) {
                    this.$el.removeClass('is-loading');
                }
            })
            .done((data) => {
                // Trigger dependsOn updates on successful requests
                if (this.$el) {
                    this.$el
                        .find('[data-scope-name="'+scopeName+'"]')
                        .trigger('change.oc.filterScope');
                }
            });
    }

    updatePopoverContent(content) {
        var self = this;
        $.each(content, function(key, val) {
            self.popoverContent[key] = val;
        });
    }

    getPopoverTemplate() {
        return $(this.config.popoverTemplate).html();
    }

    onCheckDocumentClickTargetDatePicker(target) {
        var $target = $(target);

        // If the click happens on a pikaday element, do not close the popover
        return $target.hasClass('pika-next') ||
            $target.hasClass('pika-prev') ||
            $target.hasClass('pika-select') ||
            $target.hasClass('pika-button') ||
            $target.parents('.pika-table').length ||
            $target.parents('.pika-title').length;
    }
});
