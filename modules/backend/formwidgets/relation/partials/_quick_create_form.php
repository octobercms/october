<div id="<?= $this->getId('quickCreatePopup') ?>">
    <?= Form::ajax($this->getEventHandler('onQuickCreateRecord'), [
        'data-popup-load-indicator' => true,
        'data-request-success' => "$(this).trigger('close.oc.popup')",
    ]) ?>
        <input type="hidden" name="_relation_quick_create" value="1" />

        <div class="modal-header">
            <h4 class="modal-title"><?= e(__($quickCreateTitle)) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>

        <div class="modal-body">
            <?= $quickCreateFormWidget->render() ?>
        </div>

        <div class="modal-footer">
            <button type="submit" class="btn btn-primary">
                <?= __("Create") ?>
            </button>
            <span class="btn-text">
                <span class="button-separator"><?= __("or") ?></span>
                <a href="javascript:;" class="btn btn-link p-0" data-dismiss="popup">
                    <?= __("Cancel") ?>
                </a>
            </span>
        </div>
    <?= Form::close() ?>
</div>
