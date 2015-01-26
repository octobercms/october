<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?php echo Lang::get('backend::lang.page.access_denied.label') ?></title>
        <link href="<?php echo URL::to('/modules/system/assets/vendor/font-autumn/css/font-autumn.css') ?>" rel="stylesheet">
        <link href="<?php echo URL::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
    </head>
    <body>
    <div class="container">
        <h1><i class="icon-lock warning"></i> <?php echo Lang::get('backend::lang.page.access_denied.label') ?></h1>
        <p class="lead"><?php echo Lang::get('backend::lang.page.access_denied.help') ?></p>
        <a href="<?php echo Backend::url('/') ?>"><?php echo Lang::get('backend::lang.page.access_denied.cms_link') ?></a>
    </div>
    </body>
</html>