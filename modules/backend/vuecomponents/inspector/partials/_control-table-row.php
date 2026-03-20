<tr :class="{focused: focused, 'has-errors': hasErrors}">
    <backend-inspector-control-table-cell
        v-for="(column, index) in columns"
        :ref="el => setCellRef(el, index)"
        :key="index"
        :column="column"
        :row="row"
        :cell-index="index"
        :inspector-preferences="inspectorPreferences"
        :table-configuration="tableConfiguration"
        :is-last-cell="index == columns.length-1"
        @focus="onCellFocus"
        @blur="onCellBlur"
        @valid="onValid"
        @invalid="onInvalid"
        @removerow="$emit('removerow', rowIndex)"
    >
    </backend-inspector-control-table-cell>
</tr>