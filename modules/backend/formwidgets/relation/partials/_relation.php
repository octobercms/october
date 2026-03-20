<div class="relation-widget" id="<?= $this->getId() ?>">
    <?php if ($this->useController): ?>
        <?= $this->controller->relationRender($this->getRelationControllerFieldName(), [
            'readOnlyDefault' => $this->previewMode
        ] + ($this->readOnly === true ? ['readOnly' => true] : [])) ?>
    <?php elseif ($this->hasQuickCreate()): ?>
        <div
            data-control="relation-quick-create"
            data-handler-load="<?= $this->getEventHandler('onLoadQuickCreateForm') ?>"
            data-quick-create-value="__quick_create__"
            <?php if ($popupSize = $this->quickCreateConfig['popupSize'] ?? null): ?>
                data-popup-size="<?= e($popupSize) ?>"
            <?php endif ?>
        >
            <?= $this->makePartial('~/modules/backend/widgets/form/partials/_field_'.$field->type.'.php', [
                'field' => $field
            ]) ?>
        </div>
    <?php else: ?>
        <?= $this->makePartial('~/modules/backend/widgets/form/partials/_field_'.$field->type.'.php', [
            'field' => $field
        ]) ?>
    <?php endif ?>
</div>
