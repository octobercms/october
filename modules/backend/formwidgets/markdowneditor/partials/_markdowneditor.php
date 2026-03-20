<?php if ($this->previewMode): ?>
    <div class="form-control"><?= Markdown::parse(e($value)) ?></div>
<?php else: ?>
    <div
        id="<?= $this->getId() ?>"
        class="field-markdowneditor size-<?= $size ?> <?= $stretch?'layout-relative stretch':'' ?> <?= $legacyMode ? '' : 'layout vue-mode' ?>"
        data-control="markdowneditor"
        data-refresh-handler="<?= $this->getEventHandler('onRefresh') ?>"
        data-view-mode="<?= $mode ?>"
        data-legacy-mode="<?= $legacyMode ? 1 : 0 ?>"
        data-lang-fullscreen="<?= e(trans('backend::lang.form.toggle_full_screen')) ?>"
        <?php if ($externalToolbarAppState): ?>data-external-toolbar-app-state="<?= e($externalToolbarAppState)?>"<?php endif ?>
        <?php if ($useMediaManager): ?>data-use-media-manager="true"<?php endif ?>
        <?php if (!$sideBySide): ?>data-side-by-side="false"<?php endif ?>
        data-vendor-path="<?= Url::asset('/modules/backend/formwidgets/codeeditor/assets/vendor/ace') ?>">

        <?php if (!$legacyMode): ?><div class="layout-row"><?php endif ?>

        <div class="control-toolbar editor-toolbar"></div>

        <div class="editor-write layout-cell">
            <textarea name="<?= $name ?>" id="<?= $this->getId('textarea') ?>"><?= e($value) ?></textarea>
        </div>

        <div class="editor-preview layout-cell"></div>

        <?php if (!$legacyMode): ?></div><?php endif ?>
    </div>
<?php endif ?>
