<?php
    $emptyOption = $field->getConfig('emptyOption', $field->placeholder);
    $useSearch = $field->getConfig('showSearch', true);
    $flatOptions = $emptyOption ? ['' => __($emptyOption)] + $field->options() : $field->options();
    $fieldOptions = $field->asOptionsDefinition($flatOptions);
?>
<?php $renderDropdownOptionFunc = function($option, $value, $depth = 0) use (&$renderDropdownOptionFunc, $field) { ?>
    <?php
        $indentStr = str_repeat('&nbsp;&nbsp;&nbsp;', $depth);
    ?>
    <option
        <?= $field->isSelected($value) ? 'selected="selected"' : '' ?>
        <?php if ($option->color): ?>
            data-status="<?= e($option->color) ?>"
        <?php elseif ($option->image): ?>
            data-image="<?= e($option->image) ?>"
        <?php elseif ($option->icon): ?>
            data-icon="<?= e($option->icon) ?>"
        <?php endif ?>
        value="<?= e($value) ?>"
    ><?= $indentStr ?><?= $field->getDisplayValue($option->label) ?></option>

    <?php if ($option->children): ?>
        <?php foreach ($option->children as $value => $option): ?>
            <?php $renderDropdownOptionFunc($option, $value, $depth + 1) ?>
        <?php endforeach ?>
    <?php endif ?>
<?php }; ?>

<!-- Dropdown -->
<?php if ($this->previewMode || $field->readOnly): ?>
    <div class="form-control" <?= $field->readOnly ? 'readonly' : '' ?>>
        <?php if ($option = $fieldOptions[$field->value] ?? null): ?>
            <?php if ($option->color): ?>
                <span class="status-indicator" style="background:<?= e($option->color) ?>"></span>
            <?php elseif ($option->image): ?>
                <img src="<?= e($option->image) ?>" alt="" />
            <?php elseif ($option->icon): ?>
                <i class="<?= e($option->icon) ?>"></i>
            <?php endif ?>
            <?= $field->getDisplayValue($option->label) ?>
        <?php endif ?>
    </div>
    <?php if ($field->readOnly): ?>
        <input
            type="hidden"
            name="<?= $field->getName() ?>"
            value="<?= e($field->value) ?>" />
    <?php endif ?>
<?php else: ?>
    <select
        id="<?= $field->getId() ?>"
        name="<?= $field->getName() ?>"
        class="form-control custom-select <?= $useSearch ? '' : 'select-no-search' ?>"
        <?= $field->getAttributes() ?>
        <?= $field->placeholder ? 'data-placeholder="'.e(__($field->placeholder)).'"' : '' ?>
    >
        <?php foreach ($fieldOptions as $value => $option): ?>
            <?php if ($option->optgroup): ?>
                <optgroup label="<?= $field->getDisplayValue($option->label) ?>">
                    <?php foreach ($option->children as $value => $option): ?>
                        <?php $renderDropdownOptionFunc($option, $value) ?>
                    <?php endforeach ?>
                </optgroup>
            <?php else: ?>
                <?php $renderDropdownOptionFunc($option, $value) ?>
            <?php endif ?>
        <?php endforeach ?>
    </select>
<?php endif ?>
