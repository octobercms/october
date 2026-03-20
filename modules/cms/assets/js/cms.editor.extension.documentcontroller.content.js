import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';

export class DocumentControllerContent extends DocumentControllerBase {
    get documentType() {
        return 'cms-content';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-content-editor';
    }

    initListeners() {
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    getAllContentFilenames() {
        if (this.cachedContentList) {
            return this.cachedContentList;
        }

        const contentNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-content'
        );

        let contentList = [];

        if (contentNavigatorNode) {
            contentList = treeviewUtils.getFlattenNodes(contentNavigatorNode.nodes).map((contentNode) => {
                return contentNode.userData.filename;
            });
        }
        else {
            contentList = this.parentExtension.state.customData.content;
        }

        this.cachedContentList = contentList;
        return contentList;
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedContentList = null;
    }
}
