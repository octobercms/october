<div class="component-backend-inspector-grouphost">
    <backend-inspector-controlhost
        :controls="groupedControls.ungrouped"
        :obj="obj"
        :parent-obj="parentObj"
        :splitter-data="splitterData"
        :depth="depth"
        :panel-update-data="panelUpdateData"
        :layout-update-data="layoutUpdateData"
        :inspector-unique-id="inspectorUniqueId"
        :inspector-preferences="inspectorPreferences"
    >
    </backend-inspector-controlhost>

    <template v-for="(controls, groupName) in groupedControls" :key="groupName">
        <backend-inspector-group
            v-if="groupName != 'ungrouped'"
            :group-name="groupName"
            :obj="obj"
            :parent-obj="parentObj"
            :controls="controls"
            :splitter-data="splitterData"
            :depth="depth"
            :panel-update-data="panelUpdateData"
            :layout-update-data="layoutUpdateData"
            :inspector-unique-id="inspectorUniqueId"
            :inspector-preferences="inspectorPreferences"
        >
        </backend-inspector-group>
    </template>
</div>