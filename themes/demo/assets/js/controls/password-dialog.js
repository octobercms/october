;(function(){

    /**
     * PasswordDialog implements a password confirmation screen for sensitive actions
     */
    class PasswordDialog extends oc.ControlBase {
        connect() {
            addEventListener('app:password-confirming', this.proxy(this.onShowPasswordPrompt));
        }

        disconnect() {
            removeEventListener('app:password-confirming', this.proxy(this.onShowPasswordPrompt));
        }

        onShowPasswordPrompt(event) {
            this.target = event.target;
            this.popup = this.getDialogElement();
            this.form = this.popup.querySelector('form');

            document.body.appendChild(this.popup);

            // Create a new modal
            this.modal = new bootstrap.Modal(this.popup);
            this.modal.show();

            // Focus the input
            this.popup.querySelector('input[name=confirmable_password]').focus();

            // Bind events
            this.popup.querySelector('[data-cancel]').addEventListener('click', () => this.modal.hide(), { once: true });
            this.popup.addEventListener('hidden.bs.modal', () => this.disposeDialog(), { once: true });
            this.form.addEventListener('ajax:done', this.proxy(this.onPasswordConfirmed), { once: true });

            // Prevent the update workflow
            event.preventDefault();
        }

        onPasswordConfirmed(event) {
            const { data } = event.detail;

            // Resubmit original AJAX event, skipping confirmation prompts
            if (data.passwordConfirmed) {
                oc.request(this.target, null, { confirm: false });
            }

            this.modal.hide();
        }

        disposeDialog() {
            this.modal.dispose();
            this.form.removeEventListener('ajax:done', this.proxy(this.onPasswordConfirmed), { once: true });
            this.popup.remove();

            this.form = null;
            this.popup = null;
            this.modal = null;
            this.target = null;
        }

        getDialogElement() {
            var template = document.createElement('template');
            template.innerHTML = this.element.innerHTML.trim();
            return template.content.firstChild;
        }
    }

    oc.registerControl('password-dialog', PasswordDialog);

})();
