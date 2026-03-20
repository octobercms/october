<span
    v-if="prevValue !== null"
    title="<?= __("Difference with the previous period") ?>"
    class="prev-period-marker"
    :class="{'negative': diff < 0, 'neutral': diff === 0}"
>
    <i class="ph ph-arrow-up" v-if="diff > 0"></i>
    <i class="ph ph-arrow-down" v-if="diff < 0"></i>
    <span
        v-text="diffFormattedAbs"
        v-bind:aria-label="diffFormatted"
    ></span>
</span>
