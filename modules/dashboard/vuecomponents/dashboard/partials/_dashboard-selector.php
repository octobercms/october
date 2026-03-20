<div class="dashboard-selector">
    <h2 v-text="currentDashboard.name"></h2>
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
