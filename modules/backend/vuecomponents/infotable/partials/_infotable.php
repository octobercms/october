<table class="component-backend-infotable">
    <tbody>
        <backend-info-table-item
            v-for="item in items"
            :title="item.title"
            :value="item.value"
            :key="item.title"
        >
        </backend-info-table-item>
    </tbody>
</table>