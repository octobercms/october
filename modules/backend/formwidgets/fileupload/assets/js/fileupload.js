/*
 * File upload form field control
 *
 * Data attributes:
 * - data-control="fileupload" - enables the file upload plugin
 * - data-unique-id="XXX" - an optional identifier for multiple uploaders on the same page, this value will
 *   appear in the postback variable called X_OCTOBER_FILEUPLOAD
 * - data-template - a Dropzone.js template to use for each item
 * - data-error-template - a popover template used to show an error
 * - data-sort-handler - AJAX handler for sorting postbacks
 * - data-config-handler - AJAX handler for configuration popup
 *
 * JavaScript API:
 * oc.fetchControl(element, 'fileupload')
 *
 * Dependencies:
 * - Dropzone.js
 */
'use strict';

oc.registerControl('fileupload', class extends oc.ControlBase {
    init() {
        this.$el = $(this.element);
        this.isLoaded = false;
        this.pendingCount = 0;

        if (this.config.isMulti === undefined) {
            this.config.isMulti = this.$el.hasClass('is-multi');
        }

        if (this.config.isPreview === undefined) {
            this.config.isPreview = this.$el.hasClass('is-preview');
        }

        if (this.config.isSortable === undefined) {
            this.config.isSortable = this.$el.hasClass('is-sortable');
        }

        this.$uploadButton = $('.toolbar-upload-button', this.$el);
        this.$filesContainer = $('.upload-files-container', this.$el);
        this.uploaderOptions = {};
    }

    connect() {
        this.listen('click', '.upload-object.is-success .file-data-container-inner', this.onClickSuccessObject);
        this.listen('click', '.upload-object.is-error', this.onClickErrorObject);
        this.listen('click', '.toolbar-clear-file', this.onClearFileClick);
        this.listen('click', '.toolbar-delete-selected', this.onDeleteSelectedClick);
        this.listen('click', 'input[data-record-selector]', this.onClickCheckbox);
        this.listen('change', 'input[data-record-selector]', this.onSelectionChanged);

        this.bindUploader();

        if (this.config.isSortable) {
            this.bindSortable();
        }

        this.isLoaded = true;

        // External toolbar
        setTimeout(() => {
            this.initToolbarExtensionPoint();
            this.mountExternalToolbarEventBusEvents();
            this.extendExternalToolbar();
        }, 0);
    }

    disconnect() {
        this.unmountExternalToolbarEventBusEvents();

        if (this.dropzone) {
            this.dropzone.destroy();
        }

        this.sortable = null;
        this.dropzone = null;
        this.$el = null;
        this.$uploadButton = null;
        this.$filesContainer = null;
        this.uploaderOptions = null;
        this.toolbarExtensionPoint = null;
        this.externalToolbarEventBusObj = null;
        this.isLoaded = null;
    }

    //
    // External toolbar
    //

    initToolbarExtensionPoint() {
        if (!this.config.externalToolbarAppState) {
            return;
        }

        const point = $.oc.vueUtils.getToolbarExtensionPoint(
            this.config.externalToolbarAppState,
            this.element,
            'both'
        );

        if (point) {
            this.toolbarExtensionPoint = point.state;
            this.externalToolbarEventBusObj = point.bus;
        }
    }

    mountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.$on('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.$on('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    unmountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.$off('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.$off('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    onToolbarExternalCommand(ev) {
        var cmdPrefix = 'fileupload-toolbar-';

        if (ev.command.substring(0, cmdPrefix.length) != cmdPrefix) {
            return;
        }

        var buttonClassName = ev.command.substring(cmdPrefix.length),
            $toolbar = this.$el.find('.uploader-control-toolbar'),
            $button = $toolbar.find('[class="'+buttonClassName+'"]');

        $button.get(0).click(ev.ev);
    }

    extendExternalToolbar() {
        if (!this.$el.is(":visible") || !this.toolbarExtensionPoint) {
            return;
        }

        this.toolbarExtensionPoint.splice(0, this.toolbarExtensionPoint.length);

        this.toolbarExtensionPoint.push({
            type: 'separator'
        });

        var that = this,
            $buttons = this.$el.find('.uploader-control-toolbar .backend-toolbar-button');

        $buttons.each(function() {
            var $button = $(this),
                $icon = $button.find('i[class^=icon]');

            that.toolbarExtensionPoint.push(
                {
                    type: 'button',
                    icon: $icon.attr('class'),
                    label: $button.find('.button-label').text(),
                    command: 'fileupload-toolbar-' + $button.attr('class'),
                    disabled: $button.attr('disabled') !== undefined
                }
            );
        });
    }

    //
    // Uploading
    //

    bindUploader() {
        this.uploaderOptions = {
            url: this.config.url || window.location,
            paramName: this.config.paramName || 'file_data',
            clickable: this.$uploadButton.get(0),
            previewsContainer: this.$filesContainer.get(0),
            hiddenInputContainer: this.element,
            maxFilesize: this.config.maxFilesize || 256,
            headers: {},
            timeout: 0
        }

        if (!this.config.isMulti) {
            this.uploaderOptions.maxFiles = 1;
        }
        else {
            this.uploaderOptions.maxFiles = this.config.maxFiles || null;
        }

        if (this.config.fileTypes) {
            this.uploaderOptions.acceptedFiles = this.config.fileTypes;
        }

        if (this.config.template) {
            this.uploaderOptions.previewTemplate = $(this.config.template).html();
        }

        this.uploaderOptions.thumbnailWidth = this.config.thumbnailWidth
            ? this.config.thumbnailWidth : null;

        this.uploaderOptions.thumbnailHeight = this.config.thumbnailHeight
            ? this.config.thumbnailHeight : null;

        this.uploaderOptions.resize = this.proxy(this.onResizeFileInfo);

        // Locale
        this.uploaderOptions.dictMaxFilesExceeded = $.oc.lang.get('upload.max_files');
        this.uploaderOptions.dictInvalidFileType = $.oc.lang.get('upload.invalid_file_type');
        this.uploaderOptions.dictFileTooBig = $.oc.lang.get('upload.file_too_big');
        this.uploaderOptions.dictResponseError = $.oc.lang.get('upload.response_error');
        this.uploaderOptions.dictRemoveFile = $.oc.lang.get('upload.remove_file');

        // Add CSRF token to headers
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) {
            this.uploaderOptions.headers['X-CSRF-TOKEN'] = token;
        }

        this.dropzone = new Dropzone(this.element, this.uploaderOptions);

        this.dropzone.on('addedfile', this.proxy(this.onUploadAddedFile));
        this.dropzone.on('sending', this.proxy(this.onUploadSending));
        this.dropzone.on('success', this.proxy(this.onUploadSuccess));
        this.dropzone.on('error', this.proxy(this.onUploadError));
        this.dropzone.on('complete', this.proxy(this.onUploadComplete));

        this.dropzone.on('dragenter', this.proxy(this.onDragEnter));
        this.dropzone.on('dragover', this.proxy(this.onDragEnter));
        this.dropzone.on('dragleave', this.proxy(this.onDragEnd));
        this.dropzone.on('dragend', this.proxy(this.onDragEnd));
        this.dropzone.on('drop', this.proxy(this.onDragEnd));

        this.loadExistingFiles();
    }

    loadExistingFiles() {
        var self = this;

        $('.server-file', this.$el).each(function() {
            var file = $(this).data();

            self.dropzone.files.push(file);
            self.dropzone.emit('addedfile', file);
            self.dropzone.emit('success', file, file);

            $('[data-description]', file.previewElement).text(file.description);

            $(this).remove();
        });

        this.dropzone._updateMaxFilesReachedClass();
    }

    onResizeFileInfo(file) {
        var info,
            targetWidth,
            targetHeight;

        if (!this.config.thumbnailWidth && !this.config.thumbnailWidth) {
            targetWidth = targetHeight = 100;
        }
        else if (this.config.thumbnailWidth) {
            targetWidth = this.config.thumbnailWidth;
            targetHeight = this.config.thumbnailWidth * file.height / file.width;
        }
        else if (this.config.thumbnailHeight) {
            targetWidth = this.config.thumbnailHeight * file.height / file.width;
            targetHeight = this.config.thumbnailHeight;
        }

        // drawImage(image, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight) takes an image, clips it to
        // the rectangle (srcX, srcY, srcWidth, srcHeight), scales it to dimensions (trgWidth, trgHeight), and draws it
        // on the canvas at coordinates (trgX, trgY).
        info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height,
            trgX: 0,
            trgY: 0,
            trgWidth: targetWidth,
            trgHeight: targetHeight
        }

        return info;
    }

    onUploadAddedFile(file) {
        this.pendingCount++;
        this.$uploadButton.blur();

        var $object = $(file.previewElement).data('dzFileObject', file),
            filesize = this.getFilesize(file);

        // Change filesize format to match October\Rain\Filesystem\Filesystem::sizeToString() format
        $(file.previewElement).find('[data-dz-size]').html(filesize.size + ' ' + filesize.units);

        // Remove any exisiting objects for single variety
        if (!this.config.isMulti) {
            this.removeFileFromElement($object.siblings());
        }

        if (this.config.isMulti && this.isLoaded) {
            file.previewElement.scrollIntoView();
        }

        this.evalIsPopulated();
        this.updateDeleteSelectedState();
        this.extendExternalToolbar();
    }

    onUploadSending(file, xhr, formData) {
        this.addExtraFormData(formData);
        xhr.setRequestHeader('X-AJAX-HANDLER', this.config.uploadHandler);
    }

    onUploadSuccess(file, response) {
        var $preview = $(file.previewElement),
            $img = $('.image img', $preview);

        $preview.addClass('is-success');

        if (response.id) {
            $preview.data('id', response.id);
            $preview.data('path', response.path);
            $img.attr('src', response.thumb);
        }

        this.triggerChange();
    }

    onUploadError(file, error) {
        const preview = file.previewElement;
        preview.classList.add('is-error');

        // Add error icon to the icon container
        const iconContainer = preview.querySelector('.icon-container');
        if (iconContainer && !iconContainer.querySelector('.error-icon')) {
            const errorIcon = document.createElement('i');
            errorIcon.className = 'ph ph-warning error-icon';
            iconContainer.appendChild(errorIcon);
        }
    }

    onUploadComplete(file) {
        this.pendingCount--;

        if (this.pendingCount === 0) {
            this.onSortAttachments();
        }
    }

    onSelectionChanged(ev) {
        var $object = $(ev.target).closest('.upload-object');

        $object.toggleClass('selected', ev.target.checked);

        this.updateDeleteSelectedState();
        this.extendExternalToolbar();
    }

    onClickCheckbox(ev) {
        oc.checkboxRangeRegisterClick(ev, '.upload-object', 'input[data-record-selector]');
    }

    /*
     * Trigger change event (Compatibility with october.form.js)
     */
    triggerChange() {
        this.$el.closest('[data-field-name]').trigger('change.oc.formwidget');
    }

    addExtraFormData(formData) {
        if (this.config.extraData) {
            $.each(this.config.extraData, function(name, value) {
                formData.append(name, value)
            });
        }

        var $form = this.$el.closest('form');
        if ($form.length > 0) {
            $.each($form.serializeArray(), function(index, field) {
                formData.append(field.name, field.value)
            });
        }
    }

    removeFileFromElement($element) {
        var self = this;

        $element.each(function() {
            var $el = $(this),
                obj = $el.data('dzFileObject');

            if (obj) {
                self.dropzone.removeFile(obj);
            }
            else {
                $el.remove();
            }
        })
    }

    //
    // Sorting
    //

    bindSortable() {
        this.dragging = false;

        this.sortable = Sortable.create(this.$filesContainer.get(0), {
            animation: 150,
            draggable: 'div.upload-object.is-success',
            handle: '.drag-handle',
            onStart: this.proxy(this.onDragStart),
            onEnd: this.proxy(this.onDragStop),

            // Auto scroll plugin
            forceAutoScrollFallback: true,
            scrollSensitivity: 60,
            scrollSpeed: 20
        });
    }

    onDragStart(evt) {
        this.dragging = true;
    }

    onDragStop(evt) {
        this.dragging = false;

        this.onSortAttachments();
    }

    onSortAttachments() {
        if (!this.config.sortHandler) {
            return;
        }

        // Build an object of ID:ORDER
        var orderData = {}

        this.$el.find('.upload-object.is-success')
            .each(function(index){
                var id = $(this).data('id')
                orderData[id] = index + 1
            });

        // Already sorting, queue the request
        if (this.sorting) {
            this.sortAgain = true;
            return;
        }

        this.sorting = true;

        this.$el.request(this.config.sortHandler, {
            data: { sortOrder: orderData }
        }).done(() => {
            this.sorting = false;

            // Capture the final state
            if (this.sortAgain) {
                this.sortAgain = false;
                this.onSortAttachments();
            }
        });
    }

    //
    // User interaction
    //

    onClearFileClick(ev) {
        var self = this,
            $form = $(ev.target).closest('form'),
            $button = $(ev.target).closest('.toolbar-clear-file'),
            $currentObject = $('.upload-object:first', this.$filesContainer);

        oc.confirm($button.attr('data-request-confirm'), function(isConfirm) {
            if (!isConfirm) {
                return;
            }

            self.removeObjectInternal($form, $button, $currentObject);
        });

        ev.stopPropagation();
        ev.preventDefault();
    }

    onDeleteSelectedClick(ev) {
        var self = this,
            $form = $(ev.target).closest('form'),
            $button = $(ev.target).closest('.toolbar-delete-selected'),
            $currentObjects = $('.upload-object:has(input[data-record-selector]:checked)', this.$filesContainer);

        oc.confirm($button.attr('data-request-confirm'), function(isConfirm) {
            if (!isConfirm) {
                return;
            }

            $currentObjects.addClass('is-loading');

            $currentObjects.each(function() {
                self.removeObjectInternal($form, $button, $(this));
            });
        });

        ev.stopPropagation();
        ev.preventDefault();
    }

    removeObjectInternal($form, $button, $currentObject) {
        var self = this,
            objectId = $currentObject.data('id');

        if (!objectId) {
            self.removeFileFromElement($currentObject);
            self.evalIsPopulated();
            self.updateDeleteSelectedState();
            self.extendExternalToolbar();
            self.triggerChange();
            return;
        }

        $currentObject.addClass('is-loading');
        $form.request($button.attr('data-request'), {
            data: {
                file_id: objectId
            }
        }).done(function() {
            self.removeFileFromElement($currentObject);
            self.evalIsPopulated();
            self.updateDeleteSelectedState();
            self.extendExternalToolbar();
            self.triggerChange();
        }).always(function() {
            $currentObject.removeClass('is-loading');
        });
    }

    onClickSuccessObject(ev) {
        if ($(ev.target).closest('.meta').length) return;
        if ($(ev.target).closest('.form-check').length) return;

        var $target = $(ev.target).closest('.upload-object');

        if (!this.config.configHandler) {
            window.open($target.data('path'));
            return;
        }

        $target.popup({
            handler: this.config.configHandler,
            extraData: { file_id: $target.data('id') }
        });

        $target.one('popupComplete', function(event, element, modal){
            modal.one('ajaxDone', 'button[type=submit]', function(e, context, data) {
                if (data.displayName) {
                    $('[data-dz-name]', $target).text(data.displayName)
                    $('[data-description]', $target).text(data.description)
                }
            });
        });
    }

    onClickErrorObject(ev) {
        var self = this,
            $target = $(ev.target).closest('.upload-object'),
            errorMsg = $('[data-dz-errormessage]', $target).text(),
            $template = $(this.config.errorTemplate);

        // Remove any existing objects for single variety
        if (!this.config.isMulti) {
            this.removeFileFromElement($target.siblings());
        }

        $target.ocPopover({
            content: Mustache.render($template.html(), { errorMsg: errorMsg }),
            modal: true,
            highlightModalTarget: true,
            placement: 'top',
            fallbackPlacement: 'left',
            containerClass: 'popover-danger'
        });

        var $container = $target.data('oc.popover').$container;
        $container.one('click', '[data-remove-file]', function() {
            $target.data('oc.popover').hide()
            self.removeFileFromElement($target)
            self.evalIsPopulated()
            self.updateDeleteSelectedState()
            self.extendExternalToolbar();
        });
    }

    //
    // Helpers
    //

    evalIsPopulated() {
        var isPopulated = !!$('.upload-object', this.$filesContainer).length;
        this.$el.toggleClass('is-populated', isPopulated);

        // Reset maxFiles counter
        if (!isPopulated) {
            this.dropzone.removeAllFiles();
        }

        var $uploadLabelSpan = this.$uploadButton.find('span.button-label');
        if ($uploadLabelSpan.attr('data-upload-label')) {
            if (isPopulated) {
                $uploadLabelSpan.text($uploadLabelSpan.attr('data-replace-label'))
            }
            else {
                $uploadLabelSpan.text($uploadLabelSpan.attr('data-upload-label'));
            }
        }
    }

    updateDeleteSelectedState() {
        var enabled = false,
            selectedCount = this.$el.find('input[data-record-selector]:checked').length;

        if (this.$el.hasClass('is-populated')) {
            enabled = selectedCount > 0;
        }

        var $button = this.$el.find('.toolbar-delete-selected'),
            $counter = $button.find('.button-label > span');

        $button.prop('disabled', !enabled);

        if (enabled) {
            $counter.text('(' + selectedCount + ')');
        }
        else {
            $counter.text('');
        }
    }

    onDragEnter() {
        if (this.dragging) {
            return;
        }

        this.$el.addClass('file-drag-over');
    }

    onDragEnd() {
        if (this.dragging) {
            return;
        }

        this.$el.removeClass('file-drag-over');
    }

    /*
     * Replicates the formatting of October\Rain\Filesystem\Filesystem::sizeToString(). This method will return
     * an object with the file size amount and the unit used as `size` and `units` respectively.
     */
    getFilesize(file) {
        var formatter = new Intl.NumberFormat('en', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            size = 0,
            units = 'bytes';

        if (file.size >= 1073741824) {
            size = formatter.format(file.size / 1073741824);
            units = 'GB';
        }
        else if (file.size >= 1048576) {
            size = formatter.format(file.size / 1048576);
            units = 'MB';
        }
        else if (file.size >= 1024) {
            size = formatter.format(file.size / 1024);
            units = 'KB';
        }
        else if (file.size > 1) {
            size = file.size;
            units = 'bytes';
        }
        else if (file.size == 1) {
            size = 1;
            units = 'byte';
        }

        return {
            size: size,
            units: units
        };
    }
});
