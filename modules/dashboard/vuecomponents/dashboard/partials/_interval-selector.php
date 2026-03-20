<div class="dashboard-button-set manage-dashboard-controls">
    <button @click.stop.prevent="onSelectIntervalClick" class="dashboard-toolbar-button stack">
        <div><?= __("Group") ?></div>
        <span v-text="groupingIntervalName"></span>
    </button>
    <button @click.stop.prevent="onSelectCompareClick" class="dashboard-toolbar-button stack">
        <div><?= __("Compare Totals") ?></div>
        <span v-text="compareOptionName"></span>
    </button>
    <button @click.stop.prevent class="dashboard-toolbar-button stack" ref="calendarControl">
        <div><?= __("Interval") ?></div>
        <span v-text="intervalName"></span>
    </button>

    <backend-dropdown-menu
        :items="intervalMenuItems"
        ref="intervalMenu"
        @command="onIntervalMenuItemCommand"
    ></backend-dropdown-menu>

    <backend-dropdown-menu
        :items="compareMenuItems"
        ref="compareMenu"
        @command="onCompareMenuItemCommand"
    ></backend-dropdown-menu>
</div>
