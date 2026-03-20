<?php if (!$this->fatalError): ?>
    <?php Block::put('breadcrumb') ?>
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="<?= Backend::url('tailor/entries/'.$activeSource->handleSlug) ?>"><?= $activeSource->name ?></a></li>
            <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
        </ol>
    <?php Block::endPut() ?>

    <?php Block::put('form-contents') ?>

        <?= $this->makePartial('form_history_links') ?>

        <div class="layout-row min-size">
            <?= $this->formRenderOutsideFields() ?>
        </div>

        <div class="layout-row" id="entryPrimaryTabs">
            <?= $this->formRenderPrimaryTabs() ?>
        </div>

        <div class="form-buttons">
            <div data-control="loader-container" class="control-loader-container">
                <?= Ui::ajaxButton(
                    label: __("Restore this Version"),
                    handler: 'onRestoreVersion',
                    primary: true,
                    dataRequestMessage: __("Saving :name...", ['name' => $entityName])
                ) ?>
            </div>
        </div>

    <?php Block::endPut() ?>

    <?php Block::put('form-sidebar') ?>
        <div class="hide-tabs"><?= $this->formRenderSecondaryTabs() ?></div>
    <?php Block::endPut() ?>

    <?php Block::put('body') ?>
        <?= Form::open(['class'=>'layout stretch']) ?>
            <?= $this->makeLayout('form-with-sidebar') ?>
        <?= Form::close() ?>
    <?php Block::endPut() ?>

<?php else: ?>

    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>

    <p>
        <?= Ui::button(
            label: __("Return to Entries"),
            href: Backend::url('tailor/entries'),
            secondary: true
        ) ?>
    </p>

<?php endif ?>
