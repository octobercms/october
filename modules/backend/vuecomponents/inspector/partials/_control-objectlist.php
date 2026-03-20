<div
    data-lang-error="<?= e(trans('backend::lang.form.error')) ?>"
    data-lang-prop-cant-be-empty="<?= e(trans('backend::lang.object_list.prop_cant_be_empty')) ?>"
    data-lang-key-value-exists="<?= e(trans('backend::lang.object_list.key_value_exists')) ?>"
>
    <backend-inspector-group
        :group-name="control.title"
        :obj="editedObject"
        :parent-obj="obj"
        :controls="nestedControlProperties"
        :splitter-data="splitterData"
        :depth="depth"
        :panel-update-data="panelUpdateData"
        :layout-update-data="layoutUpdateData"
        :inspector-unique-id="inspectorUniqueId"
        :inspector-preferences="inspectorPreferences"
        ref="group"
        @inspectorcommand="onInspectorCommand"
    >
    </backend-inspector-group>
</div>