/*
=require ../vendor/bootstrap/js/dropdown.js
*/
/*
 * Dropdown menus.
 *
 * This script customizes the Twitter Bootstrap drop-downs.
 *
 */
+function ($) { "use strict";

    $(document).on('shown.bs.dropdown', '.dropdown', function() {
        $(document.body).addClass('dropdown-open')

        var dropdown = $('.dropdown-menu', this),
            dropdownContainer = $(this).data('dropdown-container')

        if ($('.dropdown-container', dropdown).length == 0) {

            var title = $('[data-toggle=dropdown]', this).text(),
                titleAttr = dropdown.data('dropdown-title'),
                timer = null

            if (titleAttr !== undefined)
                title = titleAttr

            $('li:first-child', dropdown).addClass('first-item')
            dropdown.prepend($('<li/>').addClass('dropdown-title').text(title))

            var container = $('<li/>').addClass('dropdown-container'),
                ul = $('<ul/>')

            container.prepend(ul)
            ul.prepend(dropdown.children())
            dropdown.prepend(container)

            dropdown.on('touchstart', function(){
                window.setTimeout(function(){
                    dropdown.addClass('scroll')
                }, 200)
            })

            dropdown.on('touchend', function(){
                window.setTimeout(function(){
                    dropdown.removeClass('scroll')
                }, 200)
            })

            dropdown.on('click', 'a', function(){
                if (dropdown.hasClass('scroll'))
                    return false
            })
        }

        if (dropdownContainer !== undefined && dropdownContainer == 'body') {
            $(this).data('oc.dropdown', dropdown)
            $(document.body).append(dropdown)

            dropdown.css({
                'visibility': 'hidden',
                'left': 0,
                'top' : 0,
                'display': 'block'
            })

            var targetOffset = $(this).offset(),
                targetHeight = $(this).height(),
                targetWidth = $(this).width(),
                position = {
                    x: targetOffset.left,
                    y: targetOffset.top + targetHeight
                },
                leftOffset = targetWidth < 30 ? -16 : 0,
                documentHeight = $(document).height(),
                dropdownHeight = dropdown.height()

            if ((dropdownHeight + position.y) > $(document).height()) {
                position.y = targetOffset.top - dropdownHeight - 12
                dropdown.addClass('top')
            }
            else {
                dropdown.removeClass('top')
            }

            dropdown.css({
                'left': position.x + leftOffset,
                'top': position.y,
                'visibility': 'visible'
            })
        }

        if ($('.dropdown-overlay', document.body).length == 0) {
            $(document.body).prepend($('<div/>').addClass('dropdown-overlay'));
        }
    })

    $(document).on('hidden.bs.dropdown', '.dropdown', function(){
        var dropdown = $(this).data('oc.dropdown')
        if (dropdown !== undefined) {
            dropdown.css('display', 'none')
            $(this).append(dropdown)
        }

        $(document.body).removeClass('dropdown-open');
    })

}(window.jQuery);