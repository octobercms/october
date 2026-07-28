<div class="dashboard-selector">
    <div class="dashboard-title">
        <h2 v-text="currentDashboard.name"></h2>
        <div
            v-if="currentDashboard.isPersonalized"
            class="dashboard-personalized-marker"
            data-tooltip-text="<?= __("Personalized dashboard") ?>"
            data-tooltip-position="top"
        ><i class="ph ph-user"></i></div>
    </div>
    <div v-if="canCreateAndEdit" class="dashboard-button-set">
        <button
            v-if="embeddedInDashboard"
            class="dashboard-toolbar-button"
            @click.stop.prevent="onEditClick"
            aria-label="<?= __("Edit Dashboard") ?>"
            title="<?= __("Edit Dashboard") ?>"
        ><i class="ph ph-gear"></i></button>
        <backend-dropdown-menu
            :items="editMenuItems"
            ref="editMenu"
            @command="onEditMenuItemCommand"
        ></backend-dropdown-menu>
    </div>
</div>
