/*
 * Base class for OctoberCMS back-end classes.
 *
 * The class defines base functionality for dealing with memory management
 * and cleaning up bound (proxied) methods.
 *
 * The base class defines the dispose method that cleans up proxied methods. 
 * If child classes implement their own dispose() method, they should call 
 * the base class dispose method (see the example below).
 *
 * Use the simple parasitic combination inheritance pattern to create child classes:
 * 
 * var Base = $.oc.foundation.base,
 *     BaseProto = Base.prototype
 *
 * var SubClass = function(params) {
 *     // Call the parent constructor
 *     Base.call(this)
 * }
 *
 * SubClass.prototype = Object.create(BaseProto)
 * SubClass.prototype.constructor = SubClass
 *
 * // Child class methods can be defined only after the 
 * // prototype is updated in the two previous lines
 *
 * SubClass.prototype.dispose = function() {
 *     // Call the parent method
 *     BaseProto.dispose.call(this)
 * };
 *
 * See: 
 *
 * - https://developers.google.com/speed/articles/optimizing-javascript
 * - http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var Base = function() {
        this.proxiedMethods = []

        this.proxyCounter = 0
    }

    Base.prototype.dispose = function()
    {
        for (var index in this.proxiedMethods)
            this.proxiedMethods[index] = null

        this.proxiedMethods = null
    }

    /*
     * Creates a proxied method reference or returns an existing proxied method.
     */
    Base.prototype.proxy = function(method) {
        if (method.ocProxyId !== undefined) {
            if (this.proxiedMethods[method.ocProxyId] === undefined)
                throw new Error('Proxied method is not found in the proxy method scope.')

            return this.proxiedMethods[method.ocProxyId]
        }

        this.proxyCounter++
        method.ocProxyId = this.proxyCounter
        this.proxiedMethods[method.ocProxyId] = method.bind(this)

        return this.proxiedMethods[method.ocProxyId]
    }

    $.oc.foundation.base = Base;
}(window.jQuery);