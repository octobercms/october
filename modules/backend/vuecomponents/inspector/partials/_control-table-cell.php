<td>
    <div class="table-cell-container">
        <backend-inspector-control-table-text
            v-if="column.type == 'string'"
            :row="row"
            :column="column"
            :cell-index="cellIndex"
            :inspector-preferences="inspectorPreferences"
            ref="editor"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
            @valid="$emit('valid', $event)"
            @invalid="$emit('invalid', $event)"
        >
        </backend-inspector-control-table-text>

        <backend-inspector-control-table-dropdown
            v-if="column.type == 'dropdown'"
            :row="row"
            :column="column"
            :cell-index="cellIndex"
            :inspector-preferences="inspectorPreferences"
            ref="editor"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
            @valid="$emit('valid', $event)"
            @invalid="$emit('invalid', $event)"
        >
        </backend-inspector-control-table-dropdown>

        <button v-if="isLastCell && tableConfiguration.deleting && !inspectorPreferences.readOnly" @click.stop="$emit('removerow')" class="remove-row-btn"></button>
    </div>
</td>