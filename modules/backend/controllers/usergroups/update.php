<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('backend/usergroups') ?>"><?= __("Team Groups") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?= Form::open(['class'=>'layout']) ?>

        <div class="layout-row">
            <?= $this->formRender() ?>
        </div>

        <div class="form-buttons">
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
                <?= Ui::iconButton(
                    label: __("Delete"),
                    icon: 'oc-icon-delete',
                    handler: 'onDelete',
                    danger: true,
                    class: 'pull-right',
                    dataRequestConfirm: __("Are you sure?"),
                    dataRequestMessage: __("Deleting :name...", ['name' => $formRecordName])
                ) ?>
            </div>
        </div>

    <?= Form::close() ?>

<?php else: ?>
    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
    <p>
        <?= Ui::button(
            label: __("Return to Groups List"),
            href: Backend::url('backend/usergroups'),
            secondary: true
        ) ?>
    </p>
<?php endif ?>
