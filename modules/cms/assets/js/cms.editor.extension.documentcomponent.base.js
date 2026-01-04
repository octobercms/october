oc.Modules.register('cms.editor.extension.documentcomponent.base', function() {
    'use strict';

    const EditorDocumentComponentBase = {
        extends: oc.Modules.import('editor.extension.documentcomponent.base'),
        data: function() {
            return {
                toolbarDisabled: false,
                savingDocument: false,
                documentSavedMessage: this.trans('cms::lang.template.saved'),
                documentReloadedMessage: this.trans('cms::lang.template.reloaded'),
                documentDeletedMessage: this.trans('cms::lang.template.deleted')
            };
        },

        computed: {
            databaseTemplatesEnabled: function computeDatabaseTemplatesEnabled() {
                return this.extension.customData.databaseTemplatesEnabled;
            },

            hasVisibleComponents: function computeHasVisibleComponents() {
                if (!this.documentData.components) {
                    return false;
                }

                return this.documentData.components.some((component) => !component.isHidden);
            },

            customToolbarButtons: function computeCustomToolbarButtons() {
                const buttons = this.extension.getCustomToolbarSettingsButtons(this.documentType);

                if (!Array.isArray(buttons) || !buttons.length) {
                    return [];
                }

                let result = [];

                result.push({
                    type: 'separator'
                });

                buttons.forEach((button, index) => {
                    let buttonDefinition = {
                        type: 'button',
                        icon: typeof button.icon === 'string' ? button.icon : undefined,
                        label: button.button,
                        command: 'custom-toolbar-button@' + index
                    };

                    result.push(buttonDefinition);
                });

                result.push({
                    type: 'separator'
                });

                return result;
            },

            viewBagComponent: function computeViewBagComponent() {
                if (!this.documentData.components) {
                    return undefined;
                }

                if (!Array.isArray(this.documentData.components)) {
                    return undefined;
                }

                return this.documentData.components.find((component) => {
                    return component.className === 'Cms\\Components\\ViewBag';
                });
            }
        },

        methods: {
            getRootProperties: function getRootProperties() {
                throw new Error('getRootProperties must be implemented in CmsDocumentEditorComponentBase descendants.');
            },

            monacoLoaded: function monacoLoaded() {
                // Overwrite this method in subclasses
            },

            getInfoPopupItems: function getInfoPopupItems() {
                const mtime = this.documentMetadata.mtime;
                const storage = [this.trans('cms::lang.template.storage_filesystem')];

                if (this.documentMetadata.canResetFromTemplateFile) {
                    storage.push(this.trans('cms::lang.template.storage_database'));
                }

                return [
                    {
                        title: this.trans('cms::lang.template.last_modified'),
                        value: moment.unix(mtime).format('ll LTS')
                    },
                    {
                        title: this.trans('cms::lang.template.storage'),
                        value: storage.join(', ')
                    },
                    {
                        title: this.trans('cms::lang.template.template_file'),
                        value: this.documentMetadata.fullPath
                    }
                ];
            },

            getSaveDocumentData: function getSaveDocumentData(inspectorDocumentData) {
                const rootProperties = this.getRootProperties();
                const documentData = inspectorDocumentData ? inspectorDocumentData : this.documentData;

                const data = $.oc.vueUtils.getCleanObject(documentData);
                const result = {
                    settings: {}
                };

                // Copy root properties
                //
                Object.keys(data).forEach((property) => {
                    if (property === 'settings') {
                        return;
                    }

                    if (rootProperties.indexOf(property) !== -1) {
                        result[property] = data[property];
                    }
                    else {
                        result.settings[property] = data[property];
                    }
                });

                // Copy custom settings properties
                //
                if (typeof data.settings === 'object') {
                    Object.keys(data.settings).forEach((property) => {
                        if (rootProperties.indexOf(property) === -1 && result.settings[property] === undefined) {
                            result.settings[property] = data.settings[property];
                        }
                    });
                }

                return result;
            },

            getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
                if (responseData.templateFileUpdated) {
                    return this.trans('cms::lang.template.file_updated');
                }

                if (this.databaseTemplatesEnabled) {
                    // TODO - this must be ignored for assets
                    return this.trans('cms::lang.template.saved_to_db');
                }

                return this.documentSavedMessage;
            },

            resetFromTemplateFile: async function resetFromTemplateFile() {
                try {
                    var result = await this.requestDocumentFromServer(
                        {
                            resetFromTemplateFile: true
                        },
                        true
                    );
                    this.documentCreatedOrLoaded();
                    this.documentLoaded(result);
                    oc.snackbar.show(this.trans('cms::lang.template.reset_from_template_success'));
                }
                catch (error) {
                    let errorText = error.responseText;
                    oc.vueComponentHelpers.modalUtils.showAlert(this.trans('editor::lang.common.error'), errorText);
                }
            },

            addComponent: function addComponent(componentData) {
                if (!Array.isArray(this.documentData.components)) {
                    return;
                }

                let counter = 1,
                    originalAlias = componentData.alias,
                    alias = componentData.alias;

                while (
                    this.documentData.components.some((component) => {
                        return component.alias == alias;
                    })
                ) {
                    alias = originalAlias + (++counter);
                }

                componentData.alias = alias;
                componentData.propertyValues['oc.alias'] = alias;
                componentData.propertyValues = JSON.stringify(componentData.propertyValues);
                this.documentData.components.push(componentData);

                return alias;
            },

            postProcessToolbarElements: function postProcessToolbarElements(
                toolbarElements,
                noDatabaseTemplateFeatures
            ) {
                let dbOperationsMenu = undefined;
                if (this.databaseTemplatesEnabled && !noDatabaseTemplateFeatures) {
                    dbOperationsMenu = [
                        {
                            type: 'text',
                            command: 'update-template-file',
                            label: this.trans('cms::lang.template.update_file'),
                            disabled: !this.documentMetadata.canUpdateTemplateFile || this.isDocumentChanged
                        },
                        {
                            type: 'text',
                            command: 'reset-from-template-file',
                            label: this.trans('cms::lang.template.reset_from_file'),
                            disabled: !this.documentMetadata.canResetFromTemplateFile || this.isDocumentChanged
                        }
                    ];
                }

                toolbarElements.some((element) => {
                    if (element.command === 'save') {
                        element.menuitems = dbOperationsMenu;
                        return true;
                    }
                });

                if ($.oc.editor.application.isDirectDocumentMode) {
                    toolbarElements.forEach((element) => {
                        if (
                            element.command === 'document:toggleToolbar' ||
                            element.command === 'delete' ||
                            element.visibilityTag === 'hide-for-direct-document') {
                            element.hidden = true;
                        }
                    });
                }

                return toolbarElements;
            },

            showTemplateInfo: function showTemplateInfo() {
                this.application.showEditorDocumentInfoPopup(this.getInfoPopupItems(), this.documentMetadata.typeName);
            },

            expandComponent: async function expandComponent(payload) {
                this.processing = true;

                try {
                    const data = await this.ajaxRequest('onCommand', {
                        extension: this.namespace,
                        command: 'onExpandCmsComponent',
                        documentMetadata: this.documentMetadata,
                        documentData: this.documentData,
                        componentAlias: payload.alias
                    });

                    this.processing = false;
                    this.$refs.editor.replaceAsSnippet(payload.model, payload.range, data.content.trim());
                } catch (error) {
                    this.processing = false;
                    oc.vueComponentHelpers.modalUtils.showAlert(
                        $.oc.editor.getLangStr('editor::lang.common.error'),
                        error.responseText
                    );
                }
            },

            handleCustomToolbarButton: function handleCustomToolbarButton(command) {
                const parts = command.split('@');
                const buttonIndex = parts[1];
                const buttons = this.extension.getCustomToolbarSettingsButtons(this.documentType);

                if (!buttons[buttonIndex]) {
                    return;
                }

                const button = buttons[buttonIndex];
                const settingsProperties = button.properties;

                if (typeof settingsProperties !== 'object') {
                    throw new Error('Custom button properties must be an array');
                }

                let dataHolder = this.documentData;
                if (button.useViewBag) {
                    if (!this.viewBagComponent) {
                        throw new Error('View bag component not found');
                    }

                    dataHolder = JSON.parse(this.viewBagComponent.propertyValues);
                }

                oc.vueComponentHelpers.inspector.host
                    .showModal(
                        button.popupTitle ? button.popupTitle : this.documentSettingsPopupTitle,
                        dataHolder,
                        settingsProperties,
                        'cms-custom-settings',
                        {
                            buttonText: this.trans('backend::lang.form.apply'),
                            resizableWidth: true,
                            beforeApplyCallback: async (updatedDataObj) => {
                                if (button.useViewBag) {
                                    this.viewBagComponent.propertyValues = JSON.stringify(updatedDataObj);
                                }
                            }
                        }
                    )
                    .then($.noop, $.noop);
            },

            onEditorDragDrop: function onDragDrop(editor, ev) {
                ev.preventDefault();

                if (!this.defMarkup) {
                    return;
                }

                const currentModelUri = this.$refs.editor.getCurrentModelUri();
                if (currentModelUri != this.defMarkup.uriString) {
                    return;
                }

                const componentDefinitionStr = ev.dataTransfer.getData('application/october-component');
                if (!componentDefinitionStr) {
                    return;
                }

                const componentDefinition = JSON.parse(componentDefinitionStr);
                const alias = this.addComponent(componentDefinition);

                this.$refs.editor.insertText("{% component '" + alias + "' %}");
            },

            onComponentRemove: function onComponentRemove(component) {
                if (this.documentData.markup && this.defMarkup) {
                    const componentStr = "{% component '" + component.alias + "' %}";
                    this.$refs.editor.replaceText(componentStr, '', this.defMarkup);
                }
            },

            onParentTabSelected: function onParentTabSelected() {
                if (this.$refs.editor) {
                    this.$nextTick(() => this.$refs.editor.layout());
                }
            },

            onToolbarCommand: function onToolbarCommand(command, isHotkey) {
                this.handleBasicDocumentCommands(command, isHotkey);

                if (command === 'show-components') {
                    this.store.dispatchCommand('cms:show-component-list');
                }

                if (command === 'update-template-file') {
                    this.saveDocument(false, null, {
                        updateTemplateFile: true
                    }).then($.noop, $.noop);
                }

                if (command === 'reset-from-template-file') {
                    this.resetFromTemplateFile().then($.noop, $.noop);
                }

                if (command === 'show-template-info') {
                    this.showTemplateInfo();
                }

                if (command.startsWith('custom-toolbar-button@')) {
                    this.handleCustomToolbarButton(command);
                }
            },

            onInspectorShowed: function onInspectorShowed() {
                this.toolbarDisabled = true;
            },

            onInspectorHidden: function onInspectorHidden() {
                this.toolbarDisabled = false;
            },

            onMonacoLoaded: function onMonacoLoaded(monaco, editor) {
                this.extension.intellisense.init(monaco, editor, this.$refs.editor);
                this.monacoLoaded();
            },

            onMonacoDispose: function onMonacoDispose(editor) {
                this.extension.intellisense.disposeForEditor(editor);
            },

            onEditorContextMenu: function onEditorContextMenu(payload) {
                this.extension.intellisense.onContextMenu(payload);
            },

            onEditorFilterSupportedActions: function onEditorFilterSupportedActions(payload) {
                this.extension.intellisense.onFilterSupportedActions(payload);
            },

            onEditorCustomEvent: function onEditorCustomEvent(eventName, payload) {
                if (eventName == 'expandComponent') {
                    this.expandComponent(payload);
                }
            },

            onApplicationCommand: function onApplicationCommand(command, payload) {
                if (command === 'cms:intellisense-trigger-completion') {
                    // Not in use
                    this.$refs.editor.editor.trigger(payload.source, 'editor.action.triggerSuggest', payload.options);
                }
            }
        }
    };

    return EditorDocumentComponentBase;
});
