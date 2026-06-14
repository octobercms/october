<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('tailor/entries/'.$this->activeSource->handleSlug) ?>"><?= e($this->activeSource->name) ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?= Form::open(['class' => 'd-flex flex-column h-100']) ?>

    <div class="flex-grow-1">
        <?= $this->importRender() ?>
    </div>

    <div class="form-buttons">
        <button
            type="submit"
            data-control="popup"
            data-handler="onImportLoadForm"
            data-keyboard="false"
            class="btn btn-primary">
            <?= __("Import Entries") ?>
        </button>
    </div>

<?= Form::close() ?>
