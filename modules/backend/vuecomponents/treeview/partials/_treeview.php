<div class="component-backend-treeview flex-layout-column full-height-strict" :class="containerCssClass">
    <div
        class="treeview-container flex-layout-item stretch relative"
    >
        <div class="treeview-ghost-image-container">
            <img
                data-multi-drag-image
                src="<?= Url::asset('/modules/backend/assets/images/treeview-multi-drag.svg') ?>" />
        </div>
        <backend-scrollable-panel ref="scrollablePanel">
            <div :class="{'treeview-readonly': readonly}">
                <ul
                    role="tree"
                    v-bind:aria-label="ariaLabel"
                    @keydown="onKeyDown"
                    @mousedown="onMouseDown"
                    @dragover="onDragOver"
                    @dragenter="onDragEnter"
                    @dragleave="onDragLeave"
                    @dragend="onDragEnd"
                >
                    <backend-treeview-section
                        v-for="(section, index) in sections"
                        :ref="el => { if (el) sectionRefs[index] = el }"
                        :key="section.uniqueKey"
                        :unique-key="section.uniqueKey"
                        :label="section.label"
                        :nodes="section.nodes"
                        :hasApiMenuItems="section.hasApiMenuItems"
                        :userData="section.userData"
                        :menu-items="section.menuItems"
                        :create-menu-items="section.createMenuItems"
                        :readonly="readonly"
                        :search-query="searchQueryTrimmed"
                        :store="store"
                        :selected-keys="selectedKeys"
                        :tree-unique-key="uniqueKey"
                        :hide-sections="hideSections"
                        :default-folder-icon="defaultFolderIcon"

                        @nodeclick="$emit('nodeclick', $event)"
                        @customdragstart="$emit('customdragstart', $event)"
                        @nonselectablenodeclick="$emit('nonselectablenodeclick', $event)"
                        @nodeselected="onNodeSelected"
                        @nodedrop="$emit('nodedrop', $event)"
                        @externaldrop="$emit('externaldrop', $event)"
                        @nodecontextmenudisplay="$emit('nodecontextmenudisplay', $event)"

                        @nodemenutriggerclick="onNodeMenuTriggerClick"
                    >
                    </backend-treeview-section>
                </ul>

                <div class="drag-indicator"></div>
            </div>
        </backend-scrollable-panel>

        <backend-dropdown-menu
            :items="store.contextMenu.items"
            :menu-id="store.contextMenu.menuId"
            :labeled-by-id="store.contextMenu.labeledById"
            ref="contextmenu"
            @command="onMenuItemCommand"
            @shown="onMenuShown"
            @hidden="onMenuHidden"
            @closedwithesc="onMenuClosedWithEsc"
        ></backend-dropdown-menu>

        <backend-treeview-quickaccess
            :unique-key="uniqueKey"
            ref="quickAccess"
            :sections="sections"
            :default-folder-icon="defaultFolderIcon"
            @nodeselected="onQuickAccessNodeSelected"
            @command="onQuickAccessCommand"
        ></backend-treeview-quickaccess>
    </div>

    <div
        v-if="searchable"
        class="flex-layout-item fix treeview-search-control backend-icon-background-pseudo"
        :class="{'search-enabled': searchQuery.length > 0}"
    >
        <input
            v-model="searchQuery"
            type="text"
            aria-label="<?= e(trans('backend::lang.treeview.search')) ?>"
            data-default-focus
        />

        <button class="backend-icon-background-pseudo" @click="searchQuery=''" aria-label="<?= e(trans('backend::lang.treeview.clear_search')) ?>">×</button>
    </div>
</div>