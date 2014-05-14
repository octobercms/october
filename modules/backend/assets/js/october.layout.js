(function($){
    function updateLayout() {
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

    $(document).ready(updateLayout)
    $(window).on('resize', updateLayout)
})(jQuery);