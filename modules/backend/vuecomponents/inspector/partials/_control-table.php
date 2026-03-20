<div
    class="component-backend-inspector-table"
    data-lang-add-item="<?= e(trans('backend::lang.table.add_item')) ?>"
>
    <table>
        <backend-inspector-control-table-head
            :columns="columns"
        >
        </backend-inspector-control-table-head>
        <tbody>
            <backend-inspector-control-table-row
                v-for="(row, index) in value"
                :ref="el => setRowRef(el, index)"
                :row="row"
                :key="index"
                :columns="columns"
                :row-index="index"
                :inspector-preferences="inspectorPreferences"
                :table-configuration="tableConfiguration"
                @removerow="onRemoveRowClick"
            >
            </backend-inspector-control-table-row>
        </tbody>
    </table>

    <div v-if="tableConfiguration.adding" class="inspector-padding-control-left table-control-links">
        <a
            href="#"
            class="add-item-link"
            :class="{disabled: inspectorPreferences.readOnly}"
            @click.stop.prevent="onAddItemClick"
            v-text="control.btnAddRowLabel === undefined ? lang.addItem : control.btnAddRowLabel"
        ></a>
    </div>
</div>