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
                extraOptions = {
                    dropdownCssClass: '',
                    containerCssClass: ''
                }

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
            if ($element.hasClass('select-no-dropdown')) {
                extraOptions.dropdownCssClass += ' select-no-dropdown'
                extraOptions.containerCssClass += ' select-no-dropdown'
            }

            if ($element.hasClass('select-hide-selected')) {
                extraOptions.dropdownCssClass += ' select-hide-selected'
            }

            var separators = $element.data('token-separators')
            if (separators) {
                extraOptions.tags = true
                extraOptions.tokenSeparators = separators.split('|')

                /*
                 * When the dropdown is hidden, force the first option to be selected always.
                 */
                if ($element.hasClass('select-no-dropdown')) {
                    extraOptions.selectOnClose = true
                    extraOptions.closeOnSelect = false

                    $element.on('select2:closing', function() {
                        $('.select2-dropdown.select-no-dropdown:first .select2-results__option--highlighted').removeClass('select2-results__option--highlighted')
                        $('.select2-dropdown.select-no-dropdown:first .select2-results__option:first').addClass('select2-results__option--highlighted')
                    })
                }
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