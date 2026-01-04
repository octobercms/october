<?php if (!$field->hidden): ?>
    <?php
        $showLabels = $this->showFieldLabels($field);
    ?>
    <div class="row mb-1">
        <div class="col-horizontal">
            <?php if ($showLabels): ?>
                <?php if ($field->label): ?>
                    <label for="<?= $field->getId() ?>" class="col-form-label">
                        <?= e(__($field->label)) ?>
                        <?php if ($field->tooltip): ?>
                            <?= $this->makePartial('tooltip', ['field' => $field]) ?>
                        <?php endif ?>
                    </label>
                <?php endif ?>

                <?php if ($field->translatable): ?>
                    <span class="form-translatable <?= $field->label ? '' : 'no-label' ?>">
                        <i class="icon-globe" data-bs-toggle="tooltip" data-bs-delay="300" title="<?= e($field->getTranslatableMessage()) ?>"></i>
                    </span>
                <?php endif ?>

                <?php if ($fieldComment = $field->commentAbove): ?>
                    <p class="form-text before-field"><?= $field->commentHtml ? trans($fieldComment) : e(__($fieldComment)) ?></p>
                <?php endif ?>
            <?php endif ?>
        </div>
        <div class="col">
            <?= $this->renderFieldElement($field) ?>

            <?php if ($showLabels): ?>
                <?php if ($fieldComment = $field->comment): ?>
                    <p class="form-text"><?= $field->commentHtml ? trans($fieldComment) : e(__($fieldComment)) ?></p>
                <?php endif ?>
            <?php endif ?>
        </div>
    </div>
<?php endif ?>
