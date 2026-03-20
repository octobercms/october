export default {
    props: {
        components: Array
    },
    data: function() {
        return {
            visible: false
        };
    },
    computed: {
        componentListNodes: function computeComponentListNodes() {
            return [
                {
                    label: 'Components',
                    uniqueKey: 'components',
                    nodes: $.oc.editor.store.getExtension('cms').componentList
                }
            ];
        }
    },
    methods: {
        show: function show() {
            if (!this.$refs.modal.isVisible) {
                this.$refs.modal.show();
            }
        },

        hide: function hide() {
            if (this.$refs.modal && this.$refs.modal.isVisible) {
                this.$refs.modal.hide();
            }
        },

        onNodeClick: function onNodeClick(ev) {
            var nodeData = ev.treeviewData.nodeData;
            if (!nodeData.userData || !nodeData.userData.componentData) {
                return;
            }

            var componentData = $.oc.vueUtils.getCleanObject(nodeData.userData.componentData);
            $.oc.editor.store.dispatchCommand('cms:add-component', componentData);
        },

        onCustomDragStart: function onCustomDragStart(ev) {
            var nodeData = ev.treeNodeData,
                componentData = JSON.stringify(nodeData.userData.componentData);

            ev.dataTransfer.setData('application/october-component', componentData);
            ev.dataTransfer.setData('text/plain', nodeData.uniqueKey);
            ev.dataTransfer.dropEffect = 'move';
            if (!/Edge/.test(navigator.userAgent)) {
                $(this.$refs.componentDragHostImageContainer).addClass('snapshot');
                ev.dataTransfer.setDragImage(this.$refs.componentDragHostImage, 0, 28);
                $(this.$refs.componentDragHostImageContainer).removeClass('snapshot');
            }
        }
    },
    mounted: function mounted() {},
    beforeUnmount: function beforeUnmount() {}
};
