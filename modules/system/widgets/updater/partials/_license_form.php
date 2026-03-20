<div class="onboarding-modal" data-popup-size="500">
    <div class="modal-header">
        <div class="onboarding-logo oc-logo-white mb-3"></div>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>
    <div class="modal-body">
        <div class="d-flex p-3">
            <div class="mw-400">
                <h4 class="mb-4"><?= __("Thank you for using October CMS!") ?></h4>
                <p><?= __("This is open source software, you can evaluate it freely but for any other purpose you need an active license.") ?></p>
                <p><?= __("By getting a license, you're helping with its ongoing development, which will make the platform even better!") ?></p>
                <p><?= __("Grab your license today and you'll receive a registration key that disables this prompt and confirms your support.") ?></p>
            </div>
            <div class="ps-4">
                <img
                    src="<?= Backend::skinAsset('assets/images/license-support.png') ?>"
                    width="60"
                    alt="" />
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <div class="px-3 pb-3">
            <?= Ui::button(
                label: __(System::checkProjectValid(1|16) ? "Renew License" : "Get a License"),
                href: 'https://octobercms.com/account/project/dashboard',
                class: 'btn-success btn-lg me-2'
            ) ?>
            <?= Ui::button(
                label: __("Later"),
                secondary: true,
                class: 'btn-lg',
                dataDismiss: 'popup'
            ) ?>
        </div>
    </div>
</div>
