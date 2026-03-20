
<div class="field-action">
    <div class="row">
        <div class="col-md-8">
            <h5><?= __("View As Role") ?></h5>
            <p><?= __("This lets you test the actions this role can perform.") ?></p>
        </div>
        <div class="col-md-4">
            <div class="field-action-button">
                <?= Ui::ajaxButton(
                    label: __("View As Role"),
                    handler: 'onImpersonateRole',
                    secondary: true,
                    dataStripeLoadIndicator: true
                ) ?>
            </div>
        </div>
    </div>
</div>
