<div
    data-control="media-manager"
    class="control-media-manager layout"
    data-alias="<?= $this->alias ?>"
    data-unique-id="<?= $this->getId() ?>"
    data-delete-empty="<?= e(trans('backend::lang.media.delete_empty')) ?>"
    data-delete-confirm="<?= e(trans('backend::lang.media.delete_confirm')) ?>"
    data-move-empty="<?= e(trans('backend::lang.media.move_empty')) ?>"
    data-select-single-image="<?= e(trans('backend::lang.media.select_single_image')) ?>"
    data-selection-not-image="<?= e(trans('backend::lang.media.selection_not_image')) ?>"
    data-overwrite-confirm="<?= e(trans('backend::lang.media.overwrite_confirm')) ?>"
    data-bottom-toolbar="<?= $this->bottomToolbar ? 'true' : 'false' ?>"
    data-crop-and-insert-button="<?= $this->cropAndInsertButton ? 'true' : 'false' ?>"
    data-read-only="<?= $this->readOnly ? 'true' : 'false' ?>"
    tabindex="0"
>

    <?= $this->makePartial('toolbar') ?>

    <?php if ($this->checkHasPermission('mediaCreate')): ?>
        <?= $this->makePartial('upload-progress') ?>
    <?php endif ?>

    <div class="layout-row whiteboard">
        <div class="layout">
            <div class="layout-row">
                <div class="layout-cell media-panel w-200 border-right" data-media-left-sidebar>
                    <?= $this->makePartial('left-sidebar') ?>
                </div>
                <div class="layout-cell">
                    <div class="layout">

                        <div class="layout-row min-size">
                            <?= $this->makePartial('folder-toolbar') ?>
                        </div>
                        <div class="layout-row">
                            <!-- Main area -->
                            <div class="layout">
                                <div class="layout-row">
                                    <div class="layout">
                                        <!-- Main area - list -->
                                        <div data-media-item-list>
                                            <div class="control-scrollpad">
                                                <div class="scroll-wrapper"> <!-- This element is required for the scrollpad control -->
                                                    <div id="<?= $this->getId('item-list') ?>" >
                                                        <?= $this->makePartial('item-list') ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="layout-cell w-300 media-panel border-left no-padding <?= !$sidebarVisible ? 'oc-hide' : null ?>" data-media-preview-sidebar>
                                            <!-- Right sidebar -->
                                            <?= $this->makePartial('right-sidebar') ?>
                                        </div>

                                    </div>
                                </div>

                                <div class="layout-row min-size oc-hide" data-media-bottom-toolbar>
                                    <?= $this->makePartial('bottom-toolbar') ?>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <?= $this->makePartial('new-folder-form') ?>
</div>
