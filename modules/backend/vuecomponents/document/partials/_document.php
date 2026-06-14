<div
    class="component-backend-document d-flex flex-column"
    :class="cssClass"
>
    <transition name="document-fade-in">
        <template v-if="!loading && !errorLoadingDocument">
            <transition name="document-header-fade">
                <div class="document-header-container flex-shrink-0" v-show="!headerCollapsed">
                    <slot name="header"></slot>
                </div>
            </transition>
        </template>
    </transition>

    <transition name="document-fade-in">
        <div v-if="!loading && !errorLoadingDocument" class="document-toolbar-container flex-shrink-0">
            <slot name="toolbar"></slot>
        </div>
    </transition>

    <div v-if="!loading && !errorLoadingDocument" class="flex-shrink-0">
        <slot name="drawer"></slot>
    </div>

    <transition name="document-fade-in">
        <div v-if="!loading && !errorLoadingDocument" class="document-content-container flex-fill position-relative">
            <slot name="content"></slot>

            <transition name="processing-fade-in">
                <backend-loading-indicator
                    v-if="processing"
                    indicator-style="stripe"
                    css-class="document-progress-indicator"
                ></backend-loading-indicator>
            </transition>
        </div>
    </transition>

    <div v-if="loading" class="flex-fill d-flex align-items-center justify-content-center">
        <backend-loading-indicator
            size="small"
        ></backend-loading-indicator>
    </div>

    <transition name="processing-fade-in">
        <div v-if="errorLoadingDocument" class="flex-fill d-flex align-items-center justify-content-center">
            <div class="document-loading-error backend-icon-background-pseudo">
                <h3 v-text="errorLoadingDocumentHeader"></h3>
                <p v-text="errorLoadingDocument"></p>
            </div>
        </div>
    </transition>
</div>
