<div data-control="toolbar">
    <?= Ui::ajaxButton(
        label: __("Refresh"),
        handler: 'onRefresh',
        icon: 'oc-icon-refresh',
        primary: true,
        dataRequestMessage: __("Updating...")
    ) ?>
</div>
