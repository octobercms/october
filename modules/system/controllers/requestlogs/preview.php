<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('system/requestlogs') ?>"><?= __("Request Log") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <div class="scoreboard">
        <div data-control="toolbar">
            <div class="scoreboard-item title-value">
                <h4><?= __("Log ID") ?></h4>
                <p>#<?= $formModel->id ?></p>
            </div>
            <div class="scoreboard-item title-value">
                <h4><?= __("Status") ?></h4>
                <p><?= $formModel->status_code ?></p>
            </div>
            <div class="scoreboard-item title-value">
                <h4><?= __("Counter") ?></h4>
                <p><?= $formModel->count ?></p>
            </div>
            <div class="scoreboard-item title-value">
                <h4><?= __("Referers") ?></h4>
                <p><?= $formModel->referer ? count($formModel->referer) : 0 ?></p>
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
    <a href="<?= Backend::url('system/requestlogs') ?>" class="btn btn-default oc-icon-chevron-left">
        <?= e(trans('system::lang.request_log.return_link')) ?>
    </a>
</p>
