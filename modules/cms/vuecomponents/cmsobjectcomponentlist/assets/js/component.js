import { host as inspectorHost } from '../../../../../backend/vuecomponents/inspector/assets/js/classes/index.js';

export default {
    props: {
        component: Object
    },
    computed: {
        componentIcon: function computeComponentIcon() {
            return this.component.icon;
        }
    },
    methods: {
        onComponentClick: function onComponentClick() {
            if (!this.component.inspectorEnabled) {
                return;
            }

            var dataSchema = JSON.parse(this.component.propertyConfig);
            var obj = JSON.parse(this.component.propertyValues);

            this.$emit('inspectorshowed');

            inspectorHost
                .showModal(
                    this.component.title,
                    obj,
                    dataSchema,
                    'cms-component-inspector',
                    {
                        description: this.component.description,
                        resizableWidth: true,
                        enableExternalParameterEditor: true,
                        inspectorClass: this.component.className,
                        beforeApplyCallback: (updatedObj) => {
                            return this.beforeInspectorApply(updatedObj);
                        }
                    }
                )
                .then(
                    (updatedObj) => {
                        this.onInspectorApplied(updatedObj);
                    },
                    $.noop
                )
                .finally(() => {
                    this.$emit('inspectorhidden');
                });
        },

        beforeInspectorApply: function beforeInspectorApply(updatedObj) {
            return new Promise((resolve, reject) => {
                var eventData = {
                    values: updatedObj,
                    prevented: false
                };

                this.$emit('inspectorhiding', eventData);

                if (eventData.prevented) {
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        },

        onInspectorApplied: function onInspectorApplied(updatedObj) {
            this.component.propertyValues = JSON.stringify(updatedObj);
            this.component.alias = updatedObj['oc.alias'];
        }
    }
};
