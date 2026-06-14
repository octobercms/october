<div
    class="field-repeater repeater-mode-<?= $displayMode ?> <?= $useGroups ? 'is-grouped' : 'is-singular' ?>"
    data-control="repeater<?= $displayMode ?>"
    <?= $titleFrom ? 'data-title-from="'.$titleFrom.'"' : '' ?>
    <?= $minItems ? 'data-min-items="'.$minItems.'"' : '' ?>
    <?= $maxItems ? 'data-max-items="'.$maxItems.'"' : '' ?>
    data-use-reorder="<?= $showReorder ?>"
    data-items-expanded="<?= $itemsExpanded ?>"
    data-sortable-handle=".<?= $this->getId('items') ?>-handle"
    data-remove-handler="<?= $this->getEventHandler('onRemoveItem') ?>"
    data-remove-confirm="<?= e(trans('backend::lang.form.action_confirm')) ?>"
    data-use-duplicate="<?= $showDuplicate ?>"
    data-duplicate-handler="<?= $this->getEventHandler('onDuplicateItem') ?>"
    data-default-title="<?= e(trans('backend::lang.page.untitled')) ?>"
    <?php if ($externalToolbarBus): ?>data-external-toolbar-bus="<?= e($externalToolbarBus)?>"<?php endif ?>
>
    <!-- Passable fields -->
    <input type="hidden" name="<?= $name ?>" value="" data-repeater-pointer-input disabled />
    <input type="hidden" name="<?= $this->alias ?>_loaded" value="1" />

    <?php if ($displayMode === 'builder'): ?>
        <?= $this->makePartial('mode_builder') ?>
    <?php else: ?>
        <?= $this->makePartial('mode_accordion') ?>
    <?php endif ?>

    <?php if (!$this->previewMode): ?>
        <?= $this->makePartial('template_item_menu') ?>

        <?php if ($useGroups): ?>
            <?= $this->makePartial('template_group_palette') ?>
        <?php endif ?>
    <?php endif ?>
</div>
