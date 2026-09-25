<div
    id="<?= $relationPivotWidget->getId('pivotPopup') ?>"
    data-popup-size="<?= $relationPopupSize ?? 950 ?>"
>
    <?php if ($relationManageId || $relationPivotId): ?>

        <?= Form::ajax('onRelationManagePivotUpdate', [
            'data-popup-load-indicator' => true,
            'data-request-success' => "oc.relationBehavior.changed('" . e($relationField) . "', 'updated')",
        ]) ?>

            <!-- Passable fields -->
            <input type="hidden" name="_relation_field" value="<?= $relationField ?>" />
            <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />
            <?php if ($relationPivotId): ?>
                <input type="hidden" name="pivot_id" value="<?= $relationPivotId ?>" />
            <?php endif ?>

            <div class="modal-header">
                <h4 class="modal-title"><?= e($relationPivotTitle) ?></h4>
                <button type="button" class="btn-close" data-dismiss="popup"></button>
            </div>
            <div class="modal-body">
                <?= $relationPivotWidget->render(['preview' => $relationReadOnly]) ?>
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
                        <?= __("Update") ?>
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

        <?= Form::ajax('onRelationManagePivotCreate', [
            'data-popup-load-indicator' => true,
            'data-request-success' => "oc.relationBehavior.changed('" . e($relationField) . "', 'created')",
        ]) ?>

            <!-- Passable fields -->
            <input type="hidden" name="_relation_field" value="<?= $relationField ?>" />
            <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />
            <?php foreach ((array) $foreignId as $fid): ?>
                <input type="hidden" name="foreign_id[]" value="<?= $fid ?>" />
            <?php endforeach ?>

            <div class="modal-header">
                <h4 class="modal-title"><?= e($relationPivotTitle) ?></h4>
                <button type="button" class="btn-close" data-dismiss="popup"></button>
            </div>
            <div class="modal-body">
                <?= $relationPivotWidget->render() ?>
            </div>
            <div class="modal-footer">
                <button
                    type="submit"
                    class="btn btn-primary">
                    <?= e($this->relationGetMessage('buttonAddForm')) ?>
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
    oc.popup.bindToPopups('#<?= $relationPivotWidget->getId("pivotPopup") ?>', {
        _relation_field: <?= json_encode($relationField) ?>,
        _relation_extra_config: <?= json_encode(json_encode($relationExtraConfig)) ?>,
        _form_session_key: <?= json_encode($formSessionKey) ?>
    });
</script>
