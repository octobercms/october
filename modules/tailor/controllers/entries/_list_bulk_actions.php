<?php
    $statusCode = $this->listGetFilterWidget()->getScope('status_code')->value;
?>
<?php if ($statusCode === 'deleted'): ?>
    <?php if ($this->hasSourcePermission('delete')): ?>
        <?= Ui::ajaxButton(
            label: __("Restore"),
            handler: 'onBulkAction',
            icon: 'icon-refresh',
            secondary: true,
            dataRequestData: "action: 'restore'",
            dataRequestConfirm: __("Are you sure?"),
            dataListCheckedTrigger: true,
            dataListCheckedRequest: true,
            dataStripeLoadIndicator: true
        ) ?>

        <?= Ui::ajaxButton(
            label: __("Delete Forever"),
            handler: 'onBulkAction',
            icon: 'icon-delete',
            secondary: true,
            dataRequestData: "action: 'forceDelete'",
            dataRequestConfirm: __("Are you sure?"),
            dataListCheckedTrigger: true,
            dataListCheckedRequest: true,
            dataStripeLoadIndicator: true
        ) ?>
    <?php endif ?>
<?php else: ?>
    <?php if ($this->hasSourcePermission('publish')): ?>
        <?php Ui::dropdownButton(
            label: __("Change Status"),
            icon: 'oc-icon-angle-down',
            secondary: true,
            dataListCheckedTrigger: true
        )->slot() ?>

            <?= Ui::dropdownItem(
                label: __("Enable"),
                handler: 'onBulkAction',
                icon: 'icon-check',
                dataRequestData: "action: 'enable'",
                dataRequestConfirm: __("Are you sure?"),
                dataListCheckedRequest: true
            ) ?>

            <?= Ui::dropdownItem(
                label: __("Disable"),
                handler: 'onBulkAction',
                icon: 'icon-ban',
                dataRequestData: "action: 'disable'",
                dataRequestConfirm: __("Are you sure?"),
                dataListCheckedRequest: true
            ) ?>

        <?php Ui::end() ?>

        <?= Ui::ajaxButton(
            label: __("Duplicate"),
            handler: 'onBulkAction',
            icon: 'icon-copy',
            secondary: true,
            dataRequestData: "action: 'duplicate'",
            dataRequestConfirm: __("Are you sure?"),
            dataListCheckedTrigger: true,
            dataListCheckedRequest: true,
            dataStripeLoadIndicator: true
        ) ?>
    <?php endif ?>
    <?php if ($this->hasSourcePermission('delete')): ?>
        <?= Ui::ajaxButton(
            label: __("Delete"),
            handler: 'onBulkAction',
            icon: 'icon-delete',
            secondary: true,
            dataRequestData: "action: 'delete'",
            dataRequestConfirm: __("Are you sure?"),
            dataListCheckedTrigger: true,
            dataListCheckedRequest: true,
            dataStripeLoadIndicator: true
        ) ?>
    <?php endif ?>
<?php endif ?>
