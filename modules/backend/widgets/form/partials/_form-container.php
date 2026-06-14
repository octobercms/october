<div
    id="<?= $this->getId() ?>"
    data-control="formwidget"
    data-refresh-handler="<?= $this->getEventHandler('onRefresh') ?>"
    class="form-widget form-elements <?= $this->horizontalMode ? 'form-horizontal' : '' ?>"
    role="form">
    <?= $this->makePartial('form') ?>
</div>
