import dropdownMenuUtils from '../../../backend/vuecomponents/dropdownmenu/assets/js/dropdownmenu-utils.js';
import { DocumentControllerBase } from '../../../editor/assets/js/editor.extension.documentcontroller.base.js';
import { utils as treeviewUtils } from '../../../backend/vuecomponents/treeview/assets/js/classes/index.js';
const menuUtils = dropdownMenuUtils;

export class DocumentControllerPage extends DocumentControllerBase {
    constructor(editorExtension) {
        super(editorExtension);

        this.loadPageSorting();
    }

    get documentType() {
        return 'cms-page';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-page-editor';
    }

    loadPageSorting() {
        const knownSortingModes = ['cms-pages-sort-cmd', 'cms-pages-group-cmd', 'cms-pages-display-cmd'];

        knownSortingModes.forEach((item) => {
            const itemValue = localStorage.getItem(item);
            if (itemValue !== null) {
                this.emit(itemValue);
            }
        });
    }

    initListeners() {
        this.on('cms:sort-pages@title, cms:sort-pages@url, cms:sort-pages@filename', this.sortPages);
        this.on('cms:group-pages@path, cms:group-pages@url', this.groupPages);
        this.on('cms:display-pages@title, cms:display-pages@url, cms:display-pages@filename', this.setDisplayMode);
        this.on('cms:navigator-nodes-updated', this.onNavigatorNodesUpdated);
    }

    sortPages(commandObj) {
        if (!commandObj.hasParameter) {
            throw new Error(`cms:sort-pages command excepts a parameter: ${commandObj.fullCommand}`);
        }

        const pagesNode = this.rootNavigatorNodeSafe;
        if (!pagesNode) {
            return;
        }

        const sortingItem = menuUtils.findMenuItem(pagesNode.topLevelMenuitems, ['sorting'], 'command');

        menuUtils.checkItemInGroup(sortingItem.items, commandObj.fullCommand);
        pagesNode.sortBy = commandObj.parameter;

        localStorage.setItem('cms-pages-sort-cmd', commandObj.fullCommand);
    }

    setDisplayMode(commandObj) {
        if (!commandObj.hasParameter) {
            throw new Error(`cms:display-pages command excepts a parameter: ${commandObj.fullCommand}`);
        }

        const pagesNode = this.rootNavigatorNodeSafe;
        if (!pagesNode) {
            return;
        }

        const displayItem = menuUtils.findMenuItem(pagesNode.topLevelMenuitems, ['display'], 'command');

        menuUtils.checkItemInGroup(displayItem.items, commandObj.fullCommand);
        pagesNode.displayProperty = commandObj.parameter;

        localStorage.setItem('cms-pages-display-cmd', commandObj.fullCommand);
    }

    groupPages(commandObj) {
        if (!commandObj.hasParameter) {
            throw new Error(`cms:group-pages command excepts a parameter: ${commandObj.fullCommand}`);
        }

        const pagesNode = this.rootNavigatorNodeSafe;
        if (!pagesNode) {
            return;
        }

        const groupingItem = menuUtils.findMenuItem(pagesNode.topLevelMenuitems, ['grouping'], 'command');

        menuUtils.checkItemInGroup(groupingItem.items, commandObj.fullCommand);
        pagesNode.groupBy = commandObj.parameter;

        if (commandObj.parameter == 'path') {
            pagesNode.groupByMode = 'folders';
            pagesNode.groupByRegex = null;
            pagesNode.groupFolderDisplayPathProps = ['filename'];
        }
        else {
            pagesNode.groupByMode = 'nesting';
            pagesNode.groupByRegex = '^[a-z0-9_\\-]*$';
            pagesNode.groupByFolderDisplayPathProps = null;
        }

        localStorage.setItem('cms-pages-group-cmd', commandObj.fullCommand);
    }

    preprocessSettingsFields(settingsFields) {
        const layoutList = this.parentExtension.getDocumentController('cms-layout').getAllLayoutFilenames();

        layoutList.sort();

        const layouts = {};
        layouts[''] = $.oc.editor.getLangStr('cms::lang.page.no_layout');
        layoutList.forEach((fileName) => {
            const path = this.parentExtension.removeFileExtension(fileName);
            layouts[path] = path;
        });

        settingsFields.some((field) => {
            if (field.property == 'layout') {
                field.options = layouts;

                return true;
            }
        });

        if ($.oc.editor.application.isDirectDocumentMode) {
            settingsFields = settingsFields.filter((field) => {
                return ['layout', 'url', 'fileName', 'is_hidden'].indexOf(field.property) === -1;
            });
        }

        return settingsFields;
    }

    preprocessNewDocumentData(newDocumentData, commandObj) {
        const layoutList = this.parentExtension.getDocumentController('cms-layout').getAllLayoutFilenames();

        if (
            layoutList.some((fileName) => {
                return this.parentExtension.removeFileExtension(fileName) === 'default';
            })
        ) {
            newDocumentData.document.layout = 'default';
        }
    }

    getAllPageFilenames() {
        if (this.cachedPageList) {
            return this.cachedPageList;
        }

        const pagesNavigatorNode = treeviewUtils.findNodeByKeyInSections(
            this.parentExtension.state.navigatorSections,
            'cms:cms-page'
        );

        let pageList = [];

        if (pagesNavigatorNode) {
            pageList = treeviewUtils.getFlattenNodes(pagesNavigatorNode.nodes).map((pageNode) => {
                return pageNode.userData.filename;
            });
        }
        else {
            pageList = this.parentExtension.state.customData.pages;
        }

        this.cachedPageList = pageList;
        return pageList;
    }

    onNavigatorNodesUpdated(cmd) {
        this.cachedPageList = null;
    }
}
