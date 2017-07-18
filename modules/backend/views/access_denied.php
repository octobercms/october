<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?= Lang::get('backend::lang.page.access_denied.label') ?></title>
        <link href="<?= Url::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
    </head>
    <body>
    <div class="container">
        <h1><i class="icon-lock warning"></i> <?= Lang::get('backend::lang.page.access_denied.label') ?></h1>
        <p class="lead"><?= Lang::get('backend::lang.page.access_denied.help') ?></p>
        <a href="<?= Backend::url('/') ?>"><?= Lang::get('backend::lang.page.access_denied.cms_link') ?></a>
    </div>
    </body>
</html>
