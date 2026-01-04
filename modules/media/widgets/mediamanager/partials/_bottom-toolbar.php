<div class="media-panel pb-0 border-top">
    <div class="form-buttons">
        <div class="pull-right">
            <button
                type="button"
                data-command="popup-command"
                data-popup-command="insert"
                class="btn btn-primary">
                <?= e(trans('backend::lang.media.insert')) ?>
            </button>

            <?php if ($this->checkHasPermission('mediaCreate')): ?>
                <button
                    type="button"
                    data-command="popup-command"
                    data-popup-command="crop-and-insert"
                    class="btn btn-primary oc-hide">
                    <?= e(trans('backend::lang.media.crop_and_insert')) ?>
                </button>
            <?php endif ?>

            <button
                type="button"
                data-dismiss="popup"
                class="btn btn-secondary no-margin-right">
                <?= e(trans('backend::lang.form.cancel')) ?>
            </button>
        </div>
    </div>
</div>
