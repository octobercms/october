<div
    class="permissioneditor <?= $this->previewMode ? 'control-disabled' : '' ?> mw-950"
    data-control="permissioneditor"
    <?= $field->getAttributes() ?>
>
    <?php foreach ($permissions as $tab => $tabPermissions): ?>
        <ul>
            <li class="permission-section">
                <div class="section-content">
                    <div class="tab-title">
                        <?= e(__($tab)) ?>
                    </div>

                    <div class="tab-controls">
                        <?php if ($this->mode === 'radio'): ?>
                            <a href="javascript:;" class="backend-toolbar-button control-button" data-field-permission-toggle>
                                <i class="icon-check-multi"></i>
                                <span class="button-label"><?= e(trans('backend::lang.form.select_all')) ?></span>
                            </a>
                        <?php else: ?>
                            <a href="javascript:;" class="backend-toolbar-button control-button" data-field-permission-all>
                                <i class="icon-check-multi"></i>
                                <span class="button-label"><?= e(trans('backend::lang.form.select_all')) ?></span>
                            </a>

                            <a href="javascript:;" class="backend-toolbar-button control-button" style="display: none" data-field-permission-none>
                                <i class="icon-eraser"></i>
                                <span class="button-label"><?= e(trans('backend::lang.form.select_none')) ?></span>
                            </a>
                        <?php endif ?>
                    </div>
                </div>
            </li>

            <?php foreach ($tabPermissions as $permission): ?>
                <?= $this->makePartial('permission_item', ['permission' => $permission]) ?>
            <?php endforeach ?>
        </ul>
    <?php endforeach ?>
    <div class="permissions-overlay"></div>
</div>
