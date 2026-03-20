<thead @mousedown.stop="onHandleMouseDown">
    <tr>
        <backend-inspector-control-table-headcell
            v-for="(column, index) in columns"
            :key="index"
            :column="column"
            :column-index="index"
            :column-width="columnWidth"
        >
        </backend-inspector-control-table-headcell>
    </tr>
</thead>