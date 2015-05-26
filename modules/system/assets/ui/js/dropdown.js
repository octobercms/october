/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle=dropdown]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)

            $this.focus()
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27)/.test(e.keyCode)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).focus()
            return $this.click()
        }

        var desc = ' li:not(.divider):visible a'
        var $items = $parent.find('[role=menu]' + desc + ', [role=listbox]' + desc)

        if (!$items.length) return

        var index = $items.index($items.filter(':focus'))

        if (e.keyCode == 38 && index > 0)                 index--                        // up
        if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
        if (!~index)                                      index = 0

        $items.eq(index).focus()
    }

    function clearMenus(e) {
        $(backdrop).remove()
        $(toggle).each(function () {
            var $parent = getParent($(this))
            var relatedTarget = { relatedTarget: this }
            if (!$parent.hasClass('open')) return
            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
            if (e.isDefaultPrevented()) return
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    var old = $.fn.dropdown

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu], [role=listbox]', Dropdown.prototype.keydown)

}(jQuery);



/*
 * Dropdown menus. 
 *
 * This script customizes the Twitter Bootstrap drop-downs.
 *
 */
+function ($) { "use strict";

    $(document).on('shown.bs.dropdown', '.dropdown', function(){
        $(document.body).addClass('dropdown-open')

        var dropdown = $('.dropdown-menu', this),
            dropdownContainer = $(this).data('dropdown-container')

        if ($('.dropdown-container', dropdown).length == 0) {
            var 
                title = $('[data-toggle=dropdown]', this).text(),
                titleAttr = dropdown.data('dropdown-title'),
                timer = null;

            if (titleAttr !== undefined)
                title = titleAttr

            $('li:first-child', dropdown).addClass('first-item')
            dropdown.prepend($('<li/>').addClass('dropdown-title').text(title))

            var 
                container = $('<li/>').addClass('dropdown-container'),
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
            } else
                dropdown.removeClass('top')

            dropdown.css({
                'left': position.x + leftOffset,
                'top': position.y,
                'visibility': 'visible'
            })
        }

        if ($('.dropdown-overlay', document.body).length == 0)
            $(document.body).prepend($('<div/>').addClass('dropdown-overlay'));
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