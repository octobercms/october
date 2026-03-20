<div
    class="report-row"
    :class="cssClass"
    data-report-row
    @drop.stop="onDrop"
    @dragover.stop="onDragOver"
>
    <div v-if="store.state.editMode" class="row-controls" @dragstart.stop.prevent="">
        <div
            class="edit-row-button"
            data-edit-row-button
            role="button"
            tabindex="0"
            aria-label="<?= __("Edit Row") ?>"
            @mousedown="onRowButtonMouseDown"
            @contextmenu.stop="onContextMenu($event)"
            @click.stop="onContextMenu($event)"
            v-on:keyup.enter="onContextMenu($event)"
        >
            <img src="<?= Url::asset('/modules/dashboard/assets/images/dashboard/edit-dots.svg') ?>"/>
        </div>

        <backend-dropdown-menu
            :items="menuItems"
            ref="menu"
            @command="onMenuItemCommand"
        ></backend-dropdown-menu>
    </div>

    <div class="row-widgets" >
        <div
            v-if="store.state.editMode && !hasWidgets"
            class="add-widget-button"
            @click.stop="onAddWidgetClick($event)"
        >
            <i class="ph ph-plus"></i>
            <span><?= __("Add Widget") ?></span>
        </div>

        <backend-dropdown-menu
            :items="addWidgetItems"
            ref="addWidgetMenu"
            @command="onAddWidgetMenuItemCommand"
        ></backend-dropdown-menu>

        <template v-for="(widget, index) in row.widgets" :key="widget._unique_key">
            <dashboard-component-dashboard-report-widget
                :widget="widget"
                :row="row"
                :rows="rows"
                :widget-index-in-row="index"
                :row-index="rowIndex"
                :store=store
            ></dashboard-component-dashboard-report-widget>
        </template>
    </div>
</div>
