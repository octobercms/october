<?= Form::open(['class'=>'layout', 'onsubmit'=>'return false']) ?>
    <div class="layout-row min-size">
        <?= $this->makePartial('crop-toolbar') ?>
    </div>
    <div class="layout-row whiteboard">
        <?= $this->makePartial('crop-tool-image-area') ?>
    </div>
    <div class="layout-row min-size whiteboard">
        <div class="media-panel pb-0 border-top">
            <div class="form-buttons">
                <div class="pull-right">
                    <button
                        type="button"
                        data-command="insert"
                        class="btn btn-primary">
                        <?= e(trans('backend::lang.media.crop_and_insert')) ?>
                    </button>

                    <button
                        type="button"
                        data-dismiss="popup"
                        class="btn btn-secondary no-margin-right">
                        <?= e(trans('backend::lang.form.cancel')) ?>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <input type="hidden" name="cropSessionKey" value="<?= e($cropSessionKey) ?>">
    <input type="hidden" name="path" value="<?= e($path) ?>">

    <input type="hidden" data-media-dimension-width value="<?= $dimensions[0] ?>">
    <input type="hidden" data-media-dimension-height value="<?= $dimensions[1] ?>">

    <input type="hidden" data-media-original-width value="<?= $dimensions[0] ?>">
    <input type="hidden" data-media-original-height value="<?= $dimensions[1] ?>">

    <input type="hidden" data-media-original-ratio value="<?= $originalRatio ?>">
    <input type="hidden" data-media-original-url value="<?= e($imageUrl) ?>">

    <?= $this->makePartial('resize-image-form') ?>
<?= Form::close() ?>