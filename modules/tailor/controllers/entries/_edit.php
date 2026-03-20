<?php if (!$this->fatalError): ?>
    <?= Form::open(['id' => 'tailor-form', 'class' => 'position-relative h-100', 'data-change-monitor' => true]) ?>
        <div class="position-relative h-100" data-control="vue-app">
            <div class="padded-container d-flex flex-column h-100 form-document-layout">
                <div class="document-header">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <?= $this->formRender([
                                'section' => 'outside',
                                'preview' => $initialState['isDeleted']
                            ]) ?>
                        </div>
                        <div>
                            <?= $this->makePartial('edit_header_controls', ['model' => $formModel]) ?>
                        </div>
                    </div>
                </div>

                <div data-control="vue-entry-document">
                    <div class="padded-container-inset" data-vue-template>
                        <template>
                            <backend-document
                                :processing="state.processing"
                                :toolbar-command-event-bus="state.eventBus">
                                <template v-slot:toolbar>
                                    <backend-document-toolbar
                                        :elements="state.toolbarElements"
                                        @command="onCommand"
                                        :disabled="state.toolbarDisabled"
                                    ></backend-document-toolbar>
                                </template>
                                <template v-slot:drawer>
                                    <tailor-component-draftnotes
                                        v-if="state.showDraftNotesUI"
                                        v-show="state.showDraftNotes"
                                        ref="draftNotes"
                                        :state="state">
                                    </tailor-component-draftnotes>
                                </template>
                            </backend-document>
                        </template>
                    </div>

                    <div style="display:none">
                        <?php if (!$initialState['isDeleted']): ?>
                            <?= $this->formRenderSecondaryTabs() ?>
                        <?php endif ?>
                    </div>
                </div>

                <div class="flex-grow-1" id="entryPrimaryTabs">
                    <?= $this->makePartial('primary_tabs') ?>
                </div>
            </div>

            <script type="text/template" data-vue-state="initial"><?= json_encode($initialState) ?></script>
            <script type="text/template" data-vue-lang><?= json_encode($langState) ?></script>
        </div>
    <?= Form::close() ?>
<?php else: ?>
    <div class="padded-container">
        <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>

        <p><?= Ui::button()->label('Return to Entries')->linkTo('tailor/entries') ?></p>
    </div>
<?php endif ?>
