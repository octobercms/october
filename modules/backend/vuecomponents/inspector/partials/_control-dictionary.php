<div
    data-lang-key-required="<?= e(trans('backend::lang.dictionary.key_required')) ?>"
    data-lang-value-required="<?= e(trans('backend::lang.dictionary.value_required')) ?>"
>
    <backend-inspector-group
        :group-name="control.title"
        :obj="editedObject"
        :controls="nestedControlProperties"
        :splitter-data="splitterData"
        :depth="depth"
        :panel-update-data="panelUpdateData"
        :group-value="groupValue"
        :layout-update-data="layoutUpdateData"
        :inspector-unique-id="inspectorUniqueId"
        :inspector-preferences="inspectorPreferences"
        :hide-bottom-border="true"
        ref="group"
    >
    </backend-inspector-group>
</div>