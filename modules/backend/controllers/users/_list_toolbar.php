<div data-control="toolbar">
    <?php if (BackendAuth::userHasAccess('admins.manage.create')): ?>
        <?= Ui::button(
            label: __("New Administrator"),
            href: Backend::url('backend/users/create'),
            icon: 'oc-icon-plus',
            primary: true
        ) ?>
    <?php endif ?>
</div>
