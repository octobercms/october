+(function($) {
    'use strict';

    class PopupStacker
    {
        constructor() {
            $(document).on('hidden.bs.modal', (ev) => this.onPopupHidden(ev));
            $(document).on('shown.bs.modal', (ev) => this.onPopupShown(ev));
            oc.Events.on(document, 'popup:show', (ev) => this.onPopupShowing(ev));
        }

        onPopupHidden(ev) {
            this.redrawStack();
            this.pullForward();
        }

        onPopupShowing(ev) {
            document.activeElement && document.activeElement.blur();
            this.redrawStack(true);
        }

        onPopupShown(ev) {
            var el = ev.target;

            if (!el.dataset.popupStackId) {
                el.dataset.popupStackId = this.generateUniqueId();
            }

            this.redrawStack();
        }

        pullForward() {
            const el = this.getFirstPopup();
            if (!el) {
                return;
            }

            const content = el.querySelector('.modal-content');
            if (content) {
                content.style.transform = null;
                content.style.transformOrigin = null;
                el.style.zIndex = null;

                // Wait for transition end (.3s)
                setTimeout(() => {
                    if (content) {
                        content.style.transition = null;
                    }
                }, 350);
            }

            const backdrop = el.previousElementSibling;
            if (backdrop && backdrop.classList.contains('popup-backdrop')) {
                backdrop.style.zIndex = null;
            }
        }

        redrawStack(isEarly) {
            let count = 0;

            this.getAllPopups().forEach((el) => {
                count++;

                // Push back popups before a new popup spawns
                let offset = count;
                if (!isEarly) {
                    offset--;

                    if (count === 1) {
                        return;
                    }
                }

                const content = el.querySelector('.modal-content');
                if (content && !content.classList.contains('popup-loading-indicator')) {
                    content.style.transform = `scale(.9) translate(-${2*offset}rem, -${50*offset}px)`;
                    content.style.transformOrigin = 'top left';
                    content.style.transition = 'all .3s';
                    el.style.zIndex = (490 - offset);
                }

                const backdrop = el.previousElementSibling;
                if (backdrop && backdrop.classList.contains('popup-backdrop')) {
                    backdrop.style.zIndex = (490 - offset);
                }
            });
        }

        getFirstPopup() {
            return this.getAllPopups()[0];
        }

        getAllPopups() {
            return Array.from(document.querySelectorAll('.modal.show[data-popup-stack-id]')).reverse();
        }

        generateUniqueId() {
            return "popupid-" + Math.floor(Math.random() * new Date().getTime());
        }
    }

    oc.popupStacker = new PopupStacker();

})($);
