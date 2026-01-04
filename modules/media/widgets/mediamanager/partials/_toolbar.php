<div class="layout-row min-size">
    <div class="control-toolbar toolbar-padded">
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar">
                <?php if ($this->checkHasPermission('mediaCreate')): ?>
                    <div class="btn-group offset-right">
                        <button type="button" class="btn btn-primary oc-icon-upload" data-media-upload
                            ><?= e(trans('backend::lang.media.upload')) ?></button>
                        <button type="button" class="btn btn-primary oc-icon-folder" data-command="create-folder"><?= e(trans('backend::lang.media.add_folder')) ?></button>
                    </div>
                <?php endif ?>

                <button type="button" class="btn btn-secondary oc-icon-refresh empty offset-right" data-command="refresh"></button>

                <?php if ($this->checkHasPermission('mediaDelete')): ?>
                    <div class="btn-group offset-right">
                        <button type="button" class="btn btn-secondary oc-icon-mail-reply-all" data-command="move"
                            ><?= e(trans('backend::lang.media.move')) ?></button>
                        <button type="button" class="btn btn-secondary oc-icon-trash" data-command="delete"
                            ><?= e(trans('backend::lang.media.delete')) ?></button>
                    </div>
                <?php endif ?>

                <div class="btn-group offset-right" id="<?= $this->getId('view-mode-buttons') ?>">
                    <?= $this->makePartial('view-mode-buttons') ?>
                </div>
            </div>
        </div>
        <div class="toolbar-item" data-calculate-width>
            <div class="relative loading-indicator-container size-input-text">
                <div class="search-input-container storm-icon-pseudo">
                    <input
                        type="text"
                        name="search"
                        value="<?= e($searchTerm) ?>"
                        class="form-control is-growable is-searchable"
                        placeholder="<?= e(trans('backend::lang.media.search')) ?>"
                        data-media-search
                        autocomplete="off"
                        data-load-indicator
                        data-load-indicator-opaque
                    />
                </div>
            </div>
        </div>
    </div>
</div>
