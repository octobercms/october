<?php if ($this->previewMode): ?>
    <div class="form-control"><?= Markdown::parse(e($value)) ?></div>
<?php else: ?>
    <div
        id="<?= $this->getId() ?>"
        class="field-markdowneditor size-<?= $size ?> <?= $stretch ? 'is-stretch' : '' ?> <?= $legacyMode ? '' : 'vue-mode' ?>"
        data-control="markdowneditor"
        data-refresh-handler="<?= $this->getEventHandler('onRefresh') ?>"
        data-view-mode="<?= $mode ?>"
        data-legacy-mode="<?= $legacyMode ? 1 : 0 ?>"
        data-lang-fullscreen="<?= e(trans('backend::lang.form.toggle_full_screen')) ?>"
        <?php if ($externalToolbarBus): ?>data-external-toolbar-bus="<?= e($externalToolbarBus)?>"<?php endif ?>
        <?php if ($useMediaManager): ?>data-use-media-manager="true"<?php endif ?>
        <?php if (!$sideBySide): ?>data-side-by-side="false"<?php endif ?>
        data-vendor-path="<?= Url::asset('/modules/backend/formwidgets/codeeditor/assets/vendor/ace') ?>">

        <?php if (!$legacyMode): ?><div class="editor-columns"><?php endif ?>

        <div class="control-toolbar editor-toolbar"></div>

        <div class="editor-write">
            <textarea name="<?= $name ?>" id="<?= $this->getId('textarea') ?>"><?= e($value) ?></textarea>
        </div>

        <div class="editor-preview"></div>

        <?php if (!$legacyMode): ?></div><?php endif ?>
    </div>
<?php endif ?>
