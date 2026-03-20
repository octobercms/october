import { nextTick } from 'vue';
import { utils, dragAndDrop } from './classes/index.js';

/*
 * Vue treeview node
 */
export default {
    props: {
        nodeData: {
            type: Object,
            required: true,
            validator: function (value) {
                if (typeof value !== 'object') {
                    return false;
                }

                if (typeof value.uniqueKey !== 'string') {
                    console.error('node.uniqueKey must be string', value);
                    return false;
                }

                if (value.nodes !== undefined && !Array.isArray(value.nodes)) {
                    console.error('node.nodes must be an array', value);
                    return false;
                }

                if (value.selectable !== undefined && typeof value.selectable !== 'boolean') {
                    console.error('node.selectable must be boolean', value);
                    return false;
                }

                if (value.hasApiMenuItems !== undefined && typeof value.hasApiMenuItems !== 'boolean') {
                    console.error('node.hasApiMenuItems must be boolean', value);
                    return false;
                }

                if (typeof value.label !== 'string' || value.label === undefined) {
                    console.error('node.label must be string', value);
                    return false;
                }

                if (value.icon !== undefined) {
                    if (
                        value.icon !== 'folder' &&
                        (typeof value.icon !== 'object' || !value.icon.hasOwnProperty('cssClass'))
                    ) {
                        console.error('node.icon must be an object with cssClass property', value);
                        return false;
                    }
                }

                if (value.menuitems !== undefined && !Array.isArray(value.menuitems)) {
                    console.error('node.menuitems must be an array', value);
                    return false;
                }

                if (value.topLevelMenuitems !== undefined && !Array.isArray(value.topLevelMenuitems)) {
                    console.error('node.topLevelMenuitems must be an array', value);
                    return false;
                }

                if (value.userData !== undefined && typeof value.userData !== 'object') {
                    console.error('node.userData must be an object', value);
                    return false;
                }

                if (value.sortBy !== undefined && typeof value.sortBy !== 'string') {
                    console.error('node.sortBy must be string', value);
                    return false;
                }

                if (value.displayMode !== undefined) {
                    if (typeof value.displayMode !== 'string') {
                        console.error('node.displayMode must be string', value);
                        return false;
                    }

                    if (['list', 'tree'].indexOf(value.displayMode) === -1) {
                        console.error('node.displayMode must be list or tree', value);
                        return false;
                    }
                }

                if (value.dragAndDropMode !== undefined && !Array.isArray(value.dragAndDropMode)) {
                    console.error('node.dragAndDropMode must be an array', value);
                    return false;
                }

                if (value.groupBy !== undefined && typeof value.groupBy !== 'string') {
                    console.error('node.groupBy must be string', value);
                    return false;
                }

                if (value.multiSelect !== undefined && typeof value.multiSelect !== 'boolean') {
                    console.error('node.multiSelect must be boolean', value);
                    return false;
                }

                if (value.groupByRegex && typeof value.groupByRegex !== 'string') {
                    console.error('node.groupByRegex must be string', value);
                    return false;
                }

                if (value.groupByMode !== undefined) {
                    if (typeof value.groupByMode !== 'string') {
                        console.error('node.groupByMode must be string', value);
                        return false;
                    }

                    if (['folders', 'nesting'].indexOf(value.groupByMode) === -1) {
                        console.error('node.groupByMode must be folders or nesting', value);
                        return false;
                    }
                }

                if (value.groupByFolderIcon !== undefined) {
                    if (
                        typeof value.groupByFolderIcon !== 'object' ||
                        !value.groupByFolderIcon.hasOwnProperty('cssClass')
                    ) {
                        console.error('node.groupByFolderIcon must be an object with cssClass property', value);
                        return false;
                    }
                }

                if (value.displayProperty !== undefined) {
                    if (typeof value.displayProperty !== 'string') {
                        console.error('node.displayProperty must be string', value);
                        return false;
                    }
                }

                if (value.noMoveDrop !== undefined && typeof value.noMoveDrop !== 'boolean') {
                    console.error('node.noMoveDrop must be boolean', value);
                    return false;
                }

                return true;
            }
        },
        isRoot: {
            type: Boolean,
            default: false
        },
        branchDisplayMode: {
            type: String,
            default: 'tree',
            validator: function (value) {
                return ['list', 'tree'].indexOf(value) !== -1;
            }
        },
        branchMenuitems: Array,
        branchDragAndDropMode: {
            type: Array
        },
        branchSortBy: {
            type: String
        },
        parentKeyPath: {
            type: Array
        },
        selectedKeys: {
            type: Array
        },
        treeUniqueKey: {
            type: String,
            required: true
        },
        indexInParent: {
            type: Number,
            required: true
        },
        parentNodeList: {
            type: Array,
            required: true
        },
        branchGroupBy: {
            type: String
        },
        branchGroupByMode: {
            type: String
        },
        branchGroupByRegex: {
            type: String
        },
        branchDisplayProperty: {
            type: String
        },
        branchGroupFolderDisplayPathProps: {
            type: Array
        },
        branchMultiSelect: {
            type: Boolean
        },
        readonly: {
            type: Boolean,
            default: false
        },
        searchQuery: '',
        store: Object,
        groupedNodes: Array
    },
    data: function () {
        return {
            expanded: false,
            menuId: null,
            menuButtonId: null,
            menuLabelId: null,
            contextMenuVisible: false,
            clickCounter: 0,
            clickTimer: null,
            childNodeRefs: []
        };
    },
    computed: {
        hasChildNodes: function computeHasChildNodes() {
            if (this.groupedNodes === undefined) {
                return false;
            }

            if (!this.searchQuery.length) {
                return !!this.groupedNodes.length;
            }

            for (var index = 0; index < this.groupedNodes.length; index++) {
                var node = this.groupedNodes[index];

                if (node.systemData === undefined) {
                    return true;
                }

                if (node.systemData.visibleInSearch) {
                    return true;
                }
            }

            return false;
        },

        cssClass: function computeCssClass() {
            var displayMode = this.branchDisplayMode;

            if (displayMode == 'list' && this.branchGroupBy) {
                displayMode = 'tree';
            }

            var result = 'mode-' + displayMode;

            if (this.isRoot) {
                result += ' root-node';
            }

            if (this.expanded) {
                result += ' expanded-node';

                if (this.hasChildNodes) {
                    result += ' expanded-with-children';
                }
            }
            else {
                result += ' collapsed-node';
            }

            if (this.isSelected) {
                result += ' selected-node';
            }

            if (this.branchMultiSelect) {
                result += ' multi-select';
            }

            if (this.nodeData.selectable) {
                result += ' selectable-node';
            }

            if (this.nextNodeIsSelected) {
                result += ' next-is-selected';
            }

            if (!this.hasChildNodes) {
                result += ' no-child-nodes';
            }
            else {
                result += ' has-child-nodes';
            }

            if (this.dragAndDropSortable) {
                result += ' drag-sortable';
            }

            if (this.dragAndDropMovable) {
                result += ' drag-movable';
            }

            if (this.contextMenuVisible) {
                result += ' context-menu-visible';
            }

            if (this.nodeData.noMoveDrop === true) {
                result += ' no-move-drop';
            }

            if (this.dragAndDropCustomExternal) {
                result += ' custom-external-drop';
            }

            return result;
        },

        nodeMenuitems: function computeNodeMenuitems() {
            return this.isRoot ? this.nodeData.topLevelMenuitems : this.branchMenuitems;
        },

        labelContainerCssClass: function computeLabelContainerCssClass() {
            var result = '';

            if (this.nodeData.icon) {
                result += 'has-icon';
            }

            if (this.nodeMenuitems || this.nodeData.hasApiMenuItems) {
                result += ' has-menu';
            }

            return result;
        },

        keyPath: function computeKeyPath() {
            return this.parentKeyPath.concat(this.nodeData.uniqueKey);
        },

        keyPathString: function computeKeyPathString() {
            return JSON.stringify(this.keyPath);
        },

        expandStatusStorageKey: function computeStorageKeyString() {
            return this.storageKeyBase + '-' + this.nodeData.uniqueKey;
        },

        storageKeyBase: function computeStorageKeyBase() {
            return 'tree-expand-status-' + this.treeUniqueKey;
        },

        isSelected: function isSelected() {
            return this.selectedKeys.indexOf(this.nodeData.uniqueKey) !== -1;
        },

        isAriaExpanded: function computeIsExpanded() {
            // Return string, not Boolean.
            //
            return this.expanded ? 'true' : 'false';
        },

        nodeDomId: function computeNodeDomId() {
            // Node ID can change when the tree rebuilds.
            // It is used only for drag-and-drop sessions
            // and should not be used for accessing nodes
            // by external code.
            //
            return $.oc.domIdManager.generate('treenode');
        },

        isDraggable: function computeIsDraggable() {
            return this.dragAndDropSortable || this.dragAndDropMovable || this.dragAndDropCustom;
        },

        dragAndDropSortable: function computeIsDragAndDropSortable() {
            return Array.isArray(this.branchDragAndDropMode) && this.branchDragAndDropMode.indexOf('sort') !== -1;
        },

        dragAndDropMovable: function computeIsDragAndDropSortable() {
            return Array.isArray(this.branchDragAndDropMode) && this.branchDragAndDropMode.indexOf('move') !== -1;
        },

        dragAndDropCustom: function computeIsDragAndDropSortable() {
            return Array.isArray(this.branchDragAndDropMode) && this.branchDragAndDropMode.indexOf('custom') !== -1;
        },

        dragAndDropCustomExternal: function computeIsDragAndDropSortable() {
            return (
                Array.isArray(this.branchDragAndDropMode) && this.branchDragAndDropMode.indexOf('custom-external') !== -1
            );
        },

        sortedNodes: function computeSortedNodes() {
            if (!this.branchSortBy) {
                return this.groupedNodes;
            }

            return utils.sortNodes(this.groupedNodes, this.branchSortBy);
        },

        nodeText: function computeNodeText() {
            var isFolder = utils.getSystemData(this.nodeData, 'treeviewGroupFolder');

            if (!isFolder && this.branchDisplayProperty && !this.isRoot) {
                if (!this.nodeData.userData) {
                    throw new Error(
                        'Node user data is not set. Cannot use the displayProperty value. ' + this.keyPathString
                    );
                }

                return utils.getLastGroupedPathSegment(
                    this.nodeData.userData[this.branchDisplayProperty],
                    this,
                    isFolder,
                    this.branchDisplayProperty
                );
            }

            return utils.getLastGroupedPathSegment(this.nodeData.label, this, isFolder);
        },

        nodeDataObj: function computeNodeData() {
            return this.nodeData;
        },

        icon: function computeIcon() {
            if (typeof this.nodeData.icon === 'object') {
                return this.nodeData.icon;
            }

            if (this.isFolderIcon) {
                return {
                    cssClass: 'backend-icon-background treeview-folder',
                    backgroundColor: 'transparent'
                };
            }

            return null;
        },

        nextNodeIsSelected: function nextNodeIsSelected() {
            var lastParentIndex = this.parentNodeList.length - 1;
            var nextNode = null;

            if (this.hasChildNodes && this.expanded) {
                nextNode = this.getFirstVisibleChildNode();
            }
            else {
                if (this.indexInParent < lastParentIndex) {
                    nextNode = this.parentNodeList[this.indexInParent + 1];
                }
            }

            if (!nextNode) {
                return false;
            }

            return this.selectedKeys.indexOf(nextNode.uniqueKey) !== -1;
        },

        isFolderIcon: function computeIsFolderIcon() {
            return this.nodeData.icon === 'folder';
        }
    },
    methods: {
        expand: function () {
            this.expanded = true;

            localStorage.setItem(this.expandStatusStorageKey, '1');
        },

        collapse: function () {
            this.expanded = false;

            localStorage.removeItem(this.expandStatusStorageKey);
        },

        getFirstVisibleChildNode: function () {
            for (var index = 0; index < this.sortedNodes.length; index++) {
                var node = this.sortedNodes[index];
                if (!this.searchQuery.length || (!node.systemData || node.systemData.visibleInSearch)) {
                    return node;
                }
            }

            return null;
        },

        collapseChildren: function () {
            function traverse(nodeRefs) {
                for (var index = 0; index < nodeRefs.length; index++) {
                    var currentNode = nodeRefs[index];
                    if (!currentNode) continue;

                    currentNode.collapse();
                    traverse(currentNode.childNodeRefs || []);
                }
            }

            traverse(this.childNodeRefs);
            this.collapse();
        },

        expandParents: function () {
            var lastParent = this;

            while (lastParent.$parent && lastParent.$parent.nodeDataObj) {
                lastParent.expand();
                lastParent = lastParent.$parent;
            }
        },

        notifySelectionChanged: function (uniqueKey, type) {
            this.$emit('nodeselected', {
                uniqueKey: uniqueKey ? uniqueKey : this.nodeData.uniqueKey,
                type: type,
                nodeEl: this.$el
            });
        },

        getRootNodeData: function getRootNodeData() {
            var lastParent = this;

            while (lastParent.$parent && lastParent.$parent.nodeDataObj) {
                lastParent = lastParent.$parent;
            }

            return lastParent.nodeDataObj;
        },

        scrollIntoView: function scrollIntoView(callback) {
            var thisElement = this.$el;
            nextTick(function () {
                thisElement.scrollIntoView({ behavior: 'smooth' });

                if (callback) {
                    callback();
                }
            });
        },

        focus: function focus() {
            this.$el.focus();
        },

        triggerSelected: function triggerSelected(ev) {
            this.onSingleClick(ev);
        },

        onExpandToggleClick: function () {
            if (this.expanded) {
                this.collapse();
            }
            else {
                this.expand();
            }
        },

        onNodeClick: function (event) {
            var isFolderNode = this.isFolderIcon;

            if (!isFolderNode) {
                isFolderNode = (!this.nodeData.selectable || this.isRoot) && this.hasChildNodes;
            }

            if (!isFolderNode) {
                this.onSingleClick(event);
                return;
            }

            this.clickCounter++;
            if (this.clickCounter == 1) {
                var that = this;

                this.clickTimer = setTimeout(function() {
                    that.clickCounter = 0;
                    that.onSingleClick(event);
                }, 200);

                return;
            }

            clearTimeout(this.clickTimer);
            this.clickCounter = 0;
            this.onDoubleClick(event);
        },

        onDoubleClick: function (event) {
            if ($(document.body).hasClass('drag')) {
                return;
            }

            if (this.isFolderIcon) {
                this.onExpandToggleClick();
                return;
            }

            this.onSingleClick(event);
        },

        onSingleClick: function (event) {
            if ($(document.body).hasClass('drag')) {
                return;
            }

            if (this.readonly) {
                return;
            }

            if (this.nodeData.selectable && this.branchMultiSelect) {
                if (event.metaKey || event.ctrlKey) {
                    this.notifySelectionChanged(null, 'add');
                    this.$el.focus();
                    return;
                }

                if (event.shiftKey) {
                    this.notifySelectionChanged(null, 'range');
                    this.$el.focus();
                    return;
                }
            }

            var ev = $.Event('treviewnodeclick', {
                // See also treeview.js onQuickAccessNodeSelected()

                treeviewData: {
                    keyPath: this.keyPath,
                    uniqueKey: this.nodeData.uniqueKey,
                    nodeData: this.nodeData,
                    rootNodeData: this.getRootNodeData()
                }
            });

            if (!this.nodeData.selectable) {
                this.$emit('nonselectablenodeclick', ev);
            }

            if (!this.nodeData.selectable || this.isRoot) {
                if (this.hasChildNodes) {
                    this.onExpandToggleClick();
                    return;
                }

                return;
            }

            this.$emit('nodeclick', ev);

            if (ev.isDefaultPrevented()) {
                return;
            }

            this.notifySelectionChanged();
            this.$el.focus();
        },

        onDrop: function (ev) {
            var dropData = dragAndDrop.onDrop(ev);

            if (!dropData) {
                return;
            }

            if (dropData.original === 'external') {
                this.$emit('externaldrop', {
                    ev: dropData.ev,
                    toKeyPath: this.keyPath,
                    toUniqueKey: this.nodeData.uniqueKey,
                    nodeData: this.nodeData
                });
                return;
            }

            var parent = dropData.to.parentType == 'drop-parent' ? this.$parent : this,
                ev = $.Event('nodedrop', {
                    toKeyPath: parent.keyPath,
                    movedNodes: dropData.droppedNodes,
                    movedToNode: parent.nodeData
                });

            this.$emit('nodedrop', ev);
            if (ev.isDefaultPrevented()) {
                return;
            }

            dragAndDrop.completeDrop(dropData, this);
        },

        onDragStart: function onDragStart(ev) {
            dragAndDrop.dragStart(ev, this);
        },

        onMenuTriggerClick: function onMenuTriggerClick() {
            var data = {
                node: this,
                type: 'trigger'
            };

            this.$emit('nodemenutriggerclick', data);
        },

        onContextMenu: function onContextMenu(ev) {
            if (this.readonly) {
                return;
            }

            if (!this.nodeMenuitems && !this.nodeData.hasApiMenuItems) {
                return;
            }

            var data = {
                node: this,
                type: 'contextmenu',
                ev: ev
            };

            this.$emit('nodemenutriggerclick', data);

            ev.preventDefault();
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
    },
    mounted: function onMounted() {
        this.expanded = localStorage.getItem(this.expandStatusStorageKey) == '1';
        this.menuId = $.oc.domIdManager.generate('dropdown-menu');
        this.menuButtonId = $.oc.domIdManager.generate('treeview-menu-button');
        this.menuLabelId = $.oc.domIdManager.generate('treeview-menu-label');

        if (this.dragAndDropSortable && this.branchSortBy) {
            throw new Error(
                'Nodes belonging to branches with SORT drag and drop option cannot be sortable using the sortBy option. Node path: ' +
                this.keyPathString
            );
        }

        if (this.dragAndDropMovable && this.branchDisplayMode == 'list') {
            throw new Error(
                'Treeview branch in LIST mode cannot have the MOVE drag and drop option enabled. Node path: ' +
                this.keyPathString
            );
        }

        if (this.branchGroupBy && this.branchDisplayMode !== 'list') {
            throw new Error(
                'Treeview branch in LIST mode cannot have the groupBy property set. Node path: ' + this.keyPathString
            );
        }

        if (this.branchDragAndDropMode && this.branchGroupBy) {
            throw new Error(
                'Treeview drag and drop is not supported for branches with enabled groupBy option. Node path: ' +
                this.keyPathString
            );
        }
    }
};
