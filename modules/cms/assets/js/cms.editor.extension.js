oc.Modules.register('editor.extension.cms.main', function() {
    'use strict';

    const ExtensionBase = oc.Modules.import('editor.extension.base');
    const DocumentUri = oc.Modules.import('editor.documenturi');
    const EditorCommand = oc.Modules.import('editor.command');

    // Declaring this as a scoped variable. For some reason,
    // making this a property of CmsEditorExtension causes
    // stack overflow in Vue.
    let componentListInstance = null;

    class CmsEditorExtension extends ExtensionBase {
        intellisense;

        constructor(namespace) {
            super(namespace);

            Vue.nextTick(() => {
                this.createComponentListPopup();
            });
        }

        get componentList() {
            return this.state.customData.components;
        }

        get cmsTheme() {
            return this.customData['theme'];
        }

        setInitialState(initialState) {
            super.setInitialState(initialState);

            this.intellisense = oc.Modules.import('cms.editor.intellisense').make(this.state.customData);
            this.intellisense.on('onTokenClick', (tokenClickData) => this.onTokenClick(tokenClickData));
        }

        listDocumentControllerClasses() {
            return [
                oc.Modules.import('cms.editor.extension.documentcontroller.page'),
                oc.Modules.import('cms.editor.extension.documentcontroller.layout'),
                oc.Modules.import('cms.editor.extension.documentcontroller.partial'),
                oc.Modules.import('cms.editor.extension.documentcontroller.content'),
                oc.Modules.import('cms.editor.extension.documentcontroller.asset')
            ];
        }

        removeFileExtension(fileName) {
            return fileName.split('.').slice(0, -1).join('.');
        }

        createComponentListPopup() {
            const componentClass = Vue.extend(Vue.options.components['cmd-component-list-popup']);
            componentListInstance = new componentClass({});

            componentListInstance.$mount();
            document.body.appendChild(componentListInstance.$el);
        }

        addCmsComponent(componentData) {
            const documentComponent = $.oc.editor.application.getCurrentDocumentComponent();

            if (!documentComponent || typeof documentComponent.addComponent !== 'function') {
                return;
            }

            documentComponent.addComponent(componentData);
        }

        getCustomToolbarSettingsButtons(documentType) {
            return this.state.customData.customToolbarSettingsButtons[documentType];
        }

        onCommand(commandString, payload) {
            super.onCommand(commandString, payload);

            if (commandString === 'global:application-tab-selected') {
                if (!payload) {
                    if (componentListInstance) {
                        componentListInstance.hide();
                    }
                    return;
                }

                const uri = DocumentUri.parse(payload);
                if (uri.namespace !== 'cms') {
                    if (componentListInstance) {
                        componentListInstance.hide();
                    }
                }

                const documentsSupportingComponents = ['cms-page', 'cms-partial', 'cms-layout'];
                if (documentsSupportingComponents.indexOf(uri.documentType) === -1) {
                    if (componentListInstance) {
                        componentListInstance.hide();
                    }
                }

                return;
            }

            if (commandString === 'cms:add-component') {
                return this.addCmsComponent(payload);
            }

            if (commandString === 'cms:refresh-navigator') {
                this.editorStore.refreshExtensionNavigatorNodes(this.editorNamespace).then(() => {});

                return;
            }

            if (commandString === 'cms:show-component-list') {
                if (componentListInstance) {
                    componentListInstance.show();
                }
            }

            const editorCommand = new EditorCommand(commandString);
            if (editorCommand.basePart === 'cms:set-edit-theme') {
                this.onSetEditTheme(editorCommand.parameter);
            }
        }

        onTokenClick(tokenClickData) {
            if (tokenClickData.type == 'cms-partial' || tokenClickData.type == 'cms-page') {
                let path = tokenClickData.path;
                if (!path.endsWith('.htm')) {
                    path += '.htm';
                }

                this.openDocumentByUniqueKey('cms:' + tokenClickData.type + ':' + path);
            }

            if (tokenClickData.type == 'cms-content') {
                this.openDocumentByUniqueKey('cms:cms-content:' + tokenClickData.path);
            }

            if (tokenClickData.type == 'cms-asset') {
                this.openDocumentByUniqueKey('cms:cms-asset:' + tokenClickData.path);
            }
        }

        async onSetEditTheme(theme) {
            if (this.editorApplication.hasChangedTabs()) {
                oc.vueComponentHelpers.modalUtils.showAlert(
                    this.trans('cms::lang.editor.change_edit_theme'),
                    this.trans('cms::lang.editor.edit_theme_saved_changed_tabs')
                );

                return;
            }

            this.editorApplication.closeAllTabs();
            this.editorApplication.setNavigatorReadonly(true);

            const changingMessageId = oc.snackbar.show(this.trans('cms::lang.theme.setting_edit_theme'), {
                timeout: 5000
            });

            try {
                await this.editorApplication.ajaxRequest('onCommand', {
                    extension: this.editorNamespace,
                    command: 'onSetEditTheme',
                    documentMetadata: {
                        theme: theme
                    }
                });

                // await this.editorStore.refreshExtensionNavigatorNodes(this.editorNamespace);
                await this.editorStore.refreshExtensionNavigatorNodes('*');

                oc.snackbar.show(this.trans('cms::lang.theme.edit_theme_changed'), { replace: changingMessageId });
                this.customData['theme'] = theme;
                this.editorApplication.setNavigatorReadonly(false);

                Object.keys(this.state.newDocumentData).forEach((documentType) => {
                    this.state.newDocumentData[documentType].metadata.theme = theme;
                });

            }
            catch (error) {
                oc.snackbar.hide(changingMessageId);
                $.oc.editor.page.showAjaxErrorAlert(error, this.trans('editor::lang.common.error'));
                this.editorApplication.setNavigatorReadonly(false);
                return false;
            }
        }
    }

    return CmsEditorExtension;
});
