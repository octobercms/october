<div
    id="dashboard-container"
    class="oc-dashboard-container"
>
    <div
        class="flex-layout-column full-height"
        data-control="dashwidget"
    >
        <div data-vue-template>
            <dashboard-component-dashboard :store="store"></dashboard-component-dashboard>
        </div>
        <script type="text/template" data-vue-state="initial">
            <?= json_encode($initialState) ?>
        </script>
    </div>
</div>
