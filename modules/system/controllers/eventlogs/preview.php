<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('system/eventlogs') ?>"><?= __("Event Log") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <div class="scoreboard">
        <div data-control="toolbar">
            <div class="scoreboard-item title-value">
                <h4><?= __("Event ID") ?></h4>
                <p>#<?= $formModel->id ?></p>
            </div>
            <div class="scoreboard-item title-value">
                <h4><?= __("Level") ?></h4>
                <p><?= $formModel->level ?></p>
            </div>
            <div class="scoreboard-item title-value">
                <h4><?= __("Date & Time") ?></h4>
                <p><?= $formModel->created_at->toDayDateTimeString() ?></p>
            </div>
        </div>
    </div>

    <div class="flex-grow-1">
        <?= $this->formRenderPreview() ?>
    </div>

<?php else: ?>

    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>

<?php endif ?>

<p>
    <a href="<?= Backend::url('system/eventlogs') ?>" class="btn btn-default oc-icon-chevron-left">
        <?= __("Return to Event Log") ?>
    </a>
</p>
