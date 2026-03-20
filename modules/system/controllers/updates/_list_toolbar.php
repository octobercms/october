<div data-control="toolbar">
    <?php if (!$projectDetails): ?>
        <?= Ui::popupButton(
            label: __("Register Software"),
            handler: 'onLoadProjectForm',
            icon: 'icon-bolt',
            primary: true
        ) ?>
    <?php else: ?>
        <?= Ui::popupButton(
            label: __("Check For Updates"),
            handler: $this->updaterWidget->getEventHandler('onLoadUpdates'),
            icon: 'icon-refresh',
            primary: true
        ) ?>
    <?php endif ?>
        <?= Ui::button(
            label: __("Install Packages"),
            href: Backend::url('system/market'),
            icon: 'icon-plus',
            secondary: true
        ) ?>
    <?php if (System::hasModule('Cms')): ?>
        <?= Ui::button(
            label: __("Manage Themes"),
            href: Backend::url('cms/themes'),
            icon: 'icon-image',
            secondary: true
        ) ?>
    <?php endif ?>
        <?= Ui::button(
            label: __("Manage Plugins"),
            href: Backend::url('system/updates/manage'),
            icon: 'icon-puzzle-piece',
            secondary: true
        ) ?>
</div>
