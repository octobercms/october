/*
 * Media manager image editor popup
 */
class MediaManagerImageCropPopup
{
    static DEFAULTS = {
        alias: undefined,
        onDone: undefined
    };

    constructor(path, options) {
        this.$popupRootElement = null;
        this.$popupElement = null;
        this.selectionSizeLabel = null;
        this.imageArea = null;
        this.hRulerHolder = null;
        this.vRulerHolder = null;

        this.rulersVisible = false;
        this.prevScrollTop = 0;
        this.prevScrollLeft = 0;

        this.jCrop = null;

        this.options = { ...MediaManagerImageCropPopup.DEFAULTS, ...options };
        this.path = path;

        this.init();
        this.show();
    }

    dispose() {
        this.unregisterHandlers();
        this.removeAttachedControls();

        this.$popupRootElement.remove();
        this.$popupRootElement = null;
        this.$popupElement = null;
        this.selectionSizeLabel = null;
        this.imageArea = null;
        this.hRulerHolder = null;
        this.vRulerHolder = null;
    }

    init() {
        if (this.options.alias === undefined) {
            throw new Error('Media Manager image crop popup option "alias" is not set.');
        }

        this.$popupRootElement = $('<div/>');
        this.registerHandlers();
    }

    show() {
        const data = {
            path: this.path
        };

        this.$popupRootElement.popup({
            extraData: data,
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadImageCropPopup'
        });
    }

    registerHandlers() {
        this.$popupRootElement.one('hide.oc.popup', this.onPopupHidden);
        this.$popupRootElement.one('shown.oc.popup', this.onPopupShown);
    }

    unregisterHandlers() {
        this.$popupElement.off('change', '[data-media-selection-mode]', this.onSelectionModeChanged);
        this.$popupElement.off('click', '[data-command]', this.onCommandClick);
        this.$popupElement.off('shown.oc.popup', 'button[data-command=resize]', this.onResizePopupShown);
        this.$popupElement.off('hidden.oc.popup', 'button[data-command=resize]', this.onResizePopupHidden);

        if (this.rulersVisible) {
            this.imageArea.removeEventListener('scroll', this.onImageScroll);
        }

        this.getWidthInput().off('change', this.onSizeInputChange);
        this.getHeightInput().off('change', this.onSizeInputChange);
    }

    removeAttachedControls() {
        if (this.$popupElement) {
            // Note - the controls are destroyed and removed from DOM. If they're just destroyed,
            // the JS plugins could be re-attached to them on window.onresize. -ab
            this.$popupElement.find('[data-media-selection-mode]').select2('destroy').remove();
            this.$popupElement.find('[data-control=toolbar]').toolbar('dispose').remove();

            this.jCrop.destroy();
        }

        this.jCrop = null;
    }

    hide() {
        if (this.$popupElement) {
            this.$popupElement.trigger('close.oc.popup');
        }
    }

    getSelectionMode() {
        return this.$popupElement.find('[data-media-selection-mode]').val();
    }

    initRulers() {
        const $cropToolRoot = this.$popupElement.find('[data-media-crop-tool]');
        let width = $cropToolRoot.data('image-width');
        let height = $cropToolRoot.data('image-height');

        if (!width || !height) {
            return;
        }

        if ($cropToolRoot.width() > width) {
            width = $(window).width();
        }

        if ($cropToolRoot.height() > height) {
            height = $(window).height();
        }

        $cropToolRoot.find('.ruler-container').removeClass('oc-hide');
        $cropToolRoot.addClass('has-rulers');

        const $hRuler = $cropToolRoot.find('[data-media-h-ruler]');
        const $vRuler = $cropToolRoot.find('[data-media-v-ruler]');
        const hTicks = width / 40 + 1;
        const vTicks = height / 40 + 1;

        this.createRulerTicks($hRuler, hTicks);
        this.createRulerTicks($vRuler, vTicks);

        this.rulersVisible = true;

        this.imageArea.addEventListener('scroll', this.onImageScroll);

        this.hRulerHolder = $cropToolRoot.find('.ruler-container.horizontal .layout-relative').get(0);
        this.vRulerHolder = $cropToolRoot.find('.ruler-container.vertical .layout-relative').get(0);
    }

    createRulerTicks($rulerElement, count) {
        const list = document.createElement('ul');

        for (let i = 0; i <= count; i++) {
            const li = document.createElement('li');
            li.textContent = i * 40;
            list.appendChild(li);
        }

        $rulerElement.append(list);
    }

    initJCrop = () => {
        this.jCrop = $.Jcrop(this.getImageElement().get(0), {
            shade: true,
            onChange: this.onSelectionChanged
        });
    }

    fixDimensionValue(value) {
        let result = value.replace(/[^0-9]+/, '');

        if (!result.length) {
            result = 200;
        }

        if (result == '0') {
            result = 1;
        }

        return result;
    }

    getWidthInput() {
        return this.$popupElement.find('[data-media-crop-width-input]');
    }

    getHeightInput() {
        return this.$popupElement.find('[data-media-crop-height-input]');
    }

    getImageElement() {
        return $(this.imageArea).find('img');
    }

    applySelectionMode() {
        if (!this.jCrop) {
            return;
        }

        const $widthInput = this.getWidthInput();
        const $heightInput = this.getHeightInput();
        const width = this.fixDimensionValue($widthInput.val());
        const height = this.fixDimensionValue($heightInput.val());
        const mode = this.getSelectionMode();

        switch (mode) {
            case 'fixed-ratio':
                this.jCrop.setOptions({
                    aspectRatio: width / height,
                    minSize: [0, 0],
                    maxSize: [0, 0],
                    allowResize: true
                });
                break;
            case 'fixed-size':
                this.jCrop.setOptions({
                    aspectRatio: 0,
                    minSize: [width, height],
                    maxSize: [width, height],
                    allowResize: false
                });
                break;
            case 'normal':
                this.jCrop.setOptions({
                    aspectRatio: 0,
                    minSize: [0, 0],
                    maxSize: [0, 0],
                    allowResize: true
                });
                break;
        }
    }

    cropAndInsert() {
        const data = {
            img: this.getImageElement().attr('src'),
            selection: this.jCrop.tellSelect()
        };

        $.oc.stripeLoadIndicator.show();

        this.$popupElement
            .find('form')
            .request(this.options.alias + '::onCropImage', {
                data: data
            })
            .always(() => {
                $.oc.stripeLoadIndicator.hide();
            })
            .done(this.onImageCropped);
    }

    onImageCropped = (response) => {
        this.hide();

        if (this.options.onDone !== undefined) {
            this.options.onDone(response);
        }
    }

    showResizePopup() {
        this.$popupElement.find('button[data-command=resize]').popup({
            content: this.$popupElement.find('[data-media-resize-template]').html(),
            zIndex: 1220
        });
    }

    onResizePopupShown = (ev, button, popup) => {
        const $popup = $(popup);
        const $widthControl = $popup.find('input[name=width]');
        const $heightControl = $popup.find('input[name=height]');
        const imageWidth = this.fixDimensionValue(this.$popupElement.find('input[data-media-dimension-width]').val());
        const imageHeight = this.fixDimensionValue(this.$popupElement.find('input[data-media-dimension-height]').val());

        $widthControl.val(imageWidth);
        $heightControl.val(imageHeight);

        $widthControl.focus();

        $popup.on('submit.media', 'form', this.onResizeSubmit);
        $widthControl.on('keyup.media', this.onResizeDimensionKeyUp);
        $heightControl.on('keyup.media', this.onResizeDimensionKeyUp);

        $widthControl.on('change.media', this.onResizeDimensionChanged);
        $heightControl.on('change.media', this.onResizeDimensionChanged);
    }

    onResizePopupHidden = (ev, button, popup) => {
        const $popup = $(popup);
        const $widthControl = $popup.find('input[name=width]');
        const $heightControl = $popup.find('input[name=height]');

        $popup.off('.media', 'form');
        $widthControl.off('.media');
        $heightControl.off('.media');
    }

    onResizeDimensionKeyUp = (ev) => {
        const $target = $(ev.target);
        const targetValue = this.fixDimensionValue($target.val());
        const otherDimensionName = $target.attr('name') == 'width' ? 'height' : 'width';
        const $otherInput = $target.closest('form').find('input[name=' + otherDimensionName + ']');
        const ratio = this.$popupElement.find('[data-media-original-ratio]').val();
        const value = otherDimensionName == 'height' ? targetValue / ratio : targetValue * ratio;

        $otherInput.val(Math.round(value));
    }

    onResizeDimensionChanged = (ev) => {
        const $target = $(ev.target);
        $target.val(this.fixDimensionValue($target.val()));
    }

    onResizeSubmit = (ev) => {
        const data = {
            cropSessionKey: this.$popupElement.find('input[name=cropSessionKey]').val(),
            path: this.$popupElement.find('input[name=path]').val()
        };

        $.oc.stripeLoadIndicator.show();
        $(ev.target).request(this.options.alias + '::onResizeImage', {
            data: data
        }).always(() => {
            $.oc.stripeLoadIndicator.hide();
        }).done(this.imageResized);

        ev.preventDefault();
        return false;
    }

    imageResized = (response) => {
        this.$popupElement.find('button[data-command=resize]').popup('hide');
        this.updateImage(response.url, response.dimensions[0], response.dimensions[1]);
    }

    updateImage(url, width, height) {
        this.jCrop.destroy();

        this.$popupElement.find('span[data-label=width]').text(width);
        this.$popupElement.find('span[data-label=height]').text(height);

        this.$popupElement.find('input[data-media-dimension-width]').val(width);
        this.$popupElement.find('input[data-media-dimension-height]').val(height);

        const $imageArea = $(this.imageArea);
        $imageArea.find('img').remove();

        const $img = $('<img>').attr('src', url);
        $img.one('load', this.initJCrop);

        $imageArea.append($img);

        this.imageArea.scrollTop = 0;
        this.imageArea.scrollLeft = 0;
        this.onImageScroll();
    }

    undoResizing() {
        this.updateImage(
            this.$popupElement.find('input[data-media-original-url]').val(),
            this.$popupElement.find('input[data-media-original-width]').val(),
            this.$popupElement.find('input[data-media-original-height]').val()
        );
    }

    updateSelectionSizeLabel(width, height) {
        if (width == 0 && height == 0) {
            this.selectionSizeLabel.setAttribute('class', 'oc-hide');
            return;
        }

        this.selectionSizeLabel.setAttribute('class', '');
        this.selectionSizeLabel.querySelector('[data-label=selection-width]').textContent = parseInt(width);
        this.selectionSizeLabel.querySelector('[data-label=selection-height]').textContent = parseInt(height);
    }

    // EVENT HANDLERS
    // ============================

    onPopupHidden = (event, element, popup) => {
        this.$popupElement.find('form').request(this.options.alias + '::onEndCroppingSession');

        // Release clickedElement reference inside redactor.js
        // If we don't do it, the image editor popup DOM elements
        // won't be removed from the memory.
        $(document).trigger('mousedown');

        this.dispose();
    }

    onPopupShown = (event, element, popup) => {
        this.$popupElement = popup;
        this.$popupElement.on('change', '[data-media-selection-mode]', this.onSelectionModeChanged);
        this.$popupElement.on('click', '[data-command]', this.onCommandClick);
        this.$popupElement.on('shown.oc.popup', 'button[data-command=resize]', this.onResizePopupShown);
        this.$popupElement.on('hidden.oc.popup', 'button[data-command=resize]', this.onResizePopupHidden);

        this.imageArea = popup.find('[data-media-crop-tool]').get(0).querySelector('.image_area');
        this.selectionSizeLabel = popup.find('[data-label="selection-size"]').get(0);

        this.getWidthInput().on('change', this.onSizeInputChange);
        this.getHeightInput().on('change', this.onSizeInputChange);

        this.initRulers();
        this.applySelectionMode();

        // Handle slow connections
        const $img = this.getImageElement();
        if ($img.get(0).complete) {
            this.initJCrop();
        }
        else {
            $img.one('load', this.initJCrop);
        }
    }

    onSelectionModeChanged = () => {
        const mode = this.getSelectionMode();
        const $widthInput = this.getWidthInput();
        const $heightInput = this.getHeightInput();

        if (mode === 'normal') {
            $widthInput.attr('disabled', 'disabled');
            $heightInput.attr('disabled', 'disabled');
        }
        else {
            $widthInput.removeAttr('disabled');
            $heightInput.removeAttr('disabled');

            $widthInput.val(this.fixDimensionValue($widthInput.val()));
            $heightInput.val(this.fixDimensionValue($heightInput.val()));
        }

        this.applySelectionMode();
    }

    onImageScroll = () => {
        const scrollTop = this.imageArea.scrollTop;
        const scrollLeft = this.imageArea.scrollLeft;

        if (this.prevScrollTop != scrollTop) {
            this.prevScrollTop = scrollTop;
            this.vRulerHolder.scrollTop = scrollTop;
        }

        if (this.prevScrollLeft != scrollLeft) {
            this.prevScrollLeft = scrollLeft;
            this.hRulerHolder.scrollLeft = scrollLeft;
        }
    }

    onSizeInputChange = (ev) => {
        const $target = $(ev.target);

        $target.val(this.fixDimensionValue($target.val()));

        this.applySelectionMode();
    }

    onCommandClick = (ev) => {
        const command = $(ev.currentTarget).data('command');

        switch (command) {
            case 'insert':
                this.cropAndInsert();
                break;
            case 'resize':
                this.showResizePopup();
                break;
            case 'undo-resizing':
                this.undoResizing();
                break;
        }
    }

    onSelectionChanged = (c) => {
        this.updateSelectionSizeLabel(c.w, c.h);
    }
}

oc.mediaManager.imageCropPopup = MediaManagerImageCropPopup;
