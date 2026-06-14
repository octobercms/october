<div
    id="<?= $this->getId() ?>"
    class="field-fileupload size-<?= $size ?> is-image is-multi is-grid is-sortable <?= count($fileList) ? 'is-populated' : '' ?> <?= $this->previewMode ? 'is-preview' : '' ?>"
    data-control="fileupload"
    data-upload-handler="<?= $this->getEventHandler('onUpload') ?>"
    data-template="#<?= $this->getId('template') ?>"
    data-error-template="#<?= $this->getId('errorTemplate') ?>"
    data-sort-handler="<?= $this->getEventHandler('onSortAttachments') ?>"
    data-unique-id="<?= $this->getId() ?>"
    data-max-filesize="<?= $maxFilesize ?>"
    <?php if ($externalToolbarBus): ?>data-external-toolbar-bus="<?= e($externalToolbarBus)?>"<?php endif ?>
    <?php if ($maxFiles): ?>data-max-files="<?= $maxFiles ?>"<?php endif ?>
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
                <span class="button-label"><?= __("Upload") ?></span>
            </a>

            <button
                type="button"
                class="backend-toolbar-button control-button toolbar-delete-selected populated-only"
                data-request-confirm="<?= __("Are you sure?") ?>"
                data-request="<?= $this->getEventHandler('onRemoveAttachment') ?>"
                disabled
            >
                <i class="icon-common-file-remove"></i>
                <span class="button-label"><?= __("Delete Selected") ?> <span></span></span>
            </button>
        </div>

        <!-- Existing files -->
        <div class="upload-files-container">
            <?php foreach ($fileList as $file): ?>
                <div class="server-file"
                    data-id="<?= $file->id ?>"
                    data-path="<?= $file->pathUrl ?>"
                    data-thumb="<?= $file->thumbUrl ?>"
                    data-name="<?= e($file->title ?: $file->file_name) ?>"
                    data-description="<?= e($file->description) ?>"
                    data-size="<?= e($file->file_size) ?>"
                    data-accepted="true"
                ></div>
            <?php endforeach ?>
        </div>
    </div>
</div>

<!-- Template for new files -->
<?= $this->makePartial('template_image', ['modeMulti' => true]) ?>
