<div data-popup-size="750">
    <?= Form::ajax($this->getEventHandler('onSaveTranslateField'), [
        'sessionKey' => $translatableSessionKey,
        'data-popup-load-indicator' => true,
    ]) ?>
        <input type="hidden" name="field_name" value="<?= e($translatableField->fieldName) ?>" />
        <input type="hidden" name="site_id" value="<?= e($translatableSite->id) ?>" />
        <input type="hidden" name="model_id" value="<?= e($translatableModelId) ?>" />
        <div class="modal-header">
            <h4 class="modal-title">
                <?=  e($translatableSite->name) ?>
            </h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>
        <div class="modal-body">
            <?= $translatableFormWidget->render() ?>
        </div>
        <div class="modal-footer">
            <?= Ui::button(
                label: __('backend::lang.form.save'),
                primary: true,
                type: 'submit',
                hotkey: ['ctrl+s', 'cmd+s']
            ) ?>
            <span class="btn-text">
                <span class="button-separator"><?= __("or") ?></span>
                <?= Ui::button(
                    label: __('backend::lang.form.cancel'),
                    class: 'btn-link p-0',
                    dataDismiss: 'popup'
                ) ?>
            </span>
        </div>
    <?= Form::close() ?>
</div>
