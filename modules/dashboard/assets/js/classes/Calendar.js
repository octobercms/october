/**
 * Dashboard_Classes_Calendar
 */
class Dashboard_Classes_Calendar
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
                [oc.lang.get('dashboard.range_today')]: [moment(), moment()],
                [oc.lang.get('dashboard.range_this_week')]: [moment().isoWeekday(1), moment()],
                // [oc.lang.get('dashboard.range_yesterday')]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                // [oc.lang.get('dashboard.range_last_7_days')]: [moment().subtract(6, 'days'), moment()],
                // [oc.lang.get('dashboard.range_last_30_days')]: [moment().subtract(29, 'days'), moment()],
                [oc.lang.get('dashboard.range_this_month')]: [moment().startOf('month'), moment().endOf('month')],
                // [oc.lang.get('dashboard.range_last_month')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                [oc.lang.get('dashboard.range_this_quarter')]: [moment().startOf('quarter'), moment()],
                [oc.lang.get('dashboard.range_this_year')]: [moment().startOf('year'), moment()],
            }
        })
    }
}
