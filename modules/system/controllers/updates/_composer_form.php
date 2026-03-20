<?= Form::ajax('onSaveComposer', [
    'id' => 'composerEditorForm',
    'data-popup-load-indicator' => true,
    'data-popup-size' => 'adaptive',
]) ?>

    <div class="modal-header">
        <h4 class="modal-title"><?= __('Edit Composer') ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <div class="modal-body pb-3">
        <?= $widget->render() ?>
    </div>
    <div class="modal-footer">
        <?= Ui::ajaxButton(
            label: __("Save"),
            handler: 'onSaveComposer',
            primary: true,
            dataPopupLoadIndicator: true
        ) ?>
        <?= Ui::button(
            label: __("Cancel"),
            secondary: true,
            dataDismiss: 'popup'
        ) ?>
    </div>

<?= Form::close() ?>
