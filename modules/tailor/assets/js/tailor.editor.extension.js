import { ExtensionBase } from '../../../editor/assets/js/editor.extension.base.js';
import { DocumentControllerBlueprint } from './tailor.editor.extension.documentcontroller.blueprint.js';
import { DocumentControllerThemeBlueprint } from './tailor.editor.extension.documentcontroller.theme-blueprint.js';

class TailorEditorExtension extends ExtensionBase {
    constructor(namespace) {
        super(namespace);
    }

    listDocumentControllerClasses() {
        return [
            DocumentControllerBlueprint,
            DocumentControllerThemeBlueprint,
        ];
    }

    removeFileExtension(fileName) {
        return fileName.split('.').slice(0, -1).join('.');
    }

    onCommand(commandString, payload) {
        super.onCommand(commandString, payload);

        if (commandString === 'tailor:refresh-navigator') {
            this.editorStore.refreshExtensionNavigatorNodes(this.editorNamespace).then(() => {});

            return;
        }
    }
}

// Register with the editor extension registry
oc.editorExtensions = oc.editorExtensions || {};
oc.editorExtensions['tailor'] = TailorEditorExtension;

export { TailorEditorExtension };
