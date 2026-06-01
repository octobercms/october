import { CmsDocumentComponentBase } from '../../../../assets/js/cms.editor.extension.documentcomponent.base.js';
import EditorModelDefinition from '../../../../../backend/vuecomponents/monacoeditor/assets/js/modeldefinition.js';

export default {
    extends: CmsDocumentComponentBase,
    data: function() {
        const defMarkup = new EditorModelDefinition(
            'html',
            this.trans('cms::lang.content.editor_content'),
            {},
            'content',
            'backend-icon-background monaco-document html'
        );

        defMarkup.setModelTags(['cms-asset-contents']);

        return {
            documentSettingsPopupTitle: this.trans('cms::lang.editor.asset'),
            documentDeletedMessage: this.trans('cms::lang.asset.deleted'),
            documentTitleProperty: 'fileName',
            codeEditorModelDefinitions: [defMarkup],
            defMarkup: defMarkup,
            autoUpdateNavigatorNodeLabel: false
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return this.postProcessToolbarElements(
                [
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
                        type: 'separator'
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
                    {
                        type: 'button',
                        icon: this.documentHeaderCollapsed ? 'icon-angle-down' : 'icon-angle-up',
                        command: 'document:toggleToolbar',
                        fixedRight: true,
                        tooltip: this.trans('editor::lang.common.toggle_document_header')
                    }
                ],
                true // No database template features
            );
        }
    },
    methods: {
        getRootProperties: function() {
            return ['fileName', 'content'];
        },

        getMainUiDocumentProperties: function getMainUiDocumentProperties() {
            return ['fileName', 'content'];
        },

        updateNavigatorNodeUserData: function updateNavigatorNodeUserData(title) {
            this.documentNavigatorNode.userData.filename = this.documentMetadata.fileName;
            this.documentNavigatorNode.userData.path = this.documentMetadata.navigatorPath;
        },

        getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
            return this.trans('cms::lang.asset.saved');
        },

        documentLoaded: function documentLoaded(data) {
            if (this.$refs.editor) {
                this.$refs.editor.updateValue(this.defMarkup, this.documentData.content);
                this.$refs.editor.updateLanguage(this.defMarkup, this.getDocumentLanguage(this.documentData.fileName));
                this.$refs.editor.setModelCustomAttribute(this.defMarkup, 'filePath', this.documentData.fileName);
            }
            else {
                this.defMarkup.setModelCustomAttribute('filePath', this.documentData.fileName);
            }
        },

        documentSaved: function documentSaved(data, prevData) {
            if (this.$refs.editor) {
                this.$refs.editor.updateLanguage(this.defMarkup, this.getDocumentLanguage(this.documentData.fileName));
            }

            if (prevData && prevData.fileName != data.fileName) {
                this.store.refreshExtensionNavigatorNodes(this.namespace, this.documentType);
                this.$refs.editor.setModelCustomAttribute(this.defMarkup, 'filePath', data.fileName);
            }
        },

        getDocumentLanguage: function getDocumentLanguage(fileName) {
            if (!fileName) {
                return 'plaintext';
            }

            if (fileName.endsWith('.css')) {
                return 'css';
            }

            if (fileName.endsWith('.js')) {
                return 'javascript';
            }

            if (fileName.endsWith('.less')) {
                return 'less';
            }

            if (fileName.endsWith('.sass') || fileName.endsWith('.scss')) {
                return 'scss';
            }

            return 'plaintext';
        },

        documentCreatedOrLoaded: function documentCreatedOrLoaded() {
            this.defMarkup.setHolderObject(this.documentData);
        },

        monacoLoaded: function monacoLoaded() {
            this.$refs.editor.updateLanguage(this.defMarkup, this.getDocumentLanguage(this.documentData.fileName));
            this.$refs.editor.setModelCustomAttribute(this.defMarkup, 'filePath', this.documentData.fileName);
        }
    }
};
