<div
    class="form-group <?= $this->previewMode ? 'form-group-preview' : '' ?> <?= $field->type ?>-field span-<?= $field->span ?> <?= $field->spanClass ?> <?= $field->required ? 'is-required' : '' ?> <?= $field->stretch ? 'form-field-stretch' : '' ?> <?= $field->cssClass ?>"
    <?php if ($depends = $this->getFieldDepends($field)): ?>data-field-depends="<?= $depends ?>"<?php endif ?>
    <?php if ($field->changeHandler): ?>data-change-handler="<?= e($field->changeHandler) ?>"<?php endif ?>
    data-field-name="<?= $field->fieldName ?>"
    <?= $field->getAttributes('container') ?>
    id="<?= $field->getId('group') ?>"><?=
    /* Must be on the same line for :empty selector */
    trim($this->makePartial($this->horizontalMode ? 'horizontal_field' : 'field', [
        'field' => $field
    ]))
?></div>
