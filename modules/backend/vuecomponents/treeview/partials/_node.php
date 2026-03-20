<li
    role="treeitem"
    :class="cssClass"
    v-bind:aria-expanded="isAriaExpanded"
    v-bind:tabindex="isSelected ? 0 : -1"
    v-bind:draggable="isDraggable && !isRoot"
    v-bind:id="nodeDomId"
    v-bind:data-unique-key="nodeData.uniqueKey"
    data-treenode
    @drop="onDrop"
    @dragstart="onDragStart"
    @contextmenu.stop="onContextMenu"
>
    <div role="none" class="item-label-outer-container">
        <div
            role="none"
            class="item-label-container"
            :class="labelContainerCssClass"
            @click.stop="onNodeClick"
        >
            <button
                aria-hidden="true"
                v-if="isRoot || branchDisplayMode == 'tree' || branchGroupBy"
                v-bind:aria-label="'<?= e(trans('backend::lang.treeview.collapse')) ?>'"
                class="node-toggle-control backend-icon-background-pseudo"
                :class="{'no-child-nodes': !hasChildNodes}"
                @click.stop="onExpandToggleClick"
                tabindex="-1"
            ></button>
            <span
                class="node-icon"
                aria-hidden="true"
                v-if="icon"
                v-bind:style="{'background-color': icon.backgroundColor ? icon.backgroundColor : '#E67E21'}"
                :class="{'folder-icon': isFolderIcon}"
            >
                <i :class="icon.cssClass"></i>
            </span>
            <span v-text="nodeText" class="node-label" v-bind:id="menuLabelId"></span>
            <span v-if="nodeData.description" v-text="nodeData.description" class="node-label"></span>
            <button
                v-bind:tabindex="isSelected ? 0 : -1"
                v-if="(nodeMenuitems || nodeData.hasApiMenuItems) && ! readonly"
                ref="contextmenuTrigger"
                class="node-menu-trigger backend-icon-background-pseudo"
                @click.stop="onMenuTriggerClick"
                v-bind:aria-labeledby="menuLabelId"
                v-bind:aria-controls="menuId"
                v-bind:id="menuButtonId"
                v-bind:aria-haspopup="true"
                aria-hidden="true"
            >⋮</button>
        </div>
    </div>
    <ul role="group" v-if="hasChildNodes && expanded" data-subtree>
        <template v-for="(node, index) in sortedNodes" :key="node.uniqueKey + (node.systemData ? node.systemData.updateKey : '')">
            <backend-treeview-node
                v-if="!searchQuery.length || (!node.systemData || node.systemData.visibleInSearch)"
                :ref="el => { if (el) childNodeRefs[index] = el }"
                :node-data="node"
                :is-root="false"
                :branch-display-mode="branchDisplayMode"
                :parent-key-path="keyPath"
                :selected-keys="selectedKeys"
                :tree-unique-key="treeUniqueKey"
                :branch-drag-and-drop-mode="branchDragAndDropMode"
                :branch-menuitems="branchMenuitems"
                :branch-display-property="branchDisplayProperty"
                :branch-sort-by="branchSortBy"
                :branch-group-by="branchGroupBy"
                :branch-group-by-mode="branchGroupByMode"
                :branch-multi-select="branchMultiSelect"
                :branch-group-folder-display-path-props="branchGroupFolderDisplayPathProps"
                :index-in-parent="index"
                :parent-node-list="sortedNodes"
                :store="store"
                :search-query="searchQuery"
                :grouped-nodes="!branchGroupBy ? node.nodes : (!node.systemData ? [] : node.systemData.groupedNodes)"
                :readonly="readonly"
                @nodeclick="$emit('nodeclick', $event)"
                @customdragstart="$emit('customdragstart', $event)"
                @nonselectablenodeclick="$emit('nonselectablenodeclick', $event)"
                @nodeselected="$emit('nodeselected', $event)"
                @nodedrop="$emit('nodedrop', $event)"
                @externaldrop="$emit('externaldrop', $event)"
                @nodemenutriggerclick="$emit('nodemenutriggerclick', $event)"
            ></backend-treeview-node>
        </template>
    </ul>
</li>