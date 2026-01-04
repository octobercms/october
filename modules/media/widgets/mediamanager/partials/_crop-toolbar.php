<?php
    $selectionModes = [
        Media\Widgets\MediaManager::SELECTION_MODE_NORMAL => trans('backend::lang.media.selection_mode_normal'),
        Media\Widgets\MediaManager::SELECTION_MODE_FIXED_RATIO => trans('backend::lang.media.selection_mode_fixed_ratio'),
        Media\Widgets\MediaManager::SELECTION_MODE_FIXED_SIZE => trans('backend::lang.media.selection_mode_fixed_size')
    ];

    $sizeDisabledAttr = $currentSelectionMode == Media\Widgets\MediaManager::SELECTION_MODE_NORMAL ? 'disabled="disabled"' : null;
?>

<div class="control-toolbar toolbar-padded">
    <div class="toolbar-item toolbar-primary">
        <div data-control="toolbar">
            <label class="standalone"><?= e(trans('backend::lang.media.image_size')) ?> <span data-label="width"><?= $dimensions[0] ?></span> x <span data-label="height"><?= $dimensions[1] ?></span></label>

            <div class="btn-group offset-right">
                <button type="button" class="btn btn-primary standalone" data-command="resize"
                ><?= e(trans('backend::lang.media.resize')) ?></button>

                <button type="button" class="btn btn-secondary empty" data-command="undo-resizing">
                    <i class="icon-text-undo"></i>
                </button>
            </div>

            <label for="mmcropimagewidth"><?= e(trans('backend::lang.media.selection_mode')) ?></label>
            <select name="selectionMode" class="form-control custom-select w-150" data-media-selection-mode>
                <?php foreach ($selectionModes as $mode=>$name): ?>
                    <option <?= $mode == $currentSelectionMode ? 'selected="selected"' : null ?> value="<?= $mode ?>"><?= e($name) ?></option>
                <?php endforeach ?>
            </select>

            <label for="mmcropimagewidth"><?= e(trans('backend::lang.media.width')) ?></label>
            <input id="mmcropimagewidth" type="text" class="form-control w-60" data-media-crop-width-input name="selectionWidth" value="<?= e($currentSelectionWidth) ?>" <?= $sizeDisabledAttr ?>/>

            <label for="mmcropimageheight"><?= e(trans('backend::lang.media.height')) ?></label>
            <input id="mmcropimageheight" type="text" class="form-control w-60" data-media-crop-height-input name="selectionHeight" value="<?= e($currentSelectionHeight) ?>" <?= $sizeDisabledAttr ?>/>

            <label class="standalone oc-hide" data-label="selection-size"><?= e(trans('backend::lang.media.selected_size')) ?> <span data-label="selection-width"></span> x <span data-label="selection-height"></span></label>

        </div>
    </div>
</div>
