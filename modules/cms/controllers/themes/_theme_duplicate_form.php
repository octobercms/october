<?= Form::ajax('onDuplicateTheme', [
    'id' => 'themeDuplicateForm',
    'data-popup-load-indicator' => true,
]) ?>

    <input type="hidden" name="theme" value="<?= $themeDir ?>" />

    <div class="modal-header">
        <h4 class="modal-title"><?= __('Duplicate Theme') ?>: <?= $themeDir ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <?php if (!$this->fatalError): ?>

        <div class="modal-body">

            <div class="form-group text-field span-full">
                <label class="form-label" for="Form-ThemeDuplicate-newDirName">
                    <?= __('Theme directory') ?>
                </label>
                <input
                    type="text"
                    name="new_dir_name"
                    id="Form-ThemeDuplicate-newDirName"
                    value="<?= $themeDir ?>"
                    placeholder=""
                    class="form-control"
                    autocomplete="off"
                    maxlength="255" />

                <p class="form-text">
                    <?= __('Provide a new directory name for the duplicated theme.') ?>
                </p>
            </div>

        </div>
        <div class="modal-footer">
            <?= Ui::ajaxButton(
                label: __("Duplicate"),
                handler: 'onDuplicateTheme',
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
            function(){ $('#themeDuplicateForm input.form-control:first').focus() },
            310
        )
    </script>

<?= Form::close() ?>
