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
<?php foreach ($this->getTurboMetaTags() as $turboMeta): ?>
    <meta name="<?= $turboMeta['name'] ?>" content="<?= $turboMeta['content'] ?>" />
<?php endforeach ?>
<?php
    $coreBuild = Backend::assetVersion();
    $vendorPath = Url::asset('modules/system/assets/vendor');
?>
<script type="importmap">
{
    "imports": {
        "larajax": "<?= Url::asset('modules/system/assets/js/framework.esm.js') ?>",
        "bootstrap": "<?= $vendorPath ?>/bootstrap/bootstrap.esm.js",
        "vue": "<?= $vendorPath ?>/vue/vue.esm<?= Config::get('app.debug') ? '' : '.prod' ?>.js",
        "vue-router": "<?= $vendorPath ?>/vue-router/vue-router.esm.js",
        "js-cookie": "<?= $vendorPath ?>/js-cookie/js.cookie.esm.js",
        "sortablejs": "<?= $vendorPath ?>/sortablejs/sortable.esm.js",
        "dropzone": "<?= $vendorPath ?>/dropzone/dropzone.esm.js",
        "chart.js": "<?= $vendorPath ?>/chartjs/chart.esm.js",
        "p-queue": "<?= $vendorPath ?>/p-queue/p-queue.esm.js"
    }
}
</script>
<script src="<?= Url::asset('modules/system/assets/js/vendor.js') ?>?v<?= $coreBuild ?>"></script>
<script src="<?= Url::asset('modules/system/assets/js/framework-bundle.min.js') ?>?v<?= $coreBuild ?>"></script>
<script src="<?= Url::asset('modules/system/assets/js/foundation.js') ?>?v<?= $coreBuild ?>"></script>
<script src="<?= Url::asset('modules/system/assets/js/lang/lang.'.App::getLocale().'.js') ?>?v<?= $coreBuild ?>"></script>
<script type="module" src="<?= Url::asset('modules/system/assets/js/main.js') ?>?v<?= $coreBuild ?>"></script>
<script type="module" src="<?= Url::asset('modules/backend/assets/js/main.js') ?>?v<?= $coreBuild ?>"></script>
<link href="<?= Url::asset('modules/system/assets/css/main.css') ?>?v<?= $coreBuild ?>" rel="stylesheet" />
<link href="<?= Url::asset('modules/backend/assets/css/main.css') ?>?v<?= $coreBuild ?>" rel="stylesheet" />

<?php if (!Config::get('backend.enable_service_workers', false)): ?>
    <script> oc.waitFor(() => window.unregisterServiceWorkers).then(() => unregisterServiceWorkers()) </script>
<?php endif ?>

<?= $this->makeAssets() ?>
<?= Block::placeholder('head') ?>
<?= $this->makeLayoutPartial('custom_styles') ?>
