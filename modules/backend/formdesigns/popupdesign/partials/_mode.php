<?= Form::open([
    'id' => $this->formGetId('managePopup'),
    'data-popup-size' => $popupSize ?? 950
]) ?>
    <input type="hidden" name="form_popup_flag" value="1" />
    <input type="hidden" name="form_record_id" value="<?= $recordId ?? '' ?>" />

    <div class="modal-header">
        <h4 class="modal-title"><?= e($popupTitle ?? '') ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>

    <div class="modal-body">
        <?= $this->formRender() ?>
    </div>

    <div class="modal-footer">
        <div class="form-buttons">
            <?= $this->formRender(['section' => 'buttons']) ?>
        </div>
    </div>

<?= Form::close() ?>

<script>
    oc.popup.focusFirstInput('#<?= $this->formGetId('managePopup') ?>');
    oc.popup.bindToPopups('#<?= $this->formGetId('managePopup') ?>', {
        form_popup_flag: 1,
        form_record_id: '<?= $recordId ?? '' ?>'
    });
</script>
