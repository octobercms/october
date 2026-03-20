import { modalUtils } from '../../../backend/vuecomponents/modal/assets/js/classes/index.js';

export class PreviewTracker {
    scrollTop;
    scrollLeft;
    scrollLock;
    scrollLockBuffer;
    window;
    token;
    url;

    static newTracker() {
        return new this;
    }

    openPreview(token, url) {
        this.token = token;
        this.url = url;
        this.window = window.open(this.makeUniqueUrl());

        // Fallback in case window.open was blocked
        setTimeout(() => {
            if (!this.window) {
                modalUtils.showBasic(
                    $.oc.lang.get('markdowneditor.preview'),
                    `<div class="modal-footer pt-3">
                        <a
                            href="${this.makeUniqueUrl()}"
                            target="_blank"
                            onclick="this.closest('.modal').querySelector('.btn-close').click()"
                            data-default-focus
                            class="btn btn-primary btn-default-action">${$.oc.lang.get('eventlog.editor.open')}</button>
                    </div>`
                );
            }
        }, 500);
    }

    refreshPreview(focus) {
        this.startScrollLock();

        // Register load event using some hacky logic that works
        // for unknown reasons. Detect unload, wait 1 tick, detect load
        this.window.addEventListener(
            'unload',
            () => setTimeout(
                () => this.window.addEventListener(
                    'load',
                    () => this.stopScrollLock(),
                    { once: true }),
                0),
            { once: true }
        );

        this.window.location.assign(this.makeUniqueUrl());

        if (focus) {
            this.window.focus();
        }
    }

    startScrollLock() {
        this.scrollLeft = this.window.scrollX;
        this.scrollTop = this.window.scrollY;
        this.scrollLock = setInterval(() => {
            this.window.scrollTo({
                left: this.scrollLeft,
                top: this.scrollTop,
                behavior: 'instant'
            });
        }, 1);

        // No scroll if page takes longer than 3s
        this.scrollLockBuffer = setTimeout(() => {
            clearInterval(this.scrollLock);
        }, 3000);
    }

    stopScrollLock() {
        clearInterval(this.scrollLock);
        clearInterval(this.scrollLockBuffer);
    }

    getToken() {
        return this.token;
    }

    isPreviewAvailable() {
        return this.window && !this.window.closed;
    }

    makeUniqueUrl() {
        return this.url + '&_preview_nonce=' + this.createNonce();
    }

    createNonce() {
        return (Math.random() + '').replace('.', '');
    }
}

export default PreviewTracker;
