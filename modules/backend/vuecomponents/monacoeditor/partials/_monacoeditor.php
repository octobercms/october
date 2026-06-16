<div
    class="component-backend-monaco-editor"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div class="flex-shrink-0" v-if="showTabs">
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

    <div class="flex-fill position-relative h-100" style="overflow: hidden">
        <div
            class="d-flex flex-column fill-container"
            :class="editorContainerCssClass"
            ref="editorContainer"
            @dragover.capture="onDragOver"
            @drop.capture="onDragDrop"
        ></div>
    </div>
</div>