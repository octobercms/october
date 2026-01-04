<?php
    use Backend\Models\BrandSetting;
    $activeItem = BackendMenu::getActiveMainMenuItem();
    $navbarMode = BrandSetting::get('menu_mode', BrandSetting::MENU_INLINE);
    $context = BackendMenu::getContext();
    $isVerticalMenu = isset($isVerticalMenu) ? $isVerticalMenu : false;
    $navLogo = BrandSetting::getNavLogo();
?>
<div class="main-menu-container">
    <nav class="navbar control-toolbar navbar-mode-<?= $navbarMode ?> <?= $navLogo ? 'has-logo' : '' ?> flex" role="navigation">
        <?php if (!$isVerticalMenu && $navLogo): ?>
            <div class="toolbar-item toolbar-logo fix-width">
                <a href="<?= Backend::url() ?>" class="mainmenu-logo <?= BackendMenu::isDashboardItemActive() ? 'active' : '' ?>">
                    <img
                        src="<?= e($navLogo) ?>"
                        alt=""
                        class="nav-logo"
                        loading="lazy"
                    />
                </a>
            </div>
        <?php endif ?>
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar" <?= $isVerticalMenu ? 'data-vertical="true"' : '' ?>>
                <ul class="mainmenu-items mainmenu-general" data-main-menu>
                    <?= $this->makeLayoutPartial('mainmenu_items', [
                        'context' => $context,
                        'hideDashitem' => !!$navLogo
                    ]) ?>
                </ul>
            </div>
        </div>
        <div class="toolbar-item fix-width">
            <ul class="mainmenu-items mainmenu-extras" data-main-menu>
                <?php /* Extra Taskbar Item Sample
                <li class="mainmenu-item mainmenu-taskbar has-nolabel">
                    <a href="<?= Url::to('/') ?>" target="_blank" rel="noopener noreferrer">
                        <span class="nav-icon">
                            <i class="bi bi-bell"></i>
                        </span>
                    </a>
                </li>
                */ ?>
                <?php if ($siteSwitcher = $this->getWidget('siteSwitcher')): ?>
                    <?= $siteSwitcher->render(['isVerticalMenu' => $isVerticalMenu]) ?>
                <?php endif ?>
                <li class="mainmenu-item mainmenu-account has-subitems <?= !$isVerticalMenu ? 'hidden-xs' : '' ?>" data-submenu-index="account">
                    <a href="javascript:;">
                        <span class="nav-icon">
                            <div class="mainmenu-account-avatar">
                                <img
                                    src="<?= $this->user->getAvatarThumb(168, ['mode' => 'cover', 'extension' => 'png']) ?>"
                                    loading="lazy"
                                    width="84"
                                    height="84" />
                            </div>
                        </span>
                        <?php if ($isVerticalMenu): ?>
                            <span class="nav-label">
                                <?= e($this->user->full_name ?: $this->user->login) ?>
                            </span>
                        <?php endif ?>
                    </a>
                </li>
                <?php if (!$isVerticalMenu): ?>
                    <li class="mainmenu-item mainmenu-toggle">
                        <a href="javascript:;">☰</a>
                    </li>
                <?php endif ?>
            </ul>
        </div>
    </nav>
</div>

<?php if (!$isVerticalMenu): ?>
    <?php foreach (BackendMenu::listMainMenuItemsWithSubitems() as $itemIndex => $itemInfo): ?>
        <?php if ($itemInfo->subMenuHasDropdown): ?>
            <ul class="mainmenu-items mainmenu-submenu-dropdown hover-effects" data-submenu-index="<?= $itemIndex ?>">
                <?= $this->makeLayoutPartial('submenu_items', [
                    'sideMenuItems' => $itemInfo->subMenuItems,
                    'mainMenuItemActive' => BackendMenu::isMainMenuItemActive($itemInfo->mainMenuItem),
                    'mainMenuItemCode' => $itemInfo->mainMenuItem->code,
                    'context' => $context
                ]) ?>
            </ul>
        <?php endif ?>
    <?php endforeach ?>

    <?php if ($siteSwitcher = $this->getWidget('siteSwitcher')): ?>
        <?= $siteSwitcher->renderSubmenu() ?>
    <?php endif ?>

    <ul class="mainmenu-items mainmenu-submenu-dropdown hover-effects" data-submenu-index="account">
        <li class="mainmenu-item section-title section-user-title">
            <span class="nav-label"><?= e($this->user->full_name ?: $this->user->login) ?></span>
        </li>
        <?= $this->makeLayoutPartial('my_settings_menu_items', ['context' => $context]) ?>
    </ul>
<?php endif ?>
