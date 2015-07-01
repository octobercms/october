/*
 * Checkbox control
 *
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

})(jQuery);