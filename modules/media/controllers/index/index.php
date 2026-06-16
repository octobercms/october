<?= Block::put('body') ?>
    <?= Form::open(['class'=>'d-flex flex-column h-100', 'onsubmit'=>'return false']) ?>
        <?= $this->widget->manager->render() ?>
    <?= Form::close() ?>
<?= Block::endPut() ?>
