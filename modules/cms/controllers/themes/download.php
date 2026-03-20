<?php Block::put('breadcrumb') ?>
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?= Backend::url('cms/themes') ?>"><?= __('Themes') ?></a></li>
        <li class="breadcrumb-item active" aria-current="page"><?= e(__($this->pageTitle)) ?></li>
    </ol>
<?php Block::endPut() ?>

<?php if ($this->fatalError): ?>

    <p class="flash-message static error"><?= e($this->fatalError) ?></p>
    <p>
        <?= Ui::button(
            label: __("Return to Themes List"),
            href: Backend::url('cms/themes'),
            secondary: true
        ) ?>
    </p>

<?php endif ?>
