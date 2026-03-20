<?= Form::ajax('onImport', [
    'id' => 'themeImportForm',
    'data-popup-load-indicator' => true,
]) ?>

    <input type="hidden" name="theme" value="<?= $themeDir ?>" />
    <input type="hidden" name="mode" value="import" />

    <div class="modal-header">
        <h4 class="modal-title"><?= __('Import Theme') ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <?php if (!$this->fatalError): ?>

        <div class="modal-body">
            <?= $widget->render() ?>
        </div>
        <div class="modal-footer">
            <?= Ui::ajaxButton(
                label: __("Import"),
                handler: 'onImport',
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
            function(){ $('#themeImportForm input.form-control:first').focus() },
            310
        )
    </script>

<?= Form::close() ?>
