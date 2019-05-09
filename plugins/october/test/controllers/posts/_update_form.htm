<?= Form::open(['id' => 'updateForm']) ?>

    <input type="hidden" name="record_id" value="<?= $recordId ?>" />
    <?php if ($mode == 'comment'): ?>
        <input type="hidden" name="comment_mode" value="1" />
    <?php elseif ($mode == 'tag'): ?>
        <input type="hidden" name="tag_mode" value="1" />
    <?php endif ?>

    <div class="modal-header">
        <button type="button" class="close" data-dismiss="popup">&times;</button>
        <h4 class="modal-title">Update <?= $mode ?></h4>
    </div>

    <?php if (!$this->fatalError): ?>

        <div class="modal-body">
            <?= $this->formRender() ?>
        </div>
        <div class="modal-footer">
            <button
                type="submit"
                data-request="onUpdate"
                data-request-data="redirect:0"
                data-hotkey="ctrl+s, cmd+s"
                data-popup-load-indicator
                class="btn btn-primary">
                <u>S</u>ave
            </button>

            <button
                type="button"
                class="btn btn-default"
                data-dismiss="popup">
                <?= e(trans('backend::lang.form.cancel')) ?>
            </button>

            <button
                type="button"
                class="oc-icon-trash-o btn-icon danger pull-left"
                data-request="onDelete"
                data-popup-load-indicator
                data-request-confirm="Do you really want to delete this comment?">
            </button>
        </div>

    <?php else: ?>

        <div class="modal-body">
            <p class="flash-message static error"><?= e(trans($this->fatalError)) ?></p>
        </div>
        <div class="modal-footer">
            <button
                type="button"
                class="btn btn-default"
                data-dismiss="popup">
                <?= e(trans('backend::lang.form.close')) ?>
            </button>
        </div>

    <?php endif ?>

    <script>
        setTimeout(
            function(){ $('#updateForm input.form-control:first').focus() },
            310
        )
    </script>

<?= Form::close() ?>
