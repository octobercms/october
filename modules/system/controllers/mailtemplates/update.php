<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('system/mailtemplates') ?>"><?= __("Mail Templates") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?= Form::open(['class'=>'layout']) ?>

        <div class="layout-row min-size">
            <div class="scoreboard">
                <div data-control="toolbar">
                    <div class="scoreboard-item title-value">
                        <h4><?= __("Template") ?></h4>
                        <p><?= e($formModel->code) ?></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="layout-row">
            <?= $this->formRender() ?>
        </div>

        <div class="form-buttons pt-4">
            <div data-control="loader-container" class="control-loader-container">
                <?= Ui::ajaxButton(
                    label: __("Save"),
                    handler: 'onSave',
                    primary: true,
                    hotkey: ['ctrl+s', 'cmd+s'],
                    dataRequestData: "redirect: false",
                    dataRequestMessage: __("Saving :name...", ['name' => $formRecordName])
                ) ?>
                <?= Ui::ajaxButton(
                    label: __("Save & Close"),
                    handler: 'onSave',
                    secondary: true,
                    hotkey: ['ctrl+enter', 'cmd+enter'],
                    dataRequestData: "close: true",
                    dataRequestMessage: __("Saving :name...", ['name' => $formRecordName])
                ) ?>
                <?= Ui::ajaxButton(
                    label: __("Send Test"),
                    handler: 'onTest',
                    class: 'btn-info',
                    dataRequestConfirm: __("Send a test message to :email?", ['email' => BackendAuth::getUser()->email]),
                    dataRequestMessage: __("Sending...")
                ) ?>
                <?= Ui::iconButton(
                    label: __("Delete"),
                    icon: 'oc-icon-delete',
                    handler: 'onDelete',
                    danger: true,
                    class: 'pull-right',
                    dataRequestConfirm: __("Are you sure?"),
                    dataRequestMessage: __("Deleting :name...", ['name' => $formRecordName])
                ) ?>
                <span class="btn-text">
                    <span class="button-separator"><?= __("or") ?></span>
                    <?= Ui::button(
                        label: __("Cancel"),
                        href: Backend::url('system/mailtemplates'),
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
            href: Backend::url('system/mailtemplates'),
            secondary: true
        ) ?>
    </p>

<?php endif ?>
