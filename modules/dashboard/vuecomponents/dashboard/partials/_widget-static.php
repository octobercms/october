<div
    class="dashboard-report-widget-static"
    :class="{'loading': explicitLoading}"
>
    <div class="static-body" :class="{'dashboard-widget-loading-pulse': explicitLoading && isConfigured}">
        <dashboard-component-dashboard-widget-error
            v-if="error"
            :store="store"
            @configure="$emit('configure')"
        ></dashboard-component-dashboard-widget-error>

        <template v-if="!error">
            <h3 class="widget-title" v-if="widget.configuration.title" v-text="widget.configuration.title"></h3>
            <span v-if="explicitLoading" class="dashboard-widget-loading-pulse">&nbsp;</span>
            <template v-else>
                <div
                    :data-request-data="pendingRequestData"
                    v-html="loadedValue.result"
                ></div>
            </template>
        </template>
    </div>
</div>
