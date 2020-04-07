<?php
    $fieldOptions = $field->options();
?>
<!-- Radio List -->
<?php if (count($fieldOptions)): ?>

    <?php $index = 0; foreach ($fieldOptions as $value => $option): ?>
        <?php
            $index++;
            if (is_string($option))
                $option = array($option);

            $fieldId = md5(uniqid($field->getId($index), true));
        ?>
        <div class="radio custom-radio">

            <input
                id="<?= $fieldId ?>"
                name="<?= $field->getName() ?>"
                value="<?= e($value) ?>"
                type="radio"
                <?= $field->isSelected($value) ? 'checked="checked"' : '' ?>
                <?= $this->previewMode ? 'disabled="disabled"' : '' ?>
                <?= $field->getAttributes() ?>>

            <label for="<?= $fieldId ?>">
                <?= e(trans($option[0])) ?>
            </label>
            <?php if (isset($option[1])): ?>
                <p class="help-block"><?= e(trans($option[1])) ?></p>
            <?php endif ?>
        </div>
    <?php endforeach ?>

<?php else: ?>

    <!-- No options specified -->
    <?php if ($field->placeholder): ?>
        <p><?= e(trans($field->placeholder)) ?></p>
    <?php endif ?>

<?php endif ?>
