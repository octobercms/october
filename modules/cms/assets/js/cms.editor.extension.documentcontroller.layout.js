import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerLayout extends DocumentControllerBase {
    get documentType() {
        return 'cms-layout';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-layout-editor';
    }

    initListeners() {
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    getAllLayoutFilenames() {
        if (this.cachedLayoutList) {
            return this.cachedLayoutList;
        }

        const layoutsNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-layout'
        );

        let layoutList = [];

        if (layoutsNavigatorNode) {
            layoutList = treeviewUtils.getFlattenNodes(layoutsNavigatorNode.nodes).map((layoutNode) => {
                return layoutNode.userData.filename;
            });
        }
        else {
            layoutList = this.parentExtension.state.customData.layouts;
        }

        this.cachedLayoutList = layoutList;
        return layoutList;
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedLayoutList = null;
    }
}
