<?php foreach (BackendMenu::listMainMenuItemsWithSubitems() as $itemIndex => $itemInfo): ?>
    <?php
        $item = $itemInfo->mainMenuItem;
        $isActive = BackendMenu::isMainMenuItemActive($item);
        $isDashboard = $item->owner === 'October.Dashboard' && $item->code === 'dashboard';
        if ($isDashboard && ($customDashIcon = Backend\Models\BrandSetting::getNavDashboardIcon())) {
            $item->iconSvg = $customDashIcon;
        }
    ?>
    <li
        class="svg-icon-container svg-active-effects mainmenu-item <?= $isActive ? 'active' : '' ?> <?= $itemInfo->subMenuHasDropdown ? 'has-subitems' : '' ?> <?= $isDashboard ? 'is-dashboard' : '' ?>"
        data-submenu-index="<?= $itemIndex ?>">
        <a href="<?= $item->url ?>">
            <?= $this->makeLayoutPartial('mainmenu_item', ['item' => $item]) ?>
        </a>
    </li>
<?php endforeach ?>
