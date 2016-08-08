/*
 * Media manager image editor popup
 */
+function ($) { "use strict";

    if ($.oc.mediaManager === undefined)
        $.oc.mediaManager = {}

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var MediaManagerImageCropPopup = function(path, options) {
        this.$popupRootElement = null
        this.$popupElement = null
        this.selectionSizeLabel = null
        this.imageArea = null
        this.hRulerHolder = null
        this.vRulerHolder = null

        this.rulersVisible = false
        this.prevScrollTop = 0
        this.prevScrollLeft = 0

        this.jCrop = null

        this.options = $.extend({}, MediaManagerImageCropPopup.DEFAULTS, options)
        this.path = path

        Base.call(this)

        this.init()
        this.show()
    }

    MediaManagerImageCropPopup.prototype = Object.create(BaseProto)
    MediaManagerImageCropPopup.prototype.constructor = MediaManagerImageCropPopup

    MediaManagerImageCropPopup.prototype.dispose = function() {
        this.unregisterHandlers()
        this.removeAttachedControls()

        this.$popupRootElement.remove()
        this.$popupRootElement = null
        this.$popupElement = null
        this.selectionSizeLabel = null
        this.imageArea = null
        this.hRulerHolder = null
        this.vRulerHolder = null

        BaseProto.dispose.call(this)
    }

    MediaManagerImageCropPopup.prototype.init = function() {
        if (this.options.alias === undefined)
            throw new Error('Media Manager image crop popup option "alias" is not set.')

        this.$popupRootElement = $('<div/>')
        this.registerHandlers()
    }

    MediaManagerImageCropPopup.prototype.show = function() {
        var data = {
            path: this.path
        }

        this.$popupRootElement.popup({
            extraData: data,
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadImageCropPopup',
            zIndex: 1200 // Media Manager can be opened in a popup, so this new popup should have a higher z-index
        })
    }

    MediaManagerImageCropPopup.prototype.registerHandlers = function() {
        this.$popupRootElement.one('hide.oc.popup', this.proxy(this.onPopupHidden))
        this.$popupRootElement.one('shown.oc.popup', this.proxy(this.onPopupShown))
    }

    MediaManagerImageCropPopup.prototype.unregisterHandlers = function() {
        this.$popupElement.off('change', '[data-control="selection-mode"]', this.proxy(this.onSelectionModeChanged))
        this.$popupElement.off('click', '[data-command]', this.proxy(this.onCommandClick))
        this.$popupElement.off('shown.oc.popup', 'button[data-command=resize]', this.proxy(this.onResizePopupShown))
        this.$popupElement.off('hidden.oc.popup', 'button[data-command=resize]', this.proxy(this.onResizePopupHidden))

        if (this.rulersVisible) {
            var $cropToolRoot = this.$popupElement.find('[data-control=media-manager-crop-tool]')
            this.imageArea.removeEventListener('scroll', this.proxy(this.onImageScroll))
        }

        this.getWidthInput().off('change', this.proxy(this.onSizeInputChange))
        this.getHeightInput().off('change', this.proxy(this.onSizeInputChange))
    }

    MediaManagerImageCropPopup.prototype.removeAttachedControls = function() {
        if (this.$popupElement) {
            // Note - the controls are destroyed and removed from DOM. If they're just destroyed,
            // the JS plugins could be re-attached to them on window.onresize. -ab
            this.$popupElement.find('[data-control="selection-mode"]').select2('destroy').remove()
            this.$popupElement.find('[data-control=toolbar]').toolbar('dispose').remove()

            this.jCrop.destroy()
        }

        this.jCrop = null
    }

    MediaManagerImageCropPopup.prototype.hide = function() {
        if (this.$popupElement)
            this.$popupElement.trigger('close.oc.popup')
    }

    MediaManagerImageCropPopup.prototype.getSelectionMode = function() {
        return this.$popupElement.find('[data-control="selection-mode"]').val()
    }

    MediaManagerImageCropPopup.prototype.initRulers = function() {
        if (!Modernizr.csstransforms)
            return

        var $cropToolRoot = this.$popupElement.find('[data-control=media-manager-crop-tool]'),
            width = $cropToolRoot.data('image-width'),
            height = $cropToolRoot.data('image-height')

        if (!width || !height)
            return

        if ($cropToolRoot.width() > width)
            width = $(window).width()

        if ($cropToolRoot.height() > height)
            height = $(window).height()

        $cropToolRoot.find('.ruler-container').removeClass('hide')

        $cropToolRoot.addClass('has-rulers')

        var $hRuler = $cropToolRoot.find('[data-control=h-ruler]'),
            $vRuler = $cropToolRoot.find('[data-control=v-ruler]'),
            hTicks = width / 40 + 1,
            vTicks = height / 40 + 1

        this.createRulerTicks($hRuler, hTicks)
        this.createRulerTicks($vRuler, vTicks)

        this.rulersVisible = true

        this.imageArea.addEventListener('scroll', this.proxy(this.onImageScroll))

        this.hRulerHolder = $cropToolRoot.find('.ruler-container.horizontal .layout-relative').get(0)
        this.vRulerHolder = $cropToolRoot.find('.ruler-container.vertical .layout-relative').get(0)
    }

    MediaManagerImageCropPopup.prototype.createRulerTicks = function($rulerElement, count) {
        var list = document.createElement('ul')

        for (var i=0; i <= count; i++) {
            var li = document.createElement('li')
            li.textContent = i*40

            list.appendChild(li)
        }

        $rulerElement.append(list)
    }

    MediaManagerImageCropPopup.prototype.initJCrop = function() {
        this.jCrop = $.Jcrop($(this.imageArea).find('img').get(0), {
            shade: true,
            onChange: this.proxy(this.onSelectionChanged)
        })
    }

    MediaManagerImageCropPopup.prototype.fixDimensionValue = function(value) {
        var result = value.replace(/[^0-9]+/, '')

        if (!result.length)
            result = 200

        if (result == '0')
            result = 1

        return result
    }

    MediaManagerImageCropPopup.prototype.getWidthInput = function() {
        return this.$popupElement.find('[data-control="crop-width-input"]')
    }

    MediaManagerImageCropPopup.prototype.getHeightInput = function() {
        return this.$popupElement.find('[data-control="crop-height-input"]')
    }

    MediaManagerImageCropPopup.prototype.applySelectionMode = function() {
        if (!this.jCrop)
            return

        var $widthInput = this.getWidthInput(),
            $heightInput = this.getHeightInput(),
            width = this.fixDimensionValue($widthInput.val()),
            height = this.fixDimensionValue($heightInput.val()),
            mode = this.getSelectionMode()

        switch (mode) {
            case 'fixed-ratio' :
                this.jCrop.setOptions({
                    aspectRatio: width/height,
                    minSize: [0, 0],
                    maxSize: [0, 0],
                    allowResize: true
                })
            break
            case 'fixed-size' :
                this.jCrop.setOptions({
                    aspectRatio: 0,
                    minSize: [width, height],
                    maxSize: [width, height],
                    allowResize: false
                })
            break
            case 'normal' :
                this.jCrop.setOptions({
                    aspectRatio: 0,
                    minSize: [0, 0],
                    maxSize: [0, 0],
                    allowResize: true
                })
            break
        }
    }

    MediaManagerImageCropPopup.prototype.cropAndInsert = function() {
        var data = {
            img: $(this.imageArea).find('img').attr('src'),
            selection: this.jCrop.tellSelect()
        }

        $.oc.stripeLoadIndicator.show()

        this.$popupElement
            .find('form')
            .request(this.options.alias+'::onCropImage', {
                data: data
            })
            .always(function() {
                $.oc.stripeLoadIndicator.hide()
            })
            .done(this.proxy(this.onImageCropped))
    }

    MediaManagerImageCropPopup.prototype.onImageCropped = function(response) {
        this.hide()

        if (this.options.onDone !== undefined) {
            this.options.onDone(response)
        }
    }

    MediaManagerImageCropPopup.prototype.showResizePopup = function() {
        this.$popupElement.find('button[data-command=resize]').popup({
            content: this.$popupElement.find('[data-control="resize-template"]').html(),
            zIndex: 1220
        })
    }

    MediaManagerImageCropPopup.prototype.onResizePopupShown = function(ev, button, popup) {
        var $popup = $(popup),
            $widthControl = $popup.find('input[name=width]'),
            $heightControl = $popup.find('input[name=height]'),
            imageWidth = this.fixDimensionValue(this.$popupElement.find('input[data-control=dimension-width]').val()),
            imageHeight = this.fixDimensionValue(this.$popupElement.find('input[data-control=dimension-height]').val())

        $widthControl.val(imageWidth)
        $heightControl.val(imageHeight)

        $widthControl.focus()

        $popup.on('submit.media', 'form', this.proxy(this.onResizeSubmit))
        $widthControl.on('keyup.media', this.proxy(this.onResizeDimensionKeyUp))
        $heightControl.on('keyup.media', this.proxy(this.onResizeDimensionKeyUp))

        $widthControl.on('change.media', this.proxy(this.onResizeDimensionChanged))
        $heightControl.on('change.media', this.proxy(this.onResizeDimensionChanged))
    }

    MediaManagerImageCropPopup.prototype.onResizePopupHidden = function(ev, button, popup) {
        var $popup = $(popup),
            $widthControl = $popup.find('input[name=width]'),
            $heightControl = $popup.find('input[name=height]')

        $popup.off('.media', 'form')
        $widthControl.off('.media')
        $heightControl.off('.media')
    }

    MediaManagerImageCropPopup.prototype.onResizeDimensionKeyUp = function(ev) {
        var $target = $(ev.target),
            targetValue = this.fixDimensionValue($target.val()),
            otherDimensionName = $target.attr('name') == 'width' ? 'height' : 'width',
            $otherInput = $target.closest('form').find('input[name='+otherDimensionName+']'),
            ratio = this.$popupElement.find('[data-control=original-ratio]').val(),
            value = otherDimensionName == 'height' ? targetValue / ratio : targetValue * ratio

        $otherInput.val(Math.round(value))
    }

    MediaManagerImageCropPopup.prototype.onResizeDimensionChanged = function(ev) {
        var $target = $(ev.target)

        $target.val(this.fixDimensionValue($target.val()))
    }

    MediaManagerImageCropPopup.prototype.onResizeSubmit = function(ev) {
        var data = {
                cropSessionKey: this.$popupElement.find('input[name=cropSessionKey]').val(),
                path: this.$popupElement.find('input[name=path]').val()
            }

        $.oc.stripeLoadIndicator.show()
        $(ev.target).request(this.options.alias+'::onResizeImage', {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).done(this.proxy(this.imageResized))

        ev.preventDefault()
        return false
    }

    MediaManagerImageCropPopup.prototype.imageResized = function(response) {
        this.$popupElement.find('button[data-command=resize]').popup('hide')

        this.updateImage(response.url, response.dimensions[0], response.dimensions[1])
    }

    MediaManagerImageCropPopup.prototype.updateImage = function(url, width, hegiht) {
        this.jCrop.destroy()

        this.$popupElement.find('span[data-label=width]').text(width)
        this.$popupElement.find('span[data-label=height]').text(hegiht)

        this.$popupElement.find('input[data-control=dimension-width]').val(width)
        this.$popupElement.find('input[data-control=dimension-height]').val(hegiht)

        var $imageArea = $(this.imageArea)
        $imageArea.find('img').remove()

        var $img = $('<img>').attr('src', url)
        $img.one('load', this.proxy(this.initJCrop))

        $imageArea.append($img)

        this.imageArea.scrollTop = 0
        this.imageArea.scrollLeft = 0
        this.onImageScroll()
    }

    MediaManagerImageCropPopup.prototype.undoResizing = function() {
        this.updateImage(
            this.$popupElement.find('input[data-control=original-url]').val(),
            this.$popupElement.find('input[data-control=original-width]').val(),
            this.$popupElement.find('input[data-control=original-height]').val()
        )
    }

    MediaManagerImageCropPopup.prototype.updateSelectionSizeLabel = function(width, height) {
        if (width == 0 && height == 0) {
            this.selectionSizeLabel.setAttribute('class', 'hide')
            return
        }

        this.selectionSizeLabel.setAttribute('class', '')
        this.selectionSizeLabel.querySelector('[data-label=selection-width]').textContent = parseInt(width)
        this.selectionSizeLabel.querySelector('[data-label=selection-height]').textContent = parseInt(height)
    }

    // EVENT HANDLERS
    // ============================

    MediaManagerImageCropPopup.prototype.onPopupHidden = function(event, element, popup) {
        this.$popupElement.find('form').request(this.options.alias+'::onEndCroppingSession')

        // Release clickedElement reference inside redactor.js
        // If we don't do it, the image editor popup DOM elements 
        // won't be removed from the memory.
        $(document).trigger('mousedown')

        this.dispose()
    }

    MediaManagerImageCropPopup.prototype.onPopupShown = function(event, element, popup) {
        this.$popupElement = popup
        this.$popupElement.on('change', '[data-control="selection-mode"]', this.proxy(this.onSelectionModeChanged))
        this.$popupElement.on('click', '[data-command]', this.proxy(this.onCommandClick))
        this.$popupElement.on('shown.oc.popup', 'button[data-command=resize]', this.proxy(this.onResizePopupShown))
        this.$popupElement.on('hidden.oc.popup', 'button[data-command=resize]', this.proxy(this.onResizePopupHidden))

        this.imageArea = popup.find('[data-control=media-manager-crop-tool]').get(0).querySelector('.image_area')
        this.selectionSizeLabel = popup.find('[data-label="selection-size"]').get(0)

        this.getWidthInput().on('change', this.proxy(this.onSizeInputChange))
        this.getHeightInput().on('change', this.proxy(this.onSizeInputChange))

        this.initRulers()
        this.initJCrop()
        this.applySelectionMode()
    }

    MediaManagerImageCropPopup.prototype.onSelectionModeChanged = function() {
        var mode = this.getSelectionMode(),
            $widthInput = this.getWidthInput(),
            $heightInput = this.getHeightInput()

        if (mode === 'normal') {
            $widthInput.attr('disabled', 'disabled')
            $heightInput.attr('disabled', 'disabled')
        }
        else {
            $widthInput.removeAttr('disabled')
            $heightInput.removeAttr('disabled')

            $widthInput.val(this.fixDimensionValue($widthInput.val()))
            $heightInput.val(this.fixDimensionValue($heightInput.val()))
        }

        this.applySelectionMode()
    }

    MediaManagerImageCropPopup.prototype.onImageScroll = function() {
        var scrollTop = this.imageArea.scrollTop,
            scrollLeft = this.imageArea.scrollLeft

        if (this.prevScrollTop != scrollTop) {
            this.prevScrollTop = scrollTop

            this.vRulerHolder.scrollTop = scrollTop
        }

        if (this.prevScrollLeft != scrollLeft) {
            this.prevScrollLeft = scrollLeft

            this.hRulerHolder.scrollLeft = scrollLeft
        }
    }

    MediaManagerImageCropPopup.prototype.onSizeInputChange = function(ev) {
        var $target = $(ev.target)

        $target.val(this.fixDimensionValue($target.val()))

        this.applySelectionMode()
    }

    MediaManagerImageCropPopup.prototype.onCommandClick = function(ev) {
        var command = $(ev.currentTarget).data('command')

        switch (command) {
            case 'insert':
                this.cropAndInsert()
            break
            case 'resize':
                this.showResizePopup()
            break
            case 'undo-resizing':
                this.undoResizing()
            break
        }
    }

    MediaManagerImageCropPopup.prototype.onSelectionChanged = function(c) {
        this.updateSelectionSizeLabel(c.w, c.h)
    }

    MediaManagerImageCropPopup.DEFAULTS = {
        alias: undefined,
        onDone: undefined
    }

    $.oc.mediaManager.imageCropPopup = MediaManagerImageCropPopup
}(window.jQuery);