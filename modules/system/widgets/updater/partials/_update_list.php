<?php if (!$this->fatalError): ?>

    <?php if ($hasUpdates): ?>

        <div class="modal-body">
            <p>
                <strong><?= e(trans('system::lang.updates.found.label')) ?></strong>
                <?= e(trans('system::lang.updates.found.help')) ?>
            </p>

            <div class="control-updatelist">
                <div class="control-scrollbar" style="height:400px" data-control="scrollbar">
                    <?php if ($core): ?>
                        <div class="update-item <?= $core['isImportant'] ? 'item-danger' : '' ?>">
                            <div class="item-header">
                                <?php if ($core['isImportant']): ?>
                                    <div class="important-update form-group form-group-sm">
                                        <select
                                            name="core_action"
                                            class="form-control custom-select select-no-search"
                                            data-important-update-select>
                                            <option value="">-- <?= e(trans('system::lang.updates.important_action.empty')) ?> --</option>
                                            <option value="confirm"><?= e(trans('system::lang.updates.important_action.confirm')) ?></option>
                                        </select>
                                    </div>
                                <?php endif ?>
                                <h5>
                                    <i class="icon-cube"></i>
                                    <?= e(trans('system::lang.system.name')) ?>
                                </h5>
                            </div>
                            <dl>
                                <?php foreach (array_get($core, 'updates', []) as $build => $description): ?>
                                    <dt>v<?= e($build) ?></dt>
                                    <?php if (is_array($description)): ?>
                                        <dd>
                                            <span class="important-update-label">
                                                <?= e(trans('system::lang.updates.important_action_required')) ?>
                                            </span>
                                            <?= e($description[0]) ?>
                                            <a href="<?= $description[1] ?>" target="_blank">
                                                <?= e(trans('system::lang.updates.important_view_release_notes')) ?>
                                                <i class="icon-external-link"></i>
                                            </a>
                                        </dd>
                                    <?php else: ?>
                                        <dd><?= Markdown::parse(e($description)) ?></dd>
                                    <?php endif ?>
                                <?php endforeach ?>
                                <?php if ($core['old_build']): ?>
                                    <dt class="text-muted">v<?= e($core['old_build']) ?></dt>
                                    <dd class="text-muted"><?= e(__('Current Build')) ?></dd>
                                <?php endif ?>
                            </dl>
                        </div>
                    <?php endif ?>

                    <?php foreach ($themeList as $code => $theme): ?>
                        <div class="update-item">
                            <div class="item-header">
                                <h5>
                                    <i class="icon-photo"></i>
                                    <?= e(array_get($theme, 'name', 'Unknown')) ?>
                                </h5>
                            </div>
                            <dl>
                                <dt>v<?= e(array_get($theme, 'version', '1.0.0')) ?></dt>
                                <dd><?= e(trans('system::lang.updates.theme_new_install')) ?></dd>
                            </dl>
                        </div>
                    <?php endforeach ?>

                    <?php foreach ($pluginList as $code => $plugin): ?>
                        <div class="update-item <?= $plugin['isImportant'] ? 'item-danger' : '' ?>">
                            <div class="item-header">
                                <?php if ($plugin['isImportant']): ?>
                                    <div class="important-update form-group form-group-sm">
                                        <select
                                            name="plugin_actions[]"
                                            class="form-control custom-select select-no-search"
                                            data-important-update-select>
                                            <option value="">-- <?= e(trans('system::lang.updates.important_action.empty')) ?> --</option>
                                            <option value="confirm"><?= e(trans('system::lang.updates.important_action.confirm')) ?></option>
                                        </select>
                                    </div>
                                <?php endif ?>
                                <h5>
                                    <i class="<?= e($plugin['icon'] ?: 'icon-puzzle-piece') ?>"></i>
                                    <?= e($plugin['name']) ?>
                                </h5>
                            </div>
                            <dl>
                                <?php if (!$plugin['old_version']): ?>
                                    <dt>
                                        v<?= $plugin['version'] ?>
                                    </dt>
                                    <dd>
                                        <?= e(trans('system::lang.updates.plugin_version_none')) ?>
                                    </dd>
                                <?php else: ?>
                                    <?php foreach (array_get($plugin, 'updates', []) as $version => $description): ?>
                                        <dt>v<?= e($version) ?></dt>
                                        <?php if (is_array($description)): ?>
                                            <dd>
                                                <span class="important-update-label">
                                                    <?= e(trans('system::lang.updates.important_action_required')) ?>
                                                </span>
                                                <?= e($description[0]) ?>
                                                <a href="<?= $description[1] ?>" target="_blank">
                                                    <?= e(trans('system::lang.updates.important_view_guide')) ?>
                                                    <i class="icon-external-link"></i>
                                                </a>
                                            </dd>
                                        <?php else: ?>
                                            <dd><?= e($description) ?></dd>
                                        <?php endif ?>
                                    <?php endforeach ?>

                                    <dt class="text-muted">
                                        v<?= e($plugin['old_version']) ?>
                                    </dt>
                                    <dd class="text-muted">
                                        <?= e(trans('system::lang.updates.plugin_current_version')) ?>
                                    </dd>
                                <?php endif ?>
                            </dl>
                        </div>
                    <?php endforeach ?>

                </div>
            </div>

        </div>

        <div class="modal-footer">
            <?php if ($hasImportantUpdates): ?>
                <p class="text-danger pull-right oc-icon-exclamation important-update-label" id="updateListImportantLabel">
                    <?= e(trans('system::lang.updates.important_alert_text')) ?>
                </p>
            <?php endif ?>
            <?= Ui::button(
                label: e(trans('system::lang.updates.update_label')),
                primary: true,
                id: 'updateListUpdateButton',
                dataDismiss: 'popup',
                dataControl: 'popup',
                dataHandler: 'onApplyUpdates',
                dataKeyboard: 'false'
            ) ?>
            <?= Ui::button(
                label: __("Cancel"),
                secondary: true,
                dataDismiss: 'popup'
            ) ?>
        </div>

    <?php else: ?>

        <div class="modal-body">
            <p><?= e(trans('system::lang.updates.none.help')) ?></p>
        </div>
        <div class="modal-footer">
            <?= Ui::button(
                label: e(trans('backend::lang.form.close')),
                secondary: true,
                dataDismiss: 'popup'
            ) ?>
            <?= Ui::button(
                label: e(trans('system::lang.updates.force_label')),
                primary: true,
                dataDismiss: 'popup',
                dataControl: 'popup',
                dataHandler: 'onApplyUpdates',
                dataKeyboard: 'false'
            ) ?>
        </div>

    <?php endif ?>

<?php else: ?>

    <div class="modal-body">
        <p class="flash-message static error"><?= e(__($this->fatalError)) ?></p>
    </div>
    <div class="modal-footer">
        <?= Ui::button(
            label: __("Close"),
            secondary: true,
            dataDismiss: 'popup'
        ) ?>
    </div>

<?php endif ?>
