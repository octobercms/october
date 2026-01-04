<!DOCTYPE html>
<html lang="<?= App::getLocale() ?>" class="no-js">
    <head>
        <link rel="icon" type="image/png" href="<?= e(Backend\Models\BrandSetting::getFavicon() ?: Backend::skinAsset('assets/images/favicon.png')) ?>">
        <title><?= __('Administration Area') ?> | <?= e(Backend\Models\BrandSetting::get('app_name')) ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0">
        <meta name="robots" content="noindex">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="backend-base-path" content="<?= Backend::baseUrl() ?>">
        <meta name="csrf-token" content="<?= csrf_token() ?>">
        <meta name="turbo-visit-control" content="disable">
        <?php
            $coreBuild = Backend::assetVersion();

            $styles = [
                Backend::skinAsset('assets/vendor/bootstrap/bootstrap.css'),
                Backend::skinAsset('assets/css/october.css'),
            ];

            $scripts = [
                Url::asset('modules/system/assets/js/vendor/jquery.min.js'),
                Url::asset('modules/system/assets/js/framework-bundle.min.js'),
                Backend::skinAsset('assets/vendor/bootstrap/bootstrap.min.js'),
                Backend::skinAsset('assets/js/vendor-min.js'),
                Backend::skinAsset('assets/js/october-min.js'),
                Url::asset('modules/system/assets/js/vue.bundle-min.js'),
                Url::to('modules/backend/assets/js/auth/auth.js'),
                Url::asset('modules/system/assets/js/lang/lang.'.App::getLocale().'.js'),
            ];
        ?>
        <?php foreach ($styles as $style): ?>
            <link href="<?= $style . '?v=' . $coreBuild ?>" rel="stylesheet" fetchpriority="high">
        <?php endforeach ?>

        <?php foreach ($scripts as $script): ?>
            <script src="<?= $script . '?v=' . $coreBuild ?>" fetchpriority="high"></script>
        <?php endforeach ?>

        <?php if (!Config::get('backend.enable_service_workers', false)): ?>
            <script> unregisterServiceWorkers() </script>
        <?php endif ?>

        <?= $this->makeAssets() ?>
        <?= Block::placeholder('head') ?>
        <?= $this->makeLayoutPartial('custom_styles') ?>
        <?= $this->fireViewEvent('backend.layout.extendHead', ['auth']) ?>
        <?php
            $customizationVars = Backend\Classes\LoginCustomization::getCustomizationVariables($this);
            $logo = $customizationVars->logo;
            $loginCustomization = $customizationVars->loginCustomization;
            $loginBackgroundType = $loginCustomization->loginBackgroundType;
            $defaultImage1x = $customizationVars->defaultImage1x;
            $defaultImage2x = $customizationVars->defaultImage2x;

            if ($loginBackgroundType === 'ai_images') {
                $aiImageIndex = rand(0, 8);
                $generatedImageData = Backend\Classes\LoginCustomization::getGeneratedImageData();
            }
        ?>
    </head>
    <body class="outer <?= $this->bodyClass ?> message-outer-layout">
        <div id="layout-canvas">

            <div class="d-flex h-100">
                <div class="outer-form-cell">
                    <div class="outer-form-container">
                        <h1>
                            <?= e(Backend\Models\BrandSetting::get('app_name')) ?>
                            <img src="<?= e($logo) ?>" style="max-width: 180px" alt="" />
                        </h1>

                        <?= Block::placeholder('body') ?>
                    </div>
                </div>

                <div
                    class="outer-theme-cell flex-grow-1"
                    <?php if ($loginBackgroundType === 'ai_images'): ?>style="<?= e($generatedImageData->background) ?>"<?php endif ?>
                >
                    <div class="d-flex h-100 flex-column align-items-center justify-content-center">
                        <?php if ($loginBackgroundType === 'gradient'): ?>
                            <link href="<?= Backend::skinAsset('assets/images/october-login-gradients/1.css') . '?v=' . $coreBuild ?>" rel="stylesheet" />
                            <div class="gradient-background">
                                <div class="blob blob1"></div>
                                <div class="blob blob2"></div>
                            </div>
                        <?php elseif ($loginBackgroundType === 'ai_images'): ?>
                            <img
                                width="512"
                                height="512"
                                src="<?= Url::asset('/modules/backend/assets/images/october-login-ai-generated/'.$generatedImageData->img) ?>"
                                alt=""
                            />
                        <?php else: ?>
                            <?php if ($loginCustomization->loginImageType == 'autumn_images'): ?>
                                <img
                                    src="<?= Url::asset('/modules/backend/assets/images/october-login-theme/'.$defaultImage1x) ?>"
                                    srcset="<?= Url::asset('/modules/backend/assets/images/october-login-theme/'.$defaultImage1x) ?>,
                                    <?= Url::asset('/modules/backend/assets/images/october-login-theme/'.$defaultImage2x) ?> 2x"
                                    alt=""
                                />
                            <?php elseif ($loginCustomization->loginCustomImage): ?>
                                <img
                                    src="<?= e($loginCustomization->loginCustomImage) ?>"
                                    alt=""
                                />
                            <?php endif ?>
                        <?php endif ?>
                    </div>
                </div>
            </div>

        </div>

        <!-- Flash Messages -->
        <div id="layout-flash-messages"><?= $this->makeLayoutPartial('flash_messages') ?></div>

        <?= $this->makeLayoutPartial('vue_templates') ?>
        <?= Block::placeholder('footer') ?>
    </body>
</html>
