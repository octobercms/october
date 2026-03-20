import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class ExtensionBase {
    documentControllers = {};
    editorNamespace;
    state;

    constructor(namespace) {
        this.editorNamespace = namespace;

        this.state = {
            navigatorSections: [],
            createMenuItems: [],
            newDocumentData: {},
            settingsForms: {},
            customData: null
        };
    }

    get customData() {
        return this.state.customData;
    }

    get documentControllerArray() {
        return Object.keys(this.documentControllers).map((key) => this.documentControllers[key]);
    }

    get editorStore() {
        return $.oc.editor.store;
    }

    get editorApplication() {
        return $.oc.editor.application;
    }

    setInitialState(initialState) {
        this.state.navigatorSections = initialState.navigatorSections;
        this.state.customData = initialState.customData;
        this.state.createMenuItems = initialState.createMenuItems;
        this.state.newDocumentData = initialState.newDocumentData;
        this.state.settingsForms = initialState.settingsForms;
        this.state.inspectorConfigurations = initialState.inspectorConfigurations;

        // Document controllers require the initial state to be set first.
        //
        this.makeDocumentControllers();
    }

    trans(key) {
        return $.oc.editor.getLangStr(key);
    }

    getInspectorConfiguration(name) {
        if (!this.state.inspectorConfigurations[name]) {
            throw new Error(`Inspector configuration ${name} not found for the extension ${this.editorNamespace}`);
        }

        return this.state.inspectorConfigurations[name];
    }

    getDocumentController(documentType) {
        if (this.documentControllers[documentType]) {
            return this.documentControllers[documentType];
        }

        throw new Error(`Document controller not found for the document type ${documentType}`);
    }

    listDocumentControllerClasses() {}

    makeDocumentControllers() {
        const controllerClasses = this.listDocumentControllerClasses();

        controllerClasses.forEach((controllerClass) => {
            const documentController = new controllerClass(this);
            const documentType = documentController.documentType;

            if (this.documentControllers[documentType]) {
                throw new Error(
                    `A controller for document type ${documentType} is already registered for the extension ${this
                        .editorNamespace}`
                );
            }

            this.documentControllers[documentType] = documentController;
        });
    }

    getNewDocumentData(documentType, commandObj) {
        if (!this.state.newDocumentData[documentType]) {
            throw new Error(`New document data not found for the document type ${documentType}`);
        }

        const newDocumentData = this.state.newDocumentData[documentType];
        this.getDocumentController(documentType).preprocessNewDocumentData(newDocumentData, commandObj);

        return newDocumentData;
    }

    preprocessSettingsFields(settingsFields, documentType) {
        return this.getDocumentController(documentType).preprocessSettingsFields(settingsFields);
    }

    hasSettingFormFields(documentType) {
        return (
            Array.isArray(this.state.settingsForms[documentType]) &&
            this.state.settingsForms[documentType].length > 0
        );
    }

    getSettingsFormFields(documentType) {
        if (!this.state.settingsForms[documentType]) {
            throw new Error(`Settings form data not found for the document type ${documentType}`);
        }

        const result = this.preprocessSettingsFields(this.state.settingsForms[documentType], documentType);

        return result;
    }

    getNavigatorSections() {
        return this.state.navigatorSections;
    }

    getCreateMenuItems() {
        return this.state.createMenuItems;
    }

    openDocumentByUniqueKey(documentUriStr) {
        $.oc.editor.application.openDocument(documentUriStr);
        return false;
    }

    /**
     * Emits an Editor command for the extension and all document controllers registered by the extension.
     * @param {String} commandString Command string. See editor.command.js.
     * @param {any} payload Payload.
     */
    onCommand(commandString, payload) {
        this.documentControllerArray.forEach((documentController) =>
            documentController.emit(commandString, payload)
        );
    }

    updateNavigatorSections(sections, documentType) {
        sections.forEach((serverSection) => {
            const existingSection = this.state.navigatorSections.find((section) => {
                return section.uniqueKey === serverSection.uniqueKey;
            });

            serverSection.nodes.forEach((serverNode) => {
                const existingNode = treeviewUtils.findNodeObjectByKeyPathInSections(this.state.navigatorSections, [
                    serverNode.uniqueKey
                ]);

                // Update only inner nodes in existing root nodes. We can't
                // update the entire root node because it may contain
                // configuration initialized on the client, for example CMS
                // pages grouping, display property, sorting, etc.
                //
                if (existingNode) {
                    // Vue 3: Direct assignment is reactive
                    existingNode.nodes = serverNode.nodes;
                }
                else if (existingSection) {
                    existingSection.nodes.push(serverNode);
                }
            });

            if (!documentType) {
                // If we are updating entire section -
                // update the section label and menus as well.
                //
                if (existingSection) {
                    existingSection.createMenuItems = serverSection.createMenuItems;
                    existingSection.menuItems = serverSection.menuItems;
                    existingSection.label = serverSection.label;
                }
            }
        });
    }
}
