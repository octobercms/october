<?php
    use Backend\Models\BrandSetting;
    $navbarMode = BrandSetting::get('menu_mode', BrandSetting::MENU_INLINE);
?>
<!DOCTYPE html>
<html lang="<?= App::getLocale() ?>" class="no-js <?= Backend\Models\BrandSetting::get('color_mode') === 'auto' ? 'color-mode-auto' : '' ?>" data-bs-theme="<?= e(Backend\Models\BrandSetting::getColorMode()) ?>">
    <head>
        <?= $this->makeLayoutPartial('head') ?>
        <?= $this->fireViewEvent('backend.layout.extendHead', ['default']) ?>
    </head>
    <body class="<?= $this->bodyClass ?> <?= $navbarMode === BrandSetting::MENU_LEFT ? 'main-menu-left' : '' ?> <?= $this->pageSize ? "has-page-size" : '' ?>">
        <div id="layout-canvas">

            <div class="d-flex h-100">
                <div class="left-side-menu-container flex-shrink-0">
                    <div class="layout-mainmenu" id="layout-mainmenu-left">
                        <?= $this->makeLayoutPartial('mainmenu', ['isVerticalMenu' => true]) ?>
                    </div>
                </div>

                <div class="flex-grow-1">
                    <div class="d-flex h-100 flex-column">
                        <?php if ($bannerAreaContent = Block::placeholder('banner-area')): ?>
                            <!-- Banner Area -->
                            <div class="layout-banner-area" id="layout-banner-area">
                                <?= $bannerAreaContent ?>
                            </div>
                        <?php endif ?>

                        <!-- Main Menu -->
                        <?php if (!isset($hideMainMenu)): ?>
                            <div class="layout-mainmenu" id="layout-mainmenu">
                                <?= $this->makeLayoutPartial('mainmenu') ?>
                            </div>
                        <?php endif ?>

                        <div class="secondary-nav" id="layout-sidenav-responsive">
                            <?= $this->makeLayoutPartial('sidenav-responsive') ?>
                        </div>

                        <?php $flyoutContent = Block::placeholder('sidepanel-flyout') ?>

                        <div class="flex-grow-1">
                            <div class="d-flex h-100 flyout-container"
                                <?php if ($flyoutContent): ?>
                                    data-control="flyout"
                                    data-flyout-width="400"
                                    data-flyout-toggle="#layout-sidenav"
                                <?php endif ?>
                            >
                                <?php if ($flyoutContent): ?>
                                    <div class="flyout-content"> <?= $flyoutContent ?></div>
                                <?php endif ?>

                                <!-- Side Navigation -->
                                <?= $this->makeLayoutPartial('sidenav') ?>

                                <!-- Side Panel -->
                                <?php if ($sidePanelContent = Block::placeholder('sidepanel')): ?>
                                    <div class="w-350 hide-on-small" id="layout-side-panel" data-control="layout-sidepanel">
                                        <?= $sidePanelContent ?>
                                    </div>
                                <?php endif ?>

                                <!-- Content Body -->
                                <div id="layout-body" class="layout-container flex-grow-1 <?= $this->pageSize ? "mw-{$this->pageSize}" : '' ?>">
                                    <div class="d-flex flex-column h-100">
                                        <?= Block::placeholder('layout-top-row') ?>

                                        <?php if ($breadcrumbContent = Block::placeholder('breadcrumb')): ?>
                                            <!-- Breadcrumb -->
                                            <nav class="control-breadcrumb">
                                                <?= $breadcrumbContent ?>
                                            </nav>
                                        <?php endif ?>

                                        <!-- Content -->
                                        <div class="flex-grow-1 position-relative">
                                            <?= Block::placeholder('body') ?>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <?= $this->makeLayoutPartial('mainmenu_responsive') ?>
        <?= $this->makeLayoutPartial('footer') ?>
        <?= $this->fireViewEvent('backend.layout.extendFooter', ['default']) ?>
    </body>
</html>
