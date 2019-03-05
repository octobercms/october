<!DOCTYPE html>
<html lang="<?= App::getLocale() ?>">
    <head>
        <meta charset="utf-8">
        <title><?= Lang::get('backend::lang.page.404.label') ?></title>
        <link href="<?= Url::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <h1><i class="icon-chain-broken warning"></i> <?= Lang::get('backend::lang.page.404.label') ?></h1>
            <br>
            <p class="lead"><?= Lang::get('backend::lang.page.404.help') ?></p>
            <p class="lead"><span style="font-family: monospace;"> <?= e(url()->current()); ?></span></p>
            <a href="javascript:;" onclick="history.go(-1); return false;"><?= Lang::get('backend::lang.page.404.back_link') ?></a>
            <br><br>
            <a href="<?= Backend::url('') ?>"><?= Lang::get('backend::lang.page.access_denied.cms_link') ?></a>
        </div>
    </body>
</html>
