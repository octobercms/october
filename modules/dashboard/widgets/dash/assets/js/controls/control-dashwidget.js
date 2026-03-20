import { ControlBase, registerControl } from 'larajax';
import DashStore from '../classes/dash-store.js';

registerControl('dashwidget', class extends ControlBase
{
    connect() {
        this.universalDateFormat = 'YYYY-MM-DD';
        this.vueElement = this.element.querySelector('[data-vue-template]');
        this.store = this.createStore();

        this.initDefaultQueryParameters();
        this.setIntervalRange();
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
            return;
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

        // Set defaults from dashboard configuration
        const requiredQueryParams = {
            start: this.resolveRangeKeyword(this.store.state.defaultStart),
            end: this.resolveRangeKeyword(this.store.state.defaultEnd),
            interval: this.store.state.defaultInterval,
            compare: this.store.state.defaultCompare
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
    }

    setIntervalRange() {
        let dateStart, dateEnd, interval, compareMode;

        if (this.store.state.showInterval) {
            dateStart = moment(this.store.getQueryParam('start'), this.universalDateFormat, true);
            dateEnd = moment(this.store.getQueryParam('end'), this.universalDateFormat, true);
            interval = this.store.getQueryParam('interval');
            compareMode = this.store.getQueryParam('compare');
        }
        else {
            dateStart = moment(this.resolveRangeKeyword(this.store.state.defaultStart), this.universalDateFormat, true);
            dateEnd = moment(this.resolveRangeKeyword(this.store.state.defaultEnd), this.universalDateFormat, true);
            interval = this.store.state.defaultInterval;
            compareMode = this.store.state.defaultCompare;
        }

        this.store.state.range.dateStart = dateStart.format(this.universalDateFormat);
        this.store.state.range.dateEnd = dateEnd.format(this.universalDateFormat);
        this.store.state.range.interval = interval;
        this.store.state.intervalName = this.makeIntervalName(dateStart.toDate(), dateEnd.toDate());
        this.store.state.compareMode = compareMode;
        this.store.resetData();
    }

    resolveRangeKeyword(keyword) {
        switch (keyword) {
            case 'today': return moment().format(this.universalDateFormat);
            case 'week': return moment().startOf('isoWeek').format(this.universalDateFormat);
            case 'month': return moment().startOf('month').format(this.universalDateFormat);
            case 'quarter': return moment().startOf('quarter').format(this.universalDateFormat);
            case 'year': return moment().startOf('year').format(this.universalDateFormat);
            default: return keyword;
        }
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
