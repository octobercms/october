import { DocumentControllerBlueprint } from './tailor.editor.extension.documentcontroller.blueprint.js';

export class DocumentControllerThemeBlueprint extends DocumentControllerBlueprint {
    get documentType() {
        return 'tailor-theme-blueprint';
    }
}
