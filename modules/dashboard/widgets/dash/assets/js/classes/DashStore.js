'use strict';

/**
 * Dashboard_Widgets_Dash_Classes_DashStore
 */
class Dashboard_Widgets_Dash_Classes_DashStore
{
    state = {};

    constructor(delegate) {
        this.delegate = delegate;
        this.dashHelpers = new Dashboard_Classes_Helpers;
        this.dataSource = new Dashboard_Classes_DataSource(this);

        this.state = {
            locale: '',
            alias: null,
            dashboard: null,
            colors: {},
            range: {
                dateStart: null,
                dateEnd: null,
                interval: 'day'
            },
            showInterval: true,
            intervalName: null,
            compareMode: 'none',
            editMode: false,
            canCreateAndEdit: false,
            canMakeDefault: false,
            canResetLayout: false,
            defaultWidgetConfigs: {},
            customWidgetGroups: {},
            dashboardListScrollX: null,

            widgetData: {},
            systemDataFlags: {}
        };

        this.manageUrl = null;
        this.dashboardUniqueKey = 0;
        this.dashboardBackup = null;
    }

    setInitialState(initialState) {
        this.manageUrl = initialState.manageUrl;

        this.state.alias = initialState.alias;
        this.state.locale = initialState.locale;
        this.state.colors = initialState.colors;
        this.state.showInterval = initialState.showInterval;
        this.state.canCreateAndEdit = initialState.canCreateAndEdit;
        this.state.canMakeDefault = initialState.canMakeDefault;
        this.state.canResetLayout = initialState.canResetLayout;
        this.state.defaultWidgetConfigs = initialState.defaultWidgetConfigs;
        this.state.customWidgetGroups = initialState.customWidgetGroups;
        this.setDashboard(initialState.dashboard);
    }

    setIntervalState(intervalState) {
        this.setQueryParams(intervalState);
        this.delegate.setIntervalRange();
    }

    getEventHandler(name) {
        return this.state.alias + '::' + name;
    }

    getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // setQueryParams where params can be an object or an instance of URLSearchParams
    setQueryParams(params) {
        var searchParams = params;
        if (params.constructor === {}.constructor) {
            searchParams = new URLSearchParams(window.location.search);
            for (const [key, val] of Object.entries(params)) {
                searchParams.set(key, val);
            }
        }

        var newUrl = window.location.pathname,
            queryStr = searchParams.toString();

        if (queryStr) {
            newUrl += '?' + queryStr;
        }

        if (oc.useTurbo && oc.useTurbo()) {
            oc.visit(newUrl, { action: 'swap', scroll: false });
        }
        else {
            history.replaceState(null, '', newUrl);
        }
    }

    setDashboard(dashboard) {
        this.state.dashboard = dashboard;
        this.initDashboardKey(dashboard);
    }

    initDashboardKey(dashboard) {
        dashboard._unique_key = this.dashboardUniqueKey++;
        this.dashHelpers.setUniqueKeysForDashboard(dashboard.rows);
    }

    getAvailableWidgetTypes() {
        const result = [];
        result.push({
            type: 'indicator',
            label: oc.lang.get('dashboard.widget_type_indicator')
        },
        {
            type: 'section-title',
            label: oc.lang.get('dashboard.widget_type_section_title'),
            fullWidth: true
        },
        {
            type: 'notice',
            label: oc.lang.get('dashboard.widget_type_notice'),
            fullWidth: true
        },
        {
            type: 'chart',
            label: oc.lang.get('dashboard.widget_type_chart'),
        },
        {
            type: 'table',
            label: oc.lang.get('dashboard.widget_type_table'),
        });

        return result;
    }

    getValidIntervalCodes() {
        return ['day', 'week', 'month', 'quarter', 'year'];
    }

    getValidCompareCodes() {
        return ['prev-period', 'prev-year', 'none'];
    }

    isIntervalCodeValid(code) {
        return this.getValidIntervalCodes().includes(code);
    }

    isCompareModeValid(mode) {
        return this.getValidCompareCodes().includes(mode);
    }

    getCurrentDashboard() {
        return this.state.dashboard;
    }

    setSystemDataFlag(widgetOrRow, flag, value) {
        const uniqueKey = widgetOrRow._unique_key;
        if (typeof this.state.systemDataFlags[uniqueKey] !== 'object') {
            Vue.set(this.state.systemDataFlags, uniqueKey, {});
        }

        Vue.set(this.state.systemDataFlags[uniqueKey], flag, value);
    }

    getSystemDataFlag(widgetOrRow, flag) {
        const uniqueKey = widgetOrRow._unique_key;
        if (typeof this.state.systemDataFlags[uniqueKey] !== 'object') {
            return undefined;
        }

        return this.state.systemDataFlags[uniqueKey][flag];
    }

    resetData() {
        // this.state.widgetData = {};
        this.state.systemDataFlags = {};
    }

    getWidgetDataForDashboard(dashboard, widgetKey) {
        const dashboardKey = dashboard._unique_key;
        if (dashboardKey === undefined) {
            throw new Error("Dashboard unique key is undefined");
        }

        if (this.state.widgetData[dashboardKey] === undefined) {
            return undefined;
        }

        return this.state.widgetData[dashboardKey][widgetKey];
    }

    unsetSystemDataFlag(widgetOrRow, flag) {
        const uniqueKey = widgetOrRow._unique_key;
        if (typeof this.state.systemDataFlags[uniqueKey] !== 'object') {
            return;
        }

        delete this.state.systemDataFlags[uniqueKey][flag];
    }

    startEditing() {
        this.dashboardBackup = $.oc.vueUtils.getCleanObject(this.getCurrentDashboard());
        this.state.editMode = true;
    }

    async resetLayout() {
        try {
            await oc.confirmPromise(oc.lang.get('dashboard.reset_layout_confirm'));
        }
        catch (error) {
            return;
        }

        // Request initial state again from server
        const currentDashboard = this.getCurrentDashboard();
        const response = await oc.ajax(this.getEventHandler('onResetDashboard'), {
            progressBar: true,
            data: {
                _dash_definition: currentDashboard.code
            }
        });

        this.setInitialState(response.initialState);

        oc.snackbar.show(oc.lang.get('dashboard.reset_layout_successfully'));
    }

    async makeDefault() {
        try {
            await oc.confirmPromise(oc.lang.get('dashboard.make_default_confirm'));
        }
        catch (error) {
            return;
        }

        // Submit this to server
        const currentDashboard = this.getCurrentDashboard();
        await oc.ajax(this.getEventHandler('onCommitDashboard'), {
            progressBar: true,
            data: {
                _dash_definition: currentDashboard.code,
                definition: JSON.stringify(currentDashboard.rows)
            }
        });

        oc.snackbar.show(oc.lang.get('dashboard.make_default_successfully'));
    }

    cancelEditing() {
        const currentDashboard = this.getCurrentDashboard();
        if (this.dashboardBackup && this.dashboardBackup.rows && currentDashboard) {
            Vue.set(currentDashboard, 'rows', this.dashboardBackup.rows);
        }
        this.state.editMode = false;
    }
}
