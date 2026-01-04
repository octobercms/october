<div
    class="dashboard-report-widget-chart"
    :class="{'loading': loading}"
>
    <div class="widget-body">
        <h3 class="widget-title" v-if="widget.configuration.title" v-text="widget.configuration.title"></h3>

        <div v-if="showMetricsTotalRow" class="totals">
            <div
                class="total-cell"
                v-for="metricData in configuration.metrics"
                v-if="metricData.displayTotals"
            >
                <div v-if="loading" class="skeleton-container">
                    <div class="skeleton-name data-skeleton dashboard-widget-loading-pulse"></div>
                    <div class="skeleton-value data-skeleton dashboard-widget-loading-pulse"></div>
                </div>
                <div v-else>
                    <div class="total-name">
                        <div class="total-color" :style="{'background-color': metricData.color}"></div>
                        <span v-text="metricsData[metricData.metric].label"></span>
                    </div>
                    <div class="total-container">
                        <div class="dashboard-total-value" v-text="getMetricTotalFormatted(metricData.metric)"></div>
                        <dashboard-component-dashboard-report-diff
                            :prevValue="getMetricTotalClean(metricData.metric, true)"
                            :currentValue="getMetricTotalClean(metricData.metric)"
                            :formattingOptions="getMetricIntlFormatOptions(metricData.metric)"
                            :store="store"
                        >
                        </dashboard-component-dashboard-report-diff>
                    </div>
                </div>
            </div>
        </div>

        <div class="widget-chart-container" :class="{'error': error}">
            <canvas ref="canvas"></canvas>
        </div>

        <dashboard-component-dashboard-widget-error
            v-if="error"
            :store="store"
            @configure="$emit('configure')"
        ></dashboard-component-dashboard-widget-error>
    </div>
</div>
