/*
 * The loading indicator.
 *
 * The load indicator DIV is injected inside its container. The container should have 
 * the relative position (use the loading-indicator-container class for it).
 *
 * Used with framework.js
 *
 * data-load-indicator="Message" - displays a load indicator with a supplied message, the element
 * must be wrapped in a `<div class="loading-indicator-container"></div>` container.
 *
 * JavaScript API:
 *
 * $('#buttons').loadIndicator({ text: 'Saving...', opaque: true }) - display the indicator in a solid (opaque) state
 * $('#buttons').loadIndicator({ centered: true }) - display the indicator aligned in the center horizontally
 * $('#buttons').loadIndicator({ size: small }) - display the indicator in small size
 * $('#buttons').loadIndicator({ text: 'Saving...' }) - display the indicator in a transparent state
 * $('#buttons').loadIndicator('hide') - display the indicator
 */
+function ($) { "use strict";

    var LoadIndicator = function (element, options) {

        this.$el = $(element)

        this.options = options || {}
        this.tally = 0
        this.show()
    }

    LoadIndicator.prototype.hide = function() {
        this.tally--

        if (this.tally <= 0) {
            $('div.loading-indicator', this.$el).remove()
            this.$el.removeClass('in-progress')
        }
    }

    LoadIndicator.prototype.show = function(options) {
        if (options)
            this.options = options

        this.hide()

        var indicator = $('<div class="loading-indicator"></div>')
        indicator.append($('<div></div>').text(this.options.text))
        indicator.append($('<span></span>'))
        if (this.options.opaque !== undefined) {
            indicator.addClass('is-opaque')
        }
        if (this.options.centered !== undefined) {
            indicator.addClass('indicator-center')
        }
        if (this.options.size === 'small') {
            indicator.addClass('size-small')
        }

        this.$el.prepend(indicator)
        this.$el.addClass('in-progress')

        this.tally++
    }

    LoadIndicator.prototype.destroy = function() {
        this.$el.removeData('oc.loadIndicator')
        this.$el = null
    }

    LoadIndicator.DEFAULTS = {
        text: ''
    }

    // LOADINDICATOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.loadIndicator

    $.fn.loadIndicator = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.loadIndicator')
            var options = $.extend({}, LoadIndicator.DEFAULTS, typeof option == 'object' && option)

            if (!data) {
                if (typeof option == 'string')
                    return;

                $this.data('oc.loadIndicator', (data = new LoadIndicator(this, options)))
            } else {
                if (typeof option !== 'string')
                    data.show(options);
                else {
                    var methodArgs = [];
                    for (var i=1; i<args.length; i++)
                        methodArgs.push(args[i])

                    data[option].apply(data, methodArgs)
                }
            }
        })
    }

    $.fn.loadIndicator.Constructor = LoadIndicator

    // LOADINDICATOR NO CONFLICT
    // =================

    $.fn.loadIndicator.noConflict = function () {
        $.fn.loadIndicator = old
        return this
    }

    // LOADINDICATOR DATA-API
    // ==============

    $(document)
        .on('ajaxPromise', '[data-load-indicator]', function() {
            var
                indicatorContainer = $(this).closest('.loading-indicator-container'),
                loadingText = $(this).data('load-indicator'),
                options = {
                    opaque: $(this).data('load-indicator-opaque'),
                    centered: $(this).data('load-indicator-centered'),
                    size: $(this).data('load-indicator-size')
                }

                if (loadingText)
                    options.text = loadingText

            indicatorContainer.loadIndicator(options)
        })
        .on('ajaxFail ajaxDone', '[data-load-indicator]', function() {
            $(this).closest('.loading-indicator-container').loadIndicator('hide')
        })


}(window.jQuery);