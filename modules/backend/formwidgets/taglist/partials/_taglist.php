<?php
    $selectedValues = is_array($selectedValues) ? $selectedValues : [];
    $flatOptions = $this->getFieldOptions();
    $fieldOptions = $field->asOptionsDefinition($flatOptions);
    $hasSelectableOptions = (bool) count($fieldOptions);
    if (!$useKey) {
        $fieldOptions = $field->asOptionsDefinition($this->getKeylessOptions($selectedValues, $fieldOptions));
    }
    $previewOptions = $this->getPreviewOptions($selectedValues, $fieldOptions);
?>
<?php $renderTaglistOptionFunc = function($option, $value, $depth = 0) use (&$renderTaglistOptionFunc, $field, $selectedValues, $useKey) { ?>
    <?php
        $indentStr = str_repeat('&nbsp;&nbsp;&nbsp;', $depth);
        $isSelected = $useKey ? in_array($value, $selectedValues) : in_array($option->label, $selectedValues);
    ?>
    <option
        <?= $isSelected ? 'selected="selected"' : '' ?>
        <?php if ($option->color): ?>
            data-status="<?= e($option->color) ?>"
        <?php elseif ($option->image): ?>
            data-image="<?= e($option->image) ?>"
        <?php elseif ($option->icon): ?>
            data-icon="<?= e($option->icon) ?>"
        <?php endif ?>
        value="<?= e($useKey ? $value : $option->label) ?>"
    ><?= $indentStr ?><?= $field->getDisplayValue($option->label) ?></option>

    <?php if ($option->children): ?>
        <?php foreach ($option->children as $value => $option): ?>
            <?php $renderTaglistOptionFunc($option, $value, $depth + 1) ?>
        <?php endforeach ?>
    <?php endif ?>
<?php }; ?>

<!-- Tag List -->
<?php if ($this->previewMode || $field->readOnly || $field->disabled): ?>
    <ul class="form-control taglist--preview" <?= $field->readOnly || $field->disabled ? 'disabled="disabled"' : '' ?>>
        <?php foreach ($previewOptions as $option): ?>
            <li class="taglist__item"><?= $field->getDisplayValue($option->label) ?></li>
        <?php endforeach ?>
    </ul>
    <?php if ($field->readOnly): ?>
        <?php if (is_array($field->value)): ?>
            <?php foreach ($previewOptions as $option): ?>
                <input
                    type="hidden"
                    name="<?= $field->getName() ?>[]"
                    value="<?= $option->value ?>" />
            <?php endforeach ?>
        <?php else: ?>
            <input
                type="hidden"
                name="<?= $field->getName() ?>"
                value="<?= $field->value ?>" />
        <?php endif ?>
    <?php endif ?>
<?php else: ?>
    <input
        type="hidden"
        name="<?= $field->getName() ?>"
        value="" />
    <select
        id="<?= $field->getId() ?>"
        name="<?= $field->getName() ?>[]"
        class="form-control custom-select <?= !$hasSelectableOptions ? 'select-no-dropdown' : '' ?> select-hide-selected"
        <?= $customSeparators ? 'data-token-separators="'.$customSeparators.'"' : '' ?>
        <?= $placeholder ? 'data-placeholder="'.e(__($placeholder)).'"' : '' ?>
        <?= $maxItems ? 'data-maximum-selection-length="'.$maxItems.'"' : '' ?>
        multiple
        <?= $field->getAttributes() ?>>
        <?php foreach ($fieldOptions as $key => $option): ?>
            <?php $renderTaglistOptionFunc($option, $key) ?>
        <?php endforeach ?>
    </select>
<?php endif ?>
