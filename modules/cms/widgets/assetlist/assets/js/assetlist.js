/*
 * Asset list
 */
+function ($) { "use strict";

    var AssetList = function (form, alias) {
        this.$form = $(form)
        this.alias = alias


        this.$form.on('ajaxSuccess', $.proxy(this.onAjaxSuccess, this))
        this.$form.on('click', 'ul.list > li.directory > a', $.proxy(this.onDirectoryClick, this))
        this.$form.on('click', 'ul.list > li.file > a', $.proxy(this.onFileClick, this))
        this.$form.on('click', 'p.parent > a', $.proxy(this.onDirectoryClick, this))
        this.$form.on('click', 'a[data-control=delete-asset]', $.proxy(this.onDeleteClick, this))
        this.$form.on('oc.list.setActiveItem', $.proxy(this.onSetActiveItem, this))

        this.setupUploader()
    }

    // Event handlers
    // =================

    AssetList.prototype.onDirectoryClick = function(e) {
        this.gotoDirectory(
            $(e.currentTarget).data('path'),
            $(e.currentTarget).parent().hasClass('parent')
        )

        return false;
    }

    AssetList.prototype.gotoDirectory = function(path, gotoParent) {
        var $container = $('div.list-container', this.$form),
            self = this

        if (gotoParent !== undefined && gotoParent)
            $container.addClass('goBackward')
        else
            $container.addClass('goForward')

        this.$form.request(this.alias+'::onOpenDirectory', {
            data: {
                path: path,
                d: 0.2
            },
            complete: function() {
                self.updateUi()
                $container.trigger('oc.scrollbar.gotoStart')
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $container.removeClass('goForward goBackward')
                alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
            }
        })
    }

    AssetList.prototype.onDeleteClick = function(e) {
        var $el = $(e.currentTarget),
            self = this

        if (!confirm($el.data('confirmation')))
            return false

        this.$form.request(this.alias+'::onDeleteFiles', {
            success: function(data) {
                if (data.error !== undefined && $.type(data.error) === 'string' && data.error.length)
                    $.oc.flashMsg({text: data.error, 'class': 'error'})
            },
            complete: function() {
                self.refresh()
            }
        })

        return false
    }

    AssetList.prototype.onAjaxSuccess = function() {
        this.updateUi()
    }

    AssetList.prototype.onUploadFail = function(event, data, more) {
        alert('Error uploading file: ' + data.errorThrown)
        this.refresh()
    }

    AssetList.prototype.onUploadComplete = function(event, data, more) {
        if (data.result !== 'success')
            alert(data.result)
    }

    AssetList.prototype.onUploadStop = function(event, data, more) {
        $.oc.stripeLoadIndicator.hide()
        this.refresh()
    }

    AssetList.prototype.onUploadStart = function(event, data, more) {
        $.oc.stripeLoadIndicator.show(event)
    }

    AssetList.prototype.onFileClick = function(event) {
        var $link = $(event.currentTarget),
            $li = $link.parent()

        var e = $.Event('open.oc.list', {relatedTarget: $li.get(0), clickEvent: event})
        this.$form.trigger(e, this)

        if (e.isDefaultPrevented())
            return false;
    }

    AssetList.prototype.onSetActiveItem = function(event, dataId) {
        $('ul li.file', this.$form).removeClass('active')
        if (dataId)
            $('ul li.file[data-id="'+dataId+'"]', this.$form).addClass('active')
    }

    // Service functions
    // =================

    AssetList.prototype.updateUi = function() {
        $('button[data-control=asset-tools]', self.$form).trigger('oc.triggerOn.update')
    }

    AssetList.prototype.refresh = function() {
        var self = this;

        this.$form.request(this.alias+'::onRefresh', {
            complete: function() {
                self.updateUi()
            }
        })
    }

    AssetList.prototype.setupUploader = function() {
        var field = $('.asset-list-upload-field', this.$form),
            $link = $('[data-control="upload-assets"]', this.$form),
            uploaderOptions = {
                fail: $.proxy(this.onUploadFail, this),
                type: 'POST',
                paramName: 'file_data',
                formData: this.$form.serializeArray(),
                replaceFileInput: false,
                stop: $.proxy(this.onUploadStop, this),
                start: $.proxy(this.onUploadStart, this),
                done: $.proxy(this.onUploadComplete, this)
            }

        field.fileupload(uploaderOptions)
        $link.click(function(event) {
            field.trigger('click')
        })
    }

    $(document).ready(function(){
        new AssetList($('#asset-list-container').closest('form'), $('#asset-list-container').data('alias'))
    })
}(window.jQuery);