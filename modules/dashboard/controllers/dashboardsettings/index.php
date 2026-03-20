<?php if (!$this->fatalError): ?>

<?= Form::open(['class'=>'d-flex flex-column h-100 design-settings']) ?>
    <div>
        <div class="scoreboard">
            <div data-control="toolbar">
                <div class="scoreboard-item title-value">
                    <h4>Traffic Records</h4>
                    <p><?= e($recordsTotal) ?></p>
                    <p class="description">
                        <a
                            href="javascript:;"
                            data-request="onPurgeData"
                            data-request-message="<?= e(__("Purging the data...")) ?>"
                            data-request-confirm="<?= e(__("Do you really want to purge the Internal Traffic Statistics data?")) ?>"
                        ><?= e(__("Purge Data")) ?></a>
                    </p>
                </div>
                <div class="scoreboard-item title-value">
                    <h4>Sample Traffic Data</h4>
                    <p>Seed</p>
                    <p class="description">
                        <a
                            href="javascript:;"
                            data-request="onGenerateDemoData"
                            data-request-message="Generating data..."
                            data-request-confirm="Do you really want to generate the demo traffic data? This could take a few minutes..."
                        ><?= __("Generate Data") ?></a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="flex-grow-1">
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
            href: Backend::url('system/settings'),
            secondary: true
        ) ?>
    </p>
<?php endif ?>
