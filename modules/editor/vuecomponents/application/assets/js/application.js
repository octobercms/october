import dropdownMenuUtils from '../../../../../backend/vuecomponents/dropdownmenu/assets/js/dropdownmenu-utils.js';

export default {
    props: {
        store: Object,
        customLogo: String
    },
    data: function() {
        return {
            tabContextMenuItems: [
                {
                    type: 'text',
                    command: 'reveal-in-sidebar',
                    label: ''
                },
                {
                    type: 'separator'
                }
            ],
            navigatorReadonly: false,
            sidebarHidden: false,
            directDocumentNotFound: false,
            quickViewHotkey: 'ctrl+shift+a',
            toggleSidebarHotkey: 'ctrl+shift+b'
        };
    },
    computed: {
        directDocumentName: function computeDirectDocumentName() {
            if (typeof this.store.state.params.directModeDocument !== 'string') {
                return null;
            }

            return this.store.state.params.directModeDocument;
        },

        isDirectDocumentMode: function computeIsDirectDocumentMode() {
            return !!this.directDocumentName;
        },

        documentNameToOpen: function computeDocumentNameToOpen() {
            if (typeof this.store.state.params.openDocument !== 'string') {
                return null;
            }

            return this.store.state.params.openDocument;
        },

        isDocumentNameToOpenProvided: function isDocumentNameToOpenProvided() {
            return !!this.documentNameToOpen;
        }
    },
    methods: {
        ajaxRequest: function ajaxRequest(handler, requestData, options) {
            options = options || {};
            return new Promise(function(resolve, reject) {
                const request = oc.ajax(handler, {
                    data: requestData,
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(data, statusCode, xhr) {
                        xhr.responseJSON = data;
                        reject(xhr);
                    }
                });

                if (options.signal) {
                    options.signal.addEventListener('abort', function() {
                        request.abort();
                    });
                }
            });
        },

        openTab: function openTab(tabData) {
            const key = this.store.tabManager.createTab(tabData);
            this.$refs.tabs.selectTab(key);
        },

        showEditorDocumentInfoPopup: function showEditorDocumentInfoPopup(items, title) {
            this.$refs.infoPopup.show(items, title);
        },

        openDocument: function openDocument(documentUriStr) {
            this.$refs.navigator.openDocument(documentUriStr);
        },

        setNavigatorReadonly(value) {
            this.navigatorReadonly = value;
        },

        hasChangedTabs: function hasChangedTabs() {
            return this.store.tabManager.hasChangedTabs();
        },

        revealNavigatorNode: function revealNavigatorNode(uniqueKey) {
            this.$refs.navigator.reveal(uniqueKey);
        },

        getCurrentDocumentComponent: function getCurrentDocumentComponent() {
            return this.$refs.tabs.getSelectedTabComponent();
        },

        getAllOpenDocumentComponents: function getAllOpenDocumentComponents() {
            const tabKeys = this.store.tabManager.getTabKeys();
            const result = [];

            tabKeys.forEach((tabKey) => {
                const component = this.$refs.tabs.getTabComponent(tabKey);
                component && result.push(component);
            });

            return result;
        },

        navigatorNodeKeyChanged: function navigatorNodeKeyChanged(oldValue, newValue) {
            this.$refs.navigator.navigatorNodeKeyChanged(oldValue, newValue);
        },

        runCurrentDocumentComponentCommand: function runCurrentDocumentComponentCommand(command, payload) {
            const component = this.getCurrentDocumentComponent();
            if (!component) {
                return;
            }

            if (typeof component.onApplicationCommand === 'function') {
                component.onApplicationCommand(command, payload);
            }
        },

        closeAllTabs: function closeAllTabs(onlySaved) {
            this.$refs.tabs.closeAllTabs(null, onlySaved);
        },

        postDirectDocumentSavedMessage: function postDirectDocumentSavedMessage() {
            if (window.parent) {
                window.parent.postMessage('october-editor-saved', '*');
            }
        },

        onTabSelected: function onTabSelected(key) {
            this.store.state.navigatorSelectedUniqueKey = key;

            this.store.dispatchCommand('global:application-tab-selected', key);
        },

        onTabClose: function onTabClose(tabKey, ev) {
            const index = this.$refs.tabs.getTabIndex(tabKey);
            this.store.tabManager.closeTab(index);
        },

        onTabContextMenu: function onTabContextMenu(command, tab) {
            if (command === 'reveal-in-sidebar') {
                this.$refs.navigator.reveal(tab.key);
            }
        },

        onShowQuickAccess: function onShowQuickAccess(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            if (!$.oc.modalFocusManager.hasHotkeyBlockingAbove(null)) {
                this.$refs.navigator.showQuickAccess();
            }
        },

        onToggleSidebar: function onToggleSidebar(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            this.sidebarHidden = !this.sidebarHidden;
        },

        onCloseDirectDocumentClick: function onCloseDirectDocumentClick() {
            if (window.parent) {
                window.parent.postMessage('october-editor-close', '*');
            }
        }
    },
    watch: {
        'store.state.editorTabs': {
            deep: true,
            handler: function watchStoreTabs(value) {
                if (!this.isDirectDocumentMode) {
                    this.store.tabManager.storePersistentTabs(value);
                }
            }
        }
    },
    mounted: function() {
        Vue.nextTick(() => {
            if (!this.isDirectDocumentMode) {
                let tabKeys = this.store.tabManager.getPersistentTabKeys();
                if (tabKeys.length) {
                    tabKeys = this.$refs.navigator.openTabs(tabKeys);

                    this.store.tabManager.setPersistentTabKeys(tabKeys);
                }

                if (this.isDocumentNameToOpenProvided) {
                    if (this.$refs.navigator.openTabs([this.documentNameToOpen]).length) {
                        this.revealNavigatorNode(this.documentNameToOpen);
                    }
                    let url = window.location.href;
                    url = url.split("?")[0];
                    window.history.replaceState({}, "", url);
                }
            }
            else {
                if (!this.$refs.navigator.openTabs([this.directDocumentName]).length) {
                    this.directDocumentNotFound = true;
                }
            }
        });

        const item = dropdownMenuUtils.findMenuItem(this.tabContextMenuItems, ['reveal-in-sidebar'], 'command');
        if (item) {
            item.label = this.$el.getAttribute('data-lang-reveal-in-sidebar');
        }
    }
};
