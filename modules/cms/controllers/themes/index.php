<?= Block::put('body') ?>
    <div class="d-flex flex-column h-100">
        <div class="flex-grow-1">
            <?= Form::open(['onsubmit'=>'return false']) ?>
            <div class="theme-selector-layout" id="theme-list">
                <?= $this->makePartial('theme_list') ?>
            </div>
            <?= Form::close() ?>
        </div>
    </div>
<?= Block::endPut() ?>