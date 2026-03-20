<div
    class="position-relative h-100"
    :class="{'application-sidebar-hidden': sidebarHidden || isDirectDocumentMode}"
    data-lang-reveal-in-sidebar="<?= e(trans('editor::lang.common.reveal_in_sidebar')) ?>"
    v-oc-hotkey:[quickViewHotkey]="onShowQuickAccess"
    v-oc-hotkey:[toggleSidebarHotkey]="onToggleSidebar"
>
    <backend-splitter
        direction="vertical"
        unique-key="editor-main-view"
        :default-size="400">
        <template v-slot:first>
            <editor-component-navigator ref="navigator" :store="store" :readonly="navigatorReadonly"></editor-component-navigator>
        </template>

        <template v-slot:second>
            <div class="flex-layout-column fill-container">
                <backend-tabs
                    ref="tabs"
                    :tabs="store.state.editorTabs"
                    :full-height="true"
                    :closeable="true"
                    :supports-full-screen="true"
                    :hide-tab-panel="isDirectDocumentMode"
                    :common-tab-context-menu-items="['close', 'close-all', 'close-others', 'close-saved']"
                    :tab-context-menu-items="tabContextMenuItems"
                    aria-label="<?= __('Editor Tabs') ?>"
                    closeTooltip="<?= __('Close Tab') ?>"
                    closeTooltipHotkey="⇧⌥W"
                    @tabclose="onTabClose"
                    @tabselected="onTabSelected"
                    @contextmenu="onTabContextMenu"
                >
                    <template v-slot:noTabsView>
                        <div class="flex-layout-item stretch relative">
                            <div class="editor-application-splash layout-fill-container flex-layout-column align-center justify-center">
                                <div>
                                    <div class="splash-content" :class="{'document-not-found': directDocumentNotFound}">
                                        <div v-if="!customLogo" class="october-cms-logo-grey"/>
                                        <div class="editor-custom-logo" v-if="customLogo">
                                            <img v-bind:src="customLogo">
                                        </div>

                                        <table class="editor-hotkeys" v-if="!isDirectDocumentMode">
                                            <tbody>
                                                <tr>
                                                    <th><?= e(trans('editor::lang.common.quick_access')) ?></th>
                                                    <td><span class="editor-hotkey" v-text="quickViewHotkey"></span></td>
                                                </tr>
                                                <tr>
                                                    <th><?= e(trans('editor::lang.common.toggle_sidebar')) ?></th>
                                                    <td><span class="editor-hotkey" v-text="toggleSidebarHotkey"></span></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div v-if="directDocumentNotFound" class="document-not-found-message">
                                            <?= e(trans('editor::lang.common.document_not_found')) ?>

                                            <div>
                                                <button class="btn btn-primary" @click="onCloseDirectDocumentClick"><?= e(trans('backend::lang.form.close')) ?></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </backend-tabs>
            </div>
        </template>
    </backend-splitter>

    <editor-document-info-popup ref="infoPopup"></editor-document-info-popup>
</div>
