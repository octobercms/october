<backend-popover
    ref="popover"
    container-css-class="submission-controls"
    :always-visible="true"
>
    <div class="submission-controls-popover-body">
        <p v-if="isRejected" class="submission-notice">
            <?= e(__('This submission has been rejected.')) ?>
            <span class="js-link" @click="$emit('submissionrestoreclick', $event)"><?= e(__('Restore this Submission')) ?></span>.
        </p>

        <template v-if="!isRejected">
            <div ref="enabled"></div>
            <div class="clearfix"></div>

            <div class="action-section" v-if="canDelete">
                <div class="action-item">
                    <p>
                        <i class="icon-ban"></i>
                        <span @click="$emit('submissionrejectclick', $event)"><?= e(__('Reject submission')) ?></span>
                    </p>
                </div>

                <div class="action-item">
                    <p>
                        <i class="icon-flag"></i>
                        <span @click="$emit('submissionspamclick', $event)"><?= e(__('Mark as spam')) ?></span>
                    </p>
                </div>
            </div>
        </template>
    </div>
</backend-popover>
