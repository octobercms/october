<div class="dashboard-report-container" :class="cssClass" data-report-container>
    <transition-group
        name="reorder-row-list"
        tag="div"
        class="rows-container"
    >
        <dashboard-component-dashboard-report-row
            v-for="(row, index) in rows"
            :key="row._unique_key"
            :row="row"
            :row-index="index"
            :rows="rows"
            :store="store"
            @deleteRow="onDeleteRow(index)"
        ></dashboard-component-dashboard-report-row>
    </transition-group>

    <div v-if="store.state.editMode" class="row-controls">
        <div
            class="edit-row-button add-row"
            data-edit-row-button
            role="button"
            tabindex="0"
            aria-label="<?= __("Add Row") ?>"
            @click.prevent="onAddRowClick"
        >
            <i class="ph ph-plus"></i>
        </div>
    </div>
</div>
