<div
    class="component-backend-tabs flex-layout-column"
    :class="cssClass"
    data-lang-close="<?= e(trans('backend::lang.tabs.close')) ?>"
    data-lang-close-all="<?= e(trans('backend::lang.tabs.close_all')) ?>"
    data-lang-close-others="<?= e(trans('backend::lang.tabs.close_others')) ?>"
    data-lang-close-saved="<?= e(trans('backend::lang.tabs.close_saved')) ?>"
>
    <div class="tablist-container flex-layout-item fix" v-show="!hideTabPanel">
        <div class="flex-layout-row tablist-scrollable-container" :class="{'has-fixed-panel': supportsFullScreen && hasTabs}" ref="scrollableTabsContainer">
            <div class="tabs-scrollable flex-layout-item stretch" ref="scrollable">
                <div
                    class="tablist flex-layout-row"
                    role="tablist"
                    ref="tabList"
                    v-bind:aria-label="ariaLabel"
                    @keydown="onKeyDown"
                >
                    <button
                        v-for="tab in tabs"
                        role="tab"
                        data-component-backend-tab
                        class="flex-layout-item"
                        :class="{
                            active: currentTabKey == tab.key,
                            stretch: tabsStyle == 'document',
                            fix: tabsStyle == 'form',
                            'has-icon': tab.icon || tab.fatalError,
                            'has-close-button': closeable
                        }"
                        v-bind:id="getTabId(tab, 'tab')"
                        v-bind:aria-controls="getTabId(tab, 'panel')"
                        v-bind:aria-selected="currentTabKey == tab.key ? 'true' : 'false'"
                        v-bind:tabindex="currentTabKey == tab.key ? 0 : -1"
                        v-bind:data-tooltip-text="getTooltipText(tab)"
                        @click.ignore="onClick(tab)"
                        @mouseup.middle="onMiddleClick(tab)"
                        @contextmenu.stop="onContextMenu($event, tab)"
                    >
                        <span
                            class="tab-icon"
                            :class="{'tab-error': tab.fatalError}"
                            v-if="tab.icon"
                            aria-hidden="true"
                        >
                            <span
                                class="tab-icon-background"
                                v-bind:style="getTabIconStyle(tab)"
                            >
                                <i
                                    :class="tab.icon.cssClass"
                                ></i>
                            </span>

                            <i class="backend-icon-background tab-error"></i>
                        </span>

                        <span v-text="tab.label" role="text"></span>

                        <span
                            class="backend-icon-background-pseudo close-tab"
                            :class="{'has-changes': tab.hasChanges}"
                            v-bind:tabindex="currentTabKey == tab.key ? 0 : -1"
                            v-if="closeable"
                            role="button"
                            aria-label="<?= e(trans('backend::lang.tabs.close')) ?>"
                            v-bind:title="closeTooltip ? '' : '<?= e(trans('backend::lang.tabs.close')) ?>'"
                            v-bind:data-tooltip-text="closeTooltip"
                            v-bind:data-tooltip-hotkey="closeTooltipHotkey"
                            @click.stop.prevent="onCloseClick(tab)"
                        >✕</span>
                    </button>
                </div>
            </div>
            <div class="flex-layout-item fix fixed-right tabs-toolbar" v-if="supportsFullScreen && hasTabs">
                <div class="toolbar-container">
                    <button
                        class="backend-toolbar-button icon-only"
                        data-tooltip-text="<?= e(trans('backend::lang.tabs.full_screen')) ?>"
                        @click.stop.prevent="onToggleFullscreen"
                    >
                        <i :class="{'icon-fullscreen': !isFullScreen, 'icon-fullscreen-collapse': isFullScreen}"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>

    <template v-if="!noPanes">
        <div
            v-for="tab in tabs"
            role="tabpanel"
            tabindex="0"
            :key="getTabUniqueKey(tab)"
            v-show="currentTabKey == tab.key"
            v-bind:id="getTabId(tab, 'panel')"
            v-bind:aria-labelledby="getTabId(tab, 'tab')"
            class="tabpanel flex-layout-item stretch relative"
            :class="tabPanelCssClass"
        >
            <component
                v-if="!useSlots"
                :ref="getTabComponentRefName(tab)"
                v-bind:is="tab.component"
                :component-data="tab.componentData"
                @tabfatalerror="onTabFatalError(tab)"
                @tabkeychanged="onTabkeyChanged"
                @tabclose="onHostedComponentTabClose(tab)"
            ></component>
            <slot v-else :name="tab.key"></slot>
        </div>
    </template>

    <slot v-if="!tabs.length" name="noTabsView"></slot>

    <backend-dropdown-menu
        :items="contextMenuItems"
        :menu-id="contextMenuId"
        :labeled-by-id="contextMenuLabeledById"
        ref="contextmenu"
        @command="onMenuItemCommand"
    ></backend-dropdown-menu>
</div>