<div
    class="component-backend-inspector-panel"
    data-validation-alert-title="<?= e(trans('backend::lang.form.error')) ?>"
>
    <backend-inspector-grouphost
        :controls="untabbedControls"
        :obj="obj"
        :parent-obj="parentObj"
        :splitter-data="splitterData"
        :inspector-unique-id="inspectorUniqueId"
        :depth="0"
        :panel-update-data="panelUpdateData"
        :layout-update-data="layoutUpdateData"
        :inspector-preferences="inspectorPreferences"
    ></backend-inspector-grouphost>

    <backend-tabs
        v-show="tabs.length > 0"
        ref="tabs"
        :tabs="tabs"
        :closeable="false"
        :use-slots="true"
        tabs-style="inspector"
        @tabselected="onTabSelected"
    >
        <template v-for="tabInfo in tabs" v-slot:[tabInfo.key]>
            <backend-inspector-grouphost
                :controls="tabbedControls[tabInfo.key]"
                :obj="obj"
                :parent-obj="parentObj"
                :splitter-data="splitterData"
                :inspector-unique-id="inspectorUniqueId"
                :depth="0"
                :panel-update-data="panelUpdateData"
                :layout-update-data="layoutUpdateData"
                :inspector-preferences="inspectorPreferences"
            ></backend-inspector-grouphost>
        </template>
    </backend-tabs>
</div>
