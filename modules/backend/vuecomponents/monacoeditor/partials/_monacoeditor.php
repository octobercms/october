<div
    class="flex-layout-column component-backend-monaco-editor"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div class="flex-layout-item fix" v-if="showTabs">
        <backend-tabs
            :tabs="editorTabs"
            :closeable="false"
            :no-panes="true"
            :container-css-class="tabsContainerCssClass"
            :tooltips-enabled="false"
            tabs-style="monaco-editor"
            @tabselected="onTabSelected"
        ></backend-tabs>
    </div>

    <div class="flex-layout-item stretch position-relative h-100" style="overflow: hidden">
        <div
            class="flex-layout-column fill-container"
            :class="editorContainerCssClass"
            ref="editorContainer"
            @dragover.capture="onDragOver"
            @drop.capture="onDragDrop"
        ></div>
    </div>
</div>