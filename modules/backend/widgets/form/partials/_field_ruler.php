<!-- Horizontal Rule -->
<?php if ($field->label): ?>
    <label for="<?= $field->getId() ?>" class="form-label">
        <?= e(__($field->label)) ?>
    </label>
<?php endif ?>
<div class="field-horizontalrule">
    <hr />
</div>
<?php if ($field->comment): ?>
    <p class="form-text">
        <?= $field->commentHtml ? trans($field->comment) : e(__($field->comment)) ?>
    </p>
<?php endif ?>
