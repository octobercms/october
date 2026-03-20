<backend-modal
    ref="modal"
    :store-position="false"
    unique-key="uniqueKey"
    aria-labeled-by="modalTitleId"
    @hidden="onHidden"
>
    <template v-slot:content>
        <div class="modal-header">
            <h4 class="modal-title" v-bind:id="modalTitleId"><?= e(trans('backend::lang.form.concurrency_file_changed_title')) ?></h4>
            <button @click.prevent="$refs.modal.hide()" type="button" class="btn-close" aria-label="<?= __("Close") ?>" tabindex="0"></button>
        </div>
        <div class="modal-body">
            <p><?= e(trans('backend::lang.form.concurrency_file_changed_description')) ?></p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger btn-default-action" data-default-focus @click.prevent="onReloadClick"><?= e(trans('backend::lang.form.reload')) ?></button>
            <button type="button" class="btn btn-primary btn-default-action" @click.prevent="onSaveClick"><?= e(trans('backend::lang.form.save')) ?></button>

            <span class="button-separator"><?= e(trans('backend::lang.form.or')) ?></span>
            <button class="btn btn-link text-muted" @click.prevent="$refs.modal.hide()"><?= e(trans('backend::lang.form.cancel')) ?></button>
        </div>
    </template>
</backend-modal>