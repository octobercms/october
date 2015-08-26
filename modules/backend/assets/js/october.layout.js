(function($){
    var OctoberLayout = function() {
        this.$accountMenuOverlay = null
    }

    OctoberLayout.prototype.setPageTitle = function(title) {
        var $title = $('title')

        if (this.pageTitleTemplate === undefined)
            this.pageTitleTemplate = $title.data('titleTemplate')

        $title.text(this.pageTitleTemplate.replace('%s', title))
    }

    OctoberLayout.prototype.updateLayout = function(title) {
        var $children, $el, fixedWidth, margin

        // The entire 'width-fix' class can probably be removed if year >= 2017
        // After checking that it isn't being used anywhere -sg
        $('.layout-cell.width-fix, [data-calculate-width]').each(function(){
            $children = $(this).children()

            if ($children.length > 0) {
                fixedWidth = 0

                $children.each(function() {
                    $el = $(this)
                    margin = $el.data('oc.layoutMargin')

                    if (margin === undefined) {
                        margin = parseInt($el.css('marginRight')) + parseInt($el.css('marginLeft'))
                        $el.data('oc.layoutMargin', margin)
                    }
                    fixedWidth += $el.get(0).offsetWidth + margin
                })

                $(this).width(fixedWidth)
                $(this).trigger('oc.widthFixed')
            }
        })
    }

    OctoberLayout.prototype.toggleAccountMenu = function(el) {
        var self = this,
            $menu = $(el).next()

        if ($menu.hasClass('active')) {
            self.$accountMenuOverlay.remove()
            $menu.removeClass('active')
        }
        else {
            self.$accountMenuOverlay = $('<div />').addClass('popover-overlay')
            $(document.body).append(self.$accountMenuOverlay)
            $menu.addClass('active')

            self.$accountMenuOverlay.one('click', function(){
                self.$accountMenuOverlay.remove()
                $menu.removeClass('active')
            })
        }
    }

    if ($.oc === undefined)
        $.oc = {}

    $.oc.layout = new OctoberLayout()

    $(document).ready(function(){
        $.oc.layout.updateLayout()

        window.setTimeout($.oc.layout.updateLayout, 100)
    })
    $(window).on('resize', function() {
        $.oc.layout.updateLayout()
    })
    $(window).on('oc.updateUi', function() {
        $.oc.layout.updateLayout()
    })
})(jQuery);