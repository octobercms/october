<?php
    $dashboard = $dashboard ?? null;
?>
<div id="dashboardSidenav" class="secondary-nav">
    <div class="control-toolbar responsive-sidebar-toolbar" role="navigation">
        <div data-control="toolbar" data-disposable="">
            <nav class="layout-sidenav sidenav-responsive">
                <ul class="mainmenu-items">
                    <?php foreach ($dashboards as $item): ?>
                        <?php
                            $isActive = $dashboard && $dashboard->code == $item->code;
                        ?>
                        <li class="mainmenu-item <?= $isActive ? 'active' : '' ?>">
                            <a href="<?= Backend::url('dashboard/index/'. e($item->code)) ?>">
                                <span class="nav-icon">
                                    <i class="<?= e($item->icon) ?>"></i>
                                </span>
                                <span class="nav-label"><?= e($item->name) ?></span>
                            </a>
                        </li>
                    <?php endforeach ?>
                </ul>
            </nav>
        </div>
    </div>
</div>
