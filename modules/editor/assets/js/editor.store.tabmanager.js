export class TabManager {
    store;

    constructor(store) {
        this.store = store;
    }

    findTab(key) {
        const tabs = this.store.state.editorTabs;
        const index = tabs.findIndex((tab) => tab.key == key);

        if (index === -1) {
            return null;
        }

        return {
            index,
            tab: tabs[index]
        };
    }

    createTab(tabData) {
        if (!tabData.key) {
            throw new Error('Tab data must contain the key element');
        }

        if (!tabData.component) {
            throw new Error('Tab data must contain the component element');
        }

        const existingTab = this.findTab(tabData.key);
        if (existingTab) {
            return existingTab.tab.key;
        }

        tabData.componentData = tabData.componentData || {};
        tabData.componentData.store = this.store;
        tabData.componentData.tabIcon = tabData.icon;

        // Vue 3: Mark componentData as raw to prevent circular reactivity
        // (componentData.store.state.editorTabs contains this tabData)
        tabData.componentData = Vue.markRaw(tabData.componentData);

        this.store.state.editorTabs.push(tabData);

        return tabData.key;
    }

    closeTab(index) {
        if (index !== null) {
            this.store.state.editorTabs.splice(index, 1);
            Vue.nextTick(() => {
                oc.octoberTooltips.clear();
            }, 1);
        }
    }

    closeTabByKey(key) {
        const tab = this.findTab(key);
        if (!tab) {
            return;
        }

        this.closeTab(tab.index);
    }

    getTabKeys() {
        const tabs = this.store.state.editorTabs;
        return tabs.map((tab) => tab.key);
    }

    updateTabLabel(label, key) {
        const tab = this.findTab(key);
        if (!tab) {
            return;
        }

        if (typeof label !== 'string' || !label.length) {
            label = 'No name';
        }

        tab.tab.label = label;
    }

    setTabHasChanges(hasChanges, key) {
        const tab = this.findTab(key);
        if (!tab) {
            return;
        }

        // Vue 3: Direct assignment is reactive
        tab.tab.hasChanges = hasChanges;
    }

    hasChangedTabs() {
        return this.store.state.editorTabs.some((tab) => tab.hasChanges);
    }

    setTabKey(oldKey, newKey) {
        const tab = this.findTab(oldKey);
        if (!tab) {
            return;
        }

        tab.tab.key = newKey;
    }

    storePersistentTabs(tabs) {
        this.setPersistentTabKeys(tabs.map((tab) => tab.key));
    }

    setPersistentTabKeys(tabKeys) {
        localStorage.setItem('editor-tabs', JSON.stringify(tabKeys));
    }

    getPersistentTabKeys() {
        const tabsStr = localStorage.getItem('editor-tabs');
        if (tabsStr === null) {
            return [];
        }

        try {
            const result = JSON.parse(tabsStr);
            if (!result || !Array.isArray(result)) {
                return [];
            }

            return result;
        } catch (e) {
            return [];
        }
    }
}
