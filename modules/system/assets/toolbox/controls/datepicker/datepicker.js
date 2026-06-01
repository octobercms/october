import { ControlBase } from 'larajax';

/*
 * DatePicker plugin
 *
 * Data attributes:
 * - data-control="datepicker" - enables the datepicker plugin
 *
 * JavaScript API:
 * oc.fetchControl(element, 'datepicker')
 *
 * Dependencies:
 * - Pikaday plugin (pikaday.js)
 * - Pikaday jQuery addon (pikaday.jquery.js)
 * - Clockpicker plugin (jquery-clockpicker.js)
 * - Moment library (moment.js)
 * - Moment Timezone library (moment.timezone.js)
 */
export default class DatePickerControl extends ControlBase {
    init() {
        // Apply defaults to config
        this.config = Object.assign({
            minDate: null,
            maxDate: null,
            format: null,
            yearRange: 10,
            disableDays: null,
            firstDay: 0,
            twelveHour: false,
            showWeekNumber: false,
            hoursOnly: false
        }, this.config);

        this.dbDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
        this.dbDateFormat = 'YYYY-MM-DD';
        this.dbTimeFormat = 'HH:mm:ss';
    }

    connect() {
        this.$el = $(this.element);
        this.$dataLocker = $('[data-datetime-value]', this.$el);
        this.$datePicker = $('[data-datepicker]', this.$el);
        this.$timePicker = $('[data-timepicker]', this.$el);
        this.hasDate = !!this.$datePicker.length;
        this.hasTime = !!this.$timePicker.length;
        this.ignoreTimezone = !!this.element.hasAttribute('data-ignore-timezone');
        this.defaultTimeMidnight = !!this.element.hasAttribute('data-default-time-midnight');
        this.disabledDays = this.config.disableDays || [];

        if (oc.changeMonitor) {
            oc.changeMonitor.disable();
        }

        this.initRegion();

        if (this.hasDate) {
            this.initDatePicker();
        }

        if (this.hasTime) {
            this.initTimePicker();
        }

        if (oc.changeMonitor) {
            oc.changeMonitor.enable();
        }

        this.$timePicker.on('change.oc.datepicker', this.proxy(this.onChangePicker));
        this.$datePicker.on('change.oc.datepicker', this.proxy(this.onChangePicker));
        oc.Events.on(this.element, 'trigger:disable', this.proxy(this.checkPickerStates));

        this.checkPickerStates();
    }

    disconnect() {
        this.$timePicker.off('change.oc.datepicker', this.proxy(this.onChangePicker));
        this.$datePicker.off('change.oc.datepicker', this.proxy(this.onChangePicker));
        oc.Events.off(this.element, 'trigger:disable', this.proxy(this.checkPickerStates));

        this.$el = null;
        this.$dataLocker = null;
        this.$datePicker = null;
        this.$timePicker = null;
    }

    onChangePicker(event) {
        if (!$.trim($(event.target).val())) {
            this.emptyValues();
        }
        else {
            this.onSetLockerValue();
        }
    }

    checkPickerStates() {
        this.dateIsEnabled = !this.$datePicker.attr('readonly') && !this.$datePicker.attr('disabled');
        this.timeIsEnabled = !this.$timePicker.attr('readonly') && !this.$timePicker.attr('disabled');
        var dateBound = !!this.$datePicker.data('pickerBound'),
            timeBound = !!this.$timePicker.data('pickerBound');

        if (!this.dateIsEnabled && dateBound) {
            this.$datePicker.pikaday('destroy');
            this.$datePicker.data('pickerBound', false);
        }
        else if (this.dateIsEnabled && !dateBound) {
            this.initDatePicker();
        }

        if (!this.timeIsEnabled && timeBound) {
            this.$timePicker.clockpicker('remove');
            this.$timePicker.data('pickerBound', false);
        }
        else if (this.timeIsEnabled && !timeBound) {
            this.initTimePicker();
        }
    }

    onSetLockerValue() {
        var dateValue = this.getDatePickerValue();

        var timeValue = this.getTimePickerValue();

        var momentObj = moment
            .tz(dateValue + ' ' + timeValue, this.dbDateTimeFormat, this.timezone)
            .tz(this.appTimezone);

        var lockerValue = momentObj.format(this.dbDateTimeFormat);

        this.$dataLocker.val(lockerValue);
    }

    //
    // Datepicker
    //

    initDatePicker() {
        var dateFormat = this.getDateFormat(),
            now = moment().tz(this.timezone).format(dateFormat);

        var pikadayOptions = {
            yearRange: this.config.yearRange,
            firstDay: this.config.firstDay,
            showWeekNumber: this.config.showWeekNumber,
            format: dateFormat,
            setDefaultDate: now,
            keyboardInput: false,
            disableDayFn: (date) => {
                return this.isDateDisabled(date);
            },
            onOpen: function() {
                var $field = $(this._o.trigger)

                $(this.el).css({
                    left: 'auto',
                    right: $(window).width() - $field.offset().left - $field.outerWidth()
                })
            }
        }

        var lang = this.getLang('datepicker', false);
        if (lang) {
            pikadayOptions.i18n = lang;
        }

        this.$datePicker.val(this.getDataLockerValue(dateFormat));

        if (this.config.minDate) {
            pikadayOptions.minDate = new Date(this.config.minDate);
        }

        if (this.config.maxDate) {
            pikadayOptions.maxDate = new Date(this.config.maxDate);
        }

        this.$datePicker.pikaday(pikadayOptions);
        this.$datePicker.data('pickerBound', true);
    }

    isDateDisabled(date) {
        if (!Array.isArray(this.disabledDays)) {
            return false;
        }

        const parsedDate = moment(date, this.getDateFormat());
        const compareDate = parsedDate.format('YYYY-MM-DD');

        for (const disabledDay of this.disabledDays) {
            if (parsedDate.day() === disabledDay) {
                return true;
            }

            if (disabledDay === compareDate) {
                return true;
            }
        }

        return false;
    }

    // Returns in user preference timezone
    getDatePickerValue() {
        var value = this.$datePicker.val();

        if (!this.hasDate || !value) {
            return moment.tz(this.appTimezone)
                .tz(this.timezone)
                .format(this.dbDateFormat);
        }

        return moment(value, this.getDateFormat()).format(this.dbDateFormat);
    }

    getDateFormat() {
        var format = 'YYYY-MM-DD';

        if (this.config.format) {
            format = this.config.format;
        }
        else if (this.locale) {
            format = moment()
                .locale(this.locale)
                .localeData()
                .longDateFormat('l');
        }

        return format;
    }

    //
    // Timepicker
    //

    initTimePicker() {
        this.$timePicker.clockpicker({
            autoclose: 'true',
            placement: 'auto',
            align: 'right',
            twelvehour: this.isTimeTwelveHour(),
            afterDone: this.proxy(this.onChangeTimePicker),
            afterHourSelect: this.proxy(this.onAfterHourSelect)
        });

        this.$timePicker.val(this.getDataLockerValue(this.getTimeFormat()));
        this.$timePicker.data('pickerBound', true);
    }

    // Trigger a change event when the time is changed,
    // to allow dependent fields to refresh
    onChangeTimePicker() {
        this.$timePicker.trigger('change');
    }

    // Trigger a change event when the hour is selected
    onAfterHourSelect() {
        if (this.config.hoursOnly) {
            var clockpickerInstance = this.$timePicker.data('clockpicker');

            var selectedHour = clockpickerInstance.hours;
            var formattedHour = this.isTimeTwelveHour()
                ? (selectedHour < 10 ? '0' + selectedHour : selectedHour) + ' ' + clockpickerInstance.amOrPm
                : (selectedHour < 10 ? '0' + selectedHour : selectedHour);

            this.$timePicker.val(formattedHour);
            this.$timePicker.trigger('change');
            clockpickerInstance.hide();
        }
    }

    // Returns in user preference timezone
    getTimePickerValue() {
        var value = this.$timePicker.val();

        if (!this.hasTime || !value) {
            if (this.defaultTimeMidnight) {
                return '00:00:00';
            }

            return moment.tz(this.appTimezone)
                .tz(this.timezone)
                .format(this.dbTimeFormat);
        }

        return moment(value, this.getTimeFormat()).format(this.dbTimeFormat);
    }

    getTimeFormat() {
        if (this.config.hoursOnly) {
            return this.isTimeTwelveHour() ? 'hh A' : 'HH';
        }
        return this.isTimeTwelveHour()
            ? 'hh:mm A'
            : 'HH:mm';
    }

    isTimeTwelveHour() {
        return this.config.twelveHour;
    }

    //
    // Utilities
    //

    emptyValues() {
        this.$dataLocker.val('');
        this.$datePicker.val('');
        this.$timePicker.val('');
    }

    getDataLockerValue(format) {
        var value = this.$dataLocker.val();

        return value
            ? this.getMomentLoadValue(value, format)
            : null;
    }

    getMomentLoadValue(value, format) {
        var momentObj = moment.tz(value, this.appTimezone);

        if (this.locale) {
            momentObj = momentObj.locale(this.locale);
        }

        momentObj = momentObj.tz(this.timezone);

        return momentObj.format(format);
    }

    initRegion() {
        this.locale = $('meta[name="backend-locale"]').attr('content');
        this.timezone = $('meta[name="backend-timezone"]').attr('content');
        this.appTimezone = $('meta[name="app-timezone"]').attr('content');

        if (!this.appTimezone) {
            this.appTimezone = 'UTC';
        }

        if (!this.timezone) {
            this.timezone = 'UTC';
        }

        // Set both timezones to UTC to disable converting between them
        if (this.ignoreTimezone) {
            this.appTimezone = 'UTC';
            this.timezone = 'UTC';
        }
    }

    getLang(name, defaultValue) {
        if ($.oc === undefined || $.oc.lang === undefined) {
            return defaultValue;
        }

        return $.oc.lang.get(name, defaultValue);
    }
}
