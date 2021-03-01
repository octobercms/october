<?php
    $fieldOptions = $field->options();
    $checkedValues = (array) $field->value;
    $isScrollable = count($fieldOptions) > 10;
    $readOnly = $this->previewMode || $field->readOnly || $field->disabled;
    $quickselectEnabled = $field->getConfig('quickselect', $isScrollable);
?>
<!-- Checkbox List -->
<?php if ($readOnly && $field->value): ?>

    <div class="field-checkboxlist">
        <?php $index = 0; foreach ($fieldOptions as $value => $option): ?>
            <?php
                $index++;
                $checkboxId = 'checkbox_'.$field->getId().'_'.$index;
                if (!in_array($value, $checkedValues)) continue;
                if (!is_array($option)) $option = [$option];
            ?>
            <div class="checkbox custom-checkbox">
                <input
                    type="checkbox"
                    id="<?= $checkboxId ?>"
                    name="<?= $field->getName() ?>[]"
                    value="<?= e($value) ?>"
                    disabled="disabled"
                    checked="checked">

                <label for="<?= $checkboxId ?>">
                    <?= e(trans($option[0])) ?>
                </label>
                <?php if (isset($option[1])): ?>
                    <p class="help-block"><?= e(trans($option[1])) ?></p>
                <?php endif ?>
            </div>
        <?php endforeach ?>
    </div>

<?php elseif (!$readOnly && count($fieldOptions)): ?>

    <div class="field-checkboxlist <?= $isScrollable ? 'is-scrollable' : '' ?>">
        <?php if ($quickselectEnabled): ?>
            <!-- Quick selection -->
            <div class="checkboxlist-controls">
                <div>
                    <a href="javascript:;" data-field-checkboxlist-all>
                        <i class="icon-check-square"></i> <?= e(trans('backend::lang.form.select_all')) ?>
                    </a>
                </div>
                <div>
                    <a href="javascript:;" data-field-checkboxlist-none>
                        <i class="icon-eraser"></i> <?= e(trans('backend::lang.form.select_none')) ?>
                    </a>
                </div>
            </div>
        <?php endif ?>

        <div class="field-checkboxlist-inner">

            <?php if ($isScrollable): ?>
                <!-- Scrollable Checkbox list -->
                <div class="field-checkboxlist-scrollable">
                    <div class="control-scrollbar" data-control="scrollbar">
            <?php endif ?>

            <input
                type="hidden"
                name="<?= $field->getName() ?>"
                value="0" />

            <?php $index = 0; foreach ($fieldOptions as $value => $option): ?>
                <?php
                    $index++;
                    $checkboxId = 'checkbox_'.$field->getId().'_'.$index;
                    if (!is_array($option)) $option = [$option];
                ?>
                <div class="checkbox custom-checkbox">
                    <input
                        type="checkbox"
                        id="<?= $checkboxId ?>"
                        name="<?= $field->getName() ?>[]"
                        value="<?= e($value) ?>"
                        <?= in_array($value, $checkedValues) ? 'checked="checked"' : '' ?>>

                    <label for="<?= $checkboxId ?>">
                        <?= e(trans($option[0])) ?>
                    </label>
                    <?php if (isset($option[1])): ?>
                        <p class="help-block"><?= e(trans($option[1])) ?></p>
                    <?php endif ?>
                </div>
            <?php endforeach ?>

            <?php if ($isScrollable): ?>
                    </div>
                </div>
            <?php endif ?>

        </div>

    </div>

<?php else: ?>

    <!-- No options specified -->
    <?php if ($field->placeholder): ?>
        <p><?= e(trans($field->placeholder)) ?></p>
    <?php endif ?>

<?php endif ?>
