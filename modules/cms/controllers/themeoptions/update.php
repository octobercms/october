<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('cms/themes') ?>"><?= __('Themes') ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?php if ($hasCustomData): ?>
        <?= Form::open(['class'=>'layout']) ?>

            <div class="layout-row">
                <?= $this->formRender() ?>
            </div>

            <div class="form-buttons">
                <div data-control="loader-container" class="control-loader-container">
                    <?= Ui::ajaxButton(
                        label: __("Save"),
                        handler: 'onSave',
                        primary: true,
                        hotkey: ['ctrl+s', 'cmd+s'],
                        dataRequestData: "redirect: false",
                        dataRequestMessage: __("Saving Theme...")
                    ) ?>
                    <?= Ui::ajaxButton(
                        label: __("Save & Close"),
                        handler: 'onSave',
                        secondary: true,
                        hotkey: ['ctrl+enter', 'cmd+enter'],
                        dataBrowserRedirectBack: true,
                        dataRequestData: "close: true",
                        dataRequestMessage: __("Saving Theme...")
                    ) ?>

                    <span class="btn-text">
                        <span class="button-separator"><?= __("or") ?></span>
                        <?= Ui::ajaxButton(
                            label: __("Cancel"),
                            handler: 'onCancel',
                            hotkey: ['shift+option+c'],
                            href: 'javascript:;',
                            class: 'btn-link p-0',
                            dataBrowserRedirectBack: true,
                            dataRequestData: "close: true",
                            dataRequestMessage: __("Loading...")
                        ) ?>
                    </span>

                    <?= Ui::ajaxButton(
                        label: __("Reset to Default"),
                        handler: 'onResetDefault',
                        class: 'btn-danger pull-right',
                        dataRequestConfirm: __("Are you sure?"),
                        dataRequestMessage: __("Resetting...")
                    ) ?>
                </div>
            </div>

        <?= Form::close() ?>

    <?php else: ?>
        <div class="callout callout-info no-title">
            <div class="content">
                <p>There are no theme options available to customize.</p>
            </div>
        </div>
    <?php endif ?>

<?php else: ?>

    <p class="flash-message static error"><?= e($this->fatalError) ?></p>
    <p>
        <?= Ui::button(
            label: __("Return to Themes List"),
            href: Backend::url('cms/themes'),
            secondary: true
        ) ?>
    </p>

<?php endif ?>
