<?php if (!$this->fatalError): ?>
    <?= Form::open(['class' => 'layout design-settings']) ?>
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
                    dataRequestMessage: __("Saving...")
                ) ?>

                <?= Ui::ajaxButton(
                    label: __("Save & Close"),
                    handler: 'onSave',
                    secondary: true,
                    hotkey: ['ctrl+enter', 'cmd+enter'],
                    dataRequestData: "close: true",
                    dataRequestMessage: __("Saving...")
                ) ?>

                <span class="btn-text">
                    <span class="button-separator"><?= __("or") ?></span>
                    <?= Ui::button(
                        label: __("Cancel"),
                        href: Backend::url('system/settings'),
                        class: 'btn-link p-0'
                    ) ?>
                </span>

                <span class="pull-right btn-text">
                    <?= Ui::ajaxButton(
                        label: __("Reset to Default"),
                        handler: 'onResetDefault',
                        href: 'javascript:;',
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
            label: __("Return to System Settings"),
            href: $parentLink,
            secondary: true
        ) ?>
    </p>
<?php endif ?>
