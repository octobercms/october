/*
 * Vue tabs implementation
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 * @see https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
 */
export default {
        props: {
            tabs: Array,
            ariaLabel: {
                type: String,
                default: ''
            },
            fullHeight: {
                type: Boolean,
                default: true
            },
            closeable: {
                type: Boolean,
                default: false
            },
            closeTooltip: {
                type: String,
                default: null
            },
            closeTooltipHotkey: {
                // The tabs control does not handle hotkeys.
                // It must be implemented in a parent component.
                //
                type: String,
                default: null
            },
            useSlots: {
                type: Boolean,
                default: false
            },
            hideTabPanel: {
                type: Boolean,
                default: false
            },
            noPanes: {
                type: Boolean,
                default: false
            },
            tabsStyle: {
                type: String,
                default: 'document'
            },
            tabPanelCssClass: {
                type: String,
                default: ''
            },
            containerCssClass: {
                type: String,
                default: ''
            },
            commonTabContextMenuItems: {
                type: Array,
                default: function () {
                    return [];
                },
                validator: function (value) {
                    var knownCodes = ['close', 'close-all', 'close-others', 'close-saved'];

                    return !value.some(function (itemCode) {
                        return knownCodes.indexOf(itemCode) === -1;
                    });
                }
            },
            tabContextMenuItems: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            supportsFullScreen: {
                type: Boolean,
                default: false
            },
            tooltipsEnabled: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                selectedTabKey: null,
                focusedTabKey: null,
                tabIds: {},
                contextMenuItems: [],
                contextMenuId: $.oc.domIdManager.generate('tabs-context-menu'),
                contextMenuLabeledById: '',
                contextMenuTab: null,
                fullScreen: false
            };
        },
        computed: {
            currentTabKey: function computeCurrentTabKey() {
                if (this.selectedTabKey === null) {
                    if (this.tabs.length > 0) {
                        return this.tabs[0].key;
                    }
                }

                return this.selectedTabKey;
            },

            currentFocusTabKey: function computeCurrentFocusTabKey() {
                if (this.focusedTabKey === null) {
                    return this.currentTabKey;
                }

                return this.focusedTabKey;
            },

            focusedTabKeyIndex: function computeFocusedTabKeyIndex() {
                return this.getTabIndex(this.currentFocusTabKey);
            },

            selectedTabIndex: function computeSelectedTabIndex() {
                return this.getTabIndex(this.currentTabKey);
            },

            isFullScreen: function computeIsFullScreen() {
                return this.fullScreen && this.tabs.length > 0;
            },

            cssClass: function computeCssClass() {
                var result = '';

                if (this.fullHeight) {
                    result += ' full-height-strict';
                }

                if (this.isFullScreen) {
                    result += ' full-screen';
                }

                result += ' style-' + this.tabsStyle;
                result += ' ' + this.containerCssClass;

                return result;
            },

            tabCount: function computeTabCount() {
                return this.tabs.length;
            },

            hasTabs: function computeHasTabs() {
                return this.tabCount > 0;
            },

            hasTabsWithChanges: function computeHasTabsWithChanges() {
                for (var index = this.tabs.length - 1; index >= 0; index--) {
                    if (this.tabs[index].hasChanges) {
                        return true;
                    }
                }

                return false;
            },

            selectedComponentRefName: function computeSelectedComponentRefName() {
                return 'tab-component-' + this.selectedTabKey;
            }
        },
        methods: {
            selectTab: function selectTab(tabKey) {
                this.selectedTabKey = tabKey;
                this.focusedTabKey = tabKey;
            },

            getTooltipText: function getTooltipText(tab) {
                if (!this.tooltipsEnabled) {
                    return null;
                }

                return tab.label;
            },

            getTabIndex: function getTabIndex(tabKey) {
                for (var index = 0; index < this.tabs.length; index++) {
                    if (this.tabs[index].key == tabKey) {
                        return index;
                    }
                }
            },

            getTabId: function getTabId(tab, suffix) {
                if (tab.key === undefined) {
                    throw new Error('Tabs must have the "key" property');
                }

                if (!suffix) {
                    suffix = '';
                }

                if (this.tabIds[tab.key] === undefined) {
                    this.tabIds[tab.key] = $.oc.domIdManager.generate('tab');
                }

                return this.tabIds[tab.key] + '-' + suffix;
            },

            getTabUniqueKey: function getTabUniqueKey(tab) {
                if (tab.systemData && tab.systemData.uniqueKey) {
                    return tab.systemData.uniqueKey;
                }

                tab.systemData = tab.systemData || {};
                tab.systemData.uniqueKey = $.oc.domIdManager.generate('tabuniquekey');

                return tab.systemData.uniqueKey;
            },

            getTabComponentRefName: function getTabComponentRefName(tab) {
                return 'tab-component-' + tab.key;
            },

            getTabIconStyle: function getTabIconStyle(tab) {
                return {
                    'background-color': tab.icon.backgroundColor ? tab.icon.backgroundColor : '#E67E21'
                };
            },

            closeTabConfirmedByHostedComponent: function closeTabConfirmedByHostedComponent(tab) {
                var parentEv = $.Event('tabclose'),
                    tabIndex = this.getTabIndex(tab.key);

                this.$emit('tabclose', tab.key, parentEv);
                if (parentEv.isDefaultPrevented()) {
                    return;
                }

                Vue.nextTick(oc.octoberTooltips.clear, 1);

                if (tabIndex === null || !this.tabs.length) {
                    this.selectedTabKey = null;
                    this.focusedTabKey = null;
                }
                else {
                    if (this.tabs[tabIndex] !== undefined) {
                        this.selectedTabKey = this.tabs[tabIndex].key;
                        this.focusedTabKey = this.tabs[tabIndex].key;
                    }
                    else {
                        this.selectedTabKey = this.tabs[tabIndex - 1].key;
                        this.focusedTabKey = this.tabs[tabIndex - 1].key;
                    }

                    var that = this;
                    Vue.nextTick(function () {
                        $(that.$refs.tabList).children().eq(that.focusedTabKeyIndex).focus();
                    });
                }
            },

            closeAllTabs: function closeAllTabs(ignoreTab, onlySaved) {
                for (var index = this.tabs.length - 1; index >= 0; index--) {
                    var tab = this.tabs[index];
                    if (tab === ignoreTab) {
                        continue;
                    }

                    if (onlySaved && tab.hasChanges) {
                        continue;
                    }

                    if (!this.onCloseClick(tab)) {
                        this.onClick(tab);
                        break;
                    }
                }
            },

            getSelectedTabComponent: function getSelectedTabComponent() {
                var result = this.$refs[this.selectedComponentRefName];

                if (result === undefined || !result.length) {
                    return null;
                }

                return result[0];
            },

            getTabComponent: function getTabComponent(tabKey) {
                var refName = 'tab-component-' + tabKey;
                var result = this.$refs[refName];

                if (result === undefined || !result.length) {
                    return null;
                }

                return result[0];
            },

            onKeyDown: function onKeyDown(ev) {
                // Right/left arrow handling. See w3.org accessibility
                // requirements for details.
                //
                var key = 'which' in ev ? ev.which : ev.keyCode;

                if (key != 39 && key != 37) {
                    return;
                }

                if (this.focusedTabKeyIndex === null) {
                    return;
                }

                if (key == 39) {
                    if (this.focusedTabKeyIndex < this.tabs.length - 1) {
                        this.focusedTabKey = this.tabs[this.focusedTabKeyIndex + 1].key;
                    }
                    else {
                        this.focusedTabKey = this.tabs[0].key;
                    }
                }
                else {
                    if (this.focusedTabKeyIndex > 0) {
                        this.focusedTabKey = this.tabs[this.focusedTabKeyIndex - 1].key;
                    }
                    else {
                        this.focusedTabKey = this.tabs[this.tabs.length - 1].key;
                    }
                }

                $(this.$refs.tabList).children().eq(this.focusedTabKeyIndex).focus();
            },

            onClick: function onClick(tab) {
                this.selectedTabKey = tab.key;
                this.focusedTabKey = tab.key;

                var that = this;
                Vue.nextTick(function () {
                    $(that.$refs.tabList).children().eq(that.focusedTabKeyIndex).focus();
                });
            },

            onMiddleClick: function onMiddleClick(tab) {
                this.onCloseClick(tab);
            },

            onCloseClick: function onCloseClick(tab) {
                var refName = this.getTabComponentRefName(tab),
                    componentRefs = this.$refs[refName],
                    that = this;

                if (componentRefs.length && typeof componentRefs[0].onParentTabClose == 'function') {
                    var result = this.$refs[refName][0].onParentTabClose();

                    // If result is true or falsy, close immediately
                    // If result is a promise (thenable), wait for it
                    if (!result || result === true) {
                        this.closeTabConfirmedByHostedComponent(tab);
                        return true;
                    }

                    // Result is a promise, wait for confirmation
                    result.then(function () {
                        that.closeTabConfirmedByHostedComponent(tab);
                    }, $.noop);

                    return false;
                }
                else {
                    this.closeTabConfirmedByHostedComponent(tab);
                    return true;
                }
            },

            onHostedComponentTabClose: function onHostedComponentTabClose(tab) {
                return this.onCloseClick(tab);
            },

            onTabFatalError: function onTabFatalError(tab) {
                // Vue 3: Direct assignment is reactive
                tab.fatalError = true;
            },

            onTabkeyChanged: function onTabkeyChanged(oldKey, newKey) {
                if (this.selectedTabKey == oldKey) {
                    this.selectedTabKey = newKey;
                }

                if (this.focusedTabKey == oldKey) {
                    this.focusedTabKey = newKey;
                }
            },

            onContextMenu: function onContextMenu(ev, tab) {
                this.contextMenuItems = [].concat(this.tabContextMenuItems);
                var el = this.$el,
                    that = this;

                this.commonTabContextMenuItems.forEach(function (itemCode) {
                    that.contextMenuItems.push({
                        type: 'text',
                        command: itemCode,
                        label: el.getAttribute('data-lang-' + itemCode)
                    });
                });

                if (!this.contextMenuItems.length) {
                    return;
                }

                this.contextMenuTab = tab;
                this.contextMenuLabeledById = this.getTabId(tab, 'tab');
                this.$refs.contextmenu.showMenu(ev);
                ev.preventDefault();
            },

            onMenuItemCommand: function onMenuItemCommand(command) {
                switch (command) {
                    case 'close':
                        this.onCloseClick(this.contextMenuTab);
                        break;
                    case 'close-all':
                        this.closeAllTabs();
                        break;
                    case 'close-others':
                        this.closeAllTabs(this.contextMenuTab);
                        break;
                    case 'close-saved':
                        this.closeAllTabs(null, true);
                        break;
                    default:
                        this.$emit('contextmenu', command, this.contextMenuTab);
                        break;
                }
            },

            onToggleFullscreen: function onToggleFullscreen() {
                this.fullScreen = !this.fullScreen;
            }
        },
        mounted: function mounted() {
            if (this.supportsFullScreen && this.tabsStyle != 'document') {
                throw new Error('Tab fullscreen mode only supported for the document tab style.');
            }

            $(this.$refs.scrollable).dragScroll({
                useDrag: true,
                useNative: false,
                noScrollClasses: false,
                scrollClassContainer: this.$refs.scrollableTabsContainer
            });
        },
        beforeUnmount: function beforeUnmount() {
            $(this.$refs.scrollable).dragScroll('dispose');
        },
        watch: {
            currentTabKey: function watchCurrentTabKey(key, oldKey) {
                this.$emit('tabselected', key, oldKey);

                var component = this.getSelectedTabComponent();
                if (component && typeof component.onParentTabSelected == 'function') {
                    component.onParentTabSelected();
                }
            },

            selectedTabIndex: function watchSelectedTabIndex(newValue, oldValue) {
                // Only handle the case where the selected tab was removed
                // (newValue becomes undefined because selectedTabKey points to a non-existent tab)
                if (newValue !== undefined) {
                    return;
                }

                // Prevent re-entry - if we're already adjusting, skip
                if (this._adjustingTabSelection) {
                    return;
                }

                this._adjustingTabSelection = true;

                // Selecting another tab after a tab was deleted.
                //
                if (oldValue !== undefined && oldValue <= this.tabs.length - 1 && this.tabs[oldValue]) {
                    this.selectedTabKey = this.tabs[oldValue].key;
                    this.focusedTabKey = this.selectedTabKey;
                }
                else if (this.tabs.length > 0) {
                    this.selectedTabKey = this.tabs[this.tabs.length - 1].key;
                    this.focusedTabKey = this.selectedTabKey;
                }
                else {
                    this.selectedTabKey = null;
                    this.focusedTabKey = null;
                }

                var that = this;
                Vue.nextTick(function() {
                    that._adjustingTabSelection = false;
                });
            },
            tabCount: function watchTabCount(value) {
                if (!value) {
                    this.fullScreen = false;
                }
            }
        }
};
