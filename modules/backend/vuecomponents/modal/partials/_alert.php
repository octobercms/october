<div
    data-default-button-text="<?= e(trans('backend::lang.form.ok')) ?>"
>
    <backend-modal
        ref="modal"
        :aria-labeled-by="modalTitleId"
        :unique-key="uniqueKey"
        :size="size"
        :storePosition="false"
        @hidden="onHidden"
    >
        <template v-slot:content>
            <div class="modal-header">
                <h4 class="modal-title" v-bind:id="modalTitleId" v-text="title"></h4>
                <button
                    @click.prevent="$refs.modal.hide()"
                    type="button"
                    class="btn-close"
                    aria-label="<?= e(trans('backend::lang.form.close')) ?>"
                    tabindex="0"
                    ></button>
            </div>
            <div class="modal-body">
                <p v-text="text"></p>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-primary btn-default-action"
                    data-default-focus
                    @click="$refs.modal.hide()"
                    v-text="primaryButtonText"
                ></button>
            </div>
        </template>
    </backend-modal>
</div>