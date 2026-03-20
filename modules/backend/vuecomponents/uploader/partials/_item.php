<li :class="cssClass">
    <span class="item-name" v-text="fileName"></span>
    <span class="item-error" v-if="errorMessage" v-text="errorMessage"></span>

    <i
        class="backend-icon-background"
        v-if="status == 'completed'"
    ></i>

    <template
        v-if="status == 'uploading'"
    >
        <backend-loading-indicator
            indicator-style="bar"
            :progress="progress"
        ></backend-loading-indicator>

        <button
            @click.prevent="$emit('removeclick')"
            type="button"
            class="close backend-icon-background-pseudo"
            tabindex="0"
            ><span aria-hidden="true">&times;</span>
        </button>
    </template>
</li>