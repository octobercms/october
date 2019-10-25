/*
 * Creates a scrollbar in a container. 
 * 
 * Note the element must have a height set for vertical,
 * and a width set for horizontal.
 * 
 * Data attributes:
 * - data-control="scrollbar" - enables the scrollbar plugin
 *
 * JavaScript API:
 * $('#area').scrollbar()
 *
 * Dependences: 
 * - Mouse Wheel plugin (mousewheel.js)
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var Scrollbar = function (element, options) {

        var
            $el = this.$el  = $(element),
            el = $el.get(0),
            self = this,
            options = this.options = options || {},
            sizeName = this.sizeName = options.vertical ? 'height' : 'width',
            isNative = $('html').hasClass('mobile'),
            isTouch = this.isTouch = Modernizr.touchevents,
            isScrollable = this.isScrollable = false,
            isLocked = this.isLocked = false,
            eventElementName = options.vertical ? 'pageY' : 'pageX',
            dragStart = 0,
            startOffset = 0;

        $.oc.foundation.controlUtils.markDisposable(element)

        Base.call(this)

        this.$el.one('dispose-control', this.proxy(this.dispose))

        /*
         * Native (mobile) environments use overflow auto in CSS
         */
         if (isNative) {
            return
         }

        /*
         * Create Scrollbar
         */
        this.$scrollbar = $('<div />').addClass('scrollbar-scrollbar')
        this.$track = $('<div />').addClass('scrollbar-track').appendTo(this.$scrollbar)
        this.$thumb = $('<div />').addClass('scrollbar-thumb').appendTo(this.$track)

        $el
            .addClass('drag-scrollbar')
            .addClass(options.vertical ? 'vertical' : 'horizontal')
            .prepend(this.$scrollbar)

        /*
         * Bind events
         */
         if (isTouch) {
            this.$el.on('touchstart', function (event){
                var touchEvent = event.originalEvent;
                if (touchEvent.touches.length == 1) {
                    startDrag(touchEvent.touches[0])
                    event.stopPropagation()
                }
            })
         }
         else {
            this.$thumb.on('mousedown', function (event){
                startDrag(event)
            })
            this.$track.on('mouseup', function (event){
                moveDrag(event)
            })
         }

        $el.mousewheel(function (event){
            var offset = self.options.vertical
                ? ((event.deltaFactor * event.deltaY) * -1)
                : (event.deltaFactor * event.deltaX)

            return !scrollWheel(offset * self.options.scrollSpeed)
        })

        $el.on('oc.scrollbar.gotoStart', function(event){
            self.options.vertical
                ? $el.scrollTop(0)
                : $el.scrollLeft(0)

            self.update()
            event.stopPropagation()
        })

        $(window).on('resize', $.proxy(this.update, this))
        $(window).on('oc.updateUi', $.proxy(this.update, this))

         /*
          * Internal event, drag has started
          */
        function startDrag(event) {
            $('body').addClass('drag-noselect')
            $el.trigger('oc.scrollStart')

            dragStart = event[eventElementName]
            startOffset = self.options.vertical ? $el.scrollTop() : $el.scrollLeft()

            if (isTouch) {
                $(window).on('touchmove.scrollbar', function(event) {
                    var touchEvent = event.originalEvent
                    if (moveDrag(touchEvent.touches[0]))
                        event.preventDefault();
                });

                $el.on('touchend.scrollbar', stopDrag)
            }
            else {
                $(window).on('mousemove.scrollbar', function(event){
                    moveDrag(event)
                    return false
                })

                $(window).on('mouseup.scrollbar', function(){
                    stopDrag()
                    return false
                })
            }
        }

        /*
         * Internal event, drag is active
         */
        function moveDrag(event) {
            self.isLocked = true;

            var
                offset,
                dragTo = event[eventElementName]

            // Touch devices use an inverse scrolling interface
            // with a 1:1 ratio
            if (self.isTouch) {
                offset = dragStart - dragTo
            }
            // Mouse devices use a natural scrolling interface
            // with a track:canvas ratio
            else {
                var ratio = self.getCanvasSize() / self.getViewportSize()
                offset = (dragTo - dragStart) * ratio
            }

            self.options.vertical
                ? $el.scrollTop(startOffset + offset)
                : $el.scrollLeft(startOffset + offset)

            self.setThumbPosition()

            return self.options.vertical
                ? el.scrollTop != startOffset
                : el.scrollLeft != startOffset
        }

        /*
         * Internal event, drag has ended
         */
        function stopDrag() {
            $('body').removeClass('drag-noselect')
            $el.trigger('oc.scrollEnd')

            $(window).off('.scrollbar')
        }

        /*
         * Scroll wheel has moved by supplied offset
         */

        var isWebkit = $(document.documentElement).hasClass('webkit')

        function scrollWheel(offset) {
            startOffset = self.options.vertical ? el.scrollTop : el.scrollLeft
            $el.trigger('oc.scrollStart')

            self.options.vertical
                ? $el.scrollTop(startOffset + offset)
                : $el.scrollLeft(startOffset + offset)

            var scrolled = self.options.vertical
                ? el.scrollTop != startOffset
                : el.scrollLeft != startOffset

            self.setThumbPosition()
            if (!isWebkit) {
                if (self.endScrollTimeout !== undefined) {
                    clearTimeout(self.endScrollTimeout)
                    self.endScrollTimeout = undefined
                }

                self.endScrollTimeout = setTimeout(function() { 
                    $el.trigger('oc.scrollEnd')
                    self.endScrollTimeout = undefined
                }, 50)
            } else {
                $el.trigger('oc.scrollEnd')
            }

            return scrolled
        }

        /*
         * Give the DOM a second, then set the track and thumb size
         */
        setTimeout(function() { self.update() }, 1);
    }

    Scrollbar.prototype = Object.create(BaseProto)
    Scrollbar.prototype.constructor = Scrollbar

    Scrollbar.prototype.dispose = function() {
        this.unregisterHandlers()

        BaseProto.dispose.call(this)
    }

    Scrollbar.prototype.unregisterHandlers = function() {

    }

    Scrollbar.DEFAULTS = {
        vertical: true,
        scrollSpeed: 2,
        animation: true,
        start: function() {},
        drag: function() {},
        stop: function() {}
    }

    Scrollbar.prototype.update = function() {
        if (!this.$scrollbar)
            return

        this.$scrollbar.hide()
        this.setThumbSize()
        this.setThumbPosition()
        this.$scrollbar.show()
    }

    Scrollbar.prototype.setThumbSize = function() {
        var properties = this.calculateProperties()

        this.isScrollable = !(properties.thumbSizeRatio >= 1);
        this.$scrollbar.toggleClass('disabled', !this.isScrollable)

        if (this.options.vertical) {
            this.$track.height(properties.canvasSize)
            this.$thumb.height(properties.thumbSize)
        }
        else {
            this.$track.width(properties.canvasSize)
            this.$thumb.width(properties.thumbSize)
        }
    }

    Scrollbar.prototype.setThumbPosition = function() {
        var properties = this.calculateProperties()

        if (this.options.vertical)
            this.$thumb.css({top: properties.thumbPosition})
        else
            this.$thumb.css({left: properties.thumbPosition})
    }

    Scrollbar.prototype.calculateProperties = function() {

        var $el = this.$el,
            properties = {};

        properties.viewportSize = this.getViewportSize()
        properties.canvasSize = this.getCanvasSize()
        properties.scrollAmount = (this.options.vertical) ? $el.scrollTop() : $el.scrollLeft()

        properties.thumbSizeRatio = properties.viewportSize / properties.canvasSize
        properties.thumbSize = properties.viewportSize * properties.thumbSizeRatio

        properties.thumbPositionRatio = properties.scrollAmount / (properties.canvasSize - properties.viewportSize)
        properties.thumbPosition = ((properties.viewportSize - properties.thumbSize) * properties.thumbPositionRatio) + properties.scrollAmount

        if (isNaN(properties.thumbPosition))
            properties.thumbPosition = 0

        return properties;
    }

    Scrollbar.prototype.getViewportSize = function() {
        return (this.options.vertical)
            ? this.$el.height()
            : this.$el.width();
    }

    Scrollbar.prototype.getCanvasSize = function() {
        return (this.options.vertical)
            ? this.$el.get(0).scrollHeight
            : this.$el.get(0).scrollWidth;
    }

    Scrollbar.prototype.gotoElement = function(element, callback) {
        var $el = $(element)
        if (!$el.length)
            return;

        var self = this,
            offset = 0,
            animated = false,
            params = {
                duration: 300, 
                queue: false, 
                complete: function(){
                    if (callback !== undefined)
                        callback()
                }
            }

        if (!this.options.vertical) {
            offset = $el.get(0).offsetLeft - this.$el.scrollLeft()

            if (offset < 0) {
                this.$el.animate({'scrollLeft': $el.get(0).offsetLeft}, params)
                animated = true
            } else {
                offset = $el.get(0).offsetLeft + $el.outerWidth() - (this.$el.scrollLeft() + this.$el.outerWidth())
                if (offset > 0) {
                    this.$el.animate({'scrollLeft': $el.get(0).offsetLeft + $el.outerWidth() - this.$el.outerWidth()}, params)
                    animated = true
                }
            }
        } else {
            offset = $el.get(0).offsetTop - this.$el.scrollTop()

            if (this.options.animation) {
                if (offset < 0) {
                    this.$el.animate({'scrollTop': $el.get(0).offsetTop}, params)
                    animated = true
                } else {
                    offset = $el.get(0).offsetTop - (this.$el.scrollTop() + this.$el.outerHeight())
                    if (offset > 0) {
                        this.$el.animate({'scrollTop': $el.get(0).offsetTop + $el.outerHeight() - this.$el.outerHeight()}, params)
                        animated = true
                    }
                }
            } else {
                if (offset < 0) {
                    this.$el.scrollTop($el.get(0).offsetTop)
                } else {
                    offset = $el.get(0).offsetTop - (this.$el.scrollTop() + this.$el.outerHeight())
                    if (offset > 0)
                        this.$el.scrollTop($el.get(0).offsetTop + $el.outerHeight() - this.$el.outerHeight())
                }
            }
        }

        if (!animated && callback !== undefined)
            callback()

        return this
    }

    Scrollbar.prototype.dispose = function() {
        this.$el = null
        this.$scrollbar = null
        this.$track = null
        this.$thumb = null
    }

    // SCROLLBAR PLUGIN DEFINITION
    // ============================

    var old = $.fn.scrollbar

    $.fn.scrollbar = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.scrollbar')
            var options = $.extend({}, Scrollbar.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.scrollbar', (data = new Scrollbar(this, options)))
            if (typeof option == 'string') data[option].call($this)
        })
      }

    $.fn.scrollbar.Constructor = Scrollbar

    // SCROLLBAR NO CONFLICT
    // =================

    $.fn.scrollbar.noConflict = function () {
        $.fn.scrollbar = old
        return this
    }

    // SCROLLBAR DATA-API
    // ===============
    $(document).render(function(){
        $('[data-control=scrollbar]').scrollbar()
    })

}(window.jQuery);