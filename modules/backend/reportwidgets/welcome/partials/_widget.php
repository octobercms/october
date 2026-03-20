<div class="report-widget widget-welcome">
    <h3><?= e(__($this->property('title'))) ?></h3>

    <?php if (!isset($error)): ?>
        <div class="welcome-container">
            <div class="welcome-logo">
                <div class="oc-logo"></div>
            </div>
            <div class="welcome-message">
                <?php if ($lastSeen): ?>
                    <p>
                        <?= e(__("Welcome back to :app, :name.", ['app'=>$appName, 'name'=>$user->first_name])) ?>
                        <?= e(__("Your last sign in was")) ?>
                    </p>
                    <p>
                        <strong><?= Backend::dateTime($lastSeen->created_at, ['formatAlias' => 'dateTimeLongMin']) ?></strong>
                    </p>
                    <?php if (BackendAuth::userHasAccess('utilities.logs')): ?>
                        <p>
                            <a href="<?= Backend::url('backend/accesslogs') ?>"><?= e(__("View Access Logs")) ?></a>
                        </p>
                    <?php endif ?>
                <?php else: ?>
                    <p>
                        <?= e(__("Welcome to :app, :name.", ['app'=>$appName, 'name'=>$user->first_name])) ?>
                    </p>
                    <p>
                        <?= e(__("This is the first time you have signed in.")) ?>
                    </p>
                    <p>
                        <?= e(__("Have a great day!")) ?>
                    </p>
                <?php endif ?>
            </div>
        </div>
    <?php else: ?>
        <div class="callout callout-warning">
            <div class="content"><?= e($error) ?></div>
        </div>
    <?php endif ?>
</div>
