<?php Block::put('layout-top-row') ?>
    <div>
        <a
            class="system-home-link back-link-other"
            href="<?= Backend::url('system/settings') ?>"
            onclick="return sideNavSettingsHomeClick()">
            <i></i><?= __('Show All Settings') ?>
        </a>
    </div>
<?php Block::endPut() ?>

<div class="control-settings-nav-container">
    <div
        class="control-settings-nav"
        data-control="settings-nav"
        data-search-input="#settings-search-input">
        <div class="d-flex flex-column h-100 settings-nav-content">
            <div>
                <?= $this->makePartial('~/modules/system/partials/_settings_menu_toolbar.php') ?>
            </div>

            <div class="flex-grow-1">
                <div class="position-relative h-100">
                    <div class="settings-nav-scroll-canvas">
                        <div class="control-scrollbar" data-control="scrollbar" data-animation="false">
                            <?= $this->makePartial('~/modules/system/partials/_settings_menu.php') ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    function sideNavSettingsHomeClick() {
        $('body').addClass('settings-nav-expanded');
        $('#settings-search-input').focus()
        return false;
    }
    </script>
</div>
