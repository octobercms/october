<?php if (!$field->hidden): ?>

    <?php if (!$this->showFieldLabels($field)): ?>

        <?= $this->renderFieldElement($field) ?>

    <?php else: ?>

        <?php if ($field->label): ?>
            <label for="<?= $field->getId() ?>" class="form-label">
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

        <?= $this->renderFieldElement($field) ?>

        <?php if ($fieldComment = $field->comment): ?>
            <p class="form-text"><?= $field->commentHtml ? trans($fieldComment) : e(__($fieldComment)) ?></p>
        <?php endif ?>

    <?php endif ?>

<?php endif ?>
