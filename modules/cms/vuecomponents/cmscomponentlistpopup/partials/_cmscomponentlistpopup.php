<div>
    <backend-modal
        ref="modal"
        unique-key="cms-component-list-popup"
        aria-labeled-by="cms-component-list-popup-title"
        content-css-class="flex-layout-column"
        :resize-min-height="350"
        :close-by-esc="false"
        :resizable="true"
        :is-modal="false"
        :base-z-index="500"
    >
        <template v-slot:content>
            <div class="modal-header">
                <h4 class="modal-title" id="cms-component-list-popup-title"><?= e(trans('cms::lang.editor.component_list')) ?></h4>
                <button
                    @click.prevent="$refs.modal.hide()"
                    type="button"
                    class="btn-close"
                    aria-label="<?= __("Close") ?>"
                    tabindex="0"
                ></button>
            </div>
            <div>
                <p class="px-4 py-2 m-0 text-muted">
                    <small><?= e(trans('cms::lang.editor.component_list_description')) ?></small>
                </p>
            </div>
            <div class="flex-layout-item stretch relative cms-component-list-popup-treeview">
                <div ref="componentDragHostImageContainer" class="cms-component-ghost-image-container">
                    <img
                        ref="componentDragHostImage"
                        src="<?= Url::asset('/modules/cms/assets/images/component-drag-image.svg') ?>" />
                </div>
                <backend-treeview
                    aria-label="<?= e(trans('cms::lang.editor.component_list')) ?>"
                    :sections="componentListNodes"
                    :searchable="true"
                    :hide-sections="true"
                    :container-css-class="'layout-fill-container'"
                    unique-key="cms-component-list-popup-tree"
                    @nonselectablenodeclick="onNodeClick"
                    @customdragstart="onCustomDragStart"
                    ref="treeView"
                >
                </backend-treeview>
            </div>
        </template>
    </backend-modal>
</div>
