<div
    class="component-backend-richeditor-document-connector d-flex flex-column position-absolute"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div v-if="allowResizing && !codeEditingMode" class="top-ruler flex-shrink-0">
        <div class="width-indicator" :style="rulerStyle">
            <span v-for="tick in majorTicks" :style="tick.style" class="width-tick tick-major"></span>
            <span v-for="tick in minorTicks" :style="tick.style" class="width-tick tick-minor"></span>

            <div class="width-drag-handle" @mousedown.stop="onResizingHandleMouseDown" ref="handle"></div>
        </div>
    </div>
    <div class="flex-fill richeditor-container">
        <slot></slot>
    </div>
    <div class="flex-fill position-relative codeeditor-container">
        <backend-monacoeditor
            v-if="codeEditingMode"
            ref="codeEditor"
            container-css-class="fill-container"
            :model-definitions="codeEditorModelDefinitions"
        >
        </backend-monacoeditor>
    </div>
</div>
