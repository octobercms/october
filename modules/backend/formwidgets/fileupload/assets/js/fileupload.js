/*
 * File upload form field control
 *
 * Data attributes:
 * - data-control="fileupload" - enables the file upload plugin
 * - data-upload-link="a.link" - reference to a trigger to open the file browser window
 * - data-upload-input="input" - a file typed html input, this input name will determine the postback variable
 * - data-loading-class="loading" - this class is added to the container when file is uploading
 * - data-progress-bar=".bar" - reference to a progress bar, it's width is modified when file is uploading
 * - data-unique-id="XXX" - an optional identifier for multiple uploaders on the same page, this value will 
 *   appear in the postback variable called X_OCTOBER_FILEUPLOAD
 * - data-item-template - a Mustache template to render each item with
 *
 * JavaScript API:
 * $('div').fileUploader()
 *
 * Dependancies:
 * - blueimp File Upload (blueimp/jQuery-File-Upload)
 */
+function ($) { "use strict";

    // FILEUPLOAD CLASS DEFINITION
    // ============================

    var FileUpload = function(element, options) {
        this.options   = options
        this.$el       = $(element)
        this.editor    = null
        this.dataCache = null
        this.locked    = false
        this.dropzone  = null
        var self = this

        /*
         * Validate requirements
         */
        this.isMulti = this.$el.hasClass('is-multi');
        this.templateHtml = $('#' + this.options.itemTemplate).html()
        this.uploadLink = $(this.options.uploadLink, this.$el)

        if (this.options.uniqueId) {
            this.options.extraData = $.extend({}, this.options.extraData, { X_OCTOBER_FILEUPLOAD: this.options.uniqueId })
        }

        /*
         * Populate found images
         */
        var populated = this.$el.data('populatedData')
        if (populated)
            $.each(populated, function(index, item){ self.renderItem(item) })

        /*
         * Bind the uploader
         */
        this.bindUploader()

        /*
         * Set up the progress bar
         */
        this.progressBar = $(this.options.progressBar, this.$el).find('>.progress-bar')

        /*
         * Bind remove link
         */
        this.$el.on('click', this.options.removeLink, function(){
            var item = $(this).closest('.attachment-item')
            $(this).on('ajaxDone', function() {
                self.removeItem(item)
            })
            self.toggleLoading(true, item)
        })

        /*
         * When configuration form is saved, refresh the item
         */
        this.$el.on('popupComplete', this.options.configLink, function(event, element, modal){
            var popupEl = $(this),
                currentItem = popupEl.closest('.attachment-item')

            modal.on('ajaxDone', 'button[type=submit]', function(e, context, data){
                popupEl.popup('hide')
                if (data.error) alert(data.error)
                else self.renderItem(data.item, currentItem)
                self.toggleLoading(false, currentItem)

            }).on('ajaxPromise', 'button[type=submit]', function(){
                popupEl.popup('visible', false)
                self.toggleLoading(true, currentItem)
            })
        })

        /*
         * Sortable items
         */
        if (this.$el.hasClass('is-sortable')) {
            var placeholderEl = $('<li class="placeholder"/>').css({
                    width: this.options.imageWidth,
                    height: this.options.imageHeight
                })

            this.$el.find('ul, ol').sortable({
                itemSelector: 'li:not(.attachment-uploader)',
                vertical: false,
                tolerance: -100,
                placeholder: placeholderEl,
                onDrop: function ($item, container, _super) {
                    _super($item, container)
                    self.onSortAttachments()
                },
                distance: 10
            })
        }
    }

    FileUpload.prototype.bindUploader = function() {
        var self = this

        /*
         * Build uploader options
         */
        var uploaderOptions = {
            url: this.options.url,
            clickable: this.uploadLink.get(0),
            paramName: this.options.paramName,
            previewsContainer: $('<div />').get(0),
            maxFiles: !this.isMulti ? 1 : null,
            method: 'POST'
        }

        if (this.options.fileTypes) {
            uploaderOptions.acceptedFiles = this.options.fileTypes
        }

        /*
         * Bind uploader
         */
        this.dropzone = new Dropzone(this.$el.get(0), uploaderOptions)
        this.dropzone.on('error', $.proxy(self.onUploadFail, self))
        this.dropzone.on('success', $.proxy(self.onUploadComplete, self))
        this.dropzone.on('uploadprogress', $.proxy(self.onUploadProgress, self))
        this.dropzone.on('thumbnail', $.proxy(self.onUploadThumbnail, self))
        this.dropzone.on('sending', function(file, xhr, formData) {
            self.addExtraFormData(formData)
            self.onUploadStart()
        })

    }

    FileUpload.prototype.addExtraFormData = function(formData) {
        if (this.options.extraData) {
            $.each(this.options.extraData, function (name, value) {
                formData.append(name, value)
            })
        }

        var $form = this.$el.closest('form')
        if ($form.length > 0) {
            $.each($form.serializeArray(), function (index, field) {
                formData.append(field.name, field.value)
            })
        }
    }

    FileUpload.prototype.removeItem = function(item) {
        if (this.isMulti) {
            item.closest('li').fadeOut(500, function(){
                item.remove()
            })
        }
        else {
            item.find('.active-image, .active-file, .uploader-toolbar').remove()
            this.uploadLink.show()
            this.toggleLoading(false, item)

            // Reset the file counter
            this.dropzone.removeAllFiles()
        }
    }

    FileUpload.prototype.renderItem = function(item, replaceItem) {

        var newItem = $(Mustache.to_html(this.templateHtml, item))

        if (this.isMulti) {
            if (replaceItem)
                replaceItem.closest('li').replaceWith(newItem)
            else
                this.uploadLink.closest('li').before(newItem)

            $('p', newItem).ellipsis()
            return newItem
        }
        else {
            if (replaceItem)
                this.removeItem(replaceItem)

            this.uploadLink.hide().before(newItem)

            $('p', newItem).ellipsis()
            return newItem.closest('.attachment-item')
        }
    }

    FileUpload.prototype.onSortAttachments = function() {
        if (this.options.sortHandler) {

            /*
             * Build an object of ID:ORDER
             */
            var orderData = {}

            this.$el.find('.attachment-item:not(.attachment-uploader)')
                .each(function(index){
                    var id = $(this).data('attachment-id')
                    orderData[id] = index + 1
                })

            this.$el.request(this.options.sortHandler, {
                data: { sortOrder: orderData }
            })
        }
    }

    FileUpload.prototype.onUploadStart = function() {
        this.locked = true
        this.toggleLoading(true, this.progressBar.closest('.attachment-item'))

        this.options.onStart && this.options.onStart()
    }

    FileUpload.prototype.onUploadThumbnail = function(file, thumbUrl) {
        // Provides a thumbnail preview, could be useful
        // but not used at this point in time.
    }

    FileUpload.prototype.onUploadComplete = function(file, data) {
        if (data.error)
            return this.onUploadFail(null, data.error)

        this.options.onComplete && this.options.onComplete()

        var newItem = this.renderItem(data)

        newItem.css({ opacity: 0 })
            .animate({ opacity: 1}, 500)

        this.resetAll()
    }

    FileUpload.prototype.onUploadFail = function(file, error) {
        alert('Error uploading file: ' + error)
        this.options.onFail && this.options.onFail()
        this.resetAll()
    }

    FileUpload.prototype.onUploadProgress = function(file, progress, bytesSent) {
        this.progressBar.css('width', progress + '%')
    }

    FileUpload.prototype.resetAll = function() {
        this.toggleLoading(false, this.progressBar.closest('.attachment-item'))
        this.locked = false
    }

    FileUpload.prototype.toggleLoading = function(isLoading, el) {
        var self = this

        if (!this.options.loadingClass)
            return

        if (!el)
            el = this.$el

        if (isLoading) {
            el.addClass(this.options.loadingClass)
        } else {
            el.removeClass(this.options.loadingClass)
        }

        this.progressBar.css('width', '0')
    }

    FileUpload.DEFAULTS = {
        url: window.location,
        uniqueId: null,
        extraData: {},
        sortHandler: null,
        loadingClass: 'loading',
        removeLink: '.uploader-remove',
        uploadLink: '.uploader-link',
        configLink: '.uploader-config',
        progressBar: '.uploader-progress',
        onComplete: null,
        onStart: null,
        onFail: null,
        imageWidth: 100,
        imageHeight: 100,
        fileTypes: null,
        itemTemplate: null,
        paramName: 'file_data'
    }

    // FILEUPLOAD PLUGIN DEFINITION
    // ============================

    var old = $.fn.fileUploader

    $.fn.fileUploader = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.fileUpload')
            var options = $.extend({}, FileUpload.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.fileUpload', (data = new FileUpload(this, options)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.fileUploader.Constructor = FileUpload

    // FILEUPLOAD NO CONFLICT
    // =================

    $.fn.fileUploader.noConflict = function () {
        $.fn.fileUpload = old
        return this
    }

    // FILEUPLOAD DATA-API
    // ===============
    $(document).render(function () {
        $('[data-control="fileupload"]').fileUploader()
    })

}(window.jQuery);
