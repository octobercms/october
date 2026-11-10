import { ControlBase, registerControl } from 'larajax';
import DashStore from '../classes/dash-store.js';

registerControl('dashwidget', class extends ControlBase
{
    connect() {
        this.universalDateFormat = 'YYYY-MM-DD';
        this.vueElement = this.element.querySelector('[data-vue-template]');
        this.store = this.createStore();

        const initialSearchParams = this.initDefaultQueryParameters();
        this.setIntervalRange(initialSearchParams);
        this.initVue();
    }

    disconnect() {
        this.store = null;
        if (this.app) {
            this.app.unmount();
        }
    }

    initVue() {
        const { app, vm } = oc.mountVueApp(this.vueElement, {
            data: () => ({
                store: this.store
            })
        });

        this.app = app;
        this.vm = vm;
    }

    createStore() {
        const initialState = this.element.querySelector('[data-vue-state=initial]').innerHTML;
        const store = new DashStore(this);
        store.setInitialState(JSON.parse(initialState));
        return store;
    }

    initDefaultQueryParameters() {
        // Skip interval parameters if interval is hidden
        if (!this.store.state.showInterval) {
            return null;
        }

        const searchParams = new URLSearchParams(window.location.search);

        // Validate and clean parameters
        if (!moment(this.store.getQueryParam('start'), this.universalDateFormat, true).isValid()) {
            searchParams.delete('start');
        }

        if (!moment(this.store.getQueryParam('end'), this.universalDateFormat, true).isValid()) {
            searchParams.delete('end');
        }

        if (!this.store.isIntervalCodeValid(this.store.getQueryParam('interval'))) {
            searchParams.delete('interval');
        }

        if (!this.store.isCompareModeValid(this.store.getQueryParam('compare'))) {
            searchParams.delete('compare');
        }

        // Resolution order: URL > sessionStorage (sticky) > dashboard configuration
        const stickyRange = this.readStickyRange();

        const requiredQueryParams = {
            start: stickyRange.start || this.resolveRangeKeyword(this.store.state.defaultStart),
            end: stickyRange.end || this.resolveRangeKeyword(this.store.state.defaultEnd, true),
            interval: stickyRange.interval || this.store.state.defaultInterval,
            compare: stickyRange.compare || this.store.state.defaultCompare
        };

        let isDirty = false;
        for (const [key, defaultValue] of Object.entries(requiredQueryParams)) {
            if (!searchParams.has(key)) {
                searchParams.append(key, defaultValue);
                isDirty = true;
            }
        }

        // Update URL if it has changed
        if (isDirty) {
            this.store.setQueryParams(searchParams);
        }

        return searchParams;
    }

    getStickyStorageKey() {
        const dashboardCode = this.store.state.dashboard && this.store.state.dashboard.code
            ? this.store.state.dashboard.code
            : this.store.state.alias;

        return 'oc.dashboard.range.' + dashboardCode;
    }

    readStickyRange() {
        try {
            const raw = window.sessionStorage.getItem(this.getStickyStorageKey());
            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw);
            const result = {};

            if (moment(parsed.start, this.universalDateFormat, true).isValid()) {
                result.start = parsed.start;
            }

            if (moment(parsed.end, this.universalDateFormat, true).isValid()) {
                result.end = parsed.end;
            }

            if (this.store.isIntervalCodeValid(parsed.interval)) {
                result.interval = parsed.interval;
            }

            if (this.store.isCompareModeValid(parsed.compare)) {
                result.compare = parsed.compare;
            }

            return result;
        }
        catch (e) {
            return {};
        }
    }

    writeStickyRange() {
        try {
            window.sessionStorage.setItem(this.getStickyStorageKey(), JSON.stringify({
                start: this.store.state.range.dateStart,
                end: this.store.state.range.dateEnd,
                interval: this.store.state.range.interval,
                compare: this.store.state.compareMode
            }));
        }
        catch (e) {
            // sessionStorage may be unavailable (private mode, quota)
        }
    }

    setIntervalRange(searchParams = null) {
        let dateStart, dateEnd, interval, compareMode;
        const getQueryParam = (name) => this.store.getQueryParam(name, searchParams);

        if (this.store.state.showInterval) {
            dateStart = moment(getQueryParam('start'), this.universalDateFormat, true);
            dateEnd = moment(getQueryParam('end'), this.universalDateFormat, true);
            interval = getQueryParam('interval');
            compareMode = getQueryParam('compare');
        }
        else {
            dateStart = moment(this.resolveRangeKeyword(this.store.state.defaultStart), this.universalDateFormat, true);
            dateEnd = moment(this.resolveRangeKeyword(this.store.state.defaultEnd, true), this.universalDateFormat, true);
            interval = this.store.state.defaultInterval;
            compareMode = this.store.state.defaultCompare;
        }

        if (!dateStart.isValid()) {
            dateStart = moment(this.resolveRangeKeyword(this.store.state.defaultStart), this.universalDateFormat, true);
        }

        if (!dateEnd.isValid()) {
            dateEnd = moment(this.resolveRangeKeyword(this.store.state.defaultEnd, true), this.universalDateFormat, true);
        }

        if (dateStart.isAfter(dateEnd)) {
            const swappedStart = dateEnd;
            dateEnd = dateStart;
            dateStart = swappedStart;
        }

        if (!this.store.isIntervalCodeValid(interval)) {
            interval = this.store.state.defaultInterval;
        }

        if (!this.store.isCompareModeValid(compareMode)) {
            compareMode = this.store.state.defaultCompare;
        }

        this.store.state.range.dateStart = dateStart.format(this.universalDateFormat);
        this.store.state.range.dateEnd = dateEnd.format(this.universalDateFormat);
        this.store.state.range.interval = interval;
        this.store.state.intervalName = this.makeIntervalName(dateStart.toDate(), dateEnd.toDate());
        this.store.state.compareMode = compareMode;
        this.store.resetData();

        if (this.store.state.showInterval) {
            this.writeStickyRange();
        }
    }

    // resolveRangeKeyword returns the first or last date of the range a keyword names, other values pass through.
    resolveRangeKeyword(keyword, isEnd = false) {
        const today = moment();
        const lastMonth = moment().subtract(1, 'month');

        const ranges = {
            'today': [today, today],
            'yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
            'last-7-days': [moment().subtract(6, 'days'), today],
            'last-30-days': [moment().subtract(29, 'days'), today],
            'month': [moment().startOf('month'), moment().endOf('month')],
            'last-month': [lastMonth.clone().startOf('month'), lastMonth.clone().endOf('month')],
            'quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
            'year': [moment().startOf('year'), moment().endOf('year')]
        };

        if (!Object.hasOwn(ranges, keyword)) {
            return keyword;
        }

        return ranges[keyword][isEnd ? 1 : 0].format(this.universalDateFormat);
    }

    makeIntervalName(startDate, endDate) {
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        let formatterWithoutYear = new Intl.DateTimeFormat(this.store.state.locale, {
            month: 'short',
            day: 'numeric'
        });

        let formatterWithYear = new Intl.DateTimeFormat(this.store.state.locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const startFormatted = startYear === endYear
            ? formatterWithoutYear.format(startDate)
            : formatterWithYear.format(startDate);

        const endFormatted = formatterWithYear.format(endDate);

        return startFormatted + ' - ' + endFormatted;
    }
});
