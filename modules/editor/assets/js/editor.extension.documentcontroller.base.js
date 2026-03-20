import { EditorCommand } from './editor.command.js';
import { DocumentUri } from './editor.documenturi.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerBase {
    parentExtension;
    commandListeners;

    constructor(parentExtension) {
        this.parentExtension = parentExtension;
        this.commandListeners = [];

        this.initDefaultListeners();
        this.initListeners();
    }

    /**
     * Returns a document type name this controller can handle.
     */
    get documentType() {
        throw new Error('documentType property must return string');
    }

    /**
     * Returns name of  Vue component that edits documents of this type.
     */
    get vueEditorComponentName() {
        throw new Error('vueEditorComponent property must return string');
    }

    get editorNamespace() {
        return this.parentExtension.editorNamespace;
    }

    get editorStore() {
        return $.oc.editor.store;
    }

    /**
     * Adds handlers for one or more Editor commands.
     * Handlers are automatically bound to the document controller object.
     * If the command argument does not specify the command parameter (@xxx)
     * explicitly, the handler will be triggered for commands with any argument,
     * value. E.g. cms:create-document@cms-page would trigger handlers
     * registered for both cms:create-document and cms:create-document@cms-page.
     * @param {String} commands A list of commands separated with a comma.
     * @param {function} callback A command handler function. Handlers receive the
     * Editor command object and optional payload.
     */
    on(commands, callback) {
        const commandNames = commands.split(',').map((command) => command.trim());

        commandNames.forEach((commandName) => {
            this.commandListeners.push({
                command: new EditorCommand(commandName),
                callback
            });
        });
    }

    /**
     * Emits an Editor command and triggers all handlers previously registered
     * for the command. Used by Editor internally.
     * @param {String} commandString Command string. See editor.command.js.
     * @param {any} payload Command payload.
     */
    emit(commandString, payload) {
        var commandObj = new EditorCommand(commandString);

        this.commandListeners.forEach((listenerInfo) => {
            if (commandObj.matches(listenerInfo.command)) {
                listenerInfo.callback.apply(this, [commandObj, payload]);
            }
        });
    }

    get rootNavigatorNodeKey() {
        return `${this.editorNamespace}:${this.documentType}`;
    }

    get rootNavigatorNodeSafe() {
        const result = treeviewUtils.findNodeObjectByKeyPathInSections(
            this.parentExtension.state.navigatorSections,
            [this.rootNavigatorNodeKey]
        );

        if (!result) {
            return null;
        }

        return result;
    }

    get rootNavigatorNode() {
        const node = this.rootNavigatorNodeSafe;
        if (node === null) {
            throw new Error(`Navigator node with the key ${this.documentType} is not found`);
        }

        return node;
    }

    /**
     * Updates JSON definition of the document settings form.
     * @param {Array} settingsFields
     * @returns Array Returns updated JSON string
     */
    preprocessSettingsFields(settingsFields) {
        return settingsFields;
    }

    /**
     * This method can update a new document object before it is passed to the document editor component.
     * @param {Object} newDocumentData
     * @param {EditorCommand} commandObj
     */
    preprocessNewDocumentData(newDocumentData, commandObj) {}

    initListeners() {}

    initDefaultListeners() {
        this.on(this.editorNamespace + ':navigator-selected', this.onNavigatorNodeSelected);
        this.on(this.editorNamespace + ':create-document', this.onCreateDocument);
    }

    extractDocumentUniqueKeyFromNodeKey(navigatorNodeKey) {
        // Node keys have format namespace:document-type:unique-key.
        // When we are creating or opening documents, we are only
        // interested in the document unique key.

        const parts = navigatorNodeKey.split(':');
        if (parts.length != 3) {
            throw new Error('Navigator node unique keys must have format namespace:document-type:unique-key');
        }

        return parts[2];
    }

    beforeDocumentOpen(commandObj, nodeData) {
        return true;
    }

    trans(key) {
        return $.oc.editor.getLangStr(key);
    }

    /**
     * This method is called before a new document tab is opened.
     * The method can update the document data object.
     */
    onBeforeDocumentCreated(commandObj, payload, documentData) {}

    onNavigatorNodeSelected(commandObj, nodeData) {
        const uri = DocumentUri.parse(nodeData.uniqueKey);

        if (uri.namespaceAndDocType != this.rootNavigatorNodeKey) {
            return;
        }

        if (this.beforeDocumentOpen(commandObj, nodeData) === false) {
            return;
        }

        $.oc.editor.application.openTab({
            key: nodeData.uniqueKey,
            label: nodeData.label,
            icon: nodeData.icon,
            component: this.vueEditorComponentName,
            componentData: {
                key: this.extractDocumentUniqueKeyFromNodeKey(nodeData.uniqueKey),
                namespace: this.editorNamespace,
                documentType: this.documentType
            }
        });
    }

    onCreateDocument(commandObj, payload) {
        if (!commandObj.hasParameter) {
            throw new Error(
                `Invalid create-document command: ${commandObj.fullCommand}. The command parameter is missing.`
            );
        }

        if (commandObj.parameter != this.documentType) {
            return;
        }

        const documentKey = $.oc.domIdManager.generate(this.documentType);
        const documentData = $.oc.vueUtils.getCleanObject(
            this.parentExtension.getNewDocumentData(this.documentType, commandObj)
        );

        this.onBeforeDocumentCreated(commandObj, payload, documentData);

        $.oc.editor.application.openTab({
            key: `${this.editorNamespace}:${this.documentType}:${documentKey}`,
            label: documentData.label,
            icon: documentData.icon,
            component: this.vueEditorComponentName,
            componentData: {
                key: documentKey,
                metadata: documentData.metadata,
                document: documentData.document,
                namespace: this.editorNamespace,
                documentType: this.documentType
            }
        });
    }
}
