'use strict';

/**
 * Calendar class for dashboard date range picker.
 */
export default class Calendar
{
    constructor(element, locale) {
        this.element = element;
        this.locale = locale;

        const start = moment().subtract(29, 'days');
        const end = moment();

        $(this.element).daterangepicker({
            startDate: start,
            endDate: end,
            opens: 'left',
            alwaysShowCalendars: true,
            ranges: {
                [oc.t("Today")]: [moment(), moment()],
                [oc.t("This week")]: [moment().isoWeekday(1), moment()],
                // [oc.t("Yesterday")]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                // [oc.t("Last 7 days")]: [moment().subtract(6, 'days'), moment()],
                // [oc.t("Last 30 days")]: [moment().subtract(29, 'days'), moment()],
                [oc.t("This month")]: [moment().startOf('month'), moment().endOf('month')],
                // [oc.t("Last month")]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                [oc.t("This quarter")]: [moment().startOf('quarter'), moment()],
                [oc.t("This year")]: [moment().startOf('year'), moment()],
            }
        })
    }
}
