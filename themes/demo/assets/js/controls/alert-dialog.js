;(function(){

    /**
     * AlertDialog implements fancy alert and confirm dialog windows.
     *
     * - alertMessage(message)
     * - confirmMessage(message, function(ok))
     */
    class AlertDialog extends oc.ControlBase
    {
        connect() {
            addEventListener('ajax:error-message', this.proxy(this.onErrorMessage));
            addEventListener('ajax:confirm-message', this.proxy(this.onConfirmMessage));
        }

        disconnect() {
            removeEventListener('ajax:error-message', this.proxy(this.onErrorMessage));
            removeEventListener('ajax:confirm-message', this.proxy(this.onConfirmMessage));
        }

        onErrorMessage(event) {
            const { message } = event.detail;
            if (!message) {
                return;
            }

            this.alertMessage(message);

            // Prevent the default alert() message
            event.preventDefault();
        }

        onConfirmMessage(event) {
            const { message, promise } = event.detail;
            if (!message) {
                return;
            }

            this.confirmMessage(message, isConfirm => {
                if (isConfirm) {
                    promise.resolve();
                }
                else {
                    promise.reject();
                }
            });

            // Prevent the default confirm() message
            event.preventDefault();
        }

        alertMessage(message) {
            var popup = this.getDialogElement();
            document.body.appendChild(popup);

            popup.querySelector('[data-cancel]').remove();
            popup.querySelector('[data-message]').innerText = message;

            var modal = new bootstrap.Modal(popup);
            modal.show();

            popup.querySelector('[data-ok]').addEventListener('click', () => {
                modal.hide();
            }, { once: true });

            popup.addEventListener('hidden.bs.modal', () => {
                modal.dispose();
                popup.remove();
            }, { once: true });

            popup.querySelector('[data-ok]').focus();
        }

        confirmMessage(message, callback) {
            var popup = this.getDialogElement();
            document.body.appendChild(popup);

            popup.querySelector('[data-message]').innerText = message;

            var modal = new bootstrap.Modal(popup);
            modal.show();

            popup.querySelector('[data-ok]').addEventListener('click', () => {
                callback && callback(true);
                modal.hide();
            }, { once: true });

            popup.querySelector('[data-cancel]').addEventListener('click', () => {
                callback && callback(false);
                modal.hide();
            }, { once: true });

            popup.addEventListener('hidden.bs.modal', () => {
                modal.dispose();
                popup.remove();
            }, { once: true });

            popup.querySelector('[data-cancel]').focus();
        }

        getDialogElement() {
            var template = document.createElement('template');
            template.innerHTML = this.element.innerHTML.trim();
            return template.content.firstChild;
        }

        static alertMessageGlobal(message) {
            const alertDialog = oc.fetchControl('[data-control=alert-dialog]');
            if (alertDialog) {
                alertDialog.alertMessage(message);
            }
        }

        static confirmMessageGlobal(message, callback) {
            const alertDialog = oc.fetchControl('[data-control=alert-dialog]');
            if (alertDialog) {
                alertDialog.confirmMessage(message, callback);
            }
        }
    }

    oc.registerControl('alert-dialog', AlertDialog);

    window.alertMessage = AlertDialog.alertMessageGlobal;

    window.confirmMessage = AlertDialog.confirmMessageGlobal;

})();
