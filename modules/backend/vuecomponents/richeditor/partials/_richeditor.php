<div
    class="component-backend-richeditor d-flex flex-column"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div class="flex-fill position-relative field-richeditor is-stretch" data-richeditor-vue>
        <textarea ref="textarea" v-bind:id="editorId" class="editor-element"></textarea>
    </div>
</div>
