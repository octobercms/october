/*
 * Form Widget
 *
 * Dependences:
 * - Nil
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var FormWidget = function (element, options) {
        this.$el = $(element)
        this.options = options || {}
        this.fieldElementCache = null
        this.fieldValidationElementCache = null

        /*
         * Throttle dependency updating
         */
        this.dependantUpdateInterval = 300
        this.dependantUpdateTimers = {}

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    FormWidget.prototype = Object.create(BaseProto)
    FormWidget.prototype.constructor = FormWidget

    FormWidget.prototype.init = function() {

        this.$form = this.$el.closest('form')

        this.bindDependants()
        this.bindCheckboxlist()
        this.toggleEmptyTabs()
        this.bindCollapsibleSections()
        this.bindValidation()

        this.$el.on('oc.triggerOn.afterUpdate', this.proxy(this.toggleEmptyTabs))
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    FormWidget.prototype.dispose = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.formwidget')

        this.$el = null
        this.$form = null
        this.options = null
        this.fieldElementCache = null

        BaseProto.dispose.call(this)
    }

    /*
     * Logic for checkboxlist
     */
    FormWidget.prototype.bindCheckboxlist = function() {

        var checkAllBoxes = function($field, flag) {
            $('input[type=checkbox]', $field)
                .prop('checked', flag)
                .first()
                .trigger('change')
        }

        this.$el.on('click', '[data-field-checkboxlist-all]', function() {
            checkAllBoxes($(this).closest('.field-checkboxlist'), true)
        })

        this.$el.on('click', '[data-field-checkboxlist-none]', function() {
            checkAllBoxes($(this).closest('.field-checkboxlist'), false)
        })

    }

    /*
     * Get all fields elements that belong to this form, nested form
     * fields are removed from this collection.
     */
    FormWidget.prototype.getFieldElements = function() {
        if (this.fieldElementCache !== null) {
            return this.fieldElementCache
        }

        var form = this.$el,
            nestedFields = form.find('[data-control="formwidget"] [data-field-name]')

        return this.fieldElementCache = form.find('[data-field-name]').not(nestedFields)
    }

    /*
     * Get all fields elements that belong to this form or are part of a section of this form that
     * has inline validation enabled, or have inline validation enabled for the field explicitly.
     * Strip out any fields that are explicitly not to be validated, or are part of a nested form.
     */
    FormWidget.prototype.getFieldElementsToValidate = function() {
        if (this.fieldValidationElementCache !== null) {
            return this.fieldValidationElementCache
        }

        var $form = this.$el,
            nestedFields = $form.find('[data-control="formwidget"] [data-field-name]'),
            fields = []

        if ($form.data('inline-validation') !== undefined && $form.data('inline-validation') === 1) {
            // Find fields within forms and sections that are marked for inline validation
            $form.find('[data-field-name]').not(nestedFields).not('[data-inline-validation="0"]').each(function () {
                fields.push(this)
            })
        } else {
            // Find individual fields that are marked for inline validation
            $form.find('[data-field-name][data-inline-validation="1"]').not(nestedFields).each(function () {
                fields.push(this)
            })
        }

        return this.fieldValidationElementCache = fields
    }

    /*
     * Bind dependant fields
     */
    FormWidget.prototype.bindDependants = function() {

        if (!$('[data-field-depends]', this.$el).length) {
            return;
        }

        var self = this,
            fieldMap = {},
            fieldElements = this.getFieldElements()

        /*
         * Map master and slave fields
         */
        fieldElements.filter('[data-field-depends]').each(function() {
            var name = $(this).data('field-name'),
                depends = $(this).data('field-depends')

            $.each(depends, function(index, depend){
                if (!fieldMap[depend]) {
                    fieldMap[depend] = { fields: [] }
                }

                fieldMap[depend].fields.push(name)
            })
        })

        /*
         * When a master is updated, refresh its slaves
         */
        $.each(fieldMap, function(fieldName, toRefresh){
            fieldElements.filter('[data-field-name="'+fieldName+'"]')
                .on('change.oc.formwidget', $.proxy(self.onRefreshDependants, self, fieldName, toRefresh))
        })
    }

    /*
     * Refresh a dependancy field
     * Uses a throttle to prevent duplicate calls and click spamming
     */
    FormWidget.prototype.onRefreshDependants = function(fieldName, toRefresh) {
        var self = this,
            form = this.$el,
            formEl = this.$form,
            fieldElements = this.getFieldElements()

        if (this.dependantUpdateTimers[fieldName] !== undefined) {
            window.clearTimeout(this.dependantUpdateTimers[fieldName])
        }

        this.dependantUpdateTimers[fieldName] = window.setTimeout(function() {
            var refreshData = $.extend({},
                toRefresh,
                paramToObj('data-refresh-data', self.options.refreshData)
            )

            formEl.request(self.options.refreshHandler, {
                data: refreshData
            }).success(function() {
                self.toggleEmptyTabs()
            })
        }, this.dependantUpdateInterval)

        $.each(toRefresh.fields, function(index, field) {
            fieldElements.filter('[data-field-name="'+field+'"]:visible')
                .addClass('loading-indicator-container size-form-field')
                .loadIndicator()
        })
    }

    /*
     * Hides tabs that have no content, it is possible this can be
     * called multiple times in a single cycle due to input.trigger.
     */
    FormWidget.prototype.toggleEmptyTabs = function() {
        var self = this,
            form = this.$el

        if (this.toggleEmptyTabsTimer !== undefined) {
            window.clearTimeout(this.toggleEmptyTabsTimer)
        }

        this.toggleEmptyTabsTimer = window.setTimeout(function() {

            var tabControl = $('[data-control=tab]', self.$el),
                tabContainer = $('.nav-tabs', tabControl)

            if (!tabControl.length || !$.contains(form.get(0), tabControl.get(0)))
                return

            /*
             * Check each tab pane for form field groups
             */
            $('.tab-pane', tabControl).each(function() {
                $('[data-target="#' + $(this).attr('id') + '"]', tabControl)
                    .closest('li')
                    .toggle(!!$('> .form-group:not(:empty):not(.hide)', $(this)).length)
            })

            /*
             * If a hidden tab was selected, select the first visible tab
             */
            if (!$('> li.active:visible', tabContainer).length) {
                $('> li:visible:first', tabContainer)
                    .find('> a:first')
                    .tab('show')
            }

        }, 1)
    }

    /*
     * Makes sections collapsible by targeting every field after
     * up until the next section
     */
    FormWidget.prototype.bindCollapsibleSections = function() {
        $('.section-field[data-field-collapsible]', this.$form)
            .addClass('collapsed')
            .find('.field-section:first')
                .addClass('is-collapsible')
                .end()
            .on('click', function() {
                $(this)
                    .toggleClass('collapsed')
                    .nextUntil('.section-field').toggle()
            })
            .nextUntil('.section-field').hide()
    }

    /*
     * Bind validation checks on available fields, triggered when
     * the fields is blurred or changed
     */
    FormWidget.prototype.bindValidation = function () {
        var fields = this.getFieldElementsToValidate(),
            $form = this.$form

        for (var i in fields) {
            var field = fields[i]

            if (!field || !field.className) {
                continue
            }

            var fieldClasses = field.className.split(/\s+/).map(function (className) {
                var fieldClass = className.match(/^([a-z\-]+)-field$/)
                if (fieldClass) {
                    return fieldClass[1]
                } else {
                    return null
                }
            }).filter(function (className) {
                return (className != null)
            })

            if (fieldClasses.length === 0) {
                continue
            }

            // Load validator depending on field type
            switch (fieldClasses[0]) {
                case 'text':
                case 'password':
                case 'number':
                case 'textarea':
                    this._validateText($form, field)
                    break
                case 'dropdown':
                    this._validateDropdown($form, field)
                    break
                case 'balloon-selector':
                    this._validateBalloonSelector($form, field)
                    break
            }
        }
    }

    FormWidget.prototype.fieldResponseHandler = function ($form, $field, data, status) {
        if (status !== 'success') {
            return
        }

        if (data.valid !== undefined && data.valid === false) {
            this.showFieldError($field, data.message)
        }
    }

    FormWidget.prototype.showFieldError = function ($field, message) {
        $field.addClass('has-error')

        var $error = $('<div class="validation-error"></div>')
        $error.text(message)

        $field.append($error)
    }


    FormWidget.prototype.clearFieldError = function ($field) {
        $field.removeClass('has-error')
        $field.find('.validation-error').remove()
    }

    FormWidget.prototype._validateText = function ($form, field) {
        var $elem = this.$el,
            $field = $(field),
            widget = this

        var innerField = field.querySelector('input,textarea')
        if (!innerField) {
            return
        }

        innerField.addEventListener('blur', function (ev) {
            widget.clearFieldError($field)

            $elem.request('onValidateField', {
                data: {
                    fieldId: field.id,
                    fieldName: field.dataset.fieldName
                },
                form: $form,
                success: function (data, status, jqXHR) {
                    widget.fieldResponseHandler($form, $field, data, status, jqXHR)
                }
            })
        })
    }

    FormWidget.prototype._validateDropdown = function ($form, field) {
        var $elem = this.$el,
            $field = $(field),
            widget = this

        var $innerField = $(field.querySelector('select'))
        if (!$innerField) {
            return
        }

        $innerField.on('change', function () {
            widget.clearFieldError($field)

            $elem.request('onValidateField', {
                data: {
                    fieldId: field.id,
                    fieldName: field.dataset.fieldName
                },
                form: $form,
                success: function (data, status, jqXHR) {
                    widget.fieldResponseHandler($form, $field, data, status, jqXHR)
                }
            })
        })
    }

    FormWidget.prototype._validateBalloonSelector = function ($form, field) {
        var $elem = this.$el,
            $field = $(field),
            widget = this

        var $innerField = $(field.querySelector('input'));
        if (!$innerField) {
            return
        }

        $innerField.on('change', function () {
            widget.clearFieldError($field)

            $elem.request('onValidateField', {
                data: {
                    fieldId: field.id,
                    fieldName: field.dataset.fieldName
                },
                form: $form,
                success: function (data, status, jqXHR) {
                    widget.fieldResponseHandler($form, $field, data, status, jqXHR)
                }
            })
        })
    }

    FormWidget.DEFAULTS = {
        refreshHandler: null,
        refreshData: {}
    }

    // FORM WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.formWidget

    $.fn.formWidget = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.formwidget')
            var options = $.extend({}, FormWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.formwidget', (data = new FormWidget(this, options)))
            if (typeof option == 'string') result = data[option].call($this)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
      }

    $.fn.formWidget.Constructor = FormWidget

    // FORM WIDGET NO CONFLICT
    // =================

    $.fn.formWidget.noConflict = function () {
        $.fn.formWidget = old
        return this
    }

    // FORM WIDGET DATA-API
    // ==============

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return JSON.parse(JSON.stringify(eval("({" + value + "})")))
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    $(document).render(function() {
        $('[data-control="formwidget"]').formWidget();
    })

}(window.jQuery);
