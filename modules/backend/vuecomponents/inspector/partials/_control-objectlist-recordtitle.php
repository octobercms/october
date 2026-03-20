<div class="title-container">
    <backend-loading-indicator v-if="loadingDynamicTitle"
        size="tiny"
    ></backend-loading-indicator>
    <template v-else>
        <span class="record-color" v-if="recordColor" :style="{'background-color': recordColor}"></span>
        <span v-text="recordTitle"></span>
    </template>
</div>