import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerPartial extends DocumentControllerBase {
    get documentType() {
        return 'cms-partial';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-partial-editor';
    }

    initListeners() {
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    getAllPartialFilenames() {
        if (this.cachedPartialList) {
            return this.cachedPartialList;
        }

        const partialsNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-partial'
        );

        let partialList = [];

        if (partialsNavigatorNode) {
            partialList = treeviewUtils.getFlattenNodes(partialsNavigatorNode.nodes).map((partialNode) => {
                return partialNode.userData.filename;
            });
        }
        else {
            partialList = this.parentExtension.state.customData.partials;
        }

        this.cachedPartialList = partialList;
        return partialList;
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedPartialList = null;
    }
}
