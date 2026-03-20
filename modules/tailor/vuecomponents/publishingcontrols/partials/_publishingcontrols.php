<backend-popover
    ref="popover"
    container-css-class="publishing-controls"
    :always-visible="true"
    @shown="onShown"
>
    <div class="publishing-controls-popover-body">
        <div ref="parentId"></div>
        <div class="slug-section">
            <span class="label-link text-muted" v-if="showTreeControls && !showFullSlug" @click.stop="onShowFullSlugClick"><?= e(__('View full slug')) ?></span>
            <div ref="slug" class="clearfix"></div>
            <span class="full-slug text-muted" v-text="fullSlug" v-if="showTreeControls && showFullSlug"></span>
        </div>
        <div ref="enabled"></div>
        <div class="clearfix"></div>

        <p v-if="isDraft" class="publish-notice">
            <?= e(__('Drafts are not visible on the website until they are applied.')) ?>
            <span class="js-link" @click="$emit('publishdraftclick', $event)"><?= e(__('Apply this Draft')) ?></span>.
        </p>

        <p v-if="isDeleted" class="publish-notice">
            <?= e(__('This record is not visible because it has been deleted.')) ?>
            <span class="js-link" @click="$emit('restorerecordclick', $event)"><?= e(__('Restore this Record')) ?></span>.
        </p>

        <div class="enabled-controls" v-show="state.current.enabled">
            <div class="date-section">
                <p v-show="!showPublishDate">
                    <i class="icon-calendar-check"></i>
                    <span @click="onShowPublishDateClick"><?= e(__('Schedule publish date')) ?></span>
                </p>

                <span class="label-link text-muted" v-if="showPublishDate" @click.stop="onRemovePublishDateClick"><?= e(__('Remove')) ?></span>
                <div v-show="showPublishDate" ref="publishDate"></div>
                <div class="clearfix"></div>
            </div>

            <div class="date-section">
                <p v-show="!showExpiryDate">
                    <i class="icon-calendar-disable"></i>
                    <span @click="onShowExpiryDateClick"><?= e(__('Set expiry date')) ?></span>
                </p>

                <span class="label-link text-muted" v-if="showExpiryDate" @click.stop="onRemoveExpiryDateClick"><?= e(__('Remove')) ?></span>
                <div v-show="showExpiryDate" ref="expiryDate"></div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</backend-popover>
