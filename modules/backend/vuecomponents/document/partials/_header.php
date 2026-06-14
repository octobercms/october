<div class="document-header" :class="{'has-document-icon': documentIcon, 'has-close-icon': showCloseIcon}">
    <span
        v-if="documentIcon"
        class="document-icon"
        v-bind:style="documentIconStyle"
    >
        <i :class="documentIcon.cssClass"></i>
    </span>

    <input type="text" ref="titleInput" class="header-title" v-model="data[titleProperty]" v-bind:disabled="disabled || disableTitleEditor" @input="onTitleInput"></input>

    <div class="d-flex flex-row" v-if="subtitleProperty" v-show="!hideSubtitleEditor">
        <div class="flex-shrink-0 align-self-center subtitle-label" v-text="subtitleLabel + ':'"></div>
        <input
            type="text"
            class="header-subtitle flex-fill"
            v-model="data[subtitleProperty]"
            v-bind:disabled="disabled"
            @input="onSubtitleInput"
        ></input>
    </div>

    <button
        v-if="showCloseIcon"
        class="close close-icon backend-icon-background-pseudo"
        @click="$emit('documentcloseclick')"
    >
        <span aria-hidden="true">×</span>
    </button>
</div>