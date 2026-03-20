<div
    class="dashboard-report-widget-indicator"
    :class="{'loading': explicitLoading}"
>
    <div class="indicator-body" :class="{'dashboard-widget-loading-pulse': explicitLoading && isConfigured}">
        <dashboard-component-dashboard-widget-error
            v-if="error"
            :store="store"
            @configure="$emit('configure')"
        ></dashboard-component-dashboard-widget-error>

        <template v-if="!error">
            <div class="indicator-icon" :class="iconStatusClass">
                <i :class="widget.configuration.icon"></i>
                <span v-if="complicationClass" class="icon-complication" :class="complicationClass"></span>
            </div>
            <div class="indicator-details">
                <h3 class="widget-title">
                    <span v-if="explicitLoading">&nbsp;</span>
                    <span v-else v-text="widget.configuration.title"></span>
                </h3>
                <p :class="{'total-container align-left': !explicitLoading}">
                    <span v-if="explicitLoading">&nbsp;</span>
                    <template v-else>
                        <span v-text="valueText"></span>
                        <template v-if="prevPeriodDiff !== null">
                            <span
                                title="<?= __("Difference with the previous period") ?>"
                                class="prev-period-marker"
                                :class="{'negative': prevPeriodDiff < 0, 'neutral': prevPeriodDiff === 0}"
                            >
                                <i class="ph ph-arrow-up" v-if="prevPeriodDiff > 0"></i>
                                <i class="ph ph-arrow-down" v-if="prevPeriodDiff < 0"></i>
                                <span
                                    v-text="prevPeriodDiffFormattedAbs"
                                    v-bind:aria-label="prevPeriodDiffFormatted"
                                ></span>
                            </span>
                        </template>
                    </template>
                </p>
            </div>
        </template>
    </div>
    <template v-if="widget.configuration.linkText && !error">
        <div class="indicator-link-container" v-if="linkEnabled">
            <a
                class="indicator-link"
                draggable="false"
                v-if="!loadingPopupData"
                :href="linkHrefProcessed"
                @click="onLinkClick"
            >
                <span v-if="explicitLoading" class="dashboard-widget-loading-pulse">&nbsp;</span>
                <span v-else v-text="widget.configuration.linkText"></span>
            </a>
            <backend-loading-indicator
                v-else
                size="tiny"
            ></backend-loading-indicator>
        </div>
        <div
            class="indicator-link-container disabled"
            v-else
        >
            <span v-if="explicitLoading" class="dashboard-widget-loading-pulse">&nbsp;</span>
            <span v-else v-text="widget.configuration.linkText"></span>
        </div>
    </template>
</div>
