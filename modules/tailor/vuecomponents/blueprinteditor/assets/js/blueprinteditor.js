Vue.component('tailor-editor-component-blueprint-editor', {
    extends: oc.Modules.import('tailor.editor.extension.documentcomponent.base'),
    data: function() {
        const EditorModelDefinition = oc.Modules.import('backend.vuecomponents.monacoeditor.modeldefinition');
        const defMarkup = new EditorModelDefinition(
            'yaml',
            this.trans('tailor::lang.blueprint.editor_yaml'),
            {},
            'content',
            'backend-icon-background monaco-document yaml',
            'blueprint.yaml'
        );

        return {
            documentData: {
            },
            documentDeletedMessage: this.trans('tailor::lang.blueprint.deleted'),
            documentTitleProperty: 'fileName',
            codeEditorModelDefinitions: [defMarkup],
            defMarkup: defMarkup,
            autoUpdateNavigatorNodeLabel: false
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return [
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
                    icon: 'icon-database-flash',
                    disabled: this.isNewDocument,
                    command: 'apply',
                    hotkey: 'ctrl+enter',
                    label: this.trans('tailor::lang.blueprint.apply'),
                    tooltip: this.trans('tailor::lang.blueprint.apply'),
                    tooltipHotkey: '⌃↵'
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
                    icon: this.documentHeaderCollapsed ? 'icon-angle-down-arrow' : 'icon-angle-up-arrow',
                    command: 'document:toggleToolbar',
                    fixedRight: true,
                    tooltip: this.trans('editor::lang.common.toggle_document_header')
                }
            ];
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
            this.documentNavigatorNode.userData.fileName = this.documentMetadata.fileName;
            this.documentNavigatorNode.userData.path = this.documentMetadata.navigatorPath;
        },

        getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
            return this.trans('tailor::lang.blueprint.saved');
        },

        documentLoaded: function documentLoaded(data) {
            if (this.$refs.editor) {
                this.$refs.editor.updateValue(this.defMarkup, this.documentData.content);
                this.$refs.editor.updateLanguage(this.defMarkup, 'yaml');
                this.$refs.editor.setModelCustomAttribute(this.defMarkup, 'filePath', this.documentData.fileName);
            }
            else {
                this.defMarkup.setModelCustomAttribute('filePath', this.documentData.fileName);
            }
        },

        documentSaved: function documentSaved(data, prevData) {
            if (prevData && prevData.fileName != data.fileName) {
               this.store.refreshExtensionNavigatorNodes(this.namespace, this.documentType);
            }
        },

        documentCreatedOrLoaded: function documentCreatedOrLoaded() {
            this.defMarkup.setHolderObject(this.documentData);
        },

        monacoLoaded: function monacoLoaded() {
            this.$refs.editor.setModelCustomAttribute(this.defMarkup, 'filePath', this.documentData.fileName);
        },

        applyBlueprint: async function applyBlueprint() {
            const messageId = oc.snackbar.show(this.trans('tailor::lang.blueprint.migrating'), {
                timeout: 8000
            });

            try {
                await this.saveDocumentAndHandleValidation(true);
            } catch(error) {
                oc.snackbar.hide(messageId);
                return;
            }

            this.processing = true;

            try {
                const data = await this.ajaxRequest('onCommand', {
                    extension: this.namespace,
                    command: 'onMigrateBlueprint',
                    documentMetadata: this.documentMetadata,
                    documentData: this.documentData,
                });

                this.processing = false;
                oc.snackbar.show(this.trans('tailor::lang.blueprint.migrated'), { replace: messageId });

                $.oc.mainMenu.reload(data.mainMenu, data.mainMenuLeft, data.sidenavResponsive);
            } catch (error) {
                this.processing = false;
                oc.snackbar.hide(messageId);
                oc.vueComponentHelpers.modalUtils.showAlert(
                    $.oc.editor.getLangStr('editor::lang.common.error'),
                    error.responseText
                );
            }
        },

        shouldDisplayDocumentSaveErrorPopup: function shouldDisplayDocumentSaveErrorPopup(error) {
            if (error.responseJSON && error.responseJSON.blueprintError) {
                return false;
            }

            return true;
        },

        saveDocumentAndHandleValidation: async function saveDocumentAndHandleValidation(noSavedMessage) {
            try {
                const data = await this.saveDocument(false, null, null, noSavedMessage);
                this.$refs.editor.updateDecorations([]);

                if (data.contentChanged) {
                    this.processing = true;
                    try {
                        const requestData = await this.requestDocumentFromServer({}, true);
                        this.processing = false;
                        this.documentCreatedOrLoaded();
                        this.documentLoaded(requestData);
                    }
                    catch (error) {
                        this.processing = false;
                        throw error;
                    }
                }

                return data;
            }
            catch (error) {
                if (error.responseJSON && error.responseJSON.blueprintError) {
                    const blueprintError = error.responseJSON.blueprintError;

                    this.$refs.editor.updateDecorations([{
                        range: this.$refs.editor.makeRange(blueprintError.line, 1, blueprintError.line, 100),
                        options: {
                            isWholeLine: true,
                            className: 'monaco-error-line',
                            glyphMarginClassName: 'monaco-error-glyph',
                            hoverMessage: [{ value: blueprintError.message }],
                            glyphMarginHoverMessage: [{value: blueprintError.message}]
                        }
                    }]);

                    this.$refs.editor.editor.revealLineInCenter(blueprintError.line);
                    this.$refs.editor.editor.setPosition({column: 1, lineNumber: blueprintError.line});
                }

                throw error;
            }
        },

        onBlueprintToolbarCommand: function onBlueprintToolbarCommand(command, isHotkey) {
            if (command === 'save' && !(isHotkey && !this.canHandleHotkey())) {
                this.saveDocumentAndHandleValidation().then($.noop, $.noop);;
                return;
            }

            this.onToolbarCommand(command, isHotkey);

            if (isHotkey && !this.canHandleHotkey()) {
                return;
            }

            if (command === 'apply') {
                this.applyBlueprint();
            }
        }
    },
    template: '#tailor_vuecomponents_blueprinteditor'
});