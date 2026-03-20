import WidgetBase from './widget-base.js';

export default {
    extends: WidgetBase,
    data: function () {
        return {
        }
    },
    computed: {
    },
    methods: {
        makeDefaultConfigAndData: function () {
            // Vue 3: Direct assignment is reactive
            this.widget.configuration.title = oc.t("Text Notice");
            this.widget.configuration.notice = oc.t("This is a text notice widget.");
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
                property: 'notice',
                title: oc.t("Notice text"),
                type: 'text',
            });

            return result;
        }
    }
};
