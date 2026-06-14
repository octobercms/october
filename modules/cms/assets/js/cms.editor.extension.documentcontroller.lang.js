import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerLang extends DocumentControllerBase {
    get documentType() {
        return 'cms-lang';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-lang-editor';
    }

    initListeners() {
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    getAllLangFilenames() {
        if (this.cachedLangList) {
            return this.cachedLangList;
        }

        const langsNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-lang'
        );

        let langList = [];

        if (langsNavigatorNode) {
            langList = treeviewUtils
                .getFlattenNodes(langsNavigatorNode.nodes)
                .map((langNode) => {
                    return langNode.userData.path;
                });
        }

        this.cachedLangList = langList;
        return langList;
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedLangList = null;
    }
}
