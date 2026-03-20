<?php
    $previewMode = false;
    if ($this->previewMode || $field->readOnly) {
        $previewMode = true;
    }
?>
<div
    id="<?= $this->getId() ?>"
    class="field-pagefinder loading-indicator-container size-input-text <?= $value ? 'is-populated' : '' ?> <?= $previewMode ? 'is-preview' : '' ?>"
    data-control="pagefinder"
    data-refresh-handler="<?= $this->getEventHandler('onRefresh') ?>"
    data-data-locker="#<?= $field->getId() ?>"
    data-single-mode="<?= $singleMode ? 1 : 0 ?>"
    data-allow-custom-url="<?= $allowCustomUrl ? 1 : 0 ?>"
    data-allowed-types="<?= e(json_encode($allowedTypes)) ?>"
    data-excluded-types="<?= e(json_encode($excludedTypes)) ?>">

    <div class="pagefinder-control-container d-flex">
        <?php if ($value): ?>
            <div class="pagefinder-record-container me-auto">
                <div class="record-item">
                    <div class="record-data-container">
                        <div class="record-data-container-inner">
                            <div class="icon-container">
                                <i class="icon-chain"></i>
                            </div>
                            <div class="info">
                                <span class="recordname"><?= e(__($nameValue)) ?: __('Link') ?></span>
                                <?php if ($descriptionValue): ?>
                                    <span class="description"> - <?= e(__($descriptionValue)) ?></span>
                                <?php endif ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif ?>
        <?php if (!$previewMode): ?>
            <div class="pagefinder-control-toolbar">
                <a href="javascript:;" class="backend-toolbar-button control-button toolbar-find-button">
                    <i class="icon-common-file-star"></i>
                    <?= $value ? __("Replace") : __("Select") ?>
                </a>
                <?php if ($value): ?>
                    <button
                        type="button"
                        class="backend-toolbar-button control-button find-remove-button"
                        data-request="<?= $this->getEventHandler('onClearRecord') ?>"
                        data-request-confirm="<?= e(trans('backend::lang.form.action_confirm')) ?>"
                        data-request-success="$('#<?= $field->getId() ?>').val('').trigger('change')"
                        aria-label="Remove">
                        <i class="icon-common-file-remove"></i>
                        <?= __("Clear") ?>
                    </button>
                <?php endif ?>
            </div>
        <?php endif ?>
    </div>

    <input
        type="hidden"
        name="<?= $field->getName() ?>"
        id="<?= $field->getId() ?>"
        value="<?= e($value) ?>"
    />
</div>
