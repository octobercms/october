(function($){
    var OctoberLayout = function() {}

    OctoberLayout.prototype.setPageTitle = function(title) {
        var $title = $('title')

        if (this.pageTitleTemplate === undefined)
            this.pageTitleTemplate = $title.data('titleTemplate')

        $title.text(this.pageTitleTemplate.replace('%s', title))
    }

    OctoberLayout.prototype.updateLayout = function(title) {
        $('.layout-cell.width-fix').each(function(){
            var $el = $(this).children();
            if ($el.length > 0) {
                var margin = $el.data('oc.layoutMargin');
                if (margin === undefined) {
                    margin = parseInt($el.css('marginRight')) + parseInt($el.css('marginLeft'))
                    $el.data('oc.layoutMargin', margin)
                }

                $(this).width($el.get(0).offsetWidth + margin)
            }
        })
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