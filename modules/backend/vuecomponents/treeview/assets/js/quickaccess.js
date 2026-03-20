import { utils } from './classes/index.js';

/*
 * Vue treeview node
 */
export default {
    props: {
        uniqueKey: String,
        sections: Array,
        maxItems: {
            type: Number,
            default: 50
        },
        defaultFolderIcon: Object
    },
    data: function data() {
        return {
            labelId: $.oc.domIdManager.generate('treeview-quickaccess-label'),
            searchQuery: '',
            selectedIndex: -1,
            nodes: [],
            commands: [],
            searchTimeoutId: null
        };
    },
    computed: {
        searchQueryTrimmed: function computeSearchQueryTrimmed() {
            return this.searchQuery.toLowerCase().trim();
        },

        resizable: function computeResizable() {
            if (this.totalItemCount > 0 || this.searchQueryTrimmed.length === 0) {
                return true;
            }

            return 'horizontal';
        },

        modalUniqueKey: function computeModalUniqueKey() {
            return this.uniqueKey + '-quickaccess-modal';
        },

        totalItemCount: function computeTotalItemCount() {
            return this.nodes.length + this.commands.length;
        }
    },
    methods: {
        show: function show() {
            this.searchQuery = '';
            this.selectedIndex = -1;
            this.nodes = [];
            this.commands = [];
            this.update();
            this.$refs.modal.show();
        },

        update: function update() {
            this.searchTimeoutId = null;

            var sections = $.oc.vueUtils.getCleanObject(this.sections);

            this.updateNodes(sections);
            this.updateCommands(sections);
        },

        updateNodes: function updateNodes(sections) {
            this.selectedIndex = -1;

            if (!this.searchQueryTrimmed.length) {
                this.nodes = [];
                return;
            }

            this.nodes = utils.findQuickAccessNodes(
                sections,
                this.maxItems,
                this.searchQueryTrimmed,
                this.defaultFolderIcon
            );
        },

        updateCommands: function updateCommands(sections) {
            this.commands = utils.findQuickAccessCommands(sections, this.searchQueryTrimmed);
        },

        getItemIsFolder: function (pathItem) {
            return pathItem.icon === 'folder' || utils.getSystemData(pathItem, 'treeviewGroupFolder');
        },

        getPathItemText: function getPathItemText(pathItem, path) {
            var isFolder = this.getItemIsFolder(pathItem),
                rootItem = path[1], // 0 is the section, 1 is the root node
                isRoot = rootItem === pathItem,
                isSection = path[0] === pathItem;

            var nodeComponentObj = {
                branchGroupByMode: rootItem.groupByMode,
                isRoot: rootItem === pathItem,
                branchGroupBy: rootItem.groupBy,
                branchGroupFolderDisplayPathProps: rootItem.groupFolderDisplayPathProps
            };

            if (!isFolder && rootItem.displayProperty && !isRoot && !isSection) {
                return utils.getLastGroupedPathSegment(
                    pathItem.userData[rootItem.displayProperty],
                    nodeComponentObj,
                    isFolder,
                    rootItem.displayProperty
                );
            }

            return utils.getLastGroupedPathSegment(pathItem.label, nodeComponentObj, isFolder);
        },

        getPathItemClass: function getPathItemClass(pathItem) {
            var isFolder = this.getItemIsFolder(pathItem);

            return {
                'path-section': pathItem.isSection,
                'path-folder': isFolder,
                'backend-icon-background-pseudo': isFolder,
                'path-node': !isFolder && !pathItem.isSection
            };
        },

        scrollSelectedIntoView: function scrollSelectedIntoView() {
            var that = this;
            Vue.nextTick(function () {
                var selected = $(that.$el).find('li.selected');

                if (selected.length) {
                    that.$refs.scrollablePanel.goToElement(selected.get(0), { alignBottom: true, duration: 0 });
                }
            });
        },

        triggerNodeSelected: function triggerNodeSelected(ev) {
            var selectedNode = $(this.$el).find('li.selected');

            if (selectedNode.hasClass('item-document')) {
                var selectedKey = selectedNode.attr('data-node-key');

                if (!selectedKey) {
                    return;
                }

                this.$emit('nodeselected', selectedKey, ev);
                return;
            }

            if (selectedNode.hasClass('item-command')) {
                var href = selectedNode.attr('data-item-href'),
                    target = selectedNode.attr('data-item-target');

                if (typeof href === 'string') {
                    window.open(href, target ? target : '_blank');
                }

                var selectedCommand = selectedNode.attr('data-command');

                this.$emit('command', selectedCommand, ev);
            }
        },

        onModalShown: function onModalShown() {
            $(document.body).on('keydown', this.onKeyDown);
        },

        onModalHidden: function onModalHidden() {
            $(document.body).off('keydown', this.onKeyDown);
        },

        onMouseOver: function onMouseOver(index) {
            this.selectedIndex = index;
        },

        onClick: function onClick(ev, selectedKey) {
            this.$emit('nodeselected', selectedKey, ev);
            this.$refs.modal.hide();
        },

        onCommandClick: function onCommandClick(ev, command, item) {
            this.$refs.modal.hide();

            if (item.href) {
                window.open(item.href, item.target);
                return;
            }

            this.$emit('command', command, ev);
        },

        onKeyDown: function onKeyDown(ev) {
            var key = 'which' in ev ? ev.which : ev.keyCode;

            if (key == 40) {
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.totalItemCount - 1);
                ev.preventDefault();
            }
            else if (key == 38) {
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                ev.preventDefault();
            }
            else if (key == 13) {
                this.triggerNodeSelected(ev);
                this.$refs.modal.hide();
            }

            this.scrollSelectedIntoView();
        }
    },
    watch: {
        searchQueryTrimmed: function watchSearchQueryTrimmed() {
            if (this.searchTimeoutId) {
                clearTimeout(this.searchTimeoutId);
            }

            if (this.$refs.scrollablePanel) {
                this.$refs.scrollablePanel.gotoStart();
            }

            this.selectedIndex = -1;
            this.searchTimeoutId = setTimeout(this.update, 100);
        }
    }
};
