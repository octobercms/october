<!-- Number -->
<?php if ($this->previewMode): ?>
    <span class="form-control"><?= ($field->value || (string) $field->value === '0') ? e($field->value) : '&nbsp;' ?></span>
<?php else: ?>
    <input
        type="number"
        step="<?= $field->step ?: 'any' ?>"
        name="<?= $field->getName() ?>"
        id="<?= $field->getId() ?>"
        value="<?= e($field->value) ?>"
        placeholder="<?= e(__($field->placeholder)) ?>"
        class="form-control <?= $field->step === null ? 'input-no-spinner' : '' ?>"
        autocomplete="off"
        <?= $field->min !== null ? 'min="' . $field->min . '"' : '' ?>
        <?= $field->max !== null ? 'max="' . $field->max . '"' : '' ?>
        <?= $field->hasAttribute('pattern') ? '' : 'pattern="-?\d+(\.\d+)?"' ?>
        <?= $field->hasAttribute('maxlength') ? '' : 'maxlength="255"' ?>
        <?= $field->getAttributes() ?>
    />
<?php endif ?>
