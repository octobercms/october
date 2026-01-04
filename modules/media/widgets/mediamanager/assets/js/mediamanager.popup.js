/*
 * Media manager popup
 */
class MediaManagerPopup
{
    static DEFAULTS = {
        alias: undefined,
        mediaFolder: null,
        bottomToolbar: true,
        cropAndInsertButton: false,
        onInsert: undefined,
        onClose: undefined
    };

    constructor(options) {
        this.$popupRootElement = null;
        this.$popupElement = null;

        this.options = { ...MediaManagerPopup.DEFAULTS, ...options };

        this.init();
        this.show();
    }

    dispose() {
        this.unregisterHandlers();

        this.$popupRootElement.remove();
        this.$popupRootElement = null;
        this.$popupElement = null;
    }

    init() {
        if (this.options.alias === undefined) {
            throw new Error('Media Manager popup option "alias" is not set.');
        }

        this.$popupRootElement = $('<div/>');
        this.registerHandlers();
    }

    registerHandlers() {
        this.$popupRootElement.one('hide.oc.popup', this.onPopupHidden);
        this.$popupRootElement.one('shown.oc.popup', this.onPopupShown);
    }

    unregisterHandlers() {
        this.$popupElement.off('popupcommand', this.onPopupCommand);
        this.$popupRootElement.off('popupcommand', this.onPopupCommand);
    }

    show() {
        const data = {
            bottom_toolbar: this.options.bottomToolbar ? 1 : 0,
            crop_insert_button: this.options.cropAndInsertButton ? 1 : 0
        };

        if (this.options.mediaFolder) {
            data.media_folder = this.options.mediaFolder;
        }

        this.$popupRootElement.popup({
            extraData: data,
            size: 'adaptive',
            adaptiveHeight: true,
            handler: this.options.alias + '::onLoadPopup'
        });
    }

    hide() {
        if (this.$popupElement) {
            this.$popupElement.trigger('close.oc.popup');
        }
    }

    getMediaManagerElement() {
        return this.$popupElement.find('[data-control="media-manager"]').get(0);
    }

    getMediaManagerControl() {
        return oc.fetchControl(this.getMediaManagerElement(), 'media-manager');
    }

    insertMedia() {
        const items = this.getMediaManagerControl().getSelectedItems();

        if (this.options.onInsert !== undefined) {
            this.options.onInsert.call(this, items);
        }
    }

    insertCroppedImage(imageItem) {
        if (this.options.onInsert !== undefined) {
            this.options.onInsert.call(this, [imageItem]);
        }
    }

    // EVENT HANDLERS
    // ============================

    onPopupHidden = (event, element, popup) => {
        const mediaManagerEl = this.getMediaManagerElement();

        // Control will auto-dispose when removed from DOM
        mediaManagerEl.remove();

        // Release clickedElement reference inside redactor.js
        // If we don't do it, the Media Manager popup DOM elements
        // won't be removed from memory.
        $(document).trigger('mousedown');

        this.dispose();

        if (this.options.onClose !== undefined) {
            this.options.onClose.call(this);
        }
    }

    onPopupShown = (event, element, popup) => {
        this.$popupElement = popup;
        this.$popupElement.on('popupcommand', this.onPopupCommand);

        // Unfocus other form fields, otherwise all keyboard commands
        // may the Media Manager popup translate to the form widget.
        this.getMediaManagerControl().selectFirstItem();
    }

    onPopupCommand = (ev, command, param) => {
        switch (command) {
            case 'insert':
                this.insertMedia();
                break;

            case 'insert-cropped':
                this.insertCroppedImage(param);
                break;
        }

        return false;
    }
}

oc.mediaManager.popup = MediaManagerPopup;

// @deprecated
if ($.oc === undefined) {
    $.oc = {}
}
$.oc.mediaManager = oc.mediaManager;
