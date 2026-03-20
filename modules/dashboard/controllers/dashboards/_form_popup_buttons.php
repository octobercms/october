<?php
    $isPreview = $this->formGetWidget()->previewMode;
?>
<div>
    <?php if ($isPreview): ?>
        <?= Ui::button(
            label: __("Close"),
            dataDismiss: 'popup'
        ) ?>
    <?php else: ?>
        <?php if (!$this->formGetModel()->exists): ?>
            <?= Ui::ajaxButton(
                label: __("Create"),
                handler: 'onPopupSave',
                primary: true,
                hotkey: ['ctrl+s', 'cmd+s'],
                dataRequestData: "redirect: false",
                dataPopupLoadIndicator: true
            ) ?>
        <?php else: ?>
            <?= Ui::ajaxButton(
                label: __("Save"),
                handler: 'onPopupSave',
                primary: true,
                hotkey: ['ctrl+s', 'cmd+s'],
                dataRequestData: "redirect: false",
                dataPopupLoadIndicator: true
            ) ?>

            <?php if ($formModel->is_system): ?>
                <?= Ui::ajaxButton(
                    label: __("Reset to Default"),
                    handler: 'onResetDefault',
                    class: 'btn-link p-0 pull-right mt-3',
                    dataRequestConfirm: __("Are you sure?"),
                    dataPopupLoadIndicator: true
                ) ?>
            <?php else: ?>
                <?= Ui::ajaxButton(
                    label: __("Delete"),
                    handler: 'onPopupDelete',
                    class: 'btn-danger pull-right',
                    icon: 'icon-delete',
                    dataRequestConfirm: __("Delete this record?"),
                    dataPopupLoadIndicator: true
                ) ?>
            <?php endif ?>
        <?php endif ?>

        <span class="btn-text">
            <span class="button-separator"><?= __("or") ?></span>
            <?= Ui::ajaxButton(
                label: __("Cancel"),
                handler: 'onPopupCancel',
                class: 'btn-link p-0',
                dataBrowserRedirectBack: true,
                dataRequestData: "close: true",
                dataDismiss: 'popup'
            ) ?>
        </span>
    <?php endif ?>
</div>
