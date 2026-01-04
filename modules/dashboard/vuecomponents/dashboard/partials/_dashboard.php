<div class="oc-dashboard">
     <div class="dashboard-toolbar-container">
        <div class="dashboards">
            <dashboard-component-dashboard-dashboard-selector
                v-if="!store.state.editMode"
                :store="store"
                :embeddedInDashboard="true"
            ></dashboard-component-dashboard-dashboard-selector>

            <div v-if="store.state.editMode" class="dashboard-manage-controls">
                <div class="dashboard-button-set interval-selector">
                    <button class="dashboard-toolbar-button primary" :disabled="saving" @click.prevent="onApplyChanges"><?= __("Apply Changes") ?></button>
                    <button class="dashboard-toolbar-button" :disabled="saving" @click.prevent="onCancelChanges"><?= __("Cancel") ?></button>
                </div>
            </div>
        </div>
        <dashboard-component-dashboard-interval-selector
            v-if="!store.state.editMode && store.state.showInterval"
            :store="store"
        ></dashboard-component-dashboard-interval-selector>
    </div>

    <dashboard-component-dashboard-report
        :rows="currentDashboard.rows"
        :store=store
    ></dashboard-component-dashboard-report>
</div>
