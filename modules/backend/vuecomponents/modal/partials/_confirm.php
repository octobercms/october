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
                    :class="{'btn-primary': !isDanger, 'btn-danger': isDanger}"
                    v-bind:data-default-focus="!isDanger"
                    @click="onButtonClick"
                    v-text="primaryButtonText"
                ></button>
                <span class="button-separator"><?= e(trans('backend::lang.form.or')) ?></span>
                <button
                    class="btn btn-link text-muted"
                    @click.prevent="$refs.modal.hide()"
                    v-bind:data-default-focus="isDanger"
                ><?= e(trans('backend::lang.form.cancel')) ?></button>
            </div>
        </template>
    </backend-modal>
</div>