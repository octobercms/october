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

        this.initRegion()
        this.initFilterDate()
    }


    // NEW MODULE
    // =================

    FilterWidget.prototype.initFilterDate = function () {
        var self = this

        this.$el.on('show.oc.popover', 'a.filter-scope-date', function () {
            self.initDatePickers($(this).hasClass('range'))
        })

        this.$el.on('hiding.oc.popover', 'a.filter-scope-date', function () {
            self.clearDatePickers()
        })

        this.$el.on('hide.oc.popover', 'a.filter-scope-date', function () {
            var $scope = $(this)
            self.pushOptions(self.activeScopeName)
            self.activeScopeName = null
            self.$activeScope = null

            // Second click closes the filter scope
            setTimeout(function () {
                $scope.removeClass('filter-scope-open')
            }, 200)
        })

        this.$el.on('click', 'a.filter-scope-date', function () {
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
                self.displayPopoverRange($scope)
            }
            else {
                self.displayPopoverDate($scope)
            }

            $scope.addClass('filter-scope-open')
        })

        $(document).on('click', '#controlFilterPopover [data-trigger="filter"]', function (e) {
            e.preventDefault()
            e.stopPropagation()

            self.filterByDate()
        })

        $(document).on('click', '#controlFilterPopover [data-trigger="clear"]', function (e) {
            e.preventDefault()
            e.stopPropagation()

            self.filterByDate(true)
        })
    }

    /*
     * Get popover date template
     */
    FilterWidget.prototype.getPopoverDateTemplate = function () {
        return '                                                                                                        \
                <form>                                                                                                  \
                    <input type="hidden" name="scopeName" value="{{ scopeName }}" />                                    \
                    <div id="controlFilterPopover" class="control-filter-popover control-filter-date-popover">          \
                        <div class="filter-search loading-indicator-container size-input-text">                         \
                            <div class="field-datepicker">                                                              \
                                <div class="input-with-icon right-align">                                               \
                                    <i class="icon icon-calendar-o"></i>                                                \
                                    <input                                                                              \
                                        type="text"                                                                     \
                                        name="date"                                                                     \
                                        value="{{ date }}"                                                              \
                                        class="form-control align-right"                                                \
                                        autocomplete="off"                                                              \
                                        placeholder="{{ date_placeholder }}" />                                         \
                                </div>                                                                                  \
                            </div>                                                                                      \
                            <div class="filter-buttons">                                                                \
                                <button class="btn btn-block btn-secondary" data-trigger="clear">                       \
                                    {{ reset_button_text }}                                                             \
                                </button>                                                                               \
                            </div>                                                                                      \
                        </div>                                                                                          \
                    </div>                                                                                              \
                </form>                                                                                                 \
            '
    }

    /*
     * Get popover range template
     */
    FilterWidget.prototype.getPopoverRangeTemplate = function () {
        return '                                                                                                        \
                <form>                                                                                                  \
                    <input type="hidden" name="scopeName" value="{{ scopeName }}" />                                    \
                    <div id="controlFilterPopover" class="control-filter-popover control-filter-date-popover --range">  \
                        <div class="filter-search loading-indicator-container size-input-text">                         \
                            <div class="field-datepicker">                                                              \
                                <div class="input-with-icon right-align">                                               \
                                    <i class="icon icon-calendar-o"></i>                                                \
                                    <input                                                                              \
                                        type="text"                                                                     \
                                        name="date"                                                                     \
                                        value="{{ date }}"                                                              \
                                        class="form-control align-right"                                                \
                                        autocomplete="off"                                                              \
                                        placeholder="{{ after_placeholder }}" />                                        \
                                </div>                                                                                  \
                            </div>                                                                                      \
                            <div class="field-datepicker">                                                              \
                                <div class="input-with-icon right-align">                                               \
                                    <i class="icon icon-calendar-o"></i>                                                \
                                    <input                                                                              \
                                        type="text"                                                                     \
                                        name="date"                                                                     \
                                        value="{{ date }}"                                                              \
                                        class="form-control align-right"                                                \
                                        autocomplete="off"                                                              \
                                        placeholder="{{ before_placeholder }}" />                                       \
                                </div>                                                                                  \
                            </div>                                                                                      \
                            <div class="filter-buttons">                                                                \
                                <button class="btn btn-block btn-primary" data-trigger="filter">                        \
                                    {{ filter_button_text }}                                                            \
                                </button>                                                                               \
                                <button class="btn btn-block btn-secondary" data-trigger="clear">                       \
                                    {{ reset_button_text }}                                                             \
                                </button>                                                                               \
                            </div>                                                                                      \
                        </div>                                                                                          \
                    </div>                                                                                              \
                </form>                                                                                                 \
            '
    }

    FilterWidget.prototype.displayPopoverDate = function ($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        data = $.extend({}, data, {
            filter_button_text: this.getLang('filter.dates.filter_button_text'),
            reset_button_text: this.getLang('filter.dates.reset_button_text'),
            date_placeholder: this.getLang('filter.dates.date_placeholder', 'Date')
        })

        data.scopeName = scopeName

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(this.getPopoverDateTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
            onCheckDocumentClickTarget: function (target) {
                return self.onCheckDocumentClickTargetDatePicker(target)
            }
        })
    }

    FilterWidget.prototype.displayPopoverRange = function ($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        data = $.extend({}, data, {
            filter_button_text: this.getLang('filter.dates.filter_button_text'),
            reset_button_text: this.getLang('filter.dates.reset_button_text'),
            after_placeholder: this.getLang('filter.dates.after_placeholder', 'After'),
            before_placeholder: this.getLang('filter.dates.before_placeholder', 'Before')
        })

        data.scopeName = scopeName

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(this.getPopoverRangeTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
            onCheckDocumentClickTarget: function (target) {
                return self.onCheckDocumentClickTargetDatePicker(target)
            }
        })
    }

    FilterWidget.prototype.initDatePickers = function (isRange) {
        var self = this,
            scopeData = this.$activeScope.data('scope-data'),
            $inputs = $('.field-datepicker input', '#controlFilterPopover'),
            data = this.scopeValues[this.activeScopeName]

        if (!data) {
            data = {
                dates: isRange ? (scopeData.dates ? scopeData.dates : []) : (scopeData.date ? [scopeData.date] : [])
            }
        }

        $inputs.each(function (index, datepicker) {
            var defaultValue = '',
                $datepicker = $(datepicker),
                defaults = {
                    minDate: new Date(scopeData.minDate),
                    maxDate: new Date(scopeData.maxDate),
                    yearRange: 10,
                    setDefaultDate: '' !== defaultValue ? defaultValue.toDate() : '',
                    format: self.getDateFormat(),
                    i18n: self.getLang('datepicker')
                }

            if (0 <= index && index < data.dates.length) {
                defaultValue = data.dates[index] ? moment.tz(data.dates[index], self.appTimezone).tz(self.timezone) : ''
            }

            if (!isRange) {
                defaults.onSelect = function () {
                    self.filterByDate()
                }
            }

            datepicker.value = '' !== defaultValue ? defaultValue.format(self.getDateFormat()) : '';

            $datepicker.pikaday(defaults)
        })
    }

    FilterWidget.prototype.clearDatePickers = function () {
        var $inputs = $('.field-datepicker input', '#controlFilterPopover')

        $inputs.each(function (index, datepicker) {
            var $datepicker = $(datepicker)

            $datepicker.data('pikaday').destroy()
        })
    }

    FilterWidget.prototype.updateScopeDateSetting = function ($scope, dates) {
        var $setting = $scope.find('.filter-setting'),
            dateFormat = this.getDateFormat(),
            dateRegex =/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
            reset = false

        if (dates && dates.length) {
            dates[0] = dates[0] && dates[0].match(dateRegex) ? dates[0] : null

            if (dates.length > 1) {
                dates[1] = dates[1] && dates[1].match(dateRegex) ? dates[1] : null

                if(dates[0] || dates[1]) {
                    var after = dates[0] ? moment.tz(dates[0], this.appTimezone).tz(this.timezone).format(dateFormat) : '∞',
                        before = dates[1] ? moment.tz(dates[1], this.appTimezone).tz(this.timezone).format(dateFormat) : '∞'

                    $setting.text(after + ' → ' + before)
                } else {
                    reset = true
                }
            }
            else if(dates[0]) {
                $setting.text(moment.tz(dates[0], this.appTimezone).tz(this.timezone).format(dateFormat))
            } else {
                reset = true
            }
        }
        else {
            reset = true
        }

        if(reset) {
            $setting.text(this.getLang('filter.dates.all', 'all'));
            $scope.removeClass('active')
        } else {
            $scope.addClass('active')
        }
    }

    FilterWidget.prototype.filterByDate = function (isReset) {
        var self = this,
            dates = []

        if (!isReset) {
            var datepickers = $('.field-datepicker input', '#controlFilterPopover')

            datepickers.each(function (index, datepicker) {
                var date = $(datepicker).data('pikaday').toString('YYYY-MM-DD')

                if(date.match(/\d{4}-\d{2}-\d{2}/)) {
                    if (index === 0) {
                        date += ' 00:00:00'
                    } else if (index === 1) {
                        date += ' 23:59:59'
                    }

                    date = moment.tz(date, self.timezone)
                        .tz(self.appTimezone)
                        .format('YYYY-MM-DD HH:mm:ss')
                } else {
                    date = null
                }

                dates.push(date)
            })
        }

        this.updateScopeDateSetting(this.$activeScope, dates);
        this.scopeValues[this.activeScopeName] = {
            dates: dates
        }
        this.isActiveScopeDirty = true;
        this.$activeScope.data('oc.popover').hide()
    }

    FilterWidget.prototype.getDateFormat = function () {
        if (this.locale) {
            return moment()
                .locale(this.locale)
                .localeData()
                .longDateFormat('l')
        }

        return 'YYYY-MM-DD'
    }

    FilterWidget.prototype.onCheckDocumentClickTargetDatePicker = function (target) {
        var $target = $(target)

        // If the click happens on a pikaday element, do not close the popover
        return $target.hasClass('pika-next') ||
            $target.hasClass('pika-prev') ||
            $target.hasClass('pika-select') ||
            $target.hasClass('pika-button') ||
            $target.parents('.pika-table').length ||
            $target.parents('.pika-title').length
    }

    FilterWidget.prototype.initRegion = function() {
        this.locale = $('meta[name="backend-locale"]').attr('content')
        this.timezone = $('meta[name="backend-timezone"]').attr('content')
        this.appTimezone = $('meta[name="app-timezone"]').attr('content')

        if (!this.appTimezone) {
            this.appTimezone = 'UTC'
        }

        if (!this.timezone) {
            this.timezone = 'UTC'
        }
    }

}(window.jQuery);