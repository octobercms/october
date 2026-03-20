/*
 * Modal utilities helper
 */
export class ModalUtils {
    #validateAlertOptions(options) {
        if (options) {
            if (typeof options !== 'object') {
                throw new Error('options must be an object');
            }

            if (options.buttonText && typeof options.buttonText !== 'string') {
                throw new Error('options.buttonText must be a string');
            }

            if (options.size && typeof options.size !== 'string') {
                throw new Error('options.size must be a string');
            }
        }

        return options || {};
    }

    #validateBasicArguments(title, text) {
        if (typeof title !== 'string' || !title.length) {
            throw new Error('Modal title is required');
        }

        if (typeof text !== 'string' || !text.length) {
            throw new Error('Modal text is required');
        }
    }

    showAlert(title, text, options) {
        options = this.#validateAlertOptions(options);
        this.#validateBasicArguments(title, text);

        return new Promise((resolve, reject) => {
            // Create container element for Vue app
            const wrapperEl = document.createElement('div');
            document.body.appendChild(wrapperEl);

            // Create Vue 3 app
            const app = oc.createVueApp({
                data() {
                    return {
                        title: title,
                        text: text,
                        buttonText: options.buttonText,
                        size: options.size || 'normal'
                    };
                },
                template: '<backend-modal-alert :title="title" :text="text" :button-text="buttonText" :size="size" @close="onClose" />',
                methods: {
                    onClose() {
                        app.unmount();
                        document.body.removeChild(wrapperEl);
                        resolve();
                    }
                }
            });

            app.mount(wrapperEl);
        });
    }

    showBasic(title, content) {
        this.#validateBasicArguments(title, content);

        return new Promise((resolve, reject) => {
            // Create container element for Vue app
            const wrapperEl = document.createElement('div');
            document.body.appendChild(wrapperEl);

            let buttonClicked = false;

            // Create Vue 3 app
            const app = oc.createVueApp({
                data() {
                    return {
                        title: title,
                        text: content,
                        buttonText: ""
                    };
                },
                template: '<backend-modal-basic :title="title" :text="text" :button-text="buttonText" @close="onClose" @closeclick="onCloseClick" />',
                methods: {
                    onClose() {
                        app.unmount();
                        document.body.removeChild(wrapperEl);

                        if (!buttonClicked) {
                            reject(false);
                        }
                    },
                    onCloseClick(button) {
                        buttonClicked = true;
                        resolve(button);
                    }
                }
            });

            app.mount(wrapperEl);
        });
    }

    showConfirm(title, text, options) {
        options = this.#validateAlertOptions(options);
        this.#validateBasicArguments(title, text);

        if (options.isDanger !== undefined && typeof options.isDanger !== 'boolean') {
            throw new Error('showConfirm options.isDanger must be Boolean');
        }

        return new Promise((resolve, reject) => {
            // Create container element for Vue app
            const wrapperEl = document.createElement('div');
            document.body.appendChild(wrapperEl);

            let buttonClicked = false;

            // Create Vue 3 app
            const app = oc.createVueApp({
                data() {
                    return {
                        title: title,
                        text: text,
                        isDanger: options.isDanger,
                        buttonText: options.buttonText,
                        size: options.size || 'normal'
                    };
                },
                template: '<backend-modal-confirm :title="title" :text="text" :is-danger="isDanger" :button-text="buttonText" :size="size" @close="onClose" @buttonclick="onButtonClick" />',
                methods: {
                    onClose() {
                        app.unmount();
                        document.body.removeChild(wrapperEl);

                        if (!buttonClicked) {
                            reject(false);
                        }
                    },
                    onButtonClick() {
                        buttonClicked = true;
                        resolve();
                    }
                }
            });

            app.mount(wrapperEl);
        });
    }
}

export const modalUtils = new ModalUtils();
export default modalUtils;
