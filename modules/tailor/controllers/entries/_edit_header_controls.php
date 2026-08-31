<div data-control="vue-entry-header-controls">
    <div data-vue-template>
        <div class="record-management-controls">
            <?php if ($initialState['showEntryTypeSelector']): ?>
                <backend-dropdown-menu-button
                    :menuitems="state.entryTypeOptions"
                    preferable-menu-position="bottom-right"
                    css-class="record-management-button has-menu entry-type-selector"
                    :current-label-command="state.initial.contentGroup"
                    :disabled="state.toolbarDisabled"
                    @command="onSetEntryType"
                ></backend-dropdown-menu-button>
            <?php endif ?>

            <tailor-component-publishbutton
                @click="onPublishingControlsBtnClick"
                :state="state"
            ></tailor-component-publishbutton>
        </div>

<?php if ($initialState['isSubmission']): ?>
        <tailor-component-submissioncontrols
            :entry-state="state"
            model-name="<?= class_basename($formModel) ?>"
            ref="publishingControls"
            @statechanged="onPublishingStateChanged"
            @submissionrejectclick="onSubmissionRejectClick"
            @submissionspamclick="onSubmissionSpamClick"
            @submissionrestoreclick="onRestoreRecordClick"
        ></tailor-component-submissioncontrols>
<?php else: ?>
        <tailor-component-publishingcontrols
            :lang="state.lang"
            :entry-state="state"
            model-name="<?= class_basename($formModel) ?>"
            ref="publishingControls"
            @statechanged="onPublishingStateChanged"
            @publishdraftclick="onPublishDraftClick"
            @restorerecordclick="onRestoreRecordClick"
        ></tailor-component-publishingcontrols>
<?php endif ?>
    </div>
</div>
