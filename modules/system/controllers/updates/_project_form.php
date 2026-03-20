<?= Form::open([
    'id' => 'projectForm',
    'class' => 'onboarding-modal',
    'data-popup-size' => 500
]) ?>
    <div class="modal-header">
        <div class="onboarding-logo oc-logo-white mb-3"></div>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>
    <div class="modal-body">
        <div class="px-3 pt-3">
            <h4 class="mb-4"><?= __("Register Software") ?></h4>
            <p class="pb-2">A project with a license key is required if you want to install or update modules, plugins and themes via the October CMS gateway.</p>

            <?php if ($this->fatalError): ?>
                <p class="flash-message static error"><?= e($fatalError) ?></p>
            <?php endif ?>

            <div class="form-group">
                <span class="form-text pull-right">
                    <a target="_blank" href="https://octobercms.com/help/site/projects#project-id"><?= __('How to find your License Key') ?></a>
                </span>
                <label class="form-label" for="projectId"><?= __('License Key') ?></label>
                <input
                    name="project_id"
                    type="text"
                    class="form-control form-control-lg"
                    id="projectId"
                    value="<?= e(post('project_id')) ?>"
                    autocomplete="off" />
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <div class="px-3 pb-3">
            <?= Ui::ajaxButton(
                label: __("Attach to Project"),
                handler: 'onAttachProject',
                primary: true,
                class: 'btn-lg me-2',
                dataPopupLoadIndicator: true
            ) ?>
            <?= Ui::button(
                label: __("Cancel"),
                secondary: true,
                class: 'btn-lg',
                dataDismiss: 'popup'
            ) ?>
        </div>
    </div>
    <script>
        setTimeout(
            function(){ $('#projectId').select() },
            310
        )
    </script>
<?= Form::close() ?>
