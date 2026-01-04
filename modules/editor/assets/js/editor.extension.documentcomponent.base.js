oc.Modules.register('editor.extension.documentcomponent.base', function() {
    'use strict';

    const EditorTimeoutPromise = oc.Modules.import('editor.timeoutpromise');
    const DocumentUri = oc.Modules.import('editor.documenturi');

    function patchDocumentMetadata(documentMetadata, responseMetadata) {
        if (!responseMetadata) {
            return;
        }

        Object.keys(responseMetadata).forEach((property) => {
            documentMetadata[property] = responseMetadata[property];
        });

        Vue.delete(documentMetadata, 'isNewDocument');
    }

    const DocumentComponentBase = {
        mixins: [oc.vueHotkeyMixin],
        props: {
            componentData: Object
        },
        data: function () {
            const result = {
                initializing: true,
                processing: false,
                errorLoadingDocument: null,
                documentHeaderCollapsed: false,
                documentFullScreen: false,
                documentData: {},
                lastSavedDocumentData: {},
                documentMetadata: {},
                ajaxQueue: new Queue(1, 10000),
                loadingPromises: [],
                autoUpdateNavigatorNodeLabel: true,

                documentSavedMessage: $.oc.editor.getLangStr('editor::lang.common.document_saved'),
                documentReloadedMessage: $.oc.editor.getLangStr('editor::lang.common.document_reloaded'),
                documentDeletedMessage: $.oc.editor.getLangStr('editor::lang.common.document_deleted'),
                documentSettingsPopupTitle: $.oc.editor.getLangStr('editor::lang.common.document'),
                documentTitleProperty: 'title',

                componentHotkeys: {
                    'shift+option+w': this.onCloseTabHotkey
                }
            };

            if (this.componentData.metadata) {
                result.documentMetadata = $.oc.vueUtils.getCleanObject(this.componentData.metadata);
            }

            if (this.componentData.document) {
                result.documentData = $.oc.vueUtils.getCleanObject(this.componentData.document);
            }

            return result;
        },

        computed: {
            isDocumentChanged: function computeIsDocumentChanged() {
                if (this.initializing) {
                    return false;
                }

                if (this.isNewDocument) {
                    return true;
                }

                const current = JSON.stringify(this.cleanDocumentData);
                const saved = JSON.stringify(this.lastSavedDocumentData);

                return current != saved;
            },

            cleanDocumentData: function computeCleanDocumentData() {
                return $.oc.vueUtils.getCleanObject(this.documentData);
            },

            documentNavigatorNode: function computeDocumentNavigatorNode() {
                return this.store.findNavigatorNode(this.documentUri);
            },

            namespace: function computeNamespace() {
                return this.componentData.namespace;
            },

            extension: function computeExtension() {
                return this.store.getExtension(this.namespace);
            },

            documentType: function computeDocumentType() {
                return this.componentData.documentType;
            },

            isNewDocument: function computeIsNewDocument() {
                if (this.documentMetadata.isNewDocument) {
                    return true;
                }

                return false;
            },

            documentUriObj: function computeDocumentUriObj() {
                return new DocumentUri(this.namespace, this.documentType, this.componentData.key);
            },

            documentUri: function computeDocumentUri() {
                return this.documentUriObj.uri;
            },

            store: function computeStore() {
                return $.oc.editor.store;
            },

            application: function computeApplication() {
                return $.oc.editor.application;
            },

            hasSettingsForm: function computeHasSettingsForm() {
                return this.extension.hasSettingFormFields(this.documentType);
            },

            editorUserData: function computeUserData() {
                return this.store.state.userData;
            },

            isDirectDocumentMode: function computeIsDirectDocumentMode() {
                return $.oc.editor.application.isDirectDocumentMode;
            },

            directDocumentIcon: function computeDirectDocumentIcon() {
                return this.isDirectDocumentMode ? this.componentData.tabIcon : null
            }
        },

        methods: {
            ajaxRequest: function ajaxRequest(handler, requestData) {
                const promise = this.ajaxQueue.add(function() {
                    return $.oc.editor.application.ajaxRequest(handler, requestData);
                });

                this.loadingPromises.push(promise);

                return promise;
            },

            trans: function trans(key) {
                return $.oc.editor.getLangStr(key);
            },

            updateTabLabel: function updateTabLabel(label) {
                this.store.tabManager.updateTabLabel(label, this.documentUri);
            },

            setTabHasChanges: function setTabHasChanges(hasChanges) {
                this.store.tabManager.setTabHasChanges(hasChanges, this.documentUri);
            },

            documentLoaded: function documentLoaded(data) {},

            documentCreated: function documentCreated() {},

            documentCreatedOrLoaded: function documentCreatedOrLoaded() {},

            documentSaved: function documentSaved(data, prevData) {},

            requestDocumentFromServer: async function requestDocumentFromServer(
                extraData,
                suppressGlobalDocumentError
            ) {
                try {
                    const data = await this.loadDocument(
                        this.namespace,
                        {
                            type: this.documentType,
                            key: this.componentData.key
                        },
                        extraData,
                        suppressGlobalDocumentError
                    );

                    this.lastSavedDocumentData = $.oc.vueUtils.getCleanObject(data.document);
                    this.documentData = data.document;
                    this.documentMetadata = data.metadata;

                    return data;
                }
                catch (error) {
                    if (!suppressGlobalDocumentError) {
                        this.$emit('tabfatalerror');
                    }
                    console.error(error);
                    return error;
                }
            },

            loadDocument: async function loadDocument(extension, documentData, extraData, suppressGlobalDocumentError) {
                const timeoutPromise = new EditorTimeoutPromise();

                try {
                    const data = await this.ajaxRequest('onCommand', {
                        extension: extension,
                        command: 'onOpenDocument',
                        documentData: documentData,
                        extraData: typeof extraData === 'object' ? extraData : {}
                    });

                    await timeoutPromise.make(data);

                    this.initializing = false;
                    this.processing = false;

                    return data;
                }
                catch (error) {
                    if (!suppressGlobalDocumentError) {
                        if (error.status === 0) {
                            this.errorLoadingDocument = 'Error connecting to the server.';
                        }
                        else {
                            this.errorLoadingDocument = error.responseText;
                        }
                    }
                    this.initializing = false;
                    this.processing = false;

                    return error;
                }
            },

            getSaveDocumentData: function getSaveDocumentData(inspectorDocumentData) {
                throw new Error('getSaveDocumentData must be implemented in DocumentComponentBase descendants.');
            },

            getMainUiDocumentProperties: function getMainUiDocumentProperties() {
                throw new Error(
                    'getMainUiDocumentProperties must be implemented in DocumentComponentBase descendants. This method must return a list of properties that can be edited without opening the Settings popup.'
                );
            },

            getConflictResolver: function getConflictResolver() {
                if (!this.$refs.conflictResolver) {
                    throw new Error('conflictResolver reference must exist.');
                }

                return this.$refs.conflictResolver;
            },

            getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
                return this.documentSavedMessage;
            },

            saveDocument: async function saveDocument(force, inspectorDocumentData, extraData, noSavedMessage) {
                $(document).trigger('vue.beforeRequest');

                const documentData = this.getSaveDocumentData(inspectorDocumentData);
                const timeoutPromise = new EditorTimeoutPromise();
                const lastSavedData = inspectorDocumentData ? inspectorDocumentData : this.documentData;
                const isNewDocument = this.documentMetadata.isNewDocument;

                this.processing = true;

                try {
                    let data = await this.ajaxRequest('onCommand', {
                        extension: this.namespace,
                        command: 'onSaveDocument',
                        documentData: documentData,
                        documentMetadata: this.documentMetadata,
                        documentForceSave: force ? 1 : 0,
                        extraData: typeof extraData === 'object' ? extraData : null
                    });

                    await timeoutPromise.make(data);

                    this.processing = false;
                    if (data.mtimeMismatch) {
                        return this.handleDocumentTimeMismatch(inspectorDocumentData, extraData, noSavedMessage);
                    }
                    else {
                        patchDocumentMetadata(this.documentMetadata, data.metadata);

                        const prevDocumentData = this.lastSavedDocumentData;
                        this.lastSavedDocumentData = $.oc.vueUtils.getCleanObject(lastSavedData);

                        if (isNewDocument) {
                            this.store.refreshExtensionNavigatorNodes(this.namespace, this.documentType).then(() => {
                                $.oc.editor.application.revealNavigatorNode(this.documentUri);
                            });
                        }

                        if (!noSavedMessage) {
                            oc.snackbar.show(this.getDocumentSavedMessage(data));
                        }

                        this.documentSaved(data, prevDocumentData);

                        $.oc.editor.application.postDirectDocumentSavedMessage();

                        return data;
                    }
                } catch (error) {
                    this.handleDocumentSaveError(error, inspectorDocumentData);
                    throw error;
                }
            },

            handleDocumentTimeMismatch: async function handleDocumentTimeMismatch(inspectorDocumentData, extraData, noSavedMessage) {
                let resolution = null;

                try {
                    resolution = await this.getConflictResolver().requestResolution();
                } catch (error) {
                    return error;
                }

                if (resolution == 'save') {
                    return this.saveDocument(true, inspectorDocumentData, extraData, noSavedMessage);
                }

                // Reloading the document
                //
                this.processing = true;
                const data = await this.requestDocumentFromServer();
                oc.snackbar.show(this.documentReloadedMessage);

                // The order of these hooks are important
                //
                this.documentCreatedOrLoaded();
                this.documentLoaded(data);
                return data;
            },

            shouldDisplayDocumentSaveErrorPopup: function shouldDisplayDocumentSaveErrorPopup(error) {
                return true;
            },

            handleDocumentSaveError: function handleDocumentSaveError(error, inspectorDocumentData) {
                this.processing = false;
                let errorText = error.responseText;
                if (error.responseJSON && error.responseJSON.validationErrors) {
                    const validationErrors = error.responseJSON.validationErrors;
                    const keys = Object.keys(validationErrors);
                    const firstFieldName = keys[0];
                    const message = validationErrors[firstFieldName][0];

                    if (message) {
                        errorText = message;
                    }

                    if (
                        !inspectorDocumentData &&
                        firstFieldName &&
                        this.getMainUiDocumentProperties().indexOf(firstFieldName) === -1
                    ) {
                        this.openSettingsForm();
                    }
                }

                if (!errorText && error.status === 0) {
                    errorText = 'Error connecting to the server.';
                }

                if (this.shouldDisplayDocumentSaveErrorPopup(error)) {
                    oc.vueComponentHelpers.modalUtils.showAlert(
                        $.oc.editor.getLangStr('editor::lang.common.error_saving'),
                        errorText
                    );
                }
            },

            closeDocumentTab: function closeDocumentTab(force) {
                if (force) {
                    this.setTabHasChanges(false);
                }

                this.store.tabManager.closeTabByKey(this.documentUri);
            },

            deleteDocument: async function deleteDocument(extension) {
                try {
                    await oc.vueComponentHelpers.modalUtils.showConfirm(
                        $.oc.editor.getLangStr('backend::lang.form.delete'),
                        $.oc.editor.getLangStr('editor::lang.common.confirm_delete'),
                        {
                            isDanger: true,
                            buttonText: $.oc.editor.getLangStr('backend::lang.form.confirm')
                        }
                    );
                } catch (error) {
                    return error;
                }

                this.processing = true;

                try {
                    const data = await this.ajaxRequest('onCommand', {
                        extension: this.namespace,
                        command: 'onDeleteDocument',
                        documentMetadata: this.documentMetadata
                    });

                    this.processing = false;
                    this.closeDocumentTab(true);
                    this.store.deleteNavigatorNode(this.documentUri);
                    oc.snackbar.show(this.documentDeletedMessage);

                    return data;
                } catch (error) {
                    this.processing = false;

                    $.oc.editor.page.showAjaxErrorAlert(
                        error,
                        $.oc.editor.getLangStr('editor::lang.common.error_deleting')
                    );

                    return error;
                }
            },

            openSettingsForm: function openSettingsForm() {
                const settingsFields = this.extension.getSettingsFormFields(this.documentType);

                oc.vueComponentHelpers.inspector.host
                    .showModal(
                        this.documentSettingsPopupTitle,
                        this.documentData,
                        settingsFields,
                        'editor-document-settings',
                        {
                            buttonText: this.trans('editor::lang.common.apply_and_save'),
                            resizableWidth: true,
                            beforeApplyCallback: this.onBeforeSettingsInspectorApply
                        }
                    )
                    .then($.noop, $.noop);
            },

            updateNavigatorNodeUserData: function updateNavigatorNodeUserData(title) {},

            updateEditorUiForDocument: function updateEditorUiForDocument() {
                const title =
                    this.documentData[this.documentTitleProperty].length > 0
                        ? this.documentData[this.documentTitleProperty]
                        : 'No name';
                this.updateTabLabel(title);

                if (this.documentNavigatorNode && this.documentMetadata.uniqueKey) {
                    if (this.autoUpdateNavigatorNodeLabel) {
                        this.store.triggerDocumentNodesUpdatedEvent(this.documentUriObj);
                        this.documentNavigatorNode.label = title;
                    }

                    this.updateNavigatorNodeUserData(title);
                }

                // This propagates the new unique key to the
                // Navigator and Tabs.
                //
                if (this.documentMetadata.uniqueKey) {
                    this.componentData.key = this.documentMetadata.uniqueKey;
                }
            },

            isDocumentTabVisible: function() {
                return $(this.$el).is(':visible');
            },

            canHandleHotkey: function () {
                return this.isDocumentTabVisible() && !$.oc.modalFocusManager.hasHotkeyBlockingAbove(null);
            },

            onBeforeSettingsInspectorApply: function onBeforeSettingsInspectorApply(inspectorDocumentData) {
                return this.saveDocument(false, inspectorDocumentData);
            },

            onParentTabClose: function onParentTabClose() {
                if (!this.isDocumentChanged || this.errorLoadingDocument) {
                    return Promise.resolve();
                }

                return oc.vueComponentHelpers.modalUtils.showConfirm(
                    $.oc.editor.getLangStr('backend::lang.tabs.close'),
                    $.oc.editor.getLangStr('backend::lang.form.confirm_tab_close'),
                    {
                        isDanger: true,
                        buttonText: $.oc.editor.getLangStr('editor::lang.common.discard_changes')
                    }
                );
            },

            onApplicationCommand: function onApplicationCommand(command, payload) {},

            handleBasicDocumentCommands: function handleBasicDocumentCommands(command, isHotkey) {
                if (isHotkey && (!this.isDocumentTabVisible() || $.oc.modalFocusManager.hasHotkeyBlockingAbove(null))) {
                    return;
                }

                if (command == 'save') {
                    this.saveDocument().then($.noop, $.noop);
                }

                if (command == 'delete') {
                    this.deleteDocument(this.namespace);
                }

                if (command == 'settings') {
                    this.openSettingsForm();
                }

                if (command == 'document:toggleToolbar') {
                    this.documentHeaderCollapsed = !this.documentHeaderCollapsed;
                }

                if (command == 'document:toggleFullscreen') {
                    this.documentFullScreen = !this.documentFullScreen;
                }
            },

            onCloseTabHotkey: function(ev) {
                ev.preventDefault();

                if (!this.isDocumentTabVisible() || $.oc.modalFocusManager.hasHotkeyBlockingAbove(null)) {
                    return;
                }

                this.$emit('tabclose');
            },

            onDocumentCloseClick: function () {
                $.oc.editor.application.onCloseDirectDocumentClick();
            }
        },

        beforeDestroy: function onBeforeDestroy() {
            this.loadingPromises.forEach(function(promise) {
                if (promise.isPending()) {
                    promise.cancel();
                }
            });
        },

        watch: {
            isDocumentChanged: {
                handler: function watchIsDocumentChanged(value) {
                    this.setTabHasChanges(value);
                },
                immediate: true
            },

            lastSavedDocumentData: function watchSavedDocumentData(value) {
                this.updateEditorUiForDocument(value);
            },

            'componentData.key': function watchComponentDataKey(value, oldValue) {
                const oldUri = new DocumentUri(this.namespace, this.documentType, oldValue).uri;
                const navigatorNode = this.store.findNavigatorNode(oldUri);

                if (navigatorNode) {
                    navigatorNode.uniqueKey = this.documentUri;
                    $.oc.editor.application.navigatorNodeKeyChanged(oldUri, this.documentUri);
                }

                this.store.tabManager.setTabKey(oldUri, this.documentUri);
                this.$emit('tabkeychanged', oldUri, this.documentUri);
            },

            initializing: function onInitializingChanged(value) {
                if (!value) {
                    Vue.nextTick(() => {
                        if (this.$refs.documentHeader) {
                            this.$refs.documentHeader.focusTitle();
                        }
                    });
                }
            }
        },

        mounted: function onMounted() {
            if (!this.documentMetadata || !this.documentMetadata.isNewDocument) {
                this.requestDocumentFromServer().then((data) => {
                    // The order of these hooks are important
                    //
                    this.documentCreatedOrLoaded();
                    this.documentLoaded(data);
                }, $.noop);
            }
            else {
                this.initializing = false;
                // The order of these hooks are important
                //
                this.documentCreatedOrLoaded();
                this.documentCreated();
            }
        }
    };

    return DocumentComponentBase;
});
