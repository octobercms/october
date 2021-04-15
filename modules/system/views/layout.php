<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= e($title) ?> - October CMS</title>
        <link href="<?= Url::asset('/modules/system/assets/css/october.css') ?>" rel="stylesheet" importance="high" />
        <link href="<?= Url::asset('/modules/system/assets/css/controls.css') ?>" rel="stylesheet" importance="high" />
    </head>
    <body>
        <div class="form-cell flex-center position-ref">
            <div class="outer-form-container">
                <h1>
                    October CMS
                    <img src="<?= Url::asset('/modules/system/assets/images/october-logo.svg') ?>" style="max-width: 180px" alt="" />
                </h1>

                <?php if (isset($error)): ?>
                    <div class="alert alert-danger text-center break-words">
                        <?= e($error) ?>
                    </div>
                <?php endif ?>

                <?= View::make($_layoutName, $_layoutVars) ?>

            </div>
        </div>
    </body>
</html>
