<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('system/mailtemplates/index/partials') ?>"><?= __("Mail Partials") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?= Form::open(['class'=>'layout']) ?>

        <div class="layout-row">
            <?= $this->formRender() ?>
        </div>

        <div class="form-buttons pt-4">
            <div data-control="loader-container" class="control-loader-container">
                <?= Ui::ajaxButton(
                    label: __("Create"),
                    handler: 'onSave',
                    primary: true,
                    hotkey: ['ctrl+s', 'cmd+s'],
                    dataRequestMessage: __("Creating :name...", ['name' => $formRecordName])
                ) ?>
                <?= Ui::ajaxButton(
                    label: __("Create & Close"),
                    handler: 'onSave',
                    secondary: true,
                    hotkey: ['ctrl+enter', 'cmd+enter'],
                    dataRequestData: "close: true",
                    dataRequestMessage: __("Creating :name...", ['name' => $formRecordName])
                ) ?>
                <span class="btn-text">
                    <span class="button-separator"><?= __("or") ?></span>
                    <?= Ui::button(
                        label: __("Cancel"),
                        href: Backend::url('system/mailtemplates/index/partials'),
                        class: 'btn-link p-0'
                    ) ?>
                </span>
            </div>
        </div>

    <?= Form::close() ?>

<?php else: ?>

    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
    <p>
        <?= Ui::button(
            label: __("Return to Mail Templates"),
            href: Backend::url('system/mailtemplates/index/partials'),
            secondary: true
        ) ?>
    </p>

<?php endif ?>
