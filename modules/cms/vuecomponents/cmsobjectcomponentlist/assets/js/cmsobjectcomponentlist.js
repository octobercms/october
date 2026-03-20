export default {
    props: {
        components: Array
    },
    data: function() {
        return {
            expanded: false
        };
    },
    computed: {
        storageKey: function computeStorageKey() {
            return 'cms-object-component-list-expanded';
        }
    },
    methods: {
        onToggleCollapse: function onToggleCollapse() {
            this.expanded = !this.expanded;

            if (this.expanded) {
                localStorage.setItem(this.storageKey, '1');
            }
            else {
                localStorage.removeItem(this.storageKey);
            }
        },

        onRemoveComponentClick: function onRemoveComponentClick(index) {
            this.$emit('remove', this.components[index]);
            this.components.splice(index, 1);
        },

        onInspectorHiding: function(eventData, componentIndex) {
            for (var index = 0; index < this.components.length; index++) {
                if (index == componentIndex) {
                    continue;
                }

                var alias = eventData.values.values['oc.alias'];
                if (this.components[index].alias == alias) {
                    eventData.ev.preventDefault();
                    alert('The component alias "' + alias + '" is already used.');
                    return;
                }
            }
        }
    },
    mounted: function mounted() {
        $(this.$refs.scrollable).dragScroll({
            useDrag: true,
            useNative: false,
            noScrollClasses: true
        });

        this.expanded = localStorage.getItem(this.storageKey) == '1';
    },
    beforeUnmount: function beforeUnmount() {
        $(this.$refs.scrollable).dragScroll('dispose');
    }
};
