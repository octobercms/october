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
    $(window).load(function() {
        $('nav.navbar').each(function(){
            var 
                navbar = $(this),
                nav = $('ul.nav', navbar)

            nav.verticalMenu($('a.menu-toggle', navbar))

            $('li.with-tooltip > a', navbar).tooltip({
                container: 'body',
                placement: 'bottom'
            })

            $('.layout-cell.width-fix', navbar).one('oc.widthFixed', function(){
                var dragScroll = $('[data-control=toolbar]', navbar).data('oc.dragScroll')
                if (dragScroll)
                    dragScroll.goToElement($('ul.nav > li.active', navbar), undefined, {'duration': 0})
            })
        })
    })
})(jQuery);