<script type="text/template" data-media-new-folder-template>
    <?= Form::open() ?>
        <div class="modal-header">
            <h4 class="modal-title"><?= e(trans('backend::lang.media.new_folder_title')) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label"><?= e(trans('backend::lang.media.folder_name')) ?></label>
                <input
                    type="text"
                    class="form-control"
                    name="name"
                    value=""
                    autocomplete="off" />
            </div>
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
    </form>
</script>
