<div>
    <?php if (!$this->formGetModel()->exists): ?>
        <?= Ui::ajaxButton(
            label: __("Create"),
            handler: 'onSave',
            primary: true,
            hotkey: ['ctrl+s', 'cmd+s'],
            dataRequestMessage: __("Creating :name...", ['name' => $formRecordName])
        ) ?>

        <?= Ui::ajaxButton(
            label: __("Create & Close"),
            handler: 'onSave',
            secondary: true,
            hotkey: ['ctrl+enter', 'cmd+enter'],
            dataBrowserRedirectBack: true,
            dataRequestData: "close: true",
            dataRequestMessage: __("Creating :name...", ['name' => $formRecordName])
        ) ?>
    <?php else: ?>
        <?= Ui::ajaxButton(
            label: __("Save"),
            handler: 'onSave',
            primary: true,
            hotkey: ['ctrl+s', 'cmd+s'],
            dataRequestData: "redirect: false",
            dataRequestMessage: __("Saving :name...", ['name' => $formRecordName])
        ) ?>

        <?= Ui::ajaxButton(
            label: __("Save & Close"),
            handler: 'onSave',
            secondary: true,
            hotkey: ['ctrl+enter', 'cmd+enter'],
            dataBrowserRedirectBack: true,
            dataRequestData: "close: true",
            dataRequestMessage: __("Saving :name...", ['name' => $formRecordName])
        ) ?>

        <?php if (!$formModel->is_primary): ?>
            <?= Ui::iconButton(
                label: __("Delete"),
                icon: 'icon-delete',
                handler: 'onDelete',
                danger: true,
                hotkey: ['shift+option+d'],
                class: 'pull-right',
                dataBrowserRedirectBack: true,
                dataRequestConfirm: __("Delete this record?"),
                dataRequestMessage: __("Deleting :name...", ['name' => $formRecordName])
            ) ?>
        <?php endif ?>
    <?php endif ?>

    <span class="btn-text">
        <span class="button-separator"><?= __("or") ?></span>
        <?= Ui::ajaxButton(
            label: __("Cancel"),
            handler: 'onCancel',
            hotkey: ['shift+option+c'],
            href: 'javascript:;',
            class: 'btn-link p-0',
            dataBrowserRedirectBack: true,
            dataRequestData: "close: true",
            dataRequestMessage: __("Loading...")
        ) ?>
    </span>
</div>
