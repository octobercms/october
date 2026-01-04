<div
    class="dashboard-report-widget-table"
    :class="{'loading': explicitLoading}"
>
    <div class="widget-body">
        <h3 class="widget-title" v-if="widget.configuration.title" v-text="widget.configuration.title"></h3>

        <div class="widget-table-container" v-if="!error">
            <div class="table-widget-data" :style="tableStyle">
                <div class="header">
                    <div class="cell">
                        <div class="dimension-skeleton dashboard-widget-loading-pulse" v-if="explicitLoading && !paginating">
                            <span class="data-skeleton force" :style="{width: makeRandomWidth()}"></span>
                            <span class="data-skeleton force" :style="{width: makeRandomWidth()}"></span>
                        </div>
                        <span v-else v-text="dimensionData.oc_dimension"></span>
                    </div>
                    <div class="cell" v-for="dimensionField in configuration.dimension_fields">
                        <div class="dimension-skeleton dashboard-widget-loading-pulse" v-if="explicitLoading && !paginating">
                                <span class="data-skeleton force" :style="{width: makeRandomWidth()}"></span>
                            </div>
                            <span v-else v-text="getDimensionFieldName(dimensionField)"></span>
                    </div>
                    <div
                        class="cell metric"
                        v-for="metricData in configuration.metrics"
                        :class="{'has-relative-bar': metricData.displayRelativeBar, 'header-loading': explicitLoading && !paginating}"
                    >
                        <span v-if="explicitLoading && !paginating" class="data-skeleton force metric dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                        <span v-else v-text="metricsData[metricData.metric].label"></span>
                    </div>
                </div>

                <div class="totals" v-if="showMetricsTotalRow && loadedValue && loadedValue.length > 0" :class="{loading: explicitLoading && !paginating}">
                    <div class="cell"></div>
                    <div class="cell" v-for="dimensionField in configuration.dimension_fields"></div>
                    <div
                        class="cell metric dashboard-total-value"
                        v-for="metricData in configuration.metrics"
                        :class="{'has-relative-bar': metricData.displayRelativeBar, 'header-loading': explicitLoading && !paginating}"
                    >
                        <template v-if="metricData.displayTotals">
                            <span v-if="explicitLoading && !paginating" class="data-skeleton force metric dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                            <div class="total-container" v-else>
                                <span v-text="getMetricTotalFormatted(metricData.metric)"></span>
                                <dashboard-component-dashboard-report-diff
                                    :prevValue="getMetricTotalClean(metricData.metric, true)"
                                    :currentValue="getMetricTotalClean(metricData.metric)"
                                    :formattingOptions="getMetricIntlFormatOptions(metricData.metric)"
                                    :store="store"
                                >
                                </dashboard-component-dashboard-report-diff>
                            </div>
                        </template>
                    </div>
                </div>

                <template v-if="!explicitLoading || paginating">
                    <div class="row" v-for="record in loadedValue">
                        <a :href="record.oc_record_url" target="_blank" class="cell" :class="getRecordCssClass(paginating, record)">
                            <div class="cell-data-container">
                                <span class="cell-data" v-text="getDimensionText(record.oc_dimension_label || record.oc_dimension)"></span>
                                <span class="data-skeleton dimension dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                            </div>
                        </a>
                        <a :href="record.oc_record_url" target="_blank" class="cell" :class="getRecordCssClass(paginating, record)" v-for="dimensionField in configuration.dimension_fields">
                            <div class="cell-data-container">
                                <span class="cell-data" v-text="getDimensionFieldValue(record, dimensionField)"></span>
                                <span class="data-skeleton dimension dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                            </div>
                        </a>
                        <template
                            v-for="metricData in configuration.metrics"
                        >
                            <a :href="record.oc_record_url" target="_blank" class="cell metric relative-bar-container" :class="getRecordCssClass(paginating, record)" v-if="metricData.displayRelativeBar">
                                <span class="relative-bar" :style="getRelativeBarStyle(metricData.metric, record, metricData.color)"></span>
                            </a>
                            <a
                                :href="record.oc_record_url"
                                target="_blank"
                                class="cell metric"
                                :class="getRecordCssClass(paginating, record)"
                            >
                                <span class="metric-data-container">
                                    <span v-text="getRecordValue(metricData.metric, record)" class="cell-data"></span>
                                    <span v-if="metricData.displayTotals" class="metric-total cell-data" v-text="getRecordTotalRelativeValue(metricData.metric, record)"></span>
                                    <span class="data-skeleton metric dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                                </span>
                            </a>
                        </template>
                    </div>

                    <div class="row" v-if="loadedValue && loadedValue && !loadedValue.length">
                        <div class="cell" :style="fullWidthColumnStyle" :class="{paginating: paginating}" >
                            <div class="cell-data-container">
                                <span class="cell-data">
                                    <?= __("No records found") ?>
                                </span>
                                <span class="data-skeleton dimension dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="row" v-for="n in 3">
                        <div class="cell">
                            <span class="data-skeleton force dimension dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                        </div>
                        <div class="cell" v-for="dimensionField in configuration.dimension_fields">
                            <span class="data-skeleton force dimension dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                        </div>
                        <template v-for="metricData in configuration.metrics">
                            <div class="cell metric relative-bar-container" v-if="metricData.displayRelativeBar">
                            </div>
                            <div
                                class="cell metric"
                            >
                                <span class="data-skeleton force metric dashboard-widget-loading-pulse" :style="{width: makeRandomWidth()}"></span>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

            <div class="table-widget-pages" v-if="configuration.records_per_page">
                <template v-if="!explicitLoading">
                    <div>
                        <?= e(trans('system::lang.pagination.records')) ?> <span v-text="startRecordDisplayIndex + '-' + endRecordDisplayIndex"></span>
                        <?= e(trans('system::lang.pagination.of')) ?> <span v-text="totalRecords"></span>.
                        <?= e(trans('system::lang.pagination.page')) ?> <span v-text="currentPage+1"></span>
                        <?= e(trans('system::lang.pagination.of')) ?> <span v-text="totalPages"></span>
                    </div>
                    <button
                        class="table-pagination"
                        title="<?= e(trans('system::lang.pagination.prev_page')) ?>"
                        @click.prevent="onPrevPageClick"
                        :disabled="currentPage <= 0"
                    >
                        <i class="ph ph-arrow-left"></i>
                    </button>
                    <button
                        class="table-pagination"
                        title="<?= e(trans('system::lang.pagination.next_page')) ?>"
                        @click.prevent="onNextPageClick"
                        :disabled="currentPage+1 >= totalPages"
                    >
                        <i class="ph ph-arrow-right"></i>
                    </button>
                </template>
                <div v-else class="pagination-skeleton dashboard-widget-loading-pulse">
                    <span class="data-skeleton"></span>
                    <span class="data-skeleton"></span>
                    <span class="data-skeleton"></span>
                </div>
            </div>
        </div>

        <dashboard-component-dashboard-widget-error
            v-if="error"
            :store="store"
            @configure="$emit('configure')"
        ></dashboard-component-dashboard-widget-error>
    </div>
</div>