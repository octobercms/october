<!-- Checkbox -->
<div class="form-check" <?php if ($this->previewMode): ?>tabindex="0"<?php endif ?>>
    <input
        type="hidden"
        name="<?= $field->getName() ?>"
        value="0"
        <?= $this->previewMode ? 'disabled' : '' ?>
    />
    <input
        class="form-check-input"
        type="checkbox"
        id="<?= $field->getId() ?>"
        name="<?= $field->getName() ?>"
        value="1"
        <?= $this->previewMode ? 'disabled' : '' ?>
        <?= $field->isSelected() ? 'checked' : '' ?>
        <?= $field->getAttributes() ?>
    />

    <label class="form-check-label" for="<?= $field->getId() ?>">
        <?= e(__($field->label)) ?>
        <?php if ($field->tooltip): ?>
            <?= $this->makePartial('tooltip', ['field' => $field]) ?>
        <?php endif ?>
    </label>
    <?php if ($field->comment): ?>
        <p class="form-text"><?= $field->commentHtml ? trans($field->comment) : e(__($field->comment)) ?></p>
    <?php endif ?>
</div>
