'use strict';

oc.registerControl('mailformpreview', class extends oc.ControlBase {
    connect() {
        this.iframe = null;
        this.handler = this.config.handler || 'onPreviewTemplate';
        this.pane = $(this.element).closest('.tab-pane');

        this.createIframe();

        this.boundOnTabShown = this.proxy(this.onTabShown);
        $(document).on('shown.bs.tab shownLinkable.oc.tab', this.boundOnTabShown);

        if (this.isPaneActive()) {
            this.loadPreview();
        }
    }

    disconnect() {
        $(document).off('shown.bs.tab shownLinkable.oc.tab', this.boundOnTabShown);
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

    isPaneActive() {
        return !this.pane.length || this.pane.hasClass('active');
    }

    onTabShown() {
        if (this.isPaneActive()) {
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
