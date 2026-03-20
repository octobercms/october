<?php if (!$this->fatalError): ?>
    <?php Block::put('breadcrumb') ?>
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="<?= Backend::url('tailor/globals/'.$activeSource->handleSlug) ?>"><?= $activeSource->name ?></a></li>
            <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
        </ol>
    <?php Block::endPut() ?>

    <?= Form::open(['class' => 'layout design-settings']) ?>
        <div class="layout-row">
            <?= $this->formRender() ?>
        </div>

        <div class="form-buttons">
            <div data-control="loader-container">
                <?= Ui::ajaxButton(
                    label: __("Save Changes"),
                    handler: 'onSave',
                    primary: true,
                    hotkey: ['ctrl+s', 'cmd+s'],
                    dataRequestData: "redirect: false",
                    dataRequestMessage: __("Saving :name...", ['name' => $entityName])
                ) ?>
                <span class="btn-text">
                    <span class="button-separator"><?= __("or") ?></span>
                    <?= Ui::ajaxButton(
                        label: __("Cancel"),
                        handler: 'onCancel',
                        class: 'btn-link p-0',
                        dataRequestMessage: __("Loading...")
                    ) ?>
                </span>
                <span class="pull-right btn-text">
                    <?= Ui::ajaxButton(
                        label: __("Reset to Default"),
                        handler: 'onResetDefault',
                        class: 'btn-link p-0',
                        dataRequestData: "redirect: false",
                        dataRequestConfirm: __("Are you sure?"),
                        dataRequestMessage: __("Resetting...")
                    ) ?>
                </span>
            </div>
        </div>
    <?= Form::close() ?>

<?php else: ?>
    <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
    <p>
        <?= Ui::button(
            label: __("Return to Globals"),
            href: Backend::url('tailor/globals'),
            secondary: true
        ) ?>
    </p>
<?php endif ?>
