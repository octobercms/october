import Sizing from '../../../../assets/js/classes/sizing.js';
import WidgetBase from './widget-base.js';

export default {
    extends: WidgetBase,
    data: function () {
        return {
        }
    },
    computed: {
        title: function () {
            let result = this.widget.configuration.title;

            if (this.widget.configuration.showInterval) {
                result += ': ' + this.store.state.intervalName;
            }

            return result;
        }
    },
    methods: {
        makeDefaultConfigAndData: function () {
            const sizing = Sizing.instance();
            // Vue 3: Direct assignment is reactive
            this.widget.configuration.title = oc.t("Section");
            this.widget.configuration.showInterval = false;
            this.widget.configuration.width = sizing.totalColumns;
        },

        getSettingsConfiguration: function () {
            const result = [{
                property: 'title',
                title: oc.t("Title"),
                type: 'string',
                validation: {
                    required: {
                        message: oc.t("Please provide the widget title"),
                    }
                }
            }];

            result.push({
                property: 'showInterval',
                title: oc.t("Show Date Interval"),
                type: 'checkbox'
            });

            return result;
        }
    }
};
