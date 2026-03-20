<?php
    $translatableSites = $this->getTranslatableSites($this->model, $field);
?>
<?php if ($translatableSites->isNotEmpty()): ?>
    <span class="form-translatable <?= $field->label ? '' : 'no-label' ?> dropdown">
        <i class="icon-globe" data-bs-toggle="dropdown" role="button"></i>
        <ul class="dropdown-menu">
            <?php foreach ($translatableSites as $translatableSite): ?>
                <li>
                    <a
                        class="dropdown-item"
                        href="javascript:;"
                        data-control="popup"
                        data-handler="<?= $this->getEventHandler('onLoadTranslateField') ?>"
                        data-request-data="field_name: '<?= e($field->fieldName) ?>', site_id: '<?= e($translatableSite->id) ?>'"
                    ><?= e($translatableSite->name) ?></a>
                </li>
            <?php endforeach ?>
        </ul>
    </span>
<?php endif ?>
