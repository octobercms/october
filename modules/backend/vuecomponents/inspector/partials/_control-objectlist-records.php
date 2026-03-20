<div
    class="component-backend-inspector-table"
    data-lang-add-item="<?= e(trans('backend::lang.table.add_item')) ?>"
>
    <table v-if="hasValues">
        <tbody>
            <tr v-for="(record, key) in obj">
                <td class="no-sub-controls" :class="{clickable: !inspectorPreferences.readOnly}" @click.stop="onItemClick(key)">
                    <div class="clickable-data-container">
                        <backend-inspector-control-objectlist-recordtitle
                            :control="control"
                            :record="record"
                            :parent-obj="parentObj"
                            :obj="obj"
                        ></backend-inspector-control-objectlist-recordtitle>
                        <button v-if="!inspectorPreferences.readOnly" @click.stop.prevent="onRemoveItemClick(key)" class="remove-row-btn"></button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="inspector-padding-control-left table-control-links">
        <a
            href="#"
            class="add-item-link"
            :class="{disabled: inspectorPreferences.readOnly || !displayAddItem}"
            :disabled="inspectorPreferences.readOnly || !displayAddItem"
            @click.stop.prevent="onAddItemClick"
            v-text="lang.addItem"
        ></a>
    </div>
</div>