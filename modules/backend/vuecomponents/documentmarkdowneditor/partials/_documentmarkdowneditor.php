<div
    class="component-backend-documentmarkdowneditor d-flex flex-column"
    :class="cssClass"
    data-configuration="<?= e($configuration) ?>"
>
    <div class="flex-fill position-relative">
        <textarea ref="textarea" v-bind:id="editorId"></textarea>
    </div>
</div>
