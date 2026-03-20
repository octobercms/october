<div data-control="toolbar">
    <?= Ui::button(
        label: __("Create Site"),
        href: Backend::url('system/sites/create'),
        icon: 'oc-icon-plus',
        primary: true
    ) ?>
    <?= Ui::button(
        label: __("Manage Site Groups"),
        href: Backend::url('system/sitegroups'),
        icon: 'oc-icon-clone',
        secondary: true
    ) ?>
</div>
