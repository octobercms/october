<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title><?php echo Lang::get('cms::lang.page.not_found.label') ?></title>
        <link href="<?php echo URL::to('/modules/system/assets/vendor/font-autumn/css/font-autumn.css') ?>" rel="stylesheet">
        <link href="<?php echo URL::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <h1><i class="icon-chain-broken warning"></i> <?php echo Lang::get('cms::lang.page.not_found.label') ?></h1>
            <p class="lead"><?php echo Lang::get('cms::lang.page.not_found.help') ?></p>
        </div>
    </body>
</html>