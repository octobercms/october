<div id="checkUpdatesPopup">
    <?= Form::open(['id' => 'updateForm']) ?>
        <div class="modal-header">
            <h4 class="modal-title"><?= e(__('Software Update')) ?></h4>
            <button type="button" class="btn-close" data-dismiss="popup"></button>
        </div>

        <div id="updateContainer">
            <div class="modal-body">

                <div class="loading-indicator-container mb-3">
                    <p>&nbsp;</p>
                    <div class="loading-indicator is-transparent">
                        <div><?= e(trans('system::lang.updates.update_loading')) ?></div>
                        <span></span>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <?= Ui::button(
                    label: __("Cancel"),
                    secondary: true,
                    dataDismiss: 'popup'
                ) ?>
            </div>
        </div>

    <?= Form::close() ?>
</div>

<script>
    $('#checkUpdatesPopup').on('popupComplete', function() {
        $.oc.updater.check();
    });
</script>
