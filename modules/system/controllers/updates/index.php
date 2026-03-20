<div data-control="updatelist">
    <div class="scoreboard">
        <div data-control="toolbar">
            <?php if ($projectDetails): ?>
                <div class="scoreboard-item title-value">
                    <h4><?= e(__('Project')) ?></h4>
                    <p class="oc-icon-chain"><?= e($projectDetails->name) ?></p>
                    <p class="description">
                        <?= e(__('Owner')) ?>: <?= e($projectDetails->owner) ?> (<a
                            href="javascript:;"
                            data-control="popup"
                            data-handler="onLoadProjectForm">reset</a>)
                    </p>
                </div>
            <?php endif ?>
            <div class="scoreboard-item title-value">
                <h4><?= e(__('Plugins')) ?></h4>
                <p><?= $pluginsCount ?></p>
                <p class="description">
                    <?= e(__('Disabled')) ?>: <?= $pluginsCount - $pluginsActiveCount ?>
                </p>
            </div>
            <?php if ($currentVersion): ?>
                <div class="scoreboard-item title-value">
                    <h4><?= e(__('Current Build')) ?></h4>
                    <p><span data-core-current-version="<?= $currentVersion ?>"><?= $currentVersion ?></span></p>
                    <p class="description">
                        <span data-core-has-updates style="display:none"><?= e(__('Updates Available')) ?></span>
                        <span data-core-no-updates><?= e(__('Up to Date')) ?></span>
                    </p>
                </div>
                <div class="scoreboard-item title-value">
                    <h4><?= e(__('Latest Build')) ?></h4>
                    <p><span data-core-latest-version class="oc-loading"></span></p>
                    <p class="description">
                        <a
                            href="javascript:;"
                            data-control="popup"
                            data-handler="<?= $this->changelogWidget->getEventHandler('onLoadChangelog') ?>">
                            <?= e(__('View Changelog')) ?>
                        </a>
                    </p>
                </div>
            <?php endif ?>
        </div>
    </div>

    <?php if ($warnings = $this->updaterWidget->renderWarnings()): ?>
        <div class="padded-container container-flush">
            <?= $warnings ?>
        </div>
    <?php endif ?>

    <div class="layout-row p-b">
        <?= $this->listRender() ?>
    </div>
</div>
