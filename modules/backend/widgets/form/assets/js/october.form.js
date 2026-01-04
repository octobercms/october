/*
 * Form Widget
 *
 * Config:
 * - refreshHandler: null
 * - refreshData: {}
 */
+function ($) { "use strict";

    oc.registerControl('formwidget', class extends oc.ControlBase {

        init() {
            // Throttle dependency updating
            this.dependantUpdateInterval = 300;
            this.dependantUpdateTimers = {};

            this.fieldElementCache = null;
            this.disposeCallbacks = [];
        }

        connect() {
            this.$el = $(this.element);
            this.$form = this.$el.closest('form');
            this.options = Object.assign({}, this.config || {});

            this.$el.on('change.oc.formwidget', '[data-change-handler]', this.proxy(this.onRefreshChangeField));
            $('.nav-tabs', this.$el).on('shown.bs.tab shownLinkable.oc.tab', 'li.tab-lazy > a', this.proxy(this.showLazyTab));
            this.$el.on('oc.triggerOn.afterUpdate', '.field-checkboxlist', this.proxy(this.toggleCheckboxlist));
            this.listen('click', '.field-checkboxlist input[type=checkbox]', this.onClickCheckboxListCheckbox);
            this.listen('click', '.field-checkboxlist.is-cumulative input[type=checkbox]', this.onClickCheckboxListCheckboxCumulative);

            addEventListener('trigger:complete', this.proxy(this.toggleEmptyTabs));
            oc.Events.on(this.element, 'trigger:empty', '.field-checkboxlist', this.proxy(this.clearCheckboxlist));

            this.bindDependents();
            this.bindCheckboxlist();
            this.bindCollapsibleSections();
            this.toggleEmptyTabs();
        }

        disconnect() {
            this.$el.off('change.oc.formwidget', '[data-change-handler]', this.proxy(this.onRefreshChangeField));
            $('.nav-tabs', this.$el).off('shown.bs.tab shownLinkable.oc.tab', 'li.tab-lazy > a', this.proxy(this.showLazyTab));
            this.$el.off('oc.triggerOn.afterUpdate', '.field-checkboxlist', this.proxy(this.toggleCheckboxlist));

            $('.section-field[data-field-collapsible]', this.$form).off('click');

            this.disposeCallbacks.forEach(callback => callback());
            this.disposeCallbacks = [];

            removeEventListener('trigger:complete', this.proxy(this.toggleEmptyTabs));
            oc.Events.off(this.element, 'trigger:empty', '.field-checkboxlist', this.proxy(this.clearCheckboxlist));

            this.$el.removeData('oc.formwidget');

            this.$el = null;
            this.$form = null;
            this.options = null;
            this.fieldElementCache = null;
        }

        // Logic for checkboxlist
        onClickCheckboxListCheckbox(ev) {
            oc.checkboxRangeRegisterClick(ev, '.form-check', 'input[type=checkbox]');
        }

        onClickCheckboxListCheckboxCumulative(ev) {
            const el = ev.delegateTarget;
            if (el.checked) {
                const childGroup = el.closest('.form-check').nextElementSibling;
                if (childGroup && childGroup.classList && childGroup.classList.contains('checkboxlist-group')) {
                    childGroup.querySelectorAll('input[type=checkbox]').forEach((chk) => {
                        chk.checked = true;
                    });
                }
            }
        }

        toggleCheckboxlist(ev) {
            var $field = ev.target.closest('.field-checkboxlist'),
                isDisabled = $field.classList.contains('control-disabled');

            $field.querySelectorAll('input[type=checkbox]:not([data-option-disabled]), .checkboxlist-controls > .control-button').forEach((el) => {
                el.disabled = isDisabled;
            });
        }

        clearCheckboxlist(ev) {
            this.checkAllCheckboxlist(ev.target, false);
        }

        bindCheckboxlist() {
            this.listen('click', '[data-field-checkboxlist-all]', (event) => {
                const el = event.delegateTarget;
                if (el.disabled || el.readOnly) {
                    return;
                }

                this.checkAllCheckboxlist(el.closest('.field-checkboxlist'), true);
            });

            this.listen('click', '[data-field-checkboxlist-none]', (event) => {
                const el = event.delegateTarget;
                if (el.disabled || el.readOnly) {
                    return;
                }

                this.checkAllCheckboxlist(el.closest('.field-checkboxlist'), false);
            });

            this.element.querySelectorAll('.field-checkboxlist').forEach((el) => {
                el.querySelectorAll('input[type=checkbox][disabled]').forEach((checkbox) => {
                    checkbox.dataset.optionDisabled = '';
                });

                this.toggleCheckboxlist({ target: el });
            });
        }

        checkAllCheckboxlist($field, flag) {
            $('input[type=checkbox]:not([data-option-disabled])', $field)
                .prop('checked', flag)
                .first()
                .trigger('change');
        }

        // Get all fields elements that belong to this form, nested form
        // fields are removed from this collection.
        getFieldElements() {
            if (this.fieldElementCache !== null) {
                return this.fieldElementCache;
            }

            var form = this.$el,
                nestedFields = form.find('[data-control="formwidget"] [data-field-name]');

            return this.fieldElementCache = form.find('[data-field-name]').not(nestedFields);
        }

        // Bind dependant fields
        bindDependents() {
            if (!$('[data-field-depends]', this.$el).length) {
                return;
            }

            var fieldMap = {},
                fieldElements = this.getFieldElements();

            // Map master and slave fields
            fieldElements.filter('[data-field-depends]').each((index, element) => {
                var name = $(element).data('field-name'),
                    depends = $(element).data('field-depends');

                $.each(depends, (index, depend) => {
                    if (!fieldMap[depend]) {
                        fieldMap[depend] = { fields: [] };
                    }

                    fieldMap[depend].fields.push(name);
                })
            });

            // When a master is updated, refresh its slaves
            $.each(fieldMap, (fieldName, toRefresh) => {
                fieldElements.filter('[data-field-name="'+fieldName+'"]')
                    .on('change.oc.formwidget', $.proxy(this.onRefreshDependents, this, fieldName, toRefresh));

                // Set up disposal
                this.disposeCallbacks.push(function() {
                    fieldElements.filter('[data-field-name="'+fieldName+'"]')
                        .off('change.oc.formwidget');
                });
            });
        }

        // Refresh a dependency field
        // Uses a throttle to prevent duplicate calls and click spamming
        onRefreshDependents(fieldName, toRefresh) {
            var formEl = this.$form,
                fieldElements = this.getFieldElements();

            if (this.dependantUpdateTimers[fieldName] !== undefined) {
                window.clearTimeout(this.dependantUpdateTimers[fieldName]);
            }

            this.dependantUpdateTimers[fieldName] = window.setTimeout(() => {
                var refreshData = $.extend({},
                    toRefresh,
                    paramToObj('data-refresh-data', this.options.refreshData)
                );

                formEl.request(this.options.refreshHandler, {
                    data: refreshData
                }).done(() => {
                    this.toggleEmptyTabs();

                    // Refresh field element cache and trigger change only on fields in this form
                    this.fieldElementCache = null;
                    var updatedFieldElements = this.getFieldElements();
                    $.each(toRefresh.fields, (key, field) => {
                        updatedFieldElements.filter('[data-field-name="' + field + '"]').trigger('change');
                    });
                });
            }, this.dependantUpdateInterval);

            $.each(toRefresh.fields, function(index, field) {
                fieldElements.filter('[data-field-name="'+field+'"]:visible')
                    .addClass('loading-indicator-container size-form-field')
                    .loadIndicator();
            });
        }

        // Calls an AJAX handler when the field updates.
        onRefreshChangeField(ev) {
            // @todo same approach in onRefreshDependents instead of debounce? -sg
            if (!this.isCurrentFormContext(ev.target)) {
                return;
            }

            var $group = $(ev.target).closest('[data-change-handler]'),
                handler = $group.data('change-handler');

            // Debounce needed because select2 triggers change twice (vanilla + jquery) -sg
            if (this.dependantUpdateTimers[handler] !== undefined) {
                window.clearTimeout(this.dependantUpdateTimers[handler]);
            }

            this.dependantUpdateTimers[handler] = window.setTimeout(() => {
                var refreshData = paramToObj('data-refresh-data', this.options.refreshData);
                $group.request(handler, {
                    data: refreshData
                }).done(() => {
                    this.toggleEmptyTabs();
                });
            }, this.dependantUpdateInterval);
        }

        isCurrentFormContext(el) {
            return el.closest('[data-control="formwidget"]') === this.$el.get(0);
        }

        // Hides tabs that have no content, it is possible this can be
        // called multiple times in a single cycle due to input.trigger.
        toggleEmptyTabs() {
            var form = this.$el;

            if (this.toggleEmptyTabsTimer !== undefined) {
                window.clearTimeout(this.toggleEmptyTabsTimer);
            }

            this.toggleEmptyTabsTimer = window.setTimeout(() => {
                var tabControl = $('[data-control=tab]', this.$el),
                    tabContainer = $('.nav-tabs', tabControl);

                if (!tabControl.length || !$.contains(form.get(0), tabControl.get(0))) {
                    return;
                }

                // Check each tab pane for form field groups, locate first level form groups only
                $('.tab-pane:not(.is-lazy):not(.nohide)', tabControl).each(function() {
                    var hasControlsSelector = '> .form-group:not(:empty):not(.oc-hide), > .row > .form-group:not(:empty):not(.oc-hide)';

                    $('[data-bs-target="#' + $(this).attr('id') + '"]', tabControl)
                        .closest('li')
                        .toggle(!!$(hasControlsSelector, $(this)).length);
                });

                // If a hidden tab was selected, select the first visible tab
                if (!$('> li.active:visible', tabContainer).length) {
                    $('> li:visible:first', tabContainer)
                        .find('> a:first')
                        .tab('show');
                }
            }, 1);
        }

        // Render tab form fields once a lazy tab is selected.
        showLazyTab(ev) {
            var $el = $(ev.target),
                handlerName = $el.data('tab-lazy-handler');

            $el.request(handlerName, {
                data: {
                    target: $el.data('target'),
                    name: $el.data('tab-name'),
                    section: $el.data('tab-section')
                },
                success: function(data) {
                    this.success(data);
                    $el.parent().removeClass('tab-lazy');

                    // Trigger all input presets to populate new fields.
                    setTimeout(function() {
                        $('[data-input-preset]').each(function() {
                            var preset = $(this).data('oc.inputPreset')
                            if (preset && preset.$src) {
                                preset.$src.trigger('input')
                            }
                        })
                    }, 0);
                }
            });
        }

        // Makes sections collapsible by targeting every field after
        // up until the next section
        bindCollapsibleSections() {
            $('.section-field[data-field-collapsible]', this.$form)
                .addClass('collapsed')
                .find('.field-section:first')
                    .addClass('is-collapsible')
                    .end()
                .on('click', function() {
                    $(this)
                        .toggleClass('collapsed')
                        .nextUntil('.section-field').toggle();
                })
                .nextUntil('.section-field').hide();
        }
    });

    // FORM WIDGET INTERNALS
    // ==============

    function paramToObj(name, value) {
        if (value === undefined) value = '';
        if (typeof value == 'object') return value;

        try {
            return oc.parseJSON("{" + value + "}");
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e);
        }
    }

}(window.jQuery);
