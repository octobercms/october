/*
 * The loading indicator for the mouse cursor.
 *
 * Displays the animated loading indicator following the mouse cursor.
 *
 * JavaScript API:
 * $.oc.cursorLoadIndicator.show(event)
 * $.oc.cursorLoadIndicator.hide()
 *
 * By default if the show() method has been called several times, the hide() method should be
 * called the same number of times in order to hide the cursor. Use hide(true) to hide the 
 * indicator forcibly.
 *
 * The event parameter in the show() method is optional. If it is passed, the initial cursor position
 * will be loaded from it.
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    var CursorLoadIndicator = function () {
        if (Modernizr.touch)
            return

        this.counter = 0
        this.indicator = $('<div/>').addClass('cursor-loading-indicator').addClass('hide')
        $(document.body).append(this.indicator)
    }

    CursorLoadIndicator.prototype.show = function(event) {
        if (Modernizr.touch)
            return

        this.counter++

        if (this.counter > 1)
            return

        var self = this,
            $window = $(window);


        if (event !== undefined && event.clientY !== undefined) {
            self.indicator.css({
                left: event.clientX + 15,
                top: event.clientY + 15
            })
        }

        this.indicator.removeClass('hide')
        $(window).on('mousemove.cursorLoadIndicator', function(e){
            self.indicator.css({
                left: e.clientX + 15,
                top: e.clientY + 15,
            })
        })
    }

    CursorLoadIndicator.prototype.hide = function(force) {
        if (Modernizr.touch)
            return

        this.counter--
        if (force !== undefined && force)
            this.counter = 0

        if (this.counter <= 0) {
            this.indicator.addClass('hide')
            $(window).off('.cursorLoadIndicator');
        }
    }

    $(document).ready(function(){
        $.oc.cursorLoadIndicator = new CursorLoadIndicator();
    })

    // CURSORLOADINDICATOR DATA-API
    // ==============
    
    $(document)
        .on('ajaxPromise', '[data-cursor-load-indicator]', function() {
            $.oc.cursorLoadIndicator.show()
        }).on('ajaxFail ajaxDone', '[data-cursor-load-indicator]', function() {
            $.oc.cursorLoadIndicator.hide()
        })

}(window.jQuery);