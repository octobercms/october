<div
    id="<?= $this->getId() ?>"
    class="field-fileupload is-image is-single <?= $singleFile ? 'is-populated' : '' ?> <?= $this->previewMode ? 'is-preview' : '' ?>"
    data-control="fileupload"
    data-upload-handler="<?= $this->getEventHandler('onUpload') ?>"
    data-template="#<?= $this->getId('template') ?>"
    data-error-template="#<?= $this->getId('errorTemplate') ?>"
    data-unique-id="<?= $this->getId() ?>"
    data-thumbnail-width="<?= $imageWidth ?: '0' ?>"
    data-thumbnail-height="<?= $imageHeight ?: '0' ?>"
    data-max-filesize="<?= $maxFilesize ?>"
    <?php if ($externalToolbarBus): ?>data-external-toolbar-bus="<?= e($externalToolbarBus)?>"<?php endif ?>
    <?php if ($useCaption): ?>data-config-handler="<?= $this->getEventHandler('onLoadAttachmentConfig') ?>"<?php endif ?>
    <?php if ($acceptedFileTypes): ?>data-file-types="<?= $acceptedFileTypes ?>"<?php endif ?>
    <?= $this->formField->getAttributes() ?>
>
    <!-- Pointer field -->
    <input type="hidden" name="<?= $name ?>" value="" />

    <div class="empty-state">
        <img src="<?= Url::asset('/modules/backend/assets/images/no-files.svg') ?>"/>
    </div>

    <div class="uploader-control-container <?= $externalToolbarBus ? 'external-toolbar' : null ?>">
        <div class="uploader-control-toolbar">
            <a href="javascript:;" class="backend-toolbar-button control-button toolbar-upload-button">
                <i class="icon-common-file-upload"></i>
                <span
                    class="button-label"
                    data-upload-label="<?= __("Upload") ?>"
                    data-replace-label="<?= __("Replace") ?>"
                ><?= $singleFile ? __("Replace") : __("Upload") ?></span>
            </a>

            <button
                type="button"
                class="backend-toolbar-button control-button toolbar-clear-file populated-only"
                data-request="<?= $this->getEventHandler('onRemoveAttachment') ?>"
                data-request-confirm="<?= __("Are you sure?") ?>"
            >
                <i class="icon-common-file-remove"></i>
                <span class="button-label"><?= __("Clear") ?></span>
            </button>
        </div>

        <!-- Existing file -->
        <div class="upload-files-container">
            <?php if ($singleFile): ?>
                <div class="server-file"
                    data-id="<?= $singleFile->id ?>"
                    data-path="<?= $singleFile->pathUrl ?>"
                    data-thumb="<?= $singleFile->thumbUrl ?>"
                    data-name="<?= e($singleFile->title ?: $singleFile->file_name) ?>"
                    data-description="<?= e($singleFile->description) ?>"
                    data-size="<?= e($singleFile->file_size) ?>"
                    data-accepted="true"
                ></div>
            <?php endif ?>
        </div>
    </div>
</div>

<?= $this->makePartial('template_image') ?>
