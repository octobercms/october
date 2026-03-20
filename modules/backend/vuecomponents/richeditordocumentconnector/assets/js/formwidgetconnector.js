export default {
    props: {
        textarea: null,
        lang: {},
        useMediaManager: {
            type: Boolean,
            default: false
        },
        options: Object
    },
    data: function () {
        const toolbarExtensionPoint = [];

        return {
            toolbarExtensionPoint,
            fullScreen: false,
            value: ''
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return [
                this.toolbarExtensionPoint,
                {
                    type: 'button',
                    icon: this.fullScreen ? 'icon-fullscreen-collapse' : 'icon-fullscreen',
                    command: 'document:toggleFullscreen',
                    pressed: this.fullScreen,
                    fixedRight: true,
                    tooltip: this.lang.langFullscreen
                }
            ];
        },

        editorOptions: function computeEditorOptions() {
            if (typeof this.options.editorOptions !== 'object') {
                return {};
            }

            return this.options.editorOptions;
        },

        toolbarButtons: function computeToolbarButtons() {
            if (typeof this.options.toolbarButtons !== 'string') {
                return [];
            }

            return this.options.toolbarButtons.split(',').map((button) => {
                return button.trim();
            });
        },

        fullPage: function computeFullPage() {
            return !!this.options.fullpage;
        },

        readOnly: function computeReadOnly() {
            return this.options.readOnly;
        },

        externalToolbarAppState: function computeExternalToolbarAppState() {
            return this.options.externalToolbarAppState;
        },

        toolbarExtensionPointProxy: function computeToolbarExtensionPointProxy() {
            if (!this.options.externalToolbarAppState) {
                return this.toolbarExtensionPoint;
            }

            const point = $.oc.vueUtils.getToolbarExtensionPoint(
                this.options.externalToolbarAppState,
                this.textarea
            );

            return point ? point.state : this.toolbarExtensionPoint;
        },

        hasExternalToolbar: function computeHasExternalToolbar() {
            return !!this.options.externalToolbarAppState;
        },

        showMargins: function computeShowMargins() {
            return this.options.showMargins ? true : false;
        }
    },
    mounted: function onMounted() {
        this.value = this.textarea.value;
    },
    methods: {
        getEditor: function getEditor() {
            return this.$refs.richeditor.getEditor();
        },

        setContent: function setContent(str) {
            this.value = str;
        },

        onToolbarCommand: function onToolbarCommand(cmd, ev) {
            if (cmd == 'document:toggleFullscreen') {
                this.fullScreen = !this.fullScreen;
                return;
            }

            // Forward toolbar commands to the richeditor document connector
            const connector = this.$refs.documentConnector;
            if (connector && connector.internalEventBus) {
                connector.internalEventBus.emit('toolbarcmd', { command: cmd, ev: ev });
            }
        },

        onFocus: function onFocus() {
            this.$emit('focus');
        },

        onBlur: function onBlur() {
            this.$emit('blur');
        }
    },
    beforeUnmount: function beforeUnmount() {
    },
    watch: {
        value: function watchValue(newValue) {
            if (newValue != this.textarea.value) {
                this.textarea.value = newValue;
                this.$emit('change');
            }
        }
    }
};
