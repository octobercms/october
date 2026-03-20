<div data-control="toolbar loader-container">
    <?= Ui::popupButton(
        label: __("New :name", ['name' => 'Dashboard']),
        handler: 'onLoadPopupForm',
        icon: 'icon-plus',
        primary: true
    ) ?>

    <div class="toolbar-divider"></div>

    <?= Ui::ajaxButton(
        label: __("Delete"),
        handler: 'onDelete',
        icon: 'icon-delete',
        secondary: true,
        dataRequestConfirm: __("Are you sure?"),
        dataRequestMessage: __("Deleting..."),
        dataListCheckedTrigger: true,
        dataListCheckedRequest: true,
        disabled: true
    ) ?>
</div>
