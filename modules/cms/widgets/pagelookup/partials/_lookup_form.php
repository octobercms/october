<div id="<?= $this->getId('popup') ?>" class="pagefinder-popup">
    <?= Form::ajax($this->getEventHandler('onInsertReference'), [
        'data-popup-load-indicator' => true,
    ]) ?>
        <input type="hidden" name="pagelookup_flag" value="1" />
        <input type="hidden" name="pagelookup_title" value="<?= $includeTitle ? 1 : 0 ?>" />
        <input type="hidden" name="pagelookup_single" value="<?= $singleMode ? 1 : 0 ?>" />
        <input type="hidden" name="pagelookup_allow_custom_url" value="<?= $allowCustomUrl ? 1 : 0 ?>" />
        <input type="hidden" name="pagelookup_allowed_types" value="<?= e(json_encode($allowedTypes)) ?>" />
        <input type="hidden" name="pagelookup_excluded_types" value="<?= e(json_encode($excludedTypes)) ?>" />

        <div class="modal-header">
            <h4 class="modal-title"><?= e(__($title)) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>

        <div class="modal-body">
            <div class="pagefinder-form" id="<?= $this->getId('selectWidget') ?>">
                <?= $selectWidget->render() ?>
            </div>
        </div>

        <div class="modal-footer">
            <button
                type="submit"
                class="btn btn-primary"
                data-control="apply-btn">
                <?= e(trans('backend::lang.form.insert')) ?>
            </button>
            <button
                type="button"
                class="btn btn-default"
                data-dismiss="popup">
                <?= e(trans('backend::lang.form.cancel')) ?>
            </button>
        </div>
    <?= Form::close() ?>
</div>

<?php if (!$value): ?>
    <script>
        setTimeout(function() {
            $('#<?= $this->getId('popup') ?> input[name="PageLookupItem[url]"]:first').focus();
        }, 500);
    </script>
<?php endif ?>
