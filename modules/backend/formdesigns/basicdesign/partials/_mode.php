<?php
    $isHorizontal = $this->formGetWidget()->horizontalMode;
?>
<?= Form::open(['class' => 'd-flex flex-column h-100 design-basic']) ?>

    <?= Block::placeholder('form:before-form') ?>

    <div class="flex-grow-1">
        <?= $this->formRender($options) ?>
    </div>

    <?= Block::placeholder('form:after-form') ?>

    <?php if ($this->formGetContext() !== 'preview'): ?>
        <div class="form-buttons pt-3 <?= $isHorizontal ? 'is-horizontal' : '' ?>">
            <div data-control="loader-container">
                <?= $this->formRender(['section' => 'buttons']) ?>
            </div>
        </div>
    <?php endif ?>

<?= Form::close() ?>
