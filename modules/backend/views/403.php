<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?= Lang::get('cms::lang.page.access_denied.label') ?></title>
    <link href="<?= URL::to('/modules/system/assets/vendor/font-autumn/css/font-autumn.css') ?>" rel="stylesheet">
    <link href="<?= URL::to('/modules/system/assets/css/styles.css') ?>" rel="stylesheet">
</head>
<body>
<div class="container">
    <h1><i class="icon-lock warning"></i> <?= Lang::get('cms::lang.page.access_denied.label') ?></h1>
    <p class="lead"><?= Lang::get('cms::lang.page.access_denied.help') ?></p>
    <?php if (isset($cms_link)) echo $cms_link; ?>
</div>
</body>
</html>