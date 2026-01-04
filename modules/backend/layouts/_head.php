<title data-title-template="<?= empty($this->pageTitleTemplate) ? '%s' : e($this->pageTitleTemplate) ?> | <?= e(Backend\Models\BrandSetting::get('app_name')) ?>">
    <?= e(__($this->pageTitle)) ?> | <?= e(Backend\Models\BrandSetting::get('app_name')) ?>
</title>
<?php if ($customFavicon = Backend\Models\BrandSetting::getFavicon()): ?>
    <link rel="icon" type="image/png" href="<?= e($customFavicon) ?>">
<?php else: ?>
    <link rel="icon" type="image/png" href="<?= e(Backend::skinAsset('assets/images/favicon.png')) ?>" data-favicon-dark="<?= e(Backend::skinAsset('assets/images/favicon-dark.png')) ?>">
<?php endif ?>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0">
<meta name="robots" content="noindex">
<meta name="mobile-web-app-capable" content="yes">
<meta name="app-timezone" content="<?= e(Config::get('app.timezone')) ?>">
<meta name="backend-base-path" content="<?= Backend::baseUrl() ?>">
<meta name="backend-timezone" content="<?= e(Backend\Models\Preference::get('timezone')) ?>">
<meta name="backend-locale" content="<?= e(Backend\Models\Preference::get('locale')) ?>">
<meta name="backend-site" content="<?= Site::getEditSiteId() ?>">
<meta name="csrf-token" content="<?= csrf_token() ?>">
<meta name="turbo-root" content="<?= Backend::baseUrl() ?>">
<?php if ($this->turboVisitControl): ?>
    <meta name="turbo-visit-control" content="<?= $this->turboVisitControl ?>" />
<?php endif ?>
<?php
    $coreBuild = Backend::assetVersion();

    $styles = [
        Backend::skinAsset('assets/vendor/bootstrap/bootstrap.css'),
        Backend::skinAsset('assets/vendor/bootstrap-icons/bootstrap-icons.css'),
        Backend::skinAsset('assets/css/october.css'),
    ];

    $scripts = [
        Url::asset('modules/system/assets/js/vendor/jquery.min.js'),
        Url::asset('modules/system/assets/js/framework-bundle.min.js'),
        Url::asset('modules/system/assets/js/vue.bundle-min.js'),
        Url::asset('modules/system/assets/js/toolbox.bundle-min.js'),
        Backend::skinAsset('assets/vendor/bootstrap/bootstrap.min.js'),
        Backend::skinAsset('assets/js/vendor-min.js'),
        Backend::skinAsset('assets/js/october-min.js'),
        Url::asset('modules/system/assets/js/lang/lang.'.App::getLocale().'.js'),
    ];
?>
<?php foreach ($styles as $style): ?>
    <link href="<?= $style . '?v' . $coreBuild ?>" rel="stylesheet" fetchpriority="high">
<?php endforeach ?>

<?php foreach ($scripts as $script): ?>
    <script src="<?= $script . '?v' . $coreBuild ?>" fetchpriority="high"></script>
<?php endforeach ?>

<?php if (!Config::get('backend.enable_service_workers', false)): ?>
    <script> unregisterServiceWorkers() </script>
<?php endif ?>

<?= $this->makeAssets() ?>
<?= Block::placeholder('head') ?>
<?= $this->makeLayoutPartial('custom_styles') ?>
