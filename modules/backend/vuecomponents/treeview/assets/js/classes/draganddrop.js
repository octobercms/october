import utils from './utils.js';

/*
 * TreeView drag and drop class
 */
export class TreeviewDragAndDrop {
    constructor() {
        this.$dragRoot = null;
        this.$draggedNode = null;
        this.$dragIndicator = null;
        this.dragModeMove = false;
        this.dragModeSort = false;
        this.$lastParentNode = null;
        this.$scrollable = null;
        this.treePageTop = null;
        this.treePageBottom = null;
        this.scrollTimer = null;
        this.rootNodeList = null;
    }

    isAllowedTargetForCustomExternalDrop(ev) {
        var $li = $(ev.target).closest('li');

        if ($li.hasClass('no-move-drop') || !$li.hasClass('custom-external-drop')) {
            return false;
        }

        return $li;
    }

    isAllowedTarget(ev) {
        if (!this.$dragRoot || !this.$draggedNode) {
            return false;
        }

        if ($(ev.target).closest('li').hasClass('root-node') && !(!this.dragModeSort && this.dragModeMove)) {
            // Do not allow dropping to a root node except the case
            // when it is Move mode and not Sort mode.

            return false;
        }

        if (this.dragModeMove && $(ev.target).closest('li').hasClass('no-move-drop')) {
            return false;
        }

        if (this.dragModeMove && !this.dragModeSort && this.targetIsTheParent(ev.target)) {
            // Do not allow moving to the same parent
            return false;
        }

        if (this.$draggedNode.has(ev.target).length > 0) {
            // Do not allow dropping to children
            // nodes
            return false;
        }

        if (!this.$dragRoot.has(ev.target).length > 0) {
            // Do not allow dropping to nodes
            // belonging to other root nodes than
            // the dragged node.
            return false;
        }

        if (!this.dragModeMove && this.targetHasDifferentParent(ev.target)) {
            // Do not allow dropping to other parents
            // if the Move option is not enabled.
            return false;
        }

        var $targetNode = $(ev.target).closest('li'),
            targetIsCollapsed = $targetNode.hasClass('collapsed-node');

        if (
            !this.dragModeMove &&
            this.isBelowTargetMidline(ev, $targetNode) &&
            this.nodeHasChildNodes($targetNode) &&
            !targetIsCollapsed
        ) {
            // In the Sort only mode - do not allow dropping below expanded nodes
            // with child nodes.

            return false;
        }

        return true;
    }

    nodeHasChildNodes($node) {
        return !$node.hasClass('no-child-nodes');
    }

    targetHasDifferentParent(target) {
        var targetParent = this.getParentNode($(target).closest('li')).get(0);

        for (var index = 0; index < this.$draggedNode.length; index++) {
            var $currentDraggedNode = $(this.$draggedNode.get(index)),
                draggedParentNode = this.getParentNode($currentDraggedNode).get(0);

            if (draggedParentNode === targetParent) {
                return true;
            }
        }

        return false;
    }

    targetIsTheParent(target) {
        var targetParent = $(target).closest('li').get(0);

        for (var index = 0; index < this.$draggedNode.length; index++) {
            var $currentDraggedNode = $(this.$draggedNode.get(index)),
                draggedParentNode = this.getParentNode($currentDraggedNode).get(0);

            if (draggedParentNode === targetParent) {
                return true;
            }
        }

        return false;
    }

    isBelowTargetMidline(ev, $targetNode) {
        var $labelContainer = $targetNode.find('.item-label-container'),
            targetPageMid = $labelContainer.height() / 2 + $labelContainer.offset().top;

        return ev.pageY > targetPageMid;
    }

    getTargetDropAreaThird(ev, $targetNode) {
        var $labelContainer = $targetNode.find('.item-label-container'),
            thirdHeight = $labelContainer.height() / 3,
            delta = ev.pageY - $labelContainer.offset().top;

        if (delta > 2 * thirdHeight) {
            return 3;
        }

        if (delta > thirdHeight) {
            return 2;
        }

        return 1;
    }

    cleanAndInitNodeList() {
        var $cleanedNodes = $([]);
        const self = this;

        this.$draggedNode.each(function() {
            var $node = $(this),
                $selectedParent = $node.parent().parents('li[data-treenode].selected-node').last(),
                $actualNode = $selectedParent.length !== 0 ? $selectedParent : $node;

            if ($cleanedNodes.index($actualNode) === -1) {
                $cleanedNodes = $cleanedNodes.add($actualNode);
            }
        });

        this.$draggedNode = $cleanedNodes;
    }

    extractDroppedNodesData() {
        var result = [];
        const self = this;

        this.$draggedNode.each(function() {
            var node = this,
                nodeInfo = utils.findNodeInfoByKey(self.rootNodeList, node.getAttribute('data-unique-key'));

            if (nodeInfo) {
                result.push(nodeInfo);
            }
        });

        return result;
    }

    getParentNode($targetNode) {
        return $targetNode.parent().closest('li[data-treenode]');
    }

    alignDragIndicator($targetNode, position) {
        var $labelContainer = $targetNode.find('> .item-label-outer-container > .item-label-container');

        this.$dragIndicator
            .css('top', $labelContainer.position().top)
            .width($labelContainer.width())
            .attr('data-drop-position', position);
    }

    handleCustomExternalDrag(ev) {
        var $customDropTarget = this.isAllowedTargetForCustomExternalDrop(ev);
        if (!$customDropTarget) {
            return;
        }

        if (this.$lastParentNode) {
            this.$lastParentNode.removeClass('drop-target-parent');
        }

        this.$lastParentNode = $customDropTarget;
        this.$lastParentNode.addClass('drop-target-parent');

        // Prevent default to allow drop
        //
        ev.preventDefault();
    }

    handleSortDragOver($targetNode, ev) {
        var result = {
            parentType: 'drop-parent'
        };

        if (this.isBelowTargetMidline(ev, $targetNode)) {
            this.alignDragIndicator($targetNode, 'below');
            result.indexType = 'below';
        }
        else {
            this.alignDragIndicator($targetNode, 'above');
            result.indexType = 'above';
        }

        return result;
    }

    handleTreeDragOver($targetNode, ev) {
        var third = this.getTargetDropAreaThird(ev, $targetNode),
            result = {
                parentType: 'drop-parent'
            };

        if (this.$lastParentNode) {
            this.$lastParentNode.removeClass('drop-target-parent');
        }

        this.$lastParentNode = this.getParentNode($targetNode);

        // The top third of the target - offer to drop
        // above the target node, to the same parent.
        //
        if (third == 1) {
            $targetNode.removeClass('drop-target-parent');
            this.$lastParentNode.addClass('drop-target-parent');

            this.alignDragIndicator($targetNode, 'above');
            result.indexType = 'above';
            return result;
        }

        var noChildNodes = !this.nodeHasChildNodes($targetNode);

        // The bottom third of the target without child nodes or with
        // collapsed subnodes - offer to drop below the target node,
        // to the same parent.
        //
        if (third == 3 && (noChildNodes || $targetNode.hasClass('collapsed-node'))) {
            $targetNode.removeClass('drop-target-parent');
            this.$lastParentNode.addClass('drop-target-parent');

            this.alignDragIndicator($targetNode, 'below');
            result.indexType = 'below';
            return result;
        }

        $targetNode.addClass('drop-target-parent');
        result.parentType = 'this';

        // The middle third of the target without child nodes -
        // offer to drop inside the target node.
        //
        if (noChildNodes) {
            this.$dragIndicator.removeAttr('data-drop-position');
            result.indexType = 'first';
            return result;
        }

        // The middle third of the target with child nodes -
        // offer to drop inside the target node, above the
        // first child node.
        //

        // If the node is collapsed - hide the drag indicator
        //
        if ($targetNode.hasClass('collapsed-node')) {
            this.$dragIndicator.removeAttr('data-drop-position');
            result.indexType = 'first';
            return result;
        }

        result.indexType = 'first';

        $targetNode = $targetNode.find('ul[data-subtree]:first li[data-treenode]:first');
        this.alignDragIndicator($targetNode, 'above');

        return result;
    }

    handleMoveDragOver($targetNode, ev) {
        var result = {
            parentType: 'this',
            indexType: 'first'
        };

        $targetNode.addClass('drop-target-parent');

        return result;
    }

    handleDrag(ev) {
        var $targetNode = $(ev.target).closest('li');

        if (!this.dragModeMove && this.dragModeSort) {
            // Sorting nodes within a parent node
            //
            return this.handleSortDragOver($targetNode, ev);
        }

        if (this.dragModeMove && !this.dragModeSort) {
            // Moving nodes between parents
            //
            return this.handleMoveDragOver($targetNode, ev);
        }

        // Moving and sorting nodes
        //
        return this.handleTreeDragOver($targetNode, ev);
    }

    monitorDragScroll(ev) {
        if (this.scrollTimer !== null) {
            return;
        }

        const self = this;

        if (ev.pageY - this.treePageTop <= 20) {
            this.scrollTimer = setTimeout(function() {
                self.$scrollable.get(0).scrollTop -= 6;
                self.scrollTimer = null;
            }, 1);
        }

        if (this.treePageBottom - ev.pageY <= 20) {
            this.scrollTimer = setTimeout(function() {
                self.$scrollable.get(0).scrollTop += 6;
                self.scrollTimer = null;
            }, 1);
        }
    }

    setupScrollMonitoring(ev) {
        this.$scrollable = $(ev.target).closest('.scrollable');

        this.treePageTop = this.$scrollable.parent().offset().top;
        this.treePageBottom = this.treePageTop + this.$scrollable.parent().height();
    }

    clear() {
        if (this.$lastParentNode) {
            this.$lastParentNode.removeClass('drop-target-parent');
        }

        if (!this.$dragIndicator) {
            return;
        }

        this.$dragIndicator.removeAttr('data-drop-position');
        this.$dragRoot.removeClass('drop-target-parent');
        this.$dragRoot.find('li.drop-target-parent').removeClass('drop-target-parent');

        this.$dragRoot = null;
        this.$draggedNode = null;
        this.$dragIndicator = null;
        this.dragModeSort = false;
        this.dragModeMove = false;
        this.rootNodeList = null;
    }

    dragStart(ev, nodeComponent) {
        if (nodeComponent.dragAndDropCustom) {
            ev.treeNodeData = nodeComponent.nodeData;
            ev.stopPropagation();
            nodeComponent.$emit('customdragstart', ev);
            return;
        }

        ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.setData('text', ev.target.id);

        this.rootNodeList = nodeComponent.getRootNodeData().nodes;

        var $startNode = $(ev.target),
            draggingSelectedNode = $startNode.hasClass('selected-node');

        this.$dragRoot = $startNode.closest('li.root-node');

        if (!draggingSelectedNode) {
            // If the node being dragged is not currently selected,
            // drag only that node. Drag all selected nodes otherwise.
            //
            this.$draggedNode = $startNode;
        }
        else {
            // There can be multiple selected nodes but we drag
            // only visible nodes, ignoring nodes in collapsed
            // parents. This is simpler and safer for the user.
            //
            this.$draggedNode = this.$dragRoot.find('li[data-treenode].selected-node');
        }

        // Sorting for multi-selection is not supported
        //
        this.dragModeSort = this.$draggedNode.length === 1 && this.$dragRoot.hasClass('drag-sortable');

        this.dragModeMove = this.$dragRoot.hasClass('drag-movable');

        this.setupScrollMonitoring(ev);

        var $treeviewRoot = this.$dragRoot.closest('.component-backend-treeview');
        this.$dragIndicator = $treeviewRoot.find('.drag-indicator');
        ev.stopPropagation();

        // For multi-node operations we want to ignore leaf nodes
        // which parent nodes participate in the move operation.
        //
        // Selected nodes before cleaning:
        // Node 1
        //   Node 2
        // Node 3
        //
        // After cleaning:
        // Node 1
        // Node 3
        //
        if (draggingSelectedNode) {
            this.cleanAndInitNodeList();
        }

        if (this.$draggedNode.length > 1 && !/Edge/.test(navigator.userAgent)) {
            var $imgContainer = $treeviewRoot.find('.treeview-ghost-image-container'),
                $dragImage = $imgContainer.find('img[data-multi-drag-image]');

            $imgContainer.addClass('snapshot');
            ev.dataTransfer.setDragImage($dragImage.get(0), 5, 0);
            $imgContainer.removeClass('snapshot');
        }
    }

    onDragOver(ev) {
        if (!this.$dragIndicator) {
            // Custom drag and drop session
            //
            this.handleCustomExternalDrag(ev);

            return;
        }

        this.monitorDragScroll(ev);

        if (!this.isAllowedTarget(ev)) {
            this.$dragIndicator.removeAttr('data-drop-position');

            if (this.$lastParentNode) {
                this.$lastParentNode.removeClass('drop-target-parent');
            }

            return;
        }

        ev.dataTransfer.dropEffect = 'move';

        // Prevent default to allow drop
        //
        ev.preventDefault();

        this.handleDrag(ev);
    }

    onDragEnter(ev) {
        if (!this.$dragIndicator) {
            // Custom drag and drop session
            //
            this.clear();

            return;
        }

        if (!this.isAllowedTarget(ev)) {
            return;
        }

        // Prevent default to allow drop
        //
        ev.preventDefault();
    }

    onDragLeave(ev) {
        if (!this.$dragIndicator) {
            this.clear();

            // Custom drag and drop session
            //
            return;
        }

        if (!this.isAllowedTarget(ev)) {
            return;
        }

        $(ev.target).closest('li').removeClass('drop-target-parent');
    }

    onDragEnd(ev) {
        this.clear();
    }

    onDrop(ev, node) {
        if (!this.$dragIndicator) {
            // Custom drag and drop session
            //
            if (this.isAllowedTargetForCustomExternalDrop(ev)) {
                ev.stopPropagation();
                ev.preventDefault();
            }

            this.clear();
            return {
                original: 'external',
                ev: ev
            };
        }

        if (!this.isAllowedTarget(ev)) {
            this.clear();
            return null;
        }

        ev.stopPropagation();
        ev.preventDefault();

        var result = {
            droppedNodes: this.extractDroppedNodesData(),
            to: this.handleDrag(ev)
        };

        this.clear();

        return result;
    }

    completeDrop(dropData, node) {
        var targetNodeList = [],
            targetIndex = 0,
            parentNode = null;

        switch (dropData.to.parentType) {
            case 'drop-parent':
                targetNodeList = node.parentNodeList;
                parentNode = node.$parent;
                break;
            case 'this':
                if (typeof node.nodeData.nodes === 'undefined') {
                    // Vue 3: Direct assignment is reactive
                    node.nodeData.nodes = [];
                }

                targetNodeList = node.nodeData.nodes;
                parentNode = node;
                node.expand();
                break;
            default:
                throw new Error('Invalid parent type: ' + dropData.to.parentType);
        }

        switch (dropData.to.indexType) {
            case 'above':
                targetIndex = node.indexInParent;
                break;
            case 'below':
                targetIndex = node.indexInParent + 1;
                break;
            case 'first':
                targetIndex = 0;
                break;
            default:
                throw new Error('Invalid index type: ' + dropData.to.indexType);
        }

        dropData.droppedNodes.forEach(function(droppedNodeData) {
            var originalNode = droppedNodeData.nodeData;

            targetNodeList.splice(targetIndex, 0, originalNode);

            var indexToDelete = droppedNodeData.parentArray.indexOf(originalNode);
            droppedNodeData.parentArray.splice(indexToDelete, 1);
        });
    }

    mouseDown(ev) {
        // Stop the mousedown event for draggable nodes
        // if this is not a touch device. On touch devices,
        // we do not support drag and drop.

        var $closestNode = $(ev.target).closest('li');

        if ($closestNode.attr('draggable') !== 'true') {
            return;
        }

        if ($.oc.isTouchEnabled()) {
            return;
        }

        ev.stopPropagation();
    }
}

export const dragAndDrop = new TreeviewDragAndDrop();
export default dragAndDrop;
