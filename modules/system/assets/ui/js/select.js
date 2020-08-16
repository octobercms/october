/*
 * Select control
 *
 * Require:
 *  - modernizr/modernizr
 *  - select2/select2.full
 */

(function($){

    /*
     * Custom drop downs
     */
    $(document).render(function(){
        var formatSelectOption = function(state) {
            var text = $('<span>').text(state.text).html()

            if (!state.id) {
                return text // optgroup
            }

            var $option = $(state.element),
                iconClass = state.icon ? state.icon : $option.data('icon'),
                imageSrc = state.image ? state.image : $option.data('image')

            if (iconClass) {
                return '<i class="select-icon '+iconClass+'"></i> ' + text
            }

            if (imageSrc) {
                return '<img class="select-image" src="'+imageSrc+'" alt="" /> ' + text
            }

            return text
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

            /*
             * October AJAX
             */
            var source = $element.data('handler');
            if (source) {
                extraOptions.ajax = {
                    transport: function(params, success, failure) {
                        var $request = $element.request(source, {
                            data: params.data
                        })

                        $request.done(success)
                        $request.fail(failure)

                        return $request
                    },
                    processResults: function (data, params) {
                        var results = data.result || data.results,
                            options = []

                        delete(data.result)
                        if (results[0] && typeof(results[0]) === 'object') { // Pass through Select2 format
                            options = results
                        }
                        else { // Key-value map
                            for (var i in results) {
                                if (results.hasOwnProperty(i)) {
                                    options.push({
                                        id: i,
                                        text: results[i],
                                    })
                                }
                            }
                        }

                        data.results = options
                        return data
                    },
                    dataType: 'json'
                }
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
                    extraOptions.closeOnSelect = true
                    extraOptions.minimumInputLength = 1

                    $element.on('select2:closing', function() {
                        if ($('.select2-dropdown.select-no-dropdown:first .select2-results__option--highlighted').length > 0) {
                            $('.select2-dropdown.select-no-dropdown:first .select2-results__option--highlighted').removeClass('select2-results__option--highlighted')
                            $('.select2-dropdown.select-no-dropdown:first .select2-results__option:first').addClass('select2-results__option--highlighted')
                        }
                    })
                }
            }

            var placeholder = $element.data('placeholder')
            if (placeholder) {
                extraOptions.placeholder = placeholder
                extraOptions.allowClear = true
            }

            $element.select2($.extend({}, selectOptions, extraOptions))
        })
    })

    $(document).on('disable', 'select.custom-select', function(event, status) {
        if ($(this).data('select2') != null) {
            $(this).select2('enable', !status)
        }
    })

})(jQuery);
