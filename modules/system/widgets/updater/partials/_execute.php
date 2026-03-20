<?php if (!$this->fatalError): ?>

    <div
        id="executePopup"
        data-lang-operation-timeout-comment="<?= Lang::get('system::lang.installer.operation_timeout_comment') ?>"
        data-lang-operation-timeout-hint="<?= Lang::get('system::lang.installer.operation_timeout_hint') ?>"
    >

        <div id="executeActivity">
            <div class="modal-body modal-no-header">
                <div class="progress bar-loading-indicator" id="executeLoadingBar">
                    <div class="progress-bar"></div>
                </div>

                <div class="loading-indicator-container">
                    <div
                        id="executeMessage"
                        data-wait-longer="<?= __("Just a few more minutes") ?>..."
                        data-unload-warning="<?= __("Are you sure?") ?>"
                        class="mt-2 text-center"></div>
                </div>
            </div>
        </div>

        <div id="executeStatus"></div>

        <div class="control-executeoutput" id="executeOutput">
            <div class="control-scrollbar" style="height:300px" data-control="scrollbar">
                <div data-output-items>
                    <div class="update-item">
                        <dl>
                            <dt><!-- Line number --></dt>
                            <dd><!-- Message --></dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/template" id="executeFailed">
        <div class="modal-body modal-no-header">
            <div class="callout callout-danger no-icon">
                <div class="header">
                    <h3><?= __("Update Failed") ?></h3>
                    <p>{{ reason }}</p>
                    {{#advice}}<p>{{{ advice }}}</p>{{/advice}}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <?= Ui::button(
                label: __("Try Again"),
                primary: true,
                onclick: '$.oc.updater.retryUpdate()'
            ) ?>
            <?= Ui::button(
                label: __("Cancel"),
                secondary: true,
                dataDismiss: 'popup'
            ) ?>
        </div>
    </script>

    <script>
        $('#executePopup').on('popupComplete', function() {
            $.oc.updater.execute(<?= json_encode($updateSteps) ?>);
        });
    </script>

<?php else: ?>

    <div class="modal-body modal-no-header">
        <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
    </div>
    <div class="modal-footer">
        <?= Ui::button(
            label: __("Close"),
            secondary: true,
            dataDismiss: 'popup'
        ) ?>
    </div>

<?php endif ?>
