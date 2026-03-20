/*
 * Main menu
 *
 * Dependencies:
 * - ResponsiveMenu (october.responsivemenu.js)
 */

+function ($) { "use strict";
    function MainMenu() {
        var $mainMenuNavbar = $('#layout-mainmenu .navbar:first'),
            $mainMenuElement = $('.layout-mainmenu .navbar ul.mainmenu-items'),
            $leftMenuElement = $('#layout-mainmenu-left'),
            $leftMenuMainMenu = $leftMenuElement.find('[data-control=toolbar]'),
            $leftMenuExtrasMenu = $leftMenuElement.find('.mainmenu-extras'),
            $mainMenuToolbar = $('.layout-mainmenu [data-control=toolbar]'),
            $menuContainer = $('#layout-mainmenu'),
            menuHeight = $.oc.backendCalculateTopContainerOffset(),
            responsiveMenu = new $.oc.responsiveMenu(hideMenus),
            leftMenuDebounceTimer = null,
            leftMenuWidth = null,
            leftMenuLeaveDebounceTimer = null,
            $overlay = null,
            isTouch = false,
            showingTooltips = null,
            $leftMenuOverlay = null;

        function init() {
            $leftMenuElement.find('li a')
                .on('touchstart', onLeftMenuTouch)
                .on('click', onLeftMenuItemClick);

            $mainMenuElement.on('mouseenter', 'li', onItemHover);
            $mainMenuElement.on('click', 'li.has-subitems', onItemClick);
            $mainMenuElement.on('click', '.mainmenu-toggle', onShowResponsiveMenuClick);
            $leftMenuElement.on('mouseenter', onLeftMenuMouseEnter);
            $leftMenuElement.on('mouseleave', onLeftMenuMouseLeave);
            addEventListener('page:unload', hideMenus);
            addEventListener('backend:hidemenus', hideMenus);

            $mainMenuToolbar.each(function () {
                var dragScroll = $(this).data('oc.dragScroll');
                if (dragScroll) {
                    dragScroll.goToElement($(this).find('ul.mainmenu-items > li.active'), undefined, {'duration': 0, alignBottom: true});
                }
            });
        }

        function displaySubmenu($li) {
            var submenuIndex = $li.data('submenuIndex'),
                $submenu = $('.mainmenu-submenu-dropdown[data-submenu-index=' + submenuIndex + ']', $menuContainer),
                isLeftSideMenu = $li.closest('#layout-mainmenu-left').length > 0;

            $li.addClass('active-dropdown');

            getOverlay().addClass('oc-show');

            if (!isLeftSideMenu) {
                var menuLeft = $li.offset().left;

                $submenu.css({
                    top: menuHeight,
                    left: menuLeft
                });
            }
            else {
                $(document.body).addClass('left-menu-submenu-displayed');
                var menuTop = $li.offset().top;

                $submenu.css({
                    top: menuTop,
                    left: $leftMenuElement.outerWidth()
                });
            }

            $submenu.addClass('oc-invisible');
            $submenu.addClass('oc-show');

            if (!isLeftSideMenu) {
                var menuRight = menuLeft + $submenu.width(),
                    windowWidth = $(window).width();

                if (menuRight > windowWidth - 20) {
                    $submenu.css({
                        left: menuLeft - (menuRight - windowWidth) - 20
                    });
                }
            }
            else {
                var submenuPosition = $submenu.position(),
                    menuBottom = $submenu.height() + submenuPosition.top,
                    windowHeight = window.scrollY + $(document.body).height();

                if (menuBottom > windowHeight - 20) {
                    $submenu.css({
                        top: submenuPosition.top - (menuBottom - windowHeight) - 20
                    });
                }
            }

            $submenu.removeClass('oc-invisible');
            addKeyListener();
        }

        function onKeyDown(ev) {
            // Escape
            if (ev.keyCode == 27) {
                hideMenus(null, true);
            }
        }

        function onLeftMenuTouch(ev) {
            isTouch = true;
        }

        function onLeftMenuItemClick(ev) {
            if (isTouch && !$(document.body).hasClass('reveal-left-side-menu')) {
                onLeftMenuMouseEnter();

                ev.stopPropagation();
                ev.preventDefault();
                return false;
            }
        }

        function onLeftMenuMouseEnter() {
            if (leftMenuLeaveDebounceTimer) {
                window.clearTimeout(leftMenuLeaveDebounceTimer);
                leftMenuLeaveDebounceTimer = null;
            }

            if ($(document.body).hasClass('reveal-left-side-menu')) {
                return;
            }

            if (leftMenuDebounceTimer) {
                window.clearTimeout(leftMenuDebounceTimer);
            }

            leftMenuDebounceTimer = window.setTimeout(showLeftMenu, 100);
        }

        function onLeftMenuMouseLeave() {
            if ($(document.body).hasClass('left-menu-submenu-displayed')) {
                return;
            }

            if (leftMenuDebounceTimer) {
                window.clearTimeout(leftMenuDebounceTimer);
                leftMenuDebounceTimer = null;
            }

            if (leftMenuLeaveDebounceTimer) {
                window.clearTimeout(leftMenuLeaveDebounceTimer);
            }

            leftMenuLeaveDebounceTimer = window.setTimeout(hideLeftMenu, 300);
        }

        function getLeftMenuWidth() {
            if (leftMenuWidth !== null) {
                return leftMenuWidth;
            }

            var leftMenuContainer = $leftMenuElement.closest('.left-side-menu-container');
            leftMenuContainer.addClass('width-check');

            var extrasWidth = 0;
            $('.nav-label', $leftMenuExtrasMenu).each(function () {
                var labelTotalWidth = $(this).offset().left + $(this).outerWidth(true) + 20;
                extrasWidth = Math.max(extrasWidth, labelTotalWidth);
            });

            leftMenuWidth = Math.max($leftMenuMainMenu.outerWidth(), extrasWidth);
            leftMenuContainer.removeClass('width-check');
            return leftMenuWidth;
        }

        function showLeftMenu() {
            $(document.body).addClass('reveal-left-side-menu');

            if (!$leftMenuElement.data('original-width')) {
                $leftMenuElement.data('original-width', $leftMenuElement.width());
            }

            addKeyListener();
            getLeftMenuOverlay().addClass('oc-show');
            $leftMenuElement.width(getLeftMenuWidth());
        }

        function hideLeftMenu() {
            if (leftMenuLeaveDebounceTimer) {
                window.clearTimeout(leftMenuLeaveDebounceTimer);
                leftMenuLeaveDebounceTimer = null;
            }

            $leftMenuElement.width($leftMenuElement.data('original-width'));
            getLeftMenuOverlay().removeClass('oc-show');
            $(document.body).removeClass('reveal-left-side-menu');
        }

        function addKeyListener() {
            $(document).on('keydown.mainmenusubmenu', onKeyDown);
        }

        function removeKeyListener() {
            $(document).off('.mainmenusubmenu');
        }

        function hideSubmenu() {
            $('li.active-dropdown', $mainMenuElement).removeClass('active-dropdown');
            $('.mainmenu-submenu-dropdown.oc-show', $menuContainer).removeClass('oc-show');
            $(document.body).removeClass('left-menu-submenu-displayed');
        }

        function hideMenus(ev, hideAll) {
            var isSubmenuDisplayed = $(document.body).hasClass('left-menu-submenu-displayed');

            getOverlay().removeClass('oc-show');
            hideSubmenu();
            removeKeyListener();

            if (isSubmenuDisplayed && !hideAll) {
                return;
            }

            hideLeftMenu();
            responsiveMenu.hide();
        }

        function getOverlay() {
            if ($overlay) {
                return $overlay;
            }

            $overlay = $('<div class="mainmenu-submenu-overlay"></div>')
                .appendTo(document.body);

            $overlay.on('click', function (ev) {
                hideMenus(null, ev.pageX > $leftMenuElement.outerWidth());
            });

            return $overlay;
        }

        function getLeftMenuOverlay() {
            if ($leftMenuOverlay) {
                return $leftMenuOverlay;
            }

            $leftMenuOverlay = $('<div class="mainmenu-leftmenu-overlay"></div>')
                .appendTo(document.body);

            $leftMenuOverlay.on('click', hideMenus);

            return $leftMenuOverlay;
        }

        function onItemHover() {
            var wantTooltips = $mainMenuNavbar.hasClass('navbar-mode-icons');
            if (wantTooltips === showingTooltips) {
                return;
            }

            showingTooltips = wantTooltips;
            $('li', $mainMenuElement).each(function() {
                var $li = $(this);
                if (wantTooltips) {
                    $li.attr('data-tooltip-text', $('.nav-label', $li).text().trim());
                }
                else {
                    $li.removeAttr('data-tooltip-text');
                }
            });
        }

        function onItemClick(ev) {
            var $li = $(ev.currentTarget).closest('li');

            ev.preventDefault();

            if ($(document.body).hasClass('drag')) {
                return false;
            }

            displaySubmenu($li);
            return false;
        }

        function onShowResponsiveMenuClick(ev) {
            ev.preventDefault();

            addKeyListener();
            getOverlay().addClass('oc-show');
            responsiveMenu.show();
            return false;
        }

        init();

        $.oc.mainMenu = this;

        this.reload = function reload(mainMenuHtml, mainMenuLeftHtml, sidenavResponsiveHtml) {
            if (mainMenuHtml) {
                $('#layout-mainmenu').html(mainMenuHtml);
            }
            if (mainMenuLeftHtml) {
                $('#layout-mainmenu-left').html(mainMenuLeftHtml);
            }
            if (sidenavResponsiveHtml) {
                $('#layout-sidenav-responsive').html(sidenavResponsiveHtml);
            }

            $.oc.mainMenu = new MainMenu();
        };
    }

    $(document).render(function() {
        var $this = $('.layout-mainmenu:first');
        var data = $this.data('oc.mainMenu');
        if (!data) $this.data('oc.mainMenu', (data = new MainMenu()));
    });

}(window.jQuery);
