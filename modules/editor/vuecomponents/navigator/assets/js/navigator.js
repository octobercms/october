import { DocumentUri } from '../../../../assets/js/editor.documenturi.js';
import { EditorCommand } from '../../../../assets/js/editor.command.js';

export default {
    props: {
        store: Object,
        readonly: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        navigatorNodeKeyChanged: function navigatorNodeKeyChanged(oldValue, newValue) {
            this.$refs.treeView.nodeKeyChanged(oldValue, newValue);
        },

        openTabs: function openTabs(tabs) {
            var that = this,
                result = [];
            tabs.forEach(function(tabKey) {
                if (that.openDocument(tabKey)) {
                    result.push(tabKey);
                }
            });

            return result;
        },

        openDocument: function openDocument(documentUriStr) {
            var nodeData = this.store.findNavigatorNode(documentUriStr);
            if (nodeData) {
                this.emitNodeClick(nodeData);
                return true;
            }

            return false;
        },

        emitNodeClick: function emitNodeClick(nodeData) {
            var uri = DocumentUri.parse(nodeData.uniqueKey);

            var cmd = uri.namespace + ':' + 'navigator-selected';

            this.store.dispatchCommand(cmd, nodeData);
        },

        reveal: function reveal(uniqueKey) {
            this.$refs.treeView.revealNode(uniqueKey);
        },

        showQuickAccess: function showQuickAccess() {
            this.$refs.treeView.showQuickAccess();
        },

        onNodeClick: function onNodeClick(ev) {
            this.emitNodeClick(ev.treeviewData.nodeData);
        },

        onNodeDrop: function onNodeDrop(ev) {
            var uri = DocumentUri.parse(ev.movedToNode.uniqueKey),
                cmd = new EditorCommand(uri.namespace + ':' + 'navigator-node-moved', {
                    movedNodes: ev.movedNodes,
                    movedToNodeData: ev.movedToNode,
                    event: ev
                });

            this.store.dispatchCommand(cmd);
        },

        onExternalDrop: function onExternalDrop(dropData) {
            var uri = DocumentUri.parse(dropData.toUniqueKey),
                cmd = new EditorCommand(uri.namespace + ':' + 'navigator-external-drop', dropData);

            this.store.dispatchCommand(cmd);
        },

        onCommand: function onCommand(cmd, keyPath, node) {
            this.store.dispatchCommand(cmd, { keyPath: keyPath, treeNode: node });
        },

        onNodeContextMenuDisplay: function onNodeContextMenuDisplay(nodeData, menuItems, itemsDetails) {
            var uri = DocumentUri.parse(nodeData.uniqueKey, true);

            if (!uri) {
                return;
            }

            var cmd = uri.namespace + ':' + 'navigator-context-menu-display';
            this.store.dispatchCommand(cmd, {
                nodeData: nodeData,
                menuItems: menuItems,
                itemsDetails: itemsDetails
            });
        },

        onCreateMenuItemCommand: function onCreateMenuItemCommand(cmd) {
            this.store.dispatchCommand(cmd);
        }
    },
    mounted: function mounted() {},
    computed: {}
};
