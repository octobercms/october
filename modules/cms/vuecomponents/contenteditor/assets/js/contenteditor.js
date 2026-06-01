import { CmsDocumentComponentBase } from '../../../../assets/js/cms.editor.extension.documentcomponent.base.js';
import EditorModelDefinition from '../../../../../backend/vuecomponents/monacoeditor/assets/js/modeldefinition.js';

export default {
    extends: CmsDocumentComponentBase,
    data: function() {
        const defMarkup = new EditorModelDefinition(
            'html',
            this.trans('cms::lang.content.editor_content'),
            {},
            'markup',
            'backend-icon-background monaco-document html'
        );

        return {
            documentSettingsPopupTitle: this.trans('cms::lang.editor.content'),
            documentTitleProperty: 'fileName',
            codeEditorModelDefinitions: [defMarkup],
            savedDocumentLanguage: '',
            defMarkup: defMarkup,
            toolbarExtensionPoint: []
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return this.postProcessToolbarElements([
                {
                    type: 'button',
                    icon: 'icon-save-cloud',
                    label: this.trans('backend::lang.form.save'),
                    hotkey: 'ctrl+s, cmd+s',
                    tooltip: this.trans('backend::lang.form.save'),
                    tooltipHotkey: '⌃S, ⌘S',
                    command: 'save'
                },
                {
                    type: 'button',
                    icon: 'icon-settings',
                    label: this.trans('editor::lang.common.settings'),
                    command: 'settings',
                    hidden: !this.hasSettingsForm
                },
                {
                    type: 'separator'
                },
                {
                    type: 'button',
                    icon: 'icon-info-circle',
                    label: this.trans('cms::lang.editor.info'),
                    command: 'show-template-info',
                    disabled: this.isNewDocument
                },
                {
                    type: 'separator',
                    visibilityTag: 'hide-for-direct-document'
                },
                {
                    type: 'button',
                    icon: 'icon-delete',
                    disabled: this.isNewDocument,
                    command: 'delete',
                    hotkey: 'shift+option+d',
                    tooltip: this.trans('backend::lang.form.delete'),
                    tooltipHotkey: '⇧⌥D'
                },
                this.toolbarExtensionPoint,
                {
                    type: 'button',
                    icon: this.documentHeaderCollapsed ? 'icon-angle-down' : 'icon-angle-up',
                    command: 'document:toggleToolbar',
                    fixedRight: true,
                    tooltip: this.trans('editor::lang.common.toggle_document_header')
                }
            ]);
        },

        isRicheditorDocument: function computeIsRicheditorDocument() {
            return this.savedDocumentLanguage === 'richeditor';
        },

        isMarkdownDocument: function isMarkdownDocument() {
            return this.savedDocumentLanguage === 'markdown';
        }
    },
    methods: {
        getRootProperties: function() {
            return ['components', 'fileName', 'markup'];
        },

        getMainUiDocumentProperties: function getMainUiDocumentProperties() {
            return ['fileName', 'markup', 'description', 'components'];
        },

        updateNavigatorNodeUserData: function updateNavigatorNodeUserData(title) {
            this.documentNavigatorNode.userData.filename = this.documentMetadata.path;
            this.documentNavigatorNode.userData.path = this.documentMetadata.navigatorPath;
        },

        updateDocumentLanguage: function updateDocumentLanguage() {
            this.savedDocumentLanguage = this.getDocumentLanguage(this.documentData.fileName);
            this.$refs.editor.updateLanguage(this.defMarkup, this.savedDocumentLanguage);
        },

        documentLoaded: function documentLoaded(data) {
            if (this.$refs.editor) {
                this.$refs.editor.updateValue(this.defMarkup, this.documentData.markup);
                this.updateDocumentLanguage();
            }
        },

        documentSaved: function documentSaved() {
            if (this.$refs.editor) {
                this.updateDocumentLanguage();
            }
        },

        getDocumentLanguage: function getDocumentLanguage(fileName) {
            if (!fileName) {
                return 'html';
            }

            if (fileName.endsWith('.txt')) {
                return 'plaintext';
            }

            if (fileName.endsWith('.html')) {
                return 'richeditor';
            }

            if (fileName.endsWith('.md')) {
                return 'markdown';
            }

            return 'html';
        },

        documentCreatedOrLoaded: function documentCreatedOrLoaded() {
            this.defMarkup.setHolderObject(this.documentData);
        },

        monacoLoaded: function monacoLoaded() {
            this.updateDocumentLanguage();
        },

        onToolbarCommand: function onToolbarCommand(command, isHotkey, ev) {
            this.handleBasicDocumentCommands(command, isHotkey);

            if (command === 'show-template-info') {
                this.showTemplateInfo();
            }

            var connector = this.$refs.richEditorDocumentConnector || this.$refs.markdownEditor;
            if (connector && connector.internalEventBus) {
                connector.internalEventBus.emit('toolbarcmd', { command: command, ev: ev });
            }
        },

        onParentTabSelected: function onParentTabSelected() {
            if (this.$refs.editor) {
                this.$nextTick(() => this.$refs.editor.layout());
            }

            if (this.$refs.markdownEditor) {
                this.$nextTick(() => this.$refs.markdownEditor.refresh());
            }
        }
    },
    watch: {
        isRicheditorDocument: function watchIsHtmlDocument(value) {
            if (!value) {
                this.toolbarExtensionPoint = [];
            }
        },

        isMarkdownDocument: function watchIsMarkdownDocument(value) {
            if (!value) {
                this.toolbarExtensionPoint = [];
            }
        }
    }
};
