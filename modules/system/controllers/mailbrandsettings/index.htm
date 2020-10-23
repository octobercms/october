<?php Block::put('breadcrumb') ?>
    <ul>
        <li><?= e(trans($this->pageTitle)) ?></li>
    </ul>
<?php Block::endPut() ?>

<?php if (!$this->fatalError): ?>

    <?php Block::put('form-contents') ?>
        <div class="layout">

            <div class="layout-row">
                <?= $this->formRenderOutsideFields() ?>
                <?= $this->formRenderPrimaryTabs() ?>
            </div>

            <div class="form-buttons">
                <div class="loading-indicator-container">
                    <button
                        type="submit"
                        data-request="onSave"
                        data-browser-validate
                        data-request-data="redirect:0"
                        data-hotkey="ctrl+s, cmd+s"
                        data-load-indicator="<?= e(trans('backend::lang.form.saving')) ?>"
                        class="btn btn-primary">
                        <?= e(trans('backend::lang.form.save')) ?>
                    </button>
                    <span class="btn-text">
                        <?= e(trans('backend::lang.form.or')) ?> <a href="<?= Backend::url('backend/users') ?>"><?= e(trans('backend::lang.form.cancel')) ?></a>
                    </span>
                    <button
                        type="button"
                        class="btn btn-danger pull-right"
                        data-request="onResetDefault"
                        data-load-indicator="<?= e(trans('backend::lang.form.resetting')) ?>"
                        data-request-confirm="<?= e(trans('backend::lang.form.action_confirm')) ?>">
                        <?= e(trans('backend::lang.form.reset_default')) ?>
                    </button>
                </div>
            </div>

        </div>
    <?php Block::endPut() ?>

    <?php Block::put('form-sidebar') ?>
        <div class="hide-tabs"><?= $this->formRenderSecondaryTabs() ?></div>
    <?php Block::endPut() ?>

    <?php Block::put('body') ?>
        <?= Form::open(['id' => 'brandSettingsForm', 'class'=>'layout stretch']) ?>
            <?= $this->makeLayout('form-with-sidebar') ?>
        <?= Form::close() ?>
    <?php Block::endPut() ?>

<?php else: ?>

    <p class="flash-message static error"><?= e(trans($this->fatalError)) ?></p>
    <p><a href="<?= Backend::url('system/mailtemplates') ?>" class="btn btn-default"><?= e(trans('system::lang.mail_templates.return')) ?></a></p>

<?php endif ?>
