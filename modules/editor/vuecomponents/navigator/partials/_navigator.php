<div class="flex-layout-column full-height-strict editor-navigator">
    <div class="flex-layout-item stretch relative">
        <backend-treeview
            aria-label="<?= __('Editor Objects') ?>"
            :sections="store.state.navigatorSections"
            :selected-unique-key="store.state.navigatorSelectedUniqueKey"
            :searchable="true"
            :container-css-class="'layout-fill-container'"
            :readonly="readonly"
            unique-key="editor-navigator"
            @nodeclick="onNodeClick"
            @nodedrop="onNodeDrop"
            @externaldrop="onExternalDrop"
            @command="onCommand"
            @nodecontextmenudisplay="onNodeContextMenuDisplay"

            ref="treeView"
        >
        </backend-treeview>
    </div>
</div>
