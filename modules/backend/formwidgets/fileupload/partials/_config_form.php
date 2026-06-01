<div id="<?= $this->getId('popup') ?>" class="fileupload-config-form">
    <?= Form::open([
        'data-request-parent-form' => "#{$this->getId()}"
    ]) ?>
        <input type="hidden" name="file_id" value="<?= $file->id ?>" />
        <input type="hidden" name="fileupload_flag" value="1" />

        <?php if (str_starts_with($displayMode, 'image')): ?>
            <div class="file-upload-modal-image-header">
                <button type="button" class="btn-close" data-dismiss="popup"></button>
                <img
                    src="<?= $file->thumbUrl ?>"
                    class="img-fluid center-block"
                    alt=""
                    title="<?= __("Attachment") ?>: <?= e($file->file_name) ?>"
                    style="<?= $cssDimensions ?>" />
            </div>
        <?php else: ?>
            <div class="modal-header">
                <h4 class="modal-title"><?= __("Attachment") ?>: <?= $file->file_name ?></h4>
                <button type="button" class="btn-close" data-dismiss="popup"></button>
            </div>
        <?php endif ?>
        <div class="modal-body">
            <p><?= __("Add a title and description for this attachment.") ?></p>
            <?= $configFormWidget->render() ?>
        </div>
        <div class="modal-footer">
            <button
                type="submit"
                class="btn btn-primary"
                data-request="<?= $this->getEventHandler('onSaveAttachmentConfig') ?>"
                data-popup-load-indicator>
                <?= __("Save") ?>
            </button>
            <span class="btn-text">
                <span class="button-separator"><?= __("or") ?></span>
                <a
                    href="javascript:;"
                    class="btn btn-link p-0"
                    data-dismiss="popup">
                    <?= __("Cancel") ?>
                </a>
            </span>
            <a href="<?= $file->pathUrl ?>" class="pull-right btn btn-link fileupload-url-button" target="_blank">
                <i class="oc-icon-link"></i><?= __("Attachment URL") ?>
            </a>
        </div>
    <?= Form::close() ?>
</div>

<script>
    setTimeout(
        function(){ $('#<?= $this->getId('popup') ?> input.form-control:first').focus() },
        310
    )
</script>
