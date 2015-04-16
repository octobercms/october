/*
 * ScrollPad plugin.
 *
 * This plugin creates a scrollable area with features similar (but more limited) 
 * to october.scrollbar.js, with virtual scroll bars. This plugin is more lightweight 
 * in terms of calculations and more responsive. It doesn't use scripting for scrolling,
 * instead it uses the native scrolling and listens for the onscroll event to update 
 * the virtual scroll bars.
 *
 * The plugin is partially based on Trackpad Scroll Emulator 
 * https://github.com/jnicol/trackpad-scroll-emulator, cleaned up for the better CPU and
 * memory (DOM references) management.
 *
 * Expected markup:
 * <div class="control-scrollpad" data-control="scrollpad" data-direction="vertical">
 *     <div>
 *         <div>
 *             The content goes here. The two wrapping 
 *             DIV elements are required.
 *         </div>
 *     </div>
 * </div>
 * 
 * Data attributes:
 * - data-control="scrollpad" - enables the plugin.
 * - data-direction="vertical|horizontal" - sets the scrolling direction.
 *
 * JavaScript API:
 * $('#area').scrollpad({direction: 'vertical'})
 * $('#area').scrollpad('dispose')
 * $('#area').scrollpad('scrollToStart')
 *
 * TODO: In FireFox the control in the horizontal mode displays the native scrollbars,
 * because negative margin-bottom in the scrollable element doesn't work for some reason.
 * Try to align the scrollable element with absolute positioning (negative right and bottom)
 * instead of negative margins.
 *
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // SCROLLPAD CLASS DEFINITION
    // ============================

    var Scrollpad = function(element, options) {
        this.$el = $(element)
        this.scrollbarElement = null
        this.dragHandleElement = null
        this.scrollContentElement = null
        this.contentElement = null
        this.options = options
        this.scrollbarSize = null
        this.updateScrollbarTimer = null
        this.dragOffset = null

        Base.call(this)

        //
        // Initialization
        //

        this.init()
    }

    Scrollpad.prototype = Object.create(BaseProto)
    Scrollpad.prototype.constructor = Scrollpad

    Scrollpad.prototype.dispose = function() {
        this.unregisterHandlers()

        this.$el.get(0).removeChild(this.scrollbarElement)
        this.$el.removeData('oc.scrollpad')
        this.$el = null

        this.scrollbarElement = null
        this.dragHandleElement = null
        this.scrollContentElement = null
        this.contentElement = null

        BaseProto.dispose.call(this)
    }

    Scrollpad.prototype.scrollToStart = function() {
        var scrollAttr = this.options.direction == 'vertical' ? 'scrollTop' : 'scrollLeft'
        this.scrollContentElement[scrollAttr] = 0
    }

    Scrollpad.prototype.update = function() {
        this.updateScrollbarSize()
    }

    // SCROLLPAD INTERNAL METHODS
    // ============================

    Scrollpad.prototype.init = function() {
        this.build()
        this.setScrollContentSize()
        this.registerHandlers()
    }

    Scrollpad.prototype.build = function() {
        var el = this.$el.get(0)

        this.scrollContentElement = el.children[0]
        this.contentElement = this.scrollContentElement.children[0]
        this.$el.prepend('<div class="scrollpad-scrollbar"><div class="drag-handle"></div></div>')
        this.scrollbarElement = el.querySelector('.scrollpad-scrollbar')
        this.dragHandleElement = el.querySelector('.scrollpad-scrollbar > .drag-handle')
    }

    Scrollpad.prototype.registerHandlers = function() {
        this.$el.on('mouseenter', this.proxy(this.onMouseEnter))
        this.$el.on('mouseleave', this.proxy(this.onMouseLeave))
        this.scrollContentElement.addEventListener('scroll', this.proxy(this.onScroll))
        this.dragHandleElement.addEventListener('mousedown', this.proxy(this.onStartDrag))
    }

    Scrollpad.prototype.unregisterHandlers = function() {
        this.$el.off('mouseenter', this.proxy(this.onMouseEnter))
        this.$el.off('mouseleave', this.proxy(this.onMouseLeave))
        this.scrollContentElement.removeEventListener('scroll', this.proxy(this.onScroll))
        this.dragHandleElement.removeEventListener('mousedown', this.proxy(this.onStartDrag))

        document.removeEventListener('mousemove', this.proxy(this.onMouseMove))
        document.removeEventListener('mouseup', this.proxy(this.onEndDrag))
    }

    Scrollpad.prototype.setScrollContentSize = function() {
        var scrollbarSize = this.getScrollbarSize()

        if (this.options.direction == 'vertical')
            this.scrollContentElement.setAttribute('style', 'margin-right: -' + scrollbarSize + 'px')
        else
            this.scrollContentElement.setAttribute('style', 'margin-bottom: -' + scrollbarSize + 'px')
    }

    Scrollpad.prototype.getScrollbarSize = function() {
        if (this.scrollbarSize !== null)
            return this.scrollbarSize

        var testerElement = document.createElement('div')
        testerElement.setAttribute('class', 'scrollpad-scrollbar-size-tester')
        testerElement.appendChild(document.createElement('div'))

        document.body.appendChild(testerElement)

        var width = testerElement.offsetWidth,
            innerWidth = testerElement.querySelector('div').offsetWidth

        document.body.removeChild(testerElement)

        // Some magic for FireFox, see 
        // https://github.com/jnicol/trackpad-scroll-emulator/blob/master/jquery.trackpad-scroll-emulator.js
        if (width === innerWidth && navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            return this.scrollbarSize = 17

        return this.scrollbarSize = width - innerWidth
    }

    Scrollpad.prototype.updateScrollbarSize = function() {
        this.scrollbarElement.removeAttribute('data-hidden')

        var contentSize = this.options.direction == 'vertical' ? this.contentElement.scrollHeight : this.contentElement.scrollWidth,
            scrollOffset = this.options.direction == 'vertical' ? this.scrollContentElement.scrollTop : this.scrollContentElement.scrollLeft,
            scrollbarSize = this.options.direction == 'vertical' ? this.scrollbarElement.offsetHeight : this.scrollbarElement.offsetWidth,
            scrollbarRatio = scrollbarSize / contentSize,
            handleOffset = Math.round(scrollbarRatio * scrollOffset) + 2,
            handleSize = Math.floor(scrollbarRatio * (scrollbarSize - 2)) - 2;

        if (scrollbarSize < contentSize) {
            if (this.options.direction == 'vertical')
                this.dragHandleElement.setAttribute('style', 'top: ' + handleOffset + 'px; height: ' + handleSize + 'px')
            else
                this.dragHandleElement.setAttribute('style', 'left: ' + handleOffset + 'px; width: ' + handleSize + 'px')

            this.scrollbarElement.removeAttribute('data-hidden')
        }
        else
            this.scrollbarElement.setAttribute('data-hidden', true)
    }

    Scrollpad.prototype.displayScrollbar = function() {
        this.clearUpdateScrollbarTimer()

        this.updateScrollbarSize()
        this.scrollbarElement.setAttribute('data-visible', 'true')
    }

    Scrollpad.prototype.hideScrollbar = function() {
        this.scrollbarElement.removeAttribute('data-visible')
    }

    Scrollpad.prototype.clearUpdateScrollbarTimer = function() {
        if (this.updateScrollbarTimer === null)
            return

        clearTimeout(this.updateScrollbarTimer)
        this.updateScrollbarTimer = null
    }

    // EVENT HANDLERS
    // ============================

    Scrollpad.prototype.onMouseEnter = function() {
        this.displayScrollbar()
    }

    Scrollpad.prototype.onMouseLeave = function() {
        this.hideScrollbar()
    }

    Scrollpad.prototype.onScroll = function() {
        if (this.updateScrollbarTimer !== null)
            return

        this.updateScrollbarTimer = setTimeout(this.proxy(this.displayScrollbar), 10) 
    }

    Scrollpad.prototype.onStartDrag = function(ev) {
        $.oc.foundation.event.stop(ev)
        
        var pageCoords = $.oc.foundation.event.pageCoordinates(ev),
            eventOffset = this.options.direction == 'vertical' ? pageCoords.y : pageCoords.x,
            handleCoords = $.oc.foundation.element.absolutePosition(this.dragHandleElement),
            handleOffset = this.options.direction == 'vertical' ? handleCoords.top : handleCoords.left

        this.dragOffset = eventOffset - handleOffset

        document.addEventListener('mousemove', this.proxy(this.onMouseMove))
        document.addEventListener('mouseup', this.proxy(this.onEndDrag))
    }

    Scrollpad.prototype.onMouseMove = function(ev) {
        $.oc.foundation.event.stop(ev)

        var eventCoordsAttr = this.options.direction == 'vertical' ? 'y' : 'x',
            elementCoordsAttr = this.options.direction == 'vertical' ? 'top' : 'left',
            offsetAttr = this.options.direction == 'vertical' ? 'offsetHeight' : 'offsetWidth',
            scrollAttr = this.options.direction == 'vertical' ? 'scrollTop' : 'scrollLeft'

        var eventOffset = $.oc.foundation.event.pageCoordinates(ev)[eventCoordsAttr],
            scrollbarOffset = $.oc.foundation.element.absolutePosition(this.scrollbarElement)[elementCoordsAttr],
            dragPos = eventOffset - scrollbarOffset - this.dragOffset,
            scrollbarSize = this.scrollbarElement[offsetAttr],
            contentSize = this.contentElement[offsetAttr],
            dragPerc = dragPos / scrollbarSize

        if (dragPerc > 1)
            dragPerc = 1

        var scrollPos = dragPerc * contentSize;

        this.scrollContentElement[scrollAttr] = scrollPos
    }
    
    Scrollpad.prototype.onEndDrag = function(ev) {
        document.removeEventListener('mousemove', this.proxy(this.onMouseMove))
        document.removeEventListener('mouseup', this.proxy(this.onEndDrag))
    }

    // SCROLLPAD PLUGIN DEFINITION
    // ============================

    Scrollpad.DEFAULTS = {
        direction: 'vertical'
    }

    var old = $.fn.scrollpad

    $.fn.scrollpad = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), 
            result = undefined

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.scrollpad')
            var options = $.extend({}, Scrollpad.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.scrollpad', (data = new Scrollpad(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.scrollpad.Constructor = Scrollpad

    // SCROLLPAD NO CONFLICT
    // =================

    $.fn.scrollpad.noConflict = function () {
        $.fn.scrollpad = old
        return this
    }

    // SCROLLPAD DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control=scrollpad]').scrollpad()
    })
}(window.jQuery);