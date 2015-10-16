/*
 * Select control
 *
 * Require:
 *  - modernizr/modernizr
 *  - select2/select2.full
 */

(function($){

    /*
     * Custom drop downs (Desktop only)
     */
    $(document).render(function(){
        if (Modernizr.touch)
            return

        var formatSelectOption = function(state) {
            if (!state.id)
                return state.text; // optgroup

            var $option = $(state.element),
                iconClass = $option.data('icon'),
                imageSrc = $option.data('image')

            if (iconClass)
                return '<i class="select-icon '+iconClass+'"></i> ' + state.text

            if (imageSrc)
                return '<img class="select-image" src="'+imageSrc+'" alt="" /> ' + state.text

            return state.text
        }

        var selectOptions = {
            templateResult: formatSelectOption,
            templateSelection: formatSelectOption,
            escapeMarkup: function(m) { return m },
            width: 'style'
        }

        /*
         * Bind custom select
         */
        $('select.custom-select').each(function(){
            var $element = $(this),
                extraOptions = {}

            // Prevent duplicate loading
            if ($element.data('select2') != null) {
                return true; // Continue
            }

            $element.attr('data-disposable', 'data-disposable')
            $element.one('dispose-control', function(){
                if ($element.data('select2')) {
                    $element.select2('destroy')
                }
            })

            if ($element.hasClass('select-no-search')) {
                extraOptions.minimumResultsForSearch = Infinity
            }

            $element.select2($.extend({}, selectOptions, extraOptions))
        })
    })

    $(document).on('disable', 'select.custom-select', function(event, status){
        $(this).select2('enable', !status)
    })

    $(document).on('focus', 'select.custom-select', function(event){
        setTimeout($.proxy(function() { $(this).select2('focus') }, this), 10)
    })

})(jQuery);