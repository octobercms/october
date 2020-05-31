<?php if ($this->user->hasAccess('backend.manage_users')): ?>
    <?php Block::put('breadcrumb') ?>
        <ul>
            <li><a href="<?= Backend::url('backend/users') ?>"><?= e(trans('backend::lang.user.menu_label')) ?></a></li>
            <li><?= e(trans($this->pageTitle)) ?></li>
        </ul>
    <?php Block::endPut() ?>
<?php endif ?>

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
                    <?php if ($this->user->hasAccess('backend.manage_users')): ?>
                        <button
                            type="button"
                            data-request="onSave"
                            data-browser-validate
                            data-request-data="close:1"
                            data-hotkey="ctrl+enter, cmd+enter"
                            data-load-indicator="<?= e(trans('backend::lang.form.saving')) ?>"
                            class="btn btn-default">
                            <?= e(trans('backend::lang.form.save_and_close')) ?>
                        </button>
                    <?php endif ?>
                </div>
            </div>

        </div>
    <?php Block::endPut() ?>

    <?php Block::put('form-sidebar') ?>
        <div class="hide-tabs"><?= $this->formRenderSecondaryTabs() ?></div>
    <?php Block::endPut() ?>

    <?php Block::put('body') ?>
        <?= Form::open(['class'=>'layout stretch']) ?>
            <?= $this->makeLayout('form-with-sidebar') ?>
        <?= Form::close() ?>
    <?php Block::endPut() ?>

<?php else: ?>
    <div class="control-breadcrumb">
        <?= Block::placeholder('breadcrumb') ?>
    </div>
    <div class="padded-container">
        <p class="flash-message static error"><?= e(trans($this->fatalError)) ?></p>
        <p><a href="<?= Backend::url('backend/users') ?>" class="btn btn-default"><?= e(trans('backend::lang.user.return')) ?></a></p>
    </div>
<?php endif ?>