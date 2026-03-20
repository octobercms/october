export default {
    props: {
        component: Object
    },
    computed: {
        isInspectable: function computeIsInspectable() {
            if (this.component.inspectorEnabled) {
                return true;
            }
        },

        componentIcon: function computeComponentIcon() {
            return this.component.icon;
        },

        inspectorTitle: function computeInspectorTitle() {
            if (!this.component.inspectorEnabled) {
                return null;
            }

            return this.component.title;
        },

        inspectorDescription: function computeInspectorDescription() {
            if (!this.component.inspectorEnabled) {
                return null;
            }

            return this.component.description;
        },

        inspectorConfig: function computeInspectorConfig() {
            if (!this.component.inspectorEnabled) {
                return null;
            }

            return this.component.propertyConfig;
        },

        inspectorClass: function computeInspectorClass() {
            if (!this.component.inspectorEnabled) {
                return null;
            }

            return this.component.className;
        }
    },
    methods: {
        onInspectorHidden: function onInspectorHidden(ev) {
            var values = this.$refs.component_properties.value;
            this.component.propertyValues = values;

            values = JSON.parse(values);
            this.component.alias = values['oc.alias'];
            this.$emit('inspectorhidden');
        },

        onInspectorHiding: function onInspectorHiding(ev, values) {
            this.$emit('inspectorhiding', { ev: ev, values: values });
        },

        onInspectorShowed: function onInspectorShowed() {
            this.$emit('inspectorshowed');
        }
    },
    mounted: function mounted() {
        $(this.$el).on('hidden.oc.inspector', this.onInspectorHidden);
        $(this.$el).on('showed.oc.inspector', this.onInspectorShowed);
        $(this.$el).on('hiding.oc.inspector', this.onInspectorHiding);
    },
    beforeUnmount: function beforeUnmount() {
        $(this.$el).off('hidden.oc.inspector', this.onInspectorHidden);
        $(this.$el).off('showed.oc.inspector', this.onInspectorShowed);
        $(this.$el).off('hiding.oc.inspector', this.onInspectorHiding);
    }
};
