<?php
    $isHorizontal = $this->formGetWidget()->horizontalMode;
?>
<?php Block::put('form-contents') ?>

    <?= Block::placeholder('form:before-form') ?>

    <div class="flex-grow-1">
        <?= $this->formRenderOutsideFields(['useContainer' => false]) ?>
        <?= $this->formRenderPrimaryTabs(['useContainer' => false]) ?>
    </div>

    <?= Block::placeholder('form:after-form') ?>

    <?php if ($this->formGetContext() !== 'preview'): ?>
        <div class="form-buttons pt-3 <?= $isHorizontal ? 'is-horizontal' : '' ?>">
            <div data-control="loader-container">
                <?= $this->formRender(['section' => 'buttons']) ?>
            </div>
        </div>
    <?php endif ?>
<?php Block::endPut() ?>

<?php Block::put('form-sidebar') ?>
    <div class="hide-tabs">
        <?= $this->formRenderSecondaryTabs(['useContainer' => false]) ?>
    </div>
<?php Block::endPut() ?>

<?php Block::put('body') ?>
    <?= Form::open(['class'=>'position-relative h-100']) ?>
        <div
            id="<?= $this->formGetId() ?>"
            data-control="formwidget"
            data-refresh-handler="<?= $this->formGetWidget()->getEventHandler('onRefresh') ?>"
            class="form-widget form-elements <?= $isHorizontal ? 'form-horizontal' : '' ?>"
            role="form">
            <?= $this->makeLayout('form-with-sidebar', ['sidebarWidth' => $formSidebarWidth]) ?>
        </div>
    <?= Form::close() ?>
<?php Block::endPut() ?>
