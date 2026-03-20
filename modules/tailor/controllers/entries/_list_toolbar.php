<?php
    $section = $this->activeSource;
    $showExport = $section->showExport ?? true;
    $showImport = ($section->showImport ?? true) && $this->hasSourcePermission('create');
    $showResetStructure = $section instanceof \Tailor\Classes\Blueprint\StructureBlueprint;
    $hasDropdown = $showImport || $showExport || $showResetStructure;
?>
<div data-control="toolbar" data-list-linkage="<?= $this->listGetId() ?>">

    <?php if ($this->hasSourcePermission('create')): ?>
        <?= Ui::button(
            label: $section->getMessage('buttonCreate', "New :name", ['name' => e(__($section->name))]),
            href: Backend::url('tailor/entries/'.$section->handleSlug.'/create'),
            icon: 'icon-plus',
            primary: true,
            labelHtml: true
        ) ?>

        <div class="toolbar-divider"></div>
    <?php endif ?>

    <?php if ($this->hasSourcePermission('publish', 'delete')): ?>
        <div id="listBulkActions" class="btn-container">
            <?= $this->makePartial('list_bulk_actions') ?>
        </div>
    <?php endif ?>

    <?php if ($hasDropdown): ?>
        <?php Ui::dropdownButton(
            title: __("More Actions"),
            icon: 'icon-ellipsis-v',
            secondary: true,
            caret: false,
            class: 'btn-circle'
        )->slot() ?>

            <?php if ($showImport): ?>
                <?= Ui::dropdownItem(
                    label: __("Import"),
                    href: Backend::url('tailor/bulkactions/'.$section->handleSlug.'/import'),
                    icon: 'icon-upload'
                ) ?>
            <?php endif ?>
            <?php if ($showExport): ?>
                <?= Ui::dropdownItem(
                    label: __("Export"),
                    href: Backend::url('tailor/bulkactions/'.$section->handleSlug.'/export'),
                    icon: 'icon-download'
                ) ?>
            <?php endif ?>
            <?php if ($showResetStructure): ?>
                <?= Ui::dropdownItem(
                    label: __("Reset Structure"),
                    handler: 'onResetStructure',
                    icon: 'icon-set-parent',
                    dataRequestConfirm: __("Are you sure?")
                ) ?>
            <?php endif ?>

        <?php Ui::end() ?>
    <?php endif ?>
</div>
