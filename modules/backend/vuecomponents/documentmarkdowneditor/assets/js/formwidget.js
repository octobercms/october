class FormWidget {
    constructor(element, options, changeCallback) {
        this.element = element;
        this.changeCallback = changeCallback;

        // Create wrapper element for Vue app
        this.wrapperEl = document.createElement('div');
        element.parentNode.appendChild(this.wrapperEl);

        // Create and mount Vue 3 app after page scripts have loaded
        const self = this;
        oc.pageReady().then(() => {
            this.app = oc.createVueApp({
                data() {
                    return {
                        textarea: element,
                        useMediaManager: options.useMediaManager,
                        sideBySide: options.sideBySide,
                        options: options,
                        lang: $(element).closest('.field-markdowneditor').data()
                    };
                },
                template: '<backend-document-markdowneditor-formwidgetconnector ref="connector" :textarea="textarea" :use-media-manager="useMediaManager" :side-by-side="sideBySide" :options="options" :lang="lang" @change="onChange" @focus="onFocus" @blur="onBlur" />',
                methods: {
                    onChange() {
                        if (self.changeCallback) {
                            self.changeCallback();
                        }
                    },
                    onFocus() {
                        $(element).closest('.field-markdowneditor').addClass('editor-focus');
                    },
                    onBlur() {
                        $(element).closest('.field-markdowneditor').removeClass('editor-focus');
                    }
                }
            });

            this.vm = this.app.mount(this.wrapperEl);
            this.element.addEventListener('change', this.onChangeTextarea);
        });
    }

    onChangeTextarea = () => {
        this.setContent(this.element.value);
    }

    get connectorInstance() {
        return this.vm?.$refs?.connector;
    }

    setContent(str) {
        if (this.connectorInstance) {
            this.connectorInstance.value = this.element.value;
        }
    }

    remove() {
        this.element.removeEventListener('change', this.onChangeTextarea);

        if (this.app) {
            this.app.unmount();
            $(this.wrapperEl).remove();
        }

        this.app = null;
        this.vm = null;
        this.wrapperEl = null;
        this.element = null;
    }
}

export default FormWidget;