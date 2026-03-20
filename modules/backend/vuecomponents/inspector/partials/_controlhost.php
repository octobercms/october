<table class="component-backend-inspector-controlhost" @mousedown.stop="onHandleMouseDown">
    <tbody>
        <backend-inspector-controlhost-row
            v-for="control in controls"
            :obj="obj"
            :parent-obj="parentObj"
            :key="control.property"
            :control-host-unique-id="uniqueId"
            :control="control"
            :splitter-data="splitterData"
            :depth="depth"
            :panel-update-data="panelUpdateData"
            :layout-update-data="layoutUpdateData"
            :inspector-preferences="inspectorPreferences"
            :inspector-unique-id="inspectorUniqueId"
            :is-full-width="isFullWidthControl(control)"
            @inspectorcommand="$emit('inspectorcommand', $event)"
        >
        </backend-inspector-controlhost-row>
    </tbody>
</table>