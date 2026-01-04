<?php
    $context = BackendMenu::getContext();
?>
<div id="layout-mainmenu-responsive-container">
    <nav class="responsive-menu-pane mainmenu-pane">
        <div class="menu-header">
            <a href="javascript:;" class="close-link">←</a>
            <div class="mainmenu-item active has-subitems" data-submenu-index="account">
                <div class="mainmenu-item-container">
                    <span class="nav-icon">
                       <div class="mainmenu-account-avatar">
                            <img
                                src="<?= $this->user->getAvatarThumb(80, ['mode' => 'cover', 'extension' => 'png']) ?>"
                                loading="lazy"
                                width="80"
                                height="80"
                            />
                        </div>
                    </span>

                    <span class="nav-label">
                        <div class="company-name"><?= e(Backend\Models\BrandSetting::get('app_name')) ?></div>
                        <div class="user-name"><?= e($this->user->full_name ?: $this->user->login) ?></div>
                    </span>
                </div>
            </div>
        </div>

        <div class="scrollable-panel-container">
            <ul class="mainmenu-items hover-effects scrollable">

            </ul>
        </div>
    </nav>

    <nav class="responsive-menu-pane submenu-pane">
        <div class="menu-header svg-icon-container has-back-link">
            <a href="javascript:;" class="go-back-link">←</a>
            <div class="mainmenu-item active">

            </div>
        </div>

        <div class="scrollable-panel-container">
            <ul class="mainmenu-items hover-effects scrollable">

            </ul>
        </div>
    </nav>
</div>
