<div data-control="toolbar">
    <?= Ui::ajaxButton(
        label: __("Refresh"),
        handler: 'onRefresh',
        icon: 'oc-icon-refresh',
        primary: true,
        dataRequestMessage: __("Updating...")
    ) ?>
    <?= Ui::ajaxButton(
        label: __("Empty Request Log"),
        handler: 'onEmptyLog',
        icon: 'oc-icon-eraser',
        secondary: true,
        dataRequestConfirm: __("Are you sure?"),
        dataRequestMessage: __("Emptying log...")
    ) ?>

    <div class="toolbar-divider"></div>

    <?= Ui::ajaxButton(
        label: __("Delete Selected"),
        handler: 'onDelete',
        icon: 'oc-icon-delete',
        secondary: true,
        dataListCheckedTrigger: true,
        dataListCheckedRequest: true,
        dataStripeLoadIndicator: true
    ) ?>
</div>
