import { ControlBase, registerControl } from 'larajax';

/*
 * DateFilter control
 *
 * Data attributes:
 * - data-control="datefilter" - enables the control on an element
 * - data-scope-data="{...}" - scope configuration for the date pickers
 *
 * JavaScript API:
 * oc.fetchControl(element, 'datefilter')
 */
registerControl('datefilter', class extends ControlBase {
    init() {
        this.dbDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
        this.dbDateFormat = 'YYYY-MM-DD';
    }

    connect() {
        this.$el = $(this.element);
        this.$pickers = $('[data-datepicker]', this.$el);

        this.initRegion();
        this.initDatePickers();
    }

    disconnect() {
        this.$el = null;
        this.$pickers = null;
    }

    initDatePickers() {
        var self = this,
            scopeData = this.config.scopeData;

        this.$pickers.each(function(index, datepicker) {
            var $datepicker = $(datepicker),
                defaultValue = self.getDatePickerValue($datepicker);

            var pikadayOptions = {
                minDate: new Date(scopeData.minDate),
                maxDate: new Date(scopeData.maxDate),
                firstDay: scopeData.firstDay,
                yearRange: scopeData.yearRange,
                showWeekNumber: scopeData.showWeekNumber,
                setDefaultDate: defaultValue !== '' ? defaultValue.toDate() : '',
                format: self.getDateFormat(),
                i18n: self.getLang('datepicker'),
                onSelect: function() {
                    self.onSelectDatePicker.call(self, this, $datepicker);
                }
            }

            if (defaultValue !== '') {
                $datepicker.val(defaultValue.format(self.getDateFormat()));
            }

            $datepicker.pikaday(pikadayOptions);
        });
    }

    onSelectDatePicker(datepicker, $input) {
        var pickerMoment = datepicker.getMoment(),
            pickerValue = pickerMoment.format(this.dbDateTimeFormat);

        // Convert from user preference to UTC
        var momentObj = moment
            .tz(pickerValue, this.dbDateTimeFormat, this.timezone)
            .tz(this.appTimezone);

        var lockerValue = momentObj.format(this.dbDateTimeFormat);

        this.setDataLocker($input, lockerValue);
    }

    getDatePickerValue($datepicker) {
        var rawValue = $datepicker.val();
        if (rawValue !== '') {
            rawValue = this.makeMoment(rawValue, this.getDateFormat());
        }

        // Look at the locker for the default value
        if (!rawValue) {
            rawValue = this.getDataLocker($datepicker)
            if (rawValue !== '') {
                rawValue = this.makeMoment(rawValue, this.dbDateFormat);
            }
        }

        return rawValue;
    }

    makeMoment(value, format) {
        if (value === 'now') {
            return moment();
        }

        return moment(value, format);
    }

    getDataLocker(picker) {
        var $picker = $(picker),
            $locker = $('#' + $picker.data('datepicker-target'));

        return $locker.val();
    }

    setDataLocker(picker, value) {
        var $picker = $(picker),
            $locker = $('#' + $picker.data('datepicker-target'));

        $locker.val(value);
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
        if (!this.config.scopeData.useTimezone) {
            this.appTimezone = 'UTC';
            this.timezone = 'UTC';
        }
    }

    getDateFormat() {
        if (this.locale) {
            return moment()
                .locale(this.locale)
                .localeData()
                .longDateFormat('l');
        }

        return this.dbDateFormat;
    }

    getLang(name, defaultValue) {
        if ($.oc === undefined || $.oc.lang === undefined) {
            return defaultValue;
        }

        return $.oc.lang.get(name, defaultValue);
    }
});
