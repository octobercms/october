/*
 * MailBrandSettings page
 *
 * Config:
 * - previewTemplateId: ''
 */
'use strict';

oc.registerControl('mailpreview', class extends oc.ControlBase {
    connect() {
        this.createPreviewContainer();

        // Change color picker
        $(document).on('change', '.field-colorpicker', this.proxy(this.onChangeColorPicker));

        // Auto adjust height
        $(document).on('render', this.proxy(this.adjustPreviewHeight));
        $(window).on('resize', this.proxy(this.adjustPreviewHeight));

        setTimeout(function() {
            $(window).trigger('resize');
        }, 250);
    }

    disconnect() {
        // Change color picker
        $(document).off('change', '.field-colorpicker', this.proxy(this.onChangeColorPicker));

        // Auto adjust height
        $(document).off('render', this.proxy(this.adjustPreviewHeight));
        $(window).off('resize', this.proxy(this.adjustPreviewHeight));
    }

    createPreviewContainer() {
        var previewTemplate = document.querySelector('#' + (this.config.previewTemplateId || 'selector'));
        if (!previewTemplate) {
            console.error('Missing preview template html');
            return;
        }

        var content = previewTemplate.innerHTML;
        var previewIframe = this.previewIframe = document.createElement('iframe');

        previewIframe.style.width = '100%';
        previewIframe.setAttribute('frameborder', 0);
        previewIframe.onload = this.adjustPreviewHeight.bind(this);

        this.element.appendChild(previewIframe);
        this.updatePreviewContent(content);

        return previewIframe;
    }

    onChangeColorPicker() {
        var self = this;
        $('#Form').request('onUpdateSampleMessage').done(function(data) {
            self.updatePreviewContent(data.previewHtml);
        });
    }

    updatePreviewContent(content) {
        'srcdoc' in this.previewIframe
            ? this.previewIframe.srcdoc = content
            : this.previewIframe.src = 'data:text/html;charset=UTF-8,' + content;
    }

    adjustPreviewHeight() {
        try {
            var body = this.previewIframe.contentWindow.document.body;
            if (body && body.scrollHeight > 0) {
                this.previewIframe.style.height = (body.scrollHeight + 1) + 'px';
            }
        }
        catch (e) {
            // Iframe content not ready
        }
    }
});
