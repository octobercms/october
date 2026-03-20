<?= Form::ajax('onSaveFields', [
    'id' => 'themeFieldsForm',
    'data-popup-load-indicator' => true
]) ?>

    <input type="hidden" name="theme" value="<?= $themeDir ?>" />

    <div class="modal-header">
        <h4 class="modal-title"><?= __('Theme') ?>: <?= $themeDir ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <?php if (!$this->fatalError): ?>

        <div class="modal-body">
            <?= $widget->render() ?>
        </div>
        <div class="modal-footer">
            <?= Ui::ajaxButton(
                label: __("Save Properties"),
                handler: 'onSaveFields',
                primary: true,
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
            function(){ $('#themeFieldsForm input.form-control:first').focus() },
            310
        )
    </script>

<?= Form::close() ?>
