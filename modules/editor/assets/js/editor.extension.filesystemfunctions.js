oc.Modules.register('editor.extension.filesystemfunctions', function () {
    'use strict';

    async function onCreateDirectoryConfirmed(handlerName, name, parent, payload, metadataExtraData, documentController) {
        metadataExtraData = metadataExtraData || {};

        try {
            await $.oc.editor.application.ajaxRequest('onCommand', {
                extension: documentController.editorNamespace,
                command: handlerName,
                documentData: { name, parent },
                documentMetadata: metadataExtraData
            });

            documentController.editorStore.refreshExtensionNavigatorNodes(documentController.editorNamespace,
                documentController.documentType).then(() => {
                    payload.treeNode.expand();
            });
        }
        catch (error) {
            $.oc.editor.page.showAjaxErrorAlert(error, documentController.trans('editor::lang.common.error'));
            return false;
        }
    }

    async function onRenameConfirmed(handlerName, name, originalPath, payload, metadataExtraData, documentController) {
        metadataExtraData = metadataExtraData || {};

        try {
            await $.oc.editor.application.ajaxRequest('onCommand', {
                extension: documentController.editorNamespace,
                command: handlerName,
                documentData: { name, originalPath },
                documentMetadata: metadataExtraData
            });

            documentController.editorStore.refreshExtensionNavigatorNodes(documentController.editorNamespace, documentController.documentType);
        }
        catch (error) {
            $.oc.editor.page.showAjaxErrorAlert(error, documentController.trans('editor::lang.common.error'));
            return false;
        }
    }

    async function onFilesSelected(handlerName, input, path, documentController, requestExtraData) {
        const uploaderUtils = oc.Modules.import('backend.vuecomponents.uploader.utils');
        requestExtraData = requestExtraData || {};

        try {
            let extraData = {
                extension: documentController.editorNamespace,
                command: handlerName,
                destination: path
            };

            $.extend(extraData, requestExtraData);

            await uploaderUtils.uploadFile('onCommand', input.get(0).files, 'file', extraData);
        } catch (error) {}

        documentController.editorStore.refreshExtensionNavigatorNodes(documentController.editorNamespace, documentController.documentType);
        input.remove();
    }

    class FileSystemFunctions {
        constructor(documentController) {
            this.documentController = documentController;
        }

        createDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData) {
            const inspectorConfiguration = this.documentController.editorStore.getGlobalInspectorConfiguration('dir-create');
            const data = {
                name: ''
            };
            const parent = cmd.hasParameter ? cmd.parameter : '';

            oc.vueComponentHelpers.inspector.host
                .showModal(inspectorConfiguration.title, data, inspectorConfiguration.config, 'directory-name', {
                    beforeApplyCallback: (updatedData) =>
                        onCreateDirectoryConfirmed(handlerName, updatedData.name, parent, payload, metadataExtraData, this.documentController)
                })
                .then($.noop, $.noop);
        }

        renameFileOrDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData) {
            const inspectorConfiguration = this.documentController.editorStore.getGlobalInspectorConfiguration('file-dir-rename');
            const data = {
                name: cmd.userData.fileName
            };
            const originalPath = cmd.hasParameter ? cmd.parameter : '';

            oc.vueComponentHelpers.inspector.host
                .showModal(inspectorConfiguration.title, data, inspectorConfiguration.config, 'file-dir-rename', {
                    beforeApplyCallback: (updatedData) =>
                        onRenameConfirmed(handlerName, updatedData.name, originalPath, payload, metadataExtraData, this.documentController)
                })
                .then($.noop, $.noop);
        }

        async deleteFileOrDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData) {
            metadataExtraData = metadataExtraData || {};

            const itemsDetails = cmd.userData.itemsDetails;
            const files = [];
            const deletedUris = [];

            if (!itemsDetails.clickedIsSelected) {
                files.push(itemsDetails.clickedNode.userData.path);
                deletedUris.push(itemsDetails.clickedNode.uniqueKey);
            }
            else {
                itemsDetails.selectedNodes.forEach((selectedNode) => {
                    files.push(selectedNode.nodeData.userData.path);
                    deletedUris.push(selectedNode.nodeData.uniqueKey);
                });
            }

            const message =
                files.length > 1
                    ? $.oc.editor.getLangStr('editor::lang.filesystem.delete_confirm')
                    : $.oc.editor.getLangStr('editor::lang.filesystem.delete_confirm_single');

            try {
                await oc.vueComponentHelpers.modalUtils.showConfirm(
                    $.oc.editor.getLangStr('backend::lang.form.delete'),
                    message,
                    {
                        isDanger: true,
                        buttonText: $.oc.editor.getLangStr('backend::lang.form.confirm')
                    }
                );
            }
            catch (error) {
                return;
            }

            try {
                await $.oc.editor.application.ajaxRequest('onCommand', {
                    extension: this.documentController.editorNamespace,
                    command: handlerName,
                    documentData: {
                        files: files
                    },
                    documentMetadata: metadataExtraData
                });

                deletedUris.forEach((deletedUri) => {
                    this.documentController.editorStore.deleteNavigatorNode(deletedUri);
                    this.documentController.editorStore.tabManager.closeTabByKey(deletedUri);
                });
            }
            catch (error) {
                $.oc.editor.page.showAjaxErrorAlert(error, this.documentController.trans('editor::lang.common.error'));
                this.documentController.editorStore.refreshExtensionNavigatorNodes(this.documentController.editorNamespace);
            }
        }

        async handleNavigatorNodeMove(handlerName, cmd, metadataExtraData) {
            metadataExtraData = metadataExtraData || {};
            cmd.userData.event.preventDefault();

            $.oc.editor.application.setNavigatorReadonly(true);
            const movingMessageId = oc.snackbar.show(this.documentController.trans('editor::lang.filesystem.moving'), {
                timeout: 5000
            });

            const movedNodePaths = [];

            cmd.userData.movedNodes.map((movedNode) => {
                movedNodePaths.push(movedNode.nodeData.userData.path);
            });

            try {
                await $.oc.editor.application.ajaxRequest('onCommand', {
                    extension: this.documentController.editorNamespace,
                    command: handlerName,
                    documentData: {
                        source: movedNodePaths,
                        destination: cmd.userData.movedToNodeData.userData.path
                    },
                    documentMetadata: metadataExtraData
                });

                await this.documentController.editorStore.refreshExtensionNavigatorNodes(this.documentController.editorNamespace, this.documentController.documentType);
                oc.snackbar.show(this.documentController.trans('editor::lang.filesystem.moved'), { replace: movingMessageId });
                $.oc.editor.application.setNavigatorReadonly(false);
            }
            catch (error) {
                await this.documentController.editorStore.refreshExtensionNavigatorNodes(this.documentController.editorNamespace, this.documentController.documentType);
                $.oc.editor.application.setNavigatorReadonly(false);
                oc.snackbar.hide(movingMessageId);
                $.oc.editor.page.showAjaxErrorAlert(error, this.documentController.trans('editor::lang.common.error'));
            }
        }

        uploadDocument(allowedExtensions, handlerName, cmd, requestExtraData) {
            const input = $('<input type="file" style="display:none" name="file" multiple/>');
            input.attr('accept', allowedExtensions);

            $(document.body).append(input);

            input.one('change', () => {
                onFilesSelected(handlerName, input, cmd.userData.path ? cmd.userData.path : '/', this.documentController, requestExtraData);
            });

            input.click();
        }

        handleNavigatorExternalDrop(handlerName, cmd, requestExtraData) {
            const uploaderUtils = oc.Modules.import('backend.vuecomponents.uploader.utils');
            const dataTransfer = cmd.userData.ev.dataTransfer;
            requestExtraData = requestExtraData || {};

            if (!dataTransfer || !dataTransfer.files || !dataTransfer.files.length) {
                return;
            }

            const targetNodeData = cmd.userData.nodeData;
            const extraData = {
                extension: this.documentController.editorNamespace,
                command: handlerName,
                destination: targetNodeData.userData.path
            };

            $.extend(extraData, requestExtraData);

            uploaderUtils.uploadFile('onCommand', dataTransfer.files, 'file', extraData).then(
                () => {
                    this.documentController.editorStore.refreshExtensionNavigatorNodes(this.documentController.editorNamespace,
                        this.documentController.documentType);
                },
                () => {
                    this.documentController.editorStore.refreshExtensionNavigatorNodes(this.documentController.editorNamespace,
                        this.documentController.documentType);
                }
            );
        }
    };

    return FileSystemFunctions;
});