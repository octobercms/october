<div id="plugin-toolbar">
    <div data-control="toolbar">
        <?= Ui::button(
            label: __("Return to Software Updates"),
            href: Backend::url('system/updates'),
            icon: 'oc-icon-chevron-left',
            secondary: true
        ) ?>

        <?php Ui::dropdownButton(
            label: __("Select Action..."),
            secondary: true,
            dataListCheckedTrigger: true
        )->slot() ?>

            <?= Ui::dropdownItem(
                label: __("Disable Plugins"),
                icon: 'icon-ban',
                handler: 'onBulkAction',
                dataRequestData: "action: 'disable'",
                dataListCheckedRequest: true,
                dataRequestConfirm: __("Are you sure you want to :action these plugins?", ['action' => __("disable")]),
                dataStripeLoadIndicator: true
            ) ?>

            <?= Ui::dropdownItem(
                label: __("Enable Plugins"),
                icon: 'icon-check',
                handler: 'onBulkAction',
                dataRequestData: "action: 'enable'",
                dataListCheckedRequest: true,
                dataRequestConfirm: __("Are you sure you want to :action these plugins?", ['action' => __("enable")]),
                dataStripeLoadIndicator: true
            ) ?>

            <?php if ($canUpdate): ?>
                <?= Ui::dropdownDivider() ?>

                <?= Ui::dropdownItem(
                    label: __("Reset Plugin Data"),
                    icon: 'icon-bomb',
                    handler: 'onBulkAction',
                    dataRequestData: "action: 'refresh'",
                    dataListCheckedRequest: true,
                    dataRequestConfirm: __("Are you sure you want to reset the selected plugins? This will reset each plugin's data, restoring it to the initial install state."),
                    dataStripeLoadIndicator: true
                ) ?>
            <?php endif ?>

        <?php Ui::end() ?>

        <?= Ui::ajaxButton(
            label: __("Clear Cache"),
            handler: 'onClearCache',
            icon: 'oc-icon-refresh',
            secondary: true,
            dataRequestConfirm: __("Are you sure you want to clear the application cache?"),
            dataStripeLoadIndicator: true
        ) ?>

        <?= Ui::popupButton(
            label: __("Edit Composer"),
            handler: 'onLoadComposerForm',
            icon: 'icon-code',
            secondary: true
        ) ?>
    </div>
</div>
