import Calendar from '../../../../assets/js/classes/calendar.js';

export default {
    props: {
        store: Object
    },
    data: function () {
        return {
            intervalMenuItems: [],
            compareMenuItems: [],
            groupingIntervalName: '',
            compareOptionName: ''
        }
    },
    computed: {
        intervalName: function () {
            return this.store.state.intervalName;
        },

        intervals: function () {
            const intervalLabels = {
                'day': oc.t("Day"),
                'week': oc.t("Week"),
                'month': oc.t("Month"),
                'quarter': oc.t("Quarter"),
                'year': oc.t("Year")
            };
            const result = {};
            const codes = this.store.getValidIntervalCodes();
            codes.forEach((code) => {
                result[code] = intervalLabels[code] || code;
            });

            return result;
        },

        compareOptions: function() {
            const compareLabels = {
                'totals': oc.t("Compare Totals"),
                'prev-period': oc.t("Prev period"),
                'prev-year': oc.t("Same period last year"),
                'none': oc.t("Disabled")
            };
            const result = {};
            const codes = this.store.getValidCompareCodes();
            codes.forEach((code) => {
                result[code] = compareLabels[code] || code;
            });

            return result;
        },

        rangeGroupingInterval: function () {
            return this.store.state.range.interval;
        },

        compareOption: function () {
            return this.store.state.compareMode;
        }
    },
    methods: {
        getStartDateObj: function () {
            return moment(this.store.state.range.dateStart, 'YYYY-MM-DD').toDate();
        },

        setIntervalMenuItems: function () {
            this.intervalMenuItems = [];

            for (let intervalCode in this.intervals) {
                this.intervalMenuItems.push({
                    type: 'radiobutton',
                    command: intervalCode,
                    label: this.intervals[intervalCode],
                    checked: this.store.state.range.interval === intervalCode
                });
            }
        },

        setCompareMenuItems: function () {
            this.compareMenuItems = [];
            for (let optionCode in this.compareOptions) {
                this.compareMenuItems.push({
                    type: 'radiobutton',
                    command: optionCode,
                    label: this.compareOptions[optionCode],
                    checked: this.store.state.compareMode === optionCode
                });
            }
        },

        onSelectIntervalClick: function (ev) {
            this.setIntervalMenuItems();
            this.$refs.intervalMenu.showMenu(ev);
        },

        onSelectCompareClick: function (ev) {
            this.setCompareMenuItems();
            this.$refs.compareMenu.showMenu(ev);
        },

        onIntervalMenuItemCommand: function (command) {
            this.store.setIntervalState({
                interval: command
            });
        },

        getEndDateObj: function () {
            return moment(this.store.state.range.dateEnd, 'YYYY-MM-DD').toDate();
        },

        updateCalendarRange: function () {
            var pickerControl = $(this.$refs.calendarControl).data('daterangepicker');
            pickerControl.setStartDate(this.getStartDateObj());
            pickerControl.setEndDate(this.getEndDateObj());
        },

        onCompareMenuItemCommand: function (command) {
            this.store.setIntervalState({
                compare: command
            });
        },

        onApplyRange: function (ev, picker) {
            this.store.setIntervalState({
                start: picker.startDate.format('YYYY-MM-DD'),
                end: picker.endDate.format('YYYY-MM-DD')
            });
        }
    },
    mounted: function onMounted() {
        new Calendar(this.$refs.calendarControl, this.store.state.locale);
        $(this.$refs.calendarControl).on('apply.daterangepicker', this.onApplyRange);
        this.updateCalendarRange();
    },
    watch: {
        intervalName: function() {
            this.updateCalendarRange();
        },
        rangeGroupingInterval: {
            immediate: true,
            handler(value) {
                Vue.nextTick(() => {
                    const interval = this.intervals[value];
                    if (interval) {
                        this.groupingIntervalName = interval;
                    }
                })
            }
        },
        compareOption: {
            immediate: true,
            handler(value) {
                Vue.nextTick(() => {
                    const option = this.compareOptions[value];
                    if (option) {
                        this.compareOptionName = option;
                    }
                })
            }
        }
    },
    beforeUnmount: function beforeUnmount() {
    }
};
