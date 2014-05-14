/*
 * Custom controls that could exist separately of the form widget
 */

(function($){
    $(document).on('keydown', 'div.custom-checkbox', function(e){
        if (e.keyCode == 32)
            e.preventDefault()
    })

    $(document).on('keyup', 'div.custom-checkbox', function(e){
        if (e.keyCode == 32) {
            var $cb = $('input', this)

            if ($cb.data('oc-space-timestamp') == e.timeStamp)
                return

            $cb.get(0).checked = !$cb.get(0).checked
            $cb.data('oc-space-timestamp', e.timeStamp)
            $cb.trigger('change')
            return false
        }
    })

    /*
     * Custom drop downs (Desktop only)
     */
    $(document).render(function(){
        if (Modernizr.touch)
            return

        $('select.custom-select').select2()
        $(document).on('disable', 'select.custom-select', function(event, status){
            $(this).select2('enable', !status)
        })
    })
})(jQuery);