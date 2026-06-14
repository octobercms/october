<div
    data-control="formwidget"
    data-refresh-handler="<?= $this->getEventHandler('onRefresh') ?>"
    class="form-contents d-flex flex-column flex-grow-1 <?= $this->horizontalMode ? 'form-horizontal' : '' ?>"
    role="form"
    id="<?= $this->getId($renderSection.'Container') ?>">

    <?php if ($renderSection == 'outside'): ?>
        <?= $this->makePartial('section', ['tabs' => $outsideTabs]) ?>
    <?php endif ?>

    <?php if ($renderSection == 'primary'): ?>
        <?= $this->makePartial('section', ['tabs' => $primaryTabs]) ?>
    <?php endif ?>

    <?php if ($renderSection == 'secondary'): ?>
        <?= $this->makePartial('section', ['tabs' => $secondaryTabs]) ?>
    <?php endif ?>

</div>
