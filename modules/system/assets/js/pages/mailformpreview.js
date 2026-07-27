'use strict';

oc.registerControl('mailformpreview', class extends oc.ControlBase {
    connect() {
        this.iframe = null;
        this.handler = this.config.handler || 'onPreviewTemplate';

        this.createIframe();
        this.loadPreview();

        this.boundOnSaveSuccess = this.proxy(this.onSaveSuccess);
        $(document).on('ajaxSuccess', this.boundOnSaveSuccess);
    }

    disconnect() {
        $(document).off('ajaxSuccess', this.boundOnSaveSuccess);
    }

    createIframe() {
        this.iframe = document.createElement('iframe');
        this.iframe.style.width = '100%';
        this.iframe.style.border = '0';
        this.iframe.style.minHeight = '400px';
        this.iframe.setAttribute('frameborder', 0);
        this.iframe.onload = this.proxy(this.adjustHeight);
        this.element.appendChild(this.iframe);
    }

    onSaveSuccess(event, context) {
        if (context && context.handler && context.handler.indexOf('onSave') !== -1) {
            this.loadPreview();
        }
    }

    loadPreview() {
        const self = this;
        $('#Form').request(this.handler, {
            success: function(data) {
                if (data.previewHtml !== undefined) {
                    self.setContent(data.previewHtml);
                }
            }
        });
    }

    setContent(html) {
        'srcdoc' in this.iframe
            ? this.iframe.srcdoc = html
            : this.iframe.src = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
    }

    adjustHeight() {
        try {
            const body = this.iframe.contentWindow.document.body;
            if (body && body.scrollHeight > 0) {
                this.iframe.style.height = (body.scrollHeight + 20) + 'px';
            }
        }
        catch (e) {}
    }
});
