<div
    id="<?= $relationManageFormWidget->getId('managePopup') ?>"
    data-popup-size="<?= $relationPopupSize ?? 950 ?>"
>
    <?php if ($relationManageId): ?>

        <?= Form::ajax('onRelationManageUpdate', [
            'sessionKey' => $newSessionKey,
            'data-popup-load-indicator' => true,
            'data-request-success' => "oc.relationBehavior.changed('" . e($relationField) . "', 'updated')",
        ]) ?>
            <!-- Passable fields -->
            <input type="hidden" name="_relation_field" value="<?= $relationField ?>" />
            <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />
            <input type="hidden" name="_form_session_key" value="<?= $formSessionKey ?>" />

            <div class="modal-header">
                <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
                <button type="button" class="btn-close" data-dismiss="popup"></button>
            </div>

            <div class="modal-body">
                <?= $relationManageFormWidget->render(['preview' => $relationReadOnly]) ?>
            </div>

            <div class="modal-footer">
                <?php if ($relationReadOnly): ?>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="popup">
                        <?= e($this->relationGetMessage('buttonCloseForm')) ?>
                    </button>
                <?php else: ?>
                    <button
                        type="submit"
                        class="btn btn-primary">
                        <?= e($this->relationGetMessage('buttonUpdateForm')) ?>
                    </button>
                    <span class="btn-text">
                        <span class="button-separator"><?= __("or") ?></span>
                        <a
                            href="javascript:;"
                            class="btn btn-link p-0"
                            data-dismiss="popup">
                            <?= e($this->relationGetMessage('buttonCancelForm')) ?>
                        </a>
                    </span>
                <?php endif ?>
            </div>
        <?= Form::close() ?>

    <?php else: ?>

        <?= Form::ajax('onRelationManageCreate', [
            'sessionKey' => $newSessionKey,
            'data-popup-load-indicator' => true,
            'data-request-success' => "oc.relationBehavior.changed('" . e($relationField) . "', 'created')",
        ]) ?>
            <!-- Passable fields -->
            <input type="hidden" name="_relation_field" value="<?= $relationField ?>" />
            <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />
            <input type="hidden" name="_form_session_key" value="<?= $formSessionKey ?>" />

            <div class="modal-header">
                <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
                <button type="button" class="btn-close" data-dismiss="popup"></button>
            </div>

            <div class="modal-body">
                <?= $relationManageFormWidget->render() ?>
            </div>

            <div class="modal-footer">
                <button
                    type="submit"
                    class="btn btn-primary">
                    <?= e($this->relationGetMessage('buttonCreateForm')) ?>
                </button>
                <span class="btn-text">
                    <span class="button-separator"><?= __("or") ?></span>
                    <a
                        href="javascript:;"
                        class="btn btn-link p-0"
                        data-dismiss="popup">
                        <?= e($this->relationGetMessage('buttonCancelForm')) ?>
                    </a>
                </span>
            </div>
        <?= Form::close() ?>

    <?php endif ?>

</div>

<script>
    oc.popup.bindToPopups('#<?= $relationManageFormWidget->getId("managePopup") ?>', {
        _relation_field: <?= json_encode($relationField) ?>,
        _relation_extra_config: <?= json_encode(json_encode($relationExtraConfig)) ?>,
        _form_session_key: <?= json_encode($formSessionKey) ?>
    });
</script>
