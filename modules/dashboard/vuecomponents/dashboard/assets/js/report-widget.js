(function () {

const dashboardSizing = Dashboard_Classes_Sizing.instance();
const dashboardDragging = Dashboard_Classes_Dragging.instance();

Vue.component('dashboard-component-dashboard-report-widget', {
    props: {
        widget: Object,
        store: Object,
        row: Object,
        rows: Array,
        widgetIndexInRow: Number,
        rowIndex: Number
    },
    data: function () {
        return {
            loadingPromises: [],
            loading: true,
            autoUpdating: false,
            error: false,
            noData: false,
            menuItems: [],
            autoUpdateTimerId: null,

            // Resizing
            columnsAvailableForWidget: null,
            columnWidth: null,
            initialWidth: null,
            initialHandlePos: null
        }
    },
    methods: {
        cancelLoading: function () {
            this.loadingPromises.forEach(function (promise) {
                if (promise.isPending()) {
                    promise.cancel();
                }
            })
        },
        hasActiveLoadingPromise: function () {
            return this.loadingPromises.filter(function (promise) {
                return promise.isPending();
            }).length > 0;
        },
        load: function (resetCache) {
            const widgetImplementation = this.$refs.widgetImplementation;
            if (!widgetImplementation) {
                return;
            }

            if (!widgetImplementation.useCustomData() && !widgetImplementation.isConfigured) {
                return;
            }

            this.stopAutoUpdate();

            const extraData = widgetImplementation.getRequestExtraData();

            this.cancelLoading();
            this.loading = true;
            this.error = false;
            const range = this.store.state.range;
            const widgetConfiguration = $.oc.vueUtils.getCleanObject(this.widget.configuration);
            widgetImplementation.extendConfigurationBeforeDataFetch(widgetConfiguration);
            let compare = this.store.state.compareMode;
            if (compare === 'none') {
                compare = undefined;
            }

            aggregationInterval = widgetImplementation.getRequestInterval(range.interval);

            let loadingPromise = null;
            if (widgetConfiguration.type === 'static') {
                loadingPromise = this.store.dataSource.loadStaticContent(
                    this.store.state.range,
                    aggregationInterval,
                    widgetConfiguration,
                    resetCache ? 1 : 0,
                    extraData,
                    compare
                );
            }
            else if (!widgetImplementation.useCustomData()) {
                loadingPromise = this.store.dataSource.loadData(
                    this.store.state.range,
                    aggregationInterval,
                    widgetImplementation.getRequestDimension(),
                    widgetImplementation.getRequestMetrics(),
                    widgetConfiguration,
                    resetCache ? 1 : 0,
                    extraData,
                    compare
                );
            }
            else {
                loadingPromise = this.store.dataSource.loadCustomData(
                    this.store.state.range,
                    aggregationInterval,
                    widgetConfiguration,
                    resetCache ? 1 : 0,
                    extraData,
                    compare
                );
            }

            this.loadingPromises.push(loadingPromise);

            loadingPromise
                .then((data) => {
                    this.applyData(data);
                    if (widgetConfiguration.auto_update) {
                        this.startAutoUpdate();
                    }
                }).finally(() => {
                    this.autoUpdating = false;
                    this.loading = this.hasActiveLoadingPromise();
                    this.showInspectorWhenLoaded();
                }).catch((err) => {
                    console.error(err)
                    this.error = true;
                });
        },
        applyData: function (data) {
            const state = this.store.state;
            const dashboard = this.store.getCurrentDashboard();
            const dashboardKey = dashboard._unique_key;
            if (dashboardKey === undefined) {
                throw new Error("Dashboard unique key is undefined");
            }

            if (state.widgetData[dashboardKey] === undefined) {
                Vue.set(state.widgetData, dashboardKey, {});
            }

            Vue.set(state.widgetData[dashboardKey], this.widget._unique_key, data);
        },
        makeMenuItems: function () {
            const widgetImplementation = this.$refs.widgetImplementation;
            this.menuItems = [];
            if (widgetImplementation) {
                this.menuItems.push({
                    type: 'text',
                    command: 'configure',
                    label: oc.lang.get('dashboard.configure')
                });
            }

            this.menuItems.push({
                type: 'text',
                command: 'delete',
                label: oc.lang.get('dashboard.delete')
            });
        },
        showInspectorWhenLoaded() {
            if (this.systemFlags && this.systemFlags.needsConfiguration) {
                this.store.unsetSystemDataFlag(this.widget, 'needsConfiguration');
                const widgetImplementation = this.$refs.widgetImplementation;

                if (widgetImplementation) {
                    widgetImplementation.makeDefaultConfigAndData();

                    this.showInspector();
                }
            }
        },
        showInspector: function () {
            const dataHolder = this.widget.configuration;
            const widgetImplementation = this.$refs.widgetImplementation;

            dataHolder['_dash_definition'] = this.store.getCurrentDashboard().code;

            oc.vueComponentHelpers.inspector.host
                .showModal(
                    oc.lang.get('dashboard.configure'),
                    dataHolder,
                    widgetImplementation.getSettingsConfiguration(),
                    'widget-configuration',
                    {
                        handlerAlias: this.store.state.alias,
                        buttonText: oc.lang.get('dashboard.apply'),
                        resizableWidth: true
                    }
                )
                .then($.noop, $.noop);
        },
        isComponentRegistered: function(componentName) {
            return !!Vue.options.components[componentName];
        },
        isKnownWidgetType: function(widgetType) {
            return [
                'static',
                'indicator',
                'chart',
                'table',
                'notice',
                'section-title',
                'widget'
            ].includes(widgetType);
        },
        startAutoUpdate: function() {
            this.autoUpdateTimerId = setTimeout(() => {
                this.autoUpdating = true;
                this.load();
            }, 1000);
        },
        stopAutoUpdate: function() {
            if (this.autoUpdateTimerId !== null) {
                clearTimeout(this.autoUpdateTimerId);
                this.autoUpdateTimerId = null;
            }
        },
        onHandleMouseDown: function(ev) {
            this.columnsAvailableForWidget = dashboardSizing.calculateColumnsAvailableForWidget(
                this.row.widgets,
                this.widgetIndexInRow
            );

            const rowElement = $(this.$el).closest('[data-report-row]').get(0);
            this.columnWidth = dashboardSizing.calculateColumnWidth(rowElement);
            this.initialWidth = this.widget.width;
            this.initialHandlePos = $(this.$refs.resizeHandle).offset().left;

            $(document.body).addClass('reportwidget-resize');

            document.addEventListener('mousemove', this.onHandleMouseMove, { passive: true });
            document.addEventListener('mouseup', this.onHandleMouseUp);
        },
        onHandleMouseMove: function(ev) {
            if (ev.buttons != 1) {
                // Handle the case when the button was released
                // outside of the viewport. mouseup doesn't fire
                // in that case.
                //
                this.onHandleMouseUp();
            }

            const delta = ev.pageX - this.initialHandlePos;
            const sign = delta < 0 ? -1 : 1;
            const deltaInColumns = Math.floor(Math.abs(delta) / this.columnWidth) * sign;

            if (Math.abs(deltaInColumns) > 0) {
                const newWidth = Math.min(this.columnsAvailableForWidget, Math.max(dashboardSizing.minWidth, this.initialWidth + deltaInColumns));
                this.row.widgets[this.widgetIndexInRow].width = newWidth;

                Vue.nextTick(() => {
                    this.initialHandlePos = $(this.$refs.resizeHandle).offset().left;
                    this.initialWidth = newWidth;
                });
            }

        },
        onHandleMouseUp: function () {
            document.removeEventListener('mousemove', this.onHandleMouseMove, { passive: true });
            document.removeEventListener('mouseup', this.onHandleMouseUp);

            $(document.body).removeClass('reportwidget-resize');
        },
        onDragStart: function (ev) {
            if (this.loading || !this.store.state.editMode) {
                ev.preventDefault();
                return;
            }

            dashboardDragging.onDragStart(ev, this.widget, this.widgetIndexInRow, this.rows, this.row);
        },
        onDragOver: function (ev) {
            dashboardDragging.onDragOverWidget(ev, this.widgetIndexInRow, this.row);
        },
        onDragEnd: function (ev) {
            dashboardDragging.onDragEnd(ev, this.rows);
        },
        onDrop: function (ev) {
            dashboardDragging.onDrop(ev);
        },
        onClick: function (ev) {
            if (this.store.state.editMode) {
                ev.preventDefault();
            }
        },
        onContextMenu: function (ev) {
            this.makeMenuItems();
            ev.preventDefault();
            this.$refs.menu.showMenu(ev);
        },
        onMenuItemCommand: function (command) {
            if (command === 'configure') {
                this.showInspector();
                return;
            }

            if (command === 'delete') {
                this.row.widgets.splice(this.widgetIndexInRow, 1);
                return;
            }
        },
    },
    computed: {
        loadedValue: function () {
            return this.store.getWidgetDataForDashboard(
                this.store.getCurrentDashboard(),
                this.widget._unique_key
            );
        },

        systemFlags: function () {
            return this.store.state.systemDataFlags[this.widget._unique_key];
        },

        configuration: function () {
            return this.widget.configuration;
        },

        width: function () {
            if (this.isFrameless) {
                return dashboardSizing.totalColumns;
            }

            return this.widget.width;
        },

        isFrameless: function () {
            return this.widget.configuration.type === 'section-title';
        },

        cssClass: function () {
            let result = [
                'fixed-width-' + this.width
            ];

            if (this.store.state.editMode) {
                result.push('edit-mode');
            }

            if (this.systemFlags && this.systemFlags.dragged) {
                result.push('dragged')
            }

            if (this.isFrameless) {
                result.push('frameless');
            }

            return result;
        },

        editMode: function () {
            return this.store.state.editMode;
        },

        rangeInterval: function () {
            return this.store.state.range.dateStart +
                this.store.state.range.dateEnd +
                this.store.state.compareMode;
        },

        rangeGroupInterval: function () {
            return this.store.state.range.interval;
        }
    },
    mounted: function mounted() {
        // Widgets are dragged together with their data.
        // No need to reload the widget if its data is
        // already loaded.
        if (this.loadedValue === undefined) {
            this.load();
        }
        else {
            this.showInspectorWhenLoaded();
            this.loading = false;
        }
    },
    beforeDestroy: function beforeDestroy() {
        this.stopAutoUpdate();
    },
    watch: {
        configuration: {
            handler(newVal, oldVal) {
                const widgetImplementation = this.$refs.widgetImplementation;
                widgetImplementation.onConfigurationUpdated();

                this.load();
            },
            deep: true
        },

        rangeInterval: function () {
            if (!this.loading) {
                this.load();
            }
        },

        rangeGroupInterval: function () {
            const widgetImplementation = this.$refs.widgetImplementation;
            if (widgetImplementation.reloadOnGroupIntervalChange()) {
                this.load();
            }
        }
    },
    template: '#dashboard_vuecomponents_dashboard_report_widget'
});

})();
