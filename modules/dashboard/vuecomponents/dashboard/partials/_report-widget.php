<div
    class="dashboard-report-widget"
    :draggable="editMode"
    data-report-widget
    :class="cssClass"
    @dragstart.stop="onDragStart"
    @drop.stop="onDrop"
    @click="onClick"
    @dragover.stop="onDragOver"
>
    <div v-if="editMode && !isFrameless" class="resize-handle" @dragstart.stop.prevent="" @mousedown.stop.prevent="onHandleMouseDown" ref="resizeHandle"></div>

    <div v-show="editMode" class="widget-controls" @dragstart.stop.prevent="">
        <div
            class="edit-widget-button"
            role="button"
            tabindex="0"
            aria-label="<?= __("Edit Widget") ?>"
            @click.stop="onContextMenu($event)"
            @keyup.enter="onContextMenu($event)"
        >
            <img src="<?= Url::asset('/modules/dashboard/assets/images/dashboard/edit-dots.svg') ?>"/>
        </div>

        <backend-dropdown-menu
            :items="menuItems"
            ref="menu"
            @command="onMenuItemCommand"
        ></backend-dropdown-menu>
    </div>

    <div class="widget-inner-container" @dragstart.stop.prevent="">
        <div class="widget-size-container">
            <dashboard-component-dashboard-widget-static
                v-if="widget.configuration.type == 'static'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :autoUpdating="autoUpdating"
                :error="error"
                ref="widgetImplementation"
                @configure="showInspector"
                @reload="load"
            ></dashboard-component-dashboard-widget-static>
            <dashboard-component-dashboard-widget-indicator
                v-if="widget.configuration.type == 'indicator'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :autoUpdating="autoUpdating"
                :error="error"
                ref="widgetImplementation"
                @configure="showInspector"
                @reload="load"
            ></dashboard-component-dashboard-widget-indicator>
            <dashboard-component-dashboard-widget-chart
                v-if="widget.configuration.type == 'chart'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :autoUpdating="autoUpdating"
                :error="error"
                ref="widgetImplementation"
                @configure="showInspector"
                @reload="load"
            ></dashboard-component-dashboard-widget-chart>
            <dashboard-component-dashboard-widget-table
                v-if="widget.configuration.type == 'table'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :autoUpdating="autoUpdating"
                :error="error"
                ref="widgetImplementation"
                @configure="showInspector"
                @reload="load"
            ></dashboard-component-dashboard-widget-table>
            <dashboard-component-dashboard-widget-section-title
                v-if="widget.configuration.type == 'section-title'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :error="error"
                ref="widgetImplementation"
            ></dashboard-component-dashboard-widget-section-title>
            <dashboard-component-dashboard-widget-text-notice
                v-if="widget.configuration.type == 'notice'"
                :widget="widget"
                :store="store"
                :loading="loading"
                :error="error"
                ref="widgetImplementation"
            ></dashboard-component-dashboard-widget-text-notice>
            <template v-if="widget.configuration.type == 'widget'">
                <component
                    v-if="isComponentRegistered(widget.configuration.componentName)"
                    :is="widget.configuration.componentName"
                    :widget="widget"
                    :store="store"
                    :loading="loading"
                    :autoUpdating="autoUpdating"
                    :error="error"
                    ref="widgetImplementation"
                    @configure="showInspector"
                    @reload="load"
                ></component>
                <div v-else>
                    <div class="generic-widget-error">
                        Component not registered: <span v-text="widget.configuration.widgetClass"></span>
                    </div>
                </div>
            </template>
            <template v-if="!isKnownWidgetType(widget.configuration.type)">
                <div class="generic-widget-error">
                    Component not found: <span v-text="widget.configuration.type"></span>
                </div>
            </template>
        </div>
    </div>
</div>
