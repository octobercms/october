<?php
    $author = $theme->getConfigValue('author');
?>

<div class="theme-thumbnail">
    <div class="thumbnail-container"><img src="<?= $theme->getPreviewImageUrl() ?>" alt="" /></div>
</div>
<div class="theme-description">
    <h3><?= e($theme->getConfigValue('name', $theme->getDirName())) ?></h3>
    <?php if ($author): ?>
        <p class="author"><?= __('By :name', ['name' => e($author)]) ?></p>
    <?php endif ?>
    <p class="description">
        <?= e($theme->getConfigValue('description', 'The theme description is not provided.')) ?>
    </p>
    <div class="controls">

        <?php if ($theme->isActiveTheme()): ?>
            <?= Ui::button(
                label: __("Activate"),
                icon: 'icon-star',
                secondary: true,
                disabled: true
            ) ?>
        <?php elseif (BackendAuth::userHasAccess('cms.themes.activate')): ?>
            <?= Ui::ajaxButton(
                label: __("Activate"),
                handler: 'onSetActiveTheme',
                icon: 'icon-check',
                primary: true,
                dataRequestData: "theme: '".e($theme->getDirName())."'",
                dataStripeLoadIndicator: true
            ) ?>
        <?php endif ?>
        <?php if (BackendAuth::userHasAccess('cms.theme_customize') && $theme->hasCustomData()): ?>
            <?= Ui::button(
                label: __("Customize"),
                href: Backend::url('cms/themeoptions/update/'.$theme->getDirName()),
                icon: 'icon-paint-brush',
                secondary: true
            ) ?>
        <?php endif ?>

        <?php Ui::dropdownButton(
            label: __("Manage"),
            icon: 'icon-wrench',
            secondary: true
        )->slot() ?>

            <?php if (BackendAuth::userHasAccess('cms.themes.create')): ?>
                <?= Ui::dropdownItem(
                    label: __("Edit Properties"),
                    icon: 'icon-pencil',
                    dataControl: 'popup',
                    dataSize: 'huge',
                    dataHandler: 'onLoadFieldsForm',
                    dataRequestData: "theme: '".e($theme->getDirName())."'"
                ) ?>

                <?php if ($theme->hasSeedContent()): ?>
                    <?= Ui::dropdownItem(
                        label: __("Seed Content"),
                        icon: 'icon-rocket',
                        dataControl: 'popup',
                        dataHandler: 'onLoadSeedForm',
                        dataRequestData: "theme: '".e($theme->getDirName())."'"
                    ) ?>
                <?php endif ?>

                <?= Ui::dropdownItem(
                    label: __("Duplicate"),
                    icon: 'icon-copy',
                    dataControl: 'popup',
                    dataHandler: 'onLoadDuplicateForm',
                    dataRequestData: "theme: '".e($theme->getDirName())."'"
                ) ?>

                <?= Ui::dropdownItem(
                    label: __("Import"),
                    icon: 'icon-upload',
                    dataControl: 'popup',
                    dataHandler: 'onLoadImportForm',
                    dataRequestData: "theme: '".e($theme->getDirName())."'"
                ) ?>
            <?php endif ?>

            <?= Ui::dropdownItem(
                label: __("Export"),
                icon: 'icon-download',
                dataControl: 'popup',
                dataHandler: 'onLoadExportForm',
                dataRequestData: "theme: '".e($theme->getDirName())."'"
            ) ?>

            <?php if (!$theme->isActiveTheme() && BackendAuth::userHasAccess('cms.themes.delete')): ?>
                <?= Ui::dropdownDivider() ?>

                <?= Ui::dropdownItem(
                    label: __("Delete"),
                    icon: 'icon-delete',
                    handler: 'onDelete',
                    dataRequestConfirm: __("Delete this theme? It cannot be undone!"),
                    dataRequestData: "theme: '".e($theme->getDirName())."'"
                ) ?>
            <?php endif ?>

        <?php Ui::end() ?>
    </div>
</div>
