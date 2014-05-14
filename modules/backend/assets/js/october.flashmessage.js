/*
 * The flash message. 
 * 
 * The default hide interval is 2 seconds. The interval option is not required.
 *
 * Data attributes API:
 * <p data-control="flash-message" class="success" data-interval="5">The record has been successfully saved.</p>
 *
 * JavaScript API:
 * $.oc.flashMsg({text: 'The record has been successfully saved.', 'class': 'success', 'interval': 3})
 */
+function ($) { "use strict";

    var FlashMessage = function (options, el) {
        var 
            options = $.extend({}, FlashMessage.DEFAULTS, options),
            $element = $(el);

        $('body > p.flash-message').remove()

        if ($element.length == 0)
            $element = $('<p/>').addClass(options.class).html(options.text)

        $element.addClass('flash-message')
        $element.attr('data-control', null)
        $element.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>')
        $element.on('click', 'button', remove)

        $(document.body).append($element);

        var timer = window.setTimeout(remove, options.interval*1000)

        function remove() {
            window.clearInterval(timer)
            $element.animate({'opacity': 0}, {
                duration: 200, 
                queue: false, 
                complete: function() {
                    $element.remove();
                }
            })
        }
    }

    FlashMessage.DEFAULTS = {
        class: 'success',
        text: 'Default text',
        interval: 2
    }

    // FLASH MESSAGE PLUGIN DEFINITION
    // ============================

    if ($.oc === undefined)
        $.oc = {}
    
    $.oc.flashMsg = FlashMessage 

    // FLASH MESSAGE DATA-API
    // ===============

    $(document).render(function(){
        $('[data-control=flash-message]').each(function(){
            $.oc.flashMsg($(this).data(), this)
        })
    })

}(window.jQuery);