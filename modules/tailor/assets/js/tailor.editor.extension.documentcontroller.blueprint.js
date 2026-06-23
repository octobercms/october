import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { EditorCommand } from '../../../editor/assets/js/editor.command.js';
import { DocumentUri } from '../../../editor/assets/js/editor.documenturi.js';
import { FileSystemFunctions } from '../../../editor/assets/js/editor.extension.filesystemfunctions.js';

export class DocumentControllerBlueprint extends DocumentControllerBase {
    get documentType() {
        return 'tailor-blueprint';
    }

    get vueEditorComponentName() {
        return 'tailor-editor-component-blueprint-editor';
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
        // Controller events
        this.on(`tailor:${this.documentType}-create-directory`, this.onCreateDirectory);
        this.on(`tailor:${this.documentType}-delete`, this.onDeleteBlueprintOrDirectory);
        this.on(`tailor:${this.documentType}-rename`, this.onRenameBlueprintOrDirectory);
        this.on(`tailor:${this.documentType}-upload`, this.onUploadDocument);

        // Navigator events
        this.on('tailor:navigator-context-menu-display', this.getNavigatorContextMenuItems);
        this.on('tailor:navigator-external-drop', this.onNavigatorExternalDrop);
        this.on('tailor:navigator-node-moved', this.onNavigatorNodeMoved);
    }

    getNavigatorContextMenuItems(commandObj, payload) {
        const uri = DocumentUri.parse(payload.nodeData.uniqueKey);
        const parentPath = payload.nodeData.userData.path;

        // TODO: handle tailor:root item for the Tailor section menus.

        if (uri.documentType !== this.documentType) {
            return;
        }

        const blueprintTypes = ['entry', 'single', 'stream', 'structure', 'mixin', 'global'];
        const blueprintItems = [];

        blueprintTypes.forEach(type => {
            blueprintItems.push({
                label: this.trans('tailor::lang.blueprint.' + type),
                type: 'text',
                command: new EditorCommand('tailor:create-document@' + this.documentType, {
                    path: parentPath,
                    type
                })
            });
        });

        if (payload.nodeData.userData.isFolder || payload.nodeData.userData.topLevel) {
            payload.menuItems.push({
                type: 'text',
                icon: 'icon-create',
                items: blueprintItems,
                label: this.trans('tailor::lang.blueprint.new')
            });

            payload.menuItems.push({
                type: 'text',
                icon: 'icon-upload',
                command: new EditorCommand(`tailor:${this.documentType}-upload@${this.documentType}`, {
                    path: parentPath
                }),
                label: this.trans('tailor::lang.blueprint.upload_files')
            });

            payload.menuItems.push({
                type: 'text',
                icon: 'icon-folder',
                command: `tailor:${this.documentType}-create-directory@${parentPath}`,
                label: this.trans('tailor::lang.blueprint.create_directory')
            });

            if (payload.nodeData.userData.topLevel) {
                return;
            }

            payload.menuItems.push({
                type: 'separator'
            });
        }

        payload.menuItems.push({
            type: 'text',
            icon: 'icon-terminal',
            command: new EditorCommand(`tailor:${this.documentType}-rename@${parentPath}`, {
                fileName: payload.nodeData.userData.fileName
            }),
            label: this.trans('tailor::lang.blueprint.rename')
        });

        payload.menuItems.push({
            type: 'text',
            icon: 'icon-delete',
            command: new EditorCommand(`tailor:${this.documentType}-delete@${parentPath}`, {
                itemsDetails: payload.itemsDetails
            }),
            label: this.trans('tailor::lang.blueprint.delete')
        });
    }

    preprocessNewDocumentData(newDocumentData, commandObj) {
        if (!commandObj.userData.type) {
            return;
        }

        const blueprintTemplates = this.parentExtension.state.customData.blueprintTemplates;
        const blueprintType = commandObj.userData.type;
        if (!blueprintTemplates[blueprintType]) {
            return;
        }

        newDocumentData.document.content = blueprintTemplates[blueprintType];
    }

    onBeforeDocumentCreated(commandObj, payload, documentData) {
        let parentPath = '';
        if (commandObj.userData && commandObj.userData.path) {
            parentPath = commandObj.userData.path;
        }

        if (parentPath.length > 0 && parentPath !== '/') {
            documentData.document.fileName = parentPath + '/' + documentData.document.fileName;
        }
    }

    onCreateDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        fs.createDirectoryFromNavigatorMenu('onBlueprintCreateDirectory', cmd, payload, {
            documentType: this.documentType,
        });
    }

    async onDeleteBlueprintOrDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        await fs.deleteFileOrDirectoryFromNavigatorMenu('onBlueprintDelete', cmd, payload, {
            documentType: this.documentType,
        });
    }

    onRenameBlueprintOrDirectory(cmd, payload) {
        const fs = new FileSystemFunctions(this);
        fs.renameFileOrDirectoryFromNavigatorMenu('onBlueprintRename', cmd, payload, {
            documentType: this.documentType,
        });
    }

    onUploadDocument(cmd) {
        const fs = new FileSystemFunctions(this);
        fs.uploadDocument(['.yaml'], 'onBlueprintUpload', cmd, {
            documentType: this.documentType
        });
    }

    onNavigatorExternalDrop(cmd) {
        const uri = DocumentUri.parse(cmd.userData.toUniqueKey);

        if (uri.documentType !== this.documentType) {
            return;
        }

        const fs = new FileSystemFunctions(this);
        fs.handleNavigatorExternalDrop('onBlueprintUpload', cmd, {
            documentType: uri.documentType
        });
    }

    async onNavigatorNodeMoved(cmd) {
        const uri = DocumentUri.parse(cmd.userData.movedToNodeData.uniqueKey);

        if (uri.documentType !== this.documentType) {
            return;
        }

        const fs = new FileSystemFunctions(this);
        await fs.handleNavigatorNodeMove('onBlueprintMove', cmd, {
            documentType: uri.documentType
        });
    }
}
