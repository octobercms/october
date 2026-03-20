<div>
    <?= Ui::ajaxButton(
        label: __("Save Changes"),
        handler: 'onSave',
        primary: true,
        hotkey: ['ctrl+s', 'cmd+s'],
        dataRequestData: "redirect: false",
        dataRequestMessage: __("Saving...")
    ) ?>

    <span class="btn-text">
        <span class="button-separator"><?= __("or") ?></span>
        <?= Ui::button(
            label: __("Cancel"),
            href: Backend::url('system/settings'),
            class: 'btn-link p-0'
        ) ?>
    </span>

    <span class="pull-right btn-text">
        <?= Ui::ajaxButton(
            label: __("Reset to Default"),
            handler: 'onResetDefault',
            class: 'btn-link p-0',
            dataRequestData: "redirect: false",
            dataRequestConfirm: __("Are you sure?"),
            dataRequestMessage: __("Resetting...")
        ) ?>
    </span>
</div>
