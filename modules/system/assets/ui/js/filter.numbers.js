/*
 * Filter Widget
 *
 * Data attributes:
 * - data-behavior="filter" - enables the filter plugin
 *
 * Dependences:
 * - October Popover (october.popover.js)
 *
 * Notes:
 *   Ideally this control would not depend on loader or the AJAX framework,
 *   then the Filter widget can use events to handle this business logic.
 *
 * Require:
 *  - mustache/mustache
 *  - modernizr/modernizr
 *  - storm/popover
 */
+function ($) {
    "use strict";

    var FilterWidget = $.fn.filterWidget.Constructor;

    // OVERLOADED MODULE
    // =================

    var overloaded_init = FilterWidget.prototype.init;

    FilterWidget.prototype.init = function () {
        overloaded_init.apply(this)

        this.initFilterNumber()
    }


    // NEW MODULE
    // =================

    FilterWidget.prototype.initFilterNumber = function () {
        var self = this

        this.$el.on('show.oc.popover', 'a.filter-scope-number', function (event) {
            self.initNumberInputs($(this).hasClass('range'))

            $(event.relatedTarget).on('click', '#controlFilterPopoverNum [data-filter-action="filter"]', function (e) {
                e.preventDefault()
                e.stopPropagation()
                self.filterByNumber()
            })

            $(event.relatedTarget).on('click', '#controlFilterPopoverNum [data-filter-action="clear"]', function (e) {
                e.preventDefault()
                e.stopPropagation()

                self.filterByNumber(true)
            })
        })

        this.$el.on('hide.oc.popover', 'a.filter-scope-number', function () {
            var $scope = $(this)
            self.pushOptions(self.activeScopeName)
            self.activeScopeName = null
            self.$activeScope = null

            // Second click closes the filter scope
            setTimeout(function () {
                $scope.removeClass('filter-scope-open')
            }, 200)
        })

        this.$el.on('click', 'a.filter-scope-number', function () {
            var $scope = $(this),
                scopeName = $scope.data('scope-name')

            // Ignore if already opened
            if ($scope.hasClass('filter-scope-open')) return

            // Ignore if another popover is opened
            if (null !== self.activeScopeName) return
            self.$activeScope = $scope
            self.activeScopeName = scopeName
            self.isActiveScopeDirty = false

            if ($scope.hasClass('range')) {
                self.displayPopoverNumberRange($scope)
            }
            else {
                self.displayPopoverNumber($scope)
            }

            $scope.addClass('filter-scope-open')
        })
    }

    /*
     * Get popover number template
     */
    FilterWidget.prototype.getPopoverNumberTemplate = function () {
        return '                                                                                                        \
                <form id="filterPopoverNumber-{{ scopeName }}">                                                         \
                    <input type="hidden" name="scopeName" value="{{ scopeName }}" />                                    \
                    <div id="controlFilterPopoverNum" class="control-filter-popover control-filter-box-popover --range">\
                        <div class="filter-search loading-indicator-container size-input-text">                         \
                            <div class="field-number">                                                                  \
                                <input                                                                                  \
                                    type="number"                                                                       \
                                    name="number"                                                                       \
                                    value="{{ number }}"                                                                \
                                    class="form-control align-right"                                                    \
                                    autocomplete="off"                                                                  \
                                    placeholder="{{ number_placeholder }}" />                                           \
                            </div>                                                                                      \
                            <div class="filter-buttons">                                                                \
                                <button class="btn btn-block btn-primary" data-filter-action="filter">                  \
                                    {{ filter_button_text }}                                                            \
                                </button>                                                                               \
                                <button class="btn btn-block btn-secondary" data-filter-action="clear">                 \
                                    {{ reset_button_text }}                                                             \
                                </button>                                                                               \
                            </div>                                                                                      \
                        </div>                                                                                          \
                    </div>                                                                                              \
                </form>                                                                                                 \
            '
    }

    /*
     * Get popover number range template
     */
    FilterWidget.prototype.getPopoverNumberRangeTemplate = function () {
        return '                                                                                                            \
                <form id="filterPopoverNumberRange-{{ scopeName }}">                                                        \
                    <input type="hidden" name="scopeName" value="{{ scopeName }}" />                                        \
                    <div id="controlFilterPopoverNum" class="control-filter-popover control-filter-box-popover --range">    \
                        <div class="filter-search loading-indicator-container size-input-text">                             \
                            <div class="field-number">                                                                      \
                                <div class="right-align">                                                                   \
                                    <input                                                                                  \
                                        type="number"                                                                       \
                                        name="number"                                                                       \
                                        value="{{ number }}"                                                                \
                                        class="form-control align-right"                                                    \
                                        autocomplete="off"                                                                  \
                                        placeholder="{{ min_placeholder }}" />                                              \
                                </div>                                                                                      \
                            </div>                                                                                          \
                            <div class="field-number">                                                                      \
                                <div class="right-align">                                                                   \
                                    <input                                                                                  \
                                        type="number"                                                                       \
                                        {{ maxNumber }}                                                                     \
                                        name="number"                                                                       \
                                        value="{{ number }}"                                                                \
                                        class="form-control align-right"                                                    \
                                        autocomplete="off"                                                                  \
                                        placeholder="{{ max_placeholder }}" />                                              \
                                </div>                                                                                      \
                            </div>                                                                                          \
                            <div class="filter-buttons">                                                                    \
                                <button class="btn btn-block btn-primary" data-filter-action="filter">                      \
                                    {{ filter_button_text }}                                                                \
                                </button>                                                                                   \
                                <button class="btn btn-block btn-secondary" data-filter-action="clear">                     \
                                    {{ reset_button_text }}                                                                 \
                                </button>                                                                                   \
                            </div>                                                                                          \
                        </div>                                                                                              \
                    </div>                                                                                                  \
                </form>                                                                                                     \
            '
    }

    FilterWidget.prototype.displayPopoverNumber = function ($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        data = $.extend({}, data, {
            filter_button_text: this.getLang('filter.numbers.filter_button_text'),
            reset_button_text: this.getLang('filter.numbers.reset_button_text'),
            number_placeholder: this.getLang('filter.numbers.number_placeholder', 'Number')
        })

        data.scopeName = scopeName

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(this.getPopoverNumberTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
        })
    }

    FilterWidget.prototype.displayPopoverNumberRange = function ($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        data = $.extend({}, data, {
            filter_button_text: this.getLang('filter.numbers.filter_button_text'),
            reset_button_text: this.getLang('filter.numbers.reset_button_text'),
            min_placeholder: this.getLang('filter.numbers.min_placeholder', 'Min'),
            max_placeholder: this.getLang('filter.numbers.max_placeholder', 'Max')
        })

        data.scopeName = scopeName

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(this.getPopoverNumberRangeTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
        })
    }


    FilterWidget.prototype.initNumberInputs = function (isRange) {
        var self = this,
            scopeData = this.$activeScope.data('scope-data'),
            $inputs = $('.field-number input', '#controlFilterPopoverNum'),
            data = this.scopeValues[this.activeScopeName]

        if (!data) {
            data = {
                numbers: isRange ? (scopeData.numbers ? scopeData.numbers : []) : (scopeData.number ? [scopeData.number] : [])
            }
        }

        $inputs.each(function (index, numberinput) {
            var defaultValue = ''

            if (0 <= index && index < data.numbers.length) {
                defaultValue = data.numbers[index] ? data.numbers[index] : ''
            }

            numberinput.value = '' !== defaultValue ? defaultValue : '';
        })
    }

    FilterWidget.prototype.updateScopeNumberSetting = function ($scope, numbers) {
        var $setting = $scope.find('.filter-setting'),
            numberRegex =/\d*/,
            reset = false

        if (numbers && numbers.length) {
            numbers[0] = numbers[0] && numbers[0].match(numberRegex) ? numbers[0] : null

            if (numbers.length > 1) {
                numbers[1] = numbers[1] && numbers[1].match(numberRegex) ? numbers[1] : null

                if(numbers[0] || numbers[1]) {
                    var min = numbers[0] ? numbers[0] : '∞',
                        max = numbers[1] ? numbers[1] : '∞'

                    $setting.text(min + ' → ' + max)
                } else {
                    reset = true
                }
            }
            else if(numbers[0]) {
                $setting.text(numbers[0])
            } else {
                reset = true
            }
        }
        else {
            reset = true
        }

        if(reset) {
            $setting.text(this.getLang('filter.numbers.all', 'all'));
            $scope.removeClass('active')
        } else {
            $scope.addClass('active')
        }
    }

    FilterWidget.prototype.filterByNumber = function (isReset) {
        var self = this,
            numbers = []

        if (!isReset) {
            var numberinputs = $('.field-number input', '#controlFilterPopoverNum')
            numberinputs.each(function (index, numberinput) {
                var number = $(numberinput).val()
                numbers.push(number)
            })
        }

        this.updateScopeNumberSetting(this.$activeScope, numbers);
        this.scopeValues[this.activeScopeName] = {
            numbers: numbers
        }
        this.isActiveScopeDirty = true;
        this.$activeScope.data('oc.popover').hide()
    }


}(window.jQuery);
