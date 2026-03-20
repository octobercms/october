import WidgetBase from './widget-base.js';

export default {
    extends: WidgetBase,
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
            let defaultTitle = oc.t("My Custom Widget");

            if (this.loadedValue && this.loadedValue.properties) {
                const titleProp = this.loadedValue.properties.find((p) => p.property === 'title');

                // Apply the default title from loaded properties if it exists
                if (titleProp && titleProp.default) {
                    defaultTitle = titleProp.default;
                }
            }

            // Vue 3: Direct assignment is reactive
            this.widget.configuration.title = defaultTitle;
        },

        getSettingsConfiguration: function () {
            return this.loadedValue && this.loadedValue.properties;
        }
    }
};
