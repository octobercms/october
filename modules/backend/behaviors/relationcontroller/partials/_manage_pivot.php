<div
    id="relationManagePivotPopup"
    data-popup-size="<?= $relationPopupSize ?? 950 ?>"
>
    <?= Form::open() ?>
        <input type="hidden" name="_relation_field" value="<?= e($relationField) ?>" />
        <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />

        <div class="modal-header">
            <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>
        <?php if (!$relationSearchWidget): ?>
            <div class="modal-body py-3">
                <p class="mb-0 text-muted"><?= e(trans('backend::lang.relation.help')) ?></p>
            </div>
        <?php endif ?>
        <div class="list-flush">
            <?php if ($relationSearchWidget): ?>
                <?= $relationSearchWidget->render() ?>
            <?php endif ?>
            <?php if ($relationManageFilterWidget): ?>
                <?= $relationManageFilterWidget->render() ?>
            <?php endif ?>
            <?= $relationManageListWidget->render() ?>
        </div>

        <div class="modal-footer">
            <?php if ($relationManageListWidget->showCheckboxes): ?>
                <button
                    type="button"
                    class="btn btn-primary"
                    data-control="popup"
                    data-handler="onRelationManageAddPivot"
                    data-dismiss="popup"
                    data-stripe-load-indicator>
                    <?= e($this->relationGetMessage('buttonAddMany')) ?>
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
            <?php else: ?>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="popup">
                    <?= e($this->relationGetMessage('buttonCloseForm')) ?>
                </button>
            <?php endif ?>
        </div>
    <?= Form::close() ?>
</div>
<script>
    setTimeout(
        function() { $('#relationManagePivotPopup input.form-control:first').focus() },
        310
    );
</script>
