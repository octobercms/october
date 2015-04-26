/*
 * October JavaScript foundation library.
 * 
 * Utility functions for working back-end client-side UI controls.
 *
 * Usage examples:
 *
 * $.oc.foundation.controlUtils.markDisposable(el)
 * $.oc.foundation.controlUtils.disposeControls(container)
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var ControlUtils = {
        markDisposable: function(el) {
            el.setAttribute('data-disposable', '')
        },

        /*
         * Destroys all disposable controls in a container.
         * The disposable controls should watch the dispose-control 
         * event.
         */
        disposeControls: function(container) {
            var controls = container.querySelectorAll('[data-disposable]')

            for (var i=0, len=controls.length; i<len; i++) {
                $(controls[i]).triggerHandler('dispose-control')
            }
        }
    }

    $.oc.foundation.controlUtils = ControlUtils;
}(window.jQuery);