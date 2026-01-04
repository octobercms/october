<?= Form::ajax($this->getEventHandler('onApplyName'), [
    'success' => "$(this).trigger('close.oc.popup'); \$('#".$listId."').trigger('mediarefresh');",
    'data-stripe-load-indicator' => 1,
    'id' => 'media-rename-popup-form'
]) ?>
    <div class="modal-header">
        <h4 class="modal-title"><?= e(trans('cms::lang.asset.rename_popup_title')) ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label class="form-label"><?= e(trans('cms::lang.asset.rename_new_name')) ?></label>
            <input
                type="text"
                name="name"
                value="<?= e($name) ?>"
                class="form-control"
                autocomplete="off"
                default-focus />
        </div>

        <input type="hidden" name="originalName" value="<?= e($name) ?>" />
        <input type="hidden" name="type" value="<?= e($type) ?>" />
        <input type="hidden" name="originalPath" value="<?= e($originalPath) ?>" />
    </div>
    <div class="modal-footer">
        <button
            type="submit"
            class="btn btn-primary">
            <?= e(trans('backend::lang.form.apply')) ?>
        </button>
        <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="popup">
            <?= e(trans('backend::lang.form.cancel')) ?>
        </button>
    </div>
    <script>
        setTimeout(
            function(){ $('#media-rename-popup-form input.form-control').focus() },
            310
        )

        $('#media-rename-popup-form').on('oc.beforeRequest', function(ev){
            var originalName = $('#media-rename-popup-form [name=originalName]').val(),
                newName = $.trim($('#media-rename-popup-form [name=name]').val())

            if (originalName == newName || newName.length == 0) {
                alert('Please enter a new name')

                ev.preventDefault()
            }
        })
    </script>
<?= Form::close() ?>