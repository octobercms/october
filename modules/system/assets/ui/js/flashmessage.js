/*
=require ../vendor/bootstrap/js/transition.js
*/

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
            $element = $(el)

        $('body > p.flash-message').remove()

        if ($element.length == 0)
            $element = $('<p/>').addClass(options.class).html(options.text)

        $element.addClass('flash-message fade')
        $element.attr('data-control', null)
        $element.append('<button type="button" class="close" aria-hidden="true">&times;</button>')
        $element.on('click', 'button', remove)
        $element.on('click', remove)

        $(document.body).append($element)

        setTimeout(function(){
            $element.addClass('in')
        }, 1)

        var timer = window.setTimeout(remove, options.interval*1000)

        function removeElement() {
            $element.remove()
        }

        function remove() {
            window.clearInterval(timer)

            $element.removeClass('in')
            $.support.transition && $element.hasClass('fade') ?
                $element
                    .one($.support.transition.end, removeElement)
                    .emulateTransitionEnd(500) :
                removeElement()
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