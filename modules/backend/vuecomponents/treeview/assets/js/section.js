import { nextTick } from 'vue';
import { utils } from './classes/index.js';

/*
 * Vue treeview section
 */
export default {
    props: {
        uniqueKey: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        treeUniqueKey: {
            type: String,
            required: true
        },
        selectedKeys: Array,
        store: Object,
        searchQuery: String,
        menuItems: Array,
        createMenuItems: Array,
        nodes: Array,
        hideSections: Boolean,
        defaultFolderIcon: Object,
        hasApiMenuItems: {
            type: Boolean,
            default: false
        },
        userData: Object
    },
    data: function () {
        return {
            expanded: true,
            menuId: $.oc.domIdManager.generate('dropdown-menu'),
            menuButtonId: $.oc.domIdManager.generate('treeview-menu-button'),
            menuLabelId: $.oc.domIdManager.generate('treeview-menu-label'),
            contextMenuVisible: false,
            nodeRefs: []
        };
    },
    computed: {
        hasMenuItems: function computeHasMenuItems() {
            return Array.isArray(this.menuItems) && this.menuItems.length;
        },

        hasCreateMenuItems: function computeHasCreateMenuItems() {
            return Array.isArray(this.createMenuItems) && this.createMenuItems.length;
        },

        nodeMenuitems: function computeNodeMenuitems() {
            return this.menuItems;
        },

        nodeData: function computeNodeData() {
            var result = {};
            if (this.userData) {
                result = this.userData;
            }

            result.userData = this.userData;
            result.hasApiMenuItems = this.hasApiMenuItems;

            return result;
        },

        cssClass: function computeCssClass() {
            var result = '';

            if (this.expanded) {
                result += ' expanded-node';
            }
            else {
                result += ' collapsed-node';
            }

            if (!this.hideSections) {
                result += ' mode-tree';
            }

            return result;
        },

        isAriaExpanded: function computeIsExpanded() {
            // Return string, not Boolean.
            //
            return this.expanded ? 'true' : 'false';
        },

        groupedNodes: function computeGroupedNodes() {
            return utils.groupSectionNodes(this.nodes, this.defaultFolderIcon);
        },

        filteredNodes: function computeFilteredNodes() {
            // Instead of returning an updated tree containing
            // only nodes satisfying the search criteria, we
            // mark nodes as visible or invisible. Thus the
            // tree displays the same objects and we don't need
            // to worry about synchronizing two copies of the
            // node tree.
            //

            utils.applyNodeSearch(this.groupedNodes, this.searchQuery);

            return this.groupedNodes;
        },

        hasVisibleNodes: function hasVisibleNodes() {
            if (!this.searchQuery.length) {
                // Display empty sections if the
                // search query is empty.
                return true;
            }

            var that = this;
            return this.filteredNodes.some(function (node) {
                return !that.searchQuery.length || (!node.systemData || node.systemData.visibleInSearch);
            });
        },

        expandStatusStorageKey: function computeStorageKeyString() {
            return this.storageKeyBase + '-' + this.uniqueKey;
        },

        storageKeyBase: function computeStorageKeyBase() {
            return 'tree-expand-status-' + this.treeUniqueKey;
        }
    },
    mounted: function onMounted() {
        if (this.hideSections) {
            this.expanded = true;
        }
        else {
            var expanded = localStorage.getItem(this.expandStatusStorageKey);

            this.expanded = expanded === '1' || expanded === null;
        }
    },
    methods: {
        expand: function expanded() {
            this.expanded = true;
            localStorage.setItem(this.expandStatusStorageKey, this.expanded ? '1' : '0');
        },

        onMenuTriggerClick: function onMenuTriggerClick() {
            if (this.readonly) {
                return;
            }

            var data = {
                node: this,
                type: 'trigger',
                elementType: 'section'
            };

            this.$emit('nodemenutriggerclick', data);
        },

        onCreateMenuTriggerClick: function onCreateMenuTriggerClick() {
            var data = {
                node: this,
                type: 'trigger',
                elementType: 'section',
                sectionCreateMenu: true
            };

            this.$emit('nodemenutriggerclick', data);
        },

        onContextMenu: function onContextMenu(ev) {
            if (this.readonly) {
                return;
            }

            if (!this.hasMenuItems) {
                return;
            }

            var data = {
                node: this,
                type: 'contextmenu',
                ev: ev,
                elementType: 'section'
            };

            this.$emit('nodemenutriggerclick', data);

            ev.preventDefault();
        },

        onExpandToggleClick: function onExpandToggleClick() {
            this.expanded = !this.expanded;

            localStorage.setItem(this.expandStatusStorageKey, this.expanded ? '1' : '0');
        },

        onMenuShown: function onMenuShown() {
            $(this.$refs.contextmenuTrigger).attr('aria-expanded', 'true');
            this.contextMenuVisible = true;
        },

        onMenuHidden: function onMenuHidden() {
            $(this.$refs.contextmenuTrigger).removeAttr('aria-expanded');
            this.contextMenuVisible = false;
        },

        onMenuClosedWithEsc: function () {
            var that = this;
            nextTick(function () {
                that.$refs.contextmenuTrigger.focus();
            });
        }
    }
};
