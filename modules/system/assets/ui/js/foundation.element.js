/*
 * October JavaScript foundation library.
 * 
 * Light-weight utility functions for working with DOM elements. The functions
 * work with elements directly, without jQuery, using the native JavaScript and DOM
 * features.
 *
 * Usage examples:
 *
 * $.oc.foundation.element.addClass(myElement, myClass)
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var Element = {
        hasClass: function(el, className) {
            if (el.classList)
                return el.classList.contains(className);
            
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        },

        addClass: function(el, className) {
            var classes = className.split(' ')

            for (var i = 0, len = classes.length; i < len; i++) {
                var currentClass = classes[i].trim()

                if (this.hasClass(el, currentClass))
                    return

                if (el.classList)
                    el.classList.add(currentClass);
                else
                    el.className += ' ' + currentClass;
            }
        },

        removeClass: function(el, className) {
            if (el.classList)
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },

        toggleClass: function(el, className, add) {
            if (add === undefined) {
                if (this.hasClass(el, className)) {
                    this.removeClass(el, className)
                }
                else {
                    this.addClass(el, className)
                }
            }

            if (add && !this.hasClass(el, className)) {
                this.addClass(el, className)
                return
            }

            if (!add && this.hasClass(el, className)) {
                this.removeClass(el, className)
                return
            }
        },

        /*
         * Returns element absolution position.
         * If the second parameter value is false, the scrolling
         * won't be added to the result (which could improve the performance).
         */
        absolutePosition: function(element, ignoreScrolling) {
            var top = ignoreScrolling === true ? 0 : document.body.scrollTop,
                left = 0

            do {
                top += element.offsetTop || 0;

                if (ignoreScrolling !== true)
                    top -= element.scrollTop || 0

                left += element.offsetLeft || 0
                element = element.offsetParent
            } while(element)

            return {
                top: top,
                left: left
            }
        },

        getCaretPosition: function(input) {
            if (document.selection) { 
               var selection = document.selection.createRange()

               selection.moveStart('character', -input.value.length)
               return selection.text.length
            }

            if (input.selectionStart !== undefined)
               return input.selectionStart

            return 0
        },

        setCaretPosition: function(input, position) {
            if (document.selection) { 
                var range = input.createTextRange()

                setTimeout(function() {
                    // Asynchronous layout update, better performance
                    range.collapse(true)
                    range.moveStart("character", position)
                    range.moveEnd("character", 0)
                    range.select()
                    range = null
                    input = null
                }, 0)
            }

            if (input.selectionStart !== undefined) {
                setTimeout(function() {
                    // Asynchronous layout update
                    input.selectionStart = position
                    input.selectionEnd = position
                    input = null
                }, 0)
            }
        },

        elementContainsPoint: function(element, point) {
            var elementPosition = $.oc.foundation.element.absolutePosition(element),
                elementRight = elementPosition.left + element.offsetWidth,
                elementBottom = elementPosition.top + element.offsetHeight

            return point.x >= elementPosition.left && point.x <= elementRight 
                    && point.y >= elementPosition.top && point.y <= elementBottom
        }
    }

    $.oc.foundation.element = Element;
}(window.jQuery);