<!-- Rich Editor -->
<?php if ($this->previewMode): ?>
    <div class="form-control"><?= $value ?></div>
<?php else: ?>
    <div
        id="<?= $this->getId() ?>"
        class="field-richeditor size-<?= $size ?> <?= $stretch?'layout-relative stretch':'' ?> <?= $legacyMode ? '' : 'vue-mode' ?>"
        <?php if ($fullPage): ?>data-fullpage="true"<?php endif ?>
        <?php if ($useLineBreaks): ?>data-use-line-breaks="true"<?php endif ?>
        <?php if ($readOnly): ?>data-read-only="true"<?php endif ?>
        <?php if ($useMediaManager): ?>data-use-media-manager="true"<?php endif ?>
        <?php if ($editorLang): ?>data-editor-lang="<?= $editorLang ?>"<?php endif ?>
        <?php if ($toolbarButtons): ?>data-toolbar-buttons="<?= implode(',', $toolbarButtons) ?>"
        <?php elseif ($globalToolbarButtons): ?>data-toolbar-buttons="<?= str_replace(" ", "", $globalToolbarButtons) ?>"<?php endif ?>
        <?php if ($allowEmptyTags): ?>data-allow-empty-tags="<?= e($allowEmptyTags) ?>"<?php endif ?>
        <?php if ($allowTags): ?>data-allow-tags="<?= e($allowTags) ?>"<?php endif ?>
        <?php if ($allowAttrs): ?>data-allow-attrs="<?= e($allowAttrs) ?>"<?php endif ?>
        <?php if ($noWrapTags): ?>data-no-wrap-tags="<?= e($noWrapTags) ?>"<?php endif ?>
        <?php if ($removeTags): ?>data-remove-tags="<?= e($removeTags) ?>"<?php endif ?>
        <?php if ($lineBreakerTags): ?>data-line-breaker-tags="<?= e($lineBreakerTags) ?>"<?php endif ?>
        <?php if (isset($imageStyles)): ?>data-image-styles="<?= e(json_encode($imageStyles)) ?>"<?php endif ?>
        <?php if (isset($linkStyles)): ?>data-link-styles="<?= e(json_encode($linkStyles)) ?>"<?php endif ?>
        <?php if (isset($paragraphFormats)): ?>data-paragraph-format="<?= e(json_encode($paragraphFormats)) ?>"<?php endif ?>
        <?php if (isset($paragraphStyles)): ?>data-paragraph-styles="<?= e(json_encode($paragraphStyles)) ?>"<?php endif ?>
        <?php if (isset($inlineStyles)): ?>data-inline-styles="<?= e(json_encode($inlineStyles)) ?>"<?php endif ?>
        <?php if (isset($tableStyles)): ?>data-table-styles="<?= e(json_encode($tableStyles)) ?>"<?php endif ?>
        <?php if (isset($tableCellStyles)): ?>data-table-cell-styles="<?= e(json_encode($tableCellStyles)) ?>"<?php endif ?>
        <?php if (isset($editorOptions)): ?>data-editor-options="<?= e(json_encode($editorOptions)) ?>"<?php endif ?>
        <?php if ($showMargins): ?>data-show-margins="true"<?php endif ?>
        <?php if ($externalToolbarAppState): ?>data-external-toolbar-app-state="<?= e($externalToolbarAppState)?>"<?php endif ?>
        data-lang-fullscreen="<?= e(trans('backend::lang.form.toggle_full_screen')) ?>"
        data-legacy-mode="<?= $legacyMode ? 1 : 0 ?>"
        data-ace-vendor-path="<?= Url::asset('/modules/backend/formwidgets/codeeditor/assets/vendor/ace') ?>"
        data-control="richeditor">
            <?php if (!$legacyMode): ?><div class="editor-write layout-cell"><?php endif ?>
                <textarea
                    data-richeditor-textarea
                    placeholder="<?= e(__($field->placeholder)) ?>"
                    name="<?= $name ?>"
                    id="<?= $this->getId('textarea') ?>"
                    style="display: none"
                ><?= e($value) ?></textarea>
                <div class="height-indicator"></div>
            <?php if (!$legacyMode): ?></div><?php endif ?>
    </div>
<?php endif ?>
