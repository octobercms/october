<div
    id="relationManagePopup"
    data-popup-size="<?= $relationPopupSize ?? 950 ?>"
>
    <?= Form::open() ?>
        <input type="hidden" name="_relation_field" value="<?= e($relationField) ?>" />
        <input type="hidden" name="_relation_extra_config" value="<?= e(json_encode($relationExtraConfig)) ?>" />

        <div class="modal-header">
            <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>

        <div class="list-flush" data-list-linkage="<?= $relationManageListWidget->getId() ?>">
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
                    data-request="onRelationManageAdd"
                    data-dismiss="popup"
                    data-request-success="oc.relationBehavior.changed('<?= e($relationField) ?>', 'added')"
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
                    class="btn btn-secondary me-auto"
                    data-dismiss="popup">
                    <?= e($this->relationGetMessage('buttonCloseForm')) ?>
                </button>
            <?php endif ?>
            <?php if ($relationManageListWidget->showSetup): ?>
                <button
                    class="btn btn-circle btn-secondary ms-auto"
                    title="<?= __("List Setup") ?>"
                    data-handler="<?= $relationManageListWidget->getEventHandler('onLoadSetup') ?>"
                    data-control="popup"
                    type="button">
                        <i class="icon-text-format-ul"></i>
                </button>
            <?php endif ?>
        </div>
    <?= Form::close() ?>
</div>
