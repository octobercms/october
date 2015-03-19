/*
 * Base class for OctoberCMS back-end classes.
 *
 * The class defines base functionality for dealing with memory management
 * and cleaning up bound (proxied) methods, references to the DOM elements
 * and timers.
 *
 * The class should be used as a parent class for JavaScript classes that
 * handle DOM events and require binding and unbinding methods to the events.
 * That is especially important for classes that should free the memory during
 * a single page execution.
 *
 * The base class defines the dispose method that cleans up references to the DOM
 * elements and proxied methods. If child classes implement their own dispose()
 * method, they should call the base class dispose method (see the example below).
 *
 * Use the simple parasitic combination inheritance pattern to create child classes:
 * 
 * var Base = $.oc.foundation.base,
 *     BaseProto = Base.prototype
 *
 * var SubClass = function(params) {
 *     // Call the parent constructor
 *     Base.call()
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
        this.domReferences = []
        this.timers = []
    }

    Base.prototype.dispose = function()
    {
        for (var proxyName in this.proxiedMethods)
            this.proxiedMethods[proxyName] = null

        for (var domReference in this.domReferences)
            this.domReferences[domReference] = null

        for (var timer in this.timers) {
            clearTimeout(this.timers[timer])
            this.timers[timer] = null
        }
    }

    /*
     * Creates a proxied method reference or returns an existing proxied method.
     */
    Base.prototype.proxyMethod = function(method, proxyName) {
        if (this.proxiedMethods[proxyName] === undefined)
            return this.proxiedMethods[proxyName] = method.bind(this)

        return this.proxiedMethods[proxyName]
    }

    Base.prototype.setTimeout = function(timerName, method, delay) {
        this.clearTimeout(timerName)

        this.timers[timerName] = setTimeout(method, delay)
    }

    Base.prototype.clearTimeout = function(timerName) {
        if (this.timers[timerName] !== undefined) {
            clearTimeout(this.timers[timerName])
            this.timers[timerName] = null
        }
    }

    $.oc.foundation.base = Base;
}(window.jQuery);