<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('backend/users') ?>"><?= __("Administrators") ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?php Block::put('form-contents') ?>
        <?php if ($formModel->trashed()): ?>
            <?= $this->makePartial('hint_trashed') ?>
        <?php endif ?>

        <div class="layout">

            <div class="layout-row">
                <?= $this->formRenderOutsideFields() ?>
                <?= $this->formRenderPrimaryTabs() ?>
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
                    <span class="btn-text">
                        <span class="button-separator"><?= __("or") ?></span>
                        <?= Ui::button(
                            label: __("Cancel"),
                            href: Backend::url('backend/users'),
                            class: 'btn-link p-0'
                        ) ?>
                    </span>
                    <?php if (BackendAuth::userHasAccess('admins.manage.delete')): ?>
                        <?php if ($formModel->trashed()): ?>
                            <?= Ui::iconButton(
                                label: __("Restore"),
                                icon: 'oc-icon-user-plus',
                                handler: 'onRestore',
                                class: 'info pull-right',
                                dataRequestConfirm: __("Are you sure?"),
                                dataRequestMessage: __("Restoring :name...", ['name' => $formRecordName])
                            ) ?>
                        <?php else: ?>
                            <?= Ui::iconButton(
                                label: __("Delete"),
                                icon: 'oc-icon-delete',
                                handler: 'onDelete',
                                danger: true,
                                class: 'pull-right',
                                dataRequestConfirm: __("Are you sure?"),
                                dataRequestMessage: __("Deleting :name...", ['name' => $formRecordName])
                            ) ?>
                        <?php endif ?>
                    <?php endif ?>
                </div>
            </div>

        </div>
    <?php Block::endPut() ?>

    <?php Block::put('form-sidebar') ?>
        <div class="hide-tabs"><?= $this->formRenderSecondaryTabs() ?></div>
    <?php Block::endPut() ?>

    <?php Block::put('body') ?>
        <?= Form::open(['class'=>'position-relative h-100']) ?>
            <?= $this->makeLayout('form-with-sidebar') ?>
        <?= Form::close() ?>
    <?php Block::endPut() ?>

<?php else: ?>
    <nav class="control-breadcrumb">
        <?= Block::placeholder('breadcrumb') ?>
    </nav>
    <div class="padded-container">
        <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
        <p>
            <?= Ui::button(
                label: __("Return to Admins List"),
                href: Backend::url('backend/users'),
                secondary: true
            ) ?>
        </p>
    </div>
<?php endif ?>
