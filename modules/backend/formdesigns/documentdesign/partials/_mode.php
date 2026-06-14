<?php
    $formPreviewMode = $this->formGetContext() === 'preview';
    $formHasSecondaryTabs = $this->formHasSecondaryTabs();
    $formSecondaryLabel = $this->getDesignSecondaryLabel();
    $formInitialState = [
        'isPreviewMode' => $formPreviewMode,
        'isCreateAction' => $this->formGetContext() === 'create',
    ];
?>
<?= Form::open(['class' => 'position-relative h-100', 'data-change-monitor' => true]) ?>
    <div class="position-relative h-100" data-control="vue-app">
        <div class="padded-container d-flex flex-column h-100 form-document-layout">
            <div class="document-header">
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <?= $this->formRender([
                            'section' => 'outside',
                            'preview' => $formPreviewMode
                        ]) ?>
                    </div>
                    <div>
                        <?= Block::placeholder('form-document-header-controls') ?>
                        <?php if ($formHasSecondaryTabs): ?>
                            <div class="record-management-controls">
                                <button
                                    type="button"
                                    class="record-management-button has-menu"
                                    data-document-secondary-toggle
                                >
                                    <?= e($formSecondaryLabel) ?>
                                </button>
                            </div>
                        <?php endif ?>
                    </div>
                </div>
            </div>

            <div data-control="vue-document-form">
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
                                <?= Block::placeholder('form-document-drawer') ?>
                            </template>
                        </backend-document>
                        <?php if ($formHasSecondaryTabs): ?>
                            <backend-popover
                                ref="secondaryPopover"
                                container-css-class="document-secondary-popover"
                                :always-visible="true"
                            >
                                <div ref="secondaryContent"></div>
                            </backend-popover>
                        <?php endif ?>
                    </template>
                </div>

                <?php if ($formHasSecondaryTabs): ?>
                    <div style="display:none" data-document-secondary-tabs>
                        <?= $this->formRenderSecondaryTabs() ?>
                    </div>
                <?php endif ?>

                <?php if (!$formPreviewMode): ?>
                    <div style="display:none" data-document-form-buttons>
                        <?= $this->formRenderDesignButtons() ?>
                    </div>
                <?php endif ?>
            </div>

            <div class="flex-grow-1 d-flex flex-column form-document-primary" id="<?= $this->formGetId('primaryTabs') ?>">
                <div class="flex-grow-1 d-flex flex-column form-section-stretch primary-tabs-container">
                    <?= $this->formRenderPrimaryTabs() ?>
                </div>
            </div>
        </div>

        <?php if (Block::has('form-document-vue-state')): ?>
            <?= Block::placeholder('form-document-vue-state') ?>
        <?php else: ?>
            <script type="text/template" data-vue-state="initial"><?= json_encode($formInitialState) ?></script>
        <?php endif ?>
    </div>
<?= Form::close() ?>
