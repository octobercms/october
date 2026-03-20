<div
    data-default-button-text="<?= e(trans('backend::lang.form.ok')) ?>"
>
    <backend-modal
        ref="modal"
        :aria-labeled-by="modalTitleId"
        :unique-key="uniqueId"
        :size="size"
        :store-position="true"
        :resizable="resizableWidth ? 'horizontal' : false"
        :resize-default-width="600"
        :close-by-esc="!readOnly"
        :modal-temporary-hidden="layoutUpdateData.modalTemporaryHidden"
        @hidden="onHidden"
        @resized="onResized"
        @shown="onShown"
        @enterkey="onEnterKey"
    >
        <template v-slot:content>
            <div class="modal-header">
                <h4 class="modal-title" v-bind:id="modalTitleId" v-text="title"></h4>
                <button
                    @click.prevent="onCloseClick"
                    type="button"
                    class="btn-close"
                    v-bind:disabled="readOnly"
                    aria-label="<?= e(trans('backend::lang.form.close')) ?>"
                    tabindex="0"
                    ></button>
            </div>
            <div class="modal-body inspector-modal-host">
                <backend-inspector
                    :data-schema="dataSchema"
                    :data="data"
                    :live-mode="liveMode"
                    :unique-id="uniqueId"
                    :handler-alias="handlerAlias"
                    :layout-update-data="layoutUpdateData"
                    :read-only="readOnly"
                    ref="inspector"
                >
                </backend-inspector>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-primary btn-default-action"
                    data-default-focus
                    @click="onApplyClick"
                    v-text="primaryButtonText"
                    v-bind:disabled="readOnly"
                ></button>
                <span class="button-separator"><?= e(trans('backend::lang.form.or')) ?></span>
                <button
                    class="btn btn-link text-muted"
                    :class="{disabled: readOnly}"
                    @click.prevent="onCancelClick"
                ><?= e(trans('backend::lang.form.cancel')) ?></button>
            </div>
        </template>
    </backend-modal>
</div>