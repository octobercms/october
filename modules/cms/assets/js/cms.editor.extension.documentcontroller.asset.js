import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { EditorCommand } from '../../../editor/assets/js/editor.command.js';
import { DocumentUri } from '../../../editor/assets/js/editor.documenturi.js';
import { FileSystemFunctions } from '../../../editor/assets/js/editor.extension.filesystemfunctions.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerAsset extends DocumentControllerBase {
    get documentType() {
        return 'cms-asset';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-asset-editor';
    }

    beforeDocumentOpen(commandObj, nodeData) {
        if (!nodeData.userData) {
            return false;
        }

        if (nodeData.userData.isFolder) {
            return false;
        }

        if (nodeData.userData.isEditable) {
            return true;
        }

        return false;
    }

    initListeners() {
        this.on('cms:navigator-context-menu-display', this.getNavigatorContextMenuItems);
        this.on('cms:cms-asset-create-directory', this.onCreateDirectory);
        this.on('cms:cms-asset-delete', this.onDeleteAssetOrDirectory);
        this.on('cms:cms-asset-rename', this.onRenameAssetOrDirectory);
        this.on('cms:navigator-node-moved', this.onNavigatorNodeMoved);
        this.on('cms:navigator-external-drop', this.onNavigatorExternalDrop);
        this.on('cms:cms-asset-upload', this.onUploadDocument);
        this.on('cms:cms-asset-open', this.onOpenAsset);
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    getNavigatorContextMenuItems(commandObj, payload) {
        const uri = DocumentUri.parse(payload.nodeData.uniqueKey);
        const parentPath = payload.nodeData.userData.path;

        if (uri.documentType !== this.documentType) {
            return;
        }

        if (payload.nodeData.userData.isFolder) {
            payload.menuItems.push({
                type: 'text',
                icon: 'icon-create',
                command: new EditorCommand('cms:create-document@' + this.documentType, {
                    path: parentPath
                }),
                label: this.trans('cms::lang.asset.new')
            });

            payload.menuItems.push({
                type: 'text',
                icon: 'icon-upload',
                command: new EditorCommand('cms:cms-asset-upload@' + this.documentType, {
                    path: parentPath
                }),
                label: this.trans('cms::lang.asset.upload_files')
            });

            payload.menuItems.push({
                type: 'text',
                icon: 'icon-folder',
                command: 'cms:cms-asset-create-directory@' + parentPath,
                label: this.trans('cms::lang.asset.create_directory')
            });

            payload.menuItems.push({
                type: 'separator'
            });
        }
        else {
            if (!payload.nodeData.userData.isEditable) {
                payload.menuItems.push({
                    type: 'text',
                    icon: 'icon-fullscreen',
                    command: new EditorCommand('cms:cms-asset-open@' + parentPath, {
                        url: payload.nodeData.userData.url
                    }),
                    label: this.trans('cms::lang.asset.open')
                });
            }
        }

        payload.menuItems.push({
            type: 'text',
            icon: 'icon-terminal',
            command: new EditorCommand('cms:cms-asset-rename@' + parentPath, {
                fileName: payload.nodeData.userData.filename
            }),
            label: this.trans('cms::lang.asset.rename')
        });

        payload.menuItems.push({
            type: 'text',
            icon: 'icon-delete',
            command: new EditorCommand('cms:cms-asset-delete@' + parentPath, {
                itemsDetails: payload.itemsDetails
            }),
            label: this.trans('cms::lang.asset.delete')
        });
    }

    getAllAssetFilenames() {
        if (this.cachedAssetList) {
            return this.cachedAssetList;
        }

        const assetsNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-asset'
        );

        let assetList = [];

        if (assetsNavigatorNode) {
            assetList = treeviewUtils
                .getFlattenNodes(assetsNavigatorNode.nodes)
                .filter((assetNode) => {
                    return !assetNode.userData.isFolder;
                })
                .map((assetNode) => {
                    return assetNode.userData.path;
                });
        }
        else {
            assetList = this.parentExtension.state.customData.assets;
        }

        this.cachedAssetList = assetList;
        return assetList;
    }

    onBeforeDocumentCreated(commandObj, payload, documentData) {
        let parentPath = '';

        if (commandObj.userData && commandObj.userData.path) {
            parentPath = commandObj.userData.path;
        }

        if (parentPath.length > 0) {
            documentData.document.fileName = parentPath + '/' + documentData.document.fileName;
        }
    }

    onCreateDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        fs.createDirectoryFromNavigatorMenu('onAssetCreateDirectory', cmd, payload, {
            theme: theme
        });
    }

    async onDeleteAssetOrDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        await fs.deleteFileOrDirectoryFromNavigatorMenu('onAssetDelete', cmd, payload, {
            theme: theme
        });
    }

    onRenameAssetOrDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        fs.renameFileOrDirectoryFromNavigatorMenu('onAssetRename', cmd, payload, {
            theme: theme
        });
    }

    async onNavigatorNodeMoved(cmd) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        fs.handleNavigatorNodeMove('onAssetMove', cmd, {
            theme: theme
        });
    }

    onNavigatorExternalDrop(cmd) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        fs.handleNavigatorExternalDrop('onAssetUpload', cmd, {
            theme: theme
        });
    }

    onUploadDocument(cmd) {
        const fs = new FileSystemFunctions(this);
        const theme = this.parentExtension.cmsTheme;

        fs.uploadDocument(this.parentExtension.customData['assetExtensionList'], 'onAssetUpload', cmd, {
            theme: theme
        });
    }

    onOpenAsset(cmd, payload) {
        window.open(cmd.userData.url);
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedAssetList = null;
    }
}
