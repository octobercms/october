<div class="loading-indicator-container m-t">
    <div class="loading-indicator indicator-center">
        <span></span>
    </div>
</div>
<?php
// Do not create a hidden field for these field types since
// they don't contain any form data.
$ignoredTypes = ['section', 'partial'];

foreach ($fields as $field):
    if (in_array($field->type, $ignoredTypes)) continue;

    $isMultiValue = is_array($field->value);
    foreach (array_wrap($field->value) as $index => $value):
        // Use array field names if the field has multiple values (repeater, checkboxlist, etc.).
        $fieldName = $isMultiValue ? sprintf('%s[%s]', $field->getName(), $index) : $field->getName();

        $valueIsArray = is_array($value);
        foreach (array_wrap($value) as $index => $value):
            // Set the correct array keys if the value is an array (repeater form fields).
            $currentFieldName = $valueIsArray ? sprintf('%s[%s]', $fieldName, $index) : $fieldName;
?>
        <input
                type="hidden"
                name="<?= $currentFieldName ?>"
                id="<?= $this->nameToId($currentFieldName) ?>"
                value="<?= e($value) ?>"
                <?= $field->getAttributes() ?>
        />
        <?php endforeach ?>
    <?php endforeach ?>
<?php endforeach ?>
