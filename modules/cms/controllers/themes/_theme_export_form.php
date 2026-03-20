<?= Form::ajax('onExport', [
    'id' => 'themeExportForm',
    'data-popup-load-indicator' => true,
    'data-request-success' => 'closeExportThemePopup()'
]) ?>

    <input type="hidden" name="theme" value="<?= $themeDir ?>" />

    <div class="modal-header">
        <h4 class="modal-title"><?= __('Export Theme') ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <?php if (!$this->fatalError): ?>

        <div class="modal-body">
            <?= $widget->render() ?>
        </div>
        <div class="modal-footer">
            <?= Ui::ajaxButton(
                label: __("Export"),
                handler: 'onExport',
                class: 'btn-success',
                dataPopupLoadIndicator: true
            ) ?>

            <?= Ui::button(
                label: __("Cancel"),
                secondary: true,
                dataDismiss: 'popup'
            ) ?>
        </div>

    <?php else: ?>

        <div class="modal-body">
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

    <script>
        setTimeout(
            function(){ $('#themeExportForm input.form-control:first').focus() },
            310
        )

        function closeExportThemePopup() {
            $('#themeExportForm')
                .closest('.control-popup')
                .popup('hideLoading')
        }
    </script>

<?= Form::close() ?>
