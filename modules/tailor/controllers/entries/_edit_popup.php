<?php
    $formModel = $relationManageFormWidget->getModel();
    if (!$relationManageId) {
        $formModel->setDefaultContentGroup($formModel->exists ? post('EntryRecord[content_group]') : null);
    }
    $initialState = $this->makeInitialState($formModel);
    $langState = $this->makeLangState();
?>
<div
    id="<?= $relationManageFormWidget->getId('managePopup') ?>"
    data-popup-size="<?= $relationPopupSize ?? 950 ?>"
    class="tailor-entry-edit-popup"
    data-control="vue-app">
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
            <input type="hidden" name="EntryRecord[content_group]" value="<?= e($formModel->content_group) ?>"/>

            <div class="modal-header">
                <div class="flex-grow-1">
                    <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
                </div>
                <div class="me-3">
                    <?= $this->makePartial('edit_header_controls', ['initialState' => $initialState, 'formModel' => $formModel]) ?>
                </div>
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
            <input type="hidden" name="EntryRecord[content_group]" value="<?= e($formModel->content_group) ?>"/>

            <div class="modal-header">
                <div class="flex-grow-1">
                    <h4 class="modal-title"><?= e($relationManageTitle) ?></h4>
                </div>
                <div class="me-3">
                    <?= $this->makePartial('edit_header_controls', ['initialState' => $initialState, 'formModel' => $formModel]) ?>
                </div>
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

    <script type="text/template" data-vue-state="initial"><?= json_encode($initialState) ?></script>
    <script type="text/template" data-vue-lang><?= json_encode($langState) ?></script>
</div>

<script>
    oc.popup.bindToPopups('#<?= $relationManageFormWidget->getId("managePopup") ?>', {
        _relation_field: '<?= $relationField ?>'
    });
</script>

<style>
    .tailor-entry-edit-popup .control-tabs.secondary-tabs {
        display: none;
    }
</style>
