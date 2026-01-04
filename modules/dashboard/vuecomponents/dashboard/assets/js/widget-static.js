Vue.component('dashboard-component-dashboard-widget-static', {
    extends: Vue.options.components['dashboard-component-dashboard-widget-base'],
    data: function () {
        return {
        }
    },
    computed: {
        loadedValue: function () {
            return this.fullWidgetData ? this.fullWidgetData : undefined;
        },
    },
    methods: {
        getRequestDimension: function () {
            return 'none';
        },

        getRequestMetrics: function () {
            return [];
        },

        useCustomData: function () {
            return true;
        },

        makeDefaultConfigAndData: function () {
            let defaultTitle = 'My Custom Widget';

            if (this.loadedValue && this.loadedValue.properties) {
                const titleProp = this.loadedValue.properties.find((p) => p.property === 'title');

                // Apply the default title from loaded properties if it exists
                if (titleProp && titleProp.default) {
                    defaultTitle = titleProp.default;
                }
            }

            Vue.set(this.widget.configuration, 'title', defaultTitle);
        },

        getSettingsConfiguration: function () {
            return this.loadedValue && this.loadedValue.properties;
        }
    },
    template: '#dashboard_vuecomponents_dashboard_widget_static'
});
