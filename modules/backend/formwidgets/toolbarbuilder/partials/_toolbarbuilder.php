<!-- Toolbar Builder -->
<div
    class="field-toolbarbuilder"
    data-control="toolbarbuilder"
    data-buttons="<?= e($buttons) ?>"
    data-reset-label="<?= e(__('Reset to Default')) ?>"
    <?php if ($seededButtons !== null): ?>data-seeded="<?= e($seededButtons) ?>"<?php endif ?>
    <?php if ($inheritedButtons !== null): ?>data-inherited="<?= e($inheritedButtons) ?>"<?php endif ?>
    <?php if ($injectable): ?>data-injectable<?php endif ?>
    <?= $field->getAttributes() ?>
>
    <ul class="builder-toolbar" data-toolbar-row></ul>
    <h5 class="builder-palette-title">
        <?= e(__('Available Buttons')) ?>
    </h5>
    <ul class="builder-palette" data-toolbar-palette></ul>
    <input
        type="hidden"
        name="<?= e($name) ?>"
        value="<?= e($buttons) ?>"
        data-builder-input
    />
</div>
