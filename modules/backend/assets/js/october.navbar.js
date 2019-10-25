/*
 * Top navigation bar. Features of the bar:
 * - Hide content if the display width is less than 768px. In this case the menu icon is displayed.
 *   When the icon is clicked, the menu content is displayed on the left side of the page.
 * - If the content doesn't fit the navbar, it can be dragged left and right.
 *
 * Dependences:
 * - DragScroll (october.dragscroll.js)
 * - VerticalMenu (october.verticalmenu.js)
 */

(function($){
    $(document).ready(function(){
        $('nav.navbar').each(function(){
            var
                navbar = $(this),
                nav = $('ul.nav', navbar),
                collapseMode = navbar.hasClass('navbar-mode-collapse'),
                isMobile = $('html').hasClass('mobile')

            nav.verticalMenu($('a.menu-toggle', navbar), {
                breakpoint: collapseMode ? Infinity : 769
            })

            $('li.with-tooltip:not(.active) > a', navbar).tooltip({
                container: 'body',
                placement: 'bottom',
                template: '<div class="tooltip mainmenu-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            })
            .on('show.bs.tooltip', function (e) {
                if (isMobile) e.preventDefault()
            })

            $('[data-calculate-width]', navbar).one('oc.widthFixed', function() {
                var dragScroll = $('[data-control=toolbar]', navbar).data('oc.dragScroll')
                if (dragScroll) {
                    dragScroll.goToElement($('ul.nav > li.active', navbar), undefined, {'duration': 0})
                }
            })
        })
    })
})(jQuery);
