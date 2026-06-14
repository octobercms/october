<div
    class="component-backend-codeeditor d-flex flex-column"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div class="flex-fill position-relative">
        <div v-bind:id="editorId" class="editor-element"></div>
    </div>
</div>