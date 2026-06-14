<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('cms/themelogs') ?>"><?= e(trans('cms::lang.theme_log.menu_label')) ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <div class="scoreboard">
        <div data-control="toolbar">
            <?= $this->makePartial('preview_scoreboard') ?>
        </div>
    </div>

    <div>
        <?= $this->makePartial('hint_preview') ?>
    </div>

    <div class="flex-grow-1">
        <?= $this->formRenderPreview() ?>
    </div>

<?php else: ?>

    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>

<?php endif ?>

<p>
    <a href="<?= Backend::url('cms/themelogs') ?>" class="btn btn-default oc-icon-chevron-left">
        <?= e(trans('cms::lang.theme_log.return_link')) ?>
    </a>
</p>
