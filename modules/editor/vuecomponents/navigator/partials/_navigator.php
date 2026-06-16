<div class="d-flex flex-column h-100 editor-navigator">
    <div class="flex-fill position-relative">
        <backend-treeview
            aria-label="<?= __('Editor Objects') ?>"
            :sections="store.state.navigatorSections"
            :selected-unique-key="store.state.navigatorSelectedUniqueKey"
            :searchable="true"
            :container-css-class="'fill-container'"
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
