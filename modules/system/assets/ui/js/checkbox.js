/*
 * Checkbox control
 *
 */

(function($) {

    $(document).on('keypress', 'div.custom-checkbox', function(e) {
        if (e.key === '(Space character)' || e.key === 'Spacebar' || e.key === ' ') {
            var $cb = $('input[type=checkbox]', this)

            if ($cb.data('oc-space-timestamp') == e.timeStamp)
                return

            $cb.get(0).checked = !$cb.get(0).checked
            $cb.data('oc-space-timestamp', e.timeStamp)
            $cb.trigger('change')
            return false
        }
    })

    //
    // Intermediate checkboxes
    //

    $(document).render(function() {
        $('div.custom-checkbox.is-indeterminate > input').each(function() {
            var $el = $(this),
                checked = $el.data('checked')

            switch (checked) {

                // Unchecked
                case 1:
                    $el.prop('indeterminate', true)
                    break

                // Checked
                case 2:
                    $el.prop('indeterminate', false)
                    $el.prop('checked', true)
                    break

                // Unchecked
                default:
                    $el.prop('indeterminate', false)
                    $el.prop('checked', false)
            }
        })
    })

    $(document).on('click', 'div.custom-checkbox.is-indeterminate > label', function() {
        var $el = $(this).parent().find('input:first'),
            checked = $el.data('checked')

        if (checked === undefined) {
            checked = $el.is(':checked') ? 1 : 0
        }

        switch (checked) {

            // Unchecked, going indeterminate
            case 0:
                $el.data('checked', 1)
                $el.prop('indeterminate', true)
                break

            // Indeterminate, going checked
            case 1:
                $el.data('checked', 2)
                $el.prop('indeterminate', false)
                $el.prop('checked', true)
                break

            // Checked, going unchecked
            default:
                $el.data('checked', 0)
                $el.prop('indeterminate', false)
                $el.prop('checked', false)
        }

        $el.trigger('change')
        return false
    })

})(jQuery);
